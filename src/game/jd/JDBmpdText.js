// jd/JDBmpdText.js — recovered from webpack module #53 of the original vex7.min.js
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

exports.JDBmpdText = undefined;

_super = Phaser.GameObjects.BitmapText;

__extends(r, _super);

r.prototype.setText = function (t) {
  this.refreshDrawTint = true;
  _super.prototype.setText.call(this, t);
  return this;
};

r.prototype.setColor = function (t) {
  this.tint = t;
};

r.prototype.destroy = function () {
  Phaser.GameObjects.GameObject.prototype.destroy.call(this);
};

r.prototype.toUpperCase = function () {
  _super.prototype.setText.call(this, this.text.toUpperCase());
};

var __extends = r;

function r(t, e, i, n, s, r, o, a) {
  if (o === undefined) {
    o = 16777215;
  }
  t = _super.call(this, t, e, i, n, s, r, (a = a === undefined ? 1 : a)) || this;
  t.refreshDrawTint = false;
  t.setOrigin(0.5 * a, 0.5);
  t.setColor(o);
  return t;
}

exports.JDBmpdText = __extends;
