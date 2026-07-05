import { Document, Schema, Types, model } from "mongoose";
import type { LeadChannel } from "./Lead";

export interface IMessage extends Document {
  businessId: Types.ObjectId;
  leadId?: Types.ObjectId;
  direction: "inbound" | "outbound";
  channel: LeadChannel;
  from: string;
  to: string;
  body: string;
  mediaUrlsJson: string[];
  providerMessageSid?: string;
  status: "queued" | "sent" | "delivered" | "failed" | "received";
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true },
    direction: { type: String, enum: ["inbound", "outbound"], required: true, index: true },
    channel: { type: String, enum: ["sms", "mms", "email", "call"], required: true, index: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    mediaUrlsJson: [{ type: String }],
    providerMessageSid: { type: String, trim: true, index: true },
    status: { type: String, enum: ["queued", "sent", "delivered", "failed", "received"], default: "queued" }
  },
  { timestamps: true }
);

export const Message = model<IMessage>("Message", messageSchema);
