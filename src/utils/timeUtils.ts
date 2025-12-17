/**
 * Utility functions để xử lý timestamp trong chat
 */

/**
 * Tạo timestamp string cho tin nhắn mới
 */
export const createTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Format timestamp để hiển thị trong UI
 */
export const formatChatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);

    // Kiểm tra nếu là hôm nay
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      // Chỉ hiển thị giờ phút nếu là hôm nay
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Hiển thị ngày tháng nếu không phải hôm nay
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (error) {
    console.warn("Error formatting chat time:", error);
    return "";
  }
};

/**
 * Kiểm tra timestamp có hợp lệ không
 */
export const isValidTimestamp = (timestamp: string): boolean => {
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
