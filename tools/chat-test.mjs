#!/usr/bin/env node
// Headless check of the room chat with two players in the hub:
//   - P1 presses Enter, types "dad hola" and presses Enter: the text goes to the chat, not the
//     game (P1 doesn't move, the keyboard comes back afterwards)
//   - P2's chat log shows the line and a bubble appears over P1's character
//   - a third player joining later gets the history
//
//   node tools/chat-test.mjs      (run `npm run build` first)
import path from "node:path";
import { startServer } from "../server/server.mjs";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, GameStates } from "./lib/harness.mjs";

const LONG = { timeout: 180000, polling: 100 };
requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const base = `http://127.0.0.1:${await server.ready}`;
const room = "chat-" + Math.random().toString(36).slice(2, 7);
const browser = await launchBrowser();
const report = { errors: [], external: new Set() };

async function openPlayer(name) {
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();
  await preparePage(page, report);
  await page.goto(`${base}/index.html?room=${room}&name=${name}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  return { name, context, page };
}
const ev = (p, fn, arg) => p.page.evaluate(fn, arg);
const xOf = (p) => ev(p, () => window.__vexGame.scene.getScene("world").player.xPos);
const logText = (p) => ev(p, () => document.querySelector("#vexchat .log").textContent);
const MESSAGE = "dad hola";

let failed = false;
const players = [];
try {
  await step("two players reach the hub", async () => {
    players.push(await openPlayer("P1"), await openPlayer("P2"));
    await Promise.all(players.map((p) => waitForMainMenu(p.page, 180000)));
    for (const p of players)
      await p.page.waitForFunction(
        () => window.__vexMultiplayer.remotes.size === 1 && window.__vexMultiplayer.flow.room,
        null,
        LONG,
      );
    for (const p of players) await ev(p, () => window.__vexGame.scene.getScene("world").showSubSceneTransition(1));
    for (const p of players)
      await p.page.waitForFunction(
        (s) => {
          const w = window.__vexGame.scene.getScene("world");
          return w.state === s && !w.transition.visible && w.player.alive;
        },
        GameStates.Playing,
        LONG,
      );
  });
  const [p1, p2] = players;
  const p1Id = await ev(p1, () => window.__vexMultiplayer.self.id);

  await step("P1 types a message without moving", async () => {
    await p1.page.waitForTimeout(1500); // at rest after spawning
    const x0 = await xOf(p1);
    await p1.page.keyboard.press("Enter");
    await p1.page.waitForFunction(() => window.__vexMultiplayer.chat.isOpen, null, LONG);
    // "d" and "a" are also right/left (WASD): they must not reach the game.
    await p1.page.keyboard.type(MESSAGE, { delay: 80 });
    await p1.page.waitForTimeout(1000);
    const x1 = await xOf(p1);
    if (Math.abs(x1 - x0) > 1) throw new Error(`P1 moved while typing: ${x0} -> ${x1}`);
    await p1.page.keyboard.press("Enter");
    await p1.page.waitForFunction(() => !window.__vexMultiplayer.chat.isOpen, null, LONG);
    await p1.page.waitForFunction(
      (m) => document.querySelector("#vexchat .log").textContent.includes(m),
      MESSAGE,
      LONG,
    );
  });

  await step("P2 sees the line and a bubble over P1", async () => {
    await p2.page.waitForFunction(
      (m) => document.querySelector("#vexchat .log").textContent.includes(m),
      MESSAGE,
      LONG,
    );
    const text = await logText(p2);
    if (!text.includes("P1:")) throw new Error(`no sender in P2's log: ${text}`);
    await p2.page.waitForFunction(
      (id) => {
        const r = window.__vexMultiplayer.remotes.get(id);
        return r.bubble.visible && r.bubbleText.text.length > 0;
      },
      p1Id,
      LONG,
    );
    // Headless runs at a few fps: show it again so it's still up for the screenshot.
    await ev(p2, (id) => window.__vexMultiplayer.remotes.get(id).say("dad hola"), p1Id);
    await p2.page.waitForTimeout(800);
    await p2.page.screenshot({ path: path.join(outDir, "chat-p2.png") });
  });

  await step("P1 can move again after closing the chat", async () => {
    const x0 = await xOf(p1);
    await p1.page.keyboard.down("ArrowRight");
    try {
      await p1.page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 20, x0, LONG);
    } finally {
      await p1.page.keyboard.up("ArrowRight");
    }
  });

  await step("a player joining later gets the history", async () => {
    const p3 = await openPlayer("P3");
    players.push(p3);
    await waitForMainMenu(p3.page, 180000);
    await p3.page.waitForFunction(
      (m) => document.querySelector("#vexchat .log").textContent.includes(m),
      MESSAGE,
      LONG,
    );
    await p1.page.waitForFunction(() => document.querySelector("#vexchat .log").textContent.includes("P3"), null, LONG);
  });

  await step("no uncaught page errors", async () => {
    if (report.errors.length) throw new Error(report.errors.join("\n"));
  });
} catch (e) {
  failed = true;
  console.log("FAILED");
  console.error(e.message);
  if (report.errors.length) console.error("page errors:\n" + report.errors.join("\n"));
  for (const p of players)
    await p.page.screenshot({ path: path.join(outDir, `chat-failure-${p.name}.png`) }).catch(() => {});
} finally {
  await browser.close();
  await server.close();
}
console.log(failed ? "chat test FAILED" : "chat test passed; screenshot in test-results/chat-p2.png");
process.exit(failed ? 1 : 0);
