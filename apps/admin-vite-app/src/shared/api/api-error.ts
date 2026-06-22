/**
 * Centralized CMS API error code → human-readable message mapping.
 *
 * Để thêm lỗi mới: thêm entry vào `CMS_ERROR_MESSAGES` với errorCode là key.
 * Nếu errorCode chưa được định nghĩa, `getApiErrorMessage` sẽ trả về message
 * mặc định "Lỗi không xác định."
 */

const CMS_ERROR_MESSAGES: Record<number, string> = {
  // Video
  [-1512]: "Không thể xoá video của người khác",

  // Auth (ví dụ — thêm khi cần)
  // [-1001]: "Phiên đăng nhập đã hết hạn",
  // [-1002]: "Tài khoản không có quyền thực hiện thao tác này",
};

const DEFAULT_ERROR_MESSAGE = "Lỗi không xác định.";

/**
 * Trả về thông báo lỗi dựa trên errorCode từ CMS API.
 * - Nếu errorCode có trong danh sách → dùng message đã định nghĩa.
 * - Nếu không → fallback về `errorMsg` từ server, hoặc message mặc định.
 */
export function getApiErrorMessage(
  errorCode?: number,
  serverMsg?: string,
): string {
  if (errorCode !== undefined && CMS_ERROR_MESSAGES[errorCode]) {
    return CMS_ERROR_MESSAGES[errorCode];
  }
  return serverMsg || DEFAULT_ERROR_MESSAGE;
}

/**
 * Trích xuất errorCode và errorMsg từ Axios error response hoặc
 * từ response data trả về với HTTP 200 nhưng có payload lỗi.
 */
export function extractApiError(error: unknown): {
  errorCode?: number;
  errorMsg?: string;
} {
  if (!error || typeof error !== "object") return {};

  // Axios error (HTTP 4xx/5xx)
  const axiosErr = error as {
    response?: { data?: { error?: { errorCode?: number; errorMsg?: string } } };
  };
  if (axiosErr.response?.data?.error) {
    return axiosErr.response.data.error;
  }

  return {};
}
