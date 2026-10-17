/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node.js smoke test. */
/* Optional integration smoke test: npm install --prefix <temporary-folder> playwright @sparticuz/chromium
 * The test uses an isolated HTTP mock on 3001 and a production FE on 3000.
 * It never calls Cloudflare, Redis, SMTP or the real application database.
 * Set PLAYWRIGHT_MODULE_PATH and CHROMIUM_EXECUTABLE_PATH; build the FE first.
 */
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const project = path.resolve(__dirname, "..");
const calls = [];
const topics = Array.from({ length: 13 }, (_, i) => ({
  id: `topic-${i + 1}`,
  title: i ? `Chủ đề số ${i + 1}` : "Trường học",
  englishTitle: "School",
  description: "Từ vựng dành cho học sinh",
  level: "BEGINNER",
  schoolStages: ["MIDDLE_SCHOOL"],
  tags: ["school"],
  _count: { vocabulary: 6 },
}));
let words = ["book", "classroom", "teacher", "student", "pencil", "school"].map(
  (word, i) => ({
    id: `word-${i + 1}`,
    topicId: "topic-1",
    word,
    meaning: [
      "sách",
      "lớp học",
      "giáo viên",
      "học sinh",
      "bút chì",
      "trường học",
    ][i],
    phonetic: "/test/",
    partOfSpeech: "noun",
    exampleSentence: `This is a ${word}.`,
    exampleTranslation: "Một ví dụ học tập.",
    audioUrl: i ? null : "http://localhost:3001/api/audio/test",
    audioProvider: i ? null : "DICTIONARY",
    audioSourceUrl: "https://commons.wikimedia.org/",
    audioLicense: "BY-SA 4.0",
    audioLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    progress: null,
  }),
);
const sessions = new Map();
let sequence = 0;
let settings = {
  reminderEnabled: false,
  reminderHour: 19,
  reminderMinute: 0,
  reviewBatchSize: 2,
};
let studiedToday = false,
  failAnswer = false,
  failGenerate = false,
  emptyDue = false,
  generateCount = 0,
  completeCount = 0;
const user = {
  role: "USER",
  id: "user-1",
  email: "student@example.com",
  emailVerifiedAt: "2026-10-15T00:00:00Z",
};
const profile = {
  id: "profile-1",
  userId: user.id,
  displayName: "Daniel Student",
  dateOfBirth: "2011-05-20T00:00:00Z",
  schoolStage: "MIDDLE_SCHOOL",
  englishLevel: "BEGINNER",
  interests: ["school"],
  learningGoal: "",
};
const streak = () => ({
  currentStreak: studiedToday ? 2 : 1,
  longestStreak: 3,
  studiedToday,
  lastStudyDate: "2026-10-15",
  totalStudyDays: 5,
  timeZone: "Asia/Ho_Chi_Minh",
});
function createSession(type, size = 2, review = false) {
  const s = {
    id: `session-${++sequence}`,
    topicId: review ? null : topics[0].id,
    topic: review ? null : topics[0],
    type,
    status: "IN_PROGRESS",
    isReview: review,
    totalItems: Math.min(size, words.length),
    answeredItems: 0,
    score: null,
    correctCount: null,
    updatedAt: "2026-10-15T08:00:00Z",
    completedAt: null,
    items: words.slice(0, size).map((w, i) => ({
      id: `item-${sequence}-${i}`,
      vocabularyId: w.id,
      position: i,
      word: w.word,
      answeredAt: null,
      ...(type === "FLASHCARD"
        ? { ...w, id: `item-${sequence}-${i}`, rating: null }
        : {
            options: [w.meaning, "nghĩa sai A", "nghĩa sai B", "nghĩa sai C"],
            selectedIndex: null,
          }),
    })),
  };
  sessions.set(s.id, s);
  return s;
}
const resume = createSession("FLASHCARD");
resume.items[0].answeredAt = "2026-10-15T08:00:00Z";
resume.items[0].rating = "KNOWN";
resume.answeredItems = 1;
const summary = (s) =>
  Object.fromEntries(Object.entries(s).filter(([key]) => key !== "items"));
const paginate = (rows, u) => {
  const page = Number(u.searchParams.get("page") || 1),
    limit = Number(u.searchParams.get("limit") || 10);
  return {
    items: rows.slice((page - 1) * limit, page * limit),
    total: rows.length,
    page,
    limit,
  };
};
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  res.setHeader("Content-Type", "application/json");
  let body = "";
  for await (const chunk of req) body += chunk;
  const input = body ? JSON.parse(body) : {};
  const url = new URL(req.url, "http://localhost:3001");
  const route = url.pathname;
  calls.push({ route, method: req.method, input, search: url.search });
  const send = (status, data) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };
  if (route === "/api/auth/login") {
    res.setHeader(
      "Set-Cookie",
      "vocab_session=valid; HttpOnly; Path=/; SameSite=Lax",
    );
    return send(200, { user });
  }
  if (route === "/api/auth/logout") {
    res.setHeader(
      "Set-Cookie",
      "vocab_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
    );
    return send(200, {});
  }
  if (route === "/api/audio/test") {
    const wav = Buffer.alloc(44 + 1600);
    wav.write("RIFF");
    wav.writeUInt32LE(wav.length - 8, 4);
    wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(8000, 24);
    wav.writeUInt32LE(16000, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write("data", 36);
    wav.writeUInt32LE(1600, 40);
    res.writeHead(200, { "Content-Type": "audio/wav" });
    res.end(wav);
    return;
  }
  if (!req.headers.cookie?.includes("vocab_session=valid"))
    return send(401, { message: "Please log in." });
  if (route === "/api/auth/me") return send(200, { user });
  if (route === "/api/users/me/profile")
    return send(200, { profile, isProfileComplete: true });
  if (route === "/api/topics/recommended")
    return send(200, {
      source: "PROFILE_RULES",
      isAiGenerated: false,
      needsProfile: false,
      items: [topics[0]],
    });
  if (route === "/api/topics") {
    const q = url.searchParams.get("q");
    return send(
      200,
      paginate(q ? topics.filter((t) => t.title.includes(q)) : topics, url),
    );
  }
  if (route === "/api/topics/missing")
    return send(404, { message: "Topic not found." });
  if (/^\/api\/topics\/[^/]+$/.test(route))
    return send(200, {
      topic: { ...topics[0], _count: { vocabulary: words.length } },
    });
  if (/\/vocabulary$/.test(route) && route.startsWith("/api/topics/"))
    return send(200, paginate(words, url));
  if (route.endsWith("/quota") && route.startsWith("/api/ai/topics"))
    return send(200, {
      dateKey: "2026-10-16",
      timeZone: "Asia/Ho_Chi_Minh",
      limit: route.includes("vocabulary") ? 20 : 3,
      used: 0,
      reserved: 0,
      remaining: route.includes("vocabulary") ? 20 : 3,
    });
  if (route === "/api/ai/status")
    return send(200, {
      enabled: true,
      configured: true,
      credentialsVerified: false,
      model: "test-model",
    });
  if (/^\/api\/ai\/topics\//.test(route)) {
    generateCount++;
    if (failGenerate) return send(429, { message: "AI daily quota reached." });
    const batch = Array.from({ length: input.count }, (_, i) => ({
      ...words[0],
      id: `ai-${i}`,
      word: `generated${i + 1}`,
      generatedBy: "test-model",
    }));
    words.push(...batch);
    await new Promise((r) => setTimeout(r, 150));
    return send(201, {
      cached: false,
      model: "test-model",
      words: batch,
      audioMissing: 0,
    });
  }
  if (/\/audio\/resolve$/.test(route))
    return send(201, { resolved: 2, missing: 0, items: [] });
  if (route === "/api/dashboard") {
    const all = [...sessions.values()];
    return send(200, {
      statistics: {
        knownWords: 4,
        learningWords: 2,
        completedSessions: all.filter((s) => s.status === "COMPLETED").length,
        pendingSessions: all.filter((s) => s.status === "IN_PROGRESS").length,
      },
      recentIncomplete: all
        .filter((s) => s.status === "IN_PROGRESS")
        .map(summary),
      streak: streak(),
      dueReviews: emptyDue ? 0 : 2,
      isProfileComplete: true,
    });
  }
  if (route === "/api/study/flashcards" || route === "/api/study/quizzes")
    return send(201, {
      session: createSession(
        route.endsWith("quizzes") ? "QUIZ" : "FLASHCARD",
        input.size,
      ),
    });
  if (route === "/api/study/sessions") {
    let all = [...sessions.values()];
    for (const key of ["status", "type"])
      if (url.searchParams.has(key))
        all = all.filter((s) => s[key] === url.searchParams.get(key));
    return send(200, paginate(all.map(summary), url));
  }
  const itemMatch = route.match(
    /^\/api\/study\/(flashcards|quizzes)\/([^/]+)\/items\/([^/]+)$/,
  );
  if (itemMatch) {
    if (failAnswer) {
      failAnswer = false;
      return send(503, { message: "Could not save answer." });
    }
    const session = sessions.get(itemMatch[2]);
    const item = session?.items.find((i) => i.id === itemMatch[3]);
    if (!item) return send(404, {});
    if (session.status === "COMPLETED")
      return send(409, { message: "Already completed." });
    item.answeredAt = new Date().toISOString();
    Object.assign(item, input);
    session.answeredItems = session.items.filter((i) => i.answeredAt).length;
    return send(200, {
      itemId: item.id,
      answeredAt: item.answeredAt,
      ...input,
    });
  }
  const sessionMatch = route.match(
    /^\/api\/study\/sessions\/([^/]+)(\/complete)?$/,
  );
  if (sessionMatch) {
    const s = sessions.get(sessionMatch[1]);
    if (!s) return send(404, { message: "Study session not found." });
    if (sessionMatch[2]) {
      completeCount++;
      if (s.items.some((i) => !i.answeredAt))
        return send(400, { message: "Answer every item." });
      s.status = "COMPLETED";
      s.completedAt = new Date().toISOString();
      studiedToday = true;
      if (s.type === "QUIZ") {
        s.items.forEach((i, n) => {
          i.correctIndex = 0;
          i.isCorrect = i.selectedIndex === 0;
          i.meaning = words[n].meaning;
          i.exampleSentence = words[n].exampleSentence;
          i.exampleTranslation = words[n].exampleTranslation;
        });
        s.correctCount = s.items.filter((i) => i.isCorrect).length;
        s.score = Math.round((s.correctCount / s.totalItems) * 100);
      }
      if (s.isReview) emptyDue = true;
    }
    return send(200, { session: s });
  }
  if (route === "/api/learning/streak") return send(200, streak());
  if (route === "/api/learning/reviews/due")
    return send(
      200,
      paginate(
        emptyDue
          ? []
          : words.slice(0, 2).map((w, i) => ({
              id: `progress-${i}`,
              nextReviewAt: null,
              mastery: "LEARNING",
              successfulReviews: 0,
              vocabulary: { ...w, topic: topics[0] },
            })),
        url,
      ),
    );
  if (route === "/api/learning/review-sessions") {
    if (emptyDue) return send(400, { message: "No words are due for review." });
    return send(201, {
      session: createSession("FLASHCARD", settings.reviewBatchSize, true),
    });
  }
  if (route === "/api/learning/settings") {
    if (req.method === "PATCH") settings = { ...settings, ...input };
    return send(200, {
      settings,
      timeZone: "Asia/Ho_Chi_Minh",
      ...(req.method === "GET" ? { schedulerEnabled: true } : {}),
    });
  }
  if (route === "/api/learning/reminders")
    return send(200, {
      deliveries: [
        {
          id: "delivery-1",
          dateKey: "2026-10-15",
          status: "SENT",
          attempts: 1,
          sentAt: "2026-10-15T08:00:00Z",
          lastError: null,
        },
      ],
    });
  if (route === "/api/learning/reminders/test")
    return send(200, { message: "Test sent." });
  send(404, { message: `Unknown route: ${route}` });
});
(async () => {
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
    { cwd: project, stdio: "ignore" },
  );
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(3001, "0.0.0.0", resolve);
    });
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch("http://127.0.0.1:3000/login")).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    assert(ready, "FE production server is not ready");
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
        : {}),
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
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const runtimeErrors = [];
    page.on("pageerror", (e) => runtimeErrors.push(e.message));
    const visible = (text) =>
      page
        .getByText(text, { exact: false })
        .first()
        .waitFor({ state: "visible" });
    const go = (p) => page.goto("http://localhost:3000" + p);
    const noOverflow = async () =>
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    const checks = [];
    await go("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel(/^Mật khẩu/).fill("Password123");
    await page
      .getByRole("button", { name: "Vào học ngay", exact: true })
      .click();
    await page.waitForURL("**/user/dashboard");
    await visible("Trường học");
    checks.push("login and real dashboard contract");
    await page.getByRole("link", { name: "Tiếp tục", exact: true }).click();
    await page.waitForURL("**/user/study/session-1");
    await visible("Mục 2/2");
    assert(
      await page
        .getByRole("button", { name: "Hoàn thành phiên học", exact: true })
        .isDisabled(),
    );
    await page.getByRole("button", { name: "Lật thẻ xem nghĩa" }).click();
    failAnswer = true;
    await page.getByRole("button", { name: "Cần ôn lại", exact: true }).click();
    await visible("Could not save answer.");
    assert.equal(sessions.get("session-1").answeredItems, 1);
    await page.getByRole("button", { name: "Cần ôn lại", exact: true }).click();
    await visible("Đã lưu 2/2");
    await page.reload();
    await visible("Đã lưu 2/2");
    checks.push("resume first unanswered, failed save and reload persistence");
    await page
      .getByRole("button", { name: "Hoàn thành phiên học", exact: true })
      .click();
    await page.getByRole("button", { name: "Xác nhận hoàn thành" }).click();
    await visible("Bạn đã hoàn thành phiên flashcard!");
    assert.equal(completeCount, 1);
    await page.reload();
    await visible("Bạn đã hoàn thành phiên flashcard!");
    assert.equal(completeCount, 1);
    checks.push("explicit complete and read-only completed session");
    await go("/user/vocabulary");
    await page
      .getByRole("button", { name: "Go to page 2", exact: true })
      .click();
    await visible("Chủ đề số 13");
    assert(
      calls.some(
        (c) => c.route === "/api/topics" && c.search.includes("page=2"),
      ),
    );
    checks.push("topic pagination");
    await page.getByLabel("Tìm chủ đề").fill("không tồn tại");
    await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
    await visible("Không tìm thấy chủ đề.");
    checks.push("topic search empty state");
    await go("/user/topics/topic-1");
    await visible("Danh sách từ vựng");
    await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/audio/test")),
      page.getByRole("button", { name: "Nghe từ book", exact: true }).click(),
    ]);
    assert(
      await page
        .getByRole("link", { name: "BY-SA 4.0", exact: true })
        .first()
        .isVisible(),
    );
    checks.push("audio request and source/license attribution");
    await page.getByLabel("Số từ mỗi phiên").fill("2");
    await page
      .getByRole("button", { name: "Làm trắc nghiệm", exact: true })
      .click();
    await page.waitForURL("**/user/study/session-2");
    await visible("Chọn nghĩa đúng");
    assert.equal(
      await page.getByText("Đáp án đúng:", { exact: false }).count(),
      0,
    );
    await page.getByRole("radio").nth(1).check();
    await page
      .getByRole("button", { name: "Lưu câu trả lời", exact: true })
      .click();
    await visible("Mục 2/2");
    await page.reload();
    await visible("Mục 2/2");
    await page.getByRole("radio").nth(0).check();
    await page
      .getByRole("button", { name: "Lưu câu trả lời", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Hoàn thành phiên học", exact: true })
      .click();
    await page.getByRole("button", { name: "Xác nhận hoàn thành" }).click();
    await visible("Điểm: 50/100");
    await visible("Đáp án đúng:");
    checks.push("quiz persistence, hidden solutions and server score");
    await go("/user/topics/topic-1");
    await page
      .getByRole("button", { name: "Tạo thêm từ bằng AI", exact: true })
      .waitFor({ state: "visible" });
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (button) =>
          button.textContent === "Tạo thêm từ bằng AI" && !button.disabled,
      ),
    );
    await page.getByLabel("Số từ AI").fill("21");
    assert(await page.getByRole("button", {name:"Tạo thêm từ bằng AI",exact:true}).isDisabled());
    await page.getByLabel("Số từ AI").fill("4");
    await page
      .getByRole("button", { name: "Tạo thêm từ bằng AI", exact: true })
      .evaluate((button) => {
        button.click();
        button.click();
      });
    await visible("Đã tạo và lưu 4 từ mới.");
    assert.equal(generateCount, 1);
    await page.reload();
    await visible("Danh sách từ vựng");
    assert.equal(generateCount, 1);
    checks.push(
      "AI double-click protection, list refresh and no generation on reload",
    );
    failGenerate = true;
    await page
      .getByRole("button", { name: "Tạo thêm từ bằng AI", exact: true })
      .click();
    await visible("AI daily quota reached.");
    assert.equal(words.length, 10);
    checks.push("AI quota error preserves vocabulary");
    await page
      .getByRole("button", { name: "Bổ sung audio còn thiếu", exact: true })
      .click();
    await visible("Đã tìm được audio cho 2 từ");
    checks.push("resolve missing audio");
    await go("/user/sessions");
    await visible("Xem kết quả");
    await page.getByLabel("Trạng thái").click();
    await page
      .getByRole("option", { name: "Đã hoàn thành", exact: true })
      .click();
    await visible("Xem kết quả");
    assert(
      calls.some(
        (c) =>
          c.route === "/api/study/sessions" &&
          c.search.includes("status=COMPLETED"),
      ),
    );
    checks.push("history filters");
    await go("/user/reviews");
    await visible("Từ đến hạn ôn (2)");
    await page
      .getByRole("button", { name: "Bắt đầu ôn tập", exact: true })
      .click();
    await page.waitForURL("**/user/study/session-3");
    await visible("Ôn tập nhiều chủ đề");
    for (let i = 0; i < 2; i++) {
      await page
        .getByRole("button", { name: "Lật thẻ xem nghĩa", exact: true })
        .click();
      await page.getByRole("button", { name: "Đã nhớ", exact: true }).click();
    }
    await page
      .getByRole("button", { name: "Hoàn thành phiên học", exact: true })
      .click();
    await page.getByRole("button", { name: "Xác nhận hoàn thành" }).click();
    await visible("Bạn đã hoàn thành phiên flashcard!");
    await go("/user/reviews");
    await visible("Chưa có từ đến hạn ôn.");
    assert(
      await page
        .getByRole("button", { name: "Bắt đầu ôn tập", exact: true })
        .isDisabled(),
    );
    checks.push("mixed-topic review and empty due state");
    await go("/user/learning-settings");
    await page.getByRole("switch").check();
    await page.getByLabel("Giờ nhắc học").fill("20:15");
    await page.getByLabel("Số từ mỗi phiên ôn").fill("3");
    await page
      .getByRole("button", { name: "Lưu cài đặt", exact: true })
      .click();
    await visible("Đã lưu cài đặt học tập.");
    assert.deepEqual(settings, {
      reminderEnabled: true,
      reminderHour: 20,
      reminderMinute: 15,
      reviewBatchSize: 3,
    });
    await page
      .getByRole("button", { name: "Gửi email nhắc học thử", exact: true })
      .click();
    await visible("Đã gửi email thử");
    await page.reload();
    await page.getByLabel("Giờ nhắc học").waitFor();
    assert.equal(await page.getByLabel("Giờ nhắc học").inputValue(), "20:15");
    checks.push("settings persistence, email test and delivery history");
    await go("/user/topics/missing");
    await visible("Topic not found.");
    checks.push("404 error state");
    await page.setViewportSize({ width: 390, height: 844 });
    await go("/user/topics/topic-1");
    await visible("Danh sách từ vựng");
    await noOverflow();
    await page.getByRole("button", { name: "Mở menu", exact: true }).click();
    await page
      .getByRole("button", { name: "Ôn tập & Streak", exact: true })
      .click();
    await page.waitForURL("**/user/reviews");
    await visible("Chưa có từ đến hạn ôn.");
    await noOverflow();
    checks.push("mobile layout and menu navigation");
    if (process.env.SMOKE_SCREENSHOT_DIR) {
      const fs = require("node:fs");
      fs.mkdirSync(process.env.SMOKE_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(process.env.SMOKE_SCREENSHOT_DIR, "reviews-mobile.png"),
        fullPage: true,
      });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await go("/user/dashboard");
      await visible("Chủ đề phù hợp với bạn");
      await page.screenshot({
        path: path.join(process.env.SMOKE_SCREENSHOT_DIR, "dashboard.png"),
        fullPage: true,
      });
    }
    assert.equal(runtimeErrors.length, 0, runtimeErrors.join("\n"));
    assert(calls.every((c) => !c.route.startsWith("/api/admin")));
    checks.push("no runtime errors or admin calls");
    console.log(
      JSON.stringify({ passed: true, checks, requests: calls.length }, null, 2),
    );
  } finally {
    await browser?.close();
    server.close();
    next.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
