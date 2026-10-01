#!/usr/bin/env node
// Headless multiplayer check with four players in one room:
//   - a fifth player is turned away (room full)
//   - everybody sees the others in the main menu (positions mapped between menu layouts)
//   - nobody leaves the menu until all four have pressed PLAY, then all enter the hub
//   - in the hub, P1 walks and the others see its ghost follow it
//   - race: P1 picks act 1, P2 asks for act 3 but is sent to act 1; everybody waits frozen
//     at the start until the last player arrives, then the countdown starts them together
//   - results come only when every player has finished (P3 quits: DNF), then the game's
//     level-complete panel opens; meanwhile the finished players spectate: the camera
//     follows a player still racing, and ←/→ switch players
//   - a player leaving disappears for the others
//
//   node tools/multiplayer-test.mjs      (run `npm run build` first)
//
// Screenshots land in test-results/mp-*.png. This runs four software-rendered games at
// once, so it takes several minutes.
import path from "node:path";
import { startServer } from "../server/server.mjs";
import { outDir, requireBuild, launchBrowser, preparePage, step, waitForMainMenu, GameStates } from "./lib/harness.mjs";

const PLAYERS = 4;
const SubSceneList = { Menu: 0, Hub: 1, Act: 2 };
const PanelLevelComplete = 6;
const LONG = { timeout: 180000, polling: 250 };
requireBuild();

// Rooms take 10 players; a limit of 4 lets four browsers check the "room full" path.
const server = startServer({ port: 0, host: "127.0.0.1", log: () => {}, maxPlayers: PLAYERS });
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
const ev = (p, fn, arg) => p.page.evaluate(fn, arg);
const world = () => window.__vexGame.scene.getScene("world");
const all = (list, fn) => Promise.all(list.map(fn));
const waitAll = (list, fn, arg, opts = LONG) => all(list, (p) => p.page.waitForFunction(fn, arg, opts));
const pressPlay = (p) =>
  ev(p, (hub) => window.__vexGame.scene.getScene("world").showSubSceneTransition(hub), SubSceneList.Hub);
// What landing on an act block in the hub does.
const enterAct = (p, act) =>
  ev(p, ([sub, n]) => window.__vexGame.scene.getScene("world").showSubSceneTransition(sub, n, false), [
    SubSceneList.Act,
    act,
  ]);
const worldState = (p) => ev(p, () => window.__vexGame.scene.getScene("world").state);
const finish = (p) => ev(p, () => window.__vexGame.scene.getScene("world").finishLevel());

let failed = false;
const players = [];
try {
  await step(`open ${PLAYERS} players in room ${room}`, async () => {
    for (let i = 0; i < PLAYERS; i++) players.push(await openPlayer(`P${i + 1}`));
    await all(players, (p) => waitForMainMenu(p.page, 180000));
    await waitAll(
      players,
      (n) => window.__vexMultiplayer.remotes.size === n && window.__vexMultiplayer.flow.room,
      PLAYERS - 1,
    );
    const slots = await all(players, (p) => ev(p, () => window.__vexMultiplayer.self.slot));
    if (new Set(slots).size !== PLAYERS) throw new Error(`slots not distinct: ${slots}`);
  });
  const [p1, p2, p3, p4] = players;
  const ids = await all(players, (p) => ev(p, () => window.__vexMultiplayer.self.id));

  await step("a fifth player is turned away (room full)", async () => {
    const extra = await openPlayer("P5");
    await extra.page.waitForFunction(
      () => window.__vexMultiplayer && window.__vexMultiplayer.overlay.status === "full",
      null,
      LONG,
    );
    await extra.context.close();
  });

  await step("everybody sees the others in the main menu, on the menu blocks", async () => {
    await waitAll(
      players,
      (n) => [...window.__vexMultiplayer.remotes.values()].filter((r) => r.container.visible).length === n,
      PLAYERS - 1,
    );
    // All players stand on PLAY after spawning; each ghost must be within this screen's PLAY block.
    const inside = await ev(p2, () => {
      const b = window.__vexGame.scene.getScene("world").subScene.blockPlay;
      return [...window.__vexMultiplayer.remotes.values()].map(
        (r) => r.container.x >= b.leftEdge - 5 && r.container.x <= b.rightEdge + 5,
      );
    });
    if (inside.includes(false)) throw new Error(`menu ghosts outside the PLAY block: ${inside}`);
    await p2.page.screenshot({ path: path.join(outDir, "mp-1-menu.png") });
  });

  await step("PLAY waits for everybody, then all enter the hub together", async () => {
    for (const p of [p1, p2, p3]) await pressPlay(p);
    await p1.page.waitForFunction(
      () => /Esperando a que todos pulsen JUGAR \(3\/4\)/.test(document.getElementById("vexmp-banner").textContent),
      null,
      LONG,
    );
    await p1.page.waitForTimeout(1500);
    const states = await all(players, worldState);
    if (states.some((s) => s !== GameStates.MainMenu)) throw new Error(`someone left the menu early: ${states}`);
    await pressPlay(p4);
    await waitAll(
      players,
      (s) => {
        const w = window.__vexGame.scene.getScene("world");
        return w.state === s && !w.transition.visible && w.player.alive;
      },
      GameStates.Playing,
    );
  });

  await step("in the hub, P1 walks and the others see its ghost follow", async () => {
    const startX = await ev(p1, () => window.__vexGame.scene.getScene("world").player.xPos);
    await p1.page.keyboard.down("ArrowRight");
    // Physics advances once per rendered frame and four software-rendered games run at a
    // few fps, so hold the key until P1 has really moved rather than for a fixed time.
    await p1.page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 60, startX, LONG);
    await p1.page.keyboard.up("ArrowRight");
    await p1.page.waitForTimeout(3000);
    const real = await ev(p1, () => {
      const c = window.__vexGame.scene.getScene("world").player.container;
      return { x: c.x, y: c.y };
    });
    for (const o of [p2, p3, p4]) {
      const g = await ev(
        o,
        (id) => {
          const r = window.__vexMultiplayer.remotes.get(id);
          return { visible: r.container.visible, x: r.container.x, y: r.container.y };
        },
        ids[0],
      );
      if (!g.visible || Math.abs(g.x - real.x) > 5 || Math.abs(g.y - real.y) > 5)
        throw new Error(`${o.name}: P1's ghost ${JSON.stringify(g)} vs P1 at ${JSON.stringify(real)}`);
    }
    await p2.page.screenshot({ path: path.join(outDir, "mp-2-hub.png") });
  });

  await step("race: P1 picks act 1; P2 asks for act 3 and is sent to act 1", async () => {
    await enterAct(p1, 1);
    await enterAct(p2, 3);
    await waitAll([p1, p2], () => {
      const w = window.__vexGame.scene.getScene("world");
      return w.currLevelID === "1" && window.__vexMultiplayer.flow.race && window.__vexMultiplayer.flow.race.frozen;
    });
  });

  await step("the first ones wait frozen at the start until everybody arrives", async () => {
    const before = await ev(p1, () => window.__vexGame.scene.getScene("world").player.xPos);
    await p1.page.keyboard.down("ArrowRight");
    await enterAct(p3, 1);
    await p1.page.waitForTimeout(4000);
    await p1.page.keyboard.up("ArrowRight");
    const after = await ev(p1, () => window.__vexGame.scene.getScene("world").player.xPos);
    if (after !== before) throw new Error(`P1 moved while waiting: ${before} -> ${after}`);
    const race = await ev(p1, () => window.__vexMultiplayer.flow.room.race);
    if (race.state !== "gathering") throw new Error(`race ${race.state} before P4 arrived`);
    await p1.page.screenshot({ path: path.join(outDir, "mp-3-waiting.png") });
  });

  await step("when the last player arrives, the countdown starts everybody together", async () => {
    await enterAct(p4, 1);
    await waitAll(players, () => !!(window.__vexMultiplayer.flow.race && window.__vexMultiplayer.flow.race.goAt));
    await p4.page.screenshot({ path: path.join(outDir, "mp-4-countdown.png") });
    await waitAll(
      players,
      (s) => {
        const f = window.__vexMultiplayer.flow;
        return f.race && f.race.startedAt > 0 && window.__vexGame.scene.getScene("world").state === s;
      },
      GameStates.Playing,
    );
    const levels = await all(players, (p) => ev(p, () => window.__vexGame.scene.getScene("world").currLevelID));
    if (levels.some((l) => l !== "1")) throw new Error(`not all in act 1: ${levels}`);
  });

  await step("no results until every player has finished (P3 quits)", async () => {
    await finish(p2);
    await finish(p1);
    // P3 leaves the act through the pause menu's "hub" button, which is a DNF.
    await ev(p3, (hub) => window.__vexGame.scene.getScene("world").showSubSceneTransition(hub), SubSceneList.Hub);
    await p1.page.waitForFunction(
      () => {
        const r = window.__vexMultiplayer.flow.room.race;
        return r && r.finished.length === 3;
      },
      null,
      LONG,
    );
    await p1.page.screenshot({ path: path.join(outDir, "mp-5-finished-waiting.png") });
    const early = await ev(
      p1,
      () => window.__vexMultiplayer.flow.notice && !!window.__vexMultiplayer.flow.notice.results,
    );
    if (early) throw new Error("results shown before P4 finished");
  });

  await step("while waiting, P1 spectates P4 (still racing) and can switch players", async () => {
    const spec = () =>
      ev(p1, () => {
        const mp = window.__vexMultiplayer;
        return {
          active: mp.spectator.active,
          target: mp.spectator.targetId,
          camX: window.__vexGame.scene.getScene("world").cameraX,
        };
      });
    let s = await spec();
    if (!s.active || s.target !== ids[3]) throw new Error(`P1 should follow P4 (#${ids[3]}): ${JSON.stringify(s)}`);
    // P4 runs; P1's camera must follow P4's ghost.
    const startX = await ev(p4, () => window.__vexGame.scene.getScene("world").player.xPos);
    await p4.page.keyboard.down("ArrowRight");
    await p4.page.waitForFunction((x) => window.__vexGame.scene.getScene("world").player.xPos > x + 60, startX, LONG);
    await p4.page.keyboard.up("ArrowRight");
    await p1.page.waitForFunction(
      (id) => {
        const g = window.__vexMultiplayer.remotes.get(id).container;
        return Math.abs(window.__vexGame.scene.getScene("world").cameraX - g.x) < 15;
      },
      ids[3],
      LONG,
    );
    s = await spec();
    if (!(s.camX > startX + 40))
      throw new Error(`P1's camera didn't move with P4: ${JSON.stringify(s)} from ${startX}`);
    await p1.page.screenshot({ path: path.join(outDir, "mp-5-spectating.png") });
    // → switches to the other visible player (P2, waiting at the finish); P3 is in the hub.
    await p1.page.keyboard.press("ArrowRight");
    await p1.page.waitForFunction((id) => window.__vexMultiplayer.spectator.targetId === id, ids[1], {
      timeout: 30000,
    });
    const label = await ev(p1, () => document.querySelector("#vexmp-spec .label").textContent);
    if (!/P2/.test(label)) throw new Error(`spectator bar says ${label}`);
    await p1.page.keyboard.press("ArrowRight");
    await p1.page.waitForFunction((id) => window.__vexMultiplayer.spectator.targetId === id, ids[3], {
      timeout: 30000,
    });
  });

  await step("when the last one finishes: results, then the level panel", async () => {
    await finish(p4);
    await waitAll(players, () => {
      const n = window.__vexMultiplayer.flow.notice;
      return n && n.results;
    });
    await p2.page.screenshot({ path: path.join(outDir, "mp-6-results.png") });
    const results = await ev(p1, () => window.__vexMultiplayer.flow.notice.results);
    const finishers = results.filter((r) => !r.dnf);
    const byTime = [...finishers].sort((a, b) => a.ms - b.ms).map((r) => r.name);
    if (finishers.map((r) => r.name).join() !== byTime.join() || finishers.some((r, i) => r.place !== i + 1))
      throw new Error(`results not ranked by time: ${JSON.stringify(results)}`);
    if (byTime.slice().sort().join() !== "P1,P2,P4" || results.at(-1).name !== "P3" || !results.at(-1).dnf)
      throw new Error(`unexpected results: ${JSON.stringify(results)}`);
    const spectating = await ev(p1, () => window.__vexMultiplayer.spectator.active);
    if (spectating) throw new Error("still spectating after the race");
    await waitAll(
      [p1, p2, p4],
      (panel) => window.__vexGame.scene.getScene("world").panelManager.currentPanel === panel,
      PanelLevelComplete,
    );
  });

  await step("a player leaving disappears for the others", async () => {
    await p4.context.close();
    await waitAll([p1, p2, p3], (n) => window.__vexMultiplayer.remotes.size === n, PLAYERS - 2, { timeout: 30000 });
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
