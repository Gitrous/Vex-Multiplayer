// Unit tests for the room flow: node --test server/
import test from "node:test";
import assert from "node:assert/strict";
import { Room } from "./room.mjs";
import protocol from "../src/game/multiplayer/protocol.js";

function setup(n) {
  const inbox = new Map(); // id -> [msg]
  const timers = [];
  const room = new Room("r", {
    send: (p, msg) => (inbox.get(p.id) || inbox.set(p.id, []).get(p.id)).push(msg),
    setTimer: (fn) => (timers.push(fn), timers.length),
    clearTimer: () => {},
  });
  const players = [];
  for (let i = 1; i <= n; i++) {
    inbox.set(i, []);
    players.push(room.add(i, null, "P" + i));
  }
  const got = (p, t) => inbox.get(p.id).filter((m) => m.t === t);
  const clear = () => inbox.forEach((list) => (list.length = 0));
  const fireTimers = () => timers.splice(0).forEach((fn) => fn());
  return { room, players, got, clear, fireTimers };
}

test("rooms hold 10 players with distinct slots and colours; a smaller limit can be set", () => {
  const { room, players } = setup(10);
  assert.deepEqual(
    players.map((p) => p.slot),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(room.full, true);
  assert.equal(new Set(protocol.PLAYER_COLORS).size, 10);
  const small = new Room("s", { send: () => {}, maxPlayers: 4 });
  for (let i = 1; i <= 4; i++) small.add(i, null, "P" + i);
  assert.equal(small.full, true);
});

test("a slot freed by a leaving player is reused", () => {
  const { room, players } = setup(10);
  room.remove(players[3]);
  assert.equal(room.full, false);
  assert.equal(room.add(99, null, "new").slot, 3);
});

test("everybody goes to the hub only when all are ready", () => {
  const { room, players, got } = setup(3);
  room.handle(players[0], { t: "ready" });
  room.handle(players[1], { t: "ready" });
  assert.equal(got(players[0], "go").length, 0);
  room.handle(players[2], { t: "ready" });
  for (const p of players) assert.equal(got(p, "go").length, 1);
  assert.equal(room.phase, "playing");
});

test("a late joiner pressing PLAY goes straight to the hub", () => {
  const { room, players, got } = setup(1);
  room.handle(players[0], { t: "ready" });
  const late = room.add(9, null, "late");
  assert.equal(late.loc, "menu");
  assert.equal(room.phase, "playing");
  room.handle(late, { t: "ready" });
  assert.equal(got(late, "go").length, 1);
  assert.equal(got(players[0], "go").length, 1, "the others aren't sent again");
});

test("race: gathering, same act for all, countdown, results only when all finished", () => {
  const { room, players, got, clear, fireTimers } = setup(3);
  for (const p of players) room.handle(p, { t: "ready" });
  for (const p of players) room.handle(p, { t: "loc", loc: "hub" });
  clear();

  room.handle(players[0], { t: "enterAct", act: 3, hard: false });
  assert.deepEqual(got(players[0], "loadAct")[0], { t: "loadAct", act: "3", hard: false });
  room.handle(players[1], { t: "enterAct", act: 5, hard: true });
  assert.deepEqual(got(players[1], "loadAct")[0], { t: "loadAct", act: "3", hard: false }, "follows the race's act");

  room.handle(players[0], { t: "loc", loc: "act" });
  room.handle(players[0], { t: "atStart" });
  room.handle(players[1], { t: "loc", loc: "act" });
  room.handle(players[1], { t: "atStart" });
  assert.equal(room.race.state, "gathering", "P3 is still in the hub");

  room.handle(players[2], { t: "enterAct", act: 1 });
  room.handle(players[2], { t: "loc", loc: "act" });
  room.handle(players[2], { t: "atStart" });
  assert.equal(room.race.state, "countdown");
  for (const p of players) assert.equal(got(p, "countdown").length, 1);

  room.handle(players[1], { t: "finish", ms: 1000, deaths: 0 });
  assert.equal(room.race.finished.size, 0, "finishing during the countdown is ignored");
  fireTimers();
  assert.equal(room.race.state, "running");

  room.handle(players[0], { t: "finish", ms: 6000, deaths: 0 });
  assert.equal(room.race.finished.get(1).place, 1);
  room.handle(players[1], { t: "finish", ms: 5000, deaths: 2 });
  assert.equal(room.race.finished.get(1).place, 2, "places follow times, not arrival order");
  assert.equal(got(players[0], "raceOver").length, 0, "P3 hasn't finished");
  room.handle(players[2], { t: "quitRace" });
  const over = got(players[0], "raceOver")[0];
  assert.ok(over);
  assert.deepEqual(
    over.results.map((r) => [r.name, r.place, r.dnf]),
    [
      ["P2", 1, undefined],
      ["P1", 2, undefined],
      ["P3", undefined, true],
    ],
  );
  assert.equal(room.race, null);
});

test("a new race can't be joined while one is running", () => {
  const { room, players, got, fireTimers } = setup(2);
  for (const p of players) room.handle(p, { t: "ready" });
  room.handle(players[0], { t: "loc", loc: "other" }); // e.g. in the tower: not needed at the start
  room.handle(players[1], { t: "loc", loc: "hub" });
  room.handle(players[1], { t: "enterAct", act: 2 });
  room.handle(players[1], { t: "atStart" });
  assert.equal(room.race.state, "countdown");
  fireTimers();
  room.handle(players[0], { t: "loc", loc: "hub" });
  room.handle(players[0], { t: "enterAct", act: 2 });
  assert.equal(got(players[0], "raceBusy").length, 1);
  assert.equal(got(players[0], "loadAct").length, 0);
});

test("players soloing an act (arrived while a race was busy) don't hold up the next race", () => {
  const { room, players, fireTimers } = setup(3);
  for (const p of players) room.handle(p, { t: "ready" });
  for (const p of players) room.handle(p, { t: "loc", loc: "hub" });
  room.handle(players[0], { t: "enterAct", act: 1 });
  room.handle(players[0], { t: "atStart" });
  room.handle(players[1], { t: "loc", loc: "other" });
  room.handle(players[2], { t: "loc", loc: "other" });
  assert.equal(room.race.state, "countdown");
  fireTimers();
  // P3 tries to join, is told the race is busy and plays act 4 alone.
  room.handle(players[2], { t: "loc", loc: "hub" });
  room.handle(players[2], { t: "enterAct", act: 4 });
  room.handle(players[2], { t: "loc", loc: "act" });
  room.handle(players[0], { t: "finish", ms: 100, deaths: 0 });
  assert.equal(room.race, null);
  // A new race between P1 and P2 starts without waiting for P3.
  room.handle(players[0], { t: "loc", loc: "hub" });
  room.handle(players[1], { t: "loc", loc: "hub" });
  room.handle(players[0], { t: "enterAct", act: 2 });
  room.handle(players[1], { t: "enterAct", act: 2 });
  room.handle(players[0], { t: "atStart" });
  room.handle(players[1], { t: "atStart" });
  assert.equal(room.race.state, "countdown");
});

test("a participant disconnecting doesn't block the race", () => {
  const { room, players, got, fireTimers } = setup(2);
  for (const p of players) room.handle(p, { t: "ready" });
  for (const p of players) {
    room.handle(p, { t: "loc", loc: "hub" });
    room.handle(p, { t: "enterAct", act: 1 });
    room.handle(p, { t: "atStart" });
  }
  fireTimers();
  room.handle(players[0], { t: "finish", ms: 100, deaths: 0 });
  room.remove(players[1]);
  assert.equal(got(players[0], "raceOver").length, 1);
});

test("the room returns to the lobby when everybody is back in the menu", () => {
  const { room, players } = setup(2);
  for (const p of players) room.handle(p, { t: "ready" });
  for (const p of players) room.handle(p, { t: "loc", loc: "hub" });
  room.handle(players[0], { t: "loc", loc: "menu" });
  assert.equal(room.phase, "playing");
  room.handle(players[1], { t: "loc", loc: "menu" });
  assert.equal(room.phase, "lobby");
});

test("collisions setting: any player toggles it; pushes are relayed only while it is on", () => {
  const { room, players, got } = setup(2);
  room.handle(players[0], { t: "push", to: 2, x: 5, y: -2 });
  assert.equal(got(players[1], "pushed").length, 0, "off by default");
  room.handle(players[1], { t: "settings", collisions: true });
  assert.equal(room.state().settings.collisions, true);
  assert.equal(got(players[0], "room").at(-1).settings.collisions, true, "everybody gets the new setting");
  room.handle(players[0], { t: "push", to: 2, x: 50, y: -2 });
  assert.deepEqual(got(players[1], "pushed")[0], { t: "pushed", from: 1, x: 12, y: -2 }, "clamped");
  room.handle(players[0], { t: "push", to: 2, x: 5, y: 0 });
  assert.equal(got(players[1], "pushed").length, 1, "rate-limited");
  room.handle(players[0], { t: "push", to: 1, x: 5, y: 0 });
  assert.equal(got(players[0], "pushed").length, 0, "can't push yourself");
  room.handle(players[0], { t: "settings", collisions: "yes" });
  assert.equal(room.settings.collisions, true, "ignores bad values");
});
