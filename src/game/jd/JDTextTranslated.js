// jd/JDTextTranslated.js — recovered from webpack module #99 of the original vex7.min.js
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

exports.JDTextTranslated = undefined;

var JDTextFit_1 = require("./JDTextFit"),
  Localization_1 = require("../system/Localization");

_super = JDTextFit_1.JDTextFit;

__extends(JDTextTranslated, _super);

JDTextTranslated.prototype.setText = function (t, e) {
  if (e === undefined) {
    e = "";
  }
  this.setKey(t);
  this.updateTranslate(e);
  return this;
};

JDTextTranslated.prototype.setKey = function (t) {
  this.key = t;
};

JDTextTranslated.prototype.getLocale = function () {
  return Localization_1.Localization.getText(this.key);
};

JDTextTranslated.prototype.updateTranslate = function (t) {
  if (t === undefined) {
    t = "";
  }
  _super.prototype.setText.call(this, this.getLocale() + t);
};

JDTextTranslated.prototype.setTextNoLocale = function (t) {
  _super.prototype.setText.call(this, t);
};

var _JDTextTranslated = JDTextTranslated;

function JDTextTranslated() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.JDTextTranslated = _JDTextTranslated;
