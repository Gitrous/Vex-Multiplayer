# Vex Multiplayer

Vex 7 (HTML5, Phaser 3.55.2, originally TypeScript, published by Azerion) recovered from its
shipped single-file build into an editable source tree. The goal of the project is to add
multiplayer for up to 10 players per room. Players in a room see each other live, start from the main
menu together and race through acts, and can turn on collisions to push each other and stand on each
other's heads. See "Multiplayer" below.

## Commands

```bash
npm install            # ws (server) + tooling: esbuild, babel, prettier, playwright-core
npm run dev            # build + watch + multiplayer server at http://localhost:8080 (PORT=... to change)
npm start              # multiplayer server only (serves dist/ as built)
npm run build          # dist/vex7.js + source map (readable)
npm run build:release  # dist/vex7.js minified
npm test               # headless smoke test of dist/vex7.js (build first)
npm run test:mp        # 4 headless players (room limit 4 here): lobby, hub, race, spectating, results;
                       # a 5th rejected (~10 min)
npm run test:collisions # 2 headless players: pass through, tick "Colisiones", push, stand on/ride a head (~2 min)
npm run test:crowd     # 1 browser + 9 bot clients: a full room of 10 drawn in the hub (~1 min)
npm run test:chat      # 2-3 headless players: type with Enter without moving, log + bubble, history (~2 min)
npm run test:server    # room flow unit tests + the real server with 10 WebSocket clients, seconds
npm run test:original  # same test against reference/vex7.min.js
npm run format         # prettier (printWidth 120) over src/game and tools
```

In Claude Code on the web, `.claude/hooks/session-start.sh` runs `npm install` and `npm run build` when a
session starts.

In GitHub Codespaces, `.devcontainer/devcontainer.json` runs `.devcontainer/update-and-serve.sh` on every
attach (opening or refreshing the Codespace). The script fast-forwards to the repo's default branch, or to
`VEX_BRANCH`. It skips the update when there are uncommitted edits or unpushed commits. It then runs
`npm install` when the dependencies changed, builds, and restarts `server/server.mjs` in the background
(`setsid nohup`, PID in `/tmp/vex-server.pid`, log in `/tmp/vex-server.log`). A `flock` stops two attaches
from overlapping, and the server must not inherit that lock's file descriptor (`9>&-`).

`npm run split` regenerates `src/game` and `src/vendor` from `reference/vex7.min.js` and
**discards every edit made there**. It was a one-off recovery step; don't run it on purpose.

After changing anything under `src/`, run `npm run build && npm test`. The test boots the game in
Chromium, waits for the main menu, enters the hub, walks and jumps, fails on any uncaught page
error, reports external requests, and saves screenshots to `test-results/`. Headless WebGL is
software-rendered and slow, so a run takes about a minute. After changing `src/game/multiplayer/` or
`server/`, also run `npm run test:server`, `npm run test:collisions`, `npm run test:crowd`,
`npm run test:chat` and `npm run test:mp`.

## Publishing changes

`main` is the branch the Codespace follows. After every commit pushed to a working branch, also push it to
`main` (`git push origin HEAD:main`, a fast-forward), so it reaches the Codespace on its next open or refresh.

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
- `server/server.mjs`: the multiplayer server. It serves the static files (an allowlist: `index.html`,
  `version.js`, `assets/`, `dist/`, `patch/`, `reference/`, `src/`) and the WebSocket at `/mp`.
  `server/room.mjs` is one room's game flow (lobby, races), unit-tested in `server/room.test.mjs`;
  `server/server.test.mjs` runs the real server with 10 WebSocket clients, and checks that a bad or oversized
  message only drops that client (every socket has an `error` listener; message handling is wrapped in try/catch).
- `src/game/multiplayer/`: the multiplayer client. `protocol.js` is shared with the server.
- `tools/`: `build.mjs`, `smoke-test.mjs`, `multiplayer-test.mjs`, `split-bundle.mjs`, and `lib/harness.mjs` for the
  shared test helpers (it exposes the game as `window.__vexGame` without touching game code).

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
hands and feet polygons; velocities are per step) and moves a fixed amount per `updateLogic` call, ignoring
delta. The original game called it once per rendered frame, so below 60 fps everything ran in slow motion
(players reported it as "the game goes slow after equipping a skin"). `World.logicSteps` now runs extra
steps on late frames to keep about 60 steps/s, at most 4 per frame (full speed down to about 20 fps). It
always runs at least one step per frame, so fast displays behave as before. `NativeChanges.addDelay(11)`
still drops frames that arrive less than 11 ms after the last one (about 72 steps/s at 144 Hz, as in the
original).

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

## Multiplayer

Every client runs the whole game and is the authority for its own player; the server relays state and
coordinates the room's flow. This keeps the single-player code almost untouched and makes the
frame-rate-dependent physics a non-issue, at the cost of no shared world: players don't share objects, and
collisions (optional) are resolved by each client for its own player.

- **Server** (`server/server.mjs`, `server/room.mjs`): rooms by code, created on first join, removed when
  empty, at most `MAX_PLAYERS` (10; `startServer({maxPlayers})` overrides it, the 4-browser test uses 4). A client sends `hello {room, name}` and gets `welcome {id, slot, players}`
  or `full` (the socket is then closed with code 4000). The slot (0-9) picks the player's colour (`PLAYER_COLORS`, ten). Snapshots
  are filtered to `SNAPSHOT_KEYS`, rate-limited and relayed to the rest of the room. The last one is kept for
  newcomers. After every flow change the room broadcasts `room {phase, players: [{id, ready, loc}], race}`.
  All messages are listed in `src/game/multiplayer/protocol.js`.
- **Room flow:**
  - **Lobby.** Everybody starts in the main menu and sees the others there. PLAY (the button, or landing on
    the PLAY block) sends `ready`. When every player is ready, the server sends `go` and all of them enter
    the hub together. Later, PLAY goes straight to the hub. If everybody returns to the menu, the room is a
    lobby again.
  - **Race gathering.** Entering an act sends `enterAct`. The first player to do so picks the race's act, and
    everybody is sent to that act (`loadAct`), whatever they asked for. In a race the "level objectives"
    panel is pressed automatically. The player is frozen with `World.pauseWorld` once spawned and sends
    `atStart`.
  - **Countdown.** When every player in the hub, and everybody who entered, is at the start, the server sends
    `countdown {ms: 3000}`. Each client resumes at the same moment, and the HUD timer restarts.
  - **Finish.** `World.finishLevel` reports `finish {ms, deaths}` (time since the start) and the player
    becomes inactive, while the world keeps running. Meanwhile the player spectates (`Spectator`): the
    camera follows a player still racing, and ←/→ (A/D) or the arrows in the bottom bar switch between the
    players visible in the level. Places are ranked by time. The race ends only when every participant has
    finished or quit. Leaving the race's act any way you like (`RoomFlow.leaveRace`) is a `quitRace` (DNF)
    and frees the player: that includes pause → "Exit", which calls `backFromSubSkin` and goes back to the
    previous level, and is turned into a trip to the hub even when that level is an act. A disconnect also
    counts as quitting (a DNF under the name the player had). Then `raceOver` shows the results for 5 s,
    and the game's level-complete panel opens.
  - **Collisions.** A room setting, off by default. Any player can toggle it with the "Colisiones (empujar)"
    checkbox in the room panel, which sends `settings {collisions}`. Each client handles its own player
    (`Collisions`):
    - **Standing on others.** Every other player's ghost carries a `HeadPlatform`, a real game `Block` (16×8,
      top at the head, side wall polygons moved out of reach). `Collisions` wraps `world.player.update`
      and pushes the platforms into `world.blocks` only for that call. The game's own block physics then
      lets the player land on a head, jump off it, and be carried along (the platform's per-frame move is
      applied to a player standing on it), while lasers, bullets, particles and the rest never see them.
    - **Pushing.** `Collisions.resolve` runs right after the game logic (`World.update` →
      `multiplayer.afterLogic()`). A player moving into a ghost's body box (±8 × 33) stays in contact at its
      side, keeping its speed and run animation. Every 100 ms it sends `push {to, x: velocity}`. The server
      relays it as `pushed`, and for 160 ms that player's client sets its player's velocity to at least
      the pusher's, before `Player.update`, so walls still stop it.
    - **Spawn grace.** Collisions are off for 1.5 s after a race's GO, while everybody is still stacked on
      the spawn point.
    - **Lag.** Contact happens with the ghost, which is 120 ms behind.
  - **Chat.** `chat {text}` (≤ 140 characters, cleaned by `protocol.sanitizeChat`) is broadcast to the whole
    room, sender included, as `chat {id, name, slot, text, at}`. The server keeps the last 30 lines and sends
    them in `welcome.chat`. A token bucket (5 messages, one more per second) answers floods with `chatSlow`.
  - **Busy and solo.** While a race counts down or runs, others entering acts get `raceBusy` and play that
    act on their own. Solo players in acts don't hold up the next race. Alone in a room, acts work as in
    the original game.
- **Client** (`src/game/multiplayer/`):
  - **Hooks.** `World.create` calls `Multiplayer.attach(world, GameStates)`, and `World.update` calls
    `multiplayer.update()` every frame. `World.showSubSceneTransition` and `World.finishLevel` first ask
    `multiplayer.flow` (`RoomFlow`), which may take over. The flow calls the originals itself with
    `runBypassed`.
  - **Snapshots.** The local player's snapshot is sent 15 times a second.
  - **`RemotePlayer`.** A second `"player"` spine skeleton in `world.layerPlayer`, with a coloured name
    label (labels that would overlap are stacked upwards, `stackLabels`). It is interpolated 120 ms in the past and visible only in the same level. Not in the tower, whose
    patterns are random per client.
  - **`Collisions`.** See Room flow above.
  - **`Chat`.** A DOM box at the bottom right. Enter (capture-phase listener, only when no text field has
    focus and the "level objectives" panel, which starts an act with Enter, isn't open) or the 💬 button opens it. While it's open, `world.input.keyboard.enabled` is false and the keys are
    reset, so typing WASD doesn't move the player. Enter sends, Escape or blur closes. New lines fade
    after 12 s, and opening the chat shows the history. Joins, leaves and renames appear as system lines.
    `RemotePlayer.say` shows the message as a bubble over that player's ghost (3 s + 60 ms per character, at most 7 s).
  - **`Spectator`.** Drives `world.cameraX/Y` (setters that move the camera group), easing toward the
    followed ghost. `World.update` skips `cameraLogic` while it is active.
  - **`MenuLayout`.** Maps menu positions between screen sizes: nearest menu block, fraction of its width,
    and offset from its top.
  - **`Overlay`.** The HTML panel (room, invite link, join by code or pasted link, players with
    level/lobby/race status, rename), the banner (waiting messages, countdown, results) and the spectator
    bar. It uses `window.prompt` for text, because the game calls `preventDefault` on every key.
  - **`Connection`.** Reconnects with backoff. A reconnect joins as a new player: the race it was in
    counts it as gone.
- **URL parameters:** `?room=<code>` (one is generated and put in the URL if missing), `?name=`,
  `?server=<ws url>` (default: same host, `/mp`), `?mp=0` for offline. Names persist in
  `localStorage["vexmp_name"]`. When the page isn't served over http(s), multiplayer is off.
  In multiplayer, the **T** debug shortcut is disabled.
- **Debugging:** `window.__vexMultiplayer` (`.self`, `.remotes`, `.flow.room`, `.flow.race`, `.spectator`,
  `.collisions`, `.chat`, `.overlay`).
- **Not done yet:** shared deaths or objects, a shared tower, a room browser, and a strict fixed timestep (the game still runs ≥ 1 step per rendered frame). The host also
  needs Node: static hosting such as GitHub Pages can't run the server.

## Gotchas

- `AzerionSDK.init` calls `preventDefault()` on every `keydown`/`keyup` on `window`, so browser shortcuts
  such as F5 don't work while the page has focus. It skips events aimed at an input, textarea or
  contentEditable element (added for the chat), so HTML text fields work.
- Pressing **T** in the world calls `finishLevel()`. It is a debug shortcut left in the shipped game (only
  registered when multiplayer is off).
- `data/Constants.IS_EDITOR` and `Levels.loadLevelEdit` are leftovers of the original level editor.
- `index.html` references `assets/icon.png` and the CSS references `rotate.png`, but neither exists in the
  original build.
- The h5branding vendor was patched by the site that rehosted the build: its logo is
  `patch/images/games235-banner.png`, and a click calls `op3n()` (now a no-op in `patch/js/gd-sdk.js`).
