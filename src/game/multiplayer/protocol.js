// Shared by the browser client and server/server.mjs.
//
// client -> server
//   { t: "hello", room, name }       join (or create) a room; answered with "welcome" or "full"
//   { t: "s", ...PlayerSnapshot }     own player state, ~15 times per second
//   { t: "name", name }               rename
// server -> client
//   { t: "welcome", id, slot, name, room, max, players: [PlayerInfo] }
//   { t: "full", max }                room already has MAX_PLAYERS; the socket is then closed
//   { t: "joined", ...PlayerInfo }    PlayerInfo = { id, slot, name, last?: snapshot }
//   { t: "left", id }
//   { t: "renamed", id, name }
//   { t: "s", id, ...PlayerSnapshot } another player's state, relayed as-is
//
// PlayerSnapshot (numbers are rounded by the sender):
//   l   level key (World.currLevelID, plus ":h" in hard mode), or "" when not in a level
//   v   1 if the player is visible
//   x y r cx cy al   container position, rotation, scale and alpha
//   sx sy ox oy      spine scale (sx < 0 when facing left) and offset inside the container
//   a lp p ts        spine animation name, loop flag, progress 0..1, time scale
//   k                skin number
"use strict";

var MAX_PLAYERS = 4;

exports.MAX_PLAYERS = MAX_PLAYERS;
exports.PATH = "/mp";
exports.SEND_RATE_HZ = 15;
exports.MAX_MESSAGE_BYTES = 2048;
exports.CLOSE_ROOM_FULL = 4000;

// One colour per slot (0..MAX_PLAYERS-1): red, blue, green, yellow.
exports.PLAYER_COLORS = [0xff4d4d, 0x3d9bff, 0x2fd67b, 0xffc233];

exports.SNAPSHOT_KEYS = ["l", "v", "x", "y", "r", "cx", "cy", "al", "sx", "sy", "ox", "oy", "a", "lp", "p", "ts", "k"];

exports.sanitizeRoom = function (room) {
  return String(room || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 24);
};

exports.sanitizeName = function (name) {
  return String(name || "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .trim()
    .slice(0, 16);
};
