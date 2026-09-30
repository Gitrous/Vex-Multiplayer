// objects/obstacles/SurveillanceCamera.js — recovered from webpack module #179 of the original vex7.min.js
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

exports.SurveillanceCamera = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  obstacles_1 = require("."),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system");

_super = Obstacle_1.Obstacle;

__extends(SurveillanceCamera, _super);

SurveillanceCamera.prototype.spawn = function (t) {
  this.alive = true;
  this.sprite.visible = true;
  this.scanGraphic.visible = true;
  this.xPos = t.x;
  this.yPos = t.y;
  this.startR = Tools_1.Tools.toRad(t.rotation);
  this.minR = this.startR + Tools_1.Tools.toRad(t.rotationMin);
  this.maxR = this.startR + Tools_1.Tools.toRad(t.rotationMax);
  this.isScanMoving = true;
  if (this.minR === this.maxR) {
    this.isScanMoving = false;
  }
  this.scanSpeed = this.startSpeed;
  this.rPos = this.startR;
  this.currID = t.currID;
  this.isHeroFound = false;
  this.scanDistance = t.distance;
  t = t.range;
  this.scanGraphic.geom.setTo([0, 0, this.scanDistance, -t, this.scanDistance, t]);
  this.scanGraphic.setFillStyle(65280, 0.3);
  this.scanGraphic.updateData();
  this.scanBoxPolygon = new SAT.Polygon(new SAT.Vector(this.xPos, this.yPos), [
    new SAT.Vector(0, 0),
    new SAT.Vector(this.scanDistance, -t),
    new SAT.Vector(this.scanDistance, t),
  ]);
  this.updatePosition();
};

SurveillanceCamera.prototype.hide = function () {
  this.sprite.visible = false;
  this.scanGraphic.visible = false;
  this.alive = false;
};

SurveillanceCamera.prototype.levelStart = function () {
  this.lasers = [];
  for (var t = 0, e = this.main.obstacles; t < e.length; t++) {
    var i = e[t];
    if (i instanceof obstacles_1.ClassicLaserCamera && i.currID === this.currID) {
      this.lasers.push(i);
    }
  }
  this.platforms = [];
  for (
    var n = new SAT.Circle(new SAT.Vector(this.xPos, this.yPos), this.scanDistance), s = 0, r = this.main.blocks;
    s < r.length;
    s++
  ) {
    var o = r[s];
    if (SAT.testCirclePolygon(n, o.totalPolygon)) {
      this.platforms.push(o);
    }
  }
};

SurveillanceCamera.prototype.update = function () {
  if (this.alive !== false)
    if (SAT.testPolygonPolygon(this.scanBoxPolygon, this.main.player.totalPolygon) === true) {
      if (this.main.raycastToPlayerTwoLines(this.platforms, this.xPos, this.yPos) === false) this.targetlost();
      else {
        if (this.isHeroFound === false) {
          this.scanGraphic.setFillStyle(16711680, 0.3);
          this.isHeroFound = true;
          for (var t = 0, e = this.lasers; t < e.length; t++) e[t].startFollow = this.isHeroFound;
        }
        var i;
        if (this.isScanMoving === true) {
          i = this.main.player;
          if (
            (i = Tools_1.Tools.angleOfPoints(this.xPos, this.yPos, i.xPos, i.yPos - i.halfHeight)) < 0 &&
            (this.minR > Math.PI || this.maxR > Math.PI)
          ) {
            i = Tools_1.Tools.PI2 + i;
          }
          this.rPos = this.getFollowRotation(this.rPos, i, system_1.BalanceData.config_SurveillanceCameraFollowSpeed);
          if (this.rPos < this.minR) {
            this.rPos = this.minR;
          } else if (this.rPos > this.maxR) {
            this.rPos = this.maxR;
          }
          this.updatePosition();
        }
      }
    } else this.targetlost();
};

SurveillanceCamera.prototype.getFollowRotation = function (t, e, i) {
  var n = Tools_1.Tools.smartRotation(e - t);
  return i < n ? t + i : n < -i ? t - i : e;
};

SurveillanceCamera.prototype.targetlost = function () {
  if (
    (this.isScanMoving === true &&
      ((this.rPos += this.scanSpeed),
      this.rPos < this.minR
        ? (this.scanSpeed = this.startSpeed)
        : this.rPos > this.maxR && (this.scanSpeed = -this.startSpeed),
      this.updatePosition()),
    this.isHeroFound === true)
  ) {
    this.scanGraphic.setFillStyle(65280, 0.3);
    this.isHeroFound = false;
    for (var t = 0, e = this.lasers; t < e.length; t++) e[t].startFollow = this.isHeroFound;
  }
};

SurveillanceCamera.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = this.rPos;
  this.scanGraphic.x = this.xPos;
  this.scanGraphic.y = this.yPos;
  this.scanGraphic.rotation = this.sprite.rotation;
  this.scanBoxPolygon.setAngle(this.sprite.rotation);
};

SurveillanceCamera.prototype.resetLevel = function () {
  this.rPos = this.startR;
  this.scanSpeed = this.startSpeed;
  this.updatePosition();
};

SurveillanceCamera.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.sprite.destroy();
  this.sprite = null;
  this.scanGraphic.destroy();
  this.scanGraphic = null;
  this.scanBoxPolygon = null;
  this.lasers = null;
  this.platforms = null;
};

var _SurveillanceCamera = SurveillanceCamera;

function SurveillanceCamera(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "surveillanceCamera 10000");
  i.sprite.setOrigin(0.95, 0.45);
  e.add(i.sprite);
  i.scanGraphic = new Phaser.GameObjects.Polygon(t, 0, 0, [0, 0]);
  i.scanGraphic.setOrigin(0, 0);
  e.add(i.scanGraphic);
  i.startSpeed = system_1.BalanceData.config_SurveillanceCameraRotaionSpeed;
  i.hide();
  return i;
}

exports.SurveillanceCamera = _SurveillanceCamera;
