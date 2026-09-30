// objects/items/SkinSpin.js — recovered from webpack module #224 of the original vex7.min.js
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

exports.SkinSpin = undefined;

var data_1 = require("../../data"),
  system_1 = require("../../system"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Coin").Coin;

__extends(SkinSpin, _super);

SkinSpin.prototype.init = function (t, e, i) {
  this.rarity = i;
  this.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "skinSpin 1000" + i);
  e.add(this.sprite);
  this.sprite.visible = false;
};

SkinSpin.prototype.collect = function () {
  system_1.SkinsData.addSpinToken(this.rarity);
  SoundManager_1.SoundManager.playSFX("starPickup");
  this.die();
};

SkinSpin.prototype.resetLevel = function () {};

var _SkinSpin = SkinSpin;

function SkinSpin() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SkinSpin = _SkinSpin;
