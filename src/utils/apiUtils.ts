/**
 * Utility functions để xử lý API calls với authentication
 */

/**
 * Tạo headers cho API requests với token
 */
export const createAuthHeaders = (
  token?: string | null
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Kiểm tra response và xử lý authentication errors
 */
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      case 403:
        throw new Error("Bạn không có quyền sử dụng tính năng này.");
      case 429:
        throw new Error(
          "Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau ít phút."
        );
      case 500:
        throw new Error("Máy chủ đang bảo trì. Vui lòng thử lại sau.");
      default:
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
};

/**
 * Kiểm tra xem error có phải authentication error không
 */
export const isAuthError = (error: string): boolean => {
  return (
    error.includes("token") ||
    error.includes("xác thực") ||
    error.includes("đăng nhập") ||
    error.includes("401")
  );
};

/**
 * Format error message cho user
 */
export const formatErrorMessage = (error: string): string => {
  if (error.includes("token") || error.includes("xác thực")) {
    return "⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục trò chuyện.";
  }

  if (error.includes("HTTP 401")) {
    return "🔐 Không có quyền truy cập. Vui lòng đăng nhập lại.";
  }

  if (error.includes("HTTP 403")) {
    return "🚫 Bạn không có quyền sử dụng tính năng này.";
  }

  if (error.includes("HTTP 429")) {
    return "⏰ Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau ít phút.";
  }

  if (error.includes("HTTP 500")) {
    return "🔧 Máy chủ đang bảo trì. Vui lòng thử lại sau.";
  }

  return "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
};
