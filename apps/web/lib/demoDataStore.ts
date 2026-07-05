import type {
  Audit,
  AuditTarget,
  Business,
  CallLog,
  Lead,
  Message,
  OverviewResponse,
  PhoneNumber
} from "./leadRescue";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type DemoStore = {
  users: DemoUser[];
  businesses: Business[];
  phoneNumbers: PhoneNumber[];
  leads: Lead[];
  calls: CallLog[];
  messages: Message[];
  auditTargets: AuditTarget[];
  audits: Audit[];
};

type CreateBusinessInput = Omit<Business, "id" | "slug" | "createdAt" | "updatedAt"> & { name: string };
type UpdateBusinessInput = Partial<Omit<Business, "id" | "slug" | "createdAt" | "updatedAt">>;
type CreatePhoneNumberInput = { phoneNumber: string; twilioSid?: string; status: PhoneNumber["status"] };
type UpdateLeadInput = Partial<Pick<Lead, "status" | "urgency" | "notes" | "summary">>;
type CreateAuditTargetInput = Omit<
  AuditTarget,
  | "id"
  | "slug"
  | "createdAt"
  | "updatedAt"
  | "crawlStatus"
  | "extractedWebsiteText"
  | "extractedTitle"
  | "extractedDescription"
  | "extractedPhoneNumbers"
  | "status"
> & { businessName: string; industry: string };

const DEFAULT_USER = {
  id: "web_demo_chaturbo_local",
  name: "Demo Admin",
  email: "demo@chaturbo.local",
  password: "password123"
};

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createAuditCopy(target: AuditTarget): Audit {
  const createdAt = nowIso();
  return {
    id: makeId("audit"),
    auditTargetId: target.id,
    slug: `${target.slug}-audit`,
    summary: `${target.businessName} is missing a fast missed-call rescue flow and likely loses high-intent leads after hours and during busy periods.`,
    problemsJson: [
      "Calls that go unanswered do not trigger an immediate text-back.",
      "No clean AI qualification flow is visible for urgent service requests.",
      "Owner follow-up appears manual, which slows down bookings."
    ],
    recommendationsJson: [
      "Forward every inbound call and send a text-back the moment the owner misses it.",
      "Ask one short question at a time and summarize the lead for the owner.",
      "Route urgent jobs to the owner immediately and mark booked jobs inside the dashboard."
    ],
    coldEmail: `Subject: ${target.businessName} is likely losing missed-call revenue\n\nI reviewed ${target.businessName} and found a missed-call gap that can be fixed with an AI text-back workflow.`,
    followupEmail1: `Following up on the missed-call audit for ${target.businessName}.`,
    followupEmail2: `Last follow-up on the missed-call rescue system for ${target.businessName}.`,
    callScript: `Hi, I reviewed ${target.businessName} and found a simple way to recover missed calls before customers book elsewhere.`,
    facebookMessage: `I made a short audit for ${target.businessName}. It shows how to recover missed calls automatically.`,
    contactFormMessage: `I reviewed ${target.businessName} and built a short lead rescue audit with clear fixes.`,
    videoScript: `This audit shows where ${target.businessName} loses speed after missed calls and how an AI text-back flow would recover those leads.`,
    publicPageHtml: `<h1>${target.businessName}</h1><p>Lead rescue audit</p>`,
    createdAt,
    updatedAt: createdAt
  };
}

function createInitialStore(): DemoStore {
  const createdAt = nowIso();
  const businesses: Business[] = [
    {
      id: "business_demo_1",
      slug: "demo-roofing-company",
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
      twilioPhoneNumberSid: "PN_DEMO_ROOFING",
      aiTone: "professional, concise, helpful",
      notificationMethod: "both",
      status: "active",
      plan: "setup",
      billingStatus: "manual",
      setupFeePaid: false,
      monthlyPrice: 149,
      demoMode: true,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "business_demo_2",
      slug: "demo-hvac-company",
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
      twilioPhoneNumberSid: "PN_DEMO_HVAC",
      aiTone: "friendly, fast, confident",
      notificationMethod: "both",
      status: "active",
      plan: "monthly",
      billingStatus: "trial",
      setupFeePaid: true,
      monthlyPrice: 149,
      demoMode: true,
      createdAt,
      updatedAt: createdAt
    }
  ];

  const leads: Lead[] = [
    {
      id: "lead_demo_1",
      businessId: "business_demo_1",
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
      callStatus: "no_answer",
      lastMessageAt: createdAt,
      ownerNotificationStatus: "sent",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "lead_demo_2",
      businessId: "business_demo_2",
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
      callStatus: "completed",
      lastMessageAt: createdAt,
      ownerNotificationStatus: "sent",
      createdAt,
      updatedAt: createdAt
    }
  ];

  const calls: CallLog[] = [
    {
      id: "call_demo_1",
      businessId: "business_demo_1",
      leadId: "lead_demo_1",
      fromNumber: "+12125550901",
      toNumber: "+12125550199",
      twilioCallSid: "CA_DEMO_1",
      status: "missed",
      createdAt,
      updatedAt: createdAt
    }
  ];

  const messages: Message[] = [
    {
      id: "message_demo_1",
      businessId: "business_demo_1",
      leadId: "lead_demo_1",
      direction: "outbound",
      channel: "sms",
      from: "+12125550199",
      to: "+12125550901",
      body: "Sorry we missed your call. What service do you need today?",
      mediaUrlsJson: [],
      status: "sent",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "message_demo_2",
      businessId: "business_demo_1",
      leadId: "lead_demo_1",
      direction: "inbound",
      channel: "sms",
      from: "+12125550901",
      to: "+12125550199",
      body: "Roof leak after the storm. Need help ASAP.",
      mediaUrlsJson: [],
      status: "received",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "message_demo_3",
      businessId: "business_demo_2",
      leadId: "lead_demo_2",
      direction: "inbound",
      channel: "sms",
      from: "+12125550902",
      to: "+12125550303",
      body: "Our upstairs AC stopped cooling this morning.",
      mediaUrlsJson: [],
      status: "received",
      createdAt,
      updatedAt: createdAt
    }
  ];

  const phoneNumbers: PhoneNumber[] = [
    {
      id: "phone_demo_1",
      businessId: "business_demo_1",
      provider: "twilio",
      phoneNumber: "+12125550199",
      twilioSid: "PN_DEMO_ROOFING",
      status: "active",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "phone_demo_2",
      businessId: "business_demo_2",
      provider: "twilio",
      phoneNumber: "+12125550303",
      twilioSid: "PN_DEMO_HVAC",
      status: "active",
      createdAt,
      updatedAt: createdAt
    }
  ];

  const auditTargets: AuditTarget[] = [
    {
      id: "audit_target_1",
      slug: "alpha-roofing-dallas",
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
      extractedWebsiteText:
        "Alpha Roofing Dallas offers roof repair, replacement, emergency service, and same-day quotes. Call now for a free estimate.",
      extractedTitle: "Alpha Roofing Dallas",
      extractedDescription: "Roof repair and replacement in Dallas",
      extractedPhoneNumbers: ["+12125550111"],
      status: "contacted",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "audit_target_2",
      slug: "rapid-hvac-houston",
      businessName: "Rapid HVAC Houston",
      industry: "hvac",
      websiteUrl: "https://example.com/rapid-hvac",
      city: "Houston",
      state: "TX",
      ownerName: "Sara Lim",
      email: "sara@example.com",
      phone: "+12125550112",
      googleProfileUrl: "https://google.com",
      reviewCount: 89,
      rating: 4.6,
      notes: "High review count, weak missed-call follow-up",
      crawlStatus: "pending",
      extractedPhoneNumbers: [],
      status: "new",
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "audit_target_3",
      slug: "metro-plumbing-austin",
      businessName: "Metro Plumbing Austin",
      industry: "plumbing",
      websiteUrl: "https://example.com/metro-plumbing",
      city: "Austin",
      state: "TX",
      ownerName: "Darren Wu",
      email: "darren@example.com",
      phone: "+12125550113",
      googleProfileUrl: "https://google.com",
      reviewCount: 34,
      rating: 4,
      notes: "Good fit for emergency call triage demo",
      crawlStatus: "pending",
      extractedPhoneNumbers: [],
      status: "new",
      createdAt,
      updatedAt: createdAt
    }
  ];

  const audits = [createAuditCopy(auditTargets[0])];

  return {
    users: [DEFAULT_USER],
    businesses,
    phoneNumbers,
    leads,
    calls,
    messages,
    auditTargets,
    audits
  };
}

let store = createInitialStore();

function requireBusiness(id: string): Business {
  const business = store.businesses.find((item) => item.id === id);
  if (!business) {
    throw new Error("Business not found");
  }
  return business;
}

function requireLead(id: string): Lead {
  const lead = store.leads.find((item) => item.id === id);
  if (!lead) {
    throw new Error("Lead not found");
  }
  return lead;
}

function requireAuditTarget(id: string): AuditTarget {
  const target = store.auditTargets.find((item) => item.id === id);
  if (!target) {
    throw new Error("Audit target not found");
  }
  return target;
}

export function registerDemoUser(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const existing = store.users.find((user) => user.email === email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const user = {
    id: `web_${email.replace(/[^a-z0-9]+/g, "_")}`,
    name: input.name.trim(),
    email,
    password: input.password
  };
  store.users.unshift(user);
  return clone(user);
}

export function findDemoUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find((item) => item.email === normalizedEmail && item.password === password);
  return user ? clone(user) : null;
}

export function createApplicationLead(input: {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  industry: string;
  businessLocation: string;
  websiteOrSocial: string;
  taskToAutomate: string;
  customerMessageSources: string[];
  customerMessageSourceOther?: string;
  urgency: "This week" | "This month" | "Just exploring";
  consent: true;
}) {
  const createdAt = nowIso();
  const lead: Lead = {
    id: makeId("lead"),
    phone: input.phone,
    source: "website_apply_form",
    status: "new",
    urgency: input.urgency === "This week" ? "high" : input.urgency === "This month" ? "medium" : "low",
    summary: input.taskToAutomate,
    fullName: input.fullName,
    companyName: input.companyName,
    email: input.email,
    industry: input.industry,
    businessLocation: input.businessLocation,
    websiteOrSocial: input.websiteOrSocial,
    taskToAutomate: input.taskToAutomate,
    customerMessageSources: input.customerMessageSources,
    customerMessageSourceOther: input.customerMessageSourceOther,
    consent: true,
    createdAt,
    updatedAt: createdAt
  };
  store.leads.unshift(lead);
  return clone(lead);
}

export function getDemoOverview(): OverviewResponse {
  const newLeads = store.leads.filter((lead) => lead.status === "new").length;
  const bookedJobs = store.leads.filter((lead) => lead.status === "booked" || lead.status === "won").length;
  const activeBusinesses = store.businesses.filter((business) => business.status === "active").length;
  const missedCallsRescued = store.leads.filter((lead) => lead.source === "missed_call" && lead.ownerNotificationStatus === "sent").length;

  return clone({
    stats: {
      newLeads,
      missedCallsRescued,
      bookedJobs,
      activeBusinesses,
      auditTargets: store.auditTargets.length
    },
    recentLeads: store.leads.slice(0, 5),
    recentAudits: store.auditTargets.slice(0, 5),
    recentBusinesses: store.businesses.slice(0, 5),
    hasAssignedTwilioNumber: store.businesses.some((business) => Boolean(business.twilioPhoneNumber)),
    checklist: [
      { label: "Create your first business", done: store.businesses.length > 0 },
      { label: "Assign a Twilio number", done: store.phoneNumbers.length > 0 },
      { label: "Add an audit target", done: store.auditTargets.length > 0 },
      { label: "Seed demo data", done: true },
      { label: "Configure webhooks", done: false }
    ]
  });
}

export function listBusinesses() {
  return clone(store.businesses);
}

export function createBusiness(input: CreateBusinessInput) {
  const createdAt = nowIso();
  const business: Business = {
    ...input,
    id: makeId("business"),
    slug: slugify(input.name) || makeId("business"),
    createdAt,
    updatedAt: createdAt
  };
  store.businesses.unshift(business);
  return clone(business);
}

export function getBusinessPayload(id: string) {
  const business = requireBusiness(id);
  return clone({
    business,
    leads: store.leads.filter((lead) => lead.businessId === id),
    calls: store.calls.filter((call) => call.businessId === id),
    messages: store.messages.filter((message) => message.businessId === id),
    phoneNumbers: store.phoneNumbers.filter((item) => item.businessId === id)
  });
}

export function updateBusiness(id: string, patch: UpdateBusinessInput) {
  const business = requireBusiness(id);
  Object.assign(business, patch, { updatedAt: nowIso() });
  return clone(business);
}

export function assignPhoneNumber(id: string, input: CreatePhoneNumberInput) {
  const business = requireBusiness(id);
  const current = store.phoneNumbers.find((item) => item.businessId === id && item.phoneNumber === input.phoneNumber);
  const updatedAt = nowIso();

  if (current) {
    current.twilioSid = input.twilioSid;
    current.status = input.status;
    current.updatedAt = updatedAt;
  } else {
    store.phoneNumbers.unshift({
      id: makeId("phone"),
      businessId: id,
      provider: "twilio",
      phoneNumber: input.phoneNumber,
      twilioSid: input.twilioSid,
      status: input.status,
      createdAt: updatedAt,
      updatedAt
    });
  }

  business.twilioPhoneNumber = input.phoneNumber;
  business.twilioPhoneNumberSid = input.twilioSid;
  business.updatedAt = updatedAt;
  return clone(business);
}

export function listLeads(filters?: { businessId?: string; status?: string; source?: string }) {
  const results = store.leads.filter((lead) => {
    if (filters?.businessId && lead.businessId !== filters.businessId) return false;
    if (filters?.status && lead.status !== filters.status) return false;
    if (filters?.source && lead.source !== filters.source) return false;
    return true;
  });
  return clone(results);
}

export function getLeadPayload(id: string) {
  const lead = requireLead(id);
  return clone({
    lead,
    business: lead.businessId ? store.businesses.find((item) => item.id === lead.businessId) || null : null,
    messages: store.messages.filter((message) => message.leadId === id)
  });
}

export function updateLead(id: string, patch: UpdateLeadInput) {
  const lead = requireLead(id);
  Object.assign(lead, patch, { updatedAt: nowIso() });
  return clone(lead);
}

export function sendLeadReply(id: string, body: string, to?: string) {
  const lead = requireLead(id);
  const business = lead.businessId ? requireBusiness(lead.businessId) : null;
  if (!business) {
    throw new Error("Associated business not found");
  }

  const createdAt = nowIso();
  const message: Message = {
    id: makeId("message"),
    businessId: business.id,
    leadId: lead.id,
    direction: "outbound",
    channel: "sms",
    from: business.twilioPhoneNumber || "+10000000000",
    to: to || lead.phone,
    body,
    mediaUrlsJson: [],
    status: "sent",
    createdAt,
    updatedAt: createdAt
  };

  store.messages.push(message);
  lead.lastMessageAt = createdAt;
  lead.ownerNotificationStatus = "sent";
  lead.updatedAt = createdAt;

  return clone({ message, lead });
}

export function listAuditTargets() {
  return clone(store.auditTargets);
}

export function createAuditTarget(input: CreateAuditTargetInput) {
  const createdAt = nowIso();
  const target: AuditTarget = {
    ...input,
    id: makeId("audit_target"),
    slug: slugify(input.businessName) || makeId("audit-target"),
    crawlStatus: "pending",
    extractedPhoneNumbers: [],
    status: "new",
    createdAt,
    updatedAt: createdAt
  };
  store.auditTargets.unshift(target);
  return clone(target);
}

export function getAuditTargetPayload(id: string) {
  const target = requireAuditTarget(id);
  return clone({
    target,
    audits: store.audits.filter((audit) => audit.auditTargetId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export function crawlAuditTarget(id: string) {
  const target = requireAuditTarget(id);
  const updatedAt = nowIso();
  target.crawlStatus = "crawled";
  target.extractedTitle = target.businessName;
  target.extractedDescription = `${target.industry} services in ${target.city || "the local market"}`;
  target.extractedWebsiteText =
    target.extractedWebsiteText ||
    `${target.businessName} offers ${target.industry} services with emergency response and fast estimate follow-up.`;
  target.extractedPhoneNumbers = target.phone ? [target.phone] : [];
  target.updatedAt = updatedAt;
  return clone(target);
}

export function generateAudit(id: string) {
  const target = requireAuditTarget(id);
  if (target.crawlStatus !== "crawled") {
    crawlAuditTarget(id);
  }
  const audit = createAuditCopy(target);
  store.audits.unshift(audit);
  target.updatedAt = audit.createdAt;
  return clone(audit);
}

export function convertAuditTarget(id: string) {
  const target = requireAuditTarget(id);
  const existing = store.businesses.find((business) => business.name === target.businessName);
  if (existing) {
    target.status = "converted";
    target.updatedAt = nowIso();
    return clone(existing);
  }

  const business = createBusiness({
    name: target.businessName,
    industry:
      target.industry === "roofing" ||
      target.industry === "hvac" ||
      target.industry === "plumbing" ||
      target.industry === "electrical" ||
      target.industry === "landscaping" ||
      target.industry === "cleaning"
        ? target.industry
        : "other",
    ownerName: target.ownerName,
    ownerMobile: target.phone,
    ownerEmail: target.email,
    websiteUrl: target.websiteUrl,
    city: target.city,
    state: target.state,
    serviceArea: [target.city, target.state].filter(Boolean).join(", "),
    servicesJson: [],
    businessHoursJson: {},
    emergencyService: false,
    googleReviewUrl: target.googleProfileUrl,
    calendarUrl: "",
    twilioPhoneNumber: "",
    twilioPhoneNumberSid: "",
    aiTone: "professional, concise, helpful",
    notificationMethod: "both",
    status: "draft",
    plan: "setup",
    billingStatus: "manual",
    setupFeePaid: false,
    monthlyPrice: 149,
    trialEndsAt: "",
    demoMode: false
  });

  target.status = "converted";
  target.updatedAt = nowIso();
  return business;
}

export function getPublicAudit(slug: string) {
  const audit = store.audits.find((item) => item.slug === slug);
  if (!audit) {
    return null;
  }
  const target = store.auditTargets.find((item) => item.id === audit.auditTargetId) || null;
  return clone({ audit, target });
}
