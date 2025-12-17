import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  onClearChat: () => void;
  onClose: () => void;
  onMenuPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearChat,
  onClose,
  onMenuPress,
}) => {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-green-500 rounded-t-3xl">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onMenuPress}
          className="p-2 mr-3 rounded-lg bg-white/20"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="menu" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-bold text-white">Trợ lý AI</Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-400 mr-1" />
            <Text className="text-sm text-white/80">Đang trực tuyến</Text>
          </View>
        </View>
      </View>
      <View className="flex-row space-x-2">
        <TouchableOpacity onPress={onClearChat} className="p-2">
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} className="p-2">
          <MaterialCommunityIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
