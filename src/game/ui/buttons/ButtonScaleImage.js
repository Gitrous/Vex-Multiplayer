// ui/buttons/ButtonScaleImage.js — recovered from webpack module #118 of the original vex7.min.js
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

exports.ButtonScaleImage = undefined;

_super = require("./ButtonImage").ButtonImage;

__extends(ButtonScaleImage, _super);

ButtonScaleImage.prototype.downState = function () {
  this.view.scale = 1.1;
};

ButtonScaleImage.prototype.upState = function () {
  this.view.scale = 1;
};

var _ButtonScaleImage = ButtonScaleImage;

function ButtonScaleImage() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.ButtonScaleImage = _ButtonScaleImage;
