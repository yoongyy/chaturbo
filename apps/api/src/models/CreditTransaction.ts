import { Document, Schema, Types, model } from "mongoose";

export type CreditTransactionType = "topup" | "purchase_debit" | "sale_credit" | "payout_debit";
export type CreditTransactionSource = "stripe_checkout" | "agent_purchase" | "dashboard_purchase" | "manual";

export interface ICreditTransaction extends Document {
  ownerId: Types.ObjectId;
  type: CreditTransactionType;
  source: CreditTransactionSource;
  amount: number;
  stripeSessionId?: string;
  workflowId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["topup", "purchase_debit", "sale_credit", "payout_debit"], required: true },
    source: { type: String, enum: ["stripe_checkout", "agent_purchase", "dashboard_purchase", "manual"], required: true },
    amount: { type: Number, required: true },
    stripeSessionId: { type: String, index: true },
    workflowId: { type: Schema.Types.ObjectId, ref: "Workflow" },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

creditTransactionSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

export const CreditTransaction = model<ICreditTransaction>("CreditTransaction", creditTransactionSchema);
