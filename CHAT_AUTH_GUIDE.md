# 🔐 Token Authentication for Chat Feature

## Tổng quan

Tính năng chat đã được cập nhật để sử dụng token authentication, đảm bảo bảo mật và kiểm soát quyền truy cập.

## ✅ Các tính năng đã thêm

### 1. **Token-based Authentication**

- Chat API sử dụng Bearer token từ auth state
- Tự động gửi token trong Authorization header
- Xử lý lỗi authentication thông minh

### 2. **API Integration**

```typescript
// Headers với token
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

// Endpoint
POST https://ended-scope-consists-pants.trycloudflare.com/api/chat

// Request body
{
  "question": "Đàn H001 đang ăn thức ăn gì?"
}

// Response format
{
  "answer": "Đàn H001 hiện đang sử dụng 'Thức ăn hỗn hợp hoàn chỉnh cho heo thịt giai đoạn cuối' với liều lượng 2.8 kg/con/ngày từ ngày 2024-10-01 đến 2025-01-31. Ghi chú: Chuẩn bị xuất chuồng, giảm protein tăng năng lượng."
}
```

### 3. **Error Handling**

- **401 Unauthorized**: "Token không hợp lệ. Vui lòng đăng nhập lại."
- **403 Forbidden**: "Bạn không có quyền sử dụng tính năng này."
- **429 Too Many Requests**: "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau ít phút."
- **500 Internal Error**: "Máy chủ đang bảo trì. Vui lòng thử lại sau."

### 4. **UI Authentication State**

- ⚠️ **Không đăng nhập**: Hiển thị cảnh báo và nút đăng nhập
- 🔒 **Input disabled**: Không thể nhập tin nhắn khi chưa đăng nhập
- 🔑 **Auto logout**: Tự động logout khi token hết hạn

## 🛠 Files đã cập nhật

### 1. **`useChat.ts`** - Redux Logic

```typescript
// Lấy token từ auth state
const state = getState() as RootState;
const token = state.auth?.token;

// Kiểm tra token
if (!token) {
  throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
}

// Gửi request với token
headers: createAuthHeaders(token);
```

### 2. **`useChatBot.ts`** - Custom Hook

```typescript
// Kiểm tra authentication trước khi gửi
const sendMessage = (text: string) => {
  if (!auth.token) {
    dispatch(setAuthError("Vui lòng đăng nhập để sử dụng tính năng chat."));
    return;
  }
  // ... gửi tin nhắn
};

// Logout khi có lỗi auth
const handleAuthError = () => {
  dispatch(clearMessages());
  dispatch(logout());
};
```

### 3. **`ChatBot.tsx`** - UI Component

```tsx
// Authentication warning
{
  !isAuthenticated && (
    <View className="bg-yellow-50 p-4 rounded-xl mb-3 border border-yellow-300">
      <Text>Bạn cần đăng nhập để sử dụng tính năng chat.</Text>
      <TouchableOpacity onPress={handleAuthError}>
        <Text>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

// Disabled input khi chưa đăng nhập
<TextInput
  editable={isAuthenticated}
  placeholder={
    !isAuthenticated
      ? "Vui lòng đăng nhập để chat..."
      : "Nhập tin nhắn của bạn..."
  }
/>;
```

### 4. **`apiUtils.ts`** - Utility Functions (New)

```typescript
// Tạo headers với token
export const createAuthHeaders = (token?: string | null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Xử lý API response
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error("Token không hợp lệ...");
      case 403:
        throw new Error("Không có quyền...");
      // ...
    }
  }
  return response.json();
};
```

## 🔄 Authentication Flow

```mermaid
graph TD
    A[User nhập tin nhắn] --> B{Có token?}
    B -->|Không| C[Hiển thị lỗi authentication]
    B -->|Có| D[Gửi tin nhắn với Bearer token]
    D --> E{API Response}
    E -->|200 OK| F[Hiển thị phản hồi]
    E -->|401 Unauthorized| G[Token hết hạn]
    E -->|403 Forbidden| H[Không có quyền]
    E -->|429 Rate Limited| I[Quá nhiều requests]
    G --> J[Auto logout + Clear chat]
    H --> K[Hiển thị lỗi quyền]
    I --> L[Hiển thị lỗi rate limit]
    C --> M[Redirect to login]
    J --> M
    K --> N[Contact admin]
    L --> O[Đợi và thử lại]
```

## 🎯 User Experience

### ✅ **Khi đã đăng nhập:**

- Chat hoạt động bình thường
- Token tự động gửi trong mỗi request
- Tin nhắn được gửi và nhận phản hồi

### ⚠️ **Khi chưa đăng nhập:**

- Hiển thị cảnh báo màu vàng
- Input bị disable với placeholder thông báo
- Nút gửi hiển thị icon khóa thay vì gửi
- Nút "Đăng nhập" để redirect

### 🔑 **Khi token hết hạn:**

- Hiển thị lỗi authentication trong chat
- Nút "Đăng nhập lại"
- Tự động clear chat history
- Auto logout khỏi app

## 🧪 Testing Scenarios

### 1. **Happy Path**

- [x] User đăng nhập → Có token → Chat hoạt động bình thường

### 2. **Authentication Errors**

- [x] Không có token → Hiển thị warning + disable input
- [x] Token hết hạn → Hiển thị lỗi + logout
- [x] Token invalid → Hiển thị lỗi authentication

### 3. **API Errors**

- [x] 401 Unauthorized → "Token không hợp lệ..."
- [x] 403 Forbidden → "Không có quyền..."
- [x] 429 Rate Limited → "Quá nhiều tin nhắn..."
- [x] 500 Server Error → "Máy chủ đang bảo trì..."

### 4. **UI States**

- [x] Loading state khi đang gửi tin nhắn
- [x] Error message styling với icons
- [x] Disabled input khi không authenticated
- [x] Lock icon thay vì send icon

## 📊 Security Benefits

- **🔒 Secure API calls**: Mọi request đều có token validation
- **🚫 Access control**: Chỉ user đã đăng nhập mới chat được
- **⏰ Session management**: Auto logout khi token hết hạn
- **🛡️ Error handling**: Không expose sensitive error details
- **📱 User-friendly**: Clear messages cho mọi trạng thái

## 🔧 Configuration

### API Endpoint

```typescript
const CHAT_API_URL =
  "https://ended-scope-consists-pants.trycloudflare.com/api/chat";
```

### Token Storage

```typescript
// Token được lưu trong Redux auth state
state.auth.token: string | null

// Và persist trong SecureStore
await SecureStore.setItemAsync('userToken', token);
```

### Headers Format

```typescript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
