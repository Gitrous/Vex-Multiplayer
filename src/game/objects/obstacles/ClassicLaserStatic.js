// objects/obstacles/ClassicLaserStatic.js — recovered from webpack module #69 of the original vex7.min.js
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

exports.ClassicLaserStatic = undefined;

var obstacles_1 = require("."),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system");

_super = require("./Obstacle").Obstacle;

__extends(ClassicLaserStatic, _super);

ClassicLaserStatic.prototype.initGraphic = function () {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "classicLaser 10000");
  this.layer.add(this.sprite);
  this.bullet = new obstacles_1.Bullet(this.main, this.main.layerObstacle);
  this.main.obstacles.push(this.bullet);
};

ClassicLaserStatic.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.shootTimer = 0;
};

ClassicLaserStatic.prototype.update = function () {
  if (this.bullet.alive === false && ((this.shootTimer += 1), this.shootTimer >= this.fireRate)) {
    this.shootTimer = 0;
    this.bullet.spawn(this.xPos, this.yPos, this.sprite.rotation, this.shootPower);
  }
};

ClassicLaserStatic.prototype.reset = function () {
  this.shootTimer = 0;
};

ClassicLaserStatic.prototype.destroy = function () {
  this.bullet = null;
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _ClassicLaserStatic = ClassicLaserStatic;

function ClassicLaserStatic(t, e) {
  t = _super.call(this, t, e) || this;
  t.shootPower = 12.5;
  t.fireRate = system_1.BalanceData.config_ClassicLaserFireTime;
  t.initGraphic();
  return t;
}

exports.ClassicLaserStatic = _ClassicLaserStatic;
