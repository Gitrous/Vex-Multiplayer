// objects/obstacles/Spike15x.js — recovered from webpack module #173 of the original vex7.min.js
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

exports.Spike15x = undefined;

_super = require("./Spike").Spike;

__extends(Spike15x, _super);

Spike15x.prototype.init = function () {
  _super.prototype.init.call(this, "spike15x 10000", 15);
};

var _Spike15x = Spike15x;

function Spike15x() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.Spike15x = _Spike15x;
