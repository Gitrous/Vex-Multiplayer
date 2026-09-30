#!/usr/bin/env node
// Headless end-to-end check: boots the game in Chromium, waits for the main menu,
// enters the hub, walks and jumps, and fails on any uncaught page error.
//
//   node tools/smoke-test.mjs              test dist/vex7.js (run `npm run build` first)
//   node tools/smoke-test.mjs --original   test reference/vex7.min.js, for comparison
//
// Screenshots land in test-results/. Set CHROMIUM_PATH to use a specific browser binary.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const original = process.argv.includes("--original");
const outDir = path.join(root, "test-results");
fs.mkdirSync(outDir, { recursive: true });
const tag = original ? "original" : "build";

if (!original && !fs.existsSync(path.join(root, "dist", "vex7.js"))) {
  console.error("dist/vex7.js not found: run `npm run build` first");
  process.exit(1);
}

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".ogg": "audio/ogg",
  ".map": "application/json",
};
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--autoplay-policy=no-user-gesture-required", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.stack || e.message));
// Keep the test offline: the only remote requests are ads/analytics.
const external = new Set();
await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => {
  external.add(new URL(route.request().url()).host);
  return route.abort();
});

// Capture the Phaser.Game instance without touching game code: every copy of Phaser
// is published through `window.Phaser = ...`, so hook Game#boot as it is assigned.
await page.addInitScript(() => {
  let phaser;
  Object.defineProperty(window, "Phaser", {
    configurable: true,
    get: () => phaser,
    set(v) {
      phaser = v;
      const proto = v && v.Game && v.Game.prototype;
      if (proto && !proto.__vexHooked) {
        const boot = proto.boot;
        proto.boot = function () {
          window.__vexGame = this;
          return boot.apply(this, arguments);
        };
        proto.__vexHooked = true;
      }
    },
  });
});

const step = async (name, fn) => {
  process.stdout.write(`- ${name} ... `);
  await fn();
  console.log("ok");
};
const GameStates = { Loading: 0, Playing: 1, MainMenu: 2 };
const HUB = 1; // SubSceneList.Hub

let failed = false;
try {
  await step("load page", () => page.goto(`${base}/index.html${original ? "?build=original" : ""}`));
  await step("reach main menu", () =>
    page.waitForFunction(
      (s) => {
        const w = window.__vexGame && window.__vexGame.scene.getScene("world");
        return w && w.sys.isActive() && w.state === s;
      },
      GameStates.MainMenu,
      { timeout: 60000 },
    ),
  );
  await page.screenshot({ path: path.join(outDir, `${tag}-1-menu.png`) });

  await step("enter hub", async () => {
    await page.evaluate((hub) => window.__vexGame.scene.getScene("world").showSubSceneTransition(hub), HUB);
    await page.waitForFunction((s) => window.__vexGame.scene.getScene("world").state === s, GameStates.Playing, {
      timeout: 60000,
    });
  });
  await step("player spawns", () =>
    // The hub starts in Playing state; the player appears after the transition and spawn effect.
    page.waitForFunction(
      () => {
        const w = window.__vexGame.scene.getScene("world");
        return !w.transition.visible && w.player.alive === true;
      },
      null,
      { timeout: 60000 },
    ),
  );
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${tag}-2-hub.png`) });

  const pos = () =>
    page.evaluate(() => {
      const p = window.__vexGame.scene.getScene("world").player;
      return { x: p.xPos, y: p.yPos, alive: p.alive };
    });
  const start = await pos();
  await step("walk right", async () => {
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(1500);
    await page.keyboard.up("ArrowRight");
    const now = await pos();
    if (!(now.x > start.x)) throw new Error(`player did not move right: ${JSON.stringify({ start, now })}`);
  });
  await step("jump", async () => {
    const before = await pos();
    await page.keyboard.down("ArrowUp");
    let minY = before.y;
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(60);
      minY = Math.min(minY, (await pos()).y);
    }
    await page.keyboard.up("ArrowUp");
    if (!(minY < before.y)) throw new Error(`player did not jump: y ${before.y} -> min ${minY}`);
  });
  await page.screenshot({ path: path.join(outDir, `${tag}-3-moved.png`) });
  await step("no uncaught page errors", async () => {
    if (errors.length) throw new Error(errors.join("\n"));
  });
} catch (e) {
  failed = true;
  console.log("FAILED");
  console.error(e.message);
  if (errors.length) console.error("page errors:\n" + errors.join("\n"));
  await page.screenshot({ path: path.join(outDir, `${tag}-failure.png`) }).catch(() => {});
} finally {
  await browser.close();
  server.close();
}
console.log(`external requests (blocked): ${external.size ? [...external].join(", ") : "none"}`);
console.log(failed ? `smoke test FAILED (${tag})` : `smoke test passed (${tag}); screenshots in test-results/`);
process.exit(failed ? 1 : 0);
