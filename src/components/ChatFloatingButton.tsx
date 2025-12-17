import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { useChatBot } from "../hooks/useChatBot";

const ChatFloatingButton: React.FC = () => {
  const { isOpen, toggleChatBot, messages } = useChatBot();
  const unreadCount = messages.filter((msg) => !msg.isUser).length;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleChatBot();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`absolute bottom-6 right-6 w-16 h-16 rounded-full shadow-lg z-40 justify-center items-center ${
        isOpen ? "bg-red-500" : "bg-green-500"
      }`}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name={isOpen ? "close" : "chat"}
        size={28}
        color="#fff"
      />
      {/* Badge thông báo */}
      {!isOpen && unreadCount > 0 && (
        <Animated.View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-6 h-6 justify-center items-center border-2 border-white">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

export default ChatFloatingButton;
