// objects/items/TimedKey.js — recovered from webpack module #220 of the original vex7.min.js
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

exports.TimedKey = undefined;

_super = require("./Key").Key;

__extends(TimedKey, _super);

TimedKey.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.timer = 0;
};

TimedKey.prototype.init = function (t) {
  _super.prototype.init.call(this, t, "timedKey 10000", 16711680);
};

TimedKey.prototype.collideWithHero = function () {
  _super.prototype.collideWithHero.call(this);
  this.timer = 300;
};

TimedKey.prototype.update = function () {
  if (this.following === true && this.used === false && this.timer > 0 && (--this.timer, this.timer === 0)) {
    this.main.player.loseKey(this);
    this.reset();
  }
  _super.prototype.update.call(this);
};

var _TimedKey = TimedKey;

function TimedKey() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.TimedKey = _TimedKey;
