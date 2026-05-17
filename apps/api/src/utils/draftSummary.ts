import { IWorkflowDraft } from "../models/WorkflowDraft";

export function buildDraftSummary(drafts: IWorkflowDraft[]) {
  const detectedWorkflows = drafts.length;
  const publishReadyWorkflows = drafts.filter((d) => d.quality.publishReadinessScore >= 70).length;
  const needsCleanup = drafts.filter((d) => d.privacy.riskLevel !== "low").length;
  const estimatedMonthlyEarningLow = drafts.reduce((sum, d) => sum + d.estimates.potentialMonthlyRevenueLow, 0);
  const estimatedMonthlyEarningHigh = drafts.reduce((sum, d) => sum + d.estimates.potentialMonthlyRevenueHigh, 0);
  const totalEstimatedTokenCostInvested = drafts.reduce((sum, d) => sum + d.estimates.tokenCostUsd, 0);
  const totalEstimatedTimeSpent = drafts.reduce((sum, d) => sum + d.estimates.timeSpentHours, 0);

  return {
    detectedWorkflows,
    publishReadyWorkflows,
    needsCleanup,
    estimatedMonthlyEarningLow,
    estimatedMonthlyEarningHigh,
    totalEstimatedTokenCostInvested,
    totalEstimatedTimeSpent
  };
}
