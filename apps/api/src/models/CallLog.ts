import { Document, Schema, Types, model } from "mongoose";

export interface ICallLog extends Document {
  businessId: Types.ObjectId;
  leadId?: Types.ObjectId;
  fromNumber: string;
  toNumber: string;
  twilioCallSid: string;
  status: string;
  duration?: number;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const callLogSchema = new Schema<ICallLog>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true },
    fromNumber: { type: String, required: true, trim: true, index: true },
    toNumber: { type: String, required: true, trim: true, index: true },
    twilioCallSid: { type: String, required: true, trim: true, unique: true, index: true },
    status: { type: String, required: true, index: true },
    duration: { type: Number },
    recordingUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export const CallLog = model<ICallLog>("CallLog", callLogSchema);
