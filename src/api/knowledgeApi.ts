import { createAuthHeaders, handleApiResponse } from "../utils/apiUtils";
import { API_BASE_URL } from "./conversationApi";

export interface KnowledgeItem {
  id?: string;
  _id?: string;
  content?: string;
  stage?: string;
  species?: string;
  min_age_days?: number;
  max_age_days?: number;
  recommended_feed?: string;
  feed_dosage?: string;
  medication?: string;
  notes?: string;
  createdByEmail?: string;
  facilityID?: string;
  created_at?: string;
}

export interface UploadKnowledgeResponse {
  success: boolean;
  inserted: number;
  items?: KnowledgeItem[];
}

// Matches sample API: { count, items, facilityID }
export interface MyKnowledgeResponse {
  count: number;
  items: KnowledgeItem[];
  facilityID?: string;
  limit?: number;
  offset?: number;
}

export const uploadKnowledge = async (
  token: string,
  items: KnowledgeItem[]
): Promise<UploadKnowledgeResponse> => {
  const res = await fetch(`${API_BASE_URL}/knowledge/upload`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(items),
  });
  return handleApiResponse(res);
};

export const getMyKnowledge = async (
  token: string,
  params: { limit?: number; offset?: number; include_email?: boolean } = {}
): Promise<MyKnowledgeResponse> => {
  const { limit = 20, offset = 0, include_email = false } = params;
  const url = `${API_BASE_URL}/knowledge/mine?limit=${limit}&offset=${offset}&include_email=${include_email ? "true" : "false"}`;
  const res = await fetch(url, {
    method: "GET",
    headers: createAuthHeaders(token),
  });
  return handleApiResponse(res);
};
