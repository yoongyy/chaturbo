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
  "hermes",
  "claude",
  "gemini",
  "google cli",
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

const noisePatterns = [
  /<html|<head|<body|<!doctype|<script|challenge-error-text/i,
  /"type"\s*:\s*"message"/i,
  /"usage"\s*:/i,
  /"cache(read|write)"/i
];

function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function looksNoisy(line: string): boolean {
  if (!line) return true;
  if (line.length < 20) return true;
  if (line.length > 320) return true;
  if (noisePatterns.some((pattern) => pattern.test(line))) return true;
  if (/^[\[{].*[\]}]$/.test(line)) return true;
  return false;
}

function cleanLines(text: string): string[] {
  return text
    .replace(/\\n/g, "\n")
    .split(/\r?\n/)
    .map((line) => normalizeSpace(line).replace(/^(?:[#>*-]|\d+[.)])\s*/g, "").replace(/^\[[^\]]+\]\s*/g, ""))
    .filter((line) => !looksNoisy(line));
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function titleKey(value: string): string {
  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function problemKey(value: string): string {
  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

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
    { keyword: "openclaw", title: "OpenClaw agent workflow optimization" },
    { keyword: "hermes", title: "Hermes agent workflow optimization" },
    { keyword: "claude", title: "Claude CLI agent workflow optimization" },
    { keyword: "gemini", title: "Gemini CLI agent workflow optimization" }
  ];

  const lower = text.toLowerCase();
  const hit = topicRules.find((t) => lower.includes(t.keyword));
  return hit?.title ?? "Agent workflow troubleshooting playbook";
}

function pickLines(text: string, count = 3): string[] {
  return cleanLines(text).slice(0, count);
}

function detectSymptoms(text: string): string[] {
  const lines = cleanLines(text).filter((line) => /error|failed|timeout|retry|exception/i.test(line)).slice(0, 5);

  return lines.length ? unique(lines) : ["Task fails intermittently", "Retries increase without stable completion"];
}

function detectSteps(text: string): string[] {
  const candidate = cleanLines(text)
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
  if (lower.includes("hermes")) agents.push("Hermes");
  if (lower.includes("claude")) agents.push("Claude CLI");
  if (lower.includes("gemini") || lower.includes("google cli")) agents.push("Gemini CLI");
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
    agents: agents.length ? agents : ["Any local AI agent"],
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
  const seenByTitle = new Map<string, WorkflowDraftPayload>();

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

    const builtDraft: WorkflowDraftPayload = {
      source: {
        type: "agent_log",
        path: pathRedacted,
        sessionId: path.basename(file.path),
        scannedAt: new Date()
      },
      title: strongestTopic(sanitizedText),
      category: mapCategory(sanitizedText),
      summary:
        summaryLines.join(" ") ||
        "Sanitized troubleshooting flow extracted from local AI agent logs with reusable steps.",
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
    };

    const key = `${titleKey(`${builtDraft.title}|${builtDraft.category}`)}|${problemKey(builtDraft.problem.description)}`;
    const existing = seenByTitle.get(key);
    if (!existing) {
      seenByTitle.set(key, builtDraft);
      continue;
    }

    const mergedSymptoms = unique([...existing.problem.symptoms, ...builtDraft.problem.symptoms]).slice(0, 6);
    const mergedSteps = unique([...existing.solution.steps, ...builtDraft.solution.steps]).slice(0, 8);
    const mergedRemovedItems = unique([...existing.privacy.removedItems, ...builtDraft.privacy.removedItems]);
    const mergedReadiness = Math.max(existing.quality.publishReadinessScore, builtDraft.quality.publishReadinessScore);

    seenByTitle.set(key, {
      ...existing,
      summary: existing.summary.length >= builtDraft.summary.length ? existing.summary : builtDraft.summary,
      problem: {
        description:
          existing.problem.description.length >= builtDraft.problem.description.length
            ? existing.problem.description
            : builtDraft.problem.description,
        symptoms: mergedSymptoms
      },
      solution: {
        ...existing.solution,
        steps: mergedSteps,
        commonErrors: unique(
          [...existing.solution.commonErrors, ...builtDraft.solution.commonErrors].map((entry) => `${entry.error}|||${entry.fix}`)
        )
          .slice(0, 6)
          .map((encoded) => {
            const [error, fix] = encoded.split("|||");
            return { error, fix };
          })
      },
      compatibility: {
        ...existing.compatibility,
        agents: unique([...existing.compatibility.agents, ...builtDraft.compatibility.agents]),
        requiredTools: unique([...existing.compatibility.requiredTools, ...builtDraft.compatibility.requiredTools]),
        requiredSoftware: { ...existing.compatibility.requiredSoftware, ...builtDraft.compatibility.requiredSoftware },
        minRamGb: Math.max(existing.compatibility.minRamGb, builtDraft.compatibility.minRamGb),
        contextLength: Math.max(existing.compatibility.contextLength, builtDraft.compatibility.contextLength),
        modelRequirement:
          existing.compatibility.modelRequirement === "advanced_coding" ||
          builtDraft.compatibility.modelRequirement === "advanced_coding"
            ? "advanced_coding"
            : "intermediate"
      },
      estimates: {
        timeSpentHours: Math.max(existing.estimates.timeSpentHours, builtDraft.estimates.timeSpentHours),
        tokenCostUsd: Number(
          Math.max(existing.estimates.tokenCostUsd, builtDraft.estimates.tokenCostUsd).toFixed(2)
        ),
        suggestedPriceCredits: Math.max(
          existing.estimates.suggestedPriceCredits,
          builtDraft.estimates.suggestedPriceCredits
        ),
        potentialMonthlyRevenueLow: Math.max(
          existing.estimates.potentialMonthlyRevenueLow,
          builtDraft.estimates.potentialMonthlyRevenueLow
        ),
        potentialMonthlyRevenueHigh: Math.max(
          existing.estimates.potentialMonthlyRevenueHigh,
          builtDraft.estimates.potentialMonthlyRevenueHigh
        )
      },
      privacy: {
        sanitized: true,
        removedItems: mergedRemovedItems,
        riskLevel: riskLevel(mergedRemovedItems.length)
      },
      quality: {
        ...existing.quality,
        publishReadinessScore: mergedReadiness
      }
    });
  }

  for (const merged of seenByTitle.values()) {
    drafts.push(merged);
  }

  return drafts;
}
