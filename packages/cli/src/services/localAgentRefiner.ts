import { spawnSync } from "child_process";
import { ScanFile, WorkflowDraftPayload } from "../types";

interface RefineResponse {
  drafts?: Array<Partial<WorkflowDraftPayload>>;
}

function mergeDraft(base: WorkflowDraftPayload, patch?: Partial<WorkflowDraftPayload>): WorkflowDraftPayload {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    problem: {
      ...base.problem,
      ...(patch.problem ?? {})
    },
    solution: {
      ...base.solution,
      ...(patch.solution ?? {})
    },
    compatibility: {
      ...base.compatibility,
      ...(patch.compatibility ?? {})
    },
    estimates: {
      ...base.estimates,
      ...(patch.estimates ?? {})
    },
    privacy: {
      ...base.privacy,
      ...(patch.privacy ?? {})
    },
    quality: {
      ...base.quality,
      ...(patch.quality ?? {})
    }
  };
}

export function refineDraftsWithLocalAgent(
  drafts: WorkflowDraftPayload[],
  files: ScanFile[],
  localAgentCommand?: string
): WorkflowDraftPayload[] {
  if (!localAgentCommand || !drafts.length) {
    return drafts;
  }

  const payload = {
    instruction:
      "Refine these draft workflows for clarity. Keep secrets redacted. Return JSON only: {\"drafts\": [partialDraftsByIndex]}.",
    files: files.map((file) => ({ path: file.path, size: file.content.length })),
    drafts
  };

  const result = spawnSync(localAgentCommand, {
    shell: true,
    input: JSON.stringify(payload),
    encoding: "utf-8",
    maxBuffer: 8 * 1024 * 1024
  });

  if (result.error) {
    console.warn(`Local agent refinement skipped: ${result.error.message}`);
    return drafts;
  }

  const stdout = result.stdout?.trim();
  if (!stdout) {
    return drafts;
  }

  try {
    const parsed = JSON.parse(stdout) as RefineResponse;
    if (!parsed.drafts || !Array.isArray(parsed.drafts)) {
      return drafts;
    }

    return drafts.map((draft, index) => mergeDraft(draft, parsed.drafts?.[index]));
  } catch {
    console.warn("Local agent refinement returned non-JSON output; keeping heuristic drafts.");
    return drafts;
  }
}
