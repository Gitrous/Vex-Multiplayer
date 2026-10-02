// Shared by the browser client and server/server.mjs.
//
// client -> server
//   { t: "hello", room, name }       join (or create) a room; answered with "welcome" or "full"
//   { t: "s", ...PlayerSnapshot }     own player state, ~15 times per second
//   { t: "name", name }               rename
//   { t: "loc", loc }                 where the player is: "menu" | "hub" | "act" | "other"
//   { t: "ready" }                    pressed PLAY in the main menu
//   { t: "enterAct", act, hard }      wants to enter an act (from the hub or a finished act)
//   { t: "atStart" }                  spawned in the race's act, frozen and waiting
//   { t: "finish", ms, deaths }       reached the finish portal, ms after the race's start
//   { t: "quitRace" }                 left the act before finishing
//   { t: "settings", collisions }     change the room's settings (any player)
//   { t: "push", to, x, y }           ran into player `to` with collisions on: push them by x, y
//   { t: "chat", text }               say something to the room (CHAT_MAX_LENGTH, rate-limited)
// server -> client
//   { t: "welcome", id, slot, name, room, max, players: [PlayerInfo], chat: [ChatLine] }
//   { t: "full", max }                room already has its maximum; the socket is then closed
//   { t: "joined", ...PlayerInfo }    PlayerInfo = { id, slot, name, last?: snapshot }
//   { t: "left", id }
//   { t: "renamed", id, name }
//   { t: "s", id, ...PlayerSnapshot } another player's state, relayed as-is
//   { t: "room", phase, settings, players: [{ id, ready, loc }], race }   status, after every change
//   { t: "pushed", from, x, y }       another player ran into yours: apply this force
//   { t: "go" }                       leave the main menu for the hub now
//   { t: "loadAct", act, hard }       enter this act (the race's act, whatever was asked)
//   { t: "raceBusy" }                 a race is already under way; wait in the hub
//   { t: "countdown", ms }            everybody is at the start: the race starts in ms
//   { t: "chat", id, name, slot, text, at }   a chat line (ChatLine), sent to everybody, sender included
//   { t: "chatSlow" }                 too many messages: this one was dropped
//   { t: "raceOver", act, hard, results: [{ id, name, slot, ms, deaths, place } | { id, ..., dnf }] }
//
// server/room.mjs has the room's game flow.
//
// PlayerSnapshot (numbers are rounded by the sender):
//   l   level key (World.currLevelID, plus ":h" in hard mode), or "" when not in a level
//   v   1 if the player is visible
//   x y r cx cy al   container position, rotation, scale and alpha
//   sx sy ox oy      spine scale (sx < 0 when facing left) and offset inside the container
//   a lp p ts        spine animation name, loop flag, progress 0..1, time scale
//   k                skin number
//   mb mf my         main menu only, where x/y don't match between screen sizes: index of the
//                    nearest menu block, x as a fraction of its width, y relative to its top
"use strict";

var MAX_PLAYERS = 10;

exports.MAX_PLAYERS = MAX_PLAYERS;
exports.PATH = "/mp";
exports.SEND_RATE_HZ = 15;
exports.COUNTDOWN_MS = 3000;
exports.MAX_MESSAGE_BYTES = 2048;
exports.CLOSE_ROOM_FULL = 4000;

// One colour per slot (0..MAX_PLAYERS-1), all readable on the game's white background: red, blue, green,
// yellow, purple, orange, cyan, pink, lime, brown.
exports.PLAYER_COLORS = [
  0xff4d4d, 0x3d9bff, 0x2fd67b, 0xffc233, 0xb15cff, 0xff8a1f, 0x14c8d4, 0xff5cc6, 0x9bd12a, 0xa9744f,
];

exports.SNAPSHOT_KEYS = [
  "l",
  "v",
  "x",
  "y",
  "r",
  "cx",
  "cy",
  "al",
  "sx",
  "sy",
  "ox",
  "oy",
  "a",
  "lp",
  "p",
  "ts",
  "k",
  "mb",
  "mf",
  "my",
];

exports.CHAT_MAX_LENGTH = 140;

// Chat text: no control characters, collapsed whitespace, at most CHAT_MAX_LENGTH characters.
exports.sanitizeChat = function (text) {
  return Array.from(
    String(text || "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  )
    .slice(0, exports.CHAT_MAX_LENGTH)
    .join("");
};

exports.sanitizeRoom = function (room) {
  return String(room || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 24);
};

// At most 16 characters (code points, so an emoji isn't cut in half).
exports.sanitizeName = function (name) {
  return Array.from(
    String(name || "")
      .replace(/[\u0000-\u001f\u007f<>]/g, "")
      .trim(),
  )
    .slice(0, 16)
    .join("")
    .trim();
};
