// objects/blocks/InvisBlock.js — recovered from webpack module #46 of the original vex7.min.js
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

exports.InvisBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Block_1.Block;

__extends(InvisBlock, _super);

InvisBlock.prototype.initGraphics = function () {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "invisBlock 10000");
  this.container.add(this.sprite);
};

InvisBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.container.setScale(this.width / 100, this.height / 100);
};

InvisBlock.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

InvisBlock.prototype.update = function () {
  var t;
  if (this.alive !== false) {
    t = this.main.player;
    if ((t = Tools_1.Tools.distance(this.xPos, this.yPos, t.xPos, t.yPos)) > this.RANGE) {
      this.container.alpha = 1;
    } else if (t < this.HALF_RANGE) {
      this.container.alpha = 0;
    } else {
      this.container.alpha = ((t - this.HALF_RANGE) / this.HALF_RANGE) * 1;
    }
    if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
      this.updatePosition();
    }
    this.prevX = this.xPos;
    this.prevY = this.yPos;
  }
};

InvisBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

InvisBlock.prototype.resetLevel = function () {
  this.reset();
};

var _InvisBlock = InvisBlock;

function InvisBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.RANGE = 200;
  i.HALF_RANGE = 100;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.initGraphics();
  return i;
}

exports.InvisBlock = _InvisBlock;
