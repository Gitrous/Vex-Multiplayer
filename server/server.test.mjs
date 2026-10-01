// Integration test of the real server with 10 WebSocket clients (no browser): node --test server/
import test from "node:test";
import assert from "node:assert/strict";
import { WebSocket } from "ws";
import { startServer } from "./server.mjs";

const N = 10;

function client(url, name, room) {
  const ws = new WebSocket(url);
  const inbox = [];
  const waiters = [];
  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    inbox.push(msg);
    for (const w of waiters.splice(0)) w();
  });
  const opened = new Promise((resolve, reject) => {
    ws.on("open", () => {
      ws.send(JSON.stringify({ t: "hello", room, name }));
      resolve();
    });
    ws.on("error", reject);
  });
  const closed = new Promise((resolve) => ws.on("close", (code) => resolve(code)));
  return {
    ws,
    inbox,
    opened,
    closed,
    send: (msg) => ws.send(JSON.stringify(msg)),
    // Resolves with the first message (already received or future) matching pred.
    async next(pred, timeoutMs = 5000) {
      const deadline = Date.now() + timeoutMs;
      for (;;) {
        const found = inbox.find(pred);
        if (found) {
          inbox.splice(inbox.indexOf(found), 1);
          return found;
        }
        if (Date.now() > deadline) throw new Error(`${name}: timed out waiting`);
        await new Promise((r) => {
          waiters.push(r);
          setTimeout(r, 50);
        });
      }
    },
  };
}

test(`${N} players share a room: lobby, relayed state, race with results; an 11th is turned away`, async (t) => {
  const srv = startServer({ port: 0, host: "127.0.0.1", log: () => {} });
  const url = `ws://127.0.0.1:${await srv.ready}/mp`;
  const clients = [];
  t.after(async () => {
    for (const c of clients) c.ws.terminate();
    await srv.close();
  });

  for (let i = 1; i <= N; i++) {
    const c = client(url, "P" + i, "big");
    clients.push(c);
    await c.opened;
    await c.next((m) => m.t === "welcome");
  }
  for (const c of clients) {
    const room = await c.next((m) => m.t === "room" && m.players.length === N);
    assert.equal(room.players.length, N);
  }

  // An 11th player gets "full" and is disconnected with code 4000.
  const extra = client(url, "P11", "big");
  clients.push(extra);
  const full = await extra.next((m) => m.t === "full");
  assert.equal(full.max, N);
  assert.equal(await extra.closed, 4000);

  // State from one player reaches the other nine.
  clients[0].send({ t: "s", l: "hub", v: 1, x: 10, y: 20 });
  for (const c of clients.slice(1, N)) {
    const s = await c.next((m) => m.t === "s" && m.x === 10);
    assert.equal(s.y, 20);
  }

  // Lobby: "go" only when all ten pressed PLAY.
  for (const c of clients.slice(0, N)) c.send({ t: "ready" });
  for (const c of clients.slice(0, N)) await c.next((m) => m.t === "go");

  // Race: everybody enters, waits at the start, gets the countdown, finishes.
  for (const c of clients.slice(0, N)) c.send({ t: "loc", loc: "hub" });
  for (const c of clients.slice(0, N)) {
    c.send({ t: "enterAct", act: "2", hard: false });
    const load = await c.next((m) => m.t === "loadAct");
    assert.equal(load.act, "2");
    c.send({ t: "loc", loc: "act" });
    c.send({ t: "atStart" });
  }
  for (const c of clients.slice(0, N)) await c.next((m) => m.t === "countdown");
  await new Promise((r) => setTimeout(r, 3100)); // COUNTDOWN_MS
  clients.slice(0, N).forEach((c, i) => c.send({ t: "finish", ms: 10000 - i * 100, deaths: i }));
  const over = await clients[0].next((m) => m.t === "raceOver");
  assert.equal(over.results.length, N);
  assert.deepEqual(
    over.results.map((r) => r.place),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.equal(over.results[0].name, "P10", "fastest time wins");
});
