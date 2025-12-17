import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatAuthWarningProps {
  onLogin: () => void;
}

const ChatAuthWarning: React.FC<ChatAuthWarningProps> = ({ onLogin }) => {
  return (
    <View className="bg-yellow-50 p-4 rounded-xl mb-3 border border-yellow-300">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="alert" size={20} color="#f59e0b" />
        <Text className="text-yellow-700 ml-2 flex-1">
          Bạn cần đăng nhập để sử dụng tính năng chat.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onLogin}
        className="mt-3 bg-yellow-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white text-center font-medium">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatAuthWarning;
