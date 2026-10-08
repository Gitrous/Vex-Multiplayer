#!/usr/bin/env node
// Edge cases of player collisions, and restarting an act with R in a race. One real browser
// and one bot (a plain WebSocket client) whose ghost is put exactly where each case needs it:
//   - a ghost that sinks into your head (lag) neither squashes you nor pushes you through the floor
//   - you can walk out from under a ghost standing on you, without pushing it
//   - falling fast onto a head is a soft landing, not a "hard landing" death
//   - a ghost that teleports (respawn) doesn't drag the player standing on it
//   - in a race, R sends you back to the start and keeps the race clock and your deaths
//
//   node tools/stacking-test.mjs      (run `npm run build` first)
import path from "node:path";
import { WebSocket } from "ws";
import { startServer } from "../server/server.mjs";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, GameStates } from "./lib/harness.mjs";

const LONG = { timeout: 180000, polling: 100 };
const SubScene = { Hub: 1, Act: 2 };
requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const port = await server.ready;
const room = "stack-" + Math.random().toString(36).slice(2, 7);

// The bot: joins, follows the room flow, and sends its ghost's position (`bot.pos`) 15 times a second.
const bot = { pos: null, pushed: 0, ws: new WebSocket(`ws://127.0.0.1:${port}/mp`) };
bot.send = (msg) => bot.ws.readyState === bot.ws.OPEN && bot.ws.send(JSON.stringify(msg));
bot.ws.on("open", () => bot.send({ t: "hello", room, name: "Bot" }));
bot.ws.on("message", (data) => {
  const msg = JSON.parse(data);
  if (msg.t === "welcome") bot.send({ t: "ready" });
  if (msg.t === "go") bot.send({ t: "loc", loc: "hub" });
  if (msg.t === "pushed") bot.pushed++;
});
const botTimer = setInterval(() => {
  if (!bot.pos) return;
  const p = typeof bot.pos === "function" ? bot.pos() : bot.pos;
  bot.send({
    t: "s",
    l: p.l || "hub",
    v: 1,
    x: p.x,
    y: p.y,
    r: 0,
    cx: 1,
    cy: 1,
    al: 1,
    sx: 1,
    sy: 1,
    ox: 0,
    oy: 0,
    a: "stand",
    lp: 1,
    p: 0,
    ts: 1,
    k: 1,
  });
}, 1000 / 15);

const browser = await launchBrowser();
const report = { errors: [], external: new Set() };
let page;
const ev = (fn, arg) => page.evaluate(fn, arg);
const me = () =>
  ev(() => {
    const p = window.__vexGame.scene.getScene("world").player;
    return { x: p.xPos, y: p.yPos, alive: p.alive, vy: p.yVelocity };
  });
// The bot's ghost as drawn in the browser.
const ghost = () =>
  ev(() => {
    const r = [...window.__vexMultiplayer.remotes.values()][0];
    return { x: r.container.x, y: r.container.y, visible: r.container.visible };
  });
const kills = () => ev(() => window.__kills.slice());
// Wait until the ghost is drawn at (x, y): snapshots arrive and are shown 120 ms late.
const ghostAt = (x, y) =>
  page.waitForFunction(
    ([x, y]) => {
      const r = [...window.__vexMultiplayer.remotes.values()][0];
      return r && r.container.visible && Math.abs(r.container.x - x) < 1 && Math.abs(r.container.y - y) < 1;
    },
    [x, y],
    LONG,
  );
// Put the local player at (x, y), still or falling at vy.
const placeMe = (x, y, vy) =>
  ev(
    ([x, y, vy]) => {
      const p = window.__vexGame.scene.getScene("world").player;
      p.xPos = x;
      p.yPos = y;
      p.xVelocity = 0;
      p.yVelocity = vy;
      p.falling = true;
      p.setFall();
      p.updatePositions();
    },
    [x, y, vy],
  );

let failed = false;
// A failing case is reported, and the next one still runs (each sets up its own positions).
async function check(name, fn) {
  try {
    await ev(() => (window.__kills.length = 0));
    await step(name, fn);
  } catch (e) {
    failed = true;
    console.log("FAILED");
    console.error("  " + e.message);
    await page.waitForTimeout(2500); // let a dead player respawn
  }
}
try {
  let floor; // where the player stands in the hub: { x, y }
  await step("the player and the bot reach the hub; collisions on", async () => {
    const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
    page = await context.newPage();
    await preparePage(page, report);
    await page.goto(`http://127.0.0.1:${port}/index.html?room=${room}&name=Yo`, { waitUntil: "domcontentloaded" });
    await waitForMainMenu(page, 180000);
    await page.waitForFunction(() => window.__vexMultiplayer.remotes.size === 1, null, LONG);
    await ev((hub) => window.__vexGame.scene.getScene("world").showSubSceneTransition(hub), SubScene.Hub);
    await page.waitForFunction(
      (s) => {
        const w = window.__vexGame.scene.getScene("world");
        return w.state === s && !w.transition.visible && w.player.alive && w.player.falling === false;
      },
      GameStates.Playing,
      LONG,
    );
    await page.waitForTimeout(1000); // at rest
    floor = await me();
    bot.send({ t: "settings", collisions: true });
    await page.waitForFunction(() => window.__vexMultiplayer.collisions.enabled, null, LONG);
    // Record every death, with its cause.
    await ev(() => {
      const p = window.__vexGame.scene.getScene("world").player;
      const DEATHS = { 1: "hard landing", 3: "squashed", 5: "fall" };
      window.__kills = [];
      const kill = p.kill;
      p.kill = function (type) {
        window.__kills.push(DEATHS[type] || String(type));
        return kill.apply(this, arguments);
      };
    });
  });

  await check("a ghost sinking into your head (lag) doesn't squash you or push you through the floor", async () => {
    // The bot "stands on" the player, sinking 0..30 px into it and back, as a lagging ghost can.
    const t0 = Date.now();
    bot.pos = () => {
      const k = Math.floor((Date.now() - t0) / 66) % 20;
      const sink = 3 * (k < 10 ? k : 20 - k);
      return { x: floor.x, y: floor.y - 33 + sink };
    };
    let lowest = floor.y;
    const until = Date.now() + 6000;
    while (Date.now() < until) {
      const s = await me();
      lowest = Math.max(lowest, s.y);
      if (!s.alive) break;
      await page.waitForTimeout(100);
    }
    const k = await kills();
    if (k.length) throw new Error(`the player died: ${k.join(", ")}`);
    if (lowest > floor.y + 2) throw new Error(`the player went through the floor: y ${floor.y} -> ${lowest}`);
  });

  await check("you walk out from under a ghost standing on you, without pushing it", async () => {
    bot.pos = { x: floor.x + 4, y: floor.y - 33 + 8 }; // on your head, a bit sunk and ahead
    await ghostAt(floor.x + 4, floor.y - 33 + 8);
    bot.pushed = 0;
    await page.keyboard.down("ArrowRight");
    try {
      await page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 40, floor.x, LONG);
    } finally {
      await page.keyboard.up("ArrowRight");
    }
    await page.waitForTimeout(500);
    if (bot.pushed) throw new Error(`the ghost above was pushed ${bot.pushed} times`);
    const k = await kills();
    if (k.length) throw new Error(`the player died: ${k.join(", ")}`);
  });

  await check("falling fast onto a head is a soft landing", async () => {
    bot.pos = { x: floor.x, y: floor.y };
    await ghostAt(floor.x, floor.y);
    await placeMe(floor.x, floor.y - 33 - 30, 20); // faster than the game's deadly landing speed (16)
    await page.waitForFunction(
      (headY) => {
        const p = window.__vexGame.scene.getScene("world").player;
        return !p.alive || (p.falling === false && p.yVelocity === 0) || p.yPos > headY + 4;
      },
      floor.y - 33,
      LONG,
    );
    await page.waitForTimeout(500);
    const k = await kills();
    if (k.length) throw new Error(`the player died: ${k.join(", ")}`);
    const s = await me();
    if (Math.abs(s.y - (floor.y - 33)) > 2) throw new Error(`not standing on the head: ${JSON.stringify(s)}`);
    await page.screenshot({ path: path.join(outDir, "stacking-on-head.png") });
  });

  await check("a ghost that teleports (respawn) doesn't drag the player standing on it", async () => {
    bot.pos = { x: floor.x + 700, y: floor.y - 300 };
    await ghostAt(floor.x + 700, floor.y - 300);
    await page.waitForTimeout(1500); // fall back to the floor
    const s = await me();
    if (Math.abs(s.x - floor.x) > 20) throw new Error(`the player was dragged along: x ${floor.x} -> ${s.x}`);
    if (Math.abs(s.y - floor.y) > 2) throw new Error(`the player isn't back on the floor: y ${floor.y} -> ${s.y}`);
    const k = await kills();
    if (k.length) throw new Error(`the player died: ${k.join(", ")}`);
  });

  await check("race: R goes back to the start and keeps the race clock and the deaths", async () => {
    bot.pos = null;
    bot.send({ t: "loc", loc: "other" }); // not in the hub: the race doesn't wait for the bot
    await ev((act) => window.__vexGame.scene.getScene("world").showSubSceneTransition(act, 1), SubScene.Act);
    await page.waitForFunction(
      () => window.__vexMultiplayer.flow.race && window.__vexMultiplayer.flow.race.startedAt,
      null,
      LONG,
    );
    await page.waitForFunction(() => window.__vexGame.scene.getScene("world").player.falling === false, null, LONG);
    const start = await ev(() => {
      const w = window.__vexGame.scene.getScene("world");
      return { x: w.player.xPos, spawnX: w.spawnX };
    });
    await page.keyboard.down("ArrowRight");
    try {
      await page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 60, start.x, LONG);
    } finally {
      await page.keyboard.up("ArrowRight");
    }
    const before = await ev(() => {
      const w = window.__vexGame.scene.getScene("world");
      w.currentDeaths = 2; // as if the player had died twice
      return { startedAt: window.__vexMultiplayer.flow.race.startedAt };
    });
    await page.keyboard.press("r");
    await page.waitForFunction(
      (x) => Math.abs(window.__vexGame.scene.getScene("world").player.xPos - x) < 2,
      start.spawnX,
      LONG,
    );
    const after = await ev(() => {
      const w = window.__vexGame.scene.getScene("world");
      const r = window.__vexMultiplayer.flow.race;
      return { deaths: w.currentDeaths, startedAt: r && r.startedAt, finished: r && r.finished };
    });
    if (after.startedAt !== before.startedAt) throw new Error(`the race clock was reset: ${JSON.stringify(after)}`);
    if (after.deaths !== 2) throw new Error(`deaths were reset: ${after.deaths}`);
  });

  await step("no uncaught page errors", async () => {
    if (report.errors.length) throw new Error(report.errors.join("\n"));
  });
} catch (e) {
  failed = true;
  console.log("FAILED");
  console.error(e.message);
  if (report.errors.length) console.error("page errors:\n" + report.errors.join("\n"));
  if (page) await page.screenshot({ path: path.join(outDir, "stacking-failure.png") }).catch(() => {});
} finally {
  clearInterval(botTimer);
  bot.ws.terminate();
  await browser.close();
  await server.close();
}
console.log(failed ? "stacking test FAILED" : "stacking test passed; screenshot in test-results/stacking-on-head.png");
process.exit(failed ? 1 : 0);
