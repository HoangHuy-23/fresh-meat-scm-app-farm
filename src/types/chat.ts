export interface ChatApiResponse {
  answer?: string;
  response?: string;
  message?: string;
  error?: string;
  // Backend may return a new conversation id on first message
  conversationId?: string; // camelCase variant
  conversation_id?: string; // snake_case variant
  conversation_title?: string;
  user_message_id?: string;
  bot_message_id?: string;
}
