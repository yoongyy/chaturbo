import { Document, Schema, Types, model } from "mongoose";

export type WorkflowStatus = "published" | "unlisted" | "archived";

export interface IWorkflow extends Document {
  ownerId: Types.ObjectId;
  draftId: Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  summary: string;
  priceCredits: number;
  fullContent: Record<string, unknown>;
  previewContent: Record<string, unknown>;
  compatibility: Record<string, unknown>;
  stats: {
    purchases: number;
    successfulRuns: number;
    failedRuns: number;
    rating: number;
  };
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

const workflowSchema = new Schema<IWorkflow>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    draftId: { type: Schema.Types.ObjectId, ref: "WorkflowDraft", required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    priceCredits: { type: Number, required: true },
    fullContent: { type: Schema.Types.Mixed, required: true },
    previewContent: { type: Schema.Types.Mixed, required: true },
    compatibility: { type: Schema.Types.Mixed, required: true },
    stats: {
      purchases: { type: Number, default: 0 },
      successfulRuns: { type: Number, default: 0 },
      failedRuns: { type: Number, default: 0 },
      rating: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ["published", "unlisted", "archived"],
      default: "published"
    }
  },
  { timestamps: true }
);

export const Workflow = model<IWorkflow>("Workflow", workflowSchema);
