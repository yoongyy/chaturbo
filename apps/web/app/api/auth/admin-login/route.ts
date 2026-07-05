import { NextResponse } from "next/server";
import { findDemoUser } from "../../../../lib/demoDataStore";
import { signJwt } from "../../../../lib/jwt";
import { proxyToExternalApi } from "../../../../lib/serverApiProxy";

const DEFAULT_EMAIL = "admin@chaturbo.local";
const DEFAULT_PASSWORD = "password123";
const DEFAULT_NAME = "Admin User";
const DEFAULT_SECRET = "dev-secret-chaturbo-lead-rescue";

export async function POST(request: Request) {
  const proxied = await proxyToExternalApi(request, "/auth/admin-login");
  if (proxied) {
    return proxied;
  }

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

  const allowedEmail = DEFAULT_EMAIL;
  const allowedPassword = DEFAULT_PASSWORD;
  const demoUser = findDemoUser(email, password, "admin");

  if (!demoUser && (email !== allowedEmail || password !== allowedPassword)) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const userId = demoUser?.id || `admin_${email.replace(/[^a-z0-9]+/g, "_")}`;
  const userName = demoUser?.name || DEFAULT_NAME;
  const token = signJwt({ userId, email, role: "admin" }, secret);

  return NextResponse.json({
    token,
    user: {
      id: userId,
      email,
      name: userName,
      role: "admin"
    }
  });
}
