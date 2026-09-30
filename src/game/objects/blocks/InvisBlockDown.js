// objects/blocks/InvisBlockDown.js — recovered from webpack module #190 of the original vex7.min.js
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

exports.InvisBlockDown = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  BalanceData_1 = require("../../system/BalanceData");

_super = require("./InvisBlock").InvisBlock;

__extends(InvisBlockDown, _super);

InvisBlockDown.prototype.initGraphics = function () {
  _super.prototype.initGraphics.call(this);
  this.arrowAnimation = new jd_1.JDImageAnim(this.main, 0, 0, data_1.Atlases.gameplay, "invisBlockDownArrow ");
  this.container.add(this.arrowAnimation);
};

InvisBlockDown.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  if (BalanceData_1.BalanceData.blend === true) {
    this.arrowAnimation.playFrames(0, 23, -1, 0.5);
  }
  this.yVelocity = 1;
};

InvisBlockDown.prototype.update = function () {
  this.arrowAnimation.update();
  if (this.yVelocity < 0) {
    if (this.yPos < this.startY - this.maxMoveDist) {
      this.yVelocity = -this.yVelocity;
      if (this.landed) {
        this.main.player.yPos += 2 * this.yVelocity;
      }
      this.main.player.updatePositions();
    }
  } else if (this.yPos > this.startY + this.maxMoveDist) {
    this.yVelocity = -this.yVelocity;
    if (this.landed) {
      this.main.player.yPos += 2 * this.yVelocity;
    }
    this.main.player.updatePositions();
  }
  this.yPos += this.yVelocity;
  _super.prototype.update.call(this);
};

InvisBlockDown.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.yVelocity = 1;
  this.yPos = this.startY;
  this.updatePosition();
};

InvisBlockDown.prototype.destroy = function () {
  this.arrowAnimation.destroy();
  this.arrowAnimation = null;
  _super.prototype.destroy.call(this);
};

var _InvisBlockDown = InvisBlockDown;

function InvisBlockDown() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.maxMoveDist = 100;
  return t;
}

exports.InvisBlockDown = _InvisBlockDown;
