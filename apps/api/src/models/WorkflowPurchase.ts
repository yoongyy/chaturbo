import { Document, Schema, Types, model } from "mongoose";

export interface IWorkflowPurchase extends Document {
  ownerId: Types.ObjectId;
  workflowId: Types.ObjectId;
  priceCredits: number;
  source: "dashboard" | "agent";
  createdAt: Date;
  updatedAt: Date;
}

const workflowPurchaseSchema = new Schema<IWorkflowPurchase>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    workflowId: { type: Schema.Types.ObjectId, ref: "Workflow", required: true, index: true },
    priceCredits: { type: Number, required: true, min: 0 },
    source: { type: String, enum: ["dashboard", "agent"], required: true }
  },
  { timestamps: true }
);

workflowPurchaseSchema.index({ ownerId: 1, workflowId: 1 }, { unique: true });

export const WorkflowPurchase = model<IWorkflowPurchase>("WorkflowPurchase", workflowPurchaseSchema);
