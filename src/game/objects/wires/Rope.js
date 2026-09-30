// objects/wires/Rope.js — recovered from webpack module #238 of the original vex7.min.js
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

exports.Rope = undefined;

var data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = require("../../entities/Entity").Entity;

__extends(Rope, _super);

Rope.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.height = t.height;
  this.sprite.displayWidth = this.width;
  this.sprite.displayHeight = this.height;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.visible = true;
  this.alive = true;
  this.halfHeight = 0.5 * this.height;
  this.totalBound = new SAT.Box(new SAT.Vector(this.xPos, this.yPos), this.width, this.height - 16);
  this.totalBoundPolygon = this.totalBound.toPolygon();
  this.totalBoundPolygon.setOffset(new SAT.Vector(-0.5 * this.width, -(this.halfHeight + 8)));
};

Rope.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
  this.totalBound = null;
  this.totalBoundPolygon = null;
};

Rope.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.ropes, this);
  _super.prototype.destroySelf.call(this);
};

var _Rope = Rope;

function Rope(t, e) {
  var i = _super.call(this, t) || this;
  i.width = 5;
  i.sprite = new Phaser.GameObjects.Image(
    t,
    0,
    0,
    data_1.Atlases.gameplay,
    BalanceData_1.BalanceData.getBasicBlockFrame(i.main.currLevelID),
  );
  i.sprite.setOrigin(1, 0.5);
  e.add(i.sprite);
  i.sprite.visible = false;
  return i;
}

exports.Rope = _Rope;
