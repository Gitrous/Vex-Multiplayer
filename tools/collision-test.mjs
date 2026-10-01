#!/usr/bin/env node
// Headless check of player collisions with two players in the hub:
//   - with collisions off (the default), P1 runs through P2
//   - P1 ticks "Colisiones" in the room panel; P2's panel shows it ticked too
//   - with collisions on, P1 runs into P2: P1 stays at P2's side and P2 is pushed along
//   - P1 drops onto P2's head and stands there; P2 walks and carries P1
//
//   node tools/collision-test.mjs      (run `npm run build` first)
import path from "node:path";
import { startServer } from "../server/server.mjs";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, GameStates } from "./lib/harness.mjs";

const LONG = { timeout: 180000, polling: 100 };
requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const base = `http://127.0.0.1:${await server.ready}`;
const room = "coll-" + Math.random().toString(36).slice(2, 7);
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
// Hold a key until the player's x satisfies cond (or time out).
async function walkUntil(p, key, cond, arg) {
  await p.page.keyboard.down(key);
  try {
    await p.page.waitForFunction(cond, arg, LONG);
  } finally {
    await p.page.keyboard.up(key);
  }
  await p.page.waitForTimeout(800); // come to a stop, let the last snapshots arrive
}

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
  const p2Id = await ev(p2, () => window.__vexMultiplayer.self.id);
  const p2x0 = await xOf(p2);

  await step("collisions off: P1 runs through P2", async () => {
    const off = await ev(p1, () => window.__vexMultiplayer.collisions.enabled);
    if (off) throw new Error("collisions should start off");
    await walkUntil(p1, "ArrowRight", (x) => window.__vexGame.scene.getScene("world").player.xPos > x + 40, p2x0);
    const p2x = await xOf(p2);
    if (Math.abs(p2x - p2x0) > 1) throw new Error(`P2 moved without collisions: ${p2x0} -> ${p2x}`);
    // Back to P2's left for the next step.
    await walkUntil(p1, "ArrowLeft", (x) => window.__vexGame.scene.getScene("world").player.xPos < x - 40, p2x0);
  });

  await step("P1 ticks the collisions box; P2 sees it ticked", async () => {
    await p1.page.click("#vexmp .coll");
    await p2.page.waitForFunction(() => document.querySelector("#vexmp .coll").checked === true, null, LONG);
    await p1.page.waitForFunction(() => window.__vexMultiplayer.collisions.enabled, null, LONG);
  });

  await step("collisions on: P1 runs into P2, stays at its side and pushes it along", async () => {
    await p1.page.keyboard.down("ArrowRight");
    try {
      // P2's own client moves P2 when it gets pushed.
      await p2.page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 8, p2x0, LONG);
      // Meanwhile P1 never gets past P2's ghost.
      const s = await ev(
        p1,
        (id) => {
          const w = window.__vexGame.scene.getScene("world");
          return { me: w.player.xPos, ghost: window.__vexMultiplayer.remotes.get(id).container.x };
        },
        p2Id,
      );
      if (s.me > s.ghost) throw new Error(`P1 passed through P2: ${JSON.stringify(s)}`);
    } finally {
      await p1.page.keyboard.up("ArrowRight");
    }
    await p1.page.screenshot({ path: path.join(outDir, "collision-p1.png") });
  });

  await step("P1 drops onto P2's head and stands there", async () => {
    // Put P1 in the air right above P2 (as after a jump) and let it fall.
    await p2.page.waitForTimeout(1500); // P2 at rest after the pushes
    await ev(
      p1,
      (id) => {
        const g = window.__vexMultiplayer.remotes.get(id).container;
        const p = window.__vexGame.scene.getScene("world").player;
        p.xPos = g.x;
        p.yPos = g.y - 90;
        p.xVelocity = 0;
        p.yVelocity = 0;
        p.falling = true;
        p.setFall();
        p.updatePositions();
      },
      p2Id,
    );
    // Physics advances one step per rendered frame (a few fps headless): wait until P1 has
    // either landed on something or dropped past P2's head.
    await p1.page.waitForFunction(
      (id) => {
        const g = window.__vexMultiplayer.remotes.get(id).container;
        const p = window.__vexGame.scene.getScene("world").player;
        return (p.currentLandBlock && p.yVelocity === 0) || p.yPos > g.y - 20;
      },
      p2Id,
      LONG,
    );
    await p1.page.waitForTimeout(1000); // still there a moment later
    const s = await ev(
      p1,
      (id) => {
        const g = window.__vexMultiplayer.remotes.get(id).container;
        const p = window.__vexGame.scene.getScene("world").player;
        return {
          y: p.yPos,
          headY: g.y - 33,
          alive: p.alive,
          onPlayer: !!(p.currentLandBlock && p.currentLandBlock.type === "player"),
        };
      },
      p2Id,
    );
    if (!s.alive || !s.onPlayer || Math.abs(s.y - s.headY) > 3)
      throw new Error(`P1 isn't standing on P2: ${JSON.stringify(s)}`);
    await p1.page.screenshot({ path: path.join(outDir, "collision-on-head.png") });
  });

  await step("P2 walks and carries P1 along", async () => {
    const before = await xOf(p1);
    const p2Before = await xOf(p2);
    await walkUntil(p2, "ArrowRight", (x) => window.__vexGame.scene.getScene("world").player.xPos > x + 30, p2Before);
    await p1.page.waitForTimeout(1000);
    const s = await ev(p1, () => {
      const p = window.__vexGame.scene.getScene("world").player;
      return { x: p.xPos, onPlayer: !!(p.currentLandBlock && p.currentLandBlock.type === "player") };
    });
    if (!s.onPlayer || !(s.x > before + 20)) throw new Error(`P1 wasn't carried: ${before} -> ${JSON.stringify(s)}`);
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
    await p.page.screenshot({ path: path.join(outDir, `collision-failure-${p.name}.png`) }).catch(() => {});
} finally {
  await browser.close();
  await server.close();
}
console.log(failed ? "collision test FAILED" : "collision test passed; screenshot in test-results/collision-p1.png");
process.exit(failed ? 1 : 0);
