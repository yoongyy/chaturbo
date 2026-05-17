import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import { sendError } from "../utils/http";
import { AuthenticatedRequest, AuthUser } from "../types";

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let env;
  try {
    env = getEnv();
  } catch {
    return sendError(res, 500, "Invalid server environment configuration");
  }

  const authHeader = req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Missing or invalid Authorization header");
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = payload;
    return next();
  } catch {
    return sendError(res, 401, "Invalid token");
  }
}
