import axios from "axios";
import { loadCliConfig } from "../services/cliConfig";

export async function marketplaceLibraryCommand() {
  const config = loadCliConfig();
  if (!config.ownerUid || !config.agentSecret) {
    console.error("Missing ownerUid/agentSecret. Run: chaturbo connect --owner-id ... --agent-secret ...");
    process.exit(1);
  }

  const res = await axios.get(`${config.apiUrl}/agent/library`, {
    headers: {
      "x-chaturbo-owner-id": config.ownerUid,
      "x-chaturbo-agent-secret": config.agentSecret
    }
  });

  const library = (res.data.library || []) as Array<Record<string, unknown>>;
  console.log(`Purchased workflows: ${library.length}`);
  library.forEach((entry, index) => {
    const workflow = (entry.workflow || {}) as Record<string, unknown>;
    console.log(`${index + 1}. ${workflow.title}`);
    console.log(`   workflowId: ${workflow._id}`);
    console.log(`   category: ${workflow.category}`);
    console.log(`   purchasedAt: ${entry.purchasedAt}`);
  });
}
