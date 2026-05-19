import axios from "axios";
import { WorkflowDraftPayload } from "../types";

interface UploadAuth {
  token?: string;
  ownerUid?: string;
  agentSecret?: string;
}

interface UploadOptions {
  autoPublish?: boolean;
  publishThreshold?: number;
  maxAutoPublish?: number;
}

export async function uploadDrafts(
  apiUrl: string,
  auth: UploadAuth,
  drafts: WorkflowDraftPayload[],
  options: UploadOptions = {}
) {
  const headers: Record<string, string> = {};
  if (auth.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  } else if (auth.ownerUid && auth.agentSecret) {
    headers["x-chaturbo-owner-id"] = auth.ownerUid;
    headers["x-chaturbo-agent-secret"] = auth.agentSecret;
  }

  const response = await axios.post(
    `${apiUrl}/scan/upload-drafts`,
    {
      drafts,
      autoPublish: options.autoPublish ?? false,
      publishThreshold: options.publishThreshold ?? 85,
      maxAutoPublish: options.maxAutoPublish ?? 25
    },
    {
      headers
    }
  );

  return response.data as {
    drafts: Array<Record<string, unknown>>;
    dedupe?: Record<string, unknown>;
    autoPublished?: Record<string, unknown>;
    summary: Record<string, unknown>;
  };
}
