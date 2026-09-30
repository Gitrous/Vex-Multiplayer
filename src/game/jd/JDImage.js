// jd/JDImage.js — recovered from webpack module #36 of the original vex7.min.js
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

exports.JDImage = undefined;

_super = Phaser.GameObjects.Image;

__extends(o, _super);

o.prototype.setTexture = function (t, e) {
  _super.prototype.setTexture.call(this, t, e);
  this.refreshDrawTint = true;
  return this;
};

o.prototype.setFrame = function (t, e, i) {
  _super.prototype.setFrame.call(this, t, e, i);
  this.refreshDrawTint = true;
  return this;
};

o.prototype.destroy = function () {
  Phaser.GameObjects.GameObject.prototype.destroy.call(this);
};

var __extends = o;

function o() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.refreshDrawTint = false;
  return t;
}

exports.JDImage = __extends;
