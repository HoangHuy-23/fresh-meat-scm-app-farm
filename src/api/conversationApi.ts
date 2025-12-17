import { createAuthHeaders, handleApiResponse } from "../utils/apiUtils";

export interface ConversationResponse {
  email: string;
  facilityID: string;
  title: string;
  _id: string;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: "user" | "bot";
  sender_id: string | null;
  timestamp: string;
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: MessageResponse[];
    total: number;
    total_messages: number;
    limit: number;
    offset: number;
  };
}

export interface ConversationsListResponse {
  conversations: ConversationResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Base URL cho API (export để dùng chung cho chat endpoints)
export const API_BASE_URL =
  "https://inclusive-reconstruction-recommend-competitive.trycloudflare.com/api";

/**
 * Lấy danh sách conversations của user
 */
export const getConversations = async (
  token: string,
  limit = 10,
  offset = 0
): Promise<ConversationResponse[]> => {
  const response = await fetch(
    `${API_BASE_URL}/conversations?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: createAuthHeaders(token),
    }
  );

  const data = await handleApiResponse(response);
  return data; // API trả về array trực tiếp
};

/**
 * Lấy messages của một conversation
 */
export const getConversationMessages = async (
  token: string,
  conversationId: string,
  limit = 50,
  offset = 0
): Promise<MessageResponse[]> => {
  console.log("🌐 API: Fetching messages for conversation:", conversationId);

  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: createAuthHeaders(token),
    }
  );

  console.log("🌐 API: Response status:", response.status);

  const data: MessagesResponse = await handleApiResponse(response);
  console.log("🌐 API: Parsed response:", data);

  return data.data.messages;
};

/**
 * Tạo conversation mới
 */
export const createConversation = async (
  token: string,
  title = "New Chat"
): Promise<ConversationResponse> => {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ title }),
  });

  const data = await handleApiResponse(response);
  return data;
};

/**
 * Xóa conversation
 */
export const deleteConversation = async (
  token: string,
  conversationId: string
): Promise<void> => {
  // Delete endpoint uses a different base and expects 204 No Content on success
  const deleteUrl = `${API_BASE_URL}/conversations/${conversationId}`;
  const response = await fetch(deleteUrl, {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });

  if (response.status !== 204) {
    // Try to parse error body if available; otherwise throw generic error
    let message = `Xóa cuộc hội thoại thất bại (HTTP ${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
};

/**
 * Cập nhật title conversation
 */
export const updateConversationTitle = async (
  token: string,
  conversationId: string,
  title: string
): Promise<ConversationResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}`,
    {
      method: "PUT",
      headers: createAuthHeaders(token),
      body: JSON.stringify({ title }),
    }
  );

  const data = await handleApiResponse(response);
  return data;
};
