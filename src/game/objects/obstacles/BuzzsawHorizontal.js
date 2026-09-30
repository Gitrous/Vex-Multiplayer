// objects/obstacles/BuzzsawHorizontal.js — recovered from webpack module #156 of the original vex7.min.js
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

exports.BuzzsawHorizontal = undefined;

_super = require("./Buzzsaw").Buzzsaw;

__extends(BuzzsawHorizontal, _super);

BuzzsawHorizontal.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.xVelocity = t.speed;
  this.startSpeed = t.speed;
  this.moveDist = t.moveDist;
};

BuzzsawHorizontal.prototype.update = function () {
  if (this.xVelocity > 0) {
    if (this.xPos > this.startX + this.moveDist) {
      this.xVelocity = -this.xVelocity;
    }
  } else if (this.xPos < this.startX - this.moveDist) {
    this.xVelocity = -this.xVelocity;
  }
  this.xPos += this.xVelocity;
  this.updatePosition();
  _super.prototype.update.call(this);
};

BuzzsawHorizontal.prototype.reset = function () {
  this.xVelocity = this.startSpeed;
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.updatePosition();
};

BuzzsawHorizontal.prototype.resetLevel = function () {
  this.reset();
};

var _BuzzsawHorizontal = BuzzsawHorizontal;

function BuzzsawHorizontal() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.moveDist = 100;
  return t;
}

exports.BuzzsawHorizontal = _BuzzsawHorizontal;
