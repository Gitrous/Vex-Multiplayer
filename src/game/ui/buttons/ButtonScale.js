// ui/buttons/ButtonScale.js — recovered from webpack module #117 of the original vex7.min.js
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

exports.ButtonScale = undefined;

_super = require("./ButtonContainer").ButtonContainer;

__extends(ButtonScale, _super);

ButtonScale.prototype.downState = function () {
  this.view.scale = 1.1;
};

ButtonScale.prototype.upState = function () {
  if (this.view) {
    this.view.scale = 1;
  }
};

var _ButtonScale = ButtonScale;

function ButtonScale() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.ButtonScale = _ButtonScale;
