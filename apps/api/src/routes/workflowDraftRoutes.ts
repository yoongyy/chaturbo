import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { WorkflowDraft } from "../models/WorkflowDraft";
import { Workflow } from "../models/Workflow";
import { sendError } from "../utils/http";
import { slugify } from "../utils/slug";
import { cleanDraftForStorage, normalizedProblemKey, normalizedTitleKey } from "../utils/workflowSanitizer";

const router = Router();

router.use(requireAuth);

function canAutoPublishDraft(draft: any, threshold: number) {
  if ((draft.quality?.publishReadinessScore ?? 0) < threshold) return false;
  if (draft.privacy?.riskLevel === "high") return false;
  if ((draft.quality?.missingFields || []).length > 1) return false;
  if ((draft.solution?.steps || []).length < 3) return false;
  if ((draft.solution?.verificationSteps || []).length < 2) return false;
  return true;
}

async function publishDraftToWorkflow(draft: any) {
  const cleanedDraft = cleanDraftForStorage(draft.toObject ? draft.toObject() : draft);
  draft.title = cleanedDraft.title;
  draft.category = cleanedDraft.category;
  draft.summary = cleanedDraft.summary;
  draft.problem = cleanedDraft.problem;
  draft.solution = cleanedDraft.solution;

  const titleKey = normalizedTitleKey(draft.title);
  const problemKey = normalizedProblemKey(draft.problem?.description || "");
  const ownerWorkflows = await Workflow.find({ ownerId: draft.ownerId }).select("title previewContent.problemDescription");
  const existingSameTitle = ownerWorkflows.find(
    (workflow) =>
      normalizedTitleKey(workflow.title) === titleKey &&
      normalizedProblemKey((workflow as any).previewContent?.problemDescription || "") === problemKey
  );
  if (existingSameTitle) {
    draft.status = "published";
    await draft.save();
    return existingSameTitle;
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
  return workflow;
}

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

  const workflow = await publishDraftToWorkflow(draft);

  return res.json({ workflow, draft });
});

const autoPublishSchema = z.object({
  threshold: z.number().min(50).max(100).default(85),
  maxCount: z.number().int().min(1).max(200).default(50)
});

router.post("/auto-publish", async (req: AuthenticatedRequest, res) => {
  const parsed = autoPublishSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid auto-publish payload");
  }

  const ownerId = req.user?.userId;
  const drafts = await WorkflowDraft.find({ ownerId, status: "draft" }).sort({ createdAt: -1 });
  const eligible = drafts.filter((draft) => canAutoPublishDraft(draft, parsed.data.threshold)).slice(0, parsed.data.maxCount);

  const publishedIds: string[] = [];
  for (const draft of eligible) {
    const existingWorkflow = await Workflow.findOne({ draftId: draft._id });
    if (existingWorkflow) {
      draft.status = "published";
      await draft.save();
      publishedIds.push(String(existingWorkflow._id));
      continue;
    }

    const workflow = await publishDraftToWorkflow(draft);
    publishedIds.push(String(workflow._id));
  }

  return res.status(201).json({
    evaluated: drafts.length,
    eligible: eligible.length,
    published: publishedIds.length,
    workflowIds: publishedIds
  });
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
