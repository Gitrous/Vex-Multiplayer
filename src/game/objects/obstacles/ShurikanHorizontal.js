// objects/obstacles/ShurikanHorizontal.js — recovered from webpack module #167 of the original vex7.min.js
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

exports.ShurikanHorizontal = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(ShurikanHorizontal, _super);

ShurikanHorizontal.prototype.spawn = function (t, e, i, n, s) {
  if (s === undefined) {
    s = 0;
  }
  this.xPos = t;
  this.yPos = e;
  this.xVelocity = i;
  this.yVelocity = n;
  this.speed = Math.sqrt(i * i + n * n);
  this.dist = 0;
  this.sprite.setScale(1, 1);
  this.sprite.setFrame("shurikanHorizontal 1000" + s);
  this.sprite.visible = true;
  this.alive = true;
  this.sprite.rotation = 0;
  this.updatePosition();
};

ShurikanHorizontal.prototype.update = function () {
  if (this.alive) {
    this.sprite.rotation += 0.122173;
    if (this.dist > 200) {
      this.sprite.scaleX -= 0.05;
      this.sprite.scaleY = this.sprite.scaleX;
      if (this.sprite.scaleX <= 0.1) {
        this.alive = false;
        this.resetLevel();
        --this.spawner.spawned;
      }
    } else {
      this.xPos += this.xVelocity;
      this.yPos += this.yVelocity;
      this.dist += this.speed;
    }
    this.updatePosition();
    this.main.checkPlayerDeathByPolygon(this.hitBoxPoly, PlayerBase_1.DeathType.shurikan);
  }
};

ShurikanHorizontal.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPoly.pos.x = this.xPos;
  this.hitBoxPoly.pos.y = this.yPos;
};

ShurikanHorizontal.prototype.resetLevel = function () {
  this.sprite.visible = false;
  this.alive = false;
};

ShurikanHorizontal.prototype.destroy = function () {
  this.alive = false;
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPoly = null;
  this.spawner = null;
  _super.prototype.destroy.call(this);
};

var _ShurikanHorizontal = ShurikanHorizontal;

function ShurikanHorizontal(t, e, i) {
  var n = _super.call(this, t, e) || this;
  n.spawner = i;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "shurikanHorizontal 10000");
  e.add(n.sprite);
  n.sprite.visible = false;
  n.hitBoxPoly = new SAT.Box(new SAT.Vector(-3001, 0), 20, 20).toPolygon();
  n.hitBoxPoly.setOffset(new SAT.Vector(-10, -10));
  return n;
}

exports.ShurikanHorizontal = _ShurikanHorizontal;
