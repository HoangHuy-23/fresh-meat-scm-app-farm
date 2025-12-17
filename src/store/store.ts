import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/useAuth";
import batchesReducer from "../hooks/useBatches";
import chatReducer from "../hooks/useChat";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    batches: batchesReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua serializable check cho chat messages (đã convert timestamp thành string)
        ignoredPaths: ["chat.messages"],
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "chat/loadHistory/fulfilled",
          "chat/addMessage",
        ],
        // Tăng threshold để giảm warning performance
        warnAfter: 128, // Default: 32ms
      },
      // Tắt immutable check trong development để cải thiện performance
      immutableCheck: {
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
