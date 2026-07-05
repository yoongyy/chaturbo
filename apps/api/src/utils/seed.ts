import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDb } from "../config/db";
import { User } from "../models/User";
import { Business } from "../models/Business";
import { Lead } from "../models/Lead";
import { CallLog } from "../models/CallLog";
import { Message } from "../models/Message";
import { PhoneNumber } from "../models/PhoneNumber";
import { AuditTarget } from "../models/AuditTarget";
import { Audit } from "../models/Audit";
import { generateAudit } from "../services/leadRescue/ai";
import { slugify } from "./slug";

dotenv.config();

async function run() {
  await connectDb();

  const ownerEmail = "demo@chaturbo.local";
  const ownerPasswordHash = await bcrypt.hash("password123", 10);
  let owner = await User.findOneAndUpdate(
    { email: ownerEmail },
    {
      email: ownerEmail,
      name: "Demo Owner",
      passwordHash: ownerPasswordHash,
      role: "member"
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const adminEmail = "admin@chaturbo.local";
  const adminPasswordHash = await bcrypt.hash("password123", 10);
  let admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: "admin"
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await Promise.all([
    Lead.deleteMany({}),
    CallLog.deleteMany({}),
    Message.deleteMany({}),
    PhoneNumber.deleteMany({}),
    Audit.deleteMany({}),
    AuditTarget.deleteMany({}),
    Business.deleteMany({})
  ]);

  const roofingBusiness = await Business.create({
    ownerId: owner._id,
    ownerUid: owner.ownerUid,
    slug: slugify("Demo Roofing Company"),
    name: "Demo Roofing Company",
    industry: "roofing",
    ownerName: "Kenny Tan",
    ownerMobile: "+12125550101",
    ownerEmail: "roofing@example.com",
    websiteUrl: "https://example.com/roofing",
    city: "Dallas",
    state: "TX",
    serviceArea: "Dallas-Fort Worth",
    servicesJson: ["roof repair", "roof replacement", "emergency leak repair"],
    businessHoursJson: { monday: "8am-5pm", tuesday: "8am-5pm" },
    emergencyService: true,
    googleReviewUrl: "https://google.com",
    calendarUrl: "https://cal.com/demo",
    twilioPhoneNumber: "+12125550199",
    aiTone: "professional, concise, helpful",
    notificationMethod: "both",
    status: "active",
    plan: "starter",
    billingStatus: "manual",
    setupFeePaid: true,
    monthlyPrice: 79,
    setupFeeAmount: 299,
    setupFeeWaived: true,
    foundingCustomer: true,
    leadLimit: 50,
    demoMode: true
  });

  const hvacBusiness = await Business.create({
    ownerId: owner._id,
    ownerUid: owner.ownerUid,
    slug: slugify("Demo HVAC Company"),
    name: "Demo HVAC Company",
    industry: "hvac",
    ownerName: "Maya Lee",
    ownerMobile: "+12125550202",
    ownerEmail: "hvac@example.com",
    websiteUrl: "https://example.com/hvac",
    city: "Houston",
    state: "TX",
    serviceArea: "Houston Metro",
    servicesJson: ["AC repair", "AC replacement", "furnace service"],
    businessHoursJson: { monday: "7am-6pm", saturday: "8am-1pm" },
    emergencyService: true,
    googleReviewUrl: "https://google.com",
    calendarUrl: "https://cal.com/demo-hvac",
    twilioPhoneNumber: "+12125550303",
    aiTone: "friendly, fast, confident",
    notificationMethod: "both",
    status: "active",
    plan: "growth",
    billingStatus: "trial",
    setupFeePaid: true,
    monthlyPrice: 299,
    setupFeeAmount: 299,
    setupFeeWaived: false,
    foundingCustomer: false,
    leadLimit: 600,
    demoMode: true
  });

  await PhoneNumber.create([
    {
      businessId: roofingBusiness._id,
      provider: "twilio",
      phoneNumber: roofingBusiness.twilioPhoneNumber,
      twilioSid: "PNdemoRoofing",
      status: "active"
    },
    {
      businessId: hvacBusiness._id,
      provider: "twilio",
      phoneNumber: hvacBusiness.twilioPhoneNumber,
      twilioSid: "PNdemoHVAC",
      status: "active"
    }
  ]);

  const roofingLead = await Lead.create({
    businessId: roofingBusiness._id,
    phone: "+12125550901",
    name: "James",
    source: "missed_call",
    status: "new",
    urgency: "high",
    summary: "Active roof leak after storm.",
    city: "Dallas",
    serviceNeeded: "Roof leak repair",
    preferredCallbackTime: "ASAP",
    hasPhotos: true,
    optedOut: false,
    ownerNotificationStatus: "sent",
    conversationStateJson: {
      serviceNeeded: "Roof leak repair",
      city: "Dallas",
      urgency: "high",
      preferredCallbackTime: "ASAP",
      hasPhotos: true,
      questionStage: "complete"
    }
  });

  const hvacLead = await Lead.create({
    businessId: hvacBusiness._id,
    phone: "+12125550902",
    name: "Angela",
    source: "sms",
    status: "contacted",
    urgency: "medium",
    summary: "AC not cooling upstairs.",
    city: "Houston",
    serviceNeeded: "AC repair",
    preferredCallbackTime: "This afternoon",
    hasPhotos: false,
    optedOut: false,
    ownerNotificationStatus: "sent",
    conversationStateJson: {
      serviceNeeded: "AC repair",
      city: "Houston",
      urgency: "medium",
      preferredCallbackTime: "This afternoon",
      hasPhotos: false,
      questionStage: "complete"
    }
  });

  await Lead.create([
    {
      businessId: roofingBusiness._id,
      phone: "+12125550903",
      source: "manual",
      status: "booked",
      urgency: "high",
      summary: "Shingle replacement booked for Friday.",
      city: "Plano",
      serviceNeeded: "Shingle replacement",
      preferredCallbackTime: "Friday morning",
      hasPhotos: false,
      optedOut: false
    },
    {
      businessId: hvacBusiness._id,
      phone: "+12125550904",
      source: "audit",
      status: "new",
      urgency: "low",
      summary: "Prospect from audit follow-up.",
      city: "Houston",
      serviceNeeded: "Lead rescue audit",
      preferredCallbackTime: "Next week",
      hasPhotos: false,
      optedOut: false
    },
    {
      businessId: roofingBusiness._id,
      phone: "+12125550905",
      source: "sms",
      status: "won",
      urgency: "high",
      summary: "Emergency tarp and leak repair won.",
      city: "Dallas",
      serviceNeeded: "Leak repair",
      preferredCallbackTime: "Now",
      hasPhotos: true,
      optedOut: false
    }
  ]);

  const call = await CallLog.create({
    businessId: roofingBusiness._id,
    leadId: roofingLead._id,
    fromNumber: roofingLead.phone,
    toNumber: roofingBusiness.twilioPhoneNumber,
    twilioCallSid: "CA-demo-roofing",
    status: "no-answer",
    duration: 0
  });

  await Message.create([
    {
      businessId: roofingBusiness._id,
      leadId: roofingLead._id,
      direction: "inbound",
      channel: "sms",
      from: roofingLead.phone,
      to: roofingBusiness.twilioPhoneNumber,
      body: "My roof is leaking after the storm.",
      mediaUrlsJson: [],
      providerMessageSid: "SM-inbound-1",
      status: "received"
    },
    {
      businessId: roofingBusiness._id,
      leadId: roofingLead._id,
      direction: "outbound",
      channel: "sms",
      from: roofingBusiness.twilioPhoneNumber,
      to: roofingLead.phone,
      body: "Sorry we missed your call. What city are you in?",
      mediaUrlsJson: [],
      providerMessageSid: "SM-outbound-1",
      status: "sent"
    }
  ]);

  const targets = await AuditTarget.insertMany([
    {
      slug: slugify("Alpha Roofing Dallas"),
      ownerId: admin._id,
      ownerUid: admin.ownerUid,
      businessName: "Alpha Roofing Dallas",
      industry: "roofing",
      websiteUrl: "https://example.com/alpha-roofing",
      city: "Dallas",
      state: "TX",
      ownerName: "Paul Jones",
      email: "paul@example.com",
      phone: "+12125550111",
      googleProfileUrl: "https://google.com",
      reviewCount: 47,
      rating: 4.2,
      notes: "Strong local market fit",
      crawlStatus: "crawled",
      extractedWebsiteText: "Alpha Roofing Dallas offers roof repair, replacement, emergency service, and same-day quotes. Call now for a free estimate.",
      extractedTitle: "Alpha Roofing Dallas",
      extractedDescription: "Roof repair and replacement in Dallas",
      extractedPhoneNumbers: ["+12125550111"],
      status: "contacted"
    },
    {
      slug: slugify("Better HVAC Houston"),
      ownerId: admin._id,
      ownerUid: admin.ownerUid,
      businessName: "Better HVAC Houston",
      industry: "hvac",
      websiteUrl: "https://example.com/better-hvac",
      city: "Houston",
      state: "TX",
      ownerName: "Sandra Kim",
      email: "sandra@example.com",
      phone: "+12125550112",
      googleProfileUrl: "https://google.com",
      reviewCount: 31,
      rating: 4.5,
      notes: "Needs faster follow-up",
      crawlStatus: "crawled",
      extractedWebsiteText: "Better HVAC Houston repairs AC systems and installs new units. Contact us for service. Emergency repair available.",
      extractedTitle: "Better HVAC Houston",
      extractedDescription: "HVAC repair in Houston",
      extractedPhoneNumbers: ["+12125550112"],
      status: "new"
    },
    {
      slug: slugify("Prime Plumbing Austin"),
      ownerId: admin._id,
      ownerUid: admin.ownerUid,
      businessName: "Prime Plumbing Austin",
      industry: "plumbing",
      websiteUrl: "https://example.com/prime-plumbing",
      city: "Austin",
      state: "TX",
      ownerName: "Luis Martinez",
      email: "luis@example.com",
      phone: "+12125550113",
      googleProfileUrl: "https://google.com",
      reviewCount: 58,
      rating: 4.7,
      notes: "Ideal for missed-call recovery demo",
      crawlStatus: "pending",
      extractedPhoneNumbers: [],
      status: "new"
    }
  ]);

  const generatedAuditPayload = await generateAudit(targets[0] as any, (targets[0] as any).extractedWebsiteText || "");
  await Audit.create({
    ownerId: admin._id,
    ownerUid: admin.ownerUid,
    auditTargetId: targets[0]._id,
    slug: `${targets[0].slug}-audit`,
    summary: generatedAuditPayload.summary,
    problemsJson: generatedAuditPayload.problems,
    recommendationsJson: generatedAuditPayload.recommendations,
    coldEmail: generatedAuditPayload.coldEmail,
    followupEmail1: generatedAuditPayload.followupEmail1,
    followupEmail2: generatedAuditPayload.followupEmail2,
    callScript: generatedAuditPayload.callScript,
    facebookMessage: generatedAuditPayload.facebookMessage,
    contactFormMessage: generatedAuditPayload.contactFormMessage,
    videoScript: generatedAuditPayload.videoScript,
    publicPageHtml: generatedAuditPayload.publicPageHtml
  });

  console.log("Seed complete. Owner login: demo@chaturbo.local / password123");
  console.log("Admin login: admin@chaturbo.local / password123");
  console.log(`Created businesses: ${roofingBusiness.name}, ${hvacBusiness.name}`);
  console.log(`Created lead rescue call log: ${call.twilioCallSid}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
