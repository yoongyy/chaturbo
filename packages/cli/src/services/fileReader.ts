import fs from "fs";
import path from "path";
import { ScanFile } from "../types";

const allowedExt = new Set([".json", ".jsonl", ".md", ".txt", ".log"]);
const maxSizeBytes = 5 * 1024 * 1024;
const skippedDirs = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "vendor",
  "tmp",
  "temp"
]);
const ignoredFileNames = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "LICENSE.md"
]);
const pathSignal = /(openclaw|hermes|claude|gemini|cursor|chat|conversation|session|history|transcript|terminal|canvas|log|messages?)/i;
const contentSignal = /(error|failed|fixed|solved|setup|install|deploy|api|webhook|integration|openrouter|shopify|vercel|railway|mongodb|mt5|ctrader|ollama|telegram|whatsapp|automation)/i;
const workflowSignal = /(error|failed|fixed|solved|timeout|retry|exception|rate limit|429|webhook|oauth|deploy|installation)/i;
const conversationSignal = /("role"\s*:|"messages?"\s*:|"timestamp"\s*:|assistant|user|tool_call|command|stdout|stderr)/i;

function walk(dir: string, collector: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".DS_Store")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skippedDirs.has(entry.name)) continue;
      walk(fullPath, collector);
      continue;
    }

    if (ignoredFileNames.has(entry.name)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (allowedExt.has(ext)) {
      collector.push(fullPath);
    }
  }
}

export function readCandidateFiles(basePaths: string[]): ScanFile[] {
  const files: string[] = [];

  for (const base of basePaths) {
    const stats = fs.statSync(base);
    if (stats.isDirectory()) {
      walk(base, files);
    } else {
      files.push(base);
    }
  }

  const uniqueFiles = [...new Set(files)];
  const output: ScanFile[] = [];

  for (const filePath of uniqueFiles) {
    try {
      const stat = fs.statSync(filePath);
      if (stat.size > maxSizeBytes) {
        continue;
      }
      const content = fs.readFileSync(filePath, "utf-8");
      const ext = path.extname(filePath).toLowerCase();
      const pathLooksRelevant = pathSignal.test(filePath);
      const contentLooksRelevant = contentSignal.test(content);
      const looksLikeWorkflowLog = workflowSignal.test(content) && conversationSignal.test(content);

      // Avoid importing general docs/spec markdown files as workflows.
      if (ext === ".md" && !/(chat|conversation|session|history|transcript|terminal|canvas|log)/i.test(filePath)) {
        continue;
      }

      if (!pathLooksRelevant && !contentLooksRelevant) {
        continue;
      }
      if (!pathLooksRelevant && !looksLikeWorkflowLog) {
        continue;
      }
      output.push({ path: filePath, content });
    } catch {
      // Skip unreadable files.
      continue;
    }
  }

  return output;
}
