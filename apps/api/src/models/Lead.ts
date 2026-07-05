import { Document, Schema, Types, model } from "mongoose";

export type LeadStatus = "new" | "contacted" | "booked" | "won" | "lost" | "spam";
export type LeadSource = "website_apply_form" | "missed_call" | "sms" | "manual" | "audit";
export type LeadUrgency = "low" | "medium" | "high" | "emergency";
export type LeadChannel = "sms" | "mms" | "email" | "call";

export interface ILead extends Document {
  businessId?: Types.ObjectId;
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
  optedOutAt?: Date;
  callStatus?: string;
  lastMessageAt?: Date;
  ownerNotificationStatus?: "pending" | "sent" | "failed";
  notes?: string;
  conversationStateJson?: Record<string, unknown>;
  lastMissedCallSmsAt?: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", index: true },
    phone: { type: String, required: true, trim: true, index: true },
    name: { type: String, trim: true },
    source: {
      type: String,
      enum: ["website_apply_form", "missed_call", "sms", "manual", "audit"],
      default: "website_apply_form",
      index: true
    },
    status: {
      type: String,
      enum: ["new", "contacted", "booked", "won", "lost", "spam"],
      default: "new",
      index: true
    },
    urgency: { type: String, enum: ["low", "medium", "high", "emergency"], default: "medium", index: true },
    summary: { type: String, trim: true },
    city: { type: String, trim: true },
    serviceNeeded: { type: String, trim: true },
    preferredCallbackTime: { type: String, trim: true },
    hasPhotos: { type: Boolean, default: false },
    optedOut: { type: Boolean, default: false, index: true },
    optedOutAt: { type: Date },
    callStatus: { type: String, trim: true },
    lastMessageAt: { type: Date },
    ownerNotificationStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    notes: { type: String, trim: true },
    conversationStateJson: { type: Schema.Types.Mixed },
    lastMissedCallSmsAt: { type: Date },
    fullName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    industry: { type: String, trim: true },
    businessLocation: { type: String, trim: true },
    websiteOrSocial: { type: String, trim: true },
    taskToAutomate: { type: String, trim: true },
    customerMessageSources: [{ type: String }],
    customerMessageSourceOther: { type: String, trim: true },
    consent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

leadSchema.index({ businessId: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

export const Lead = model<ILead>("Lead", leadSchema);
