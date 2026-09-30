// objects/blocks/PushBlock.js — recovered from webpack module #194 of the original vex7.min.js
"use strict";

var n,
  _super,
  __extends =
    (this && this.__extends) ||
    ((n = function (t, e) {
      return (n =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array
          ? function (t, e) {
              t.__proto__ = e;
            }
          : function (t, e) {
              for (var i in e) {
                if (Object.prototype.hasOwnProperty.call(e, i)) {
                  t[i] = e[i];
                }
              }
            }))(t, e);
    }),
    function (t, e) {
      if (typeof e != "function" && e !== null)
        throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
      function i() {
        this.constructor = t;
      }
      n(t, e);
      t.prototype = e === null ? Object.create(e) : ((i.prototype = e.prototype), new i());
    });

Object.defineProperty(exports, "__esModule", { value: true });

exports.PushBlock = undefined;

var data_1 = require("../../data");

_super = require("./BlockBehavior").BlockBehavior;

__extends(PushBlock, _super);

PushBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.pushingRight = false;
  this.pushingLeft = false;
  this.pushed = false;
  this.inWater = false;
  this.onIce = false;
  this.stuckLeft = false;
  this.stuckRight = false;
  this.land = false;
};

PushBlock.prototype.checkBlockCollisions = function () {
  this.land = false;
  this.onIce = false;
  for (var t = 0, e = this.main.blocks; t < e.length; t++) {
    var i = e[t];
    if (i.alive !== false) {
      if (SAT.testPolygonPolygon(i.topPolygon, this.bottomPolygon) !== true) {
        if ((this.yVelocity < 0 || i.yVelocity > 0) && SAT.testPolygonPolygon(this.topPolygon, i.bottomPolygon)) {
          if (this.yVelocity < 0) {
            this.yVelocity *= 0.5;
          }
          this.yPos = i.bottomEdge + this.halfHeight;
        } else if (this.xVelocity - i.xVelocity < 0 && SAT.testPolygonPolygon(this.leftPolygon, i.rightPolygon)) {
          this.xVelocity = 0;
          this.xPos = i.rightEdge + this.halfWidth;
        } else if (this.xVelocity - i.xVelocity > 0 && SAT.testPolygonPolygon(this.rightPolygon, i.leftPolygon)) {
          this.xVelocity = 0;
          this.xPos = i.leftEdge - this.halfWidth;
        }
      } else {
        if (i.type === "ice") {
          this.onIce = true;
        }
        this.yVelocity = i.yVelocity;
        if (this.inWater) {
          this.yVelocity *= -1;
          this.yPos = i.topEdge - this.halfHeight;
        } else if (this.yVelocity > 0) {
          this.yPos = i.topEdge - this.halfHeight + this.yVelocity;
        } else {
          this.yPos = i.topEdge - this.halfHeight + 1;
        }
        this.land = true;
        this.updatePosition();
        if (i.type === "speed") {
          this.xVelocity += 0.4 * i.speedInc;
        } else if (!(i.type !== "falling" || (i = i).falling)) {
          i.falling = true;
          i.yVelocity = -2;
        }
      }
    }
  }
};

PushBlock.prototype.checkWaterCollisions = function () {
  var t = this.inWater;
  this.inWater = false;
  for (var e = 0; e < this.main.pools.length; e++) {
    var i = this.main.pools[e];
    if (
      SAT.testPolygonPolygon(this.totalPolygon, i.totalPolygon) &&
      (this.layer.remove(this.sprite), this.main.layerUnderPool.add(this.sprite), this.yPos > i.yPos - 0.5 * i.height)
    ) {
      if (!t) {
        this.yVelocity;
      }
      --this.yVelocity;
      if (this.yVelocity < -3) {
        this.yVelocity = -3;
      }
      this.inWater = true;
    }
  }
};

PushBlock.prototype.checkTrapped = function () {
  for (
    var t = new SAT.Vector(this.leftEdge - 5, this.topEdge + 10),
      e = new SAT.Vector(this.rightEdge + 5, this.topEdge + 10),
      i = 0,
      n = this.main.blocks;
    i < n.length;
    i++
  ) {
    var s = n[i];
    if (s.alive !== false) {
      if (SAT.pointInPolygon(t, s.totalPolygon)) {
        this.stuckLeft = true;
        return "left";
      }
      if (SAT.pointInPolygon(e, s.totalPolygon)) {
        this.stuckRight = true;
        return "right";
      }
    }
  }
  return "not trapped";
};

PushBlock.prototype.update = function () {
  if (!this.land) {
    this.yVelocity += this.main.gravity;
  }
  this.xPos += this.xVelocity;
  this.yPos += this.yVelocity;
  if (this.landed) {
    this.main.player.xPos += this.xVelocity;
    this.main.player.updatePositions();
  }
  if (this.onIce) {
    this.xVelocity -= 0.01 * this.xVelocity;
  } else {
    this.xVelocity -= 0.25 * this.xVelocity;
  }
  this.checkBlockCollisions();
  this.checkWaterCollisions();
  this.updatePosition();
};

PushBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

PushBlock.prototype.reset = function () {
  this.layer.add(this.sprite);
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.pushed = false;
  this.pushingLeft = false;
  this.pushingRight = false;
  this.updatePosition();
  _super.prototype.reset.call(this);
};

PushBlock.prototype.resetLevel = function () {
  this.reset();
};

PushBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _PushBlock = PushBlock;

function PushBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "pushBlock 10000");
  e.add(i.sprite);
  i.type = "push";
  return i;
}

exports.PushBlock = _PushBlock;
