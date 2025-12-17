import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KnowledgeUploadModal } from "./KnowledgeUploadModal";
import { MyKnowledgePanel } from "./MyKnowledgePanel";

export interface Conversation {
  _id: string;
  title: string;
  email: string;
  facilityID: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading?: boolean;
  onClose: () => void;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversationId,
  isLoading = false,
  onClose,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showMyKnowledge, setShowMyKnowledge] = useState(false);
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("vi-VN", { weekday: "short" });
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  return (
    <View className="absolute top-0 left-0 bottom-10 w-full z-[100]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-green-500 rounded-tl-2xl rounded-tr-lg">
        <View className="flex-row items-center py-[9px]">
          <MaterialCommunityIcons name="chat" size={24} color="#fff" />
          <Text className="text-lg font-bold text-white ml-2">
            Cuộc hội thoại
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} className="p-1">
          <MaterialCommunityIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* New Conversation Button */}
      <View className="p-3 border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={onNewConversation}
          className="flex-row items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <MaterialCommunityIcons name="plus" size={20} color="#3b82f6" />
          <Text className="text-blue-600 font-medium ml-2">
            Cuộc hội thoại mới
          </Text>
        </TouchableOpacity>
        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={() => setShowUpload(true)}
            className="flex-1 flex-row items-center p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <MaterialCommunityIcons name="upload" size={20} color="#22c55e" />
            <Text className="text-green-600 font-medium ml-2">
              Upload Knowledge
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowMyKnowledge(true)}
            className="flex-1 flex-row items-center p-3 bg-purple-50 rounded-lg border border-purple-200"
          >
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={20}
              color="#7c3aed"
            />
            <Text className="text-purple-700 font-medium ml-2">
              My Knowledge
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-8">
            <MaterialCommunityIcons name="loading" size={48} color="#9ca3af" />
            <Text className="text-gray-500 text-center mt-3">
              Đang tải cuộc hội thoại...
            </Text>
          </View>
        ) : conversations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <MaterialCommunityIcons
              name="chat-outline"
              size={48}
              color="#9ca3af"
            />
            <Text className="text-gray-500 text-center mt-3">
              Chưa có cuộc hội thoại nào.{"\n"}Bắt đầu chat để tạo cuộc hội
              thoại mới!
            </Text>
          </View>
        ) : (
          conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation._id}
              onPress={() => {
                onSelectConversation(conversation._id);
              }}
              className={`p-4 border-b border-gray-100 ${
                currentConversationId === conversation._id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "bg-white"
              }`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons
                      name="chat"
                      size={16}
                      color={
                        currentConversationId === conversation._id
                          ? "#3b82f6"
                          : "#6b7280"
                      }
                    />
                    <Text
                      className={`font-medium ml-2 ${
                        currentConversationId === conversation._id
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                      numberOfLines={1}
                    >
                      {conversation.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500">
                      {formatTime(conversation.updated_at)}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {conversation.facilityID}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation._id);
                    }}
                    className="p-1 mr-2"
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={16}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                  {currentConversationId === conversation._id && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#3b82f6"
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Upload Knowledge Modal */}
      <KnowledgeUploadModal
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => {
          // after upload, optionally open MyKnowledge panel
          setShowMyKnowledge(true);
        }}
      />

      {/* My Knowledge Panel */}
      {showMyKnowledge && (
        <MyKnowledgePanel onClose={() => setShowMyKnowledge(false)} />
      )}
    </View>
  );
};

export default ChatSidebar;
