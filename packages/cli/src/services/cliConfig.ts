import fs from "fs";
import path from "path";
import os from "os";

interface CliConfig {
  apiUrl: string;
  token?: string;
  ownerUid?: string;
  agentSecret?: string;
}

const defaultApiUrl = process.env.CHATURBO_API_URL || "http://localhost:4000";
const configDir = path.join(os.homedir(), ".config", "chaturbo");
const configPath = path.join(configDir, "config.json");

function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

export function getCliConfigPath(): string {
  return configPath;
}

export function loadCliConfig(): CliConfig {
  ensureConfigDir();
  if (!fs.existsSync(configPath)) {
    const initial: CliConfig = { apiUrl: defaultApiUrl };
    fs.writeFileSync(configPath, JSON.stringify(initial, null, 2));
    return initial;
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const parsed = JSON.parse(raw) as CliConfig;
  return {
    apiUrl: process.env.CHATURBO_API_URL || parsed.apiUrl || defaultApiUrl,
    token: parsed.token,
    ownerUid: parsed.ownerUid,
    agentSecret: parsed.agentSecret
  };
}

export function saveCliConfig(config: CliConfig) {
  ensureConfigDir();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function saveToken(token: string) {
  const config = loadCliConfig();
  config.token = token;
  saveCliConfig(config);
}

export function saveAgentCredentials(ownerUid: string, agentSecret: string) {
  const config = loadCliConfig();
  config.ownerUid = ownerUid;
  config.agentSecret = agentSecret;
  saveCliConfig(config);
}

export function saveApiUrl(apiUrl: string) {
  const config = loadCliConfig();
  config.apiUrl = apiUrl;
  saveCliConfig(config);
}
