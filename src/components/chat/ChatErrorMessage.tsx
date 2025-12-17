import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

const ChatErrorMessage: React.FC<ChatErrorMessageProps> = ({
  error,
  onRetry,
}) => {
  const showRetryButton = error.includes("đăng nhập");

  return (
    <View className="bg-red-50 p-4 rounded-xl mb-3 border border-red-200">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
        <Text className="text-red-700 ml-2 flex-1">{error}</Text>
      </View>
      {showRetryButton && onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-3 bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-medium">
            Đăng nhập lại
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatErrorMessage;
