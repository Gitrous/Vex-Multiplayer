// jd/JDText.js — recovered from webpack module #37 of the original vex7.min.js
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

exports.JDText = exports.JDTextAlign = undefined;

var JDTextAlign,
  _super,
  data_1 = require("../data");

(_tmp = JDTextAlign = exports.JDTextAlign || (exports.JDTextAlign = {})).left = "left";

_tmp.right = "right";

_tmp.center = "center";

_super = Phaser.GameObjects.Text;

__extends(JDText, _super);

var _tmp = JDText;

function JDText(t, e, i, n, s, r, o, a) {
  if (o === undefined) {
    o = "#ffffff";
  }
  if (a === undefined) {
    a = JDTextAlign.center;
  }
  var h = this,
    l = data_1.Fonts.getTextMetrics(r);
  (h =
    _super.call(this, t, e, i, s, { fontFamily: n, fontSize: r + "px", color: o, align: a, metrics: l }) ||
    this).setOrigin(0.5, 0.5);
  if (!l) {
    data_1.Fonts.setTextMetrics(r, h.style.metrics);
  }
  return h;
}

exports.JDText = _tmp;
