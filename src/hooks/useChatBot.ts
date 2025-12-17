import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logout } from "./useAuth";
import {
  addMessage,
  clearError,
  clearMessages,
  loadChatHistoryThunk,
  sendChatMessage,
  sendChatMessageWithConversation,
  setAuthError,
  setMessages,
  toggleChat,
} from "./useChat";
import { useConversations } from "./useConversations";

export const useChatBot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: RootState) => state.chat);
  const auth = useSelector((state: RootState) => state.auth);

  // Ref để track conversation đã load messages chưa
  const loadedConversationRef = useRef<string | null>(null);
  // Ref để tránh gọi song song khi đang load cùng 1 conversation
  const loadingConversationRef = useRef<string | null>(null);

  // State riêng cho loading messages
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const {
    conversations,
    currentConversationId,
    isLoading: conversationsLoading,
    isTempConversationId,
    createLocalConversation,
    promoteConversation,
    updateConversationTitleLocal,
    loadConversationMessages,
    switchToConversation,
    deleteConversation,
  } = useConversations();

  // Track khi currentConversationId thay đổi
  useEffect(() => {
    console.log(
      "📍 Current conversation ID changed to:",
      currentConversationId
    );
  }, [currentConversationId]);

  // Load messages chỉ khi conversation thay đổi
  useEffect(() => {
    const loadMessages = async () => {
      console.log("🔍 LoadMessages Effect:", {
        currentConversationId,
        loadedConversation: loadedConversationRef.current,
        needsLoad: currentConversationId !== loadedConversationRef.current,
      });

      // Chỉ clear messages khi không có conversation nào được chọn
      if (!currentConversationId) {
        console.log("🧹 Clearing messages - no conversation selected");
        // Tránh dispatch liên tục nếu đã rỗng
        if (chat.messages.length > 0) {
          dispatch(clearMessages());
        }
        loadedConversationRef.current = null;
        return;
      }

      // Bỏ qua load nếu là conversation tạm thời (local-*), đợi id thật
      if (isTempConversationId(currentConversationId)) {
        console.log(
          "⏭️ Skip loading messages for temp conversation:",
          currentConversationId
        );
        // Đánh dấu đã xử lý để tránh vòng lặp
        loadedConversationRef.current = currentConversationId;
        if (chat.messages.length > 0) return; // giữ nguyên nếu đã có
        dispatch(setMessages([]));
        return;
      }

      // Bỏ qua nếu đã load hoặc đang load cùng conversation
      if (
        currentConversationId === loadedConversationRef.current ||
        currentConversationId === loadingConversationRef.current
      ) {
        return;
      }

      if (currentConversationId !== loadedConversationRef.current) {
        console.log(
          "🔄 Loading messages for conversation:",
          currentConversationId
        );

        setIsLoadingMessages(true);
        loadingConversationRef.current = currentConversationId;

        try {
          const messages = await loadConversationMessages(
            currentConversationId
          );
          console.log(
            "✅ Loaded",
            messages.length,
            "messages for conversation:",
            currentConversationId,
            "Messages:",
            messages
          );

          // Luôn set messages, kể cả khi là mảng rỗng
          dispatch(setMessages(messages));
          loadedConversationRef.current = currentConversationId;
        } catch (error) {
          console.error("❌ Error loading messages:", error);
          // Không reset ref về null để tránh vòng lặp retry vô hạn
          // Đánh dấu là đã thử load cho conversation hiện tại
          loadedConversationRef.current = currentConversationId;
          // Giữ nguyên messages hiện tại; nếu muốn có thể set [] tùy UX
          // dispatch(setMessages([]));
        } finally {
          setIsLoadingMessages(false);
          // Clear loading guard
          if (loadingConversationRef.current === currentConversationId) {
            loadingConversationRef.current = null;
          }
        }
      }
    };

    loadMessages();
  }, [
    currentConversationId,
    loadConversationMessages,
    dispatch,
    chat.messages.length,
    isTempConversationId,
  ]);

  const sendMessage = async (text: string) => {
    // Kiểm tra xem có token không
    if (!auth.token) {
      dispatch(setAuthError("Vui lòng đăng nhập để sử dụng tính năng chat."));
      return;
    }

    // Xác định id hiện tại và trạng thái tạm thời
    let conversationId = currentConversationId ?? null;
    const isTemp = isTempConversationId(conversationId);

    // Thêm tin nhắn user
    dispatch(
      addMessage({
        text: text.trim(),
        isUser: true,
      })
    );

    // Nếu chưa có id thật (null) hoặc conversation tạm thời -> gửi không kèm id
    if (!conversationId || isTemp) {
      try {
        // Lấy title hiện tại nếu có, mặc định 'New Chat'
        const currentTitle = "New Chat";
        const payload = await dispatch(
          sendChatMessage({
            question: text.trim(),
            conversation_title: currentTitle,
          })
        ).unwrap();
        // Lấy conversation id thật từ response
        const realId =
          (payload as any).conversationId || (payload as any).conversation_id;
        const returnedTitle = (payload as any).conversation_title as
          | string
          | undefined;
        if (realId) {
          // Nếu chưa có temp conversation trên UI, tạo tạm để hiển thị
          let tempId = conversationId;
          if (!tempId) {
            tempId = await createLocalConversation();
          }

          // Thay thế temp id bằng id thật và chuyển sang cuộc trò chuyện đó
          await promoteConversation(tempId as string, realId, returnedTitle);

          // Reset loaded ref để trigger reload messages chuẩn từ backend
          loadedConversationRef.current = null;
          // Cập nhật tiêu đề local nếu backend trả về
          if (returnedTitle) {
            await updateConversationTitleLocal(realId, returnedTitle);
          }
        }
      } catch (err) {
        console.error("❌ Error sending first message:", err);
      }
    } else {
      // Đã có id thật -> gửi kèm conversationId
      try {
        const titleForSend =
          conversations.find((c) => c._id === conversationId)?.title ||
          "New Chat";
        const payload = await dispatch(
          sendChatMessageWithConversation({
            question: text.trim(),
            conversationId: conversationId,
            conversation_title: titleForSend,
          })
        ).unwrap();
        const returnedTitle = (payload as any).conversation_title as
          | string
          | undefined;
        if (returnedTitle && returnedTitle !== titleForSend) {
          await updateConversationTitleLocal(conversationId, returnedTitle);
        }
      } catch (err) {
        console.error("❌ Error sending message with conversation:", err);
      }
    }
  };

  const startNewConversation = async () => {
    console.log("🆕 Starting new conversation (local temp)");
    const tempId = await createLocalConversation();
    // Clear messages để hiển thị khung trống cho cuộc trò chuyện mới
    dispatch(setMessages([]));
    // loadedConversationRef đánh dấu đã xử lý temp để tránh load
    loadedConversationRef.current = tempId;
  };

  const selectConversation = async (conversationId: string) => {
    // Reset loaded conversation để force reload messages
    console.log(
      "🔄 Switching to conversation:",
      conversationId,
      "from:",
      loadedConversationRef.current
    );
    loadedConversationRef.current = null; // Reset để trigger reload
    await switchToConversation(conversationId);
  };

  const removeConversation = async (conversationId: string) => {
    await deleteConversation(conversationId);
  };

  const toggleChatBot = () => {
    dispatch(toggleChat());
  };

  const clearChatHistory = () => {
    dispatch(clearMessages());
  };

  const clearChatError = () => {
    dispatch(clearError());
  };

  const loadHistory = () => {
    dispatch(loadChatHistoryThunk());
  };

  const handleAuthError = () => {
    // Clear chat và logout khi có lỗi authentication
    dispatch(clearMessages());
    dispatch(logout());
  };

  return {
    ...chat,
    conversations,
    currentConversationId,
    conversationsLoading,
    isLoadingMessages,
    sendMessage,
    toggleChatBot,
    clearChatHistory,
    clearChatError,
    loadHistory,
    handleAuthError,
    startNewConversation,
    selectConversation,
    removeConversation,
    isAuthenticated: !!auth.token,
  };
};

export default useChatBot;
