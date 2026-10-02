// One room's game flow. The server only coordinates; each client plays its own game.
//
// Settings: collisions (off by default) lets players block and push each other; the
// pushes are relayed from the pusher's client to the pushed player's client.
//
//   lobby    everybody starts in the main menu. Pressing PLAY marks a player ready; when every
//            player in the room is ready, all of them are sent to the hub at once ("go").
//   playing  players are in the hub or in acts. Late joiners and players who return to the
//            menu go straight to the hub when they press PLAY. If everybody is back in the
//            menu, the room returns to the lobby.
//
// Races, while playing:
//   gathering  the first player to enter an act picks it; everybody who enters an act after
//              that is sent to the same one ("loadAct") and waits frozen at the start
//              ("atStart"). The race starts when every player in the hub, and everybody who
//              entered, is at the start.
//   countdown  COUNTDOWN_MS, then running.
//   (busy)     while a race counts down or runs, others entering acts get "raceBusy" and play
//              that act on their own.
//   running    players report "finish" (time since the start, deaths) or "quitRace". Places
//              are ranked by time. The race ends, with results, only when every participant
//              still connected has finished or quit.
import protocol from "../src/game/multiplayer/protocol.js";

const { MAX_PLAYERS, COUNTDOWN_MS, sanitizeName, sanitizeChat } = protocol;
const LOCS = new Set(["menu", "hub", "act", "other"]);
const PUSH_INTERVAL_MS = 80;
const MAX_PUSH = 12;
const clamp = (v, max) => Math.max(-max, Math.min(max, v));
const CHAT_HISTORY = 30; // messages kept for players who join later
const CHAT_BURST = 5; // a player can send this many messages at once...
const CHAT_REFILL_MS = 1000; // ...and one more every second after that

export class Room {
  constructor(
    code,
    { send, log = () => {}, setTimer = setTimeout, clearTimer = clearTimeout, maxPlayers = MAX_PLAYERS } = {},
  ) {
    this.code = code;
    this.maxPlayers = maxPlayers;
    this.players = new Map(); // id -> player
    this.phase = "lobby";
    this.settings = { collisions: false }; // changed by any player from the room panel
    this.chat = []; // last CHAT_HISTORY messages
    this.race = null;
    this.send = send; // (player, msg)
    this.log = log;
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
  }

  get size() {
    return this.players.size;
  }

  get full() {
    return this.players.size >= this.maxPlayers;
  }

  broadcast(msg, except) {
    for (const p of this.players.values()) if (p !== except) this.send(p, msg);
  }

  info(p) {
    return { id: p.id, slot: p.slot, name: p.name, last: p.last };
  }

  // Everything the clients need to show the lobby/race status.
  state() {
    const r = this.race;
    return {
      t: "room",
      phase: this.phase,
      settings: this.settings,
      players: [...this.players.values()].map((p) => ({ id: p.id, ready: p.ready, loc: p.loc })),
      race: r && {
        act: r.act,
        hard: r.hard,
        state: r.state,
        entered: [...r.entered],
        atStart: [...r.atStart],
        participants: r.participants ? [...r.participants] : [],
        finished: [...r.finished.entries()].map(([id, f]) => ({ id, ...f })),
      },
    };
  }

  sync() {
    this.broadcast(this.state());
  }

  add(id, ws, name) {
    const used = new Set([...this.players.values()].map((p) => p.slot));
    let slot = 0;
    while (used.has(slot)) slot++;
    const me = {
      id,
      slot,
      ws,
      name: sanitizeName(name) || `Jugador ${slot + 1}`,
      last: null,
      lastAt: 0,
      lastPushAt: 0,
      chatTokens: CHAT_BURST,
      chatAt: 0,
      ready: false,
      loc: "menu",
    };
    this.send(me, {
      t: "welcome",
      id,
      slot,
      name: me.name,
      room: this.code,
      max: this.maxPlayers,
      players: [...this.players.values()].map((p) => this.info(p)),
      chat: this.chat,
    });
    this.broadcast({ t: "joined", ...this.info(me) });
    this.players.set(id, me);
    this.sync();
    return me;
  }

  remove(me) {
    this.players.delete(me.id);
    const r = this.race;
    if (r && r.state === "gathering") {
      r.entered.delete(me.id);
      r.atStart.delete(me.id);
      if (r.entered.size === 0) this.endRace(false);
    } else if (r && r.participants.has(me.id) && !r.finished.has(me.id)) {
      // A disconnect counts as quitting: it shows as a DNF in the results.
      r.finished.set(me.id, { dnf: true, name: me.name, slot: me.slot });
    }
    if (this.players.size === 0) {
      if (this.race && this.race.timer) this.clearTimer(this.race.timer);
      return;
    }
    this.broadcast({ t: "left", id: me.id });
    this.checkAll();
    this.sync();
  }

  handle(me, msg) {
    switch (msg.t) {
      case "settings": {
        if (typeof msg.collisions !== "boolean" || msg.collisions === this.settings.collisions) return;
        this.settings = { ...this.settings, collisions: msg.collisions };
        this.log(`[${this.code}] collisions ${msg.collisions ? "on" : "off"} (${me.name})`);
        break;
      }
      case "push": {
        // Relayed to the pushed player's client, which applies it to its own player.
        const target = this.players.get(msg.to);
        const now = Date.now();
        if (!this.settings.collisions || !target || target === me || now - me.lastPushAt < PUSH_INTERVAL_MS) return;
        me.lastPushAt = now;
        const x = clamp(Number(msg.x) || 0, MAX_PUSH);
        const y = clamp(Number(msg.y) || 0, MAX_PUSH);
        this.send(target, { t: "pushed", from: me.id, x, y });
        return;
      }
      case "chat": {
        const text = sanitizeChat(msg.text);
        if (!text) return;
        const now = Date.now();
        me.chatTokens = Math.min(CHAT_BURST, me.chatTokens + (now - me.chatAt) / CHAT_REFILL_MS);
        me.chatAt = now;
        if (me.chatTokens < 1) {
          this.send(me, { t: "chatSlow" });
          return;
        }
        me.chatTokens -= 1;
        const line = { t: "chat", id: me.id, name: me.name, slot: me.slot, text, at: now };
        this.chat.push(line);
        if (this.chat.length > CHAT_HISTORY) this.chat.shift();
        this.broadcast(line); // the sender too: it shows its own line once the server took it
        return;
      }
      case "name": {
        const name = sanitizeName(msg.name);
        if (!name) return;
        me.name = name;
        this.broadcast({ t: "renamed", id: me.id, name });
        return;
      }
      case "loc": {
        if (!LOCS.has(msg.loc) || msg.loc === me.loc) return;
        me.loc = msg.loc;
        if (me.loc === "menu") this.backToLobbyIfAllInMenu();
        break;
      }
      case "ready": {
        if (this.phase === "playing") {
          this.send(me, { t: "go" });
          return;
        }
        me.ready = true;
        break;
      }
      case "enterAct": {
        const act = String(msg.act || "");
        if (!/^\d{1,2}$/.test(act)) return;
        if (this.phase !== "playing") return;
        const r = this.race;
        if (r && r.state !== "gathering") {
          this.send(me, { t: "raceBusy" });
          return;
        }
        if (!r) {
          this.race = {
            act,
            hard: !!msg.hard,
            state: "gathering",
            entered: new Set(),
            atStart: new Set(),
            participants: null,
            finished: new Map(),
            timer: null,
          };
          this.log(`[${this.code}] race: act ${act}${msg.hard ? " (hard)" : ""} picked by ${me.name}`);
        }
        this.race.entered.add(me.id);
        this.send(me, { t: "loadAct", act: this.race.act, hard: this.race.hard });
        break;
      }
      case "atStart": {
        const r = this.race;
        if (!r || r.state !== "gathering" || !r.entered.has(me.id)) return;
        r.atStart.add(me.id);
        break;
      }
      case "finish": {
        const r = this.race;
        if (!r || r.state !== "running" || !r.participants.has(me.id) || r.finished.has(me.id)) return;
        const ms = Math.max(0, Math.round(Number(msg.ms) || 0));
        const deaths = Math.max(0, Math.round(Number(msg.deaths) || 0));
        r.finished.set(me.id, { ms, deaths, place: 0, name: me.name, slot: me.slot });
        this.rank(r);
        this.log(`[${this.code}] race: ${me.name} finished #${r.finished.get(me.id).place} in ${ms} ms`);
        break;
      }
      case "quitRace": {
        const r = this.race;
        if (!r) return;
        if (r.state === "gathering") {
          r.entered.delete(me.id);
          r.atStart.delete(me.id);
          if (r.entered.size === 0) this.endRace(false);
        } else if (r.participants.has(me.id) && !r.finished.has(me.id)) {
          r.finished.set(me.id, { dnf: true, name: me.name, slot: me.slot });
        }
        break;
      }
      default:
        return;
    }
    this.checkAll();
    this.sync();
  }

  checkAll() {
    const players = [...this.players.values()];
    if (this.phase === "lobby" && players.length && players.every((p) => p.ready)) {
      this.phase = "playing";
      for (const p of players) p.ready = false;
      this.log(`[${this.code}] everybody ready: go`);
      this.broadcast({ t: "go" });
    }
    const r = this.race;
    if (!r) return;
    if (r.state === "gathering") {
      // Everybody in the hub, or who asked to join, has to be waiting at the start. Players
      // playing an act on their own (they arrived while a race was busy) don't hold it up.
      const needed = players.filter((p) => p.loc === "hub" || r.entered.has(p.id));
      if (r.atStart.size && needed.every((p) => r.atStart.has(p.id))) {
        r.state = "countdown";
        r.participants = new Set(r.atStart);
        this.log(`[${this.code}] race: countdown with ${r.participants.size} players`);
        this.broadcast({ t: "countdown", ms: COUNTDOWN_MS });
        r.timer = this.setTimer(() => {
          if (this.race !== r) return;
          r.state = "running";
          r.timer = null;
          this.checkAll();
          this.sync();
        }, COUNTDOWN_MS);
      }
    } else if (r.state === "running") {
      if ([...r.participants].every((id) => r.finished.has(id))) this.endRace(true);
    }
  }

  // Everybody went back to the menu, and no race is left to finish: the room is a lobby again.
  // Checked when a player returns to the menu and when a race ends (they may all have gone
  // back before it did). Not on every change: right after "go" they are all still in the menu.
  backToLobbyIfAllInMenu() {
    const players = [...this.players.values()];
    if (this.phase !== "playing" || this.race || !players.every((p) => p.loc === "menu")) return;
    this.phase = "lobby";
    for (const p of players) p.ready = false;
  }

  // Places go by each player's own time since the start (not by arrival at the server,
  // which depends on latency and frame rate), so they can change as others finish.
  rank(r) {
    const done = [...r.finished.values()].filter((f) => !f.dnf).sort((a, b) => a.ms - b.ms);
    done.forEach((f, i) => (f.place = i + 1));
  }

  endRace(withResults) {
    const r = this.race;
    this.race = null;
    if (r.timer) this.clearTimer(r.timer);
    this.backToLobbyIfAllInMenu();
    if (!withResults) return;
    const results = [...r.finished.entries()]
      .map(([id, f]) => {
        const p = this.players.get(id); // gone if they disconnected: keep the name they had
        return { id, ...f, name: p ? p.name : f.name, slot: p ? p.slot : f.slot };
      })
      .sort((a, b) => (a.dnf ? 1 : 0) - (b.dnf ? 1 : 0) || (a.place || 99) - (b.place || 99));
    this.log(`[${this.code}] race over: ${results.map((x) => x.name + (x.dnf ? " DNF" : " " + x.ms)).join(", ")}`);
    this.broadcast({ t: "raceOver", act: r.act, hard: r.hard, results });
  }
}
