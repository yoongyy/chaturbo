import { Document, Schema, Types, model } from "mongoose";

export type BusinessIndustry = "roofing" | "hvac" | "plumbing" | "electrical" | "landscaping" | "cleaning" | "other";
export type BusinessStatus = "draft" | "active" | "paused";
export type BusinessNotificationMethod = "sms" | "email" | "both";
export type BusinessPlan = "setup" | "monthly" | "agency";
export type BillingStatus = "unpaid" | "trial" | "active" | "past_due" | "manual";

export interface IBusiness extends Document {
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
  trialEndsAt?: Date;
  demoMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, enum: ["roofing", "hvac", "plumbing", "electrical", "landscaping", "cleaning", "other"], index: true },
    ownerName: { type: String, trim: true },
    ownerMobile: { type: String, trim: true },
    ownerEmail: { type: String, trim: true, lowercase: true },
    websiteUrl: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    serviceArea: { type: String, trim: true },
    servicesJson: [{ type: String }],
    businessHoursJson: { type: Schema.Types.Mixed, default: {} },
    emergencyService: { type: Boolean, default: false },
    googleReviewUrl: { type: String, trim: true },
    calendarUrl: { type: String, trim: true },
    twilioPhoneNumber: { type: String, trim: true, index: true },
    twilioPhoneNumberSid: { type: String, trim: true },
    aiTone: { type: String, trim: true, default: "professional, concise, helpful" },
    notificationMethod: { type: String, enum: ["sms", "email", "both"], default: "both" },
    status: { type: String, enum: ["draft", "active", "paused"], default: "draft", index: true },
    plan: { type: String, enum: ["setup", "monthly", "agency"], default: "setup" },
    billingStatus: { type: String, enum: ["unpaid", "trial", "active", "past_due", "manual"], default: "manual" },
    setupFeePaid: { type: Boolean, default: false },
    monthlyPrice: { type: Number, default: 149 },
    trialEndsAt: { type: Date },
    demoMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

businessSchema.index({ name: 1 });
businessSchema.index({ status: 1, industry: 1 });

export const Business = model<IBusiness>("Business", businessSchema);
