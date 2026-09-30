// jd/JDTextFit.js — recovered from webpack module #9 of the original vex7.min.js
"use strict";

var n,
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

exports.JDTextFit = exports.JDTextFitParam = undefined;

var JDTextFitParam,
  _super,
  JDText_1 = require("./JDText");

(_tmp = JDTextFitParam = exports.JDTextFitParam || (exports.JDTextFitParam = {}))[(_tmp.size = 0)] = "size";

_tmp[(_tmp.wordWrap = 1)] = "wordWrap";

_tmp[(_tmp.both = 2)] = "both";

_super = JDText_1.JDText;

__extends(JDTextFit, _super);

JDTextFit.prototype.setText = function (t) {
  _super.prototype.setText.call(this, t);
  if (this.maxWidth || this.maxHeight) {
    this.calcFitSize();
  }
  return this;
};

JDTextFit.prototype.setFitSize = function (t, e, i) {
  if (e === undefined) {
    e = JDTextFitParam.size;
  }
  if (i === undefined) {
    i = 0;
  }
  this.maxWidth = t;
  this.maxHeight = i;
  this.fitParam = e;
  if (this.maxWidth <= 0) {
    this.style.setFontSize(this.fontSize);
  } else {
    this.calcFitSize();
  }
};

JDTextFit.prototype.calcFitSize = function () {
  var t = this.fontSize;
  if ((this.style.setFontSize(t), this.fitParam !== JDTextFitParam.wordWrap))
    for (
      this.fitParam === JDTextFitParam.both &&
      _super.prototype.setText.call(this, this.customBasicWordWrap(this.text, this.context, this.maxWidth));
      this.width > this.maxWidth || (this.maxHeight > 0 && this.height > this.maxHeight);
    )
      this.style.setFontSize(--t);
  else _super.prototype.setText.call(this, this.customBasicWordWrap(this.text, this.context, this.maxWidth));
};

JDTextFit.prototype.customBasicWordWrap = function (t, e, i) {
  for (var n = "", s = t.split(this.splitRegExp), r = s.length - 1, o = e.measureText(" ").width, a = 0; a <= r; a++) {
    for (var h = i, l = s[a].split(" "), u = l.length - 1, c = 0; c <= u; c++) {
      var d = l[c],
        p = e.measureText(d).width,
        f = p;
      if (c < u) {
        f += o;
      }
      if (h < f && c > 0) {
        n = n.slice(0, -1);
        n += "\n";
        h = i;
      }
      n += d;
      if (c < u) {
        n += " ";
        h -= f;
      } else {
        h -= p;
      }
    }
    if (a < r) {
      n += "\n";
    }
  }
  return n;
};

var _tmp = JDTextFit;

function JDTextFit(t, e, i, n, s, r, o, a) {
  if (a === undefined) {
    a = JDText_1.JDTextAlign.center;
  }
  t = _super.call(this, t, e, i, n, s, r, (o = o === undefined ? "#ffffff" : o), a) || this;
  t.fontSize = r;
  t.fitParam = JDTextFitParam.size;
  return t;
}

exports.JDTextFit = _tmp;
