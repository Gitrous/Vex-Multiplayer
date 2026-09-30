// ui/buttons/ButtonImage.js — recovered from webpack module #44 of the original vex7.min.js
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

exports.ButtonImage = undefined;

_super = require("./BaseButton").BaseButton;

__extends(ButtonImage, _super);

Object.defineProperty(ButtonImage.prototype, "flipX", {
  get: function () {
    return this.view.flipX;
  },
  set: function (t) {
    this.view.flipX = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(ButtonImage.prototype, "flipY", {
  get: function () {
    return this.view.flipY;
  },
  set: function (t) {
    this.view.flipY = t;
  },
  enumerable: false,
  configurable: true,
});

var _ButtonImage = ButtonImage;

function ButtonImage(t, e, i, n, s) {
  t = _super.call(this, t) || this;
  t.createView(new Phaser.GameObjects.Image(t.scene, e, i, n, s));
  t.initEvents(t.view);
  return t;
}

exports.ButtonImage = _ButtonImage;
