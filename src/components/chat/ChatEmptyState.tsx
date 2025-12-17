import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatEmptyStateProps {
  messagesHeight: number;
  onSuggestedMessage: (message: string) => void;
  hasConversation?: boolean;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  messagesHeight,
  onSuggestedMessage,
  hasConversation = true,
}) => {
  const suggestedQuestions = [
    "Tình trạng lô sản phẩm hiện tại như thế nào?",
    "Làm thế nào để tạo lô mới?",
    "Hướng dẫn xuất hàng như thế nào?",
  ];

  // Hiển thị khác nhau nếu chưa có conversation
  if (!hasConversation) {
    return (
      <View
        style={{ minHeight: messagesHeight * 0.8 }}
        className="justify-center items-center py-8"
      >
        <MaterialCommunityIcons name="chat-plus" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 text-center mt-6 text-lg font-medium">
          Chưa có cuộc hội thoại nào.{"\n"}
          Hãy bắt đầu chat hoặc chọn từ menu!
        </Text>
        <TouchableOpacity
          onPress={() => onSuggestedMessage("Xin chào!")}
          className="bg-green-500 px-8 py-3 rounded-full mt-6 shadow-sm"
        >
          <Text className="text-base text-white text-center font-medium">
            Bắt đầu trò chuyện
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{ minHeight: messagesHeight * 0.8 }}
      className="justify-center items-center py-8"
    >
      <MaterialCommunityIcons name="robot" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-center mt-6 text-lg font-medium">
        Xin chào! Tôi là trợ lý AI của bạn.{"\n"}
        Hãy đặt câu hỏi về trang trại hoặc sản phẩm!
      </Text>
      <View className="mt-8 w-full px-4">
        <Text className="text-base text-gray-400 text-center mb-4">
          Gợi ý câu hỏi:
        </Text>
        {suggestedQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSuggestedMessage(question)}
            className="bg-gray-100 px-6 py-3 rounded-full mb-3 shadow-sm"
          >
            <Text className="text-base text-gray-700 text-center">
              {question}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChatEmptyState;
