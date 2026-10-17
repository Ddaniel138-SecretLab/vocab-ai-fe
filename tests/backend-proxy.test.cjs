/* eslint-disable @typescript-eslint/no-require-imports */
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const filename = path.resolve(__dirname, "../src/lib/server/backend-proxy.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
});
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled.outputText, filename);
const { backendProxy, rewriteSessionCookie } = loaded.exports;
const calls = [];
let upstream, frontend, origin;
const originalBackend = process.env.BACKEND_API_URL;
const originalVercel = process.env.VERCEL;
before(async () => {
  delete process.env.VERCEL;
  upstream = http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      calls.push({
        url: req.url,
        headers: req.headers,
        body,
        method: req.method,
      });
      res.setHeader("content-type", "application/json");
      if (req.url === "/api/auth/login") {
        res.setHeader("Set-Cookie", [
          "vocab_session=valid; Domain=render.example.com; Path=/api; HttpOnly; SameSite=None; Secure",
          "another_service_secret=hidden; Path=/",
        ]);
      }
      if (req.url === "/api/auth/logout")
        res.setHeader(
          "Set-Cookie",
          "vocab_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None",
        );
      if (
        req.url === "/api/auth/me" &&
        req.headers.cookie !== "vocab_session=valid"
      ) {
        res.statusCode = 401;
      }
      if (req.url.startsWith("/api/audio/")) {
        res.setHeader("content-type", "audio/mpeg");
        res.end(Buffer.from([1, 2, 3]));
        return;
      }
      if (req.url === "/api/health") {
        res.statusCode = 503;
      }
      res.end(
        JSON.stringify({
          ok: res.statusCode !== 401,
          cookie: req.headers.cookie ?? null,
        }),
      );
    });
  });
  await new Promise((resolve) => upstream.listen(0, "127.0.0.1", resolve));
  process.env.BACKEND_API_URL =
    "http://127.0.0.1:" + upstream.address().port + "/api";
  frontend = http.createServer((req, res) => {
    req.query = {
      path: new URL(req.url, "http://local").pathname
        .split("/")
        .filter(Boolean)
        .slice(2),
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (value) => {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(value));
    };
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      req.body = body ? JSON.parse(body) : "";
      void backendProxy(req, res);
    });
  });
  await new Promise((resolve) => frontend.listen(0, "127.0.0.1", resolve));
  origin = "http://127.0.0.1:" + frontend.address().port;
});
after(async () => {
  if (originalBackend === undefined) delete process.env.BACKEND_API_URL;
  else process.env.BACKEND_API_URL = originalBackend;
  if (originalVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = originalVercel;
  await Promise.all([
    new Promise((resolve) => frontend.close(resolve)),
    new Promise((resolve) => upstream.close(resolve)),
  ]);
});
test("login rewrites cookie to the frontend host and strips foreign cookies", async () => {
  const response = await fetch(origin + "/api/backend/auth/login", {
    method: "POST",
    headers: { Origin: origin, "content-type": "application/json" },
    body: JSON.stringify({ email: "test@example.com", password: "test" }),
  });
  assert.equal(response.status, 200);
  const cookies = response.headers.getSetCookie();
  assert.equal(cookies.length, 1);
  assert.match(cookies[0], /Path=\/; HttpOnly; SameSite=Lax/);
  assert.doesNotMatch(cookies[0], /Domain=|SameSite=None|another_service/);
  assert.equal(calls.at(-1).headers.origin, origin);
});
test("forwards only the session cookie and preserves query strings and errors", async () => {
  let response = await fetch(origin + "/api/backend/auth/me", {
    headers: { Cookie: "vercel_secret=never-forward; vocab_session=valid" },
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).cookie, "vocab_session=valid");
  response = await fetch(origin + "/api/backend/auth/me");
  assert.equal(response.status, 401);
  await fetch(origin + "/api/backend/topics?q=hello%20world&page=2");
  assert.equal(calls.at(-1).url, "/api/topics?q=hello%20world&page=2");
  response = await fetch(origin + "/api/backend/health");
  assert.equal(response.status, 503);
  assert.match(response.headers.get("cache-control"), /no-store/);
});
test("logout preserves deletion attributes and requires no JSON body", async () => {
  const response = await fetch(origin + "/api/backend/auth/logout", {
    method: "POST",
    headers: { Origin: origin },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/);
  assert.match(
    response.headers.get("set-cookie"),
    /Path=\/; HttpOnly; SameSite=Lax/,
  );
});
test("blocks foreign browser origins and arbitrary proxy destinations", async () => {
  const before = calls.length;
  const response = await fetch(origin + "/api/backend/auth/login", {
    method: "POST",
    headers: { Origin: "https://evil.example.com" },
  });
  assert.equal(response.status, 403);
  assert.equal(calls.length, before);
  assert.equal((await fetch(origin + "/api/backend/http/evil")).status, 400);
});
test("streams binary audio without turning it into JSON", async () => {
  const response = await fetch(origin + "/api/backend/audio/test");
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
  assert.deepEqual(
    [...new Uint8Array(await response.arrayBuffer())],
    [1, 2, 3],
  );
});
test("production cookie remains Secure, HttpOnly and deletable", () => {
  assert.equal(rewriteSessionCookie("unrelated=secret", true), null);
  const cookie = rewriteSessionCookie(
    "vocab_session=; Max-Age=0; Domain=backend.example.com; SameSite=None; Secure",
    true,
  );
  assert.match(cookie, /Max-Age=0/);
  assert.match(cookie, /HttpOnly; SameSite=Lax; Secure$/);
  assert.doesNotMatch(cookie, /Domain=/);
});
