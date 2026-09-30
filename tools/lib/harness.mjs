// Shared helpers for the headless browser tests.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
export const outDir = path.join(root, "test-results");
export const GameStates = { Loading: 0, Playing: 1, MainMenu: 2 };
export const SubSceneList = { Menu: 0, Hub: 1 };

export function requireBuild() {
  if (!fs.existsSync(path.join(root, "dist", "vex7.js"))) {
    console.error("dist/vex7.js not found: run `npm run build` first");
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
}

export function launchBrowser() {
  return chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--autoplay-policy=no-user-gesture-required", "--enable-unsafe-swiftshader"],
  });
}

// Records uncaught errors and blocked external requests, keeps the page offline and
// exposes the Phaser.Game instance as window.__vexGame without touching game code:
// every copy of Phaser is published through `window.Phaser = ...`, so Game#boot is
// hooked as it is assigned.
export async function preparePage(page, report = { errors: [], external: new Set() }) {
  page.on("pageerror", (e) => report.errors.push(e.stack || e.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => {
    report.external.add(new URL(route.request().url()).host);
    return route.abort();
  });
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
  return report;
}

export async function step(name, fn) {
  process.stdout.write(`- ${name} ... `);
  const result = await fn();
  console.log("ok");
  return result;
}

export function waitForMainMenu(page, timeout = 90000) {
  return page.waitForFunction(
    (s) => {
      const w = window.__vexGame && window.__vexGame.scene.getScene("world");
      return w && w.sys.isActive() && w.state === s;
    },
    GameStates.MainMenu,
    { timeout },
  );
}

// Starts the hub and waits until the player has spawned (after the transition).
export async function enterHub(page, timeout = 90000) {
  await page.evaluate((hub) => window.__vexGame.scene.getScene("world").showSubSceneTransition(hub), SubSceneList.Hub);
  await page.waitForFunction(
    (s) => {
      const w = window.__vexGame.scene.getScene("world");
      return w.state === s && !w.transition.visible && w.player.alive === true;
    },
    GameStates.Playing,
    { timeout },
  );
}

export function playerPos(page) {
  return page.evaluate(() => {
    const p = window.__vexGame.scene.getScene("world").player;
    return { x: p.xPos, y: p.yPos, alive: p.alive };
  });
}
