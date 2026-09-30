// objects/items/FadeArrow.js — recovered from webpack module #228 of the original vex7.min.js
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

exports.FadeArrow = undefined;

var BasicFade_1 = require("./BasicFade"),
  data_1 = require("../../data");

_super = BasicFade_1.BasicFade;

__extends(FadeArrow, _super);

FadeArrow.prototype.spawn = function (t) {
  this.startScale = t.size / 100;
  _super.prototype.spawn.call(this, t);
  this.sprite.setFrame("gamearrow" + this.id + " 10000");
};

var _FadeArrow = FadeArrow;

function FadeArrow(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(i.sprite);
  i.sprite.visible = false;
  return i;
}

exports.FadeArrow = _FadeArrow;
