import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAdmin, requireAuth } from "../../middleware/auth";
import { Audit } from "../../models/Audit";
import { AuditTarget } from "../../models/AuditTarget";
import { Business } from "../../models/Business";
import { AuthenticatedRequest } from "../../types";
import { sendError } from "../../utils/http";
import { slugify } from "../../utils/slug";
import { crawlWebsite } from "../../services/leadRescue/crawl";
import { generateAudit } from "../../services/leadRescue/ai";
import { serializeDoc } from "../../services/leadRescue/utils";

const router = Router();

const targetSchema = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  ownerName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  googleProfileUrl: z.string().url().optional().or(z.literal("")),
  reviewCount: z.number().optional(),
  rating: z.number().optional(),
  notes: z.string().optional()
});

router.get("/public/:slug", async (req, res) => {
  const audit = await Audit.findOne({ slug: req.params.slug }).lean();
  if (!audit) {
    return sendError(res, 404, "Audit not found");
  }

  // Increment view count and log last view date
  const target = await AuditTarget.findByIdAndUpdate(
    audit.auditTargetId,
    { $inc: { viewsCount: 1 }, $set: { lastViewedAt: new Date() } },
    { new: true }
  ).lean();

  return res.json({
    audit: serializeDoc(audit),
    target: target ? serializeDoc(target) : null
  });
});

router.use(requireAuth);
router.use(requireAdmin);

router.get("/targets", async (_req, res) => {
  const targets = await AuditTarget.find().sort({ createdAt: -1 }).lean();
  return res.json({ targets: targets.map((item) => serializeDoc(item)) });
});

router.post("/targets", async (req: AuthenticatedRequest, res) => {
  const parsed = targetSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid audit target payload");
  }

  const slug = slugify(parsed.data.businessName);
  const exists = await AuditTarget.findOne({ slug });
  const target = await AuditTarget.create({
    ownerId: req.user?.userId,
    ownerUid: req.user?.ownerUid,
    ...parsed.data,
    slug: exists ? `${slug}-${Date.now()}` : slug,
    crawlStatus: "pending",
    extractedPhoneNumbers: [],
    status: "new",
    websiteUrl: parsed.data.websiteUrl || undefined,
    email: parsed.data.email || undefined,
    googleProfileUrl: parsed.data.googleProfileUrl || undefined
  });

  return res.status(201).json({ target: serializeDoc(target.toObject()) });
});

router.get("/targets/:id", async (req, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit target id");
  }

  const target = await AuditTarget.findById(id).lean();
  if (!target) {
    return sendError(res, 404, "Audit target not found");
  }

  const audits = await Audit.find({ auditTargetId: target._id }).sort({ createdAt: -1 }).lean();

  return res.json({
    target: serializeDoc(target),
    audits: audits.map((item) => serializeDoc(item))
  });
});

router.patch("/targets/:id", async (req, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit target id");
  }

  const parsed = targetSchema.partial().safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid audit target payload");
  }

  const target = await AuditTarget.findByIdAndUpdate(
    id,
    {
      ...parsed.data,
      websiteUrl: parsed.data.websiteUrl || undefined,
      email: parsed.data.email || undefined,
      googleProfileUrl: parsed.data.googleProfileUrl || undefined
    },
    { new: true }
  );

  if (!target) {
    return sendError(res, 404, "Audit target not found");
  }

  return res.json({ target: serializeDoc(target.toObject()) });
});

router.post("/targets/:id/crawl", async (req, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit target id");
  }

  const target = await AuditTarget.findById(id);
  if (!target) {
    return sendError(res, 404, "Audit target not found");
  }

  const crawl = target.websiteUrl ? await crawlWebsite(target.websiteUrl) : { ok: false, websiteText: "", phoneNumbers: [], contactHints: [], error: "No website URL provided" };
  target.crawlStatus = crawl.ok ? "crawled" : "failed";
  target.extractedWebsiteText = crawl.websiteText;
  target.extractedTitle = crawl.title;
  target.extractedDescription = crawl.description;
  target.extractedPhoneNumbers = crawl.phoneNumbers;
  await target.save();

  return res.json({
    target: serializeDoc(target.toObject()),
    crawl
  });
});

router.post("/targets/:id/generate", async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit target id");
  }

  const target = await AuditTarget.findById(id);
  if (!target) {
    return sendError(res, 404, "Audit target not found");
  }

  const crawlText = target.extractedWebsiteText || "";
  const auditPayload = await generateAudit(target, crawlText);
  const slugBase = `${target.slug}-audit`;
  const existing = await Audit.findOne({ slug: slugBase });
  const slug = existing ? `${slugBase}-${Date.now()}` : slugBase;

  const audit = await Audit.create({
    ownerId: req.user?.userId,
    ownerUid: req.user?.ownerUid,
    auditTargetId: target._id,
    slug,
    summary: auditPayload.summary,
    problemsJson: auditPayload.problems || [],
    recommendationsJson: auditPayload.recommendations || [],
    coldEmail: auditPayload.coldEmail,
    followupEmail1: auditPayload.followupEmail1,
    followupEmail2: auditPayload.followupEmail2,
    callScript: auditPayload.callScript,
    facebookMessage: auditPayload.facebookMessage,
    contactFormMessage: auditPayload.contactFormMessage,
    videoScript: auditPayload.videoScript,
    publicPageHtml: auditPayload.publicPageHtml
  });

  return res.status(201).json({
    audit: serializeDoc(audit.toObject())
  });
});

router.post("/targets/:id/convert", async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit target id");
  }

  const target = await AuditTarget.findById(id);
  if (!target) {
    return sendError(res, 404, "Audit target not found");
  }

  const businessSlug = `${target.slug}-business`;
  const existingBusiness = await Business.findOne({ slug: businessSlug });
  const business = await Business.create({
    ownerId: req.user?.userId,
    ownerUid: req.user?.ownerUid,
    slug: existingBusiness ? `${businessSlug}-${Date.now()}` : businessSlug,
    name: target.businessName,
    industry: target.industry,
    ownerName: target.ownerName,
    ownerMobile: target.phone,
    ownerEmail: target.email,
    websiteUrl: target.websiteUrl,
    city: target.city,
    state: target.state,
    serviceArea: target.city && target.state ? `${target.city}, ${target.state}` : target.city || target.state || "",
    servicesJson: [],
    businessHoursJson: {},
    emergencyService: false,
    googleReviewUrl: target.googleProfileUrl,
    calendarUrl: "",
    aiTone: "professional, concise, helpful",
    notificationMethod: "both",
    status: "draft",
    plan: "pro",
    billingStatus: "manual",
    setupFeePaid: false,
    monthlyPrice: 149,
    setupFeeAmount: 299,
    setupFeeWaived: false,
    foundingCustomer: false,
    leadLimit: 200,
    demoMode: false
  });

  target.status = "converted";
  await target.save();

  return res.status(201).json({
    business: serializeDoc(business.toObject()),
    target: serializeDoc(target.toObject())
  });
});

router.get("/", async (_req, res) => {
  const audits = await Audit.find().sort({ createdAt: -1 }).lean();
  return res.json({ audits: audits.map((audit) => serializeDoc(audit)) });
});

router.get("/:id", async (req, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid audit id");
  }

  const audit = await Audit.findById(id).lean();
  if (!audit) {
    return sendError(res, 404, "Audit not found");
  }

  const target = await AuditTarget.findById(audit.auditTargetId).lean();
  return res.json({
    audit: serializeDoc(audit),
    target: target ? serializeDoc(target) : null
  });
});

export default router;
