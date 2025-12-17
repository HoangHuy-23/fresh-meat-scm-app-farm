import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  inputHeight: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isAuthenticated,
  inputHeight,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Gửi tin nhắn
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <View
      style={{
        height: inputHeight,
        backgroundColor: "#ffffff",
        borderTopWidth: 2,
        borderTopColor: "#3b82f6", // Blue border để dễ nhìn
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
      }}
      className="flex-row items-center px-4 pb-12"
    >
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder={
          !isAuthenticated
            ? "Vui lòng đăng nhập để chat..."
            : "Nhập tin nhắn của bạn..."
        }
        multiline
        maxLength={500}
        editable={isAuthenticated}
        className={`flex-1 border rounded-full px-4 py-3 max-h-24 text-base ${
          isAuthenticated
            ? "border-gray-300 bg-white"
            : "border-gray-200 bg-gray-100"
        }`}
        style={{
          textAlignVertical: "center",
          minHeight: 48,
        }}
      />
      <TouchableOpacity
        onPress={handleSendMessage}
        disabled={!inputText.trim() || isLoading || !isAuthenticated}
        className={`ml-3 w-14 h-14 rounded-full justify-center items-center shadow-lg ${
          inputText.trim() && !isLoading && isAuthenticated
            ? "bg-green-500"
            : "bg-gray-300"
        }`}
      >
        <MaterialCommunityIcons
          name={!isAuthenticated ? "lock" : "send"}
          size={22}
          color={
            inputText.trim() && !isLoading && isAuthenticated
              ? "#fff"
              : "#9CA3AF"
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
