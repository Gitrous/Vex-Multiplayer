#!/usr/bin/env node
// A full room (10 players) as seen by one real browser: the other nine are lightweight
// WebSocket clients that join, press PLAY and send standing/running snapshots spread
// around the hub's spawn point. Checks that the game draws nine ghosts with distinct
// colours, that the room panel lists all ten, and that it stays error-free.
//
//   node tools/crowd-test.mjs      (run `npm run build` first)
import path from "node:path";
import { WebSocket } from "ws";
import { startServer } from "../server/server.mjs";
import protocol from "../src/game/multiplayer/protocol.js";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, GameStates } from "./lib/harness.mjs";

const N = protocol.MAX_PLAYERS;
const LONG = { timeout: 180000, polling: 250 };
requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const port = await server.ready;
const room = "crowd-" + Math.random().toString(36).slice(2, 7);
const bots = [];
let spawn = null; // where the bots stand, once the browser player is in the hub

function bot(i) {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/mp`);
  const b = { ws, i, timer: null };
  ws.on("open", () => ws.send(JSON.stringify({ t: "hello", room, name: "Bot" + i })));
  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    if (msg.t === "welcome") ws.send(JSON.stringify({ t: "ready" }));
    if (msg.t === "go") ws.send(JSON.stringify({ t: "loc", loc: "hub" }));
  });
  b.timer = setInterval(() => {
    if (!spawn || ws.readyState !== ws.OPEN) return;
    const running = i % 2 === 0;
    ws.send(
      JSON.stringify({
        t: "s",
        l: "hub",
        v: 1,
        x: spawn.x - 120 + i * 30 + (running ? (Date.now() / 20) % 30 : 0),
        y: spawn.y,
        r: 0,
        cx: 1,
        cy: 1,
        al: 1,
        sx: running ? 1 : -1,
        sy: 1,
        ox: 0,
        oy: 0,
        a: running ? "run" : "stand",
        lp: running ? 1 : 0,
        p: 0,
        ts: 1,
        k: i % 5,
      }),
    );
  }, 1000 / 15);
  return b;
}

const browser = await launchBrowser();
const report = { errors: [], external: new Set() };
let failed = false;
let page;
try {
  await step(`${N - 1} bots join room ${room}`, async () => {
    for (let i = 1; i < N; i++) bots.push(bot(i));
    await new Promise((r) => setTimeout(r, 500));
  });

  await step("the browser player joins as the 10th and reaches the hub with everybody", async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    page = await context.newPage();
    await preparePage(page, report);
    await page.goto(`http://127.0.0.1:${port}/index.html?room=${room}&name=Yo`, { waitUntil: "domcontentloaded" });
    await waitForMainMenu(page, 180000);
    await page.waitForFunction((n) => window.__vexMultiplayer.remotes.size === n, N - 1, LONG);
    await page.evaluate(() => window.__vexGame.scene.getScene("world").showSubSceneTransition(1)); // PLAY
    await page.waitForFunction(
      (s) => {
        const w = window.__vexGame.scene.getScene("world");
        return w.state === s && !w.transition.visible && w.player.alive;
      },
      GameStates.Playing,
      LONG,
    );
    spawn = await page.evaluate(() => {
      const p = window.__vexGame.scene.getScene("world").player;
      return { x: p.xPos, y: p.yPos };
    });
  });

  await step(`all ${N - 1} ghosts are drawn in the hub, each in its own colour`, async () => {
    await page.waitForFunction(
      (n) => [...window.__vexMultiplayer.remotes.values()].filter((r) => r.container.visible).length === n,
      N - 1,
      LONG,
    );
    const colours = await page.evaluate(() => [...window.__vexMultiplayer.remotes.values()].map((r) => r.color));
    const mine = await page.evaluate(() => window.__vexMultiplayer.self.slot);
    const all = new Set([...colours, protocol.PLAYER_COLORS[mine]]);
    if (all.size !== N) throw new Error(`colours not distinct: ${colours} + mine ${protocol.PLAYER_COLORS[mine]}`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, "crowd-hub.png") });
  });

  await step(`the room panel lists all ${N} players`, async () => {
    const rows = await page.evaluate(() => document.querySelectorAll("#vexmp .players .row").length);
    if (rows !== N) throw new Error(`panel lists ${rows} players`);
  });

  await step("no uncaught page errors", async () => {
    if (report.errors.length) throw new Error(report.errors.join("\n"));
  });
} catch (e) {
  failed = true;
  console.log("FAILED");
  console.error(e.message);
  if (page) await page.screenshot({ path: path.join(outDir, "crowd-failure.png") }).catch(() => {});
} finally {
  for (const b of bots) {
    clearInterval(b.timer);
    b.ws.terminate();
  }
  await browser.close();
  await server.close();
}
console.log(failed ? "crowd test FAILED" : "crowd test passed; screenshot in test-results/crowd-hub.png");
process.exit(failed ? 1 : 0);
