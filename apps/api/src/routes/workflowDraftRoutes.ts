import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { WorkflowDraft } from "../models/WorkflowDraft";
import { Workflow } from "../models/Workflow";
import { sendError } from "../utils/http";
import { slugify } from "../utils/slug";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthenticatedRequest, res) => {
  const ownerId = req.user?.userId;
  const status = req.query.status as string | undefined;
  const query: Record<string, unknown> = { ownerId };
  if (status && ["draft", "published", "rejected"].includes(status)) {
    query.status = status;
  }

  const drafts = await WorkflowDraft.find(query).sort({ createdAt: -1 });
  return res.json({ drafts });
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
  const draft = await WorkflowDraft.findOne({ _id: req.params.id, ownerId: req.user?.userId });
  if (!draft) {
    return sendError(res, 404, "Draft not found");
  }

  return res.json({ draft });
});

router.post("/:id/publish", async (req: AuthenticatedRequest, res) => {
  const draft = await WorkflowDraft.findOne({ _id: req.params.id, ownerId: req.user?.userId });
  if (!draft) {
    return sendError(res, 404, "Draft not found");
  }

  if (draft.status === "published") {
    const existingWorkflow = await Workflow.findOne({ draftId: draft._id });
    return res.json({ workflow: existingWorkflow, draft });
  }

  const baseSlug = slugify(draft.title);
  let slug = baseSlug;
  let index = 1;
  while (await Workflow.findOne({ slug })) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  const fullContent = {
    title: draft.title,
    category: draft.category,
    summary: draft.summary,
    problem: draft.problem,
    solution: draft.solution,
    compatibility: draft.compatibility,
    estimates: draft.estimates,
    privacy: draft.privacy,
    quality: draft.quality,
    source: draft.source
  };

  const previewContent = {
    title: draft.title,
    category: draft.category,
    summary: draft.summary,
    problemDescription: draft.problem.description,
    compatibility: draft.compatibility,
    estimates: draft.estimates,
    qualityScore: draft.quality.publishReadinessScore,
    riskLevel: draft.privacy.riskLevel
  };

  const workflow = await Workflow.create({
    ownerId: draft.ownerId,
    draftId: draft._id,
    title: draft.title,
    slug,
    category: draft.category,
    summary: draft.summary,
    priceCredits: draft.estimates.suggestedPriceCredits,
    fullContent,
    previewContent,
    compatibility: draft.compatibility,
    status: "published"
  });

  draft.status = "published";
  await draft.save();

  return res.json({ workflow, draft });
});

router.post("/:id/reject", async (req: AuthenticatedRequest, res) => {
  const draft = await WorkflowDraft.findOne({ _id: req.params.id, ownerId: req.user?.userId });
  if (!draft) {
    return sendError(res, 404, "Draft not found");
  }

  draft.status = "rejected";
  await draft.save();

  return res.json({ draft });
});

router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  const draft = await WorkflowDraft.findOneAndDelete({ _id: req.params.id, ownerId: req.user?.userId });
  if (!draft) {
    return sendError(res, 404, "Draft not found");
  }

  return res.json({ success: true });
});

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional()
});

router.post("/search", async (_req, res) => {
  return sendError(res, 404, "Use /workflows/search for published workflows");
});

export default router;
