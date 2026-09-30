// ui/buttons/ButtonContainerFrame.js — recovered from webpack module #120 of the original vex7.min.js
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

exports.ButtonContainerFrame = undefined;

_super = require("./ButtonContainer").ButtonContainer;

__extends(ButtonContainerFrame, _super);

ButtonContainerFrame.prototype.setFrames = function (t, e) {
  this.frameUp = t;
  this.frameDown = e;
  this.upState();
};

ButtonContainerFrame.prototype.downState = function () {
  this.image.setFrame(this.frameDown);
};

ButtonContainerFrame.prototype.upState = function () {
  this.image.setFrame(this.frameUp);
};

var _ButtonContainerFrame = ButtonContainerFrame;

function ButtonContainerFrame(t, e, i, n, s, r) {
  t = _super.call(this, t, e, i) || this;
  t.addImageEvents(n, s);
  t.frameUp = s;
  t.frameDown = r;
  return t;
}

exports.ButtonContainerFrame = _ButtonContainerFrame;
