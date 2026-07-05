import { Document, Schema, model } from "mongoose";

export interface IEventLog extends Document {
  type: string;
  entityType: string;
  entityId: string;
  payloadJson: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const eventLogSchema = new Schema<IEventLog>(
  {
    type: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    payloadJson: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const EventLog = model<IEventLog>("EventLog", eventLogSchema);
