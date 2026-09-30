// objects/obstacles/BuzzsawEnlarging.js — recovered from webpack module #161 of the original vex7.min.js
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

exports.BuzzsawEnlarging = undefined;

_super = require("./Buzzsaw").Buzzsaw;

__extends(BuzzsawEnlarging, _super);

BuzzsawEnlarging.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.visible = true;
  this.enlarging = true;
  this.scaleXStart = t.size / 100;
  this.scale = this.scaleXStart;
  this.alive = true;
  this.updatePosition();
};

BuzzsawEnlarging.prototype.update = function () {
  if (this.enlarging) {
    this.scale += 0.01 * this.scaleXStart;
    if (this.scale > 2.5 * this.scaleXStart) {
      this.scale = 2.5 * this.scaleXStart;
      this.enlarging = false;
    }
  } else {
    this.scale -= 0.01 * this.scaleXStart;
    if (this.scale < 0.5 * this.scaleXStart) {
      this.scale = 0.5 * this.scaleXStart;
      this.enlarging = true;
    }
  }
  this.updatePosition();
  _super.prototype.update.call(this);
};

BuzzsawEnlarging.prototype.updatePosition = function () {
  this.sprite.setScale(this.scale, this.scale);
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathCircle.pos.x = this.xPos;
  this.deathCircle.pos.y = this.yPos;
  this.deathCircle.r = 42 * this.scale;
};

BuzzsawEnlarging.prototype.resetLevel = function () {};

var _BuzzsawEnlarging = BuzzsawEnlarging;

function BuzzsawEnlarging() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BuzzsawEnlarging = _BuzzsawEnlarging;
