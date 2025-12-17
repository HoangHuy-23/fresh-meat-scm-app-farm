import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatBot } from "../hooks/useChatBot";
import ChatHeader from "./chat/ChatHeader";
import ChatInput from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import ChatSidebar from "./chat/ChatSidebar";

const { height: screenHeight } = Dimensions.get("window");

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ChatBotProps {}

// Constants for chat sizing
const CHAT_CONFIG = {
  HEADER_HEIGHT: 80,
  INPUT_HEIGHT: 150,
  HEIGHT_PERCENTAGE: 0.95, // 85% của màn hình - điều chỉnh để thay đổi chiều cao chat
  TOP_SAFE_AREA_PERCENTAGE: 0.05, // 15% phía trên để đóng chat - phải = 1 - HEIGHT_PERCENTAGE
} as const;

const ChatBot: React.FC<ChatBotProps> = () => {
  const {
    messages,
    isLoading,
    isOpen,
    error,
    conversations,
    currentConversationId,
    conversationsLoading,
    isLoadingMessages,
    sendMessage,
    toggleChatBot,
    clearChatHistory,
    handleAuthError,
    isAuthenticated,
    startNewConversation,
    selectConversation,
    removeConversation,
  } = useChatBot();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // State để quản lý sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tính toán chiều cao cho chat theo phần trăm màn hình
  const CHAT_MAX_HEIGHT = screenHeight * CHAT_CONFIG.HEIGHT_PERCENTAGE;
  const MESSAGES_HEIGHT =
    CHAT_MAX_HEIGHT - CHAT_CONFIG.HEADER_HEIGHT - CHAT_CONFIG.INPUT_HEIGHT;

  useEffect(() => {
    if (isOpen) {
      // Hiệu ứng mở chat
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hiệu ứng đóng chat
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, scaleAnim]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleSuggestedMessage = (message: string) => {
    // Gửi luôn tin nhắn được gợi ý
    sendMessage(message);
  };

  const handleToggleChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleChatBot();
  };

  const handleClearChat = () => {
    clearChatHistory();
  };

  const handleMenuPress = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewConversation = async () => {
    await startNewConversation();
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = async (conversationId: string) => {
    await selectConversation(conversationId);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    await removeConversation(conversationId);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
      className="absolute inset-0 bg-black/50 z-50"
    >
      <TouchableOpacity
        style={{ height: screenHeight * CHAT_CONFIG.TOP_SAFE_AREA_PERCENTAGE }}
        activeOpacity={1}
        onPress={handleToggleChat}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          height: CHAT_MAX_HEIGHT,
          marginTop: screenHeight * CHAT_CONFIG.TOP_SAFE_AREA_PERCENTAGE,
          marginBottom: Math.max(insets.bottom, 20), // Tối thiểu 20px để không chạm tab bar
          position: "relative",
        }}
        className="bg-white rounded-t-3xl shadow-2xl"
      >
        {/* Header - Fixed height */}
        <ChatHeader
          onClearChat={handleClearChat}
          onClose={handleToggleChat}
          onMenuPress={handleMenuPress}
        />

        {/* Messages - Flexible height with padding bottom for input */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isLoadingMessages={isLoadingMessages}
          error={error}
          isAuthenticated={isAuthenticated}
          messagesHeight={MESSAGES_HEIGHT}
          onAuthError={handleAuthError}
          onSuggestedMessage={handleSuggestedMessage}
          hasConversation={!!currentConversationId}
        />

        {/* Input - Fixed position at bottom */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: CHAT_CONFIG.INPUT_HEIGHT,
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            zIndex: 100,
          }}
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            inputHeight={CHAT_CONFIG.INPUT_HEIGHT}
          />
        </View>

        {/* Sidebar */}
        {isSidebarOpen && (
          <ChatSidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            isLoading={conversationsLoading}
            onClose={handleCloseSidebar}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default ChatBot;
