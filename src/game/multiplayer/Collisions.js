// Player-vs-player collisions, when the room's "collisions" setting is on.
//
// Every client only moves its own player, so a collision is handled on both ends:
// - Standing on others: each other player's ghost carries an invisible platform on its
//   head (HeadPlatform, a real game Block). It is put into world.blocks only while the
//   local player's update runs, so the game's own block physics lets the player land on it,
//   jump off it and be carried along, while lasers, bullets, particles... never see it.
// - Pushing: the local player can't run through a ghost: it stays in contact at its side
//   (resolve()) and, while it keeps moving into it, the other player's client is told to
//   move its own player along at the pusher's speed ("push" -> "pushed"). The pushed player
//   is moved through its normal update, so walls still stop it.
//
// Ghosts are drawn INTERP_DELAY_MS in the past, so contact happens with where the other
// player was a moment ago; that's the price of every client staying authoritative.
"use strict";

var Block_1 = require("../objects/blocks/Block");
var SoundManager_1 = require("../system/SoundManager");

// The player's box: its origin is at the feet; the body spans about -33..0 in y and
// -8..8 in x (PlayerBase state infos).
var HALF_WIDTH = 8;
var HEIGHT = 33;
var HEAD_PLATFORM_HEIGHT = 8;
var MIN_PUSH_SPEED = 0.5; // the pusher must be moving into the other player
var MAX_PUSH_SPEED = 3.5; // Player.maxVelocity
var PUSH_SEND_MS = 100; // while in contact, how often the pusher reports
var PUSH_HOLD_MS = 160; // how long a "pushed" keeps moving the player (covers the gap to the next one)
var START_GRACE_MS = 1500; // after a race starts everybody overlaps at the spawn point

class HeadPlatform extends Block_1.Block {
  constructor(world) {
    super(world, world.layerBlocks);
    this.type = "player";
    this.hangable = false;
    this.scalable = false;
    this.dx = 0;
    this.dy = 0;
    this.init(0, 0, 2 * HALF_WIDTH, HEAD_PLATFORM_HEIGHT);
  }

  // Only the top (landing) and bottom (bumping your head) count: the side polygons the game
  // uses for walls are moved out of reach, so running into a player is left to resolve(),
  // which keeps the runner's speed and turns it into a push.
  initOffsets() {
    super.initOffsets();
    var away = new SAT.Vector(0, 1e6);
    this.leftPolygon.setOffset(away);
    this.rightPolygon.setOffset(away);
    this.lhPolygon.setOffset(away);
    this.rhPolygon.setOffset(away);
  }

  // Moves onto the ghost's head; dx/dy (and the block velocities the game reads) are this frame's move.
  follow(remote, snap) {
    var x = remote.container.x;
    var y = remote.container.y - HEIGHT + HEAD_PLATFORM_HEIGHT / 2;
    this.dx = snap ? 0 : x - this.xPos;
    this.dy = snap ? 0 : y - this.yPos;
    this.xVelocity = this.dx;
    this.yVelocity = this.dy;
    this.xPos = x;
    this.yPos = y;
    this.updatePosition();
  }
}

class Collisions {
  constructor(mp) {
    this.mp = mp;
    this.world = mp.world;
    this.lastPushAt = new Map(); // remote id -> time of the last "push" sent
    this.platforms = new Map(); // remote id -> HeadPlatform
    this.pushedVelocity = 0; // from the last "pushed": signed speed to move at
    this.pushedUntil = 0;
    this.lastPushedAt = 0;
    this.graceUntil = 0;
    this.wrapPlayerUpdate();
  }

  get enabled() {
    var room = this.mp.flow.room;
    return !!(room && room.settings && room.settings.collisions);
  }

  active(now) {
    var p = this.world.player;
    return this.enabled && now >= this.graceUntil && !!p && p.alive === true && !!this.world.blocks;
  }

  // The race just started: let the stacked players spread out first.
  startGrace(now) {
    this.graceUntil = now + START_GRACE_MS;
  }

  // Player.update is where the game checks the player against world.blocks: wrap it so the
  // head platforms (and a pending push) only exist for the local player's own physics.
  wrapPlayerUpdate() {
    var self = this;
    var player = this.world.player;
    var update = player.update;
    player.update = function () {
      var added = self.beforePlayerUpdate(performance.now());
      try {
        return update.apply(this, arguments);
      } finally {
        if (added) self.removePlatforms();
      }
    };
  }

  beforePlayerUpdate(now) {
    if (!this.active(now)) return false;
    var p = this.world.player;
    var blocks = this.world.blocks;
    for (var r of this.mp.remotes.values()) {
      var visible = r.container.visible && r.container.alpha >= 0.5;
      var platform = this.platforms.get(r.id);
      if (!visible) {
        if (platform) platform.alive = false;
        continue;
      }
      var fresh = !platform || !platform.main; // a level change destroys every block
      if (fresh) {
        platform = new HeadPlatform(this.world);
        this.platforms.set(r.id, platform);
      }
      platform.follow(r, fresh || platform.alive === false);
      platform.alive = true;
      // Standing on this player: ride along with them (like HorizontalBlock does).
      if (p.currentLandBlock === platform && (platform.dx || platform.dy)) {
        p.xPos += platform.dx;
        p.yPos += platform.dy;
        p.updatePositions();
      }
      blocks.push(platform);
    }
    // Being pushed: move at least as fast as the pusher, in its direction.
    if (now < this.pushedUntil && this.pushedVelocity) {
      var dir = Math.sign(this.pushedVelocity);
      if (p.xVelocity * dir < Math.abs(this.pushedVelocity)) p.xVelocity = this.pushedVelocity;
    }
    return true;
  }

  removePlatforms() {
    var blocks = this.world.blocks;
    if (!blocks) return;
    for (var platform of this.platforms.values()) {
      var i = blocks.indexOf(platform);
      if (i >= 0) blocks.splice(i, 1);
    }
  }

  // After WorldCreator.updateLogic moved the local player this frame: don't overlap anyone.
  resolve(now) {
    if (!this.active(now)) return;
    var p = this.world.player;
    for (var r of this.mp.remotes.values()) {
      if (!r.container.visible || r.container.alpha < 0.5) continue;
      var gx = r.container.x;
      var dx = p.xPos - gx;
      var overlapX = 2 * HALF_WIDTH - Math.abs(dx);
      var overlapY = HEIGHT - Math.abs(p.yPos - r.container.y);
      if (overlapX <= 0 || overlapY <= 2) continue; // (standing on its head is overlapY ≈ 0)
      var side = dx !== 0 ? Math.sign(dx) : -Math.sign(p.xVelocity) || 1; // which side of the ghost we are on
      if (p.xVelocity * side >= 0) continue; // not moving into it
      var speed = Math.abs(p.xVelocity);
      // Stay in contact: back out along the way we came (never further than this frame's
      // move, so never into a wall). The velocity is kept, so the run animation goes on.
      p.xPos += side * Math.min(overlapX, speed);
      p.updatePositions();
      if (speed >= MIN_PUSH_SPEED) this.push(r, -side * Math.min(speed, MAX_PUSH_SPEED), now);
    }
  }

  push(remote, velocity, now) {
    if (now - (this.lastPushAt.get(remote.id) || 0) < PUSH_SEND_MS) return;
    this.lastPushAt.set(remote.id, now);
    this.mp.connection.send({ t: "push", to: remote.id, x: Math.round(velocity * 100) / 100, y: 0 });
  }

  // Another player is pushing ours: move along with them for a moment.
  onPushed(msg) {
    var w = this.world;
    var p = w.player;
    var pusher = this.mp.remotes.get(msg.from);
    var now = performance.now();
    if (!this.enabled || !p || p.alive !== true || w.state !== this.mp.GameStates.Playing) return;
    if (!pusher || !pusher.container.visible) return; // not in the same level any more
    if (now - this.lastPushedAt > 600) SoundManager_1.SoundManager.playSFX("bounce1");
    this.lastPushedAt = now;
    this.pushedVelocity = msg.x;
    this.pushedUntil = now + PUSH_HOLD_MS;
  }

  removeRemote(id) {
    var platform = this.platforms.get(id);
    if (!platform) return;
    if (this.world.blocks) {
      var i = this.world.blocks.indexOf(platform);
      if (i >= 0) this.world.blocks.splice(i, 1);
    }
    if (platform.main) platform.destroy();
    this.platforms.delete(id);
  }
}

exports.Collisions = Collisions;
