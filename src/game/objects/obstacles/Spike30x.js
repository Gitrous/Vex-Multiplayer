// objects/obstacles/Spike30x.js — recovered from webpack module #176 of the original vex7.min.js
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

exports.Spike30x = undefined;

_super = require("./Spike").Spike;

__extends(Spike30x, _super);

Spike30x.prototype.init = function () {
  _super.prototype.init.call(this, "spike30x 10000", 30);
};

var _Spike30x = Spike30x;

function Spike30x() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.Spike30x = _Spike30x;
