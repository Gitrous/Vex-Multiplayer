// objects/obstacles/BuzzsawVertical.js — recovered from webpack module #158 of the original vex7.min.js
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

exports.BuzzsawVertical = undefined;

_super = require("./Buzzsaw").Buzzsaw;

__extends(BuzzsawVertical, _super);

BuzzsawVertical.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.moveDist = t.moveDist;
  this.startSpeed = t.speed;
  this.yVelocity = this.startSpeed;
};

BuzzsawVertical.prototype.update = function () {
  if (this.yVelocity < 0) {
    if (this.yPos < this.startY - this.moveDist) {
      this.yVelocity = -this.yVelocity;
    }
  } else if (this.yPos > this.startY + this.moveDist) {
    this.yVelocity = -this.yVelocity;
  }
  this.yPos += this.yVelocity;
  this.updatePosition();
  _super.prototype.update.call(this);
};

BuzzsawVertical.prototype.reset = function () {
  this.yVelocity = this.startSpeed;
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.updatePosition();
};

BuzzsawVertical.prototype.resetLevel = function () {
  this.reset();
};

var _BuzzsawVertical = BuzzsawVertical;

function BuzzsawVertical() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.moveDist = 100;
  return t;
}

exports.BuzzsawVertical = _BuzzsawVertical;
