import { Document, Schema, Types, model } from "mongoose";

export type PayoutRequestStatus = "pending" | "approved" | "rejected" | "paid";

export interface IPayoutRequest extends Document {
  ownerId: Types.ObjectId;
  credits: number;
  usdAmount: number;
  status: PayoutRequestStatus;
  method: "stripe";
  destinationHint?: string;
  note?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const payoutRequestSchema = new Schema<IPayoutRequest>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    credits: { type: Number, required: true, min: 1 },
    usdAmount: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: ["pending", "approved", "rejected", "paid"], default: "pending", index: true },
    method: { type: String, enum: ["stripe"], default: "stripe" },
    destinationHint: { type: String },
    note: { type: String },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

export const PayoutRequest = model<IPayoutRequest>("PayoutRequest", payoutRequestSchema);
