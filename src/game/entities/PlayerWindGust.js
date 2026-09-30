// entities/PlayerWindGust.js — recovered from webpack module #60 of the original vex7.min.js
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

exports.PlayerWindGust = undefined;

var data_1 = require("../data"),
  Helpers_1 = require("../utils/Helpers"),
  PlayerBase_1 = require("./PlayerBase");

_super = Phaser.GameObjects.Image;

__extends(PlayerWindGust, _super);

PlayerWindGust.prototype.start = function (t, e, i) {
  this.visible = true;
  this.alpha = 1;
  if (i === PlayerBase_1.FacingDir.Right) {
    this.x = t - 30;
    this.scaleX = 1;
    this.polyOffX = 27;
    this.speed = 4;
    this.endX = this.x + 60;
  } else {
    this.x = t + 30;
    this.scaleX = -1;
    this.polyOffX = -67;
    this.speed = -4;
    this.endX = this.x - 60;
  }
  this.y = e;
  this.updatePolyPos();
};

PlayerWindGust.prototype.stop = function () {
  this.visible = false;
};

PlayerWindGust.prototype.update = function () {
  if (
    this.visible !== false &&
    ((this.x += this.speed),
    this.updatePolyPos(),
    (this.speed > 0 && this.x >= this.endX) || (this.speed < 0 && this.x <= this.endX)) &&
    ((this.alpha -= 0.1), this.alpha <= 0)
  ) {
    this.stop();
  }
};

PlayerWindGust.prototype.updatePolyPos = function () {
  this.poly.pos.x = this.x + this.polyOffX;
  this.poly.pos.y = this.y - 15;
};

var _PlayerWindGust = PlayerWindGust;

function PlayerWindGust(t, e, i) {
  t = _super.call(this, t, e, i, data_1.Atlases.gameplay, "heroWindGust 10000") || this;
  t.setOrigin(0, 0.5);
  t.poly = Helpers_1.Helpers.getPolygon(e, i, 40, 26);
  t.stop();
  return t;
}

exports.PlayerWindGust = _PlayerWindGust;
