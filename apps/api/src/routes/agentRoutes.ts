import { Router } from "express";
import { z } from "zod";
import { requireIngestionAuth } from "../middleware/ingestionAuth";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";
import { Workflow } from "../models/Workflow";
import { WorkflowPurchase } from "../models/WorkflowPurchase";
import { sendError } from "../utils/http";
import { CreditTransaction } from "../models/CreditTransaction";

const router = Router();
const MAX_PAGE_SIZE = 50;

function toPublicWorkflow(workflow: any) {
  return {
    _id: workflow._id,
    title: workflow.title,
    slug: workflow.slug,
    category: workflow.category,
    summary: workflow.summary,
    priceCredits: workflow.priceCredits,
    previewContent: workflow.previewContent,
    compatibility: workflow.compatibility,
    stats: workflow.stats,
    status: workflow.status,
    createdAt: workflow.createdAt
  };
}

router.use(requireIngestionAuth);

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(10)
});

router.post("/search", async (req: AuthenticatedRequest, res) => {
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
      .select("title slug category summary priceCredits previewContent compatibility stats status createdAt")
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

router.get("/balance", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("credits ownerUid email");
  if (!owner) {
    return sendError(res, 404, "Owner not found");
  }

  return res.json({
    ownerUid: owner.ownerUid,
    email: owner.email,
    credits: owner.credits
  });
});

router.post("/workflows/:id/purchase", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "Owner not found");
  }

  const workflow = await Workflow.findOne({ _id: req.params.id, status: "published" });
  if (!workflow) {
    return sendError(res, 404, "Workflow not found");
  }

  if ((workflow.stats?.successfulRuns ?? 0) < 1) {
    return sendError(res, 412, "Workflow is not verified yet (no successful run reported)");
  }

  const existingPurchase = await WorkflowPurchase.findOne({ ownerId: owner._id, workflowId: workflow._id });
  if (existingPurchase) {
    return res.json({
      alreadyPurchased: true,
      remainingCredits: owner.credits,
      workflow: {
        _id: workflow._id,
        title: workflow.title,
        category: workflow.category,
        fullContent: workflow.fullContent,
        compatibility: workflow.compatibility
      }
    });
  }

  if (owner.credits < workflow.priceCredits) {
    return sendError(res, 402, "Insufficient credits");
  }

  owner.credits -= workflow.priceCredits;
  if (owner.creditsPurchased >= workflow.priceCredits) {
    owner.creditsPurchased -= workflow.priceCredits;
  } else {
    const remainder = workflow.priceCredits - owner.creditsPurchased;
    owner.creditsPurchased = 0;
    owner.creditsEarned = Math.max(0, owner.creditsEarned - remainder);
  }
  await owner.save();

  workflow.stats = {
    ...workflow.stats,
    purchases: (workflow.stats?.purchases ?? 0) + 1
  };
  await workflow.save();

  await WorkflowPurchase.create({
    ownerId: owner._id,
    workflowId: workflow._id,
    priceCredits: workflow.priceCredits,
    source: "agent"
  });

  await CreditTransaction.create({
    ownerId: owner._id,
    type: "purchase_debit",
    source: "agent_purchase",
    amount: -workflow.priceCredits,
    workflowId: workflow._id
  });

  if (String(workflow.ownerId) !== String(owner._id)) {
    const seller = await User.findById(workflow.ownerId);
    if (seller) {
      seller.credits += workflow.priceCredits;
      seller.creditsEarned += workflow.priceCredits;
      await seller.save();

      await CreditTransaction.create({
        ownerId: seller._id,
        type: "sale_credit",
        source: "agent_purchase",
        amount: workflow.priceCredits,
        workflowId: workflow._id,
        metadata: { buyerOwnerId: owner._id }
      });
    }
  }

  return res.status(201).json({
    purchased: true,
    spentCredits: workflow.priceCredits,
    remainingCredits: owner.credits,
    workflow: {
      _id: workflow._id,
      title: workflow.title,
      category: workflow.category,
      fullContent: workflow.fullContent,
      compatibility: workflow.compatibility
    }
  });
});

router.get("/library", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("_id");
  if (!owner) {
    return sendError(res, 404, "Owner not found");
  }

  const purchases = await WorkflowPurchase.find({ ownerId: owner._id }).sort({ createdAt: -1 }).lean();
  const workflowIds = purchases.map((p) => p.workflowId);

  const workflows = await Workflow.find({ _id: { $in: workflowIds } })
    .select("title category compatibility fullContent previewContent")
    .lean();

  const workflowById = new Map(workflows.map((workflow) => [String(workflow._id), workflow]));
  const library = purchases
    .map((purchase) => {
      const workflow = workflowById.get(String(purchase.workflowId));
      if (!workflow) return null;
      return {
        purchaseId: purchase._id,
        purchasedAt: purchase.createdAt,
        priceCredits: purchase.priceCredits,
        workflow: {
          _id: workflow._id,
          title: workflow.title,
          category: workflow.category,
          compatibility: workflow.compatibility,
          previewContent: workflow.previewContent,
          fullContent: workflow.fullContent
        }
      };
    })
    .filter(Boolean);

  return res.json({ library });
});

export default router;
