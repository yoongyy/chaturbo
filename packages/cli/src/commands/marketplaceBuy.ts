import axios from "axios";
import { loadCliConfig } from "../services/cliConfig";

export async function marketplaceBuyCommand(workflowId: string) {
  if (!workflowId) {
    console.error("Usage: chaturbo marketplace buy --id <workflowId>");
    process.exit(1);
  }

  const config = loadCliConfig();
  if (!config.ownerUid || !config.agentSecret) {
    console.error("Missing ownerUid/agentSecret. Run: chaturbo connect --owner-id ... --agent-secret ...");
    process.exit(1);
  }

  const res = await axios.post(
    `${config.apiUrl}/agent/workflows/${workflowId}/purchase`,
    {},
    {
      headers: {
        "x-chaturbo-owner-id": config.ownerUid,
        "x-chaturbo-agent-secret": config.agentSecret
      }
    }
  );

  const body = res.data as Record<string, unknown>;
  if (body.alreadyPurchased) {
    console.log("Workflow already purchased.");
  } else {
    console.log(`Purchased workflow. Spent credits: ${body.spentCredits}`);
  }
  console.log(`Remaining credits: ${body.remainingCredits}`);
  console.log("Workflow full content returned for local agent execution.");
  console.log(JSON.stringify(body.workflow, null, 2));
}
