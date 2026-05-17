import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { sendError } from "../utils/http";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { signJwt } from "../services/authService";

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
  const user = await User.create({ email, name, passwordHash });
  const token = signJwt(user.id, user.email);

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, credits: user.credits }
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payload");
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendError(res, 401, "Invalid credentials");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return sendError(res, 401, "Invalid credentials");
  }

  const token = signJwt(user.id, user.email);
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, credits: user.credits }
  });
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?.userId).select("email name credits createdAt updatedAt");
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  return res.json({ user });
});

export default router;
