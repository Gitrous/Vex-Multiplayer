// subscenes/BasicSubGamePlay.js — recovered from webpack module #31 of the original vex7.min.js
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

exports.BasicSubGamePlay = undefined;

_super = require("./BasicSubScene").BasicSubScene;

__extends(BasicSubGamePlay, _super);

BasicSubGamePlay.prototype.init = function () {};

BasicSubGamePlay.prototype.updateDeaths = function (t) {};

BasicSubGamePlay.prototype.resetLevel = function () {};

BasicSubGamePlay.prototype.updateTime = function () {};

BasicSubGamePlay.prototype.enterLevel = function (t) {};

BasicSubGamePlay.prototype.exitLevel = function () {};

BasicSubGamePlay.prototype.resize = function () {};

BasicSubGamePlay.prototype.getRank = function () {
  return -1;
};

BasicSubGamePlay.prototype.getTime = function () {
  return "-1";
};

var _BasicSubGamePlay = BasicSubGamePlay;

function BasicSubGamePlay() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BasicSubGamePlay = _BasicSubGamePlay;
