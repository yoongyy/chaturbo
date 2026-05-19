import axios from "axios";
import prompts from "prompts";
import { loadCliConfig, saveAgentCredentials, saveApiUrl, saveLocalAgentCommand, saveToken } from "../services/cliConfig";
import { scanOpenClawCommand } from "./scanOpenClaw";
import { pairAgentCommand } from "./pairAgent";

interface ConnectOptions {
  path?: string;
  localOnly?: boolean;
  yes?: boolean;
  skipPair?: boolean;
  ownerId?: string;
  agentSecret?: string;
  apiUrl?: string;
  localAgentCmd?: string;
}

async function ensureAuthenticated(localOnly = false) {
  if (localOnly) {
    return;
  }

  const config = loadCliConfig();
  if (config.token) {
    return;
  }

  console.log("Connect requires login to upload drafts.\n");
  const response = await prompts([
    { type: "text", name: "email", message: "Email" },
    { type: "password", name: "password", message: "Password" }
  ]);

  if (!response.email || !response.password) {
    console.error("Login cancelled");
    process.exit(1);
  }

  const result = await axios.post(`${config.apiUrl}/auth/login`, {
    email: response.email,
    password: response.password
  });

  saveToken(result.data.token);
  console.log(`Logged in as ${result.data.user.email}`);
}

export async function connectCommand(options: ConnectOptions) {
  console.log("Connecting local AI agent to Chaturbo...\n");

  if (options.apiUrl) {
    saveApiUrl(options.apiUrl);
  }
  if (options.localAgentCmd) {
    saveLocalAgentCommand(options.localAgentCmd);
  }

  if (options.ownerId && options.agentSecret) {
    saveAgentCredentials(options.ownerId, options.agentSecret);
  }

  const hasDirectAgentCredentials = Boolean(options.ownerId && options.agentSecret);

  try {
    if (!hasDirectAgentCredentials) {
      await ensureAuthenticated(Boolean(options.localOnly));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.error || "Login failed");
      process.exit(1);
    }
    throw error;
  }

  if (!options.localOnly && !options.skipPair) {
    const config = loadCliConfig();
    if (!config.ownerUid || !config.agentSecret) {
      console.log("Pairing agent credentials for unattended sync...");
      await pairAgentCommand("local-agent");
    }
  }

  await scanOpenClawCommand({
    path: options.path,
    localOnly: options.localOnly,
    autoUpload: Boolean(options.yes || hasDirectAgentCredentials),
    nonInteractive: Boolean(hasDirectAgentCredentials),
    localAgentCmd: options.localAgentCmd
  });
}
