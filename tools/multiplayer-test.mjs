#!/usr/bin/env node
// Headless multiplayer check: four players join one room, a fifth is turned away, all
// four enter the hub, player 1 walks and the other three must see its ghost follow it.
// Then player 4 leaves and the others must drop it.
//
//   node tools/multiplayer-test.mjs      (run `npm run build` first)
//
// Screenshots land in test-results/mp-*.png. This runs four software-rendered games at
// once, so it takes a few minutes.
import path from "node:path";
import { startServer } from "../server/server.mjs";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, enterHub } from "./lib/harness.mjs";

const PLAYERS = 4;
requireBuild();

const server = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
const base = `http://127.0.0.1:${await server.ready}`;
const room = "test-" + Math.random().toString(36).slice(2, 7);
const browser = await launchBrowser();
const report = { errors: [], external: new Set() };

async function openPlayer(name) {
  // Separate contexts: separate localStorage, like separate machines.
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();
  await preparePage(page, report);
  await page.goto(`${base}/index.html?room=${room}&name=${name}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  return { name, context, page };
}
const mp = (page, fn, arg) => page.evaluate(fn, arg);
const remoteCount = (page) => mp(page, () => (window.__vexMultiplayer ? window.__vexMultiplayer.remotes.size : -1));

let failed = false;
const players = [];
try {
  await step(`open ${PLAYERS} players in room ${room}`, async () => {
    for (let i = 0; i < PLAYERS; i++) players.push(await openPlayer(`P${i + 1}`));
    await Promise.all(players.map((p) => waitForMainMenu(p.page, 180000)));
  });

  await step("everyone sees the other three, in distinct slots", async () => {
    for (const p of players)
      await p.page.waitForFunction((n) => window.__vexMultiplayer.remotes.size === n, PLAYERS - 1, { timeout: 30000 });
    const slots = await Promise.all(players.map((p) => mp(p.page, () => window.__vexMultiplayer.self.slot)));
    if (new Set(slots).size !== PLAYERS) throw new Error(`slots not distinct: ${slots}`);
    const names = await mp(players[1].page, () =>
      [...window.__vexMultiplayer.remotes.values()].map((r) => r.name).sort(),
    );
    if (names.join() !== "P1,P3,P4") throw new Error(`P2 sees names ${names}`);
  });

  await step("a fifth player is turned away (room full)", async () => {
    const extra = await openPlayer("P5");
    try {
      await extra.page.waitForFunction(
        () => window.__vexMultiplayer && window.__vexMultiplayer.overlay.status === "full",
        null,
        { timeout: 180000 },
      );
    } catch (e) {
      const status = await mp(extra.page, () => window.__vexMultiplayer && window.__vexMultiplayer.overlay.status);
      throw new Error(`P5 overlay status: ${status}`);
    }
    await extra.context.close();
    for (const p of players)
      if ((await remoteCount(p.page)) !== PLAYERS - 1) throw new Error(`${p.name} changed after P5`);
  });

  await step("all enter the hub", () => Promise.all(players.map((p) => enterHub(p.page, 180000))));

  const [p1, ...others] = players;
  const p1Id = await mp(p1.page, () => window.__vexMultiplayer.self.id);
  const ghostOfP1 = (page) =>
    mp(
      page,
      (id) => {
        const r = window.__vexMultiplayer.remotes.get(id);
        return (
          r && {
            visible: r.container.visible,
            x: r.container.x,
            y: r.container.y,
            anim: r.anim,
            label: r.label.visible,
          }
        );
      },
      p1Id,
    );

  await step("P1's ghost is visible in the hub for the others", async () => {
    for (const o of others)
      await o.page.waitForFunction((id) => {
        const r = window.__vexMultiplayer.remotes.get(id);
        return r && r.container.visible && r.label.visible;
      }, p1Id);
  });

  await step("P1 walks right and the ghosts follow", async () => {
    const before = await Promise.all(others.map((o) => ghostOfP1(o.page)));
    const startX = await mp(p1.page, () => window.__vexGame.scene.getScene("world").player.xPos);
    await p1.page.keyboard.down("ArrowRight");
    // Physics advances once per rendered frame and four software-rendered games run at
    // a few fps, so hold the key until P1 has really moved rather than for a fixed time.
    await p1.page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 60, startX, {
      timeout: 120000,
      polling: 200,
    });
    // Mid-run (P1 has been running for a while): the ghosts should be running too.
    const running = await Promise.all(others.map((o) => ghostOfP1(o.page)));
    await p1.page.keyboard.up("ArrowRight");
    await p1.page.waitForTimeout(3000); // let P1 stop and the last snapshots arrive
    const real = await mp(p1.page, () => {
      const pl = window.__vexGame.scene.getScene("world").player;
      return { x: pl.container.x, y: pl.container.y, anim: pl.spine.getCurrentAnimationName() };
    });
    const after = await Promise.all(others.map((o) => ghostOfP1(o.page)));
    await others[0].page.screenshot({ path: path.join(outDir, "mp-p2-view.png") });
    await p1.page.screenshot({ path: path.join(outDir, "mp-p1-view.png") });
    others.forEach((o, i) => {
      if (!(after[i].x > before[i].x + 20))
        throw new Error(`${o.name}: ghost did not move (${before[i].x} -> ${after[i].x})`);
      if (Math.abs(after[i].x - real.x) > 5 || Math.abs(after[i].y - real.y) > 5)
        throw new Error(`${o.name}: ghost at ${after[i].x},${after[i].y} but P1 is at ${real.x},${real.y}`);
      if (after[i].anim !== real.anim)
        throw new Error(`${o.name}: ghost animation ${after[i].anim}, P1 plays ${real.anim}`);
      if (running[i].anim !== "run") throw new Error(`${o.name}: ghost animation while running was ${running[i].anim}`);
    });
  });

  await step("idle ghosts don't replay one-shot animations", async () => {
    // P3 and P4 stood still since spawning; their ghosts must not loop the spawn animation.
    const restarts = await mp(others[0].page, () => {
      const counts = [];
      for (const r of window.__vexMultiplayer.remotes.values()) {
        const view = r.spine.getView();
        const track = view.state.getCurrent(0);
        counts.push({
          name: r.name,
          anim: r.anim,
          loop: track && track.loop,
          t: track && track.trackTime,
          d: r.spine.getCurrentAnimationDuration(),
        });
      }
      return counts;
    });
    for (const r of restarts)
      if (!r.loop && r.d > 0 && r.t < r.d)
        throw new Error(`ghost ${r.name} is still playing one-shot "${r.anim}" (${r.t}/${r.d}s)`);
  });

  await step("a player leaving disappears for the others", async () => {
    await players[PLAYERS - 1].context.close();
    for (const p of players.slice(0, PLAYERS - 1))
      await p.page.waitForFunction((n) => window.__vexMultiplayer.remotes.size === n, PLAYERS - 2, { timeout: 30000 });
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
    await p.page.screenshot({ path: path.join(outDir, `mp-failure-${p.name}.png`) }).catch(() => {});
} finally {
  await browser.close();
  await server.close();
}
console.log(`external requests (blocked): ${report.external.size ? [...report.external].join(", ") : "none"}`);
console.log(failed ? "multiplayer test FAILED" : "multiplayer test passed; screenshots in test-results/mp-*.png");
process.exit(failed ? 1 : 0);
