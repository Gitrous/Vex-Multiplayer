// effects/Particle.js — recovered from webpack module #40 of the original vex7.min.js
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

exports.Particle = undefined;

_super = require("../entities/Entity").Entity;

__extends(Particle, _super);

Particle.prototype.spawnBase = function (t, e, i, n) {
  this.xPos = t;
  this.yPos = e;
  this.xVelocity = i;
  this.yVelocity = n;
  this.hitBoxPolygon = this.hitBox.toPolygon();
  this.fadeTime = 0;
  this.alive = true;
  this.water = false;
  this.onIce = false;
  this.updateHitBox();
};

Particle.prototype.updateHitBox = function () {
  this.hitBoxPolygon.pos.x = this.xPos - this.halfSize;
  this.hitBoxPolygon.pos.y = this.yPos - this.halfSize;
};

Particle.prototype.destroy = function (t) {
  if (t === undefined) {
    t = false;
  }
  this.hitBoxPolygon = null;
  this.hitBox = null;
  if (t) {
    --this.main.particleManager.particleUINum;
  } else {
    --this.main.particleManager.particleNum;
  }
  this.alive = false;
  _super.prototype.destroy.call(this);
};

Particle.prototype.multAlpha = function (t) {};

Particle.prototype.update = function () {
  if (
    this.alive &&
    (this.getWater(),
    this.water === true
      ? ((this.xPos += 0.1 * this.xVelocity),
        (this.yPos += 0.5 * this.yVelocity),
        this.liquid && ((this.yPos += 0.5 * this.yVelocity), this.yVelocity > -1) && (this.yVelocity -= 0.05))
      : ((this.xPos += this.xVelocity), (this.yPos += this.yVelocity)),
    this.collide === true &&
      this.yVelocity < 12 &&
      (this.water === true
        ? this.liquid === false && (this.yVelocity += 0.25 * this.main.gravity)
        : (this.yVelocity += this.main.gravity)),
    this.water === true || this.onIce === true ? (this.xVelocity *= 0.99) : (this.xVelocity *= 0.95),
    Math.abs(this.xVelocity) < 0.1 && (this.xVelocity = 0),
    this.collide === true)
  ) {
    this.runCollisions();
  }
};

Particle.prototype.runCollisions = function () {
  for (var t = 0; t < this.main.blocks.length; t++) {
    var e = this.main.blocks[t];
    if (e.alive !== false)
      if (SAT.testPolygonPolygon(this.hitBoxPolygon, e.topPolygon) !== true) {
        if (SAT.testPolygonPolygon(this.hitBoxPolygon, e.bottomPolygon) === true && this.yVelocity < 0) {
          this.yVelocity *= -0.5;
          this.yPos = e.bottomEdge;
          if (this.xVelocity > 0) {
            this.xVelocity -= 0.1;
          } else if (this.xVelocity < 0) {
            this.xVelocity += 0.1;
          }
          this.yPos += this.yVelocity;
        } else if (SAT.testPolygonPolygon(this.hitBoxPolygon, e.leftPolygon) !== true) {
          if (SAT.testPolygonPolygon(this.hitBoxPolygon, e.rightPolygon) !== true) {
            for (var i = 0, n = this.main.pools; i < n.length; i++) {
              var s = n[i];
              if (SAT.testPolygonPolygon(this.hitBoxPolygon, s.totalPolygon)) {
                if (this.liquid === true && this.water === false) return void this.destroy(this.isUI);
                if (this.water === false) {
                  this.yVelocity = 0;
                }
                this.water = true;
              }
            }
            if (this.liquid === true && this.water === false) return void this.destroy(this.isUI);
          } else {
            this.xVelocity *= -0.5;
            this.xPos = e.rightEdge + this.halfSize;
            this.xPos += this.xVelocity;
          }
        } else {
          this.xVelocity *= -0.5;
          this.xPos = e.leftEdge - this.halfSize;
          this.xPos += this.xVelocity;
        }
      } else {
        if (this.yVelocity >= 4) {
          this.yVelocity *= -0.25;
        } else if (this.yVelocity >= 1) {
          this.yVelocity = 0;
        }
        this.yPos = e.topEdge - this.halfSize;
        this.xPos += e.xVelocity;
        if (e.type === "speed") {
          this.xVelocity += e.speedInc;
        }
        if (e.type === "ice") {
          this.onIce = true;
        }
      }
  }
};

Particle.prototype.getWater = function () {
  this.water = false;
  for (var t = 0, e = this.main.pools; t < e.length; t++) {
    var i = e[t];
    if (SAT.testPolygonPolygon(this.hitBoxPolygon, i.totalPolygon)) {
      this.water = true;
      break;
    }
  }
};

var _Particle = Particle;

function Particle(t, e, i, n, s) {
  t = _super.call(this, t) || this;
  t.fadeAfter = 150;
  t.size = e;
  t.halfSize = t.size / 2;
  t.hitBox = new SAT.Box(new SAT.Vector(0, 0), e, e);
  t.collide = i;
  t.alive = false;
  t.fadeAfter = s;
  t.liquid = n;
  return t;
}

exports.Particle = _Particle;
