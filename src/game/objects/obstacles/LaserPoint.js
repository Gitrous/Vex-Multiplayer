// objects/obstacles/LaserPoint.js — recovered from webpack module #163 of the original vex7.min.js
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

exports.LaserPoint = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(LaserPoint, _super);

LaserPoint.prototype.spawn = function (t, e, i, n) {
  this.xPos = t;
  this.yPos = e;
  this.xLength = i - t;
  this.yLength = n - e;
  this.alive = true;
  this.deathHitBoxPolygon = new SAT.Polygon(new SAT.Vector(this.xPos, this.yPos), [
    new SAT.Vector(0, 0),
    new SAT.Vector(i - t, n - e),
  ]);
  this.laserGraphic.x = this.xPos;
  this.laserGraphic.y = this.yPos;
  this.laserGraphic.displayWidth = Tools_1.Tools.distance(t, e, i, n);
  this.laserGraphic.rotation = Tools_1.Tools.angleOfPoints(t, e, i, n);
  this.point1.x = t;
  this.point1.y = e;
  this.point2.x = i;
  this.point2.y = n;
};

LaserPoint.prototype.update = function () {
  var t, e;
  if (Math.random() < 0.05) {
    e = Math.random();
    t = this.xPos + this.xLength * e;
    e = this.yPos + this.yLength * e;
    this.main.particleManager.createColorParticle(
      t,
      e,
      10 * Math.random() - 5,
      -5 * Math.random(),
      16711680,
      4,
      false,
      false,
      10,
      true,
    );
  }
  this.main.checkPlayerDeathByPolygon(this.deathHitBoxPolygon, PlayerBase_1.DeathType.laser);
};

LaserPoint.prototype.destroy = function () {
  this.laserGraphic.destroy();
  this.laserGraphic = null;
  this.point1.destroy();
  this.point1 = null;
  this.point2.destroy();
  this.point2 = null;
  _super.prototype.destroy.call(this);
};

var _LaserPoint = LaserPoint;

function LaserPoint(t, e) {
  var i = _super.call(this, t, e) || this;
  i.laserGraphic = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  i.laserGraphic.setOrigin(0, 0.5);
  i.laserGraphic.tint = 16724787;
  e.add(i.laserGraphic);
  i.point1 = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "laserPoint 10000");
  e.add(i.point1);
  i.point2 = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "laserPoint 10000");
  e.add(i.point2);
  return i;
}

exports.LaserPoint = _LaserPoint;
