// objects/blocks/Slope.js — recovered from webpack module #193 of the original vex7.min.js
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

exports.Slope = undefined;

var Entity_1 = require("../../entities/Entity"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Entity_1.Entity;

__extends(Slope, _super);

Slope.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.slopes, this);
  _super.prototype.destroySelf.call(this);
};

Slope.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.width = t.size;
  this.height = t.size;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.setFrame(BalanceData_1.BalanceData.getSlopeFrame(this.main.currLevelID));
  this.sprite.scaleY = this.width / 100;
  this.sprite.scaleX = this.sprite.scaleY * -this.side;
  this.alive = true;
  var t = this.width / 2,
    e = this.height / 2;
  this.topEdge = this.yPos - e;
  this.bottomEdge = this.yPos + e;
  this.leftEdge = this.xPos - t;
  this.rightEdge = this.xPos + t;
  this.wallPoly = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), 10, this.height - 20).toPolygon();
  if (this.side === 1) {
    this.wallPoly.setOffset(new SAT.Vector(-t, 20 - e));
  } else {
    this.wallPoly.setOffset(new SAT.Vector(t - 10, 20 - e));
  }
  this.bottomPoly = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), this.width, 10).toPolygon();
  this.bottomPoly.setOffset(new SAT.Vector(-t, e - 10));
};

Slope.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _Slope = Slope;

function Slope(t, e, i) {
  var n = _super.call(this, t) || this;
  n.side = i;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(n.sprite);
  return n;
}

exports.Slope = _Slope;
