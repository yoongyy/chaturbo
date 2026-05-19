import prompts from "prompts";
import { detectOpenClawPaths } from "../services/detectOpenClawPaths";
import { readCandidateFiles } from "../services/fileReader";
import { extractWorkflowDrafts } from "../services/heuristicExtractor";
import { loadCliConfig } from "../services/cliConfig";
import { uploadDrafts } from "../services/draftUploader";
import { refineDraftsWithLocalAgent } from "../services/localAgentRefiner";

interface ScanOptions {
  path?: string;
  localOnly?: boolean;
  autoUpload?: boolean;
  nonInteractive?: boolean;
  localAgentCmd?: string;
  autoPublish?: boolean;
  publishThreshold?: number;
  maxAutoPublish?: number;
}

function printDraftSummary(drafts: ReturnType<typeof extractWorkflowDrafts>) {
  console.log(`\nDetected ${drafts.length} workflow draft(s):\n`);
  drafts.forEach((draft, index) => {
    const revenue = `$${draft.estimates.potentialMonthlyRevenueLow}-$${draft.estimates.potentialMonthlyRevenueHigh}`;
    console.log(`${index + 1}. ${draft.title}`);
    console.log(`   Category: ${draft.category}`);
    console.log(`   Price: ${draft.estimates.suggestedPriceCredits} credits`);
    console.log(`   Readiness: ${draft.quality.publishReadinessScore}`);
    console.log(`   Risk: ${draft.privacy.riskLevel}`);
    console.log(`   Revenue estimate: ${revenue}`);
  });
  console.log("");
}

export async function scanOpenClawCommand(options: ScanOptions) {
  const config = loadCliConfig();
  const scanPaths = detectOpenClawPaths(options.path);

  if (!scanPaths.length) {
    console.error("No local AI agent log paths found. Use --path <path>.");
    process.exit(1);
  }

  console.log("Scanning paths:");
  scanPaths.forEach((p) => console.log(`- ${p}`));

  const files = readCandidateFiles(scanPaths);
  if (!files.length) {
    console.error("No candidate files found.");
    process.exit(1);
  }

  let drafts = extractWorkflowDrafts(files);
  const localAgentCommand = options.localAgentCmd || config.localAgentCommand;
  if (localAgentCommand) {
    console.log(`Refining extracted drafts locally via agent command: ${localAgentCommand}`);
    drafts = refineDraftsWithLocalAgent(drafts, files, localAgentCommand);
  }
  if (!drafts.length) {
    console.log("No sellable workflow drafts detected with current heuristics.");
    return;
  }

  printDraftSummary(drafts);

  if (options.localOnly) {
    console.log("Local-only mode enabled. No uploads were made.");
    return;
  }

  const hasToken = Boolean(config.token);
  const hasAgentCredentials = Boolean(config.ownerUid && config.agentSecret);

  if (!hasToken && !hasAgentCredentials) {
    console.error("No auth credentials found. Run: chaturbo connect");
    process.exit(1);
  }

  let shouldUpload = options.autoUpload === true;

  if (!shouldUpload && !options.nonInteractive) {
    const answer = await prompts({
      type: "confirm",
      name: "upload",
      message: "Upload sanitized workflow drafts to Chaturbo?",
      initial: true
    });

    shouldUpload = Boolean(answer.upload);
  }

  if (!shouldUpload) {
    console.log("Upload skipped.");
    return;
  }

  const result = await uploadDrafts(
    config.apiUrl,
    hasToken
      ? { token: config.token }
      : { ownerUid: config.ownerUid, agentSecret: config.agentSecret },
    drafts,
    {
      autoPublish: options.autoPublish,
      publishThreshold: options.publishThreshold,
      maxAutoPublish: options.maxAutoPublish
    }
  );
  console.log(`Uploaded ${result.drafts.length} draft(s).`);
  if (result.dedupe) {
    console.log("Dedupe summary:");
    console.log(JSON.stringify(result.dedupe, null, 2));
  }
  if (result.autoPublished) {
    console.log("Auto-publish summary:");
    console.log(JSON.stringify(result.autoPublished, null, 2));
  }
  console.log("Dashboard summary:");
  console.log(JSON.stringify(result.summary, null, 2));
}
