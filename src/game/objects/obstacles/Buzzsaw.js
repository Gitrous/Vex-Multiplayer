// objects/obstacles/Buzzsaw.js — recovered from webpack module #30 of the original vex7.min.js
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

exports.Buzzsaw = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(Buzzsaw, _super);

Buzzsaw.prototype.levelStart = function () {
  if (this.checkUnderPool !== false)
    for (var t = 0, e = this.main.pools; t < e.length; t++) {
      var i = e[t];
      if (SAT.testCirclePolygon(this.deathCircle, i.totalPolygon) === true) {
        this.layer.remove(this.sprite);
        this.main.layerUnderPool.add(this.sprite);
        this.checkUnderPool = false;
        break;
      }
    }
};

Buzzsaw.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.sprite.visible = true;
  this.updatePosition();
  this.alive = true;
  t = t.size / 100;
  this.sprite.setScale(t, t);
  this.deathCircle.r = 44 * t;
};

Buzzsaw.prototype.update = function () {
  this.sprite.rotation += this.speedRot;
  this.main.checkPlayerDeathByCircle(this.deathCircle, PlayerBase_1.DeathType.buzzsaw);
};

Buzzsaw.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathCircle.pos.x = this.xPos;
  this.deathCircle.pos.y = this.yPos;
};

Buzzsaw.prototype.destroy = function () {
  this.sprite.destroy();
  this.deathCircle = null;
  _super.prototype.destroy.call(this);
};

var _Buzzsaw = Buzzsaw;

function Buzzsaw(t, e) {
  var i = _super.call(this, t, e) || this;
  i.checkUnderPool = true;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "buzzsaw 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.deathCircle = new SAT.Circle(new SAT.Vector(0, 0), 44);
  i.speedRot = Tools_1.Tools.toRad(2);
  return i;
}

exports.Buzzsaw = _Buzzsaw;
