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

const MAX_UPLOAD_BATCH = 40;

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

  const auth = hasToken
    ? { token: config.token }
    : { ownerUid: config.ownerUid, agentSecret: config.agentSecret };
  const chunks: typeof drafts[] = [];
  for (let i = 0; i < drafts.length; i += MAX_UPLOAD_BATCH) {
    chunks.push(drafts.slice(i, i + MAX_UPLOAD_BATCH));
  }

  let uploadedTotal = 0;
  let submittedTotal = 0;
  let insertedTotal = 0;
  let skippedDuplicatesTotal = 0;
  let autoPublishedTotal = 0;
  let lastSummary: Record<string, unknown> = {};

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const result = await uploadDrafts(config.apiUrl, auth, chunk, {
      autoPublish: options.autoPublish,
      publishThreshold: options.publishThreshold,
      maxAutoPublish: options.maxAutoPublish
    });

    uploadedTotal += result.drafts.length;
    lastSummary = result.summary || lastSummary;

    const dedupe = (result.dedupe || {}) as {
      submitted?: number;
      inserted?: number;
      skippedDuplicates?: number;
    };
    submittedTotal += dedupe.submitted ?? chunk.length;
    insertedTotal += dedupe.inserted ?? result.drafts.length;
    skippedDuplicatesTotal += dedupe.skippedDuplicates ?? Math.max(0, chunk.length - result.drafts.length);

    const autoPublished = (result.autoPublished || {}) as { count?: number };
    autoPublishedTotal += autoPublished.count ?? 0;

    console.log(`Uploaded batch ${index + 1}/${chunks.length} (${result.drafts.length}/${chunk.length} inserted).`);
  }

  console.log(`Uploaded ${uploadedTotal} draft(s) across ${chunks.length} batch(es).`);
  console.log("Dedupe summary:");
  console.log(
    JSON.stringify(
      {
        submitted: submittedTotal,
        inserted: insertedTotal,
        skippedDuplicates: skippedDuplicatesTotal
      },
      null,
      2
    )
  );
  console.log("Auto-publish summary:");
  console.log(
    JSON.stringify(
      {
        enabled: Boolean(options.autoPublish),
        count: autoPublishedTotal
      },
      null,
      2
    )
  );
  console.log("Dashboard summary:");
  console.log(JSON.stringify(lastSummary, null, 2));
}
