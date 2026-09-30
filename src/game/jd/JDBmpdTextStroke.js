// jd/JDBmpdTextStroke.js — recovered from webpack module #93 of the original vex7.min.js
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

exports.JDBmpdTextStroke = undefined;

var jd_1 = require("."),
  JDTextFit_1 = require("./JDTextFit");

_super = Phaser.GameObjects.Container;

__extends(JDBmpdTextStroke, _super);

JDBmpdTextStroke.prototype.setStrokeScale = function (t, e, i) {
  this.txtStroke.scale = t;
  this.txt.x = e;
  this.txt.y = i;
};

JDBmpdTextStroke.prototype.setOrigin = function (t, e) {
  this.txtStroke.setOrigin(t, e);
  this.txt.setOrigin(t, e);
};

JDBmpdTextStroke.prototype.setColor = function (t, e) {
  this.txtStroke.setColor(e);
  this.txt.setColor(t);
};

Object.defineProperty(JDBmpdTextStroke.prototype, "text", {
  get: function () {
    return this.txtStroke.text;
  },
  set: function (t) {
    this.txtStroke.text = t;
    this.updateTxt();
  },
  enumerable: false,
  configurable: true,
});

JDBmpdTextStroke.prototype.setFitSize = function (t, e, i) {
  if (e === undefined) {
    e = JDTextFit_1.JDTextFitParam.size;
  }
  this.txtStroke.setFitSize(t, e, (i = i === undefined ? 0 : i));
  this.updateTxt();
};

JDBmpdTextStroke.prototype.updateTxt = function () {
  this.txt.fontSize = this.txtStroke.fontSize;
  if (this.txtStroke.getTextBounds().wrappedText === "") {
    this.txt.text = this.txtStroke.text;
  } else {
    this.txt.text = this.txtStroke.getTextBounds().wrappedText;
  }
};

JDBmpdTextStroke.prototype.destroy = function (t) {
  _super.prototype.destroy.call(this, t);
  this.txtStroke = null;
  this.txt = null;
};

var _JDBmpdTextStroke = JDBmpdTextStroke;

function JDBmpdTextStroke(t, e, i, n, s, r, o, a, h) {
  if (o === undefined) {
    o = 16777215;
  }
  if (a === undefined) {
    a = 16777215;
  }
  if (h === undefined) {
    h = 1;
  }
  e = _super.call(this, t, e, i) || this;
  e.txtStroke = new jd_1.JDBmpdTextTranslated(t, 0, 0, n + "Stroke", s, r, a, h);
  e.add(e.txtStroke);
  e.txt = new jd_1.JDBmpdTextTranslated(t, r / 20, r / 8, n, s, r, o, h);
  e.add(e.txt);
  return e;
}

exports.JDBmpdTextStroke = _JDBmpdTextStroke;
