// objects/blocks/BlockBehavior.js — recovered from webpack module #34 of the original vex7.min.js
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

exports.BlockBehavior = undefined;

_super = require("./Block").Block;

__extends(BlockBehavior, _super);

BlockBehavior.prototype.applyForce = function (t, e) {
  this.xVelocity += t;
  this.yVelocity += e;
};

BlockBehavior.prototype.update = function () {
  this.xPos += this.xVelocity;
  this.yPos += this.yVelocity;
  this.xVelocity *= this.fricitonX;
  this.yVelocity *= this.fricitonY;
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

var _BlockBehavior = BlockBehavior;

function BlockBehavior() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.fricitonX = 0.97;
  t.fricitonY = 0.97;
  return t;
}

exports.BlockBehavior = _BlockBehavior;
