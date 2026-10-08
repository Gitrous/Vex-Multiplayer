// Client side of the room's game flow (server/room.mjs):
//
// - PLAY in the main menu doesn't start the hub: it marks the player ready, and the hub
//   starts for everybody when the server says "go".
// - Entering an act (hub act blocks, "next level") asks the server, which answers with the
//   race's act. After spawning there the player is frozen (World.pauseWorld) until the
//   countdown ends; then everybody starts at once.
// - Reaching the finish portal reports the time and waits until every participant has
//   finished, spectating the others meanwhile (Spectator). Then the results are shown
//   and the game's own level-complete panel opens.
//
// The World calls interceptTransition() from showSubSceneTransition and interceptFinish()
// from finishLevel; either returns true when it took over.
"use strict";

var SubSceneList_1 = require("../subscenes/SubSceneList");
var system_1 = require("../system");
var Overlay_1 = require("./Overlay");

var PanelManager_1 = require("../ui/panels/PanelManager");

var PANEL_LEVEL_OBJECTIVES = PanelManager_1.PanelList.PanelLevelObjectives;
var RESULTS_MS = 5000;
var BUSY_MS = 3000;

function formatTime(ms) {
  var s = ms / 1000;
  var m = Math.floor(s / 60);
  s -= m * 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1);
}

class RoomFlow {
  constructor(mp) {
    this.mp = mp; // Multiplayer: world, connection, overlay, names
    this.world = mp.world;
    this.room = null; // last { phase, players, race } from the server
    this.bypass = false; // true while we call the World's own transition/finish
    this.lastLoc = null;
    this.readySent = false;
    this.pendingLoad = null; // { act, hard } to load once no transition is running
    this.requested = null; // { sub, levelNum, hard } of the last enterAct: played solo if a race is busy
    this.race = null; // local race state: { act, hard, frozen, goAt, startedAt, finished, results }
    this.notice = null; // { text, until }
  }

  get online() {
    return this.mp.connection.open && !!this.mp.self;
  }

  loc() {
    var S = SubSceneList_1.SubSceneList;
    var sub = this.world.currSubScene;
    if (sub === S.Menu) return "menu";
    if (sub === S.Hub) return "hub";
    if (sub === S.Act || sub === S.Vex) return "act";
    return "other";
  }

  inRaceAct() {
    var w = this.world;
    var r = this.race;
    return !!r && this.loc() === "act" && "" + w.currLevelID === r.act && !!w.isCurrLevelHard === !!r.hard;
  }

  // Resets per connection (the server forgets us when the socket closes).
  reset() {
    this.room = null;
    this.lastLoc = null;
    this.readySent = false;
    this.pendingLoad = null;
    this.requested = null;
    if (this.race && this.race.frozen) this.world.resumeWorld();
    this.race = null;
    this.mp.spectator.stop();
  }

  interceptTransition(sub, levelNum, hard) {
    if (this.bypass || !this.online) return false;
    var S = SubSceneList_1.SubSceneList;
    var isAct = sub === S.Act || sub === S.Vex;
    // Leaving the race's act through the game's own menus. Pause → "Exit" goes back to the
    // previous level, which is another act when the race was entered from one: abandon the
    // race and go to the hub instead of asking to enter that act.
    if (isAct && this.race && this.loc() === "act" && !this.pendingLoad) {
      this.leaveRace();
      this.runBypassed(() => this.world.showSubSceneTransition(S.Hub));
      return true;
    }
    if (sub === S.Hub && this.loc() === "menu") {
      this.readySent = true;
      this.mp.connection.send({ t: "ready" });
      return true;
    }
    // Alone in the room, acts work as in the original game: no countdown, no results.
    if (isAct && this.room && this.room.phase === "playing" && this.room.players.length > 1) {
      this.requested = { sub: sub, levelNum: levelNum, hard: hard };
      this.mp.connection.send({ t: "enterAct", act: "" + levelNum, hard: !!hard });
      return true;
    }
    return false;
  }

  interceptFinish() {
    if (this.bypass || !this.race) return false;
    var r = this.race;
    if (r.finished) return true;
    if (!r.startedAt || !this.inRaceAct()) return false;
    r.finished = true;
    r.finishMs = performance.now() - r.startedAt;
    this.mp.connection.send({ t: "finish", ms: Math.round(r.finishMs), deaths: this.world.currentDeaths || 0 });
    // The world keeps running (obstacles move while spectating). The finish portal already
    // made the player inactive; make sure of it however finishLevel was reached.
    this.world.player.alive = false;
    this.world.keys.resetKeys();
    this.mp.spectator.start();
    return true;
  }

  // The player left the race's act: a DNF unless already finished. Either way the player is
  // free now (no more waiting banner or spectating); the results still show when it ends.
  leaveRace() {
    var r = this.race;
    if (!r) return;
    this.race = null;
    if (!r.finished) {
      this.mp.connection.send({ t: "quitRace" });
      this.notice = { text: "Has abandonado la carrera", until: performance.now() + BUSY_MS };
    }
    if (r.frozen) this.world.resumeWorld();
    this.mp.spectator.stop();
  }

  // In this race's act, from the start until the player finishes (frozen at the start too).
  isRacingHere() {
    return !!this.race && !this.race.finished && this.inRaceAct();
  }

  // World.resetLevel (R, pause → "retry"). In a race it sends the player back to the start but
  // keeps the race clock (and the HUD timer) and the deaths: a restart can't be used to cut
  // either. Frozen at the start, or finished and watching the others, there is nothing to restart.
  interceptReset() {
    if (this.bypass || !this.race || !this.inRaceAct()) return false;
    if (!this.race.startedAt || this.race.finished) return true;
    var w = this.world;
    var deaths = w.currentDeaths;
    this.runBypassed(() => w.resetLevel(false));
    w.currentDeaths = deaths;
    w.subScene.updateDeaths(deaths);
    return true;
  }

  runBypassed(fn) {
    this.bypass = true;
    try {
      fn();
    } finally {
      this.bypass = false;
    }
  }

  onMessage(msg) {
    var S = SubSceneList_1.SubSceneList;
    switch (msg.t) {
      case "room":
        this.room = msg;
        break;
      case "go":
        this.readySent = false;
        if (this.loc() === "menu") this.runBypassed(() => this.world.showSubSceneTransition(S.Hub));
        break;
      case "loadAct":
        this.requested = null;
        this.race = { act: msg.act, hard: msg.hard, frozen: false, goAt: 0, startedAt: 0, finished: false };
        this.pendingLoad = { act: msg.act, hard: msg.hard };
        break;
      case "raceBusy": {
        // Not part of the race under way: play the act on your own instead of waiting.
        var req = this.requested;
        this.requested = null;
        this.notice = {
          text: "Hay una carrera en curso: juegas este acto por tu cuenta",
          until: performance.now() + BUSY_MS,
        };
        var where = this.loc();
        if (req && (where === "hub" || where === "act") && !this.world.transition.visible) {
          this.runBypassed(() => this.world.showSubSceneTransition(req.sub, req.levelNum, req.hard));
        }
        break;
      }
      case "countdown":
        if (this.race && this.race.frozen) this.race.goAt = performance.now() + msg.ms;
        break;
      case "raceOver":
        this.onRaceOver(msg);
        break;
    }
  }

  onRaceOver(msg) {
    var r = this.race;
    this.lastResults = msg.results; // kept after the banner goes (debugging, tests)
    this.notice = { results: msg.results, act: msg.act, hard: msg.hard, until: performance.now() + RESULTS_MS };
    this.race = null;
    this.mp.spectator.stop();
    if (r && r.finished) {
      // Now the game's own "level complete" panel (saves progress; its buttons lead on).
      setTimeout(() => {
        if (this.inRaceActFor(r)) this.runBypassed(() => this.world.finishLevel());
      }, RESULTS_MS);
    } else if (r && r.frozen) {
      this.world.resumeWorld();
    }
  }

  inRaceActFor(r) {
    var w = this.world;
    return this.loc() === "act" && "" + w.currLevelID === r.act && !!w.isCurrLevelHard === !!r.hard;
  }

  // Every frame, from Multiplayer.update.
  update(now) {
    var w = this.world;
    var GameStates = this.mp.GameStates;
    var loc = this.loc();
    if (this.online && loc !== this.lastLoc) {
      if (this.race && this.lastLoc === "act" && !this.pendingLoad) this.leaveRace();
      this.lastLoc = loc;
      this.mp.connection.send({ t: "loc", loc: loc });
      this.mp.spectator.stop();
    }

    if (this.pendingLoad && !w.transition.visible && (loc === "hub" || loc === "act")) {
      var load = this.pendingLoad;
      this.pendingLoad = null;
      var S = SubSceneList_1.SubSceneList;
      var sub = load.act === system_1.BalanceData.vexID ? S.Vex : S.Act;
      this.runBypassed(() => w.showSubSceneTransition(sub, Number(load.act), load.hard));
    }

    var r = this.race;
    if (r && !r.frozen && !r.startedAt && !this.pendingLoad && this.inRaceAct()) {
      // Acts open with the "level objectives" panel, and the player only spawns after its
      // PLAY. In a race the countdown is the start signal, so press it right away.
      var panels = w.panelManager;
      if (panels.currentPanel === PANEL_LEVEL_OBJECTIVES && panels.stock[PANEL_LEVEL_OBJECTIVES]) {
        panels.stock[PANEL_LEVEL_OBJECTIVES].play();
      }
      // Spawned at the start: freeze until the countdown ends.
      if (w.state === GameStates.Playing && !w.transition.visible && w.player.alive) {
        w.pauseWorld();
        r.frozen = true;
        this.mp.connection.send({ t: "atStart" });
      }
    }
    if (r && r.frozen && r.goAt && now >= r.goAt) {
      r.frozen = false;
      r.goAt = 0;
      r.startedAt = now;
      w.resumeWorld();
      system_1.BalanceData.actStartTime = Date.now(); // the HUD timer counts the race
      this.mp.collisions.startGrace(now);
      this.notice = { text: "¡YA!", big: true, until: now + 800 };
    }
    this.mp.spectator.update((id) => this.isRacing(id));
    this.renderBanner(now);
  }

  // Taking part in the current race and not finished (or quit) yet.
  isRacing(id) {
    var sr = this.room && this.room.race;
    return !!sr && sr.participants.indexOf(id) >= 0 && !sr.finished.some((f) => f.id === id);
  }

  name(id) {
    return this.mp.nameOf(id);
  }

  renderBanner(now) {
    var overlay = this.mp.overlay;
    var n = this.notice;
    if (n && now > n.until) n = this.notice = null;
    if (n && n.results) {
      var lines = n.results.map(function (res, i) {
        return res.dnf
          ? "–  " + res.name + "  abandonó"
          : res.place +
              "º  " +
              res.name +
              "  " +
              formatTime(res.ms) +
              (res.deaths ? "  (" + res.deaths + " muertes)" : "");
      });
      overlay.setBanner("Resultados — " + Overlay_1.levelLabel(n.act + (n.hard ? ":h" : "")), lines);
      return;
    }
    if (n) {
      overlay.setBanner(n.text, null, n.big);
      return;
    }
    if (!this.online || !this.room) {
      overlay.setBanner(null);
      return;
    }
    var room = this.room;
    var total = room.players.length;
    var loc = this.loc();
    var r = this.race;
    var sr = room.race;
    if (r && r.goAt) {
      overlay.setBanner("" + Math.max(1, Math.ceil((r.goAt - now) / 1000)), null, true);
    } else if (r && r.finished && sr) {
      var mine = sr.finished.find((f) => f.id === this.mp.self.id);
      var waiting = sr.participants.filter((id) => !sr.finished.some((f) => f.id === id)).map((id) => this.name(id));
      overlay.setBanner(
        (mine ? "¡Has llegado! " + formatTime(mine.ms) + " (" + mine.place + "º por ahora)" : "¡Has llegado!") +
          (waiting.length ? " — esperando a " + waiting.join(", ") : ""),
      );
    } else if (r && r.frozen && sr && sr.state === "gathering") {
      // Same rule as the server: players in the hub and those who entered (not solo players in acts).
      var missing = room.players.filter(
        (p) => (p.loc === "hub" || sr.entered.indexOf(p.id) >= 0) && sr.atStart.indexOf(p.id) < 0,
      );
      overlay.setBanner(
        "En la salida — esperando a " +
          (missing.map((p) => this.name(p.id)).join(", ") || "los demás") +
          " (" +
          sr.atStart.length +
          "/" +
          (sr.atStart.length + missing.length) +
          ")",
      );
    } else if (loc === "menu" && room.phase === "lobby" && total > 1) {
      var ready = room.players.filter((p) => p.ready).length;
      overlay.setBanner(
        this.readySent
          ? "Esperando a que todos pulsen JUGAR (" + ready + "/" + total + ")"
          : "Pulsad JUGAR para empezar juntos (" + ready + "/" + total + " listos)",
      );
    } else if (loc === "hub" && sr && sr.state === "gathering") {
      overlay.setBanner(
        "Carrera en " +
          Overlay_1.levelLabel(sr.act + (sr.hard ? ":h" : "")) +
          ": entra en un acto para unirte (" +
          sr.atStart.length +
          " en la salida)",
      );
    } else if (loc === "hub" && sr) {
      overlay.setBanner("Carrera en curso en " + Overlay_1.levelLabel(sr.act + (sr.hard ? ":h" : "")));
    } else {
      overlay.setBanner(null);
    }
  }

  // Short status for a player in the overlay list, or null to show their level.
  statusOf(id) {
    var room = this.room;
    if (!room) return null;
    var p = room.players.find((x) => x.id === id);
    if (!p) return null;
    var sr = room.race;
    if (sr) {
      var f = sr.finished.find((x) => x.id === id);
      if (f) return f.dnf ? "abandonó" : f.place + "º " + formatTime(f.ms);
      if (sr.participants.indexOf(id) >= 0) return sr.state === "countdown" ? "en la salida" : "corriendo";
      if (sr.atStart.indexOf(id) >= 0) return "en la salida";
      if (sr.entered.indexOf(id) >= 0) return "entrando…";
    }
    if (room.phase === "lobby" && p.loc === "menu") return p.ready ? "listo ✓" : "en el menú";
    return null;
  }
}

exports.RoomFlow = RoomFlow;
exports.formatTime = formatTime;
