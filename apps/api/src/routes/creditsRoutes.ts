import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";
import { sendError } from "../utils/http";

const router = Router();

router.use(requireAuth);

router.get("/balance", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("credits ownerUid email");
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  return res.json({
    ownerUid: owner.ownerUid,
    email: owner.email,
    credits: owner.credits
  });
});

const topupSchema = z.object({
  credits: z.number().int().min(1).max(100000),
  note: z.string().max(120).optional()
});

router.post("/topup", async (req: AuthenticatedRequest, res) => {
  const parsed = topupSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid top-up payload");
  }

  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  owner.credits += parsed.data.credits;
  await owner.save();

  return res.status(201).json({
    toppedUp: true,
    addedCredits: parsed.data.credits,
    credits: owner.credits,
    note: parsed.data.note || null
  });
});

export default router;
