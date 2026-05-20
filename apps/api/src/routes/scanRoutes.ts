import { Router } from "express";
import { z } from "zod";
import { requireIngestionAuth } from "../middleware/ingestionAuth";
import { AuthenticatedRequest } from "../types";
import { WorkflowDraft } from "../models/WorkflowDraft";
import { Workflow } from "../models/Workflow";
import { sendError } from "../utils/http";
import { buildDraftSummary } from "../utils/draftSummary";
import { slugify } from "../utils/slug";
import { cleanDraftForStorage, normalizedProblemKey, normalizedTitleKey } from "../utils/workflowSanitizer";

const router = Router();

const sourceSchema = z.object({
  type: z.string().default("agent_log"),
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
  drafts: z.array(draftSchema).min(1),
  autoPublish: z.boolean().default(false),
  publishThreshold: z.number().min(50).max(100).default(85),
  maxAutoPublish: z.number().int().min(1).max(200).default(25)
});

function draftFingerprint(draft: z.infer<typeof draftSchema>) {
  const title = normalizedTitleKey(draft.title);
  const category = (draft.category || "").trim().toLowerCase();
  const problem = normalizedProblemKey(draft.problem?.description || "");
  return `${title}|${category}|${problem}`;
}

function canAutoPublish(draft: z.infer<typeof draftSchema>, threshold: number): boolean {
  if (draft.quality.publishReadinessScore < threshold) return false;
  if (draft.privacy.riskLevel === "high") return false;
  if ((draft.quality.missingFields || []).length > 1) return false;
  if ((draft.solution.steps || []).length < 3) return false;
  if ((draft.solution.verificationSteps || []).length < 2) return false;
  return true;
}

async function publishDraftDocument(draft: any) {
  const cleanedDraft = cleanDraftForStorage(draft.toObject ? draft.toObject() : draft);
  draft.title = cleanedDraft.title;
  draft.category = cleanedDraft.category;
  draft.summary = cleanedDraft.summary;
  draft.problem = cleanedDraft.problem;
  draft.solution = cleanedDraft.solution;

  const titleKey = normalizedTitleKey(draft.title);
  const problemKey = normalizedProblemKey(draft.problem?.description || "");
  const ownerWorkflowDocs = await Workflow.find({ ownerId: draft.ownerId }).select("title previewContent.problemDescription");
  const existingSameTitle = ownerWorkflowDocs.find(
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

router.post("/upload-drafts", requireIngestionAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid draft payload");
  }

  const ownerId = req.user?.userId;
  if (!ownerId) {
    return sendError(res, 401, "Unauthorized");
  }

  const existingDrafts = await WorkflowDraft.find({ ownerId }).select(
    "title category problem.description summary status quality.publishReadinessScore privacy.riskLevel"
  );
  const existingWorkflows = await Workflow.find({ ownerId }).select("title category summary");
  const existingFingerprints = new Set(
    existingDrafts.map((draft) =>
      draftFingerprint({
        source: { type: "agent_log", scannedAt: new Date() },
        title: draft.title,
        category: draft.category,
        summary: draft.summary,
        problem: { description: draft.problem?.description || "", symptoms: [] },
        solution: {
          overview: "",
          steps: [],
          doNotDo: [],
          commonErrors: [],
          verificationSteps: []
        },
        compatibility: {
          agents: [],
          os: [],
          minRamGb: 8,
          requiredTools: [],
          requiredSoftware: {},
          modelRequirement: "intermediate",
          contextLength: 8000
        },
        estimates: {
          timeSpentHours: 0,
          tokenCostUsd: 0,
          suggestedPriceCredits: 0,
          potentialMonthlyRevenueLow: 0,
          potentialMonthlyRevenueHigh: 0
        },
        privacy: {
          sanitized: true,
          removedItems: [],
          riskLevel: draft.privacy?.riskLevel || "low"
        },
        quality: {
          publishReadinessScore: draft.quality?.publishReadinessScore || 0,
          missingFields: [],
          reasonWhySellable: ""
        },
        status: "draft"
      })
    )
  );
  for (const workflow of existingWorkflows) {
    existingFingerprints.add(
      draftFingerprint({
        source: { type: "agent_log", scannedAt: new Date() },
        title: workflow.title,
        category: workflow.category,
        summary: workflow.summary,
        problem: { description: workflow.summary || workflow.title, symptoms: [] },
        solution: {
          overview: "",
          steps: [],
          doNotDo: [],
          commonErrors: [],
          verificationSteps: []
        },
        compatibility: {
          agents: [],
          os: [],
          minRamGb: 8,
          requiredTools: [],
          requiredSoftware: {},
          modelRequirement: "intermediate",
          contextLength: 8000
        },
        estimates: {
          timeSpentHours: 0,
          tokenCostUsd: 0,
          suggestedPriceCredits: 0,
          potentialMonthlyRevenueLow: 0,
          potentialMonthlyRevenueHigh: 0
        },
        privacy: {
          sanitized: true,
          removedItems: [],
          riskLevel: "low"
        },
        quality: {
          publishReadinessScore: 0,
          missingFields: [],
          reasonWhySellable: ""
        },
        status: "draft"
      })
    );
  }

  const incomingFingerprints = new Set<string>();
  const inserts = parsed.data.drafts
    .map((draft) => cleanDraftForStorage(draft))
    .filter((draft) => {
      const fp = draftFingerprint(draft);
      if (existingFingerprints.has(fp)) {
        return false;
      }
      if (incomingFingerprints.has(fp)) {
        return false;
      }
      incomingFingerprints.add(fp);
      return true;
    })
    .map((draft) => ({
      ...draft,
      ownerId,
      source: {
        ...draft.source,
        scannedAt: draft.source.scannedAt ?? new Date()
      },
      status: "draft"
    }));

  const saved = inserts.length ? await WorkflowDraft.insertMany(inserts) : [];
  const autoPublished: any[] = [];
  if (parsed.data.autoPublish && saved.length) {
    const threshold = parsed.data.publishThreshold;
    const eligible = saved.filter((draft) => canAutoPublish(draft as any, threshold)).slice(0, parsed.data.maxAutoPublish);
    for (const draft of eligible) {
      const workflow = await publishDraftDocument(draft);
      autoPublished.push(workflow);
    }
  }

  const allUserDrafts = await WorkflowDraft.find({ ownerId }).sort({ createdAt: -1 });

  return res.status(201).json({
    drafts: saved,
    dedupe: {
      submitted: parsed.data.drafts.length,
      inserted: saved.length,
      skippedDuplicates: parsed.data.drafts.length - saved.length
    },
    autoPublished: {
      enabled: parsed.data.autoPublish,
      count: autoPublished.length,
      workflowIds: autoPublished.map((workflow) => workflow._id)
    },
    summary: buildDraftSummary(allUserDrafts)
  });
});

export default router;
