import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest, AuthUser } from "../types";
import { sendError } from "../utils/http";
import { requireAuth } from "./auth";
import { AgentCredential } from "../models/AgentCredential";
import { User } from "../models/User";

export async function requireIngestionAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization") || "";

  if (authHeader.startsWith("Bearer ")) {
    return requireAuth(req, res, next);
  }

  const ownerUid = req.header("x-chaturbo-owner-id");
  const agentSecret = req.header("x-chaturbo-agent-secret");

  if (!ownerUid || !agentSecret) {
    return sendError(res, 401, "Missing JWT or agent credentials");
  }

  const credential = await AgentCredential.findOne({ ownerUid, active: true }).sort({ createdAt: -1 });
  if (!credential) {
    return sendError(res, 401, "Invalid agent owner id");
  }

  const secretMatches = await bcrypt.compare(agentSecret, credential.secretHash);
  if (!secretMatches) {
    return sendError(res, 401, "Invalid agent secret");
  }

  const owner = await User.findById(credential.ownerId).select("email ownerUid");
  if (!owner) {
    return sendError(res, 401, "Agent owner not found");
  }

  credential.lastUsedAt = new Date();
  await credential.save();

  const user: AuthUser = {
    userId: owner.id,
    email: owner.email,
    ownerUid: owner.ownerUid,
    authType: "agent"
  };

  req.user = user;
  return next();
}
