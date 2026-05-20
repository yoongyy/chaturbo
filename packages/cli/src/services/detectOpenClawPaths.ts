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
    path.join(os.homedir(), "OpenClaw"),
    path.join(os.homedir(), ".hermes"),
    path.join(os.homedir(), ".config", "hermes"),
    path.resolve(".hermes"),
    path.resolve("hermes"),
    path.join(os.homedir(), ".claude"),
    path.join(os.homedir(), ".config", "claude"),
    path.resolve(".claude"),
    path.resolve("claude"),
    path.join(os.homedir(), ".gemini"),
    path.join(os.homedir(), ".config", "gemini"),
    path.resolve(".gemini"),
    path.resolve("gemini"),
    path.join(os.homedir(), ".google-cli"),
    path.join(os.homedir(), ".config", "google-cli"),
    path.resolve(".google-cli"),
    path.join(os.homedir(), ".cursor"),
    path.join(os.homedir(), ".config", "Cursor"),
    path.join(os.homedir(), "AppData", "Roaming", "Cursor"),
    path.resolve(".cursor"),
    path.resolve("cursor")
  ];

  return [...new Set(candidates)].filter((p) => fs.existsSync(p));
}
