import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { ChatMessage } from "../../hooks/useChat";
import ChatAuthWarning from "./ChatAuthWarning";
import ChatBubble from "./ChatBubble";
import ChatEmptyState from "./ChatEmptyState";
import ChatErrorMessage from "./ChatErrorMessage";
import ChatLoadingIndicator from "./ChatLoadingIndicator";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingMessages?: boolean;
  error: string | null;
  isAuthenticated: boolean;
  messagesHeight: number;
  onAuthError: () => void;
  onSuggestedMessage: (message: string) => void;
  hasConversation?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isLoadingMessages = false,
  error,
  isAuthenticated,
  messagesHeight,
  onAuthError,
  onSuggestedMessage,
  hasConversation = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Debug log để track messages changes
  useEffect(() => {
    console.log("💬 ChatMessages: Received", messages.length, "messages");
  }, [messages]);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]); // Chỉ trigger khi số lượng messages thay đổi

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{
        height: messagesHeight + 80, // Thêm space cho input height
      }}
      contentContainerStyle={{
        paddingBottom: 180, // Padding bottom để không bị che bởi input
      }}
      className="p-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Authentication Warning */}
      {!isAuthenticated && <ChatAuthWarning onLogin={onAuthError} />}

      {/* Error Message */}
      {error && <ChatErrorMessage error={error} onRetry={onAuthError} />}

      {/* Messages or Empty State */}
      {messages.length === 0 ? (
        isLoadingMessages ? (
          // Hiển thị loading khi đang load messages từ API
          <ChatLoadingIndicator />
        ) : (
          // Hiển thị empty state khi không có messages
          <ChatEmptyState
            messagesHeight={messagesHeight}
            onSuggestedMessage={onSuggestedMessage}
            hasConversation={hasConversation}
          />
        )
      ) : (
        messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))
      )}

      {/* Loading Indicator chỉ hiển thị khi đang gửi tin nhắn */}
      {isLoading && messages.length > 0 && <ChatLoadingIndicator />}
    </ScrollView>
  );
};

export default ChatMessages;
