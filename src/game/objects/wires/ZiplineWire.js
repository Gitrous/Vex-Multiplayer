// objects/wires/ZiplineWire.js — recovered from webpack module #240 of the original vex7.min.js
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

exports.ZiplineWire = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  Entity_1 = require("../../entities/Entity"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Entity_1.Entity;

__extends(ZiplineWire, _super);

ZiplineWire.prototype.setPos = function (t, e, i, n) {
  this.startPosX = t;
  this.startPosY = e - this.yOff;
  var s = i,
    r = n - this.yOff;
  if (n < e) {
    this.startPosX = i;
    this.startPosY = n - this.yOff;
    s = t;
    r = e - this.yOff;
  }
  this.topEdge = this.startPosY;
  this.bottomEdge = r;
  if (this.startPosX < s) {
    this.direction = PlayerBase_1.FacingDir.Right;
    this.leftEdge = this.startPosX;
    this.rightEdge = s;
  } else {
    this.direction = PlayerBase_1.FacingDir.Left;
    this.leftEdge = s;
    this.rightEdge = this.startPosX;
  }
  this.width = Math.abs(s - this.startPosX);
  this.height = Math.abs(r - this.startPosY);
  this.scope = this.height / this.width;
  this.wire.x = this.startPosX;
  this.wire.y = this.startPosY;
  this.wire.displayWidth = Tools_1.Tools.distance(this.startPosX, this.startPosY, s, r);
  this.wire.rotation = Tools_1.Tools.angleOfPoints(this.startPosX, this.startPosY, s, r);
  this.hitPolygon = new SAT.Polygon(new SAT.Vector(this.startPosX, this.startPosY), [
    new SAT.Vector(0, 5),
    new SAT.Vector(s - this.startPosX, r - this.startPosY + 5),
    new SAT.Vector(s - this.startPosX, r - this.startPosY - 5),
    new SAT.Vector(0, -5),
  ]);
};

ZiplineWire.prototype.destroy = function () {
  if (this.wire) {
    this.wire.destroy();
  }
  this.wire = null;
  this.hitPolygon = null;
  _super.prototype.destroy.call(this);
};

ZiplineWire.prototype.destroySelf = function () {
  if (this.main) {
    this.main.removeBlockFrom(this.main.ziplines, this);
    _super.prototype.destroySelf.call(this);
  }
};

var _ZiplineWire = ZiplineWire;

function ZiplineWire(t, e) {
  var i = _super.call(this, t) || this;
  i.yOff = 25;
  i.wire = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  i.wire.setOrigin(0, 0.5);
  i.wire.tint = 16737792;
  e.add(i.wire);
  return i;
}

exports.ZiplineWire = _ZiplineWire;
