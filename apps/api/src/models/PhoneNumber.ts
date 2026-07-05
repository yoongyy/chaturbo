import { Document, Schema, Types, model } from "mongoose";

export interface IPhoneNumber extends Document {
  businessId: Types.ObjectId;
  provider: "twilio";
  phoneNumber: string;
  twilioSid?: string;
  status: "active" | "inactive" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const phoneNumberSchema = new Schema<IPhoneNumber>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    provider: { type: String, enum: ["twilio"], default: "twilio" },
    phoneNumber: { type: String, required: true, trim: true, unique: true, index: true },
    twilioSid: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" }
  },
  { timestamps: true }
);

export const PhoneNumber = model<IPhoneNumber>("PhoneNumber", phoneNumberSchema);
