import axios from "axios";
import { WorkflowDraftPayload } from "../types";

interface UploadAuth {
  token?: string;
  ownerUid?: string;
  agentSecret?: string;
}

export async function uploadDrafts(apiUrl: string, auth: UploadAuth, drafts: WorkflowDraftPayload[]) {
  const headers: Record<string, string> = {};
  if (auth.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  } else if (auth.ownerUid && auth.agentSecret) {
    headers["x-chaturbo-owner-id"] = auth.ownerUid;
    headers["x-chaturbo-agent-secret"] = auth.agentSecret;
  }

  const response = await axios.post(
    `${apiUrl}/scan/upload-drafts`,
    { drafts },
    {
      headers
    }
  );

  return response.data as {
    drafts: Array<Record<string, unknown>>;
    summary: Record<string, unknown>;
  };
}
