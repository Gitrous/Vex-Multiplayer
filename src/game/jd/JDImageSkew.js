// jd/JDImageSkew.js — recovered from webpack module #98 of the original vex7.min.js
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

exports.JDImageSkew = undefined;

_super = require("./JDImagePivot").JDImagePivot;

__extends(JDImageSkew, _super);

JDImageSkew.prototype.setSkew = function (t, e) {
  this.skewX = t;
  this.skewY = e;
};

Object.defineProperty(JDImageSkew.prototype, "skewX", {
  get: function () {
    return this._skewX;
  },
  set: function (t) {
    this._skewX = this.checkSkewValue(t);
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDImageSkew.prototype, "skewY", {
  get: function () {
    return this._skewY;
  },
  set: function (t) {
    this._skewY = this.checkSkewValue(t);
  },
  enumerable: false,
  configurable: true,
});

JDImageSkew.prototype.checkSkewValue = function (t) {
  if (t > Math.PI) {
    t = -(Math.PI - (t - Math.PI));
  } else if (t < -Math.PI) {
    t = Math.PI + (t + Math.PI);
  }
  return t;
};

var _JDImageSkew = JDImageSkew;

function JDImageSkew(t, e, i, n, s) {
  t = _super.call(this, t, e, i, n, s) || this;
  t._skewX = 0;
  t._skewY = 0;
  t._srB = 0;
  t._srC = 0;
  t._crA = 1;
  t._crD = 1;
  t._cachedRotX = 0;
  t._cachedRotY = 0;
  return t;
}

exports.JDImageSkew = _JDImageSkew;
