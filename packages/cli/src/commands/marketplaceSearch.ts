import axios from "axios";
import { loadCliConfig } from "../services/cliConfig";

interface SearchOptions {
  query?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export async function marketplaceSearchCommand(options: SearchOptions) {
  const config = loadCliConfig();
  if (!config.ownerUid || !config.agentSecret) {
    console.error("Missing ownerUid/agentSecret. Run: chaturbo connect --owner-id ... --agent-secret ...");
    process.exit(1);
  }

  const payload: Record<string, unknown> = {
    query: options.query,
    category: options.category,
    page: Number(options.page || "1"),
    limit: Number(options.limit || "10")
  };
  if (options.minPrice) payload.minPrice = Number(options.minPrice);
  if (options.maxPrice) payload.maxPrice = Number(options.maxPrice);

  const res = await axios.post(`${config.apiUrl}/agent/search`, payload, {
    headers: {
      "x-chaturbo-owner-id": config.ownerUid,
      "x-chaturbo-agent-secret": config.agentSecret
    }
  });

  const workflows = res.data.workflows as Array<Record<string, unknown>>;
  const pagination = res.data.pagination as Record<string, unknown>;

  console.log(`Found ${workflows.length} workflow(s)`);
  workflows.forEach((workflow, index) => {
    console.log(`${index + 1}. ${workflow.title}`);
    console.log(`   id: ${workflow._id}`);
    console.log(`   category: ${workflow.category}`);
    console.log(`   credits: ${workflow.priceCredits}`);
  });
  console.log(`Page ${pagination.page}/${pagination.totalPages} total=${pagination.total}`);
}
