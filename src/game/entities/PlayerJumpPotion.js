// entities/PlayerJumpPotion.js — recovered from webpack module #61 of the original vex7.min.js
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

exports.PlayerJumpPotion = undefined;

var data_1 = require("../data"),
  PlayerBase_1 = require("./PlayerBase");

_super = Phaser.GameObjects.Image;

__extends(PlayerJumpPotion, _super);

PlayerJumpPotion.prototype.start = function () {
  this.visible = true;
  this.counter = 0;
};

PlayerJumpPotion.prototype.stop = function () {
  this.visible = false;
};

PlayerJumpPotion.prototype.update = function (t, e) {
  if (this.visible !== false) {
    if (e === PlayerBase_1.PlayerState.Sliding) {
      this.x = -30 * t;
    } else {
      this.x = -20 * t;
    }
    this.counter += 0.1;
    this.scale = 0.7 + 0.3 * (0.5 + 0.5 * Math.cos(this.counter));
  }
};

var _PlayerJumpPotion = PlayerJumpPotion;

function PlayerJumpPotion(t) {
  t = _super.call(this, t, 0, 3, data_1.Atlases.gameplay, "jumpPotionAnim 10000") || this;
  t.setOrigin(0.5, 1);
  t.stop();
  return t;
}

exports.PlayerJumpPotion = _PlayerJumpPotion;
