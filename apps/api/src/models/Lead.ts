import { Document, Schema, model } from "mongoose";

export type LeadStatus = "new";
export type LeadSource = "website_apply_form";

export interface ILead extends Document {
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
  consent: boolean;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    industry: { type: String, required: true, trim: true },
    businessLocation: { type: String, required: true, trim: true },
    websiteOrSocial: { type: String, required: true, trim: true },
    taskToAutomate: { type: String, required: true, trim: true },
    customerMessageSources: [{ type: String, required: true }],
    customerMessageSourceOther: { type: String, trim: true },
    urgency: {
      type: String,
      required: true,
      enum: ["This week", "This month", "Just exploring"]
    },
    consent: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ["new"],
      default: "new"
    },
    source: {
      type: String,
      enum: ["website_apply_form"],
      default: "website_apply_form"
    }
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

export const Lead = model<ILead>("Lead", leadSchema);
