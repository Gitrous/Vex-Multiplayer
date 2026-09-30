// objects/tower/BasicGroundEnemy.js — recovered from webpack module #75 of the original vex7.min.js
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

exports.BasicGroundEnemy = undefined;

var data_1 = require("../../data"),
  system_1 = require("../../system"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = require("../obstacles").Obstacle;

__extends(BasicGroundEnemy, _super);

BasicGroundEnemy.prototype.initGraphic = function (t, e) {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, e);
  t.add(this.sprite);
};

BasicGroundEnemy.prototype.spawn = function (t) {
  this.startX = t.x;
  this.startY = t.y;
  if (t.dir > 0) {
    this.startDir = 1;
  } else {
    this.startDir = -1;
  }
  this.startSpeed = Math.abs(t.dir);
  this.currFloor = Math.floor(this.startY / system_1.BalanceData.towerCellSize);
};

BasicGroundEnemy.prototype.calcBorders = function (t) {
  this.bOffX = t;
  this.recalcBorders();
};

BasicGroundEnemy.prototype.recalcBorders = function () {
  this.borderCount = 0;
  var t =
    Math.ceil(this.yPos / system_1.BalanceData.towerCellSize) * system_1.BalanceData.towerCellSize -
    system_1.BalanceData.towerHalfCellSize;
  this.borderLeft =
    this.xPos -
    this.main.raycastToClosestBlock(
      this.xPos,
      t,
      Math.cos(Math.PI),
      Math.sin(Math.PI),
      system_1.BalanceData.config_TowerWallWidth,
    ) +
    this.bOffX;
  this.borderRight =
    this.xPos +
    this.main.raycastToClosestBlock(
      this.xPos,
      t,
      Math.cos(0),
      Math.sin(0),
      system_1.BalanceData.config_TowerWallWidth,
    ) -
    this.bOffX;
  for (var e = [], i = 0, n = this.main.blocks; i < n.length; i++) {
    var s = n[i];
    if (
      s.type !== "gate" &&
      s.alive !== false &&
      this.currFloor + 1 === Math.floor(s.yPos / system_1.BalanceData.towerCellSize)
    ) {
      e.push(s);
    }
  }
  for (
    var r =
        Math.floor((this.xPos + system_1.BalanceData.towerHalfCellSize) / system_1.BalanceData.towerCellSize) *
        system_1.BalanceData.towerCellSize,
      o = r + system_1.BalanceData.towerHalfCellSize - 1;
    o > this.borderLeft;
  ) {
    if (this.main.raycastTo(e, o, t, o, t + system_1.BalanceData.towerCellSize) === true) {
      this.borderLeft = o + this.bOffX + 1;
      break;
    }
    o -= system_1.BalanceData.towerCellSize;
  }
  for (o = r - system_1.BalanceData.towerHalfCellSize + 1; o < this.borderRight;) {
    if (this.main.raycastTo(e, o, t, o, t + system_1.BalanceData.towerCellSize) === true) {
      this.borderRight = o - this.bOffX - 1;
      break;
    }
    o += system_1.BalanceData.towerCellSize;
  }
};

BasicGroundEnemy.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.totalPolygon.pos.x = this.xPos;
  this.totalPolygon.pos.y = this.yPos;
  this.checkSmash();
  this.borderCount += 1;
  if (this.borderCount >= 30) {
    this.recalcBorders();
  }
};

BasicGroundEnemy.prototype.checkSmash = function () {
  if (this.main.player.checkAttackPolyCollision(this.totalPolygon) === true) {
    this.smash();
  }
  this.main.checkPlayerDeathByPolygon(this.totalPolygon, PlayerBase_1.DeathType.noEntry);
};

BasicGroundEnemy.prototype.smash = function () {
  this.main.particleManager.showExplosion(this.xPos, this.yPos + this.smashOffY);
  this.die();
};

BasicGroundEnemy.prototype.die = function () {
  this.alive = false;
  this.sprite.visible = false;
};

BasicGroundEnemy.prototype.changeDir = function () {
  this.currDir = -this.currDir;
  this.setDir();
};

BasicGroundEnemy.prototype.setDir = function (t) {
  this.sprite.scaleX = (t = t === undefined ? 1 : t) * this.currDir;
  this.xVelocity = this.startSpeed * this.currDir;
};

BasicGroundEnemy.prototype.reset = function () {
  this.alive = true;
  this.sprite.visible = true;
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.currDir = this.startDir;
  this.setDir();
  this.updatePosition();
};

BasicGroundEnemy.prototype.resetLevel = function () {
  this.reset();
};

BasicGroundEnemy.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.totalPolygon = null;
  _super.prototype.destroy.call(this);
};

var _BasicGroundEnemy = BasicGroundEnemy;

function BasicGroundEnemy(t, e) {
  t = _super.call(this, t, e) || this;
  t.startSpeed = 1;
  t.smashOffY = 0;
  return t;
}

exports.BasicGroundEnemy = _BasicGroundEnemy;
