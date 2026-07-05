import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";

export function signJwt(userId: string, email: string, role: "admin" | "member", ownerUid: string): string {
  const env = getEnv();
  return jwt.sign({ userId, email, role, ownerUid }, env.JWT_SECRET, { expiresIn: "7d" });
}
