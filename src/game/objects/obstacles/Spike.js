// objects/obstacles/Spike.js — recovered from webpack module #22 of the original vex7.min.js
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

exports.Spike = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(Spike, _super);

Spike.prototype.init = function (t, e) {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, t);
  this.layer.add(this.sprite);
  this.width = 10 * e;
  this.height = 18;
};

Spike.prototype.levelStart = function () {
  for (var t = 0, e = this.main.pools; t < e.length; t++) {
    var i = e[t];
    if (SAT.testPolygonPolygon(this.deathBoxPolygon, i.totalPolygon)) {
      this.layer.remove(this.sprite);
      this.main.layerUnderPool.add(this.sprite);
    }
  }
};

Spike.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.alive = true;
  this.sprite.visible = true;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  var t = Math.cos(this.sprite.rotation),
    e = Math.sin(this.sprite.rotation),
    i = 0.5 * this.width,
    n = 0.5 * this.height;
  this.deathBoxPolygon = new SAT.Polygon(new SAT.Vector(this.xPos, this.yPos), [
    new SAT.Vector(-i * t - -n * e, -i * e + -n * t),
    new SAT.Vector(i * t - -n * e, i * e + -n * t),
    new SAT.Vector(i * t - n * e, i * e + n * t),
    new SAT.Vector(-i * t - n * e, -i * e + n * t),
  ]);
};

Spike.prototype.update = function () {
  this.main.checkPlayerDeathByPolygon(this.deathBoxPolygon, PlayerBase_1.DeathType.spike);
};

Spike.prototype.movePosition = function (t, e) {
  this.xPos = t;
  this.yPos = e;
  this.updatePosition();
};

Spike.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathBoxPolygon.pos.x = this.xPos;
  this.deathBoxPolygon.pos.y = this.yPos;
};

Spike.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.deathBoxPolygon = null;
};

var _Spike = Spike;

function Spike(t, e) {
  t = _super.call(this, t, e) || this;
  t.init("spike 10000", 1);
  return t;
}

exports.Spike = _Spike;
