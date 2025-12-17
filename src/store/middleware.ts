import { isPlainObject } from "@reduxjs/toolkit";

/**
 * Custom serializable check để tối ưu hóa performance
 */
export const customSerializableCheck = {
  // Bỏ qua kiểm tra cho các paths có thể chứa Date objects
  ignoredPaths: ["chat.messages"],

  // Bỏ qua các action types
  ignoredActions: [
    "persist/PERSIST",
    "persist/REHYDRATE",
    "persist/PAUSE",
    "persist/PURGE",
    "persist/REGISTER",
    "chat/loadHistory/fulfilled",
    "chat/addMessage",
  ],

  // Custom function để kiểm tra serializable
  isSerializable: (value: any): boolean => {
    // Cho phép strings, numbers, booleans, null, undefined
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null ||
      value === undefined
    ) {
      return true;
    }

    // Cho phép plain objects và arrays
    if (isPlainObject(value) || Array.isArray(value)) {
      return true;
    }

    // Cho phép Date objects trong chat messages (sẽ được convert thành string)
    if (value instanceof Date) {
      return true;
    }

    return false;
  },

  // Tăng threshold warning
  warnAfter: 128, // ms
};
