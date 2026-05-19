import { Document, Schema, Types, model } from "mongoose";

export type RiskLevel = "low" | "medium" | "high";
export type DraftStatus = "draft" | "published" | "rejected";

interface ICommonError {
  error: string;
  fix: string;
}

export interface IWorkflowDraft extends Document {
  ownerId: Types.ObjectId;
  source: {
    type: string;
    path?: string;
    sessionId?: string;
    scannedAt: Date;
  };
  title: string;
  category: string;
  summary: string;
  problem: {
    description: string;
    symptoms: string[];
  };
  solution: {
    overview: string;
    steps: string[];
    doNotDo: string[];
    commonErrors: ICommonError[];
    verificationSteps: string[];
  };
  compatibility: {
    agents: string[];
    os: string[];
    minRamGb: number;
    requiredTools: string[];
    requiredSoftware: Record<string, string>;
    modelRequirement: string;
    contextLength: number;
  };
  estimates: {
    timeSpentHours: number;
    tokenCostUsd: number;
    suggestedPriceCredits: number;
    potentialMonthlyRevenueLow: number;
    potentialMonthlyRevenueHigh: number;
  };
  privacy: {
    sanitized: boolean;
    removedItems: string[];
    riskLevel: RiskLevel;
  };
  quality: {
    publishReadinessScore: number;
    missingFields: string[];
    reasonWhySellable: string;
  };
  status: DraftStatus;
  createdAt: Date;
  updatedAt: Date;
}

const workflowDraftSchema = new Schema<IWorkflowDraft>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: {
      type: {
        type: String,
        required: true,
        default: "agent_log"
      },
      path: String,
      sessionId: String,
      scannedAt: { type: Date, required: true, default: Date.now }
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    problem: {
      description: { type: String, required: true },
      symptoms: [{ type: String }]
    },
    solution: {
      overview: { type: String, required: true },
      steps: [{ type: String }],
      doNotDo: [{ type: String }],
      commonErrors: [
        {
          error: { type: String },
          fix: { type: String }
        }
      ],
      verificationSteps: [{ type: String }]
    },
    compatibility: {
      agents: [{ type: String }],
      os: [{ type: String }],
      minRamGb: { type: Number, default: 8 },
      requiredTools: [{ type: String }],
      requiredSoftware: { type: Schema.Types.Mixed, default: {} },
      modelRequirement: { type: String, default: "intermediate" },
      contextLength: { type: Number, default: 8000 }
    },
    estimates: {
      timeSpentHours: { type: Number, default: 0 },
      tokenCostUsd: { type: Number, default: 0 },
      suggestedPriceCredits: { type: Number, default: 0 },
      potentialMonthlyRevenueLow: { type: Number, default: 0 },
      potentialMonthlyRevenueHigh: { type: Number, default: 0 }
    },
    privacy: {
      sanitized: { type: Boolean, default: true },
      removedItems: [{ type: String }],
      riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" }
    },
    quality: {
      publishReadinessScore: { type: Number, default: 0 },
      missingFields: [{ type: String }],
      reasonWhySellable: { type: String, default: "" }
    },
    status: {
      type: String,
      enum: ["draft", "published", "rejected"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export const WorkflowDraft = model<IWorkflowDraft>("WorkflowDraft", workflowDraftSchema);
