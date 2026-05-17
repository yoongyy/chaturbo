import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signJwt(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: "7d" });
}
