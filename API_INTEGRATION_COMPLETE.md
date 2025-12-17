# Tích hợp API Backend cho Conversations

## 🎯 Tổng quan cập nhật

Đã thành công tích hợp với backend API để quản lý conversations và messages, thay thế hoàn toàn AsyncStorage bằng API calls.

## ✅ Tính năng đã cập nhật

### 1. **API Integration**

- ✅ Lấy danh sách conversations từ API: `GET /api/conversations`
- ✅ Lấy messages của conversation: `GET /api/conversations/{id}/messages`
- ✅ Tạo conversation mới: `POST /api/conversations`
- ✅ Xóa conversation: `DELETE /api/conversations/{id}`
- ✅ Gửi message với conversation ID: `POST /api/chat`

### 2. **Data Structure Updates**

```typescript
// Conversation từ API
interface ConversationResponse {
  email: string;
  facilityID: string;
  title: string;
  _id: string;
  created_at: string;
  updated_at: string;
}

// Message từ API
interface MessageResponse {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: "user" | "bot";
  sender_id: string | null;
  timestamp: string;
}
```

### 3. **Component Updates**

- ✅ ChatSidebar hiển thị conversations từ API với icon chat và title
- ✅ Hiển thị facility ID và timestamp
- ✅ Highlight conversation hiện tại
- ✅ Delete và select conversations

## 📁 Files đã cập nhật

### API Layer:

- `src/api/conversationApi.ts` - Thêm functions:
  - `getConversationMessages()` - Lấy messages của conversation
  - Interface `MessageResponse` và `MessagesResponse`

### Hooks Layer:

- `src/hooks/useConversations.ts` - Hoàn toàn mới:
  - Sử dụng API thay vì AsyncStorage
  - `loadConversationMessages()` convert API data sang ChatMessage format
  - Quản lý state conversations từ backend

- `src/hooks/useChat.ts` - Thêm:
  - `sendChatMessageWithConversation()` - Gửi message với conversation ID
  - Reducers cho async thunk mới

- `src/hooks/useChatBot.ts` - Cập nhật:
  - Sử dụng `sendChatMessageWithConversation` khi có conversation ID
  - Fallback về `sendChatMessage` nếu không có conversation ID

### UI Components:

- `src/components/chat/ChatSidebar.tsx` - Cập nhật hiển thị:
  - Sử dụng `_id` thay vì `id`
  - Hiển thị icon chat + title
  - Hiển thị facility ID và formatted timestamp
  - Xử lý conversation selection và deletion

## 🔄 User Flow mới

### 1. **Load Conversations**

```
User mở app → useConversations loads từ API → Hiển thị sidebar với danh sách
```

### 2. **Chọn Conversation**

```
User click conversation → Load messages từ API → Convert sang ChatMessage format → Hiển thị trong chat
```

### 3. **Gửi Message**

```
User gửi message → Tạo conversation mới nếu chưa có → Gửi với conversation_id → Bot trả lời → Lưu vào backend
```

### 4. **Quản lý Conversations**

```
- Tạo mới: POST /api/conversations
- Xóa: DELETE /api/conversations/{id}
- Load messages: GET /api/conversations/{id}/messages
```

## 🎨 UI Improvements

### ChatSidebar hiển thị:

- **Icon**: Chat icon cho mỗi conversation
- **Title**: Title từ API
- **Facility ID**: `facilityID` field
- **Timestamp**: Formatted time (hôm nay: HH:mm, tuần này: weekday, cũ hơn: dd/mm)
- **Current indicator**: Highlight conversation đang active
- **Delete button**: Xóa conversation với confirmation

## 🔧 API Endpoints sử dụng

```typescript
// Lấy conversations
GET /api/conversations?limit=10&offset=0

// Lấy messages
GET /api/conversations/{conversationId}/messages?limit=50&offset=0

// Tạo conversation
POST /api/conversations
Body: { title: "New Chat" }

// Xóa conversation
DELETE /api/conversations/{conversationId}

// Gửi message
POST /api/chat
Body: {
  question: "heo 150 ngay tuoi thi an gi",
  conversation_id: "6900e26b47f61b4919111064"
}
```

## 📱 Data Conversion

### API Messages → ChatMessage:

```typescript
const chatMessages: ChatMessage[] = messagesData.map(
  (msg: MessageResponse) => ({
    id: msg.id,
    text: msg.content,
    isUser: msg.sender_type === "user",
    timestamp: msg.timestamp,
  })
);
```

## 🚀 Ready Features

- ✅ Sidebar hiển thị conversations với icon và title
- ✅ Load messages khi chọn conversation
- ✅ Gửi message với conversation context
- ✅ Tạo conversation mới tự động
- ✅ Xóa conversations
- ✅ Real-time conversation management

## 🎯 Next Steps (Optional)

- Search conversations
- Conversation categories
- Message pagination
- Real-time message updates
- Conversation sharing
