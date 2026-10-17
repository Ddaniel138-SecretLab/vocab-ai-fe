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
      message || `Yêu cầu thất bại (${response.status}).`,
    );
  }
  return data as T;
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Có lỗi xảy ra. Vui lòng thử lại.";
}
