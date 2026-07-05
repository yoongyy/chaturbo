import { Router } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { Business } from "../../models/Business";
import { Lead } from "../../models/Lead";
import { Message } from "../../models/Message";
import { sendError } from "../../utils/http";
import { sendSms } from "../../services/leadRescue/communications";
import { serializeDoc, normalizePhone } from "../../services/leadRescue/utils";

const router = Router();

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "booked", "won", "lost", "spam"]),
  urgency: z.enum(["low", "medium", "high", "emergency"]).optional(),
  notes: z.string().optional(),
  summary: z.string().optional()
});

const replySchema = z.object({
  body: z.string().min(1),
  to: z.string().optional()
});

router.use(requireAuth);

router.get("/", async (req, res) => {
  const { businessId, status, source } = req.query;
  const query: Record<string, unknown> = {};
  if (typeof businessId === "string" && Types.ObjectId.isValid(businessId)) query.businessId = businessId;
  if (typeof status === "string") query.status = status;
  if (typeof source === "string") query.source = source;

  const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();
  return res.json({ leads: leads.map((lead) => serializeDoc(lead)) });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid lead id");
  }

  const lead = await Lead.findById(id).lean();
  if (!lead) {
    return sendError(res, 404, "Lead not found");
  }

  const messages = await Message.find({ leadId: lead._id }).sort({ createdAt: 1 }).lean();
  const business = lead.businessId ? await Business.findById(lead.businessId).lean() : null;

  return res.json({
    lead: serializeDoc(lead),
    business: business ? serializeDoc(business) : null,
    messages: messages.map((message) => serializeDoc(message))
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid lead id");
  }

  const parsed = statusSchema.partial().safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid lead payload");
  }

  const updated = await Lead.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updated) {
    return sendError(res, 404, "Lead not found");
  }

  return res.json({ lead: serializeDoc(updated.toObject()) });
});

router.post("/:id/reply", async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, "Invalid lead id");
  }

  const parsed = replySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Invalid reply payload");
  }

  const lead = await Lead.findById(id);
  if (!lead) {
    return sendError(res, 404, "Lead not found");
  }

  const business = lead.businessId ? await Business.findById(lead.businessId) : null;
  if (!business) {
    return sendError(res, 404, "Associated business not found");
  }

  const to = normalizePhone(parsed.data.to || lead.phone);
  const message = await Message.create({
    businessId: business._id,
    leadId: lead._id,
    direction: "outbound",
    channel: "sms",
    from: business.twilioPhoneNumber || "",
    to,
    body: parsed.data.body,
    mediaUrlsJson: [],
    status: "queued"
  });

  const smsResult = await sendSms(to, parsed.data.body);
  message.status = smsResult.ok ? "sent" : "failed";
  message.providerMessageSid = smsResult.sid;
  await message.save();

  lead.lastMessageAt = new Date();
  lead.ownerNotificationStatus = smsResult.ok ? "sent" : "failed";
  await lead.save();

  return res.status(smsResult.ok ? 201 : 500).json({
    message: serializeDoc(message.toObject()),
    lead: serializeDoc(lead.toObject()),
    smsResult
  });
});

export default router;
