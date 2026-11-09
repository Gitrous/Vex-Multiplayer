# Code map

Quick index of where things live, so a change can go straight to the right file without re-reading the
whole tree. `CLAUDE.md` explains the architecture; this file says **where**. Line numbers are approximate
(measured at commit `dd7826c`): confirm with `grep -n "name" file` before relying on them. Method names
are stable, line numbers are not.

All game files are ES5-style CommonJS (`X.prototype.method = function`), minified parameter names (`t`, `e`,
`i`). Multiplayer files in `src/game/multiplayer/` and `server/` are modern JS (classes). Always run
`npm run build && npm test` after touching `src/`.

## "I want to change…" → go here

| Change | File → place |
| --- | --- |
| Room limit, colours, snapshot fields, rate, countdown ms | `src/game/multiplayer/protocol.js` (shared with server) |
| A new network message | `protocol.js` (doc comment), `server/room.mjs` `Room.handle`, client `Multiplayer.onMessage` / `RoomFlow.onMessage` |
| Race flow: ready, go, enterAct, countdown, finish, DNF, results | server `server/room.mjs` (`handle`, `checkAll`, `endRace`, `rank`) + client `multiplayer/RoomFlow.js` |
| Room panel, banner, spectator bar, invite link | `multiplayer/Overlay.js` (HTML, not Phaser) |
| Chat | `multiplayer/Chat.js` (client), `server/room.mjs` (`chat` case), `protocol.sanitizeChat` |
| Pushing, standing on heads, air-gust knockback | `multiplayer/Collisions.js` |
| How other players look/move (ghost, name label, bubble, gust) | `multiplayer/RemotePlayer.js` |
| What is sent about the local player 15×/s | `Multiplayer.snapshot` (+ `SNAPSHOT_KEYS` in `protocol.js`, server `cleanSnapshot`) |
| Camera while spectating after finishing | `multiplayer/Spectator.js` |
| Menu position mapping between screen sizes | `multiplayer/MenuLayout.js` |
| Player movement, jump, physics, states | `entities/Player.js` (big: ~1960 lines), `PlayerBase.js` |
| Keyboard / touch controls | `input/GameKeys.js` → `player.keyPressed` |
| A level object (block, spike, item) behaviour | `objects/<family>/<Name>.js`; created in `WorldCreator.createLevel` |
| Add a new level object type | class under `objects/` + export in the family's `index.js` + `case "id"` in `WorldCreator.createLevel` |
| Level layout data | `assets/jsons/levels.json` (acts `"1"`–`"10"`, `hub`, `tower`, `config`) |
| Balance numbers, hub id, skins owned, progress | `system/BalanceData.js`, `assets/jsons/balance.json`, `system/SaveGame.js` (`localStorage["vex7_sg"]`) |
| Death handling | `WorldLayers.playerDeath` (~191), `Player.kill` |
| Finishing a level / level-complete panel | `World.finishLevel` (~352) |
| Restart act (R key, pause → retry) | `World.restartAct` (~540), `RoomFlow.interceptReset` |
| Game speed / frame-rate compensation | `World.logicSteps` (~436), `lib/NativeChanges.js` (`addDelay`) |
| Camera follow / zoom | `WorldCreator.setCameraOnPlayer`, `cameraLogic`, `zoomTo`; getters in `WorldLayers` (`cameraX/Y/Zoom`) |
| Menu / hub / act / tower screens | `subscenes/SubMenu.js`, `SubHub.js`, `SubAct.js`, `SubTower.js`, `SubVex.js` |
| Pause, options, level-complete, trophies panels | `ui/panels/Panel*.js`, shown with `PanelManager.show(PanelList.X)` |
| HUD (timer, coins, level name) | `ui/hud/P*.js` |
| Texts / translations | `assets/jsons/locale_<lang>.json`, `system/Localization.js` |
| Sounds | `data/Sounds.js` (list), `system/SoundManager.js`, `assets/sounds/*.ogg` |
| Ads / SDK stubs | `sdk/*`, `patch/js/gd-sdk.js` (all ads complete immediately) |
| Static server, allowed paths, WebSocket upgrade | `server/server.mjs` (`serveStatic`, `startServer`) |
| Build | `tools/build.mjs` (esbuild → `dist/vex7.js`) |
| Codespaces auto-update | `.devcontainer/update-and-serve.sh` |

## Hooks of multiplayer into the game (the only game files that know about it)

All in `src/game/scenes/World.js`:

- `create` (~67–81): `Multiplayer.attach(this, GameStates)` → `this.multiplayer`. Without it (`?mp=0`, not http), the `T`
  debug key stays enabled.
- `showSubSceneTransition` (~97): `multiplayer.flow.interceptTransition`.
- `finishLevel` (~352): `multiplayer.flow.interceptFinish`.
- `update` (~458): `multiplayer.update()`, then after the logic steps `multiplayer.afterLogic()`; camera logic is skipped
  while `spectator.active`.
- `isRacing` (~555) and `restartAct` / `resetLevel` (~540–560): `flow.isRacingHere`, `flow.interceptReset`.
- `pauseWorld` / `resumeWorld` (~623–646): used to freeze players at the race start.

## Core game (src/game)

### scenes/ (inheritance: BasicScene → WorldLayers → WorldCreator → World)
- `BasicScene.js` (60 lines): Phaser.Scene wrapper: `init`, `create`, `resize`, `destroy`.
- `WorldLayers.js` (377): `init` (layers, `ParticleManager`, `GameKeys`, `PanelManager`), parallax background,
  `playerDeath`, `inCameraView`, `cameraX/Y/Zoom` getters, screen-size helpers (`getGameWidth`…).
- `WorldCreator.js` (867): `create`, `loadLevels`, `createLevel` (147–592, one `case "<id>"` per object type, pushes into
  `this.blocks` / `obstacles` / `items`…), `createLevelPlayerSpawn`, `destroyLevel`, `updateLogic` (calls
  `player.update`, then everything else), camera (`setCameraOnPlayer`, `cameraLogic`, `zoomTo`), raycasts
  (`raycastTo*`), hit checks (`checkPlayerDeathBy*`), forces (`applyForce*`), tower wall helpers.
- `World.js` (709): game states (`GameStates`), subscene switching (`showSubSceneTransition`, `showSubHub`,
  `showSubAct`, `showSubTower`, `showSubMenu`, `showSubVex`), tower generation (`addNextRandomTower`,
  `createNextPattern`), `finishLevel`, `collectCoin`, `checkpointTriggered`, `logicSteps`, `update`, `restartAct`,
  `resetLevel`, pause/resume, target objectives (coins/deaths).
- `Boot.js`: preloads everything listed in `data/*`, then starts `world`.

### entities/
- `Entity.js`: base (`update`, `reset`, `resetLevel`, `levelStart`, `destroy`, debug drawing).
- `PlayerBase.js` (608): spine skeleton, state infos, hit-box polygons (`createStateInfos`, `updateHitBoxesPos`),
  facing, `setSkin`, `landActiveBlock`, `update`.
- `Player.js` (1959): `spawn`, state setters (`setStand`, `setRun`, `setJump`, `setSwim`, …), `jump`, `land`,
  `checkBlocks` (561), `checkSlopeCollisions` (823), `checkKeyboard` (909), crouch/zipline/pole/pool/rope checks,
  `kill`, `applyForce`, `keyPressed` (1439), `update` (1534, the main per-step method), grapple, cannon, finish
  and item collisions (`collideWith*`).
- `PlayerWindGust.js`: air gust (space), used by `RemotePlayer` too. `PlayerGib`, `PlayerBreatheBar`,
  `PlayerJumpPotion`, `AppearingText`: effects around the player.

### objects/ (84 level-object types, `spawn(props)` each; ids → classes in `WorldCreator.createLevel`)
- `blocks/`: `Block` base; Basic, Vertical, Horizontal, Falling, Bounce, Push, Ice, Glass, Speed, Spark, Solar, Invis*,
  Explosive, BlockedWall, ActBlock/ActTower (doors to acts), SkinsBlock, LockBlock, SwimmingPool, Slope, Elevator*,
  Appearing, BlockSpike, VexTNT, Pulse, HoverPlatform. `index.js` is the barrel.
- `obstacles/`: `Obstacle` base; Spike (1x–30x), Buzzsaw variants, FallingSpike, Shurikan*, ClassicLaser*, LaserPoint,
  Quadrant, Reaper, SurveillanceCamera, MissileLauncher, Bullet*, Spark.
- `items/`: `Item` base; Coin, Checkpoint(Home), Key/TimedKey, Torch, CircularCannon, LightSwitch, WindBlaster,
  BreatheBlaster, FinishPortal, Portal, Kite, Grapple*, JumpPotion, LeverPulse, SkinSpin, Fade*.
- `wires/`: Wire, Rope, Pole, ZiplinePole/Wire, HazardStrips, Cable. `tower/`: breakable blocks, Gate, enemies
  (Android, AndroidAdvanced, Drone, BatteringRam), TowerWall.

### subscenes/ (UI/controllers inside the single `world` scene)
`SubMenu` (329), `SubHub`, `SubAct`, `SubTower`, `SubVex`, `SubSkinsRarity`, `SubSkinsSelect`; bases `BasicSubScene`,
`BasicSubGamePlay`, `BasicSubSkins`; ids in `SubSceneList`.

### ui/
`panels/` (PanelManager + 16 panels, ids in `PanelList`), `hud/` (P* widgets), `buttons/`, `widgets/` (mobile stick/button,
daily-task widgets). `jd/` holds display wrappers (`JDImage`, `JDText`, `JDSpineGameObject`, 9-slice, text input).

### system/
`SaveGame` (localStorage), `BalanceData` (global game state + config), `Achievements`, `DailyTask`, `SkinsData`,
`SoundManager`, `Localization`, `DetectNoBlood`, `TexturesEdit`.

### Other
`data/` asset lists + `Constants`; `effects/` particles and transitions; `render/` WebGL pipelines (blur, colour matrix);
`skins/` skin rarity UI; `levels/` level loading (`Levels.js`, `Level.js`); `utils/` (`Helpers`, `Tools`, `CustomResize`);
`sdk/` Azerion/ads/pause handlers; `lib/` Phaser shims (don't edit `phaser-bundled.min.js`); `src/vendor/` (don't edit).

## Multiplayer client (src/game/multiplayer/)

| File (lines) | Role | Main members |
| --- | --- | --- |
| `Multiplayer.js` (284) | Entry point; owns the others | `attach` (static), `onMessage`, `snapshot`, `update`, `afterLogic`, `addRemote`, `rename`, `localLevel`; `isSharedLevel` |
| `RoomFlow.js` (375) | Lobby/race state machine on the client | `interceptTransition`, `interceptFinish`, `interceptReset`, `leaveRace`, `runBypassed`, `onMessage`, `onRaceOver`, `update`, `renderBanner`, `statusOf` |
| `Collisions.js` (338) | Push, head platforms, gust hits | `wrapPlayerUpdate`, `beforePlayerUpdate`, `afterPlayerUpdate`, `checkGusts`, `carry`, `resolve`, `push`, `onPushed`, `busy`, `startGrace` |
| `RemotePlayer.js` (226) | Ghost of another player, interpolated 120 ms back | `push` (snapshot), `update`, `say` (bubble), `setName`, `advanceGust`, `destroy` |
| `Overlay.js` (221) | HTML room panel, banner, spectator bar | `render`, `setStatus`, `setBanner`, `setSpectator`, `setCollisions`, `joinByCode`, `copyLink` |
| `Chat.js` (157) | DOM chat box | `open`, `close`, `send`, `addLine`, `addSystem`, `setHistory` |
| `Connection.js` (69) | WebSocket with reconnect backoff | `connect`, `send`, `scheduleRetry` |
| `Spectator.js` (80) | Camera follows a racer after you finish | `start`, `stop`, `cycle`, `update` |
| `MenuLayout.js` (46) | Menu position mapping | `toMenu`, `fromMenu` |
| `protocol.js` (116) | Constants + message docs + sanitizers (shared with server) | `MAX_PLAYERS`, `PLAYER_COLORS`, `SNAPSHOT_KEYS`, `sanitizeChat/Room/Name` |

## Server (server/)

- `server.mjs` (~190): `startServer({maxPlayers, …})`, `serveStatic` (allowlist: `index.html`, `version.js`, `assets/`, `dist/`,
  `patch/`, `reference/`, `src/`), WebSocket at `/mp`, `cleanSnapshot`, `lanUrls`.
- `room.mjs` (327): `class Room`: `add`, `remove`, `handle(client, msg)` (all client→server messages), `checkAll`
  (starts countdown when everyone is at the start), `backToLobbyIfAllInMenu`, `rank`, `endRace`, `broadcast`, `info`, `state`.
- Tests: `room.test.mjs` (flow unit tests), `server.test.mjs` (real server, many clients).

## Tools and tests (tools/)

`build.mjs` (esbuild), `smoke-test.mjs` (`npm test`), `multiplayer-test.mjs` (4 players, ~10 min), `collision-test.mjs`,
`crowd-test.mjs` (15 players), `stacking-test.mjs`, `chat-test.mjs`, `lib/harness.mjs` (shared helpers, exposes
`window.__vexGame`), `split-bundle.mjs` (**destroys edits under `src/`**, never run it).

Which tests to run after a change: anything in `src/` → `npm run build && npm test`; `multiplayer/` or `server/` → also
`test:server`, `test:collisions`, `test:crowd`, `test:chat`, `test:stacking`, `test:mp`.

## Debug handles

`window.__vexMultiplayer` (`.self`, `.remotes`, `.flow.room`, `.flow.race`, `.spectator`, `.collisions`, `.chat`, `.overlay`),
`window.__vexGame` (tests only). URL: `?room=`, `?name=`, `?server=`, `?mp=0`, `?build=original`.
