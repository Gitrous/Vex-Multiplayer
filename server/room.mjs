// One room's game flow. The server only coordinates; each client plays its own game.
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
//              ("atStart"). The race starts when every player in the hub or in an act is at
//              the start.
//   countdown  COUNTDOWN_MS, then running.
//   running    players report "finish" (time since the start, deaths) or "quitRace". Places
//              are ranked by time. The race ends, with results, only when every participant
//              still connected has finished or quit.
import protocol from "../src/game/multiplayer/protocol.js";

const { MAX_PLAYERS, COUNTDOWN_MS, sanitizeName } = protocol;
const LOCS = new Set(["menu", "hub", "act", "other"]);

export class Room {
  constructor(code, { send, log = () => {}, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
    this.code = code;
    this.players = new Map(); // id -> player
    this.phase = "lobby";
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
    return this.players.size >= MAX_PLAYERS;
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
      ready: false,
      loc: "menu",
    };
    this.send(me, {
      t: "welcome",
      id,
      slot,
      name: me.name,
      room: this.code,
      max: MAX_PLAYERS,
      players: [...this.players.values()].map((p) => this.info(p)),
    });
    this.broadcast({ t: "joined", ...this.info(me) });
    this.players.set(id, me);
    this.sync();
    return me;
  }

  remove(me) {
    this.players.delete(me.id);
    if (this.race) {
      const r = this.race;
      r.entered.delete(me.id);
      r.atStart.delete(me.id);
      if (r.participants) r.participants.delete(me.id);
      if (r.entered.size === 0 && (!r.participants || r.participants.size === 0)) this.endRace(false);
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
        if (me.loc === "menu" && this.phase === "playing" && this.race === null) {
          if ([...this.players.values()].every((p) => p.loc === "menu")) {
            this.phase = "lobby";
            for (const p of this.players.values()) p.ready = false;
          }
        }
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
        r.finished.set(me.id, { ms, deaths, place: 0 });
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
          r.finished.set(me.id, { dnf: true });
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
      // Everybody in the hub or already in the race's act has to be waiting at the start.
      const needed = players.filter((p) => p.loc === "hub" || p.loc === "act" || r.entered.has(p.id));
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
    if (!withResults) return;
    const results = [...r.finished.entries()]
      .map(([id, f]) => {
        const p = this.players.get(id);
        return { id, name: p ? p.name : "?", slot: p ? p.slot : 0, ...f };
      })
      .sort((a, b) => (a.dnf ? 1 : 0) - (b.dnf ? 1 : 0) || (a.place || 99) - (b.place || 99));
    this.log(`[${this.code}] race over: ${results.map((x) => x.name + (x.dnf ? " DNF" : " " + x.ms)).join(", ")}`);
    this.broadcast({ t: "raceOver", act: r.act, hard: r.hard, results });
  }
}
