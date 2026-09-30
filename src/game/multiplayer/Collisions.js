// Player-vs-player collisions, when the room's "collisions" setting is on.
//
// Every client only moves its own player, so a collision is handled on both ends:
// - the local player can't run through another player's ghost: it is stopped at its side,
//   like against a wall (resolve());
// - when it runs into a ghost, the other player's client is told to push its own player
//   away ("push" -> "pushed"), with Player.applyForce, the same call pulse blocks use.
//
// Ghosts are drawn INTERP_DELAY_MS in the past, so contact happens with where the other
// player was a moment ago; that's the price of every client staying authoritative.
"use strict";

var SoundManager_1 = require("../system/SoundManager");

// The player's box: its origin is at the feet; the body spans about -33..0 in y and
// -8..8 in x (PlayerBase state infos).
var HALF_WIDTH = 8;
var HEIGHT = 33;
var PUSH_X = 6; // horizontal force on the pushed player
var PUSH_Y = -2.5; // and a small hop
var MIN_PUSH_SPEED = 0.5; // the pusher must be moving into the other player
var PUSH_COOLDOWN_MS = 250; // per pushed player, on the pusher's side
var START_GRACE_MS = 1500; // after a race starts everybody overlaps at the spawn point

class Collisions {
  constructor(mp) {
    this.mp = mp;
    this.world = mp.world;
    this.lastPushAt = new Map(); // remote id -> time
    this.graceUntil = 0;
  }

  get enabled() {
    var room = this.mp.flow.room;
    return !!(room && room.settings && room.settings.collisions);
  }

  // The race just started: let the stacked players spread out first.
  startGrace(now) {
    this.graceUntil = now + START_GRACE_MS;
  }

  // After WorldCreator.updateLogic moved the local player this frame.
  resolve(now) {
    var w = this.world;
    var p = w.player;
    if (!this.enabled || now < this.graceUntil || !p || p.alive !== true) return;
    for (var r of this.mp.remotes.values()) {
      if (!r.container.visible || r.container.alpha < 0.5) continue;
      var gx = r.container.x;
      var gy = r.container.y;
      var dx = p.xPos - gx;
      var overlapX = 2 * HALF_WIDTH - Math.abs(dx);
      var overlapY = HEIGHT - Math.abs(p.yPos - gy);
      if (overlapX <= 0 || overlapY <= 0) continue;
      var side = dx !== 0 ? Math.sign(dx) : -Math.sign(p.xVelocity) || 1; // which side of the ghost we are on
      var towards = p.xVelocity * side < 0; // moving into the ghost
      if (!towards) continue;
      var speed = Math.abs(p.xVelocity);
      // Back out along the way we came (never further than this frame's move, so no walls).
      p.xPos += side * Math.min(overlapX, speed);
      if (speed >= MIN_PUSH_SPEED) this.push(r, -side, now);
      p.xVelocity = 0;
      p.forcedXVelocity = 0;
      p.updatePositions();
    }
  }

  push(remote, dir, now) {
    var last = this.lastPushAt.get(remote.id) || 0;
    if (now - last < PUSH_COOLDOWN_MS) return;
    this.lastPushAt.set(remote.id, now);
    this.mp.connection.send({ t: "push", to: remote.id, x: dir * PUSH_X, y: PUSH_Y });
  }

  // Another player ran into ours.
  onPushed(msg) {
    var w = this.world;
    var p = w.player;
    var pusher = this.mp.remotes.get(msg.from);
    if (!this.enabled || !p || p.alive !== true || w.state !== this.mp.GameStates.Playing) return;
    if (!pusher || !pusher.container.visible) return; // not in the same level any more
    p.applyForce(msg.x, msg.y);
    SoundManager_1.SoundManager.playSFX("bounce1");
  }
}

exports.Collisions = Collisions;
