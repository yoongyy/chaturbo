import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { User } from "../models/User";
import { sendError } from "../utils/http";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { signJwt } from "../services/authService";
import { getEnv } from "../config/env";
import { AgentCredential } from "../models/AgentCredential";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(8)
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payload");
  }

  const { email, name, password } = parsed.data;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return sendError(res, 409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash, role: "member" });
  const token = signJwt(user.id, user.email, user.role, user.ownerUid);

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
      creditsPurchased: user.creditsPurchased,
      creditsEarned: user.creditsEarned,
      ownerUid: user.ownerUid
    }
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return user;
}

function serializeAuthUser(user: {
  id?: string;
  _id?: unknown;
  email: string;
  name?: string;
  role: "admin" | "member";
  credits: number;
  creditsPurchased: number;
  creditsEarned: number;
  ownerUid: string;
}) {
  const userId = user.id || String(user._id || "");
  const token = signJwt(userId, user.email, user.role, user.ownerUid);

  return {
    token,
    user: {
      id: userId,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
      creditsPurchased: user.creditsPurchased,
      creditsEarned: user.creditsEarned,
      ownerUid: user.ownerUid
    }
  };
}

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payload");
  }

  const { email, password } = parsed.data;
  const user = await authenticateUser(email, password);
  if (!user) {
    return sendError(res, 401, "Invalid credentials");
  }

  if (user.role === "admin") {
    return sendError(res, 403, "Use the admin login for internal accounts");
  }

  return res.json(serializeAuthUser(user));
});

router.post("/admin-login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payload");
  }

  const { email, password } = parsed.data;
  const user = await authenticateUser(email, password);
  if (!user) {
    return sendError(res, 401, "Invalid credentials");
  }

  if (user.role !== "admin") {
    return sendError(res, 403, "Use the owner login for customer accounts");
  }

  return res.json(serializeAuthUser(user));
});

const oauthCallbackSchema = z.object({
  provider: z.enum(["google", "facebook"]),
  code: z.string().min(1),
  redirectUri: z.string().url(),
  clientId: z.string().optional()
});

interface SocialProfile {
  email: string;
  name: string;
}

async function upsertSocialUser(profile: SocialProfile) {
  const existing = await User.findOne({ email: profile.email.toLowerCase() });
  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(`oauth-${Date.now()}-${Math.random()}`, 10);
  return User.create({
    email: profile.email.toLowerCase(),
    name: profile.name,
    passwordHash,
    role: "member"
  });
}

async function exchangeGoogleCode(code: string, redirectUri: string, payloadClientId?: string): Promise<SocialProfile> {
  const env = getEnv();
  const clientId = payloadClientId || env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!tokenRes.ok) {
    throw new Error("Failed to exchange Google authorization code");
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("Google did not return an access token");
  }

  const profileRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
  if (!profileRes.ok) {
    throw new Error("Failed to fetch Google profile");
  }

  const profile = (await profileRes.json()) as { email?: string; name?: string };
  if (!profile.email) {
    throw new Error("Google account email is required");
  }

  return {
    email: profile.email,
    name: profile.name || "Google User"
  };
}

async function exchangeFacebookCode(code: string, redirectUri: string): Promise<SocialProfile> {
  const env = getEnv();
  const appId = env.FACEBOOK_APP_ID;
  const appSecret = env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Facebook OAuth is not configured");
  }

  const tokenParams = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code
  });

  const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`);
  if (!tokenRes.ok) {
    throw new Error("Failed to exchange Facebook authorization code");
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error("Facebook did not return an access token");
  }

  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`
  );
  if (!profileRes.ok) {
    throw new Error("Failed to fetch Facebook profile");
  }

  const profile = (await profileRes.json()) as { id?: string; email?: string; name?: string };
  if (!profile.id) {
    throw new Error("Facebook profile is missing id");
  }

  const email = profile.email || `facebook_${profile.id}@users.chaturbo.local`;
  return {
    email,
    name: profile.name || "Facebook User"
  };
}

router.post("/oauth/callback", async (req, res) => {
  const parsed = oauthCallbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid OAuth payload");
  }

  const { provider, code, redirectUri, clientId } = parsed.data;

  try {
    const profile =
      provider === "google"
        ? await exchangeGoogleCode(code, redirectUri, clientId)
        : await exchangeFacebookCode(code, redirectUri);

    const user = await upsertSocialUser(profile);
    const token = signJwt(user.id, user.email, user.role, user.ownerUid);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
        creditsPurchased: user.creditsPurchased,
        creditsEarned: user.creditsEarned,
        ownerUid: user.ownerUid
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth login failed";
    return sendError(res, 400, message);
  }
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?.userId).select(
    "email name role credits creditsPurchased creditsEarned ownerUid createdAt updatedAt"
  );
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  return res.json({ user });
});

const pairAgentSchema = z.object({
  name: z.string().min(1).max(80).default("local-agent")
});

router.post("/agent/pair", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = pairAgentSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payload");
  }

  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  const rawSecret = `cs_${crypto.randomBytes(24).toString("base64url")}`;
  const secretHash = await bcrypt.hash(rawSecret, 10);

  const credential = await AgentCredential.create({
    ownerId: owner._id,
    ownerUid: owner.ownerUid,
    name: parsed.data.name,
    secretHash,
    active: true
  });

  return res.status(201).json({
    agent: {
      id: credential.id,
      name: credential.name,
      ownerUid: owner.ownerUid,
      createdAt: credential.createdAt
    },
    credentials: {
      ownerUid: owner.ownerUid,
      agentSecret: rawSecret
    }
  });
});

router.get("/agent/credentials", requireAuth, async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("ownerUid");
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  const credentials = await AgentCredential.find({ ownerId: owner._id })
    .select("name active lastUsedAt createdAt updatedAt")
    .sort({ createdAt: -1 });

  return res.json({
    ownerUid: owner.ownerUid,
    credentials
  });
});

export default router;
