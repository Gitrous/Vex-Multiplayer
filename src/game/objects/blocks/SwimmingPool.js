// objects/blocks/SwimmingPool.js — recovered from webpack module #198 of the original vex7.min.js
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

exports.SwimmingPool = undefined;

var Entity_1 = require("../../entities/Entity"),
  data_1 = require("../../data");

_super = Entity_1.Entity;

__extends(SwimmingPool, _super);

SwimmingPool.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.pools, this);
  _super.prototype.destroySelf.call(this);
};

SwimmingPool.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.width = t.width;
  this.height = t.height;
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.changeSpriteFrame(0);
  this.electric = false;
  this.totalPolygon = new SAT.Box(
    new SAT.Vector(this.xPos - this.width / 2, this.yPos - this.height / 2),
    this.width,
    this.height,
  ).toPolygon();
  this.topPolygon = new SAT.Box(
    new SAT.Vector(this.xPos - this.width / 2, this.yPos - this.height / 2),
    this.width,
    12,
  ).toPolygon();
};

SwimmingPool.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

SwimmingPool.prototype.changeSpriteFrame = function (t) {
  this.sprite.setFrame("swimmingPool 1000" + t);
};

SwimmingPool.prototype.setElectric = function (t) {
  if (this.electric !== t) {
    if (t === true) {
      this.changeSpriteFrame(1);
    } else {
      this.changeSpriteFrame(0);
    }
    this.electric = t;
  }
};

SwimmingPool.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.totalPolygon = null;
  this.topPolygon = null;
  _super.prototype.destroy.call(this);
};

var _SwimmingPool = SwimmingPool;

function SwimmingPool(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "swimmingPool 10000");
  e.add(i.sprite);
  return i;
}

exports.SwimmingPool = _SwimmingPool;
