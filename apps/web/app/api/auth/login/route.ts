import { NextResponse } from "next/server";
import { findDemoUser } from "../../../../lib/demoDataStore";
import { signJwt } from "../../../../lib/jwt";

const DEFAULT_EMAIL = "demo@chaturbo.local";
const DEFAULT_PASSWORD = "password123";
const DEFAULT_NAME = "Demo Admin";
const DEFAULT_SECRET = "dev-secret-chaturbo-lead-rescue";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === "string" ? String((body as { email: string }).email).trim().toLowerCase() : "";
  const password = typeof (body as { password?: unknown })?.password === "string" ? String((body as { password: string }).password) : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const allowedEmail = (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase();
  const allowedPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  const demoUser = findDemoUser(email, password);

  if (!demoUser && (email !== allowedEmail || password !== allowedPassword)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const userId = demoUser?.id || `web_${email.replace(/[^a-z0-9]+/g, "_")}`;
  const userName = demoUser?.name || process.env.ADMIN_NAME || DEFAULT_NAME;

  const token = signJwt({ userId, email }, secret);
  return NextResponse.json({
    token,
    user: {
      id: userId,
      email,
      name: userName,
      credits: 0,
      creditsPurchased: 0,
      creditsEarned: 0,
      ownerUid: `owner_${userId.slice(4)}`
    }
  });
}
