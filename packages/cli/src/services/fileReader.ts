import fs from "fs";
import path from "path";
import { ScanFile } from "../types";

const allowedExt = new Set([".json", ".jsonl", ".md", ".txt", ".log"]);
const maxSizeBytes = 5 * 1024 * 1024;

function walk(dir: string, collector: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, collector);
      continue;
    }

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
      output.push({ path: filePath, content });
    } catch {
      // Skip unreadable files.
      continue;
    }
  }

  return output;
}
