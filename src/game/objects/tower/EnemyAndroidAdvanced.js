// objects/tower/EnemyAndroidAdvanced.js — recovered from webpack module #248 of the original vex7.min.js
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

exports.EnemyAndroidAdvanced = undefined;

var PlayerBase_1 = require("../../entities/PlayerBase");

_super = require("./EnemyAndroid").EnemyAndroid;

__extends(EnemyAndroidAdvanced, _super);

EnemyAndroidAdvanced.prototype.initGraphic = function (t, e) {
  this.startScale = 0.052;
  _super.prototype.initGraphic.call(this, t, "Enemy2");
};

EnemyAndroidAdvanced.prototype.attack = function () {
  var t;
  if (
    this.currFloor === this.main.currHeroFloor &&
    ((t = this.main.player.xPos), this.jdSprite.getAnimationProgress() > 0.85) &&
    Math.abs(this.xPos - t) < 35
  ) {
    this.main.player.kill(PlayerBase_1.DeathType.buzzsaw);
  }
};

var _EnemyAndroidAdvanced = EnemyAndroidAdvanced;

function EnemyAndroidAdvanced() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.EnemyAndroidAdvanced = _EnemyAndroidAdvanced;
