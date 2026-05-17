export interface WorkflowDraftPayload {
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
    commonErrors: Array<{ error: string; fix: string }>;
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
    riskLevel: "low" | "medium" | "high";
  };
  quality: {
    publishReadinessScore: number;
    missingFields: string[];
    reasonWhySellable: string;
  };
  status: "draft" | "published" | "rejected";
}

export interface ScanFile {
  path: string;
  content: string;
}
