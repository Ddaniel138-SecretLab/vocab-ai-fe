export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  ).replace(/\/$/, "");
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      signal: options.signal ?? AbortSignal.timeout(20000),
    });
  } catch {
    throw new ApiError(
      0,
      "Không kết nối được máy chủ. Kiểm tra backend và kết nối mạng rồi thử lại.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (
      response.status === 401 &&
      ![
        "/auth/login",
        "/admin/auth/login",
        "/auth/register/verify-code",
        "/auth/password/request-code",
        "/auth/password/verify-code",
        "/auth/password/reset",
      ].includes(path) &&
      typeof window !== "undefined"
    )
      window.dispatchEvent(new Event("auth:expired"));
    const message = Array.isArray(data?.message)
      ? data.message.join(" · ")
      : data?.message;
    throw new ApiError(
      response.status,
      userFacingApiMessage(response.status, path, message),
    );
  }
  return data as T;
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Có lỗi xảy ra. Vui lòng thử lại.";
}

// Technical provider messages remain available in the Network response for developers.
export function userFacingApiMessage(
  status: number,
  path: string,
  message: unknown,
) {
  if (typeof message === "string" && /[À-ỹĐđ]/.test(message)) return message;
  if (status === 401)
    return path.includes("login")
      ? "Email hoặc mật khẩu chưa đúng. Bạn hãy kiểm tra lại."
      : "Phiên đăng nhập đã hết hạn. Bạn hãy đăng nhập lại.";
  if (status === 403) return "Bạn chưa có quyền thực hiện thao tác này.";
  if (status === 404)
    return "Không tìm thấy nội dung này. Bạn hãy tải lại trang.";
  if (status === 429)
    return "Bạn đã đạt giới hạn thao tác. Hãy đợi một lúc hoặc kiểm tra hạn mức rồi thử lại.";
  if (status === 409)
    return "Dữ liệu đang được cập nhật hoặc đã thay đổi. Bạn hãy tải lại rồi thử lại.";
  if (status === 400 || status === 422)
    return "Thông tin chưa hợp lệ. Bạn hãy kiểm tra các mục vừa nhập.";
  if (path.startsWith("/ai/"))
    return "AI tạm thời chưa xử lý được yêu cầu. Bạn hãy thử lại sau; có thể tiếp tục học từ hiện có.";
  return "Hệ thống tạm thời chưa xử lý được yêu cầu. Bạn hãy thử lại sau.";
}
