import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  credits: number;
  ownerUid: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    credits: { type: Number, default: 0 },
    ownerUid: {
      type: String,
      unique: true,
      required: true,
      default: () => `owner_${crypto.randomBytes(8).toString("hex")}`
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
