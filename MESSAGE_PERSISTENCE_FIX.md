# Fix Tin nhắn biến mất - Message Persistence Issues

## 🎯 Vấn đề

Tin nhắn hiển thị lên rồi biến mất ngay lập tức khi sử dụng backend API.

## 🔍 Nguyên nhân

1. **Race Condition**: `loadConversationMessages` và `saveConversationMessages` chạy đồng thời
2. **Local Storage Conflicts**: `saveChatHistory` ghi đè lên messages từ API
3. **Effect Dependencies**: Multiple useEffect triggers gây reload không mong muốn

## ✅ Giải pháp đã áp dụng

### 1. **Tắt Local Storage Auto-Save**

```typescript
// Trong useChat.ts - Tắt tất cả saveChatHistory
addMessage: (state, action) => {
  // Tạm thời tắt save local vì sử dụng backend
  // saveChatHistory(state.messages);
};
```

### 2. **Tắt Auto-Save Messages Effect**

```typescript
// Trong useChatBot.ts - Tắt effect gây xung đột
// useEffect(() => {
//   const saveMessages = async () => {
//     if (currentConversationId && chat.messages.length > 0) {
//       await saveConversationMessages(currentConversationId, chat.messages);
//     }
//   };
//   saveMessages();
// }, [chat.messages, currentConversationId, saveConversationMessages]);
```

### 3. **Smart Message Loading**

```typescript
// Chỉ load messages khi KHÔNG đang gửi tin nhắn
useEffect(() => {
  const loadMessages = async () => {
    if (currentConversationId && !chat.isLoading) {
      const messages = await loadConversationMessages(currentConversationId);
      dispatch(setMessages(messages));
    }
  };

  if (!chat.isLoading) {
    loadMessages();
  }
}, [currentConversationId, chat.isLoading]);
```

### 4. **Reload Messages Sau Bot Response**

```typescript
// Reload messages sau khi bot trả lời để đồng bộ với backend
useEffect(() => {
  const reloadAfterBotResponse = async () => {
    if (currentConversationId && !chat.isLoading && chat.messages.length > 0) {
      setTimeout(async () => {
        const messages = await loadConversationMessages(currentConversationId);
        dispatch(setMessages(messages));
      }, 1000); // Đợi backend lưu xong
    }
  };

  reloadAfterBotResponse();
}, [chat.isLoading, currentConversationId]);
```

## 🔄 Luồng hoạt động mới

### **Khi chọn conversation:**

1. Load messages từ API
2. Set vào Redux store
3. Hiển thị trong UI

### **Khi gửi tin nhắn:**

1. Thêm user message vào Redux (local)
2. Gửi đến backend API với conversation_id
3. Backend tự động lưu user message + bot response
4. Sau 1 giây, reload messages từ API để đồng bộ

### **Khi nhận bot response:**

1. Bot response được thêm vào Redux (local)
2. Sau khi `isLoading = false`, reload messages từ API
3. Messages từ backend sẽ ghi đè messages local

## 📝 Files đã thay đổi

### `src/hooks/useChat.ts`

- ❌ Tắt tất cả `saveChatHistory` calls
- ❌ Remove `saveChatHistory` import
- ✅ Giữ nguyên logic add messages local

### `src/hooks/useChatBot.ts`

- ❌ Tắt `saveConversationMessages` effect
- ✅ Thêm smart loading với `!chat.isLoading` check
- ✅ Thêm reload effect sau bot response
- ✅ Console logs để debug

### Logic mới:

- **Single Source of Truth**: Backend API
- **Local Redux**: Chỉ để UI responsive, không persist
- **Auto Sync**: Reload từ API sau mỗi bot response

## 🎯 Kết quả mong đợi

- ✅ Tin nhắn không biến mất
- ✅ Messages đồng bộ với backend
- ✅ UI responsive khi gửi tin nhắn
- ✅ Conversations persist qua sessions
- ✅ Multiple conversations hoạt động đúng

## 🔧 Debug Info

Thêm console logs để theo dõi:

```
"Loading messages for conversation: {conversationId}"
"Loaded messages: [{messages}]"
"Reloading messages after bot response"
```

## 🚨 Lưu ý

- **Backend phải tự lưu messages** khi gửi qua `/api/chat`
- **Không dùng AsyncStorage** cho messages nữa
- **Delay 1s** để đảm bảo backend lưu xong trước khi reload
- **Race conditions** đã được xử lý bằng `!chat.isLoading` checks
