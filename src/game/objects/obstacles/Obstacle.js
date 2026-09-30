// objects/obstacles/Obstacle.js — recovered from webpack module #14 of the original vex7.min.js
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

exports.Obstacle = undefined;

_super = require("../../entities/Entity").Entity;

__extends(Obstacle, _super);

Obstacle.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.obstacles, this);
  _super.prototype.destroySelf.call(this);
};

Obstacle.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.layer = null;
};

Obstacle.prototype.levelStart = function () {};

Obstacle.prototype.update = function () {};

Obstacle.prototype.updatePosition = function () {};

var _Obstacle = Obstacle;

function Obstacle(t, e) {
  t = _super.call(this, t) || this;
  t.layer = e;
  return t;
}

exports.Obstacle = _Obstacle;
