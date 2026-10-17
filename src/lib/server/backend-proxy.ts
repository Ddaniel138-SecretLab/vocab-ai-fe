import type { NextApiRequest, NextApiResponse } from "next";
import http from "node:http";
import https from "node:https";

const SESSION = "vocab_session";
const roots = new Set([
  "health",
  "auth",
  "admin",
  "users",
  "topics",
  "study",
  "dashboard",
  "learning",
  "ai",
  "audio",
]);

export function rewriteSessionCookie(
  cookie: string,
  secure: boolean,
): string | null {
  if (!cookie.startsWith(SESSION + "=")) return null;
  const parts = cookie.split(";").map((part) => part.trim());
  const attributes = parts
    .slice(1)
    .filter(
      (part) => !/^(domain|path|samesite|secure|httponly)(=|$)/i.test(part),
    );
  return [
    parts[0],
    ...attributes,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export async function backendProxy(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vary", "Cookie");
  const fail = (status: number, message: string) => {
    if (!res.headersSent)
      res.status(status).json({ statusCode: status, message });
  };
  const method = req.method ?? "GET";
  if (
    !["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"].includes(
      method,
    )
  ) {
    res.setHeader("Allow", "GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS");
    fail(405, "Thao tác này không được hỗ trợ.");
    return;
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const origin = req.headers.origin;
    let sameOrigin = false;
    try {
      sameOrigin =
        typeof origin === "string" && new URL(origin).host === req.headers.host;
    } catch {
      /* invalid Origin */
    }
    if (
      (origin !== undefined && !sameOrigin) ||
      req.headers["sec-fetch-site"] === "cross-site"
    ) {
      fail(403, "Yêu cầu không đến từ giao diện được cho phép.");
      return;
    }
  }
  const segments = req.query.path;
  if (
    !Array.isArray(segments) ||
    !roots.has(segments[0]) ||
    segments.some((part) => !/^[a-zA-Z0-9_-]+$/.test(part))
  ) {
    fail(400, "Đường dẫn API không hợp lệ.");
    return;
  }
  let target: URL;
  try {
    const configured =
      process.env.BACKEND_API_URL ||
      (process.env.VERCEL ? "" : "http://localhost:3001/api");
    const base = new URL(configured);
    if (
      base.username ||
      base.password ||
      base.search ||
      base.hash ||
      base.pathname.replace(/\/$/, "") !== "/api"
    )
      throw new Error("Invalid API base");
    if (
      base.protocol !== "https:" &&
      !(
        base.protocol === "http:" &&
        !process.env.VERCEL &&
        ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)
      )
    )
      throw new Error("HTTPS required");
    target = new URL(
      base.toString().replace(/\/$/, "") + "/" + segments.join("/"),
    );
    target.search = new URL(req.url ?? "/", "http://proxy.local").search;
  } catch {
    fail(
      503,
      "Kết nối API chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
    );
    return;
  }

  const headers: http.OutgoingHttpHeaders = {
    accept: req.headers.accept ?? "application/json",
    "accept-encoding": "identity",
  };
  const session = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(SESSION + "="));
  if (session) headers.cookie = session;
  // Preserve the browser Origin so the BE keeps its own CSRF/origin checks.
  if (req.headers.origin) headers.origin = req.headers.origin;
  if (req.headers.range) headers.range = req.headers.range;
  let body: Buffer | undefined;
  if (
    !["GET", "HEAD", "OPTIONS"].includes(method) &&
    req.body !== undefined &&
    req.body !== null &&
    req.body !== ""
  ) {
    if (!req.headers["content-type"]?.startsWith("application/json")) {
      fail(415, "API chỉ hỗ trợ dữ liệu JSON.");
      return;
    }
    const input: unknown = req.body;
    body = Buffer.from(
      typeof input === "string" ? input : JSON.stringify(input),
    );
    headers["content-type"] = "application/json";
    headers["content-length"] = body.length;
  }
  await new Promise<void>((resolve) => {
    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve();
      }
    };
    const upstream = (target.protocol === "https:" ? https : http).request(
      target,
      { method, headers },
      (response) => {
        if (
          (response.statusCode ?? 502) >= 300 &&
          (response.statusCode ?? 502) < 400
        ) {
          response.resume();
          fail(502, "Máy chủ API trả về chuyển hướng không hợp lệ.");
          done();
          return;
        }
        if ((response.headers["content-type"] ?? "").includes("text/html")) {
          response.resume();
          fail(
            503,
            "Máy chủ đang khởi động hoặc tạm thời chưa sẵn sàng. Bạn hãy thử lại sau.",
          );
          done();
          return;
        }
        res.statusCode = response.statusCode ?? 502;
        for (const name of [
          "content-type",
          "retry-after",
          "content-disposition",
          "content-range",
          "accept-ranges",
        ]) {
          const value = response.headers[name];
          if (value !== undefined) res.setHeader(name, value);
        }
        const secure =
          process.env.VERCEL === "1" ||
          ("encrypted" in req.socket && req.socket.encrypted === true);
        const cookies = (response.headers["set-cookie"] ?? [])
          .map((cookie) => rewriteSessionCookie(cookie, secure))
          .filter((cookie): cookie is string => cookie !== null);
        if (cookies.length) res.setHeader("Set-Cookie", cookies);
        response.on("error", () => {
          if (res.headersSent) res.destroy();
          else fail(502, "Kết nối API bị gián đoạn. Bạn hãy thử lại.");
          done();
        });
        response.on("end", done);
        response.pipe(res);
      },
    );
    const timer = setTimeout(() => {
      fail(
        504,
        "Yêu cầu xử lý quá lâu. Bạn hãy kiểm tra dữ liệu đã lưu trước khi thử lại.",
      );
      upstream.destroy();
      done();
    }, 280000);
    upstream.on("error", () => {
      if (!finished) {
        fail(502, "Chưa kết nối được máy chủ API. Bạn hãy thử lại sau.");
        done();
      }
    });
    res.on("close", () => {
      if (!res.writableEnded) upstream.destroy();
      done();
    });
    upstream.end(body);
  });
}
