# 🧪 Test Plan: Chat Authentication

## Test Cases to Verify

### 1. **Initial State (Not Authenticated)**

- [ ] Open app → Go to Home tab
- [ ] Tap floating chat button
- [ ] **Expected**:
  - Yellow warning box appears
  - Text input is disabled
  - Placeholder shows "Vui lòng đăng nhập để chat..."
  - Send button shows lock icon instead of send icon
  - "Đăng nhập" button is visible

### 2. **Authentication Required Flow**

- [ ] Tap "Đăng nhập" button in chat warning
- [ ] **Expected**:
  - Chat closes
  - Navigates to login screen
  - User can login normally

### 3. **Authenticated Chat (Happy Path)**

- [ ] Login with valid credentials
- [ ] Go to Home → Open chat
- [ ] **Expected**:
  - No warning message
  - Input is enabled
  - Placeholder shows "Nhập tin nhắn của bạn..."
  - Send button shows send icon
- [ ] Type message and send
- [ ] **Expected**:
  - Loading state shows
  - Message appears in chat
  - API responds with assistant message

### 4. **Token Validation**

- [ ] Send a chat message
- [ ] **Expected Headers**:
  ```
  Authorization: Bearer {valid_token}
  Content-Type: application/json
  ```
- [ ] **Expected Payload**:
  ```json
  {
    "question": "Đàn H001 đang ăn thức ăn gì?"
  }
  ```
- [ ] **Expected Response**:
  ```json
  {
    "answer": "Đàn H001 hiện đang sử dụng 'Thức ăn hỗn hợp hoàn chỉnh cho heo thịt giai đoạn cuối'..."
  }
  ```

### 5. **Token Expiration (401 Error)**

- [ ] Simulate expired token or manually expire
- [ ] Try to send message
- [ ] **Expected**:
  - Error message: "Token không hợp lệ. Vui lòng đăng nhập lại."
  - Chat history gets cleared
  - User gets logged out automatically
  - Redirected to login screen

### 6. **Permission Error (403 Forbidden)**

- [ ] Simulate 403 response from API
- [ ] **Expected**:
  - Error message: "Bạn không có quyền sử dụng tính năng này."
  - Chat remains open but shows error
  - User stays logged in

### 7. **Rate Limiting (429 Error)**

- [ ] Send many messages quickly
- [ ] **Expected**:
  - Error message: "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau ít phút."
  - Input temporarily disabled or rate limited

### 8. **Server Error (500)**

- [ ] Simulate server error
- [ ] **Expected**:
  - Error message: "Máy chủ đang bảo trì. Vui lòng thử lại sau."
  - User can retry sending message

### 9. **Network Error**

- [ ] Turn off internet or simulate network failure
- [ ] Try to send message
- [ ] **Expected**:
  - Error message about network connection
  - Message remains in input for retry

### 10. **UI State Persistence**

- [ ] Open chat → Close chat → Reopen chat
- [ ] **Expected**:
  - Authentication state persists
  - Previous messages remain visible
  - Input state is correct for auth status

## Manual Testing Instructions

### Setup

1. Make sure app is running on port 8083
2. Have test account credentials ready
3. Use React Native Debugger or Flipper for network inspection

### Test Authentication States

#### Test 1: Unauthenticated State

```
1. Fresh app install or logout
2. Home tab → Floating chat button
3. Verify warning UI and disabled input
4. Try typing → should not work
5. Tap "Đăng nhập" → should close chat and go to login
```

#### Test 2: Successful Authentication

```
1. Login with valid credentials
2. Go back to Home → Open chat
3. Verify enabled input and normal UI
4. Send test message: "Xin chào!"
5. Check network tab for proper headers
6. Verify API response appears in chat
```

#### Test 3: Token Expiration

```
1. While logged in and in chat
2. Manually clear token from SecureStore (dev tools)
3. Try to send message
4. Verify error handling and logout flow
```

### Network Inspection

Use Flipper or React Native Debugger to check:

- ✅ Request URL: `https://ended-scope-consists-pants.trycloudflare.com/api/chat`
- ✅ Method: `POST`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Body: `{"message": "...", "timestamp": "..."}`

### Error Simulation

To test error scenarios:

1. **401**: Modify token to invalid value
2. **403**: Use token with insufficient permissions
3. **429**: Send 10+ messages rapidly
4. **500**: Mock API to return server error
5. **Network**: Turn off WiFi/data

## Expected Results Summary

| Test Case         | Expected UI                  | Expected Behavior      |
| ----------------- | ---------------------------- | ---------------------- |
| Not authenticated | Warning box + disabled input | Redirect to login      |
| Authenticated     | Normal chat UI               | Send messages normally |
| Token expired     | Error + logout               | Clear chat + redirect  |
| No permission     | Error message                | Stay logged in         |
| Rate limited      | Rate limit error             | Temporary disable      |
| Server error      | Server error                 | Allow retry            |
| Network error     | Network error                | Allow retry            |

## Success Criteria

✅ **Authentication Integration**

- Token automatically sent with requests
- Proper error handling for all auth states
- UI clearly indicates authentication status

✅ **User Experience**

- Smooth login flow from chat
- Clear error messages in Vietnamese
- No confusing or broken states

✅ **Security**

- No token leakage in logs
- Proper token validation
- Secure token storage

✅ **Performance**

- Fast authentication checks
- Minimal impact on chat performance
- Proper loading states

## Debug Commands

### Check Redux State

```javascript
// In React Native Debugger console
store.getState().auth.token;
store.getState().chat.messages;
```

### Check SecureStore

```javascript
import * as SecureStore from "expo-secure-store";
SecureStore.getItemAsync("userToken");
```

### Simulate API Errors

```javascript
// Mock fetch to return different error codes
global.fetch = jest.fn().mockRejectedValue(new Error("401"));
```
