// objects/obstacles/Quadrant.js — recovered from webpack module #164 of the original vex7.min.js
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

exports.Quadrant = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(Quadrant, _super);

Quadrant.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.startRad = Tools_1.Tools.toRad(t.rotation);
  this.sprite.visible = true;
  var t = t.size / this.sprite.width;
  this.sprite.setScale(t, t);
  this.alive = true;
  var e = new SAT.Box(new SAT.Vector(0, 0), 10 * t, 10 * t).toPolygon();
  e.setOffset(new SAT.Vector(75 * t, 0));
  this.deathHitBoxPolygons.push(e);
  (e = new SAT.Box(new SAT.Vector(0, 0), 10 * t, 10 * t).toPolygon()).setOffset(new SAT.Vector(0, 75 * t));
  this.deathHitBoxPolygons.push(e);
  (e = new SAT.Box(new SAT.Vector(0, 0), 10 * t, 10 * t).toPolygon()).setOffset(new SAT.Vector(-75 * t, 0));
  this.deathHitBoxPolygons.push(e);
  (e = new SAT.Box(new SAT.Vector(0, 0), 10 * t, 10 * t).toPolygon()).setOffset(new SAT.Vector(0, -75 * t));
  this.deathHitBoxPolygons.push(e);
  this.updatePosition();
};

Quadrant.prototype.update = function () {
  this.sprite.rotation += this.rotSpeed;
  this.updatePosition();
  this.main.checkPlayerDeathByPolygons(this.deathHitBoxPolygons, PlayerBase_1.DeathType.quadrant);
};

Quadrant.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  for (var t = 0, e = this.deathHitBoxPolygons; t < e.length; t++) {
    var i = e[t];
    i.pos.x = this.xPos;
    i.pos.y = this.yPos;
    i.setAngle(this.sprite.rotation);
  }
};

Quadrant.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.deathHitBoxPolygons = null;
  _super.prototype.destroy.call(this);
};

Quadrant.prototype.resetLevel = function () {
  this.sprite.rotation = this.startRad;
  this.updatePosition();
};

var _Quadrant = Quadrant;

function Quadrant(t, e, i) {
  var n = _super.call(this, t, e) || this;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "quadrant 10000");
  e.add(n.sprite);
  n.sprite.visible = false;
  n.deathHitBoxPolygons = [];
  n.rotSpeed = Tools_1.Tools.toRad(i);
  return n;
}

exports.Quadrant = _Quadrant;
