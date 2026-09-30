// jd/input/InputBox.js — recovered from webpack module #103 of the original vex7.min.js
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

exports.InputBox = undefined;

var JDTextInput_1 = require("../JDTextInput");

_super = Phaser.GameObjects.Graphics;

__extends(InputBox, _super);

InputBox.prototype.drawBg = function (t, e, i, n, s, r, o) {
  this.fillStyle(t, (o = o === undefined ? 1 : o));
  if (r > 0) {
    this.fillRoundedRect(e, i, n, s, r);
  } else {
    this.fillRect(e, i, n, s);
  }
};

InputBox.prototype.drawBorder = function (t, e, i, n, s, r, o) {
  this.lineStyle(t, e, 1);
  if (o > 0) {
    this.strokeRoundedRect(i, n, s, r, o);
  } else {
    this.strokeRect(i, n, s, r);
  }
};

var _InputBox = InputBox;

function InputBox(t, e, i, n) {
  var t = _super.call(this, t) || this,
    s = e.bgWidth,
    r = e.bgHeight,
    o = e.bgRadius,
    i = -s * i,
    n = -r * n;
  if (e.bgShow === JDTextInput_1.JDTextInputBg.none) {
    t.drawBg(e.bgColor, i, n, s, r, (o = 0), 0);
  } else if (e.bgShow === JDTextInput_1.JDTextInputBg.both) {
    t.drawBg(e.bgColor, i, n, s, r, o);
    t.drawBorder(e.bgBorderThickness, e.bgBorderColor, i, n, s, r, o);
  } else if (e.bgShow === JDTextInput_1.JDTextInputBg.bg) {
    t.drawBg(e.bgColor, i, n, s, r, o);
  } else if (e.bgShow === JDTextInput_1.JDTextInputBg.border) {
    t.drawBorder(e.bgBorderThickness, e.bgBorderColor, i, n, s, r, o);
  }
  t.setInteractive(new Phaser.Geom.Rectangle(i, n, s, r), Phaser.Geom.Rectangle.Contains);
  t.input.cursor = "text";
  return t;
}

exports.InputBox = _InputBox;
