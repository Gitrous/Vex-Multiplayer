// objects/wires/ZiplinePole.js — recovered from webpack module #241 of the original vex7.min.js
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

exports.ZiplinePole = undefined;

var Entity_1 = require("../../entities/Entity"),
  wires_1 = require("."),
  data_1 = require("../../data");

_super = Entity_1.Entity;

__extends(ZiplinePole, _super);

ZiplinePole.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

ZiplinePole.prototype.attach = function (t) {
  this.wire = new wires_1.ZiplineWire(this.main, this.layer);
  this.wire.setPos(this.xPos, this.yPos, t.xPos, t.yPos);
  t.wire = this.wire;
  return this.wire;
};

ZiplinePole.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  if (this.wire) {
    this.wire.destroy();
  }
  this.wire = null;
  this.layer = null;
  _super.prototype.destroy.call(this);
};

ZiplinePole.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.misc, this);
  this.wire.destroySelf();
  _super.prototype.destroySelf.call(this);
};

var _ZiplinePole = ZiplinePole;

function ZiplinePole(t, e) {
  var i = _super.call(this, t) || this;
  i.layer = e;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "ziplinePole 10000");
  e.add(i.sprite);
  i.sprite.setOrigin(3 / 9.8, 29.2 / 64.25);
  return i;
}

exports.ZiplinePole = _ZiplinePole;
