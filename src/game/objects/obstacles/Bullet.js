// objects/obstacles/Bullet.js — recovered from webpack module #67 of the original vex7.min.js
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

exports.Bullet = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  system_1 = require("../../system");

_super = Obstacle_1.Obstacle;

__extends(Bullet, _super);

Bullet.prototype.addDeathBox = function () {
  this.deathBoxPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 8), new SAT.Vector(8, 8)]);
  this.deathBoxPolygon.setOffset(new SAT.Vector(-4, 0));
};

Bullet.prototype.initGraphic = function (t) {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, t);
  this.layer.add(this.sprite);
  this.sprite.visible = false;
};

Bullet.prototype.spawn = function (t, e, i, n) {
  this.xPos = t;
  this.yPos = e;
  this.xVelocity = Math.cos(i) * n;
  this.yVelocity = Math.sin(i) * n;
  this.updatePosition();
  this.sprite.rotation = i;
  this.deathBoxPolygon.setAngle(i);
  this.alive = true;
  this.sprite.visible = true;
  this.lifeTime = 600;
  if (this.main.inCameraView(this.xPos - 15, this.xPos + 15, this.yPos - 15, this.yPos + 15) === true) {
    system_1.SoundManager.playSFX("laserFire");
  }
};

Bullet.prototype.update = function () {
  if (this.alive !== false)
    if (
      ((this.xPos += this.xVelocity),
      (this.yPos += this.yVelocity),
      this.updatePosition(),
      --this.lifeTime,
      this.lifeTime <= 0)
    )
      this.die();
    else if (this.main.checkPlayerDeathByPolygon(this.deathBoxPolygon, PlayerBase_1.DeathType.laser) !== true)
      for (var t = 0, e = this.main.blocks; t < e.length; t++) {
        var i = e[t];
        if (SAT.testPolygonPolygon(i.totalPolygon, this.deathBoxPolygon)) {
          for (var n = 0; n < 10; n++)
            this.main.particleManager.createColorParticle(
              this.xPos,
              this.yPos,
              16 * Math.random() - 8,
              16 * Math.random() - 8,
              16711680,
            );
          this.die();
        }
      }
    else this.die();
};

Bullet.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathBoxPolygon.pos.x = this.xPos;
  this.deathBoxPolygon.pos.y = this.yPos;
};

Bullet.prototype.die = function () {
  this.alive = false;
  this.sprite.visible = false;
};

Bullet.prototype.reset = function () {
  this.die();
};

Bullet.prototype.resetLevel = function () {
  this.reset();
};

Bullet.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.deathBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

var _Bullet = Bullet;

function Bullet(t, e) {
  t = _super.call(this, t, e) || this;
  t.initGraphic("classicLaserBullet 10000");
  t.addDeathBox();
  return t;
}

exports.Bullet = _Bullet;
