// objects/tower/EnemyDrone.js — recovered from webpack module #249 of the original vex7.min.js
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

exports.EnemyDrone = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system"),
  Achievements_1 = require("../../system/Achievements"),
  Helpers_1 = require("../../utils/Helpers"),
  obstacles_1 = require("../obstacles");

_super = obstacles_1.Obstacle;

__extends(EnemyDrone, _super);

EnemyDrone.prototype.spawn = function (t) {
  this.startX = t.x;
  this.startY = t.y;
  this.startDir = t.dir;
  this.borderLeft = this.startX - system_1.BalanceData.config_TowerWallWidth;
  this.borderRight = this.startX + system_1.BalanceData.config_TowerWallWidth;
  this.reset();
  this.currFloor = Math.floor(this.startY / system_1.BalanceData.towerCellSize);
};

EnemyDrone.prototype.levelStart = function () {
  this.platforms = [];
  for (var t = 0, e = this.main.blocks; t < e.length; t++) {
    var i = e[t],
      n = Math.floor(i.yPos / system_1.BalanceData.towerCellSize);
    if (!(i.type !== "towerWall" && this.currFloor !== n)) {
      if (i.leftEdge < this.borderRight && i.leftEdge > this.startX) {
        this.borderRight = i.leftEdge - 50;
      }
      if (i.rightEdge > this.borderLeft && i.rightEdge < this.startX) {
        this.borderLeft = i.rightEdge + 50;
      }
    }
    if (!(this.currFloor - 1 !== n && this.currFloor !== n && this.currFloor + 1 !== n)) {
      this.platforms.push(i);
    }
  }
};

EnemyDrone.prototype.update = function () {
  var t, e, i, n;
  if (
    this.alive !== false &&
    (this.isPatroling === true
      ? ((this.barrel.rotation = 0),
        (t = this.container.x + this.barrel.x * this.container.scaleX),
        (n = this.container.y + this.barrel.y + 2),
        !((this.xVelocity > 0 && t < this.main.player.xPos) || (this.xVelocity < 0 && t > this.main.player.xPos)) ||
        (this.currFloor - 1 !== this.main.currHeroFloor &&
          this.currFloor !== this.main.currHeroFloor &&
          this.currFloor + 1 !== this.main.currHeroFloor) ||
        this.main.raycastToPlayerOneLine(this.platforms, t, n) !== true
          ? ((this.xPos += this.xVelocity),
            (this.xPos > this.borderRight || this.xPos < this.borderLeft) && this.changeDir(),
            this.updatePosition())
          : ((this.isPatroling = false),
            (e = this.main.player.xPos),
            (i = this.main.player.yPos - this.main.player.halfHeight),
            this.sprite.setFrame("enemyDrone 10001"),
            (this.laserAim.visible = true),
            (this.laserAim.x = t),
            (this.laserAim.y = n),
            (this.laserAim.displayWidth = Tools_1.Tools.distance(t, this.yPos, e, i)),
            (n = Tools_1.Tools.angleOfPoints(t, this.yPos, e, i)),
            (this.barrel.rotation = n),
            this.container.scaleX < 0 && (this.barrel.rotation = Math.PI - n),
            (this.laserAim.rotation = n),
            (this.counter = 0),
            (this.alphaCount = 0.1)))
      : ((this.counter += this.alphaCount),
        (this.laserAim.alpha = 0.5 + 0.5 * Math.cos(this.counter)),
        (this.alphaCount += 0.01),
        this.alphaCount >= 0.8 &&
          ((this.isPatroling = true),
          (this.laserAim.visible = false),
          this.sprite.setFrame("enemyDrone 10000"),
          this.shoot())),
    this.main.player.checkAttackPolyCollision(this.totalPolygon) === true)
  ) {
    this.smash();
  }
};

EnemyDrone.prototype.smash = function () {
  this.main.particleManager.showExplosion(this.xPos, this.yPos);
  this.die();
  system_1.Achievements.saveAchive(Achievements_1.TrophieTower.killDrone);
};

EnemyDrone.prototype.shoot = function () {
  this.bullet.spawn(this.laserAim.x, this.laserAim.y, this.laserAim.rotation, 12.5);
};

EnemyDrone.prototype.updatePosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
  this.totalPolygon.pos.x = this.xPos;
  this.totalPolygon.pos.y = this.yPos;
};

EnemyDrone.prototype.die = function () {
  this.alive = false;
  this.container.visible = false;
};

EnemyDrone.prototype.changeDir = function () {
  this.xVelocity = -this.xVelocity;
  this.setDir();
};

EnemyDrone.prototype.setDir = function () {
  if (this.xVelocity > 0) {
    this.container.scaleX = 1;
  } else {
    this.container.scaleX = -1;
  }
};

EnemyDrone.prototype.reset = function () {
  this.alive = true;
  this.container.visible = true;
  this.laserAim.visible = false;
  this.isPatroling = true;
  this.bullet.reset();
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.xVelocity = this.startDir;
  this.sprite.setFrame("enemyDrone 10000");
  this.barrel.rotation = 0;
  this.setDir();
  this.updatePosition();
};

EnemyDrone.prototype.resetLevel = function () {
  this.reset();
};

EnemyDrone.prototype.destroy = function () {
  this.platforms = null;
  this.bullet = null;
  this.laserAim.destroy();
  this.laserAim = null;
  this.sprite.destroy();
  this.sprite = null;
  this.barrel.destroy();
  this.barrel = null;
  this.container.destroy();
  this.container = null;
  this.totalPolygon = null;
  _super.prototype.destroy.call(this);
};

var _EnemyDrone = EnemyDrone;

function EnemyDrone(t, e) {
  var i = _super.call(this, t, e) || this;
  i.startDir = 1;
  i.laserAim = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  i.laserAim.tint = 16711680;
  i.laserAim.setOrigin(0, 0.5);
  e.add(i.laserAim);
  i.container = new Phaser.GameObjects.Container(t, 0, 0);
  e.add(i.container);
  i.barrel = new Phaser.GameObjects.Image(t, 22, 6, data_1.Atlases.gameplay, "enemyDroneBarrel 10000");
  i.barrel.setOrigin(0, 0.5);
  i.container.add(i.barrel);
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "enemyDrone 10000");
  i.container.add(i.sprite);
  i.bullet = new obstacles_1.Bullet(i.main, i.main.layerObstacle);
  i.main.obstacles.push(i.bullet);
  i.totalPolygon = Helpers_1.Helpers.getPolygonOffset(0, 0, 60, 30, -30, -13);
  return i;
}

exports.EnemyDrone = _EnemyDrone;
