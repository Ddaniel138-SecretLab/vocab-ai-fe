/* eslint-disable @typescript-eslint/no-require-imports */
// Isolated UI contract test. Never connects to real services.
const assert = require("node:assert/strict"),
  http = require("node:http"),
  { spawn } = require("node:child_process"),
  path = require("node:path");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const calls = [],
  users = new Map();
const base = {
  id: "admin-1",
  email: "admin@example.com",
  role: "ADMIN",
  isActive: true,
  deletedAt: null,
  emailVerifiedAt: "2026-10-16T00:00:00Z",
  createdAt: "2026-10-16T00:00:00Z",
  updatedAt: "2026-10-16T00:00:00Z",
  lastLoginAt: null,
  profile: null,
  _count: { studySessions: 0, vocabularyProgress: 0, createdTopics: 0 },
};
users.set(base.id, base);
let topicsUsed = 0,
  resetUsed = false;
const quota = () => ({
  dateKey: "2026-10-16",
  timeZone: "Asia/Ho_Chi_Minh",
  limit: 3,
  used: topicsUsed,
  reserved: 0,
  remaining: 3 - topicsUsed,
});
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const input = raw ? JSON.parse(raw) : {},
    url = new URL(req.url, "http://localhost"),
    route = url.pathname,
    method = req.method;
  calls.push({ route, method, input });
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };
  const role = /vocab_session=admin/.test(req.headers.cookie || "")
    ? "ADMIN"
    : /vocab_session=user/.test(req.headers.cookie || "")
      ? "USER"
      : null;
  if (route === "/api/auth/password/request-code")
    return send(200, { message: "If eligible, email sent." });
  if (route === "/api/auth/password/verify-code")
    return input.code === "123456"
      ? send(200, { resetToken: "private-reset-grant", expiresIn: 600 })
      : send(401, { message: "Invalid reset code." });
  if (route === "/api/auth/password/reset") {
    if (resetUsed || input.resetToken !== "private-reset-grant")
      return send(401, { message: "Expired reset token." });
    resetUsed = true;
    return send(200, { message: "Password changed." });
  }
  if (route.endsWith("/login")) {
    if (route.startsWith("/api/admin") && input.email !== "admin@example.com")
      return send(403, { message: "Admin access required." });
    const admin = input.email === "admin@example.com";
    res.setHeader(
      "Set-Cookie",
      `vocab_session=${admin ? "admin" : "user"}; HttpOnly; Path=/; SameSite=Lax`,
    );
    return send(200, {
      user: {
        ...base,
        id: admin ? "admin-1" : "user-1",
        email: input.email,
        role: admin ? "ADMIN" : "USER",
      },
    });
  }
  if (route.endsWith("/logout")) {
    res.setHeader("Set-Cookie", "vocab_session=; Max-Age=0; Path=/");
    return send(200, { message: "Logged out." });
  }
  if (!role) return send(401, { message: "Unauthorized" });
  if (route === "/api/auth/me" || route === "/api/admin/auth/me")
    return send(200, {
      user: { ...base, id: role === "ADMIN" ? "admin-1" : "user-1", role },
    });
  if (route === "/api/users/me/profile")
    return send(200, {
      profile:
        role === "ADMIN"
          ? null
          : {
              displayName: "Student",
              dateOfBirth: "2011-01-01",
              schoolStage: "MIDDLE_SCHOOL",
              englishLevel: "BEGINNER",
              interests: [],
              learningGoal: "",
            },
      isProfileComplete: role !== "ADMIN",
    });
  if (route.startsWith("/api/admin") && role !== "ADMIN")
    return send(403, { message: "Forbidden" });
  if (route === "/api/admin/dashboard")
    return send(200, {
      dateKey: "2026-10-16",
      timeZone: "Asia/Ho_Chi_Minh",
      statistics: { users: users.size, activeUsers: users.size },
      recentUsers: [base],
      applicationAiRequests: {
        unit: "requests",
        limit: 20,
        used: null,
        remaining: null,
        scope: "THIS_APPLICATION_ONLY",
      },
      cloudflare: {
        unit: "Neurons",
        remaining: null,
        liveUsageFetched: false,
        dashboardUrl: "https://dash.cloudflare.com/",
        docsUrl: "https://developers.cloudflare.com/",
        resetTimeZone: "UTC",
      },
    });
  if (route === "/api/admin/users" && method === "POST") {
    const u = {
      ...base,
      ...input,
      id: "created-1",
      role: input.role || "USER",
      emailVerifiedAt: input.emailVerified ? base.emailVerifiedAt : null,
    };
    users.set(u.id, u);
    return send(201, { user: u });
  }
  if (route === "/api/admin/users") {
    const items = [...users.values()].filter(
      (u) =>
        !url.searchParams.get("q") ||
        u.email.includes(url.searchParams.get("q")),
    );
    return send(200, { items, total: items.length, page: 1, limit: 20 });
  }
  if (route.startsWith("/api/admin/users/")) {
    const id = route.split("/").pop(),
      u = users.get(id);
    if (!u) return send(404, { message: "User not found." });
    if (method === "PATCH") {
      const profile = input.profile
        ? { ...u.profile, ...input.profile }
        : u.profile;
      Object.assign(u, input, { profile, updatedAt: "2026-10-17T00:00:00Z" });
      return send(200, { user: u });
    }
    if (method === "DELETE") {
      u.deletedAt = "2026-10-17T00:00:00Z";
      return send(200, { message: "Archived" });
    }
    return send(200, { user: u });
  }
  if (route === "/api/admin/audit-logs")
    return send(200, {
      items: [
        {
          id: "log-1",
          actorId: "admin-1",
          targetId: "created-1",
          action: "USER_CREATED",
          changedFields: ["email"],
          createdAt: base.createdAt,
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });
  if (route === "/api/ai/status")
    return send(200, { enabled: true, configured: true, model: "test" });
  if (route === "/api/ai/topics/quota") return send(200, quota());
  if (route === "/api/ai/topics" && method === "POST") {
    topicsUsed += input.count;
    return send(201, {
      topics: [
        {
          id: "new-topic",
          title: "Chủ đề AI mới",
          englishTitle: "New",
          description: "Test",
          level: "BEGINNER",
          schoolStages: ["MIDDLE_SCHOOL"],
          tags: [],
        },
      ],
      quota: quota(),
      model: "test",
      vocabularyGenerated: false,
    });
  }
  if (route === "/api/topics/recommended")
    return send(200, {
      items: [],
      source: "PROFILE_RULES",
      needsProfile: false,
    });
  if (route === "/api/topics")
    return send(200, { items: [], total: 0, page: 1, limit: 12 });
  return send(404, { message: "Mock missing " + route });
});
(async () => {
  let browser;
  const next = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3000",
    ],
    { cwd: path.resolve(__dirname, ".."), stdio: "ignore" },
  );
  try {
    await new Promise((r) => server.listen(3001, "0.0.0.0", r));
    let ready = false;
    for (let i = 0; i < 80; i++) {
      try {
        if ((await fetch("http://127.0.0.1:3000/login")).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    assert(ready);
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--no-zygote",
        "--single-process",
        "--host-resolver-rules=MAP localhost 127.0.0.1",
      ],
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      }),
      page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.setDefaultTimeout(15000);
    const go = (p) => page.goto("http://localhost:3000" + p),
      visible = (t) =>
        page
          .getByText(t, { exact: false })
          .first()
          .waitFor({ state: "visible" });
    await go("/forgot-password");
    await page.getByLabel(/^Email/).fill("student@example.com");
    await page
      .getByRole("button", { name: "Gửi mã đặt lại mật khẩu", exact: true })
      .click();
    await page.getByLabel("Mã xác minh 6 chữ số").fill("000000");
    await page
      .getByRole("button", { name: "Xác minh mã", exact: true })
      .click();
    await visible("Invalid reset code.");
    await page.getByLabel("Mã xác minh 6 chữ số").fill("123456");
    await page
      .getByRole("button", { name: "Xác minh mã", exact: true })
      .click();
    await page.getByLabel(/^Mật khẩu mới/).fill("Password123");
    await page.getByLabel("Nhập lại mật khẩu mới").fill("Password123");
    assert(!(await page.content()).includes("private-reset-grant"));
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    await page
      .getByRole("button", { name: "Đổi mật khẩu", exact: true })
      .click();
    await visible("Đã đổi mật khẩu.");
    assert(resetUsed);
    console.log(
      "PASS password reset: invalid OTP, memory-only grant, completion",
    );
    await context.addCookies([
      { name: "vocab_session", value: "user", url: "http://localhost:3001" },
    ]);
    await go("/admin");
    await visible("không có quyền quản trị");
    await go("/admin/login");
    await page.getByLabel(/^Email admin/).fill("student@example.com");
    await page.getByLabel(/^Mật khẩu/).fill("Password123");
    await page
      .getByRole("button", { name: "Vào trang quản trị", exact: true })
      .click();
    await visible("Admin access required.");
    assert((await context.cookies()).some((c) => c.value === "user"));
    console.log(
      "PASS USER access denied; failed admin login preserves user session",
    );
    await go("/user/vocabulary");
    await visible("Khám phá chủ đề mới");
    assert.equal(
      calls.filter((c) => c.route === "/api/ai/topics" && c.method === "POST")
        .length,
      0,
    );
    await page.getByLabel("Số chủ đề AI").fill("4");
    assert(
      await page
        .getByRole("button", { name: "AI gợi ý chủ đề mới", exact: true })
        .isDisabled(),
    );
    await page.getByLabel("Số chủ đề AI").fill("3");
    await page
      .getByRole("button", { name: "AI gợi ý chủ đề mới", exact: true })
      .click();
    await visible("Chủ đề AI mới");
    await visible("còn 0/3");
    assert(
      await page
        .getByRole("button", { name: "AI gợi ý chủ đề mới", exact: true })
        .isDisabled(),
    );
    console.log("PASS AI topics: explicit action, max 3, quota refresh");
    await context.clearCookies();
    await go("/admin/login");
    await page.getByLabel(/^Email admin/).fill("admin@example.com");
    await page.getByLabel(/^Mật khẩu/).fill("Password123");
    await page
      .getByRole("button", { name: "Vào trang quản trị", exact: true })
      .click();
    await visible("Tổng quan quản trị");
    await visible("Chưa có dữ liệu");
    assert(page.url().endsWith("/admin"));
    await go("/admin/users/new");
    await page.getByLabel(/^Email/).fill("new@example.com");
    await page.getByLabel("Mật khẩu ban đầu").fill("Password123");
    await page.getByLabel("Xác nhận email đã được kiểm chứng").check();
    await page
      .getByRole("button", { name: "Tạo tài khoản", exact: true })
      .click();
    await visible("Chi tiết tài khoản");
    await page.getByLabel("Tên hiển thị").fill("New Student");
    await page
      .getByRole("button", { name: "Lưu thay đổi", exact: true })
      .click();
    await visible("Đã lưu thay đổi.");
    const edit = calls.find((c) => c.method === "PATCH");
    assert.deepEqual(edit.input, { profile: { displayName: "New Student" } });
    await page
      .getByRole("button", { name: "Lưu trữ tài khoản", exact: true })
      .click();
    assert(!users.get("created-1").deletedAt);
    await page
      .getByRole("button", { name: "Xác nhận lưu trữ", exact: true })
      .click();
    await visible("hiện không có chức năng khôi phục");
    await go("/admin/users/admin-1");
    await page.getByLabel(/^Email/).waitFor();
    assert(await page.getByLabel(/^Email/).isDisabled());
    assert(
      await page
        .getByRole("button", { name: "Lưu trữ tài khoản", exact: true })
        .isDisabled(),
    );
    await go("/admin/audit-logs");
    await visible("USER_CREATED");
    console.log(
      "PASS ADMIN incomplete profile allowed; dashboard, create, partial edit, confirmed archive, self protection, audit",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await go("/admin/users");
    await visible("Quản lý người dùng");
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    assert(
      await page
        .locator(".MuiTableContainer-root")
        .evaluate((el) => el.scrollWidth > el.clientWidth),
    );
    assert.deepEqual(errors, []);
    console.log("PASS mobile table scroll and no page errors");
    console.log("PASS admin/reset integration smoke");
  } finally {
    if (browser) await browser.close();
    server.close();
    next.kill("SIGTERM");
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
