// objects/obstacles/MissileLauncher.js — recovered from webpack module #160 of the original vex7.min.js
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

exports.MissileLauncher = undefined;

var data_1 = require("../../data"),
  system_1 = require("../../system"),
  BulletMissile_1 = require("./BulletMissile");

_super = require("./ClassicLaser").ClassicLaser;

__extends(MissileLauncher, _super);

MissileLauncher.prototype.initGraphic = function () {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "missileLauncher 10000");
  this.sprite.setOrigin(0.18, 0.5);
  this.layer.add(this.sprite);
  this.bullet = new BulletMissile_1.BulletMissile(this.main, this.main.layerObstacle);
  this.main.obstacles.push(this.bullet);
  this.fireDistance = system_1.BalanceData.config_MissileLauncherFireDistance;
  this.shootPower = system_1.BalanceData.config_MissileSpeed;
};

var _MissileLauncher = MissileLauncher;

function MissileLauncher() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.MissileLauncher = _MissileLauncher;
