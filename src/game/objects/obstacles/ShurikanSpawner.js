// objects/obstacles/ShurikanSpawner.js — recovered from webpack module #168 of the original vex7.min.js
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

exports.ShurikanSpawner = undefined;

var Obstacle_1 = require("./Obstacle"),
  obstacles_1 = require("."),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Obstacle_1.Obstacle;

__extends(ShurikanSpawner, _super);

ShurikanSpawner.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.cooldown = 0;
  this.spawned = 0;
  this.alive = true;
  for (var e = 0; e < this.shurikanPool.length; e++) this.shurikanPool[e].resetLevel();
};

ShurikanSpawner.prototype.update = function () {
  var t, e, i, n;
  if (this.alive === true && this.spawned < 3 && ((this.cooldown += 1), this.cooldown > this.fireTimer)) {
    this.cooldown = 0;
    t = this.shurikanPool[this.spawned];
    e = 1.3 * Math.cos(this.sprite.rotation);
    i = 1.3 * Math.sin(this.sprite.rotation);
    n = 0;
    if (this.sprite.rotation === Tools_1.Tools.PI05 || this.sprite.rotation === -Tools_1.Tools.PI05) {
      n = 1;
    } else if (this.sprite.rotation !== 0 && this.sprite.rotation !== -Math.PI && this.sprite.rotation !== Math.PI) {
      n = 2;
    }
    t.spawn(this.xPos, this.yPos, e / 2, i / 2, n);
    this.spawned += 1;
    if (this.spawned === 3) {
      this.cooldown = -120;
    }
  }
};

ShurikanSpawner.prototype.resetLevel = function () {
  this.spawned = 0;
  this.cooldown = 0;
};

ShurikanSpawner.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.shurikanPool = null;
  _super.prototype.destroy.call(this);
};

ShurikanSpawner.prototype.destroySelf = function () {
  for (; this.shurikanPool.length > 0;) this.shurikanPool.shift().destroySelf();
  _super.prototype.destroySelf.call(this);
};

var _ShurikanSpawner = ShurikanSpawner;

function ShurikanSpawner(t, e) {
  var i = _super.call(this, t, e) || this;
  i.fireTimer = 60;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "shurikanSpawner 10000");
  e.add(i.sprite);
  i.shurikanPool = [];
  for (var n = 0; n < 3; n++) {
    var s = new obstacles_1.ShurikanHorizontal(i.main, e, i);
    i.shurikanPool.push(s);
    i.main.obstacles.push(s);
  }
  return i;
}

exports.ShurikanSpawner = _ShurikanSpawner;
