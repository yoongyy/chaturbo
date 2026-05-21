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
  const lower = text.toLowerCase();
  if (lower.includes("openrouter")) return "OpenRouter";
  if (lower.includes("shopify")) return "Shopify";
  if (/\boauth\b|redirect uri|callback/.test(lower)) return "OAuth";
  if (lower.includes("telegram")) return "Telegram";
  if (lower.includes("whatsapp")) return "WhatsApp";
  if (lower.includes("mt5")) return "MT5";
  if (lower.includes("ctrader")) return "cTrader";
  if (lower.includes("ollama") || lower.includes("local llm")) return "Ollama";
  if (lower.includes("vercel")) return "Vercel";
  if (lower.includes("railway")) return "Railway";
  if (lower.includes("mongodb") || lower.includes("mongo")) return "MongoDB";
  if (lower.includes("webhook")) return "Webhook";
  if (lower.includes("openclaw")) return "OpenClaw";
  if (lower.includes("hermes")) return "Hermes";
  if (lower.includes("claude")) return "Claude CLI";
  if (lower.includes("gemini") || lower.includes("google cli")) return "Gemini CLI";
  return "Local AI agent";
}

function titleQualifier(text: string): string {
  const lower = text.toLowerCase();
  if (/redirect_uri_mismatch|redirect uri|oauth/.test(lower)) return "OAuth callback";
  if (/429|rate limit|too many requests/.test(lower)) return "rate limit";
  if (/webhook|signature|hmac/.test(lower)) return "webhook verification";
  if (/timeout|timed out|etimedout/.test(lower)) return "timeout";
  if (/unauthorized|forbidden|401|403/.test(lower)) return "auth failure";
  if (/mongodb|connection string|db uri|econnrefused/.test(lower)) return "db connectivity";
  if (/vercel|railway|deploy|build failed/.test(lower)) return "deployment";
  if (/telegram|whatsapp|mt5|ctrader|order/.test(lower)) return "automation reliability";
  if (/openrouter|model fallback/.test(lower)) return "provider fallback";
  if (/ollama|local llm/.test(lower)) return "local model setup";
  return "troubleshooting";
}

function buildBaseTitle(text: string): string {
  const topic = strongestTopic(text);
  const qualifier = titleQualifier(text);
  if (!topic) return qualifier;
  return `${topic}: ${qualifier}`;
}

function shortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).slice(0, 4).toUpperCase().padStart(4, "0");
}

function stripMarkers(line: string): string {
  return normalizeSpace(
    line
      .replace(/\[REDACTED_[A-Z_]+\]/g, "")
      .replace(/`+/g, "")
      .replace(/https?:\/\/\S+/g, "URL")
      .replace(/(^|[\s:])([A-Za-z]:\\[^ ]+|\/[^ ]+)/g, "$1PATH")
  );
}

function scoreTitleLine(line: string): number {
  const lower = line.toLowerCase();
  let score = 0;
  if (/error|failed|exception|traceback|timeout|rate limit|429|oauth|redirect|webhook|unauthorized|forbidden/.test(lower)) score += 6;
  if (/fixed|solved|resolved|workaround|mitigation|fallback|retry|backoff/.test(lower)) score += 3;
  if (/\[redacted_/.test(lower)) score -= 2;
  if (/challenge-error-text|<!doctype|<html|<head|<body/.test(lower)) score -= 10;
  if (/^\{|\}$/.test(line.trim())) score -= 4;
  const len = line.length;
  if (len >= 35 && len <= 140) score += 4;
  if (len < 25) score -= 3;
  if (len > 180) score -= 3;
  return score;
}

function bestLine(lines: string[], pattern?: RegExp): string {
  const candidates = pattern ? lines.filter((l) => pattern.test(l)) : lines;
  let best = "";
  let bestScore = -Infinity;
  for (const line of candidates) {
    const cleaned = stripMarkers(line);
    if (!cleaned) continue;
    const score = scoreTitleLine(cleaned);
    if (score > bestScore) {
      bestScore = score;
      best = cleaned;
    }
  }
  return best;
}

function buildTitle(text: string): string {
  const lines = cleanLines(text);
  const issue = bestLine(lines, /(error|failed|exception|traceback|timeout|rate limit|429|oauth|redirect|webhook|unauthorized|forbidden|econnrefused|enotfound)/i)
    || bestLine(lines);
  const topic = strongestTopic(text);
  const qualifier = titleQualifier(text);

  const compactIssue = normalizeSpace(issue)
    .replace(/\s*-\s*/g, " - ")
    .replace(/^error[:\s-]*/i, "")
    .replace(/^failed[:\s-]*/i, "")
    .slice(0, 96);

  const base = compactIssue ? `${topic}: ${compactIssue}` : buildBaseTitle(text);
  const tag = shortHash(`${topic}|${qualifier}|${compactIssue}`.toLowerCase());
  const titled = base.length > 110 ? base.slice(0, 110) : base;
  // Only append a tag when the title is very generic, otherwise keep it clean.
  if (/^(local ai agent|openclaw|hermes|claude cli|gemini cli):\s*(troubleshooting|operational hardening|deployment|timeout|auth failure)$/i.test(titled)) {
    return `${titled} (${tag})`.slice(0, 120);
  }
  return titled.slice(0, 120);
}

function pickLines(text: string, count = 3): string[] {
  const lines = cleanLines(text);
  const issue = bestLine(lines, /(error|failed|exception|traceback|timeout|rate limit|429|oauth|redirect|webhook|unauthorized|forbidden|econnrefused|enotfound)/i);
  const fix = bestLine(lines, /(fixed|solved|resolved|workaround|mitigation|fallback|backoff|retry)/i);
  const picked: string[] = [];
  if (issue) picked.push(issue);
  if (fix && fix.toLowerCase() !== issue.toLowerCase()) picked.push(fix);
  for (const line of lines) {
    if (picked.length >= count) break;
    const cleaned = stripMarkers(line);
    if (!cleaned) continue;
    if (picked.some((p) => p.toLowerCase() === cleaned.toLowerCase())) continue;
    picked.push(cleaned);
  }
  return picked.slice(0, count);
}

function detectSymptoms(text: string): string[] {
  const lines = cleanLines(text).filter((line) => /error|failed|timeout|retry|exception/i.test(line)).slice(0, 5);

  return lines.length ? unique(lines) : [];
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
  const maxPerBaseTitle = 3;

  for (const file of files) {
    const { sanitizedText, removedItems } = sanitizeText(file.content);
    const keywordCount = findKeywordCount(sanitizedText);
    if (keywordCount < 3) {
      continue;
    }

    const summaryLines = pickLines(sanitizedText, 3);
    if (!summaryLines.length) {
      continue;
    }
    const symptoms = detectSymptoms(sanitizedText);
    if (!symptoms.length && keywordCount < 4) {
      continue;
    }
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
      title: buildTitle(sanitizedText),
      category: mapCategory(sanitizedText),
      summary:
        summaryLines.join(" ") ||
        "Sanitized troubleshooting flow extracted from local AI agent logs with reusable steps.",
      problem: {
        description: symptoms[0] || summaryLines[0],
        symptoms: symptoms.length ? symptoms : [summaryLines[0]]
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

  const grouped = new Map<string, WorkflowDraftPayload[]>();
  for (const draft of drafts) {
    const base = draft.title.replace(/\s+-\s+Case\s+[A-Z0-9]{4}$/i, "").trim();
    const list = grouped.get(base) || [];
    list.push(draft);
    grouped.set(base, list);
  }

  const filtered: WorkflowDraftPayload[] = [];
  for (const group of grouped.values()) {
    group.sort((a, b) => {
      const scoreDiff = (b.quality.publishReadinessScore || 0) - (a.quality.publishReadinessScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      const riskRank = (risk: "low" | "medium" | "high") => (risk === "low" ? 3 : risk === "medium" ? 2 : 1);
      const riskDiff = riskRank(b.privacy.riskLevel) - riskRank(a.privacy.riskLevel);
      if (riskDiff !== 0) return riskDiff;
      return (b.estimates.suggestedPriceCredits || 0) - (a.estimates.suggestedPriceCredits || 0);
    });
    filtered.push(...group.slice(0, maxPerBaseTitle));
  }

  return filtered;
}
