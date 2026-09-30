#!/usr/bin/env node
// Multiplayer server: serves the game's static files and relays player state between
// the members of a room over WebSocket (path /mp). Rooms hold up to MAX_PLAYERS players,
// are created on first join and disappear when the last player leaves.
//
//   node server/server.mjs            PORT (default 8080), HOST (default all interfaces)
//
// The server doesn't simulate anything: every client runs its own game and is the
// authority for its own player. See src/game/multiplayer/protocol.js for the messages.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { WebSocketServer } from "ws";
import protocol from "../src/game/multiplayer/protocol.js";

const { MAX_PLAYERS, PATH, MAX_MESSAGE_BYTES, CLOSE_ROOM_FULL, SNAPSHOT_KEYS, sanitizeRoom, sanitizeName } = protocol;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Only what the page needs (src/ is there for the source map).
const PUBLIC = new Set(["index.html", "version.js", "favicon.ico", "assets", "dist", "patch", "reference", "src"]);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".ogg": "audio/ogg",
  ".fnt": "text/xml",
  ".atlas": "text/plain",
};
const MIN_SNAPSHOT_INTERVAL_MS = 25; // clients send ~15/s; anything faster is dropped

function serveStatic(root, req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (pathname === "/") pathname = "/index.html";
  const file = path.join(root, pathname);
  const top = path.relative(root, file).split(path.sep)[0];
  if (!file.startsWith(root + path.sep) || !PUBLIC.has(top)) {
    res.writeHead(404).end();
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "content-type": MIME[path.extname(file)] || "application/octet-stream",
      "content-length": stat.size,
      "cache-control": "no-cache",
    });
    fs.createReadStream(file).pipe(res);
  });
}

function cleanSnapshot(msg) {
  const out = {};
  for (const k of SNAPSHOT_KEYS) {
    const v = msg[k];
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "string" && v.length <= 40) out[k] = v;
  }
  return out;
}

export function startServer({ port = 8080, host, root = ROOT, log = console.log } = {}) {
  const server = http.createServer((req, res) => serveStatic(root, req, res));
  const wss = new WebSocketServer({ server, path: PATH, maxPayload: MAX_MESSAGE_BYTES });
  const rooms = new Map(); // code -> Map(id -> player)
  let nextId = 1;

  const send = (ws, msg) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
  };
  const broadcast = (room, msg, except) => {
    const data = JSON.stringify(msg);
    for (const p of room.values()) if (p !== except && p.ws.readyState === p.ws.OPEN) p.ws.send(data);
  };
  const info = (p) => ({ id: p.id, slot: p.slot, name: p.name, last: p.last });

  wss.on("connection", (ws) => {
    let me = null;
    ws.isAlive = true;
    ws.on("pong", () => (ws.isAlive = true));

    ws.on("message", (data, isBinary) => {
      if (isBinary) return;
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }
      if (!msg || typeof msg !== "object") return;

      if (!me) {
        if (msg.t !== "hello") return;
        const code = sanitizeRoom(msg.room) || "lobby";
        const room = rooms.get(code) || new Map();
        if (room.size >= MAX_PLAYERS) {
          send(ws, { t: "full", max: MAX_PLAYERS });
          ws.close(CLOSE_ROOM_FULL, "room full");
          return;
        }
        const used = new Set([...room.values()].map((p) => p.slot));
        let slot = 0;
        while (used.has(slot)) slot++;
        me = {
          id: nextId++,
          slot,
          name: sanitizeName(msg.name) || `Jugador ${slot + 1}`,
          ws,
          code,
          last: null,
          lastAt: 0,
        };
        rooms.set(code, room);
        send(ws, {
          t: "welcome",
          id: me.id,
          slot,
          name: me.name,
          room: code,
          max: MAX_PLAYERS,
          players: [...room.values()].map(info),
        });
        broadcast(room, { t: "joined", ...info(me) });
        room.set(me.id, me);
        log(`[${code}] + ${me.name} (#${me.id}, slot ${slot}) ${room.size}/${MAX_PLAYERS}`);
        return;
      }

      const room = rooms.get(me.code);
      if (msg.t === "s") {
        const now = Date.now();
        if (now - me.lastAt < MIN_SNAPSHOT_INTERVAL_MS) return;
        me.lastAt = now;
        me.last = cleanSnapshot(msg);
        broadcast(room, { t: "s", id: me.id, ...me.last }, me);
      } else if (msg.t === "name") {
        const name = sanitizeName(msg.name);
        if (!name) return;
        me.name = name;
        broadcast(room, { t: "renamed", id: me.id, name });
      }
    });

    ws.on("close", () => {
      if (!me) return;
      const room = rooms.get(me.code);
      room.delete(me.id);
      if (room.size === 0) rooms.delete(me.code);
      else broadcast(room, { t: "left", id: me.id });
      log(`[${me.code}] - ${me.name} (#${me.id}) ${room.size}/${MAX_PLAYERS}`);
    });
  });

  // Drop connections that stopped answering pings (closed laptops, lost Wi-Fi...).
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) ws.terminate();
      else {
        ws.isAlive = false;
        ws.ping();
      }
    }
  }, 15000);

  const ready = new Promise((resolve) => server.listen(port, host, () => resolve(server.address().port)));
  return {
    rooms,
    ready,
    close() {
      clearInterval(heartbeat);
      for (const ws of wss.clients) ws.terminate();
      wss.close();
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

export function lanUrls(port) {
  const urls = [`http://localhost:${port}/`];
  for (const list of Object.values(os.networkInterfaces()))
    for (const a of list || []) if (a.family === "IPv4" && !a.internal) urls.push(`http://${a.address}:${port}/`);
  return urls;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const srv = startServer({ port: Number(process.env.PORT) || 8080, host: process.env.HOST });
  const port = await srv.ready;
  console.log(`Vex multiplayer server on ${lanUrls(port).join("  ")}`);
  if (!fs.existsSync(path.join(ROOT, "dist", "vex7.js"))) console.log("dist/vex7.js is missing: run `npm run build`");
}
