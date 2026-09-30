// objects/blocks/BasicBlock.js — recovered from webpack module #66 of the original vex7.min.js
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

exports.BasicBlock = undefined;

var data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = require("./Block").Block;

__extends(BasicBlock, _super);

BasicBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setFrame(BalanceData_1.BalanceData.getBasicBlockFrame(this.main.currLevelID));
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.sprite.visible = true;
};

BasicBlock.prototype.update = function () {
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

BasicBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

BasicBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _BasicBlock = BasicBlock;

function BasicBlock(t, e) {
  e = _super.call(this, t, e) || this;
  e.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.layer.add(e.sprite);
  e.sprite.visible = false;
  return e;
}

exports.BasicBlock = _BasicBlock;
