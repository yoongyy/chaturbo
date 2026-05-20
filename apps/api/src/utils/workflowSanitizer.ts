const NOISE_PATTERNS = [
  /<html|<head|<body|<!doctype|<script|challenge-error-text/i,
  /"type"\s*:\s*"message"/i,
  /"usage"\s*:/i,
  /"cache(read|write)"/i
];

function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isNoiseLine(line: string): boolean {
  if (!line) return true;
  if (line.length < 20) return true;
  if (line.length > 320) return true;
  if (NOISE_PATTERNS.some((pattern) => pattern.test(line))) return true;
  if (/^[\[{].*[\]}]$/.test(line)) return true;
  return false;
}

function cleanLines(input: string): string[] {
  return input
    .replace(/\\n/g, "\n")
    .split(/\r?\n/)
    .map((line) => normalizeSpace(line))
    .filter((line) => !isNoiseLine(line));
}

function uniq(values: string[]): string[] {
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

export function normalizedTitleKey(input: string): string {
  return normalizeSpace(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanParagraph(input: string, fallback: string, maxLength = 320): string {
  const lines = cleanLines(input);
  const paragraph = normalizeSpace(lines.slice(0, 3).join(" "));
  if (!paragraph) return fallback;
  return paragraph.slice(0, maxLength);
}

export function cleanList(input: string[], fallback: string[] = []): string[] {
  const cleaned = uniq(
    input
      .map((item) => normalizeSpace(item || ""))
      .filter((item) => !isNoiseLine(item))
      .slice(0, 8)
  );
  return cleaned.length ? cleaned : fallback;
}

export function cleanDraftForStorage<T extends Record<string, any>>(draft: T): T {
  const fallbackSummary = "Reusable workflow extracted from sanitized local AI agent troubleshooting logs.";
  const fallbackProblem = "Recurring issue observed in agent execution flow requiring repeatable remediation steps.";
  const fallbackOverview = "Apply a deterministic remediation sequence, validate dependencies, and verify stable output.";

  return {
    ...draft,
    title: normalizeSpace(draft.title || "Agent workflow playbook"),
    category: normalizeSpace(draft.category || "troubleshooting").toLowerCase(),
    summary: cleanParagraph(draft.summary || "", fallbackSummary, 360),
    problem: {
      ...draft.problem,
      description: cleanParagraph(draft.problem?.description || "", fallbackProblem, 420),
      symptoms: cleanList(draft.problem?.symptoms || [], [
        "Task execution fails repeatedly",
        "Retries do not stabilize output"
      ])
    },
    solution: {
      ...draft.solution,
      overview: cleanParagraph(draft.solution?.overview || "", fallbackOverview, 380),
      steps: cleanList(draft.solution?.steps || [], [
        "Reproduce with a deterministic input and capture sanitized logs",
        "Apply the remediation sequence and reset conflicting state",
        "Run verification checks and confirm stable output"
      ]),
      doNotDo: cleanList(draft.solution?.doNotDo || [], [
        "Do not expose API keys",
        "Do not overwrite .env without backup",
        "Do not run destructive commands without confirmation"
      ]),
      commonErrors: (draft.solution?.commonErrors || [])
        .map((entry: { error?: string; fix?: string }) => ({
          error: cleanParagraph(entry?.error || "", "Execution error detected", 180),
          fix: cleanParagraph(entry?.fix || "", "Apply targeted fix and re-run validation", 180)
        }))
        .slice(0, 6),
      verificationSteps: cleanList(draft.solution?.verificationSteps || [], [
        "Confirm task completes without repeated error",
        "Confirm required API/service returns expected response",
        "Confirm logs do not expose secrets"
      ])
    }
  };
}
