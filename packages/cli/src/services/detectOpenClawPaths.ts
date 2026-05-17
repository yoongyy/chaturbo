import path from "path";
import os from "os";
import fs from "fs";

export function detectOpenClawPaths(customPath?: string): string[] {
  if (customPath) {
    const absolute = path.resolve(customPath);
    return fs.existsSync(absolute) ? [absolute] : [];
  }

  const candidates = [
    path.join(os.homedir(), ".openclaw"),
    path.join(os.homedir(), ".config", "openclaw"),
    path.resolve(".openclaw"),
    path.resolve("openclaw"),
    path.join(os.homedir(), "OpenClaw")
  ];

  return [...new Set(candidates)].filter((p) => fs.existsSync(p));
}
