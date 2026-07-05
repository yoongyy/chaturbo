import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { Business } from "../../models/Business";
import { CallLog } from "../../models/CallLog";
import { Lead } from "../../models/Lead";
import { Message } from "../../models/Message";
import { PhoneNumber } from "../../models/PhoneNumber";
import { AuthenticatedRequest } from "../../types";
import { sendError } from "../../utils/http";
import { normalizePhone, serializeDoc } from "../../services/leadRescue/utils";
import { slugify } from "../../utils/slug";

const router = Router();

function getBusinessScope(user?: { userId?: string; role?: string }) {
  if (user?.role === "admin") {
    return {};
  }

  return { ownerId: user?.userId };
}

const businessSchema = z.object({
  name: z.string().min(1),
  industry: z.enum(["roofing", "hvac", "plumbing", "electrical", "landscaping", "cleaning", "other"]),
  ownerName: z.string().optional(),
  ownerMobile: z.string().optional(),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  serviceArea: z.string().optional(),
  servicesJson: z.array(z.string()).default([]),
  businessHoursJson: z.record(z.any()).default({}),
  emergencyService: z.boolean().default(false),
  googleReviewUrl: z.string().url().optional().or(z.literal("")),
  calendarUrl: z.string().url().optional().or(z.literal("")),
  twilioPhoneNumber: z.string().optional(),
  aiTone: z.string().optional(),
  notificationMethod: z.enum(["sms", "email", "both"]).default("both"),
  status: z.enum(["draft", "active", "paused"]).default("draft"),
  plan: z.enum(["setup", "monthly", "agency"]).default("setup"),
  billingStatus: z.enum(["unpaid", "trial", "active", "past_due", "manual"]).default("manual"),
  setupFeePaid: z.boolean().default(false),
  monthlyPrice: z.number().default(149),
  trialEndsAt: z.string().datetime().optional().or(z.literal("")),
  demoMode: z.boolean().default(false)
});

const phoneAssignSchema = z.object({
  phoneNumber: z.string().min(5),
  twilioSid: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active")
});

router.use(requireAuth);

router.get("/", async (req: AuthenticatedRequest, res) => {
  const businesses = await Business.find(getBusinessScope(req.user)).sort({ createdAt: -1 }).lean();
  const mapped = businesses.map((business) => serializeDoc(business));
  return res.json({ businesses: mapped });
});

router.post("/", async (req: AuthenticatedRequest, res) => {
  const parsed = businessSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid business payload");
  }

  const data = parsed.data;
  const slug = slugify(data.name);
  const existingSlug = await Business.findOne({ slug });
  const resolvedSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const business = await Business.create({
    ownerId: req.user?.userId,
    ownerUid: req.user?.ownerUid,
    ...data,
    slug: resolvedSlug,
    ownerEmail: data.ownerEmail || undefined,
    websiteUrl: data.websiteUrl || undefined,
    googleReviewUrl: data.googleReviewUrl || undefined,
    calendarUrl: data.calendarUrl || undefined,
    trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : undefined,
    twilioPhoneNumber: data.twilioPhoneNumber ? normalizePhone(data.twilioPhoneNumber) : undefined
  });

  return res.status(201).json({ business: serializeDoc(business.toObject()) });
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid business id");
  }

  const business = await Business.findOne({ _id: id, ...getBusinessScope(req.user) }).lean();
  if (!business) {
    return sendError(res, 404, "Business not found");
  }

  const [leads, calls, messages, phoneNumbers] = await Promise.all([
    Lead.find({ businessId: business._id }).sort({ createdAt: -1 }).limit(20).lean(),
    CallLog.find({ businessId: business._id }).sort({ createdAt: -1 }).limit(20).lean(),
    Message.find({ businessId: business._id }).sort({ createdAt: -1 }).limit(20).lean(),
    PhoneNumber.find({ businessId: business._id }).sort({ createdAt: -1 }).lean()
  ]);

  return res.json({
    business: serializeDoc(business),
    leads: leads.map((item) => serializeDoc(item)),
    calls: calls.map((item) => serializeDoc(item)),
    messages: messages.map((item) => serializeDoc(item)),
    phoneNumbers: phoneNumbers.map((item) => serializeDoc(item))
  });
});

router.patch("/:id", async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid business id");
  }

  const parsed = businessSchema.partial().safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid business payload");
  }

  const data = parsed.data;
  const business = await Business.findOneAndUpdate(
    { _id: id, ...getBusinessScope(req.user) },
    {
      ...data,
      ownerEmail: data.ownerEmail || undefined,
      websiteUrl: data.websiteUrl || undefined,
      googleReviewUrl: data.googleReviewUrl || undefined,
      calendarUrl: data.calendarUrl || undefined,
      trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : undefined,
      twilioPhoneNumber: data.twilioPhoneNumber ? normalizePhone(data.twilioPhoneNumber) : undefined
    },
    { new: true }
  );

  if (!business) {
    return sendError(res, 404, "Business not found");
  }

  return res.json({ business: serializeDoc(business.toObject()) });
});

router.post("/:id/phone-number", async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid business id");
  }

  const parsed = phoneAssignSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid phone number payload");
  }

  const business = await Business.findOne({ _id: id, ...getBusinessScope(req.user) });
  if (!business) {
    return sendError(res, 404, "Business not found");
  }

  const normalized = normalizePhone(parsed.data.phoneNumber);
  await PhoneNumber.findOneAndUpdate(
    { businessId: business._id, phoneNumber: normalized },
    {
      businessId: business._id,
      provider: "twilio",
      phoneNumber: normalized,
      twilioSid: parsed.data.twilioSid,
      status: parsed.data.status
    },
    { upsert: true, new: true }
  );

  business.twilioPhoneNumber = normalized;
  business.twilioPhoneNumberSid = parsed.data.twilioSid;
  await business.save();

  return res.json({
    business: serializeDoc(business.toObject())
  });
});

export default router;
