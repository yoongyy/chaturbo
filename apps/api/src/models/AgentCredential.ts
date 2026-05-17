import { Document, Schema, Types, model } from "mongoose";

export interface IAgentCredential extends Document {
  ownerId: Types.ObjectId;
  ownerUid: string;
  name: string;
  secretHash: string;
  active: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const agentCredentialSchema = new Schema<IAgentCredential>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerUid: { type: String, required: true, index: true },
    name: { type: String, required: true, default: "openclaw-agent" },
    secretHash: { type: String, required: true },
    active: { type: Boolean, default: true },
    lastUsedAt: Date
  },
  { timestamps: true }
);

agentCredentialSchema.index({ ownerUid: 1, active: 1 });

export const AgentCredential = model<IAgentCredential>("AgentCredential", agentCredentialSchema);
