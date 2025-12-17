# Chatbot Feature Documentation

## Tổng quan

Tính năng chatbot được tích hợp vào ứng dụng trang trại để hỗ trợ người dùng thông qua trò chuyện AI.

## 🎯 Cập nhật mới nhất: Full-Screen Chat Interface

### Chiều cao tối ưu hóa:

- **Gần toàn màn hình**: Chatbot chiếm gần như toàn bộ chiều cao màn hình
- **Safe Area Support**: Tương thích với notch, status bar và navigation bar
- **Responsive Design**: Tự động điều chỉnh theo kích thước màn hình khác nhau
- **Dynamic Heights**: Tính toán động dựa trên Dimensions và useSafeAreaInsets

## Cấu trúc File

### 1. Redux State Management

- **`src/hooks/useChat.ts`**: Redux slice quản lý state chatbot
- **`src/hooks/useChatBot.ts`**: Custom hook để tương tác với chatbot
- **`src/store/store.ts`**: Cấu hình Redux store (đã cập nhật)

### 2. Components

- **`src/components/ChatBot.tsx`**: Component giao diện chat chính
- **`src/components/ChatFloatingButton.tsx`**: Nút floating để mở/đóng chat

### 3. Types & Utils

- **`src/types/chat.ts`**: TypeScript interfaces cho chat
- **`src/utils/chatStorage.ts`**: Utility functions để lưu trữ lịch sử chat

## Tính năng

### ✅ Giao diện

- **Floating Button**: Nút tròn ở góc phải màn hình
- **Bubble Chat**: Giao diện chat dạng bubble với hiệu ứng mượt mà
- **Badge thông báo**: Hiển thị số tin nhắn chưa đọc

### ✅ Chức năng chính

- **Gửi tin nhắn**: Nhập và gửi tin nhắn tới API
- **Nhận phản hồi**: Hiển thị phản hồi từ chatbot
- **Lưu lịch sử**: Tự động lưu tin nhắn vào AsyncStorage
- **Tải lịch sử**: Khôi phục tin nhắn khi mở lại app

### ✅ UX/UI

- **Haptic feedback**: Rung nhẹ khi tương tác
- **Loading indicator**: Hiển thị trạng thái đang xử lý
- **Auto scroll**: Tự động cuộn xuống tin nhắn mới
- **Keyboard handling**: Xử lý bàn phím tốt
- **Animations**: Hiệu ứng mở/đóng mượt mà

## API Configuration

### Endpoint

```
POST https://ended-scope-consists-pants.trycloudflare.com/api/chat
```

### Request Body

```json
{
  "question": "Câu hỏi của người dùng"
}
```

### Response Expected

```json
{
  "response": "Phản hồi từ AI",
  "message": "Hoặc sử dụng trường message"
}
```

## Sử dụng

### 1. Trong Component

```tsx
import useChatBot from "../hooks/useChatBot";

const MyComponent = () => {
  const {
    messages,
    isLoading,
    isOpen,
    sendMessage,
    toggleChatBot,
    clearChatHistory,
  } = useChatBot();

  // Sử dụng các method...
};
```

### 2. Redux Actions

```tsx
import { useDispatch } from "react-redux";
import {
  addMessage,
  toggleChat,
  sendChatMessage,
  clearMessages,
} from "../hooks/useChat";

const dispatch = useDispatch();

// Gửi tin nhắn
dispatch(sendChatMessage("Hello"));

// Toggle chat
dispatch(toggleChat());
```

## Customization

### 1. Thay đổi API Endpoint

Sửa URL trong `src/hooks/useChat.ts`:

```tsx
const response = await fetch("YOUR_NEW_API_ENDPOINT", {
  // ...
});
```

### 2. Tùy chỉnh giao diện

Chỉnh sửa styles trong `src/components/ChatBot.tsx` và `src/components/ChatFloatingButton.tsx`

### 3. Thêm tính năng mới

- Extend `ChatState` interface trong `src/hooks/useChat.ts`
- Thêm reducer actions
- Cập nhật components

## Lưu ý quan trọng

1. **Network**: Đảm bảo device có kết nối internet để API hoạt động
2. **Storage**: AsyncStorage được sử dụng để lưu lịch sử chat
3. **Performance**: Lịch sử chat được lưu sau mỗi tin nhắn
4. **Error Handling**: Có xử lý lỗi khi API không phản hồi

## Debugging

### 1. Kiểm tra Redux DevTools

```bash
# Enable Redux DevTools trong development
```

### 2. Log API Calls

Thêm console.log trong `sendChatMessage` thunk để debug API

### 3. Check AsyncStorage

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

// Kiểm tra dữ liệu
AsyncStorage.getItem("@chat_history").then(console.log);
```

## Dependencies sử dụng

- `@reduxjs/toolkit`: State management
- `@react-native-async-storage/async-storage`: Local storage
- `expo-haptics`: Haptic feedback
- `react-native-reanimated`: Animations (nếu cần)

## Cải tiến tương lai

- [ ] Gửi hình ảnh
- [ ] Voice messages
- [ ] Chat history search
- [ ] Multiple conversation threads
- [ ] Offline mode
- [ ] Push notifications cho tin nhắn mới
