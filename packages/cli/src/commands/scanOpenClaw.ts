import prompts from "prompts";
import { detectOpenClawPaths } from "../services/detectOpenClawPaths";
import { readCandidateFiles } from "../services/fileReader";
import { extractWorkflowDrafts } from "../services/heuristicExtractor";
import { loadCliConfig } from "../services/cliConfig";
import { uploadDrafts } from "../services/draftUploader";

interface ScanOptions {
  path?: string;
  localOnly?: boolean;
  autoUpload?: boolean;
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
    console.error("No OpenClaw paths found. Use --path <path>.");
    process.exit(1);
  }

  console.log("Scanning paths:");
  scanPaths.forEach((p) => console.log(`- ${p}`));

  const files = readCandidateFiles(scanPaths);
  if (!files.length) {
    console.error("No candidate files found.");
    process.exit(1);
  }

  const drafts = extractWorkflowDrafts(files);
  if (!drafts.length) {
    console.log("No sellable workflow drafts detected with current heuristics.");
    return;
  }

  printDraftSummary(drafts);

  if (options.localOnly) {
    console.log("Local-only mode enabled. No uploads were made.");
    return;
  }

  if (!config.token) {
    console.error("Not logged in. Run: chaturbo connect or chaturbo login");
    process.exit(1);
  }

  let shouldUpload = options.autoUpload === true;

  if (!shouldUpload) {
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

  const result = await uploadDrafts(config.apiUrl, config.token, drafts);
  console.log(`Uploaded ${result.drafts.length} draft(s).`);
  console.log("Dashboard summary:");
  console.log(JSON.stringify(result.summary, null, 2));
}
