// entities/Entity.js — recovered from webpack module #13 of the original vex7.min.js
"use strict";

function Entity(t) {
  this.alive = false;
  this.main = t;
}

Object.defineProperty(exports, "__esModule", { value: true });

exports.Entity = undefined;

Entity.prototype.update = function () {};

Entity.prototype.reset = function () {};

Entity.prototype.resetLevel = function () {
  if (this.startX !== undefined && this.startY !== undefined) {
    this.xPos = this.startX;
    this.yPos = this.startY;
  }
};

Entity.prototype.levelStart = function () {};

Entity.prototype.destroy = function () {
  this.main = null;
  if (this.boundsGraphic) {
    this.boundsGraphic.destroy();
  }
};

Entity.prototype.destroySelf = function () {
  this.destroy();
};

Entity.prototype.clearDebugGraphics = function () {
  if (!this.boundsGraphic) {
    this.boundsGraphic = new Phaser.GameObjects.Graphics(this.main);
    this.main.cameraGroup.add(this.boundsGraphic);
  }
  this.boundsGraphic.clear();
};

Entity.prototype.drawDebugPoly = function (t, e, i) {
  this.boundsGraphic.fillStyle(e, (i = i === undefined ? 0.3 : i));
  this.boundsGraphic.beginPath();
  for (var n = t.pos.x, s = t.pos.y, r = t.offset.x, o = t.offset.y, a = 0; a < t.points.length; a++) {
    var h = t.points[a];
    if (a === 0) {
      this.boundsGraphic.moveTo(n + h.x + r, s + h.y + o);
    } else {
      this.boundsGraphic.lineTo(n + h.x + r, s + h.y + o);
    }
  }
  this.boundsGraphic.fillPath();
};

Entity.prototype.drawDebugPolyLine = function (t, e, i) {
  this.boundsGraphic.lineStyle(2, e, (i = i === undefined ? 0.3 : i));
  this.boundsGraphic.beginPath();
  for (var n = t.pos.x, s = t.pos.y, r = t.offset.x, o = t.offset.y, a = 0; a < t.points.length; a++) {
    var h = t.points[a];
    if (a === 0) {
      this.boundsGraphic.moveTo(n + h.x + r, s + h.y + o);
    } else {
      this.boundsGraphic.lineTo(n + h.x + r, s + h.y + o);
    }
  }
  this.boundsGraphic.closePath();
  this.boundsGraphic.strokePath();
};

exports.Entity = Entity;
