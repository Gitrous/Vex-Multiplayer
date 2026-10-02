// Another player in the room, drawn as a copy of the local player's spine skeleton that
// replays the snapshots they send. Positions are interpolated INTERP_DELAY_MS in the
// past so movement stays smooth between the ~15 snapshots per second.
"use strict";

var jd_1 = require("../jd");
var data_1 = require("../data");
var Helpers_1 = require("../utils/Helpers");
var protocol = require("./protocol");

var INTERP_DELAY_MS = 120;
var MAX_BUFFER = 30;
var LABEL_OFFSET_Y = 44; // above the head: the player's origin is at its feet, head top at about -33
var GHOST_ALPHA = 0.85;
var BUBBLE_MS = 3000; // how long a chat message stays over the player: this, plus
var BUBBLE_MS_PER_CHAR = 60; // a bit per character,
var BUBBLE_MAX_MS = 7000; // up to this
var BUBBLE_MAX_CHARS = 60;

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpAngle(a, b, t) {
  var d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
}

class RemotePlayer {
  constructor(scene, info) {
    this.scene = scene;
    this.id = info.id;
    this.slot = info.slot;
    this.name = info.name;
    this.color = protocol.PLAYER_COLORS[info.slot % protocol.PLAYER_COLORS.length];
    this.snapshots = []; // { at, s }
    this.current = null; // snapshot whose discrete fields (animation, skin...) are applied
    this.anim = null;
    this.skin = null;

    this.container = new Phaser.GameObjects.Container(scene);
    this.container.visible = false;
    this.spine = new jd_1.JDSpineGameObject(scene, 0, 0, "player");
    this.spine.getView().alpha = GHOST_ALPHA;
    this.container.add(this.spine.getView());

    this.label = new Phaser.GameObjects.BitmapText(scene, 0, 0, data_1.Fonts.Garet, this.name, 14);
    this.label.setOrigin(0.5, 1);
    this.label.setTint(this.color);
    this.label.setDropShadow(1, 1, 0x000000, 0.8);
    this.label.visible = false;

    // Chat bubble over the name label (RemotePlayer.say).
    this.bubbleText = new Phaser.GameObjects.BitmapText(scene, 0, 0, data_1.Fonts.Garet, "", 12);
    this.bubbleText.setMaxWidth(150);
    this.bubbleText.setTint(0x222222);
    this.bubbleBg = new Phaser.GameObjects.Graphics(scene);
    this.bubble = new Phaser.GameObjects.Container(scene, 0, 0, [this.bubbleBg, this.bubbleText]);
    this.bubble.visible = false;
    this.sayUntil = 0;
    scene.layerPlayer.add(this.bubble);

    // Below the local player, which is already in this layer.
    scene.layerPlayer.addAt(this.label, 0);
    scene.layerPlayer.addAt(this.container, 0);

    if (info.last) this.push(info.last, performance.now() - INTERP_DELAY_MS);
  }

  get level() {
    return this.current ? this.current.l : "";
  }

  say(text) {
    var chars = Array.from(text); // code points: don't cut an emoji in half
    if (chars.length > BUBBLE_MAX_CHARS) text = chars.slice(0, BUBBLE_MAX_CHARS - 1).join("") + "…";
    this.bubbleText.setText(text);
    var b = this.bubbleText.getTextBounds().local;
    var w = Math.max(b.width, 8) + 10;
    var h = b.height + 8;
    // Container origin = bottom centre of the bubble.
    this.bubbleText.setPosition(-b.width / 2, -h + 4);
    this.bubbleBg.clear();
    this.bubbleBg.fillStyle(0xffffff, 0.92);
    this.bubbleBg.lineStyle(1.5, this.color, 1);
    this.bubbleBg.fillRoundedRect(-w / 2, -h, w, h, 5);
    this.bubbleBg.strokeRoundedRect(-w / 2, -h, w, h, 5);
    this.sayUntil = performance.now() + Math.min(BUBBLE_MAX_MS, BUBBLE_MS + text.length * BUBBLE_MS_PER_CHAR);
  }

  // After the labels were stacked (Multiplayer.update): sit the bubble on the label.
  placeBubble(now) {
    this.bubble.visible = this.label.visible && now < this.sayUntil;
    if (!this.bubble.visible) return;
    this.bubble.x = this.label.x;
    this.bubble.y = this.label.y - this.label.height - 2;
  }

  setName(name) {
    this.name = name;
    this.label.setText(name);
  }

  push(s, at) {
    // A level change teleports: don't interpolate across it.
    var last = this.snapshots[this.snapshots.length - 1];
    if (last && last.s.l !== s.l) this.snapshots.length = 0;
    this.snapshots.push({ at: at === undefined ? performance.now() : at, s: s });
    if (this.snapshots.length > MAX_BUFFER) this.snapshots.shift();
  }

  // mapPosition(snapshot) -> {x, y} on this screen, or null if it can't be placed.
  update(now, localLevel, mapPosition) {
    var renderAt = now - INTERP_DELAY_MS;
    var buf = this.snapshots;
    if (!buf.length) return;
    // Keep buf[0] = latest snapshot at or before renderAt; buf[1], if any, is after it.
    while (buf.length >= 2 && buf[1].at <= renderAt) buf.shift();
    var a = buf[0];
    var b = buf[1];
    this.applyDiscrete(a.s);

    var s = a.s;
    var pa = mapPosition(s);
    var pb = b && mapPosition(b.s);
    var x = pa ? pa.x : 0;
    var y = pa ? pa.y : 0;
    var r = s.r;
    if (pa && pb && b.at > a.at && renderAt > a.at) {
      var t = Math.min(1, (renderAt - a.at) / (b.at - a.at));
      x = lerp(pa.x, pb.x, t);
      y = lerp(pa.y, pb.y, t);
      r = lerpAngle(s.r, b.s.r, t);
    }

    var visible = !!pa && s.v === 1 && !!s.l && s.l === localLevel;
    this.container.visible = visible;
    this.label.visible = visible;
    if (!visible) return;
    this.container.x = x;
    this.container.y = y;
    this.container.rotation = r;
    this.label.x = x;
    this.label.y = y - LABEL_OFFSET_Y * Math.abs(s.cy || 1);
  }

  applyDiscrete(s) {
    if (this.current === s) return;
    var prev = this.current;
    this.current = s;
    var view = this.spine.getView();
    if (s.k !== this.skin && typeof s.k === "number") {
      this.skin = s.k;
      this.spine.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(s.k));
    }
    // New animation, or a one-shot animation that started over.
    var restarted = prev && !s.lp && s.a === this.anim && s.p + 0.2 < prev.p;
    if (s.a && (s.a !== this.anim || restarted)) {
      try {
        this.spine.playFromProgress(s.a, s.p || 0, !!s.lp, s.ts === undefined ? 1 : s.ts);
        this.anim = s.a;
      } catch (e) {
        this.anim = null; // unknown animation name: keep the previous pose
      }
    } else if (typeof s.ts === "number" && view.timeScale !== s.ts) {
      view.timeScale = s.ts;
    }
    view.scaleX = s.sx;
    view.scaleY = s.sy;
    view.x = s.ox;
    view.y = s.oy;
    this.container.scaleX = s.cx === undefined ? 1 : s.cx;
    this.container.scaleY = s.cy === undefined ? 1 : s.cy;
    this.container.alpha = s.al === undefined ? 1 : s.al;
  }

  destroy() {
    this.scene.layerPlayer.remove(this.container, true);
    this.scene.layerPlayer.remove(this.label, true);
    this.scene.layerPlayer.remove(this.bubble, true);
    this.spine.destroy();
  }
}

exports.RemotePlayer = RemotePlayer;
exports.INTERP_DELAY_MS = INTERP_DELAY_MS;
