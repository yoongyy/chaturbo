import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { WorkflowDraft } from "../models/WorkflowDraft";
import { sendError } from "../utils/http";
import { buildDraftSummary } from "../utils/draftSummary";

const router = Router();

const sourceSchema = z.object({
  type: z.string().default("openclaw"),
  path: z.string().optional(),
  sessionId: z.string().optional(),
  scannedAt: z.coerce.date().optional()
});

const draftSchema = z.object({
  source: sourceSchema,
  title: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  problem: z.object({
    description: z.string().min(1),
    symptoms: z.array(z.string()).default([])
  }),
  solution: z.object({
    overview: z.string().min(1),
    steps: z.array(z.string()).default([]),
    doNotDo: z.array(z.string()).default([]),
    commonErrors: z.array(z.object({ error: z.string(), fix: z.string() })).default([]),
    verificationSteps: z.array(z.string()).default([])
  }),
  compatibility: z.object({
    agents: z.array(z.string()).default([]),
    os: z.array(z.string()).default([]),
    minRamGb: z.number().default(8),
    requiredTools: z.array(z.string()).default([]),
    requiredSoftware: z.record(z.string()).default({}),
    modelRequirement: z.string().default("intermediate"),
    contextLength: z.number().default(8000)
  }),
  estimates: z.object({
    timeSpentHours: z.number().default(0),
    tokenCostUsd: z.number().default(0),
    suggestedPriceCredits: z.number().default(0),
    potentialMonthlyRevenueLow: z.number().default(0),
    potentialMonthlyRevenueHigh: z.number().default(0)
  }),
  privacy: z.object({
    sanitized: z.boolean().default(true),
    removedItems: z.array(z.string()).default([]),
    riskLevel: z.enum(["low", "medium", "high"]).default("low")
  }),
  quality: z.object({
    publishReadinessScore: z.number().min(0).max(100).default(0),
    missingFields: z.array(z.string()).default([]),
    reasonWhySellable: z.string().default("")
  }),
  status: z.enum(["draft", "published", "rejected"]).default("draft")
});

const uploadSchema = z.object({
  drafts: z.array(draftSchema).min(1)
});

router.post("/upload-drafts", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid draft payload");
  }

  const ownerId = req.user?.userId;
  if (!ownerId) {
    return sendError(res, 401, "Unauthorized");
  }

  const inserts = parsed.data.drafts.map((draft) => ({
    ...draft,
    ownerId,
    source: {
      ...draft.source,
      scannedAt: draft.source.scannedAt ?? new Date()
    },
    status: "draft"
  }));

  const saved = await WorkflowDraft.insertMany(inserts);
  const allUserDrafts = await WorkflowDraft.find({ ownerId }).sort({ createdAt: -1 });

  return res.status(201).json({
    drafts: saved,
    summary: buildDraftSummary(allUserDrafts)
  });
});

export default router;
