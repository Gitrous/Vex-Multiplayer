// objects/obstacles/BuzzsawBouncing.js — recovered from webpack module #159 of the original vex7.min.js
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

exports.BuzzsawBouncing = undefined;

_super = require("./Buzzsaw").Buzzsaw;

__extends(BuzzsawBouncing, _super);

BuzzsawBouncing.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.yVelocity = 0;
  this.speedUp = -1;
};

BuzzsawBouncing.prototype.update = function () {
  if (this.alive !== false) {
    this.yVelocity += this.main.gravity;
    this.yPos += this.yVelocity;
    this.updatePosition();
    this.checkBlockCollisions();
    _super.prototype.update.call(this);
  }
};

BuzzsawBouncing.prototype.checkBlockCollisions = function () {
  for (var t = 0, e = this.main.blocks; t < e.length; t++) {
    var i = e[t];
    if (i.alive !== false && this.yVelocity > 0 && SAT.testPolygonCircle(i.topPolygon, this.deathCircle) === true) {
      this.checkUnderPool = false;
      if (this.speedUp === -1) {
        this.speedUp = Math.abs(this.yVelocity);
      } else {
        this.yVelocity = this.speedUp;
      }
      this.yVelocity *= -1;
      this.yPos = i.yPos - i.halfHeight - this.deathCircle.r;
      break;
    }
  }
  _super.prototype.levelStart.call(this);
};

BuzzsawBouncing.prototype.reset = function () {
  this.yPos = this.startY;
  this.yVelocity = 0;
  this.updatePosition();
};

BuzzsawBouncing.prototype.resetLevel = function () {
  this.reset();
  _super.prototype.resetLevel.call(this);
};

var _BuzzsawBouncing = BuzzsawBouncing;

function BuzzsawBouncing() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BuzzsawBouncing = _BuzzsawBouncing;
