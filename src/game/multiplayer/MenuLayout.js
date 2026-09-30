// The main menu's walkable blocks (DAILY TASKS, TOWER, PLAY, SKINS, TROPHIES) are placed
// from each screen's size, so raw x/y don't match between players. Positions in the menu
// are sent relative to the nearest block instead: its index, x as a fraction of its width
// and y relative to its top (the player keeps the same size on every screen).
"use strict";

var SubSceneList_1 = require("../subscenes/SubSceneList");

function menuBlocks(world) {
  var s = world.subScene;
  if (world.currSubScene !== SubSceneList_1.SubSceneList.Menu || !s || !s.blockPlay) return null;
  var blocks = [s.blockDailyTask, s.blockDailyStage, s.blockPlay, s.blockSkins, s.blockTrophie];
  return blocks.every((b) => b && b.width > 0) ? blocks : null;
}

// World position -> { mb, mf, my }, or null when not in the menu.
function toMenu(world, x, y) {
  var blocks = menuBlocks(world);
  if (!blocks) return null;
  var best = 0;
  var bestDist = Infinity;
  blocks.forEach(function (b, i) {
    var d = x < b.leftEdge ? b.leftEdge - x : x > b.rightEdge ? x - b.rightEdge : 0;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  var b = blocks[best];
  return {
    mb: best,
    mf: Math.round(((x - b.leftEdge) / b.width) * 1000) / 1000,
    my: Math.round((y - b.topEdge) * 10) / 10,
  };
}

// Snapshot fields -> world position on this screen, or null when not in the menu.
function fromMenu(world, s) {
  var blocks = menuBlocks(world);
  if (!blocks || typeof s.mb !== "number" || !blocks[s.mb]) return null;
  var b = blocks[s.mb];
  return { x: b.leftEdge + s.mf * b.width, y: b.topEdge + s.my };
}

exports.toMenu = toMenu;
exports.fromMenu = fromMenu;
