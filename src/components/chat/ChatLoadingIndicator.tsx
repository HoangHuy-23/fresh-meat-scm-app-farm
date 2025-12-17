import React from "react";
import { Text, View } from "react-native";

const ChatLoadingIndicator: React.FC = () => {
  return (
    <View className="items-start mb-3">
      <View className="bg-gray-200 p-3 rounded-2xl rounded-bl-sm">
        <View className="flex-row items-center">
          <Text className="text-gray-600 mr-2">Đang trả lời</Text>
          <View className="flex-row space-x-1">
            <View className="w-2 h-2 bg-gray-400 rounded-full" />
            <View className="w-2 h-2 bg-gray-400 rounded-full" />
            <View className="w-2 h-2 bg-gray-400 rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatLoadingIndicator;
