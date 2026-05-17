import axios from "axios";
import prompts from "prompts";
import { loadCliConfig, saveAgentCredentials } from "../services/cliConfig";

export async function pairAgentCommand(name?: string) {
  const config = loadCliConfig();

  if (!config.token) {
    console.error("Please login first: chaturbo login");
    process.exit(1);
  }

  let finalName = name;
  if (!finalName) {
    const response = await prompts({
      type: "text",
      name: "name",
      message: "Agent credential name",
      initial: "openclaw-agent"
    });
    finalName = response.name || "openclaw-agent";
  }

  try {
    const result = await axios.post(
      `${config.apiUrl}/auth/agent/pair`,
      { name: finalName },
      {
        headers: {
          Authorization: `Bearer ${config.token}`
        }
      }
    );

    const ownerUid = result.data.credentials.ownerUid as string;
    const agentSecret = result.data.credentials.agentSecret as string;
    saveAgentCredentials(ownerUid, agentSecret);

    console.log("Agent credentials paired and saved to local CLI config.");
    console.log(`ownerUid: ${ownerUid}`);
    console.log("agentSecret: [REDACTED - stored locally]");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.error || "Failed to pair agent credentials");
      process.exit(1);
    }

    throw error;
  }
}
