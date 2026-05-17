import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";

export function signJwt(userId: string, email: string): string {
  const env = getEnv();
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: "7d" });
}
