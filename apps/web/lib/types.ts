export interface Draft {
  _id: string;
  title: string;
  category: string;
  summary: string;
  status: "draft" | "published" | "rejected";
  problem: { description: string; symptoms: string[] };
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
}

export interface Workflow {
  _id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  priceCredits: number;
  previewContent: {
    title: string;
    category: string;
    summary: string;
    problemDescription: string;
    compatibility: Draft["compatibility"];
    estimates: Draft["estimates"];
    qualityScore: number;
    riskLevel: "low" | "medium" | "high";
  };
  compatibility: Draft["compatibility"];
  stats: {
    purchases: number;
    successfulRuns: number;
    failedRuns: number;
    rating: number;
  };
  status: "published" | "unlisted" | "archived";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
