// Online play for up to protocol.MAX_PLAYERS players per room.
//
// Every client runs the whole game on its own and is the authority for its own player.
// The local player's state is sent ~15 times per second; the other players in the room
// are drawn as RemotePlayers when they are in the same level. RoomFlow adds the shared
// flow on top: start from the main menu together, then race through acts. There is no
// physical interaction between players (no collisions, shared objects or shared deaths).
//
// URL parameters: ?room=<code> (created on first join; one is generated if missing),
// ?name=<name>, ?server=<ws url> (default: this host, path /mp), ?mp=0 to play offline.
"use strict";

var protocol = require("./protocol");
var Connection_1 = require("./Connection");
var RemotePlayer_1 = require("./RemotePlayer");
var Overlay_1 = require("./Overlay");
var RoomFlow_1 = require("./RoomFlow");
var MenuLayout = require("./MenuLayout");
var Spectator_1 = require("./Spectator");
var Collisions_1 = require("./Collisions");
var system_1 = require("../system");

var NAME_KEY = "vexmp_name";

// Levels where other players are drawn. The tower is stacked from random patterns, so
// ghosts there would float over different geometry. (The main menu is laid out per
// screen too; MenuLayout maps positions between layouts.)
function isSharedLevel(level) {
  return level.replace(/:h$/, "") !== system_1.BalanceData.towerID;
}

// With many players close together (up to 10 per room) the name labels would overlap:
// lift each label above any earlier one it would cover.
function stackLabels(labels) {
  labels.sort((a, b) => a.x - b.x || b.y - a.y);
  var placed = [];
  for (var label of labels) {
    var w = label.width;
    var h = label.height;
    for (var moved = true; moved;) {
      moved = false;
      for (var o of placed) {
        // Only ever upwards, so this ends (at most one move per placed label).
        if (Math.abs(o.x - label.x) < (o.width + w) / 2 + 2 && Math.abs(o.y - label.y) < h && o.y - h < label.y) {
          label.y = o.y - h;
          moved = true;
        }
      }
    }
    placed.push(label);
  }
}

function round(v, digits) {
  var f = Math.pow(10, digits);
  return Math.round(v * f) / f;
}

function storage(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
}

function readConfig() {
  var query = new URLSearchParams(location.search);
  if (query.get("mp") === "0") return null;
  var room = protocol.sanitizeRoom(query.get("room"));
  if (!room) {
    room = Math.random().toString(36).slice(2, 8);
    query.set("room", room);
    history.replaceState(null, "", location.pathname + "?" + query.toString() + location.hash);
  }
  var name = protocol.sanitizeName(query.get("name") || storage(NAME_KEY) || "");
  var server =
    query.get("server") || (location.protocol === "https:" ? "wss://" : "ws://") + location.host + protocol.PATH;
  return { room: room, name: name, server: server };
}

class Multiplayer {
  // Returns null when multiplayer is off (?mp=0) or the page isn't served over http(s).
  // gameStates: the World's GameStates enum (passed in to avoid a require cycle).
  static attach(world, gameStates) {
    if (!/^https?:$/.test(location.protocol)) return null;
    var config = readConfig();
    return config ? new Multiplayer(world, gameStates, config) : null;
  }

  constructor(world, gameStates, config) {
    this.world = world;
    this.GameStates = gameStates;
    this.config = config;
    this.self = null; // { id, slot, name } once welcomed
    this.remotes = new Map();
    this.lastSendAt = 0;
    this.lastOverlayAt = 0;
    this.sendIntervalMs = 1000 / protocol.SEND_RATE_HZ;
    this.flow = new RoomFlow_1.RoomFlow(this);
    this.mapPosition = (s) => (s.l === system_1.BalanceData.mainmenuID ? MenuLayout.fromMenu(world, s) : s);

    this.overlay = new Overlay_1.Overlay(config.room, { rename: (name) => this.rename(name) });
    this.spectator = new Spectator_1.Spectator(this);
    this.collisions = new Collisions_1.Collisions(this);
    this.overlay.onCollisions = (on) => this.connection.send({ t: "settings", collisions: on });
    this.connection = new Connection_1.Connection(config.server, {
      hello: () => ({ t: "hello", room: config.room, name: config.name }),
      onStatus: (status) => {
        if (status !== "online") {
          this.clearRemotes();
          this.flow.reset();
          this.self = null;
        }
        this.overlay.setStatus(status, this.fullMax);
        this.renderOverlay();
      },
      onMessage: (msg) => this.onMessage(msg),
    });
    // Debugging / tests: window.__vexMultiplayer.remotes, .self, ...
    window.__vexMultiplayer = this;
  }

  // Level key of the local player, or "" when not in a level.
  localLevel() {
    var w = this.world;
    var GameStates = this.GameStates;
    if (w.state === GameStates.Loading || w.state === GameStates.Skins || !w.currLevelID) return "";
    var id = "" + w.currLevelID;
    return /^\d+$/.test(id) && w.isCurrLevelHard ? id + ":h" : id;
  }

  onMessage(msg) {
    if (msg.t === "welcome") {
      this.clearRemotes();
      this.self = { id: msg.id, slot: msg.slot, name: msg.name };
      this.config.room = msg.room;
      for (var p of msg.players) this.addRemote(p);
      this.overlay.setStatus("online");
    } else if (msg.t === "joined") {
      this.addRemote(msg);
    } else if (msg.t === "left") {
      var gone = this.remotes.get(msg.id);
      if (gone) gone.destroy();
      this.remotes.delete(msg.id);
    } else if (msg.t === "renamed") {
      if (this.self && msg.id === this.self.id) this.self.name = msg.name;
      var r = this.remotes.get(msg.id);
      if (r) r.setName(msg.name);
    } else if (msg.t === "s") {
      var remote = this.remotes.get(msg.id);
      if (remote) remote.push(msg);
    } else if (msg.t === "pushed") {
      this.collisions.onPushed(msg);
    } else if (msg.t === "full") {
      this.fullMax = msg.max;
      this.overlay.setStatus("full", msg.max);
    } else {
      this.flow.onMessage(msg);
    }
    this.renderOverlay();
  }

  addRemote(info) {
    if (this.remotes.has(info.id)) return;
    this.remotes.set(info.id, new RemotePlayer_1.RemotePlayer(this.world, info));
  }

  clearRemotes() {
    for (var r of this.remotes.values()) r.destroy();
    this.remotes.clear();
  }

  nameOf(id) {
    if (this.self && id === this.self.id) return this.self.name;
    var r = this.remotes.get(id);
    return r ? r.name : "?";
  }

  rename(name) {
    name = protocol.sanitizeName(name);
    if (!name) return;
    storage(NAME_KEY, name);
    this.config.name = name;
    this.connection.send({ t: "name", name: name });
  }

  snapshot(level) {
    var p = this.world.player;
    var c = p.container;
    var view = p.spine.getView();
    var track = view.state && view.state.getCurrent(0);
    // JDSpineGameObject.getAnimationProgress wraps around even for one-shot animations
    // (trackTime keeps growing after the end), which receivers would read as a restart.
    var duration = p.spine.getCurrentAnimationDuration();
    var progress = 0;
    if (track && duration > 0)
      progress = track.loop ? (track.trackTime % duration) / duration : Math.min(1, track.trackTime / duration);
    var menu = level === system_1.BalanceData.mainmenuID ? MenuLayout.toMenu(this.world, c.x, c.y) : null;
    return {
      mb: menu ? menu.mb : undefined,
      mf: menu ? menu.mf : undefined,
      my: menu ? menu.my : undefined,
      t: "s",
      l: level,
      v: level && c.visible ? 1 : 0,
      x: round(c.x, 1),
      y: round(c.y, 1),
      r: round(c.rotation, 3),
      cx: round(c.scaleX, 3),
      cy: round(c.scaleY, 3),
      al: round(c.alpha, 2),
      sx: round(view.scaleX, 3),
      sy: round(view.scaleY, 3),
      ox: round(view.x, 1),
      oy: round(view.y, 1),
      a: p.spine.getCurrentAnimationName() || "",
      lp: track && track.loop ? 1 : 0,
      p: round(progress, 3),
      ts: round(view.timeScale, 2),
      k: system_1.BalanceData.currSkin,
    };
  }

  // Called from World.update every frame, whatever the game state.
  update() {
    var now = performance.now();
    var level = this.localLevel();
    if (this.connection.open && this.self && now - this.lastSendAt >= this.sendIntervalMs && this.world.player) {
      this.lastSendAt = now;
      this.connection.send(this.snapshot(level));
    }
    this.flow.update(now);
    var visibleIn = level && isSharedLevel(level) ? level : "";
    for (var r of this.remotes.values()) r.update(now, visibleIn, this.mapPosition);
    stackLabels([...this.remotes.values()].filter((x) => x.label.visible).map((x) => x.label));
    if (now - this.lastOverlayAt > 500) this.renderOverlay();
  }

  // Called from World.update right after the game logic moved the local player.
  afterLogic() {
    this.collisions.resolve(performance.now());
  }

  renderOverlay() {
    this.lastOverlayAt = performance.now();
    var list = [];
    if (this.self)
      list.push({
        slot: this.self.slot,
        name: this.self.name,
        level: this.localLevel(),
        status: this.flow.statusOf(this.self.id),
        self: true,
      });
    for (var r of this.remotes.values())
      list.push({ slot: r.slot, name: r.name, level: r.level, status: this.flow.statusOf(r.id) });
    list.sort((a, b) => a.slot - b.slot);
    this.overlay.render(list);
    this.overlay.setCollisions(this.collisions.enabled, !!this.flow.room);
  }
}

exports.Multiplayer = Multiplayer;
exports.isSharedLevel = isSharedLevel;
