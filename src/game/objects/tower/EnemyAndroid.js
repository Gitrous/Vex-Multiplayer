// objects/tower/EnemyAndroid.js — recovered from webpack module #74 of the original vex7.min.js
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

exports.EnemyAndroid = undefined;

var r,
  _super,
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  Achievements_1 = require("../../system/Achievements"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  Helpers_1 = require("../../utils/Helpers"),
  _tmp = require("./BasicGroundEnemy");

(d = r = r || {})[(d.stand = 0)] = "stand";

d[(d.walk = 1)] = "walk";

d[(d.run = 2)] = "run";

d[(d.attack = 3)] = "attack";

_super = _tmp.BasicGroundEnemy;

__extends(p, _super);

p.prototype.initGraphic = function (t, e) {
  this.jdSprite = new jd_1.JDSpineGameObject(this.main, 0, 0, e);
  this.sprite = this.jdSprite.getView();
  t.add(this.sprite);
  this.sprite.on(jd_1.JDSpineGameObject.EVENT_COMPLETE, this.onAnimationComplete, this);
  this.jdSprite.scaleX = this.jdSprite.scaleY = this.startScale;
};

p.prototype.onAnimationComplete = function () {
  if (this.jdSprite.getCurrentAnimationName() === "attack") {
    this.setStateWalk();
  }
};

p.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.startY += system_1.BalanceData.towerHalfCellSize;
  this.reset();
};

p.prototype.levelStart = function () {
  this.calcBorders(this.borderOffX);
};

p.prototype.update = function () {
  if (this.alive !== false)
    if (this.currState === r.walk) {
      if (this.currFloor === this.main.currHeroFloor) {
        var t = this.main.player.xPos;
        if (
          (this.xVelocity > 0 && this.xPos < t && t < this.borderRight + this.borderOffX) ||
          (this.xVelocity < 0 && this.xPos > t && t > this.borderLeft - this.borderOffX)
        )
          return void this.setStateRun();
      }
      this.incVelocity();
    } else if (this.currState === r.run) {
      t = this.main.player.xPos;
      if (
        this.currFloor !== this.main.currHeroFloor ||
        t < this.borderLeft - this.borderOffX ||
        t > this.borderRight + this.borderOffX ||
        (this.xVelocity > 0 && this.xPos > t) ||
        (this.xVelocity < 0 && this.xPos < t)
      ) {
        this.setStateWalk();
      } else if (Math.abs(this.xPos - t) < 35) {
        this.setStateAttack();
      } else {
        this.incVelocity();
      }
    } else if (this.currState === r.attack) {
      this.attack();
      this.checkSmash();
    }
};

p.prototype.attack = function () {
  var t;
  if (
    this.currFloor === this.main.currHeroFloor &&
    ((t = this.main.player.xPos),
    (this.xPos < t && t < this.borderRight + this.borderOffX) ||
      (this.xPos > t && t > this.borderLeft - this.borderOffX)) &&
    this.jdSprite.getAnimationProgress() > 0.85 &&
    Math.abs(this.xPos - t) < 35
  ) {
    this.main.player.kill(PlayerBase_1.DeathType.buzzsaw);
  }
};

p.prototype.incVelocity = function () {
  this.xPos += this.xVelocity;
  if (this.xPos > this.borderRight) {
    this.xPos = this.borderRight;
    this.changeDir();
  } else if (this.xPos < this.borderLeft) {
    this.xPos = this.borderLeft;
    this.changeDir();
  }
  this.updatePosition();
};

p.prototype.smash = function () {
  _super.prototype.smash.call(this);
  system_1.Achievements.saveAchive(Achievements_1.TrophieTower.killAndroid);
};

p.prototype.die = function () {
  this.alive = false;
  this.sprite.visible = false;
};

p.prototype.changeDir = function () {
  if (this.currState !== r.run) {
    _super.prototype.changeDir.call(this);
  } else {
    this.xVelocity = 0;
  }
};

p.prototype.setDir = function () {
  _super.prototype.setDir.call(this, this.startScale);
};

p.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.recalcBorders();
  this.setStateWalk();
};

p.prototype.setStateWalk = function () {
  this.currState = r.walk;
  if (this.jdSprite.currAnimationName !== "walk") {
    this.jdSprite.playFromProgress("walk", this.jdSprite.getAnimationProgress(), true, 1);
  }
  this.sprite.timeScale = 1;
  this.xVelocity = this.startSpeed * this.currDir;
};

p.prototype.setStateRun = function () {
  this.currState = r.run;
  this.xVelocity *= 2;
  if (this.jdSprite.currAnimationName !== "walk_danger") {
    this.jdSprite.playFromProgress("walk_danger", this.jdSprite.getAnimationProgress(), true, 2);
  }
};

p.prototype.setStateAttack = function () {
  this.currState = r.attack;
  this.jdSprite.play("attack", false, 2);
  this.xVelocity = 0;
};

p.prototype.destroy = function () {
  this.main.events.off("pauseWorld", this.jdSprite.pause, this.jdSprite);
  this.main.events.off("resumeWorld", this.jdSprite.resume, this.jdSprite);
  this.jdSprite.destroy();
  this.jdSprite = null;
  _super.prototype.destroy.call(this);
};

var d = p;

function p(t, e) {
  var i = _super.call(this, t, null) || this;
  i.startScale = 0.05;
  i.borderOffX = 10;
  i.smashOffY = -30;
  i.initGraphic(e, "Enemy1");
  i.totalPolygon = Helpers_1.Helpers.getPolygonOffset(0, 0, 30, 55, -15, -55);
  t.events.on("pauseWorld", i.jdSprite.pause, i.jdSprite);
  t.events.on("resumeWorld", i.jdSprite.resume, i.jdSprite);
  return i;
}

exports.EnemyAndroid = d;
