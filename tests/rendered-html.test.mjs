import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          if (url.pathname === "/nordic-guide.html") {
            const html = await readFile(
              new URL("../public/nordic-guide.html", import.meta.url),
              "utf8",
            );
            return new Response(html, {
              headers: { "content-type": "text/html; charset=utf-8" },
            });
          }

          return new Response("Not found", { status: 404 });
        },
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("serves the Nordic trip guide at the root URL", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /北境环线｜挪威 × 瑞典 × 冰岛旅行攻略/);
  assert.match(html, /2026年9月26日至10月6日/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("keeps the app fallback pointed at the same guide", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const packageJson = await readFile(
    new URL("../package.json", import.meta.url),
    "utf8",
  );

  assert.match(page, /src="\/nordic-guide\.html"/);
  assert.match(layout, /lang="zh-CN"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
