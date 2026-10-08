#!/usr/bin/env node
// Headless end-to-end check: boots the game in Chromium (served by the multiplayer
// server), waits for the main menu, enters the hub, walks and jumps, and fails on any
// uncaught page error.
//
//   node tools/smoke-test.mjs              test dist/vex7.js (run `npm run build` first)
//   node tools/smoke-test.mjs --original   test reference/vex7.min.js, for comparison
//
// Screenshots land in test-results/. Set CHROMIUM_PATH to use a specific browser binary.
import path from "node:path";
import { startServer } from "../server/server.mjs";
import {
  outDir,
  requireBuild,
  launchBrowser,
  preparePage,
  step,
  waitForMainMenu,
  enterHub,
  playerPos,
} from "./lib/harness.mjs";

const original = process.argv.includes("--original");
const tag = original ? "original" : "build";
if (!original) requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const base = `http://127.0.0.1:${await server.ready}`;
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const report = await preparePage(page);

let failed = false;
try {
  await step("load page", () => page.goto(`${base}/index.html${original ? "?build=original" : "?room=smoke"}`));
  await step("reach main menu", () => waitForMainMenu(page));
  await page.screenshot({ path: path.join(outDir, `${tag}-1-menu.png`) });
  await step("enter hub", () => enterHub(page));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${tag}-2-hub.png`) });

  const start = await playerPos(page);
  await step("walk right", async () => {
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(1500);
    await page.keyboard.up("ArrowRight");
    const now = await playerPos(page);
    if (!(now.x > start.x)) throw new Error(`player did not move right: ${JSON.stringify({ start, now })}`);
  });
  await step("jump", async () => {
    const before = await playerPos(page);
    await page.keyboard.down("ArrowUp");
    let minY = before.y;
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(60);
      minY = Math.min(minY, (await playerPos(page)).y);
    }
    await page.keyboard.up("ArrowUp");
    if (!(minY < before.y)) throw new Error(`player did not jump: y ${before.y} -> min ${minY}`);
  });
  await page.screenshot({ path: path.join(outDir, `${tag}-3-moved.png`) });
  if (!original) {
    await step("R restarts the act", async () => {
      await page.evaluate(() => window.__vexGame.scene.getScene("world").showSubSceneTransition(2, 1)); // act 1
      // Acts open with the "level objectives" panel; any key but the movement ones (and R) starts it.
      await page.waitForFunction(
        () => {
          const w = window.__vexGame.scene.getScene("world");
          return w.panelManager.currentPanel === 7 && !w.transition.visible;
        },
        null,
        { timeout: 90000 },
      );
      await page.evaluate(() => {
        const w = window.__vexGame.scene.getScene("world");
        w.panelManager.stock[7].play();
      });
      await page.waitForFunction(
        () => {
          const w = window.__vexGame.scene.getScene("world");
          return w.state === 1 && w.player.alive && w.player.falling === false;
        },
        null,
        { timeout: 90000 },
      );
      const spawnX = await page.evaluate(() => window.__vexGame.scene.getScene("world").spawnX);
      await page.keyboard.down("ArrowRight");
      await page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 60, spawnX, {
        timeout: 90000,
      });
      await page.keyboard.up("ArrowRight");
      await page.evaluate(() => (window.__vexGame.scene.getScene("world").currentDeaths = 3));
      await page.keyboard.press("r");
      await page.waitForFunction(
        (x) => {
          const w = window.__vexGame.scene.getScene("world");
          return Math.abs(w.player.xPos - x) < 2 && w.currentDeaths === 0;
        },
        spawnX,
        { timeout: 90000 },
      );
    });
  }
  await step("no uncaught page errors", async () => {
    if (report.errors.length) throw new Error(report.errors.join("\n"));
  });
} catch (e) {
  failed = true;
  console.log("FAILED");
  console.error(e.message);
  if (report.errors.length) console.error("page errors:\n" + report.errors.join("\n"));
  await page.screenshot({ path: path.join(outDir, `${tag}-failure.png`) }).catch(() => {});
} finally {
  await browser.close();
  await server.close();
}
console.log(`external requests (blocked): ${report.external.size ? [...report.external].join(", ") : "none"}`);
console.log(failed ? `smoke test FAILED (${tag})` : `smoke test passed (${tag}); screenshots in test-results/`);
process.exit(failed ? 1 : 0);
