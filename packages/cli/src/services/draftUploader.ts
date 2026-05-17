import axios from "axios";
import { WorkflowDraftPayload } from "../types";

export async function uploadDrafts(apiUrl: string, token: string, drafts: WorkflowDraftPayload[]) {
  const response = await axios.post(
    `${apiUrl}/scan/upload-drafts`,
    { drafts },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data as {
    drafts: Array<Record<string, unknown>>;
    summary: Record<string, unknown>;
  };
}
