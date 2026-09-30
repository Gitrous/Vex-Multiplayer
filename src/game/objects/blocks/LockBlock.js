// objects/blocks/LockBlock.js — recovered from webpack module #192 of the original vex7.min.js
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

exports.LockBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data");

_super = Block_1.Block;

__extends(LockBlock, _super);

LockBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
};

LockBlock.prototype.unlock = function () {
  this.unlocked = true;
  this.alive = false;
  this.sprite.visible = false;
};

LockBlock.prototype.update = function () {};

LockBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

LockBlock.prototype.reset = function () {};

LockBlock.prototype.resetLevel = function () {
  this.alive = true;
  this.unlocked = false;
  this.sprite.visible = true;
};

LockBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _LockBlock = LockBlock;

function LockBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.unlocked = false;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "lockBlock 10000");
  e.add(i.sprite);
  i.type = "lock";
  return i;
}

exports.LockBlock = _LockBlock;
