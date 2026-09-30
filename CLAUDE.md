# Vex Multiplayer

Vex 7 (HTML5, Phaser 3.55.2, originally TypeScript, published by Azerion) recovered from its
shipped single-file build into an editable source tree. The goal of the project is to add
multiplayer. There is no server code yet.

## Commands

```bash
npm install            # tooling only: esbuild, babel, prettier, playwright-core
npm run dev            # build + watch + serve the repo at http://localhost:8080 (PORT=... to change)
npm run build          # dist/vex7.js + source map (readable)
npm run build:release  # dist/vex7.js minified
npm test               # headless smoke test of dist/vex7.js (build first)
npm run test:original  # same test against reference/vex7.min.js
npm run format         # prettier (printWidth 120) over src/game and tools
```

In Claude Code on the web, `.claude/hooks/session-start.sh` runs `npm install` and `npm run build` when a
session starts.

`npm run split` regenerates `src/game` and `src/vendor` from `reference/vex7.min.js` and
**discards every edit made there**. It was a one-off recovery step; don't run it on purpose.

After changing anything under `src/`, run `npm run build && npm test`. The test boots the game in
Chromium, waits for the main menu, enters the hub, walks and jumps, fails on any uncaught page
error, reports external requests, and saves screenshots to `test-results/`. Headless WebGL is
software-rendered and slow, so a run takes about a minute.

## Layout

- `index.html` loads `version.js` and then `dist/vex7.js`. Append `?build=original` to load the untouched
  `reference/vex7.min.js` instead, for A/B comparisons.
- `src/game/`: the game, one CommonJS file per original webpack module. `index.js` is the bundle entry and
  `main.js` is the `Game` class.
- `src/vendor/`: minified libraries prepended to the bundle in file-name order (Phaser, h5branding splash,
  h5ads ad wrapper, SpinePlugin, SAT.js). Don't edit these.
- `src/module-map.json`: original webpack id → file and exported names. Each file's first line names its id too.
- `assets/`: atlases, spine skeletons, bitmap fonts, sounds (`.ogg` only; the loader also asks for
  `.mp3`/`.m4a`), and JSON data. `assets/jsons/levels.json` holds every level.
- `patch/js/gd-sdk.js`: local stand-in for the GameDistribution SDK. Every ad completes immediately.
- `reference/vex7.min.js`: the original shipped bundle, kept byte-for-byte.
- `tools/`: `build.mjs`, `smoke-test.mjs`, `split-bundle.mjs`.

## Reading and writing the recovered code

The code is TypeScript compiled to ES5, then minified, then mechanically un-minified. Expect:

- Imports follow TypeScript's naming: `var data_1 = require("../data"); data_1.Constants.GW`. Folders are the
  original barrels (`index.js` re-exports through getters), and you can require the barrel or the file.
- Classes use the ES5 pattern `__extends(World, _super); World.prototype.update = function () {...}; function World() {...}`
  followed by `exports.World = _World`. Method parameters and locals are still minified (`t`, `e`, `i`, ...).
  Rename them freely when working in a function.
- Enums use TypeScript's pattern `(n = exports.PlayerState || (exports.PlayerState = {}))[(n.Stand = 1)] = "Stand"`.
- Every module starts with `"use strict"`. Keep that. The exceptions, as in the original, are the entry
  `index.js` and the Phaser shims in `lib/` (`phaser.js`, `global.js`, `phaser-bundled.min.js`).
- New code can be modern JS or TypeScript (esbuild bundles `.ts` too, target ES2017). `require` and `import`
  both work.
- Globals the game relies on: `Phaser`, `SAT`, `window.SpinePlugin`, `h5branding`, `h5ads`,
  `_azerionIntegration`, and `version`/`libs` (from `version.js`).

## Runtime architecture

**Boot.** `main.js` `Game` extends `Phaser.Game`. The constructor patches Phaser (`lib/NativeChanges.js`),
builds the game (1920×1080, or 1280×720 when `device.os.desktop` is false) and calls `AzerionSDK.init`. That
shows the h5branding splash, inits ads (`sdk/AdHandler`) and then `initScenes()`. `scenes/Boot` preloads
everything listed in `data/*` (Images, Atlases, Sounds, Fonts, Jsons, Spines), then starts `world`.

**Two Phaser copies.** `src/vendor/01-phaser-3.55.2.min.js` sets `window.Phaser` first. SpinePlugin is built
against that copy. Then `lib/phaser.js` replaces `window.Phaser` with `lib/phaser-bundled.min.js`, a second copy
of the same version, and the game uses that one.

**Scenes.** There are only two Phaser scenes: `boot` and `world`. `scenes/World` extends `WorldCreator`, which
extends `WorldLayers`, which extends `BasicScene` (a `Phaser.Scene`).
- `WorldLayers.init` creates the display layers, `ParticleManager`, `GameKeys` (`this.keys`) and
  `PanelManager`.
- `WorldCreator.create` creates `this.player` and `this.levels`. It also builds levels (`createLevel`
  switches on each object's `id`), handles the camera (`setCameraOnPlayer`, `cameraLogic`) and provides
  collision helpers (raycasts, `checkPlayerDeathBy*`, `applyForce*`).
- `World` holds the game state (`GameStates`: Loading, Playing, MainMenu, Skins, Pause). It also swaps
  "subscenes", which are UI/controller objects inside the one scene (`subscenes/`: Menu, Hub, Act, Tower,
  Vex, SkinsRarity, SkinsSelect), through `showSubSceneTransition(SubSceneList.X, levelId, hard)`.

**Game loop and timing.** `World.update` calls `WorldCreator.updateLogic`, which calls `player.update()` and
then every block, obstacle, particle and item. Physics is custom (SAT polygons: the player has head, body,
hands and feet polygons; velocities are per frame) and advances **one fixed step per rendered frame, ignoring
delta**. `NativeChanges.addDelay(11)` makes Phaser skip frames that arrive less than 11 ms after the last
one. As a result the simulation rate depends on the display: about 60 steps/s at 60 Hz, about 72 at 144 Hz.
A networked version needs its own fixed timestep.

**Player and input.** `entities/Player` extends `PlayerBase`, which extends `Entity`. It has a spine skeleton
`"player"` (skins from `BalanceData.currSkin`), `xPos`/`yPos`, `xVelocity`/`yVelocity`, `state`
(`PlayerState`: Stand, Running, Jumping, ... 24 values), `facing` and `alive`. Input is centralised:
`input/GameKeys` maps arrows/WASD/space (and the mobile stick and buttons) to `KeyPressed` (`l`, `r`, `u`,
`d`, `punch`). It then calls `scene.player.keyPressed(key, isDown)`, and the player polls
`this.keys.isKeyPressed(k)`. The rest of the code assumes a single player: about 80 references to
`this.player` or `scene.player`.

**Levels.** `assets/jsons/levels.json` has acts `"1"`–`"10"`, `hub`, `tower` and `config` (balance values).
Each act has `bgc` (background colour), target coins/deaths (`tc`, `td`, `htc`, `htd`) and `data` /
`dataHard` arrays of objects `{ id, x, y, ...props }` (84 ids). `tower` is `[difficulty][pattern]`, and
patterns are stacked at random while climbing. To add an object type, add a `case` to
`WorldCreator.createLevel` and a class under `objects/`.

**Entities.** `entities/Entity` is the base class. `objects/blocks/Block`, `objects/obstacles/Obstacle` and
`objects/items/Item` are the three families the world iterates, plus wires, ropes, poles, ziplines, pools
and slopes. The tower enemies live in `objects/tower/`.

**UI and persistence.** Panels are in `ui/panels` (`PanelManager.show(PanelList.X)`), the HUD in `ui/hud`,
and buttons in `ui/buttons`. The `jd/` folder holds display-object wrappers (`JDImage`, `JDText`,
`JDSpineGameObject`, ...). Progress is saved to `localStorage["vex7_sg"]` through `system/SaveGame`.
Achievements, daily tasks, skins and sound are also in `system/`.

## Gotchas

- `AzerionSDK.init` calls `preventDefault()` on every `keydown`/`keyup` on `window`, so browser shortcuts
  such as F5 don't work while the page has focus. HTML inputs added over the canvas won't receive text
  either, unless this is changed.
- Pressing **T** in the world calls `finishLevel()`. It is a debug shortcut left in the shipped game.
- `data/Constants.IS_EDITOR` and `Levels.loadLevelEdit` are leftovers of the original level editor.
- `index.html` references `assets/icon.png` and the CSS references `rotate.png`, but neither exists in the
  original build.
- The h5branding vendor was patched by the site that rehosted the build: its logo is
  `patch/images/games235-banner.png`, and a click calls `op3n()` (now a no-op in `patch/js/gd-sdk.js`).
