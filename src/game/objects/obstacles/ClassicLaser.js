// objects/obstacles/ClassicLaser.js — recovered from webpack module #45 of the original vex7.min.js
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

exports.ClassicLaser = undefined;

var ClassicLaserStatic_1 = require("./ClassicLaserStatic"),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system");

_super = ClassicLaserStatic_1.ClassicLaserStatic;

__extends(ClassicLaser, _super);

ClassicLaser.prototype.initGraphic = function () {
  _super.prototype.initGraphic.call(this);
  this.fireDistance = system_1.BalanceData.config_ClassicLaserFireDistance;
};

ClassicLaser.prototype.spawn = function (t) {
  t.rotation = Tools_1.Tools.PI05;
  _super.prototype.spawn.call(this, t);
  this.spinDest = Tools_1.Tools.PI05;
  this.count = 0;
};

ClassicLaser.prototype.levelStart = function () {
  this.platforms = [];
  for (
    var t = new SAT.Circle(new SAT.Vector(this.xPos, this.yPos), this.fireDistance), e = 0, i = this.main.blocks;
    e < i.length;
    e++
  ) {
    var n = i[e];
    if (SAT.testCirclePolygon(t, n.totalPolygon)) {
      this.platforms.push(n);
    }
  }
};

ClassicLaser.prototype.update = function () {
  var t = this.main.player;
  if (t.alive === true) {
    this.lookAtHero(t, Tools_1.Tools.distance(this.xPos, this.yPos, t.xPos, t.yPos) <= this.fireDistance);
  }
};

ClassicLaser.prototype.lookAtHero = function (t, e) {
  if (e === true) {
    if (this.main.raycastToPlayerTwoLines(this.platforms, this.xPos, this.yPos) === true) {
      this.count = 0;
      this.spinDest = Math.atan2(t.yPos - t.halfHeight - this.yPos, t.xPos - this.xPos);
      _super.prototype.update.call(this);
    }
  } else if (this.bullet.alive === true && this.count < 10) {
    this.count += 1;
    this.spinDest = Math.atan2(t.yPos - t.halfHeight - this.yPos, t.xPos - this.xPos);
  } else {
    this.shootTimer = 0;
    this.spinDest = Tools_1.Tools.PI05;
  }
  this.sprite.rotation += Tools_1.Tools.getFollowRotationSpeedR(this.sprite.rotation, this.spinDest, 0.125);
};

ClassicLaser.prototype.resetLevel = function () {
  this.reset();
  this.spinDest = Tools_1.Tools.PI05;
};

ClassicLaser.prototype.destroy = function () {
  this.platforms = null;
  _super.prototype.destroy.call(this);
};

var _ClassicLaser = ClassicLaser;

function ClassicLaser() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.ClassicLaser = _ClassicLaser;
