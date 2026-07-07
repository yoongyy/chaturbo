import { Router } from "express";
import { Types } from "mongoose";
import { Business } from "../models/Business";
import { CallLog } from "../models/CallLog";
import { Lead } from "../models/Lead";
import { Message } from "../models/Message";
import { EventLog } from "../models/EventLog";
import { PhoneNumber } from "../models/PhoneNumber";
import { sendEmail, sendSms, makeCall, getAppUrl, getSmsTwiml, getVoiceTwiml, validateTwilioSignature } from "../services/leadRescue/communications";
import { buildFollowupQuestion, isStartMessage, isStopMessage, shouldSendMissedCallSms, updateConversationState } from "../services/leadRescue/conversation";
import { generateSmsReply, summarizeLead, classifyLeadUrgency } from "../services/leadRescue/ai";
import { normalizePhone, safeJson, serializeDoc } from "../services/leadRescue/utils";

const router = Router();

function getMediaUrls(body: Record<string, unknown>): string[] {
  const count = Number(body.NumMedia || 0);
  const urls: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const value = body[`MediaUrl${i}`];
    if (typeof value === "string" && value) urls.push(value);
  }
  return urls;
}

async function findBusinessByNumber(number: string) {
  const normalized = normalizePhone(number);
  const phoneNumber = await Business.findOne({ twilioPhoneNumber: normalized }).lean();
  if (phoneNumber) return phoneNumber;
  const assigned = await PhoneNumber.findOne({ phoneNumber: normalized }).lean();
  if (assigned?.businessId) {
    return Business.findById(assigned.businessId).lean();
  }
  return Business.findOne({ twilioPhoneNumber: number }).lean();
}

async function getOrCreateLead(businessId: Types.ObjectId | string, phone: string) {
  const normalizedPhone = normalizePhone(phone);
  let lead = await Lead.findOne({ businessId, phone: normalizedPhone });
  if (lead) return lead;

  lead = await Lead.create({
    businessId,
    phone: normalizedPhone,
    source: "missed_call",
    status: "new",
    urgency: "medium",
    optedOut: false,
    ownerNotificationStatus: "pending",
    conversationStateJson: { questionStage: "service", turns: 0 }
  });
  return lead;
}

function buildMissedCallMessage(businessName: string): string {
  return `Hi, this is ${businessName}. Sorry we missed your call. What service do you need, and what city are you in? You can also send a photo here. Reply STOP to opt out.`;
}

router.post("/voice/incoming", async (req, res) => {
  const params = req.body as Record<string, string>;
  const fullUrl = `${getAppUrl()}${req.originalUrl}`;
  if (!validateTwilioSignature(fullUrl, params, req.header("x-twilio-signature"))) {
    return res.status(403).send("Invalid signature");
  }

  const from = params.From || "";
  const to = params.To || "";
  const callSid = params.CallSid || "";

  const business = await findBusinessByNumber(to);
  if (!business) {
    return res.send(getVoiceTwiml("Sorry, this number is not configured.", "", `${getAppUrl()}/api/twilio/voice/status`));
  }

  const lead = await getOrCreateLead(business._id, from);
  const callLog = await CallLog.create({
    businessId: business._id,
    leadId: lead._id,
    fromNumber: normalizePhone(from),
    toNumber: normalizePhone(to),
    twilioCallSid: callSid,
    status: "ringing"
  });

  lead.callStatus = "ringing";
  lead.source = "missed_call";
  await lead.save();

  await EventLog.create({
    type: "call.incoming",
    entityType: "call",
    entityId: callLog._id.toString(),
    payloadJson: { from, to, callSid }
  });

  const ownerNumber = business.ownerMobile || "";
  if (!ownerNumber) {
    return res.send(getVoiceTwiml("We are unable to forward this call right now.", "", `${getAppUrl()}/api/twilio/voice/status`));
  }

  const statusCallbackUrl = `${getAppUrl()}/api/twilio/voice/status`;
  return res.send(getVoiceTwiml("Please hold while we connect you.", normalizePhone(ownerNumber), statusCallbackUrl));
});

router.post("/voice/status", async (req, res) => {
  const params = req.body as Record<string, string>;
  const fullUrl = `${getAppUrl()}${req.originalUrl}`;
  if (!validateTwilioSignature(fullUrl, params, req.header("x-twilio-signature"))) {
    return res.status(403).send("Invalid signature");
  }

  const callSid = params.CallSid || params.DialCallSid || "";
  const dialStatus = params.DialCallStatus || params.CallStatus || "";
  const callLog = await CallLog.findOne({ twilioCallSid: callSid });
  if (!callLog) {
    return res.status(200).send("ok");
  }

  callLog.status = dialStatus || callLog.status;
  callLog.duration = params.DialCallDuration ? Number(params.DialCallDuration) : callLog.duration;
  await callLog.save();

  const business = await Business.findById(callLog.businessId);
  const lead = callLog.leadId ? await Lead.findById(callLog.leadId) : null;

  if (business && lead && ["no-answer", "busy", "failed", "canceled"].includes(dialStatus) && shouldSendMissedCallSms(lead)) {
    const body = buildMissedCallMessage(business.name);
    const smsResult = await sendSms(lead.phone, body);
    await Message.create({
      businessId: business._id,
      leadId: lead._id,
      direction: "outbound",
      channel: "sms",
      from: business.twilioPhoneNumber || "",
      to: lead.phone,
      body,
      mediaUrlsJson: [],
      providerMessageSid: smsResult.sid,
      status: smsResult.ok ? "sent" : "failed"
    });
    lead.lastMissedCallSmsAt = new Date();
    lead.lastMessageAt = new Date();
    lead.ownerNotificationStatus = smsResult.ok ? "sent" : "failed";
    await lead.save();
  }

  return res.status(200).send("ok");
});

router.post("/sms/incoming", async (req, res) => {
  const params = req.body as Record<string, string>;
  const fullUrl = `${getAppUrl()}${req.originalUrl}`;
  if (!validateTwilioSignature(fullUrl, params, req.header("x-twilio-signature"))) {
    return res.status(403).send("Invalid signature");
  }

  const from = params.From || "";
  const to = params.To || "";
  const body = params.Body || "";
  const mediaUrls = getMediaUrls(params as Record<string, unknown>);

  const business = await findBusinessByNumber(to);
  if (!business) {
    return res.send(getSmsTwiml("Sorry, this number is not configured."));
  }

  const lead = await getOrCreateLead(business._id, from);
  await Message.create({
    businessId: business._id,
    leadId: lead._id,
    direction: "inbound",
    channel: mediaUrls.length ? "mms" : "sms",
    from: normalizePhone(from),
    to: normalizePhone(to),
    body,
    mediaUrlsJson: mediaUrls,
    providerMessageSid: params.MessageSid,
    status: "received"
  });

  lead.lastMessageAt = new Date();
  lead.hasPhotos = lead.hasPhotos || mediaUrls.length > 0;
  lead.source = lead.source === "website_apply_form" ? "sms" : lead.source;
  await lead.save();

  if (isStopMessage(body)) {
    lead.optedOut = true;
    lead.optedOutAt = new Date();
    await lead.save();
    const responseText = "You are opted out. Reply START to re-enable texts.";
    await Message.create({
      businessId: business._id,
      leadId: lead._id,
      direction: "outbound",
      channel: "sms",
      from: business.twilioPhoneNumber || "",
      to: lead.phone,
      body: responseText,
      mediaUrlsJson: [],
      status: "sent"
    });
    return res.send(getSmsTwiml(responseText));
  }

  if (isStartMessage(body)) {
    lead.optedOut = false;
    await lead.save();
    const responseText = "Thanks. Texts are back on. How can we help?";
    await Message.create({
      businessId: business._id,
      leadId: lead._id,
      direction: "outbound",
      channel: "sms",
      from: business.twilioPhoneNumber || "",
      to: lead.phone,
      body: responseText,
      mediaUrlsJson: [],
      status: "sent"
    });
    return res.send(getSmsTwiml(responseText));
  }

  const snapshot = safeJson<Record<string, unknown>>(lead.conversationStateJson || {}, {});
  const updatedState = updateConversationState(snapshot as any, body, mediaUrls.length > 0);
  lead.conversationStateJson = updatedState as unknown as Record<string, unknown>;
  lead.serviceNeeded = updatedState.serviceNeeded || lead.serviceNeeded;
  lead.city = updatedState.city || lead.city;
  lead.preferredCallbackTime = updatedState.preferredCallbackTime || lead.preferredCallbackTime;
  lead.hasPhotos = updatedState.hasPhotos || lead.hasPhotos;
  lead.urgency = updatedState.urgency || lead.urgency;
  lead.status = updatedState.questionStage === "complete" ? "contacted" : lead.status;
  await lead.save();

  const { reply } = await generateSmsReply(updatedState, business, lead);
  const responseText = reply || buildFollowupQuestion(updatedState);

  await Message.create({
    businessId: business._id,
    leadId: lead._id,
    direction: "outbound",
    channel: "sms",
    from: business.twilioPhoneNumber || "",
    to: lead.phone,
    body: responseText,
    mediaUrlsJson: [],
    status: "sent"
  });

  if (updatedState.questionStage === "complete" || (updatedState.serviceNeeded && updatedState.city && updatedState.preferredCallbackTime)) {
    const summary = await summarizeLead(updatedState, business, lead);
    lead.summary = summary;
    lead.urgency = (await classifyLeadUrgency(updatedState)) as any;
    await lead.save();

    const ownerSummary = `New ${business.industry} lead:\n${summary}`;
    const ownerNotificationMethod = business.notificationMethod || "both";
    const ownerSmsSent = ownerNotificationMethod === "sms" || ownerNotificationMethod === "both"
      ? await sendSms(business.ownerMobile || "", ownerSummary)
      : { ok: true };
    if (ownerNotificationMethod === "email" || ownerNotificationMethod === "both") {
      await sendEmail(
        business.ownerEmail || "",
        `New ${business.industry} lead from ${lead.phone}`,
        `<pre>${ownerSummary}</pre>`,
        ownerSummary
      );
    }

    lead.ownerNotificationStatus = ownerSmsSent.ok ? "sent" : "failed";
    await lead.save();
  }

  return res.send(getSmsTwiml(responseText));
});

router.post("/demo/test-call", async (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const normalizedPhone = normalizePhone(phone);
  
  // Find default admin user to assign as owner of the demo business
  const { User } = require("../models/User");
  let admin = await User.findOne({ role: "admin" });
  if (!admin) admin = await User.findOne({});
  if (!admin) {
    return res.status(500).json({ error: "No admin user found. Seed the database first." });
  }

  // Find or create a demo business "Apex Roofing AI"
  const fromNumber = process.env.TWILIO_DEFAULT_FROM_NUMBER || "+15017122661"; // Fallback demo number
  let business = await Business.findOne({ name: "Apex Roofing AI" });
  if (!business) {
    business = await Business.create({
      ownerId: admin._id,
      ownerUid: admin.ownerUid || "admin",
      name: "Apex Roofing AI",
      slug: "apex-roofing-ai",
      industry: "roofing",
      twilioPhoneNumber: normalizePhone(fromNumber),
      ownerMobile: admin.mobile || normalizedPhone,
      ownerEmail: admin.email,
      notificationMethod: "both"
    });
  }

  // Clear/create a fresh demo lead for this phone number
  await Lead.deleteOne({ businessId: business._id, phone: normalizedPhone });
  const lead = await Lead.create({
    businessId: business._id,
    phone: normalizedPhone,
    source: "missed_call",
    status: "new",
    urgency: "medium",
    optedOut: false,
    ownerNotificationStatus: "pending",
    conversationStateJson: { questionStage: "service", turns: 0 }
  });

  const twiml = '<Response><Say>Simulating missed call from Chaturbo. Please hang up to receive your auto text.</Say><Delay length="4"/><Hangup/></Response>';
  
  console.log(`[Demo] Calling user ${normalizedPhone} to simulate missed call...`);
  const callResult = await makeCall(normalizedPhone, twiml);

  // If mock mode (no Twilio configured), trigger the SMS simulation immediately
  const isMock = callResult.sid === "mock-call-sid";

  // Send the missed call SMS 6 seconds later
  const smsBody = buildMissedCallMessage(business.name);
  setTimeout(async () => {
    console.log(`[Demo] Sending rescue SMS to ${normalizedPhone}...`);
    const smsResult = await sendSms(normalizedPhone, smsBody);
    
    await Message.create({
      businessId: business._id,
      leadId: lead._id,
      direction: "outbound",
      channel: "sms",
      from: business.twilioPhoneNumber || "",
      to: lead.phone,
      body: smsBody,
      mediaUrlsJson: [],
      providerMessageSid: smsResult.sid,
      status: smsResult.ok ? "sent" : "failed"
    });

    lead.lastMissedCallSmsAt = new Date();
    lead.lastMessageAt = new Date();
    await lead.save();
  }, 6000);

  return res.json({
    success: true,
    mode: isMock ? "mock" : "real",
    businessId: business._id,
    leadId: lead._id
  });
});

export default router;
