import { Request } from "express";

export interface AuthUser {
  userId: string;
  email: string;
  role?: "admin" | "member";
  ownerUid?: string;
  authType?: "jwt" | "agent";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
