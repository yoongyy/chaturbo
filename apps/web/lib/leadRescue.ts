export type BusinessIndustry = "roofing" | "hvac" | "plumbing" | "electrical" | "landscaping" | "cleaning" | "other";
export type BusinessStatus = "draft" | "active" | "paused";
export type BusinessNotificationMethod = "sms" | "email" | "both";
export type BusinessPlan = "starter" | "pro" | "growth";
export type BillingStatus = "unpaid" | "trial" | "active" | "past_due" | "manual";
export type LeadStatus = "new" | "contacted" | "booked" | "won" | "lost" | "spam";
export type LeadUrgency = "low" | "medium" | "high" | "emergency";
export type LeadSource = "website_apply_form" | "missed_call" | "sms" | "manual" | "audit";

export interface Business {
  id: string;
  slug: string;
  name: string;
  industry: BusinessIndustry;
  ownerName?: string;
  ownerMobile?: string;
  ownerEmail?: string;
  websiteUrl?: string;
  city?: string;
  state?: string;
  serviceArea?: string;
  servicesJson: string[];
  businessHoursJson: Record<string, unknown>;
  emergencyService: boolean;
  googleReviewUrl?: string;
  calendarUrl?: string;
  twilioPhoneNumber?: string;
  twilioPhoneNumberSid?: string;
  aiTone?: string;
  notificationMethod: BusinessNotificationMethod;
  status: BusinessStatus;
  plan: BusinessPlan;
  billingStatus: BillingStatus;
  setupFeePaid: boolean;
  monthlyPrice: number;
  setupFeeAmount: number;
  setupFeeWaived: boolean;
  foundingCustomer: boolean;
  leadLimit: number;
  trialEndsAt?: string;
  demoMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumber {
  id: string;
  businessId: string;
  provider: "twilio";
  phoneNumber: string;
  twilioSid?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  businessId?: string;
  phone: string;
  name?: string;
  source: LeadSource;
  status: LeadStatus;
  urgency?: LeadUrgency;
  summary?: string;
  city?: string;
  serviceNeeded?: string;
  preferredCallbackTime?: string;
  hasPhotos?: boolean;
  optedOut?: boolean;
  optedOutAt?: string;
  callStatus?: string;
  lastMessageAt?: string;
  ownerNotificationStatus?: "pending" | "sent" | "failed";
  notes?: string;
  conversationStateJson?: Record<string, unknown>;
  lastMissedCallSmsAt?: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  industry?: string;
  businessLocation?: string;
  websiteOrSocial?: string;
  taskToAutomate?: string;
  customerMessageSources?: string[];
  customerMessageSourceOther?: string;
  consent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallLog {
  id: string;
  businessId: string;
  leadId?: string;
  fromNumber: string;
  toNumber: string;
  twilioCallSid: string;
  status: string;
  duration?: number;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  businessId: string;
  leadId?: string;
  direction: "inbound" | "outbound";
  channel: "sms" | "mms" | "email" | "call";
  from: string;
  to: string;
  body: string;
  mediaUrlsJson: string[];
  providerMessageSid?: string;
  status: "queued" | "sent" | "delivered" | "failed" | "received";
  createdAt: string;
  updatedAt: string;
}

export interface AuditTarget {
  id: string;
  slug: string;
  businessName: string;
  industry: string;
  websiteUrl?: string;
  city?: string;
  state?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  googleProfileUrl?: string;
  reviewCount?: number;
  rating?: number;
  notes?: string;
  crawlStatus: "pending" | "crawled" | "failed";
  extractedWebsiteText?: string;
  extractedTitle?: string;
  extractedDescription?: string;
  extractedPhoneNumbers: string[];
  status: "new" | "contacted" | "replied" | "demo_booked" | "converted";
  createdAt: string;
  updatedAt: string;
}

export interface Audit {
  id: string;
  auditTargetId: string;
  slug: string;
  summary: string;
  problemsJson: string[];
  recommendationsJson: string[];
  coldEmail: string;
  followupEmail1: string;
  followupEmail2: string;
  callScript: string;
  facebookMessage: string;
  contactFormMessage: string;
  videoScript: string;
  publicPageHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverviewResponse {
  stats: {
    newLeads: number;
    missedCallsRescued: number;
    bookedJobs: number;
    activeBusinesses: number;
    auditTargets: number;
  };
  recentLeads: Lead[];
  recentAudits: AuditTarget[];
  recentBusinesses: Business[];
  hasAssignedTwilioNumber?: boolean;
  checklist: Array<{ label: string; done: boolean }>;
}
