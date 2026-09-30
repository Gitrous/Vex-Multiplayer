// jd/JDBmpdTextFit.js — recovered from webpack module #54 of the original vex7.min.js
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

exports.JDBmpdTextFit = undefined;

var JDBmpdText_1 = require("./JDBmpdText"),
  JDTextFit_1 = require("./JDTextFit");

_super = JDBmpdText_1.JDBmpdText;

__extends(JDBmpdTextFit, _super);

JDBmpdTextFit.prototype.setFitSize = function (t, e, i) {
  if (e === undefined) {
    e = JDTextFit_1.JDTextFitParam.size;
  }
  if (i === undefined) {
    i = 0;
  }
  this.maxSWidth = t;
  this.maxSHeight = i;
  this.fitParam = e;
  if (this.maxSWidth <= 0) {
    this.setMaxWidth(this.maxSWidth);
    if (this.fontSize !== this.createFontSize) {
      this.fontSize = this.createFontSize;
    }
  } else {
    this.calcFitSize();
  }
};

JDBmpdTextFit.prototype.setText = function (t) {
  _super.prototype.setText.call(this, t);
  if (this.maxSWidth || this.maxSHeight) {
    this.calcFitSize();
  }
  return this;
};

JDBmpdTextFit.prototype.calcFitSize = function () {
  if (
    (this.fontSize !== this.createFontSize && (this.fontSize = this.createFontSize),
    this.fitParam !== JDTextFit_1.JDTextFitParam.wordWrap)
  ) {
    if (this.fitParam === JDTextFit_1.JDTextFitParam.both) {
      this.setMaxWidth(this.maxSWidth);
    }
    var t = this.scaleX,
      e = this.scaleY;
    for (this.setScale(1, 1); this.width > this.maxSWidth || (this.maxSHeight > 0 && this.height > this.maxSHeight);)
      --this.fontSize;
    this.setScale(t, e);
  } else this.setMaxWidth(this.maxSWidth);
};

var _JDBmpdTextFit = JDBmpdTextFit;

function JDBmpdTextFit(t, e, i, n, s, r, o, a) {
  t = _super.call(this, t, e, i, n, s, r, (o = o === undefined ? 16777215 : o), (a = a === undefined ? 1 : a)) || this;
  t.createFontSize = r;
  return t;
}

exports.JDBmpdTextFit = _JDBmpdTextFit;
