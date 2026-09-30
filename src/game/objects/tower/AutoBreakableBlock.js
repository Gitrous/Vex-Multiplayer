// objects/tower/AutoBreakableBlock.js — recovered from webpack module #244 of the original vex7.min.js
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

exports.AutoBreakableBlock = undefined;

var data_1 = require("../../data");

_super = require("../blocks/Block").Block;

__extends(AutoBreakableBlock, _super);

AutoBreakableBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.sprite.visible = true;
  this.sprite.alpha = 1;
  this.startBreak = 0;
};

AutoBreakableBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

AutoBreakableBlock.prototype.landOn = function (t) {
  if (t && this.startBreak === 0) {
    this.startBreak = 60;
  }
};

AutoBreakableBlock.prototype.update = function () {
  if (this.alive !== false && this.startBreak !== 0) {
    --this.startBreak;
    if (this.startBreak <= 5 && ((this.sprite.alpha -= 0.2), this.startBreak === 0)) {
      this.sprite.alpha = 0;
      this.alive = false;
      this.sprite.visible = false;
    }
    this.sprite.x = this.startX - 2 + 4 * Math.random();
    this.sprite.y = this.startY - 2 + 4 * Math.random();
  }
};

AutoBreakableBlock.prototype.reset = function () {
  this.startBreak = 0;
  this.alive = true;
  this.sprite.alpha = 1;
  this.sprite.visible = true;
  this.updateGraphicPosition();
  _super.prototype.reset.call(this);
};

AutoBreakableBlock.prototype.resetLevel = function () {
  this.reset();
};

AutoBreakableBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _AutoBreakableBlock = AutoBreakableBlock;

function AutoBreakableBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "fallingBlock 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  return i;
}

exports.AutoBreakableBlock = _AutoBreakableBlock;
