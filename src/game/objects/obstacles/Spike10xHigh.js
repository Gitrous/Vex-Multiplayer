// objects/obstacles/Spike10xHigh.js — recovered from webpack module #172 of the original vex7.min.js
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

exports.Spike10xHigh = undefined;

var Spike_1 = require("./Spike"),
  data_1 = require("../../data");

_super = Spike_1.Spike;

__extends(Spike10xHigh, _super);

Spike10xHigh.prototype.init = function () {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "spike10xHigh 10000");
  this.layer.add(this.sprite);
  this.sprite.visible = false;
  this.width = 83;
  this.height = 48;
  this.halfWidth = 0.5 * this.width;
  this.halfHeight = 0.5 * this.height;
};

var _Spike10xHigh = Spike10xHigh;

function Spike10xHigh() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.Spike10xHigh = _Spike10xHigh;
