import { Document, Schema, Types, model } from "mongoose";

export interface IAudit extends Document {
  auditTargetId: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const auditSchema = new Schema<IAudit>(
  {
    auditTargetId: { type: Schema.Types.ObjectId, ref: "AuditTarget", required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    problemsJson: [{ type: String }],
    recommendationsJson: [{ type: String }],
    coldEmail: { type: String, required: true },
    followupEmail1: { type: String, required: true },
    followupEmail2: { type: String, required: true },
    callScript: { type: String, required: true },
    facebookMessage: { type: String, required: true },
    contactFormMessage: { type: String, required: true },
    videoScript: { type: String, required: true },
    publicPageHtml: { type: String, required: true }
  },
  { timestamps: true }
);

export const Audit = model<IAudit>("Audit", auditSchema);
