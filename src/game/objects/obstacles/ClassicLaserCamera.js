// objects/obstacles/ClassicLaserCamera.js — recovered from webpack module #180 of the original vex7.min.js
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

exports.ClassicLaserCamera = undefined;

var ClassicLaser_1 = require("./ClassicLaser"),
  system_1 = require("../../system");

_super = ClassicLaser_1.ClassicLaser;

__extends(ClassicLaserCamera, _super);

ClassicLaserCamera.prototype.initGraphic = function () {
  _super.prototype.initGraphic.call(this);
  this.fireRate = system_1.BalanceData.config_ClassicLaserCameraFireTime;
};

ClassicLaserCamera.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.currID = t.currID;
};

ClassicLaserCamera.prototype.update = function () {
  var t = this.main.player;
  if (t.alive === true) {
    this.lookAtHero(t, this.startFollow);
  }
};

var _ClassicLaserCamera = ClassicLaserCamera;

function ClassicLaserCamera() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.startFollow = false;
  return t;
}

exports.ClassicLaserCamera = _ClassicLaserCamera;
