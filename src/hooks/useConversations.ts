import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ConversationResponse,
  MessageResponse,
  createConversation,
  deleteConversation as deleteConversationApi,
  getConversationMessages,
  getConversations,
} from "../api/conversationApi";
import { RootState } from "../store/store";
import { ChatMessage } from "./useChat";

const CURRENT_CONVERSATION_KEY = "current_conversation_id";

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy token từ Redux store
  const auth = useSelector((state: RootState) => state.auth);

  // Load conversations từ API
  const loadConversations = useCallback(async () => {
    if (!auth.token) return;

    try {
      setIsLoading(true);
      const conversationsData = await getConversations(auth.token);
      // Sort by updated_at descending (newest first)
      conversationsData.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setConversations(conversationsData);

      // Load current conversation ID từ storage
      const currentId = await AsyncStorage.getItem(CURRENT_CONVERSATION_KEY);
      if (currentId) {
        setCurrentConversationId(currentId);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth.token]);

  // Helper: xác định conversation tạm thời trên UI
  const isTempConversationId = useCallback((id?: string | null) => {
    return !!id && id.startsWith("local-");
  }, []);

  // Tạo conversation tạm thời trên UI (không gọi backend)
  const createLocalConversation = useCallback(async (): Promise<string> => {
    const tempId = `local-${Date.now()}`;
    const now = new Date().toISOString();
    const tempConv: ConversationResponse = {
      _id: tempId,
      title: "New Chat",
      email: "",
      facilityID: "",
      created_at: now,
      updated_at: now,
    };

    setConversations((prev) => [tempConv, ...prev]);
    setCurrentConversationId(tempId);
    await AsyncStorage.setItem(CURRENT_CONVERSATION_KEY, tempId);
    return tempId;
  }, []);

  // Tạo conversation mới
  const createNewConversation = useCallback(async (): Promise<string> => {
    if (!auth.token) return "";

    try {
      const newConversation = await createConversation(auth.token, "New Chat");

      // Cập nhật state
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation._id);
      await AsyncStorage.setItem(CURRENT_CONVERSATION_KEY, newConversation._id);

      return newConversation._id;
    } catch (error) {
      console.error("Error creating new conversation:", error);
      return "";
    }
  }, [auth.token]);

  // Thay thế conversation tạm bằng conversation thật từ backend
  const promoteConversation = useCallback(
    async (tempId: string, realId: string, title?: string) => {
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c._id === tempId
            ? {
                ...c,
                _id: realId,
                title: title ?? c.title,
                updated_at: new Date().toISOString(),
              }
            : c
        );

        // Nếu không tìm thấy tempId (hiếm khi), thêm mới vào đầu danh sách
        if (!updated.find((c) => c._id === realId)) {
          updated.unshift({
            _id: realId,
            title: title ?? "New Chat",
            email: "",
            facilityID: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        return updated;
      });

      setCurrentConversationId(realId);
      await AsyncStorage.setItem(CURRENT_CONVERSATION_KEY, realId);
    },
    []
  );

  // Cập nhật tiêu đề conversation trong local state (không gọi API)
  const updateConversationTitleLocal = useCallback(
    async (conversationId: string, title: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, title, updated_at: new Date().toISOString() }
            : c
        )
      );

      // Nếu đang ở conversation này và title thay đổi, vẫn giữ current id
      const currentId = await AsyncStorage.getItem(CURRENT_CONVERSATION_KEY);
      if (currentId !== conversationId) {
        await AsyncStorage.setItem(CURRENT_CONVERSATION_KEY, conversationId);
      }
    },
    []
  );

  // Load messages for specific conversation với cache để tránh load nhiều lần
  const loadConversationMessages = useCallback(
    async (conversationId: string): Promise<ChatMessage[]> => {
      if (!auth.token) return [];

      try {
        // Bỏ qua load nếu là conversation tạm
        if (isTempConversationId(conversationId)) {
          return [];
        }
        console.log(
          "📨 API: Loading messages for conversation",
          conversationId
        );
        const messagesData = await getConversationMessages(
          auth.token,
          conversationId
        );

        console.log("📨 API: Raw response:", messagesData);

        // Convert API messages to ChatMessage format
        const chatMessages: ChatMessage[] = messagesData.map(
          (msg: MessageResponse) => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.sender_type === "user",
            timestamp: msg.timestamp,
          })
        );

        console.log("📨 API: Converted messages:", chatMessages);
        console.log("📨 API: Loaded", chatMessages.length, "messages");
        return chatMessages;
      } catch (error) {
        console.error("❌ API Error loading conversation messages:", error);
        return [];
      }
    },
    [auth.token, isTempConversationId]
  );

  // Save messages to specific conversation (giữ nguyên để tương thích)
  const saveConversationMessages = useCallback(
    async (conversationId: string, messages: ChatMessage[]) => {
      // TODO: Implement API call để save messages
      console.log(
        "Saving messages for conversation:",
        conversationId,
        messages
      );
    },
    []
  );

  // Switch to conversation
  const switchToConversation = useCallback(async (conversationId: string) => {
    console.log(
      "🔄 useConversations: Switching to conversation:",
      conversationId
    );
    setCurrentConversationId(conversationId);
    await AsyncStorage.setItem(CURRENT_CONVERSATION_KEY, conversationId);
    console.log(
      "✅ useConversations: Switched to conversation:",
      conversationId
    );
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!auth.token) return;

      try {
        // Nếu là conversation tạm thời thì không gọi API
        if (!isTempConversationId(conversationId)) {
          await deleteConversationApi(auth.token, conversationId);
        }

        // Cập nhật state
        setConversations((prev) =>
          prev.filter((conv) => conv._id !== conversationId)
        );

        // Nếu đang xóa conversation hiện tại, chuyển sang conversation khác
        if (currentConversationId === conversationId) {
          const remainingConversations = conversations.filter(
            (conv) => conv._id !== conversationId
          );
          if (remainingConversations.length > 0) {
            const newestConv = remainingConversations[0];
            await switchToConversation(newestConv._id);
          } else {
            setCurrentConversationId(null);
            await AsyncStorage.removeItem(CURRENT_CONVERSATION_KEY);
          }
        }
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    },
    [
      auth.token,
      currentConversationId,
      conversations,
      switchToConversation,
      isTempConversationId,
    ]
  );

  // Initialize - load conversations khi có token
  useEffect(() => {
    if (auth.token) {
      loadConversations();
    }
  }, [auth.token, loadConversations]);

  return {
    conversations,
    currentConversationId,
    isLoading,
    isTempConversationId,
    createLocalConversation,
    createNewConversation,
    promoteConversation,
    updateConversationTitleLocal,
    loadConversationMessages,
    saveConversationMessages,
    switchToConversation,
    deleteConversation,
    loadConversations,
  };
};
