import { NextResponse } from "next/server";
import { registerDemoUser } from "../../../../lib/demoDataStore";
import { signJwt } from "../../../../lib/jwt";
import { proxyToExternalApi } from "../../../../lib/serverApiProxy";

const DEFAULT_SECRET = "dev-secret-chaturbo-lead-rescue";

export async function POST(request: Request) {
  const proxied = await proxyToExternalApi(request, "/auth/register");
  if (proxied) {
    return proxied;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = typeof (body as { name?: unknown })?.name === "string" ? String((body as { name: string }).name).trim() : "";
  const email = typeof (body as { email?: unknown })?.email === "string" ? String((body as { email: string }).email).trim().toLowerCase() : "";
  const password = typeof (body as { password?: unknown })?.password === "string" ? String((body as { password: string }).password) : "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const user = registerDemoUser({ name, email, password, role: "owner" });
    const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    const token = signJwt({ userId: user.id, email: user.email, role: "owner" }, secret);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "owner",
        credits: 0,
        creditsPurchased: 0,
        creditsEarned: 0,
        ownerUid: `owner_${user.id.slice(4)}`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
