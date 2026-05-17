import { Router } from "express";
import { z } from "zod";
import { Workflow } from "../models/Workflow";
import { sendError } from "../utils/http";

const router = Router();
const MAX_PAGE_SIZE = 50;

function toPublicWorkflow(workflow: any) {
  return {
    _id: workflow._id,
    ownerId: workflow.ownerId,
    draftId: workflow.draftId,
    title: workflow.title,
    slug: workflow.slug,
    category: workflow.category,
    summary: workflow.summary,
    priceCredits: workflow.priceCredits,
    previewContent: workflow.previewContent,
    compatibility: workflow.compatibility,
    stats: workflow.stats,
    status: workflow.status,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt
  };
}

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(12)
});

router.get("/", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid pagination query");
  }

  const { page, limit } = parsed.data;
  const query = { status: "published" as const };
  const skip = (page - 1) * limit;

  const [workflows, total] = await Promise.all([
    Workflow.find(query)
    .select("ownerId draftId title slug category summary priceCredits previewContent compatibility stats status createdAt updatedAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(),
    Workflow.countDocuments(query)
  ]);

  return res.json({
    workflows: workflows.map(toPublicWorkflow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: skip + workflows.length < total,
      hasPrevPage: page > 1
    }
  });
});

router.get("/:id", async (req, res) => {
  const workflow = await Workflow.findOne({ _id: req.params.id, status: { $in: ["published", "unlisted"] } })
    .select("ownerId draftId title slug category summary priceCredits previewContent compatibility stats status createdAt updatedAt")
    .lean();
  if (!workflow) {
    return sendError(res, 404, "Workflow not found");
  }

  return res.json({ workflow: toPublicWorkflow(workflow) });
});

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(12)
});

router.post("/search", async (req, res) => {
  const parsed = searchSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid search payload");
  }

  const { query, category, minPrice, maxPrice, page, limit } = parsed.data;
  const mongoQuery: Record<string, unknown> = { status: "published" };

  if (query) {
    mongoQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } }
    ];
  }

  if (category) {
    mongoQuery.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    mongoQuery.priceCredits = {
      ...(typeof minPrice === "number" ? { $gte: minPrice } : {}),
      ...(typeof maxPrice === "number" ? { $lte: maxPrice } : {})
    };
  }

  const skip = (page - 1) * limit;
  const [workflows, total] = await Promise.all([
    Workflow.find(mongoQuery)
    .select("ownerId draftId title slug category summary priceCredits previewContent compatibility stats status createdAt updatedAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(),
    Workflow.countDocuments(mongoQuery)
  ]);

  return res.json({
    workflows: workflows.map(toPublicWorkflow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: skip + workflows.length < total,
      hasPrevPage: page > 1
    }
  });
});

const preflightSchema = z.object({
  agent: z.string(),
  os: z.string(),
  ramGb: z.number(),
  tools: z.array(z.string()).default([]),
  softwareVersions: z.record(z.string()).default({}),
  modelLevel: z.string(),
  contextLength: z.number()
});

const modelRank: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  advanced_coding: 4
};

router.post("/:id/preflight-check", async (req, res) => {
  const parsed = preflightSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid preflight payload");
  }

  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) {
    return sendError(res, 404, "Workflow not found");
  }

  const payload = parsed.data;
  const compatibility = workflow.compatibility as {
    agents?: string[];
    os?: string[];
    minRamGb?: number;
    requiredTools?: string[];
    requiredSoftware?: Record<string, string>;
    modelRequirement?: string;
    contextLength?: number;
  };

  const passed: string[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  const requiredAgents = compatibility.agents ?? [];
  if (!requiredAgents.length || requiredAgents.some((a) => a.toLowerCase() === payload.agent.toLowerCase())) {
    passed.push("Agent compatibility matched");
  } else {
    warnings.push(`Recommended agents: ${requiredAgents.join(", ")}`);
  }

  const requiredOs = compatibility.os ?? [];
  if (!requiredOs.length || requiredOs.some((o) => o.toLowerCase() === payload.os.toLowerCase())) {
    passed.push("OS compatibility matched");
  } else {
    warnings.push(`Recommended OS: ${requiredOs.join(", ")}`);
  }

  const minRamGb = compatibility.minRamGb ?? 0;
  if (payload.ramGb >= minRamGb) {
    passed.push(`RAM check passed (${payload.ramGb}GB >= ${minRamGb}GB)`);
  } else {
    blockers.push(`Requires at least ${minRamGb}GB RAM`);
  }

  const requiredTools = compatibility.requiredTools ?? [];
  const missingTools = requiredTools.filter(
    (tool) => !payload.tools.some((t) => t.toLowerCase() === tool.toLowerCase())
  );
  if (!missingTools.length) {
    passed.push("Required tools available");
  } else {
    warnings.push(`Missing tools: ${missingTools.join(", ")}`);
  }

  const requiredContextLength = compatibility.contextLength ?? 0;
  if (!requiredContextLength || payload.contextLength >= requiredContextLength) {
    passed.push("Context length requirement met");
  } else {
    warnings.push(`Recommended context length: ${requiredContextLength}+`);
  }

  const requiredModel = compatibility.modelRequirement ?? "intermediate";
  const actualModelRank = modelRank[payload.modelLevel] ?? 1;
  const requiredModelRank = modelRank[requiredModel] ?? 2;
  if (actualModelRank >= requiredModelRank) {
    passed.push(`Model level meets requirement (${payload.modelLevel})`);
  } else {
    blockers.push(`Requires model level ${requiredModel} or higher`);
  }

  const score = Math.max(0, Math.min(100, Math.round((passed.length * 20) - (warnings.length * 8) - (blockers.length * 20))));

  let result: "Highly compatible" | "Likely to work" | "May work with warnings" | "High risk" | "Not compatible";
  let compatible = true;

  if (blockers.length > 0) {
    compatible = false;
    result = blockers.length >= 2 ? "Not compatible" : "High risk";
  } else if (warnings.length === 0) {
    result = score >= 85 ? "Highly compatible" : "Likely to work";
  } else if (warnings.length <= 2) {
    result = "May work with warnings";
  } else {
    result = "High risk";
  }

  return res.json({
    compatible,
    score,
    result,
    passed,
    warnings,
    blockers
  });
});

export default router;
