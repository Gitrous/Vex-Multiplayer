// objects/obstacles/Reaper.js — recovered from webpack module #165 of the original vex7.min.js
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

exports.Reaper = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(Reaper, _super);

Reaper.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.startRad = Tools_1.Tools.toRad(t.rotation);
  var t = t.size / this.sprite.width;
  this.sprite.setScale(t, t);
  this.sprite.visible = true;
  this.alive = true;
  this.deathHitBoxes = [];
  var e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 27 * t, 17 * t).toPolygon();
  e.setOffset(new SAT.Vector(-27 * t, -150 * t));
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 13 * t, 13 * t).toPolygon()).setOffset(
    new SAT.Vector(-84 * t, -130 * t),
  );
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 6 * t, 6 * t).toPolygon()).setOffset(
    new SAT.Vector(-118 * t, -92 * t),
  );
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 3 * t, 3 * t).toPolygon()).setOffset(
    new SAT.Vector(-132 * t, -52 * t),
  );
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 27 * t, 17 * t).toPolygon()).setOffset(
    new SAT.Vector(-27 * t, -150 * t),
  );
  e.setAngle(Math.PI);
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 13 * t, 13 * t).toPolygon()).setOffset(
    new SAT.Vector(-84 * t, -130 * t),
  );
  e.setAngle(Math.PI);
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 6 * t, 6 * t).toPolygon()).setOffset(
    new SAT.Vector(-118 * t, -92 * t),
  );
  e.setAngle(Math.PI);
  this.deathHitBoxes.push(e);
  (e = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 3 * t, 3 * t).toPolygon()).setOffset(
    new SAT.Vector(-132 * t, -52 * t),
  );
  e.setAngle(Math.PI);
  this.deathHitBoxes.push(e);
  this.updatePosition();
};

Reaper.prototype.update = function () {
  this.sprite.rotation -= this.rotSpeed;
  this.updatePosition();
  this.main.checkPlayerDeathByPolygons(this.deathHitBoxes, PlayerBase_1.DeathType.reaper);
};

Reaper.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  for (var t = 0; t < this.deathHitBoxes.length; t++) {
    var e = this.deathHitBoxes[t];
    if (t < 4) {
      e.setAngle(this.sprite.rotation);
    } else {
      e.setAngle(this.sprite.rotation + Math.PI);
    }
  }
};

Reaper.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.deathHitBoxes = null;
  _super.prototype.destroy.call(this);
};

Reaper.prototype.resetLevel = function () {
  this.sprite.rotation = this.startRad;
  this.updatePosition();
};

var _Reaper = Reaper;

function Reaper(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "reaper 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.deathHitBoxes = [];
  i.rotSpeed = Tools_1.Tools.toRad(2.5);
  return i;
}

exports.Reaper = _Reaper;
