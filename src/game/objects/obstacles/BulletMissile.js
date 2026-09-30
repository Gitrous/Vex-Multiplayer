// objects/obstacles/BulletMissile.js — recovered from webpack module #68 of the original vex7.min.js
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

exports.BulletMissile = undefined;

var Bullet_1 = require("./Bullet"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system"),
  Helpers_1 = require("../../utils/Helpers");

_super = Bullet_1.Bullet;

__extends(BulletMissile, _super);

BulletMissile.prototype.initGraphic = function (t) {
  _super.prototype.initGraphic.call(this, "missileLauncherBullet 10000");
  this.explodeBody = new SAT.Circle(new SAT.Vector(this.xPos, this.yPos), 40);
};

BulletMissile.prototype.addDeathBox = function () {
  this.deathBoxPolygon = Helpers_1.Helpers.getPolygonOffset(0, 0, 26, 14, -13, -7);
};

BulletMissile.prototype.spawn = function (t, e, i, n) {
  _super.prototype.spawn.call(this, t, e, i, n);
  this.shootPower = n;
  this.rPos = i;
  this.lifeTime = system_1.BalanceData.config_MissileLifeTime;
  this.exploding = false;
  this.deathByBlast = false;
  this.sprite.visible = true;
};

BulletMissile.prototype.explode = function () {
  this.sprite.visible = false;
  this.exploding = true;
  this.main.particleManager.showExplosion(this.xPos, this.yPos);
  this.explodeBody.pos.x = this.xPos;
  this.explodeBody.pos.y = this.yPos;
  this.lifeTime = 0;
};

BulletMissile.prototype.update = function () {
  if (this.alive !== false) {
    var t = this.main.player;
    if (this.exploding === true) {
      this.lifeTime += 1;
      if (
        this.deathByBlast === false &&
        this.main.checkPlayerDeathByCircle(this.explodeBody, PlayerBase_1.DeathType.laser) === true
      ) {
        this.deathByBlast = true;
      } else if (this.lifeTime > 16) {
        this.die();
      }
    } else if (
      ((this.rPos += Tools_1.Tools.getFollowRotationSpeed(
        this.xPos,
        this.yPos,
        this.rPos,
        t.xPos,
        t.yPos - t.halfHeight,
        system_1.BalanceData.config_MissileFollowSpeed,
      )),
      (this.xPos += Math.cos(this.rPos) * this.shootPower),
      (this.yPos += Math.sin(this.rPos) * this.shootPower),
      this.updatePosition(),
      --this.lifeTime,
      this.lifeTime <= 0)
    )
      this.explode();
    else if (SAT.testPolygonPolygon(this.main.player.totalPolygon, this.deathBoxPolygon) === true) {
      this.explode();
      this.main.player.kill(PlayerBase_1.DeathType.laser);
    } else
      for (var e = 0, i = this.main.blocks; e < i.length; e++) {
        var n = i[e];
        if (SAT.testPolygonPolygon(n.totalPolygon, this.deathBoxPolygon)) {
          for (var s = 0; s < 10; s++)
            this.main.particleManager.createColorParticle(
              this.xPos,
              this.yPos,
              16 * Math.random() - 8,
              16 * Math.random() - 8,
              16711680,
            );
          this.explode();
          if (n.type === "explosive") {
            n.explode();
          }
        }
      }
  }
};

BulletMissile.prototype.reset = function () {
  if (this.exploding === false) {
    _super.prototype.reset.call(this);
  }
};

BulletMissile.prototype.updatePosition = function () {
  _super.prototype.updatePosition.call(this);
  this.sprite.rotation = this.rPos;
  this.deathBoxPolygon.setAngle(this.rPos);
};

var _BulletMissile = BulletMissile;

function BulletMissile() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BulletMissile = _BulletMissile;
