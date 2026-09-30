// objects/tower/EnemyBatteringRam.js — recovered from webpack module #250 of the original vex7.min.js
"use strict";

var n,
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

exports.EnemyBatteringRam = undefined;

var r,
  _super,
  data_1 = require("../../data"),
  system_1 = require("../../system"),
  Achievements_1 = require("../../system/Achievements"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  Helpers_1 = require("../../utils/Helpers"),
  _tmp = require("./BasicGroundEnemy");

(d = r = r || {})[(d.walk = 0)] = "walk";

d[(d.detect = 1)] = "detect";

d[(d.attack = 2)] = "attack";

d[(d.rest = 3)] = "rest";

_super = _tmp.BasicGroundEnemy;

__extends(p, _super);

p.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.startY += 24;
  this.reset();
};

p.prototype.levelStart = function () {
  this.calcBorders(this.borderOffX);
};

p.prototype.update = function () {
  if (this.alive !== false) {
    if (this.currState === r.walk) {
      if (this.currFloor === this.main.currHeroFloor) {
        var t = this.main.player.xPos;
        if (
          (this.xVelocity > 0 && this.xPos < t && t < this.borderRight + this.borderOffX) ||
          (this.xVelocity < 0 && this.xPos > t && t > this.borderLeft - this.borderOffX)
        ) {
          this.currState = r.detect;
          this.counter = 0;
          this.sprite.setFrame("enemyBatteringRamBase 10001");
          this.wheel.setFrame("enemyBatteringRamWheel 10001");
          this.wheelSpeed *= 2;
          return void this.updatePosition();
        }
      }
      this.xPos += this.xVelocity;
      if (this.xPos > this.borderRight) {
        this.xPos = this.borderRight;
        this.changeDir();
      } else if (this.xPos < this.borderLeft) {
        this.xPos = this.borderLeft;
        this.changeDir();
      }
      this.updatePosition();
      this.wheel.rotation += this.wheelSpeed;
    } else if (this.currState === r.detect) {
      this.wheel.rotation += this.wheelSpeed;
      this.counter += 1;
      if (this.counter >= 20) {
        this.setAttack();
      }
    } else if (this.currState === r.attack) {
      this.wheel.rotation += this.wheelSpeed;
      this.xPos += this.xVelocity;
      if (this.xPos > this.borderRight) {
        this.xPos = this.borderRight;
        this.setRest();
      } else if (this.xPos < this.borderLeft) {
        this.xPos = this.borderLeft;
        this.setRest();
      }
      this.updatePosition();
    } else if (this.currState === r.rest && ((this.counter += 1), this.counter >= 60)) {
      if (this.xPos >= this.borderRight) {
        this.xVelocity = -this.startSpeed;
      } else if (this.xPos <= this.borderLeft) {
        this.xVelocity = this.startSpeed;
      }
      this.setDir();
      this.setWalk();
    }
    this.main.checkPlayerDeathByCircle(this.deathCircle, PlayerBase_1.DeathType.buzzsaw);
  }
};

p.prototype.smash = function () {
  _super.prototype.smash.call(this);
  system_1.Achievements.saveAchive(Achievements_1.TrophieTower.killBatteringRam);
};

p.prototype.die = function () {
  _super.prototype.die.call(this);
  this.wheel.visible = false;
};

p.prototype.setWalk = function () {
  this.currState = r.walk;
};

p.prototype.setAttack = function () {
  this.xVelocity *= 3;
  this.currState = r.attack;
};

p.prototype.setRest = function () {
  this.counter = 0;
  this.currState = r.rest;
  this.sprite.setFrame("enemyBatteringRamBase 10000");
  this.wheel.setFrame("enemyBatteringRamWheel 10000");
};

p.prototype.changeDir = function () {
  _super.prototype.changeDir.call(this);
  this.setWalk();
};

p.prototype.setDir = function () {
  _super.prototype.setDir.call(this);
  this.wheelSpeed = 0.1 * this.currDir;
};

p.prototype.updatePosition = function () {
  this.wheel.x = this.xPos + 46 * this.sprite.scaleX;
  this.wheel.y = this.yPos - 12;
  _super.prototype.updatePosition.call(this);
  this.deathCircle.pos.x = this.wheel.x;
  this.deathCircle.pos.y = this.wheel.y;
};

p.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.recalcBorders();
  this.wheel.visible = true;
  this.setWalk();
  this.sprite.setFrame("enemyBatteringRamBase 10000");
  this.wheel.setFrame("enemyBatteringRamWheel 10000");
};

p.prototype.destroy = function () {
  this.wheel.destroy();
  this.wheel = null;
  _super.prototype.destroy.call(this);
};

var d = p;

function p(t, e) {
  var i = _super.call(this, t, e) || this;
  i.borderOffX = 25;
  i.wheel = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "enemyBatteringRamWheel 10000");
  i.wheel.setOrigin(0.49, 0.49);
  e.add(i.wheel);
  i.initGraphic(e, "enemyBatteringRamBase 10000");
  i.sprite.setOrigin(0.35, 0.5);
  i.deathCircle = new SAT.Circle(new SAT.Vector(0, 0), i.borderOffX);
  i.totalPolygon = Helpers_1.Helpers.getPolygonOffset(0, 0, 60, 30, -30, -13);
  return i;
}

exports.EnemyBatteringRam = d;
