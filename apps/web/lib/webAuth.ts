import { verifyJwt } from "./jwt";

export type WebSession = {
  userId: string;
  email: string;
  role: "owner" | "admin";
};

const DEFAULT_SECRET = "dev-secret-chaturbo-lead-rescue";

export function getWebSession(request: Request): WebSession | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  const payload = verifyJwt(token, process.env.JWT_SECRET || DEFAULT_SECRET);
  if (!payload) {
    return null;
  }

  const userId = typeof payload.userId === "string" ? payload.userId : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const role = payload.role === "admin" || payload.role === "owner" ? payload.role : "";

  if (!userId || !email || !role) {
    return null;
  }

  return { userId, email, role };
}
