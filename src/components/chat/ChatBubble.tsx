import React from "react";
import { Text, View } from "react-native";
import { ChatMessage } from "../../hooks/useChat";
import { formatChatTime } from "../../utils/timeUtils";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <View className={`mb-3 ${message.isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          message.isUser
            ? "bg-green-500 rounded-br-sm"
            : "bg-gray-200 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base ${message.isUser ? "text-white" : "text-gray-800"}`}
        >
          {message.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 px-2">
        {formatChatTime(message.timestamp)}
      </Text>
    </View>
  );
};

export default ChatBubble;
