// objects/wires/Wire.js — recovered from webpack module #239 of the original vex7.min.js
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

exports.Wire = undefined;

var Entity_1 = require("../../entities/Entity"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Entity_1.Entity;

__extends(Wire, _super);

Wire.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = t.x;
  this.sprite.y = t.y;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.sprite.visible = true;
  this.alive = true;
};

Wire.prototype.resetLevel = function () {
  this.sprite.scaleX = 1;
};

Wire.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

Wire.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.wires, this);
  _super.prototype.destroySelf.call(this);
};

var _Wire = Wire;

function Wire(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "wire 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.sprite.setOrigin(1 / 52, 0.5);
  return i;
}

exports.Wire = _Wire;
