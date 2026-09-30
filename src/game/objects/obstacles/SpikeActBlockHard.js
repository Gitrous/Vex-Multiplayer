// objects/obstacles/SpikeActBlockHard.js — recovered from webpack module #177 of the original vex7.min.js
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

exports.SpikeActBlockHard = undefined;

_super = require("./Spike").Spike;

__extends(SpikeActBlockHard, _super);

SpikeActBlockHard.prototype.init = function () {
  _super.prototype.init.call(this, "spikeActBlockHard 10000", 12);
};

var _SpikeActBlockHard = SpikeActBlockHard;

function SpikeActBlockHard() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SpikeActBlockHard = _SpikeActBlockHard;
