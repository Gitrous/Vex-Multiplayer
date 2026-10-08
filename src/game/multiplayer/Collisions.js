// Player-vs-player collisions, when the room's "collisions" setting is on.
//
// Every client only moves its own player, so a collision is handled on both ends:
// - Standing on others: each other player's ghost carries an invisible platform on its
//   head (HeadPlatform, a real game Block). It is put into world.blocks only while the
//   local player's update runs, so the game's own block physics lets the player land on it,
//   jump off it and be carried along, while lasers, bullets, particles... never see it.
//   It is one-way: only its top is solid, and only for a player above it. A ghost lags
//   behind and can sink into the player below it; a solid underside then made the game
//   treat it as a ceiling coming down (pushing that player through the floor, or killing
//   them as "squashed" against it).
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
var LAND_REACH_X = HALF_WIDTH + 2; // the game only lands a player whose centre is over the block
var ABOVE_TOLERANCE = 2; // feet this far below a head's top (plus one step's fall) still count as "on it"
var RIDE_MAX_STEP = 48; // a ghost moving more than this in one step teleported (respawn...): don't drag its rider

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

  // Only the top counts (landing). Everything else is moved out of reach: the underside (a
  // ceiling for the player below: with the ghost's lag it could "come down" on them), the
  // walls (running into a player is left to resolve(), which turns it into a push), the
  // ledges (no hanging from a head) and the whole box (the game's "is there a block here?").
  initOffsets() {
    super.initOffsets();
    var away = new SAT.Vector(0, 1e6);
    this.bottomPolygon.setOffset(away);
    this.leftPolygon.setOffset(away);
    this.rightPolygon.setOffset(away);
    this.lhPolygon.setOffset(away);
    this.rhPolygon.setOffset(away);
    this.totalPolygon.setOffset(away);
  }

  // Moves onto the ghost's head; dx/dy are this step's move. Its velocity stays 0: the rider is
  // carried by Collisions.carry (the game would add a block's velocity on landing as well).
  follow(remote, snap) {
    var x = remote.container.x;
    var y = remote.container.y - HEIGHT + HEAD_PLATFORM_HEIGHT / 2;
    this.dx = snap ? 0 : x - this.xPos;
    this.dy = snap ? 0 : y - this.yPos;
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
      var undo = self.beforePlayerUpdate(performance.now());
      try {
        return update.apply(this, arguments);
      } finally {
        if (undo) self.afterPlayerUpdate(undo);
      }
    };
  }

  // In the middle of something the game moves the player through on its own (swimming,
  // ropes, ziplines, cannons, ledges...): no heads to land on, no pushes.
  busy(p) {
    return !!(
      p.swimming ||
      p.climb ||
      p.hanging ||
      p.scaling ||
      p.kicking ||
      p.grapplingHook ||
      p.disableCollision ||
      p.currentZipline ||
      p.currentCannon ||
      p.currentPole ||
      p.currentRope ||
      p.currentKite
    );
  }

  // A ghost others can touch: drawn in this level and not fading out (dying, respawning).
  solid(remote) {
    return remote.container.visible && remote.container.alpha >= 0.5;
  }

  // Returns what afterPlayerUpdate has to undo, or null.
  beforePlayerUpdate(now) {
    if (!this.active(now)) return null;
    var p = this.world.player;
    if (this.busy(p)) return null;
    var blocks = this.world.blocks;
    var undo = { added: false, canDieByFalling: undefined };
    for (var r of this.mp.remotes.values()) {
      var platform = this.platforms.get(r.id);
      if (!this.solid(r)) {
        if (platform) platform.alive = false;
        continue;
      }
      var fresh = !platform || !platform.main; // a level change destroys every block
      if (fresh) {
        platform = new HeadPlatform(this.world);
        this.platforms.set(r.id, platform);
      }
      var riding = !fresh && platform.alive && p.currentLandBlock === platform && p.falling === false;
      platform.follow(r, fresh || platform.alive === false);
      platform.alive = true;
      if (riding) this.carry(p, platform);
      // One-way: the head is there only for a player above it, over it. The game checks blocks
      // against where the player was before its last move, so a falling player lands the step
      // after reaching the top: allow one step's fall below it.
      var below = p.yPos - platform.topEdge;
      if (Math.abs(p.xPos - platform.xPos) >= LAND_REACH_X || below > ABOVE_TOLERANCE + Math.max(0, p.yVelocity)) {
        continue;
      }
      blocks.push(platform);
      undo.added = true;
      // Landing on somebody's head is soft: falling onto it is never a "hard landing" death
      // (the game kills a player who reaches a block faster than fallingMax). Only for the
      // step that reaches it, so a long fall elsewhere still counts.
      var reach = platform.topEdge - p.yPos;
      if (reach <= p.yVelocity + this.world.gravity + 4 && p.yVelocity + this.world.gravity > p.fallingMax) {
        if (undo.canDieByFalling === undefined) undo.canDieByFalling = p.canDieByFalling;
        p.canDieByFalling = false;
      }
    }
    // Being pushed: move at least as fast as the pusher, in its direction.
    if (now < this.pushedUntil && this.pushedVelocity) {
      var dir = Math.sign(this.pushedVelocity);
      if (p.xVelocity * dir < Math.abs(this.pushedVelocity)) p.xVelocity = this.pushedVelocity;
    }
    return undo;
  }

  afterPlayerUpdate(undo) {
    if (undo.added) this.removePlatforms();
    if (undo.canDieByFalling !== undefined) this.world.player.canDieByFalling = undo.canDieByFalling;
  }

  // Standing on this player: move along with them, as the game's moving blocks do. Not when
  // they teleported (respawn) or when it would put the rider inside a wall or a ceiling: then
  // the rider stays put, loses their footing and falls off.
  carry(p, platform) {
    var dx = platform.dx;
    var dy = platform.dy;
    if (!dx && !dy) return;
    if (Math.abs(dx) <= RIDE_MAX_STEP && Math.abs(dy) <= RIDE_MAX_STEP) {
      p.xPos += dx;
      p.yPos += dy;
      if (!this.insideBlock(p)) {
        p.updatePositions();
        return;
      }
      p.xPos -= dx;
      p.yPos -= dy;
    }
    p.currentLandBlock = null;
  }

  // Is the player's body (head, left and right side) inside one of the level's blocks?
  insideBlock(p) {
    var points = [
      new SAT.Vector(p.xPos, p.yPos - HEIGHT + 2),
      new SAT.Vector(p.xPos - HALF_WIDTH + 2, p.yPos - HEIGHT / 2),
      new SAT.Vector(p.xPos + HALF_WIDTH - 2, p.yPos - HEIGHT / 2),
    ];
    for (var b of this.world.blocks) {
      if (b.alive === false || b instanceof HeadPlatform || !b.totalPolygon) continue;
      for (var pt of points) if (SAT.pointInPolygon(pt, b.totalPolygon)) return true;
    }
    return false;
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
    if (this.busy(p)) return;
    for (var r of this.mp.remotes.values()) {
      if (!this.solid(r)) continue;
      var gx = r.container.x;
      var dx = p.xPos - gx;
      var overlapX = 2 * HALF_WIDTH - Math.abs(dx);
      // Side by side only: when one is mostly above the other (standing on a head, or a
      // lagging ghost sunk into it) neither holds back nor pushes the other.
      if (overlapX <= 0 || Math.abs(p.yPos - r.container.y) >= HEIGHT / 2) continue;
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
    if (!this.enabled || !p || p.alive !== true || w.state !== this.mp.GameStates.Playing || this.busy(p)) return;
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
