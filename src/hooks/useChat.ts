import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../api/conversationApi";
import { RootState } from "../store/store";
import { ChatApiResponse } from "../types/chat";
import {
  createAuthHeaders,
  formatErrorMessage,
  handleApiResponse,
} from "../utils/apiUtils";
import {
  clearChatHistory as clearStoredHistory,
  loadChatHistory,
} from "../utils/chatStorage";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // Thay đổi từ Date thành string để tương thích với Redux
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isOpen: false,
  error: null,
};

// Sử dụng chung base URL với conversation API để tránh lệch domain
const CHAT_BASE_URL = API_BASE_URL;

// Async thunk để tải lịch sử chat
export const loadChatHistoryThunk = createAsyncThunk(
  "chat/loadHistory",
  async () => {
    const history = await loadChatHistory();
    return history;
  }
);

// Async thunk để gửi tin nhắn tới API (không truyền conversationId -> backend sẽ tạo mới)
export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      question,
      conversation_title,
    }: { question: string; conversation_title?: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token;

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Gửi tới endpoint chung: POST /api/chat
      const response = await fetch(`${CHAT_BASE_URL}/chat`, {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify({ question, conversation_title }),
      });

      const data: ChatApiResponse = await handleApiResponse(response);
      return data;
    } catch (error) {
      console.error("❌ Error in sendChatMessage:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Async thunk để gửi tin nhắn tới API với conversation ID hiện có
export const sendChatMessageWithConversation = createAsyncThunk(
  "chat/sendMessageWithConversation",
  async (
    {
      question,
      conversationId,
      conversation_title,
    }: {
      question: string;
      conversationId: string;
      conversation_title?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Lấy token từ auth state
      const state = getState() as RootState;
      const token = state.auth?.token;

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Gửi chat tới endpoint theo dạng: POST /api/chat/:conversationId
      const url = `${CHAT_BASE_URL}/chat/${conversationId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: createAuthHeaders(token),
        body: JSON.stringify({ question, conversation_title }),
      });

      const data: ChatApiResponse = await handleApiResponse(response);
      return data;
    } catch (error) {
      console.error("❌ Error in sendChatMessageWithConversation:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<Omit<ChatMessage, "id" | "timestamp">>
    ) => {
      const newMessage: ChatMessage = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearMessages: (state) => {
      state.messages = [];
      clearStoredHistory();
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatHistoryThunk.fulfilled, (state, action) => {
        // Chỉ áp dụng lịch sử local nếu hiện tại chưa có messages
        if (state.messages.length === 0) {
          state.messages = action.payload.map((msg) => ({
            ...msg,
            timestamp:
              typeof msg.timestamp === "string"
                ? msg.timestamp
                : new Date(msg.timestamp).toISOString(),
          }));
        }
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Thêm tin nhắn phản hồi từ bot
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text:
            action.payload.answer ||
            action.payload.response ||
            action.payload.message ||
            "Xin lỗi, tôi không hiểu câu hỏi của bạn.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(botMessage);
        // Tạm thời tắt save local vì sử dụng backend
        // saveChatHistory(state.messages);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;

        // Xử lý tin nhắn lỗi dựa trên loại lỗi
        const errorMessage = action.payload as string;
        const userFriendlyMessage = formatErrorMessage(errorMessage);

        const errorChatMessage: ChatMessage = {
          id: Date.now().toString(),
          text: userFriendlyMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(errorChatMessage);
        // Tạm thời tắt save local vì sử dụng backend
        // saveChatHistory(state.messages);
      })
      // Reducers cho sendChatMessageWithConversation
      .addCase(sendChatMessageWithConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessageWithConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Thêm tin nhắn phản hồi từ bot
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text:
            action.payload.answer ||
            action.payload.response ||
            action.payload.message ||
            "Xin lỗi, tôi không hiểu câu hỏi của bạn.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(botMessage);
        // Tạm thời tắt save local vì sử dụng backend
        // saveChatHistory(state.messages);
      })
      .addCase(sendChatMessageWithConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;

        // Xử lý tin nhắn lỗi dựa trên loại lỗi
        const errorMessage = action.payload as string;
        const userFriendlyMessage = formatErrorMessage(errorMessage);

        const errorChatMessage: ChatMessage = {
          id: Date.now().toString(),
          text: userFriendlyMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(errorChatMessage);
        // Tạm thời tắt save local vì sử dụng backend
        // saveChatHistory(state.messages);
      });
  },
});

export const {
  addMessage,
  toggleChat,
  clearMessages,
  clearError,
  setAuthError,
  setMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
