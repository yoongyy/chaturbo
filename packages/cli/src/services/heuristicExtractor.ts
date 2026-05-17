import os from "os";
import path from "path";
import { ScanFile, WorkflowDraftPayload } from "../types";
import { sanitizeText } from "./sanitizer";

const keywords = [
  "error",
  "failed",
  "fixed",
  "solved",
  "setup",
  "install",
  "deploy",
  "api",
  "webhook",
  "integration",
  "openrouter",
  "shopify",
  "vercel",
  "railway",
  "mongodb",
  "mt5",
  "ctrader",
  "openclaw",
  "local llm",
  "ollama",
  "telegram",
  "whatsapp",
  "automation"
];

const doNotDoDefaults = [
  "Do not expose API keys",
  "Do not overwrite .env without backup",
  "Do not keep retrying failed API calls forever",
  "Do not run destructive commands without confirmation"
];

const verificationDefaults = [
  "Confirm task completes without repeated error",
  "Confirm required service/API returns expected response",
  "Confirm logs do not expose secrets"
];

function findKeywordCount(text: string): number {
  const lower = text.toLowerCase();
  return keywords.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0);
}

function mapCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("shopify") || lower.includes("oauth") || lower.includes("webhook")) return "integration";
  if (lower.includes("deploy") || lower.includes("vercel") || lower.includes("railway")) return "deployment";
  if (lower.includes("ollama") || lower.includes("local llm")) return "ai-infra";
  if (lower.includes("telegram") || lower.includes("whatsapp") || lower.includes("mt5") || lower.includes("ctrader")) return "automation";
  if (lower.includes("mongodb") || lower.includes("database")) return "database";
  return "troubleshooting";
}

function strongestTopic(text: string): string {
  const topicRules: Array<{ keyword: string; title: string }> = [
    { keyword: "openrouter", title: "OpenRouter API reliability workflow" },
    { keyword: "shopify", title: "Shopify integration stabilization workflow" },
    { keyword: "telegram", title: "Telegram automation recovery workflow" },
    { keyword: "mt5", title: "MT5 execution bridge workflow" },
    { keyword: "ctrader", title: "cTrader integration workflow" },
    { keyword: "ollama", title: "Local LLM Ollama setup workflow" },
    { keyword: "vercel", title: "Vercel deployment troubleshooting workflow" },
    { keyword: "railway", title: "Railway deployment troubleshooting workflow" },
    { keyword: "mongodb", title: "MongoDB connection reliability workflow" },
    { keyword: "webhook", title: "Webhook integration hardening workflow" },
    { keyword: "openclaw", title: "OpenClaw agent workflow optimization" }
  ];

  const lower = text.toLowerCase();
  const hit = topicRules.find((t) => lower.includes(t.keyword));
  return hit?.title ?? "Agent workflow troubleshooting playbook";
}

function pickLines(text: string, count = 3): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 20 && !line.startsWith("{"))
    .slice(0, count);
}

function detectSymptoms(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /error|failed|timeout|retry|exception/i.test(line))
    .slice(0, 5);

  return lines.length ? lines : ["Task fails intermittently", "Retries increase without stable completion"];
}

function detectSteps(text: string): string[] {
  const candidate = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line) || /npm |node |python |pip |curl |docker /i.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ""))
    .slice(0, 6);

  if (candidate.length >= 3) {
    return candidate;
  }

  return [
    "Reproduce the issue with a deterministic input and capture sanitized logs",
    "Apply the known fix sequence and remove conflicting config/state",
    "Run verification checks and confirm expected API/service output"
  ];
}

function buildCompatibility(text: string) {
  const lower = text.toLowerCase();
  const requiredTools = new Set<string>();
  const agents: string[] = [];
  const requiredSoftware: Record<string, string> = {};

  if (lower.includes("openclaw")) agents.push("OpenClaw");
  if (/package\.json|npm|node/.test(lower)) {
    requiredTools.add("node");
    requiredSoftware.node = ">=18";
  }
  if (/python|pip/.test(lower)) {
    requiredTools.add("python");
    requiredSoftware.python = ">=3.10";
  }
  if (/command|terminal|bash|zsh|shell/.test(lower)) requiredTools.add("terminal");
  if (/web|dashboard|oauth|browser/.test(lower)) requiredTools.add("browser");

  const modelRequirement = /api|deploy|webhook|code|stack trace|exception/.test(lower)
    ? "advanced_coding"
    : "intermediate";

  return {
    agents: agents.length ? agents : ["OpenClaw"],
    os: ["macOS", "Linux", "Windows"],
    minRamGb: /local llm|ollama/.test(lower) ? 16 : 8,
    requiredTools: Array.from(requiredTools),
    requiredSoftware,
    modelRequirement,
    contextLength: /local llm|deploy|integration/.test(lower) ? 16000 : 8000
  };
}

function riskLevel(removedCount: number): "low" | "medium" | "high" {
  if (removedCount >= 6) return "high";
  if (removedCount >= 3) return "medium";
  return "low";
}

function estimateValues(text: string, keywordCount: number, errors: number) {
  const lengthScore = Math.max(1, Math.round(text.length / 2500));
  const timeSpentHours = Math.min(24, Math.max(1, lengthScore + errors * 0.5));
  const tokenCostUsd = Number((0.2 + lengthScore * 0.35 + errors * 0.15).toFixed(2));
  const suggestedPriceCredits = Math.round(10 + keywordCount * 2 + errors * 3);
  const potentialMonthlyRevenueLow = suggestedPriceCredits * 4;
  const potentialMonthlyRevenueHigh = suggestedPriceCredits * 15;

  return {
    timeSpentHours,
    tokenCostUsd,
    suggestedPriceCredits,
    potentialMonthlyRevenueLow,
    potentialMonthlyRevenueHigh
  };
}

function qualityScore(summaryLines: string[], steps: string[], removedCount: number, keywordCount: number): number {
  let score = 45;
  score += Math.min(20, summaryLines.length * 6);
  score += Math.min(20, steps.length * 3);
  score += Math.min(15, keywordCount * 2);
  score -= removedCount >= 6 ? 15 : removedCount >= 3 ? 8 : 0;
  return Math.max(35, Math.min(98, score));
}

export function extractWorkflowDrafts(files: ScanFile[]): WorkflowDraftPayload[] {
  const drafts: WorkflowDraftPayload[] = [];

  for (const file of files) {
    const { sanitizedText, removedItems } = sanitizeText(file.content);
    const keywordCount = findKeywordCount(sanitizedText);
    if (keywordCount < 3) {
      continue;
    }

    const summaryLines = pickLines(sanitizedText, 3);
    const symptoms = detectSymptoms(sanitizedText);
    const steps = detectSteps(sanitizedText);
    const errorsDetected = symptoms.length;
    const estimates = estimateValues(sanitizedText, keywordCount, errorsDetected);
    const compatibility = buildCompatibility(sanitizedText);
    const score = qualityScore(summaryLines, steps, removedItems.length, keywordCount);
    const missingFields: string[] = [];

    if (steps.length < 3) missingFields.push("Detailed execution steps");
    if (!summaryLines.length) missingFields.push("Clear summary");

    const pathRedacted = file.path.replace(os.homedir(), "~");

    drafts.push({
      source: {
        type: "openclaw",
        path: pathRedacted,
        sessionId: path.basename(file.path),
        scannedAt: new Date()
      },
      title: strongestTopic(sanitizedText),
      category: mapCategory(sanitizedText),
      summary:
        summaryLines.join(" ") ||
        "Sanitized troubleshooting flow extracted from OpenClaw logs with reusable steps.",
      problem: {
        description:
          symptoms[0] ||
          "Recurring execution issues and integration instability identified in workflow logs.",
        symptoms
      },
      solution: {
        overview:
          pickLines(
            sanitizedText
              .split(/\r?\n/)
              .filter((line) => /fixed|solved|deploy|install|resolution/i.test(line))
              .join("\n"),
            1
          )[0] || "Apply structured remediation, validate integrations, and harden configuration for repeatability.",
        steps,
        doNotDo: doNotDoDefaults,
        commonErrors: symptoms.slice(0, 3).map((error) => ({ error, fix: "Trace root cause from sanitized logs, then apply targeted config/code fix." })),
        verificationSteps: verificationDefaults
      },
      compatibility,
      estimates,
      privacy: {
        sanitized: true,
        removedItems,
        riskLevel: riskLevel(removedItems.length)
      },
      quality: {
        publishReadinessScore: score,
        missingFields,
        reasonWhySellable:
          "Captures a resolved, repeatable workflow that can save troubleshooting time for other agent operators."
      },
      status: "draft"
    });
  }

  return drafts;
}
