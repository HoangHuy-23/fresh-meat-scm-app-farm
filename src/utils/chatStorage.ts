import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "../hooks/useChat";

const CHAT_HISTORY_KEY = "@chat_history";

export const saveChatHistory = async (messages: ChatMessage[]) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
};

export const loadChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading chat history:", e);
    return [];
  }
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (e) {
    console.error("Error clearing chat history:", e);
  }
};
