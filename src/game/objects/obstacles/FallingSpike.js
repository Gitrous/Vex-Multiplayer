// objects/obstacles/FallingSpike.js — recovered from webpack module #162 of the original vex7.min.js
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

exports.FallingSpike = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(FallingSpike, _super);

FallingSpike.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.sprite.visible = false;
  if ((this.alive = false) === this.dispenser) {
    this.sprite.visible = true;
    this.alive = true;
  }
  this.deathBoxPolygon.setAngle(this.sprite.rotation);
  this.updatePosition();
  this.falling = false;
  this.fallDist = 0;
  this.speed = 0;
};

FallingSpike.prototype.levelStart = function () {
  var t = this.sprite.rotation + Tools_1.Tools.PI05;
  this.radCos = Math.cos(t);
  this.radSin = Math.sin(t);
  this.hitDist = this.main.raycastToClosestBlock(this.startX, this.startY, this.radCos, this.radSin, 350);
  if (this.dispenser === false) {
    this.searchHitBox = new SAT.Box(new SAT.Vector(this.startX, this.startY), this.hitDist, 16).toPolygon();
    this.searchHitBox.setOffset(new SAT.Vector(0, -8));
    this.searchHitBox.setAngle(t);
  }
};

FallingSpike.prototype.update = function () {
  var t, e;
  if (this.alive !== false) {
    if (this.falling === true) {
      this.xVelocity += this.radCos * this.gravity;
      this.yVelocity += this.radSin * this.gravity;
      this.speed += this.gravity;
      this.xPos += this.xVelocity;
      this.yPos += this.yVelocity;
      this.fallDist += this.speed;
      this.updatePosition();
      if (this.fallDist > this.hitDist) {
        this.reset();
      }
      this.main.checkPlayerDeathByPolygon(this.deathBoxPolygon, PlayerBase_1.DeathType.spike);
    } else {
      if (!(this.xPos === this.startX && this.yPos === this.startY)) {
        t = this.startX - this.xPos;
        e = this.startY - this.yPos;
        if (Math.abs(t) < 1) {
          this.xPos = this.startX;
        } else {
          this.xPos += t / 10;
        }
        if (Math.abs(e) < 1) {
          this.yPos = this.startY;
        } else {
          this.yPos += (this.startY - this.yPos) / 10;
        }
        this.updatePosition();
      }
      this.falling = SAT.testPolygonPolygon(this.searchHitBox, this.main.player.totalPolygon);
    }
  }
};

FallingSpike.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathBoxPolygon.pos.x = this.xPos;
  this.deathBoxPolygon.pos.y = this.yPos;
};

FallingSpike.prototype.reset = function () {
  if (this.dispenser === false) {
    this.falling = false;
    this.xPos = this.startX - this.radCos * this.height;
    this.yPos = this.startY - this.radSin * this.height;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.sprite.x = this.xPos;
    this.sprite.y = this.yPos;
    this.deathBoxPolygon.pos.x = this.xPos;
    this.deathBoxPolygon.pos.y = this.yPos;
    this.fallDist = 0;
    this.speed = 0;
  } else {
    this.die();
  }
};

FallingSpike.prototype.dispenserFire = function () {
  this.falling = true;
  this.alive = true;
  this.xPos = this.startX + this.radCos * this.height;
  this.yPos = this.startY + this.radSin * this.height;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.visible = true;
  this.deathBoxPolygon.pos.x = this.xPos;
  this.deathBoxPolygon.pos.y = this.yPos;
  this.fallDist = 0;
  this.speed = 0;
};

FallingSpike.prototype.die = function () {
  this.sprite.visible = false;
  this.alive = false;
};

FallingSpike.prototype.destroy = function () {
  if (this.sprite) {
    this.sprite.destroy();
  }
  this.sprite = null;
  this.searchHitBox = null;
  this.deathBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

FallingSpike.prototype.resetLevel = function () {
  this.reset();
};

var _FallingSpike = FallingSpike;

function FallingSpike(t, e, i) {
  if (i === undefined) {
    i = false;
  }
  var n = _super.call(this, t, e) || this;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "fallingSpike 10000");
  e.add(n.sprite);
  n.sprite.visible = false;
  n.dispenser = i;
  n.width = 12;
  n.height = 18;
  var e = n.width / 2,
    i = n.height / 2;
  n.deathBoxPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(-e, -i),
    new SAT.Vector(e, -i),
    new SAT.Vector(e, i),
    new SAT.Vector(-e, i),
  ]);
  n.gravity = 0.6 * t.gravity;
  return n;
}

exports.FallingSpike = _FallingSpike;
