# 🐛 ChatBot Layout Debug Guide

## Vấn đề: Input không hiển thị

### 🔍 **Các bước debug:**

1. **Kiểm tra chiều cao components:**

```typescript
// Trong ChatBot.tsx - thêm vào để debug
console.log("🐛 ChatBot Heights:", {
  screenHeight,
  CHAT_MAX_HEIGHT,
  MESSAGES_HEIGHT,
  HEADER_HEIGHT: CHAT_CONFIG.HEADER_HEIGHT,
  INPUT_HEIGHT: CHAT_CONFIG.INPUT_HEIGHT,
  bottomInset: insets.bottom,
});
```

2. **Kiểm tra input có render không:**

```typescript
// Trong ChatInput.tsx - thêm style debug
style={{
  backgroundColor: 'red', // Màu đỏ để dễ nhìn
  height: inputHeight,
  borderWidth: 2,
  borderColor: 'blue'
}}
```

3. **Kiểm tra KeyboardAvoidingView:**

```typescript
// Log style của KeyboardAvoidingView
console.log("KeyboardAvoidingView style:", {
  height: CHAT_MAX_HEIGHT,
  marginTop: screenHeight * CHAT_CONFIG.TOP_SAFE_AREA_PERCENTAGE,
  marginBottom: Math.max(insets.bottom, 20),
});
```

### 🔧 **Fixes đã thực hiện:**

#### Fix 1: Fixed height cho components

```typescript
// ChatMessages.tsx - Đổi từ flex-1 sang fixed height
style={{
  height: messagesHeight, // Fixed height
}}

// ChatInput.tsx - Thêm fixed height
style={{
  height: inputHeight, // Fixed height
}}
```

#### Fix 2: Layout container

```tsx
// ChatBot.tsx - Thêm flexDirection
style={{
  display: 'flex',
  flexDirection: 'column',
}}

// Wrap input trong View với fixed height
<View style={{ height: CHAT_CONFIG.INPUT_HEIGHT }}>
  <ChatInput ... />
</View>
```

#### Fix 3: Visual debugging

```typescript
// ChatInput.tsx - Border để dễ nhìn
className = "flex-row items-center p-4 border-t-2 border-blue-200 bg-white";
```

### 📱 **Cách test:**

1. **Mở app và mở chatbot**
2. **Kiểm tra console logs** cho height values
3. **Nhìn cuối chat** - phải thấy input với border xanh
4. **Thử tap vào input** - phải focus được

### 🎯 **Expected Result:**

```
┌─────────────────────────────────┐
│ Header (80px height)            │ ← ChatHeader
├─────────────────────────────────┤
│                                 │
│ Messages Area                   │ ← ChatMessages
│ (calculated height)             │
│                                 │
├─────────────────────────────────┤
│ [Input Field] [Send Button]     │ ← ChatInput (80px height)
└─────────────────────────────────┘
```

### 🚨 **Nếu vẫn không thấy input:**

#### Option 1: Absolute positioning

```tsx
// ChatInput với absolute position
<View style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: CHAT_CONFIG.INPUT_HEIGHT,
  backgroundColor: 'white',
  borderTopWidth: 1,
  borderColor: '#e5e7eb'
}}>
  <ChatInput ... />
</View>
```

#### Option 2: Reduce chat height

```typescript
const CHAT_CONFIG = {
  HEIGHT_PERCENTAGE: 0.75, // Giảm từ 0.85 xuống 0.75
  TOP_SAFE_AREA_PERCENTAGE: 0.25,
};
```

#### Option 3: Simple layout

```tsx
// Thay KeyboardAvoidingView bằng View đơn giản
<View style={{ height: CHAT_MAX_HEIGHT }}>
  <ChatHeader />
  <ScrollView style={{ flex: 1 }}>
    <ChatMessages />
  </ScrollView>
  <ChatInput />
</View>
```

### 🔍 **Quick Test:**

Thêm text debug vào ChatInput:

```tsx
<View>
  <Text style={{ color: 'red', fontSize: 20 }}>
    INPUT HERE! Height: {inputHeight}
  </Text>
  <TextInput ... />
</View>
```

### 📊 **Common Issues:**

1. **Overflow hidden**: Parent container cắt input
2. **Zero height**: Tính toán height sai
3. **Z-index**: Input bị che bởi component khác
4. **Flex issues**: Flex-1 không hoạt động đúng
5. **Keyboard**: KeyboardAvoidingView conflict

---

## 🎯 Next Step:

Chạy app và kiểm tra console logs + visual layout để confirm fix đã hoạt động!
