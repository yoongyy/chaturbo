import { Document, Schema, Types, model } from "mongoose";

export type CrawlStatus = "pending" | "crawled" | "failed";

export interface IAuditTarget extends Document {
  ownerId: Types.ObjectId;
  ownerUid: string;
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
  crawlStatus: CrawlStatus;
  extractedWebsiteText?: string;
  extractedTitle?: string;
  extractedDescription?: string;
  extractedPhoneNumbers: string[];
  status: "new" | "contacted" | "replied" | "demo_booked" | "converted";
  viewsCount: number;
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
 
const auditTargetSchema = new Schema<IAuditTarget>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerUid: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true, trim: true, index: true },
    industry: { type: String, required: true, trim: true, index: true },
    websiteUrl: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    ownerName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    googleProfileUrl: { type: String, trim: true },
    reviewCount: { type: Number },
    rating: { type: Number },
    notes: { type: String, trim: true },
    crawlStatus: { type: String, enum: ["pending", "crawled", "failed"], default: "pending" },
    extractedWebsiteText: { type: String },
    extractedTitle: { type: String },
    extractedDescription: { type: String },
    extractedPhoneNumbers: [{ type: String }],
    viewsCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date },
    status: {
      type: String,
      enum: ["new", "contacted", "replied", "demo_booked", "converted"],
      default: "new"
    }
  },
  { timestamps: true }
);

auditTargetSchema.index({ ownerId: 1, createdAt: -1 });

export const AuditTarget = model<IAuditTarget>("AuditTarget", auditTargetSchema);
