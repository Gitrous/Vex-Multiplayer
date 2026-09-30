// objects/blocks/AppearingBlock.js — recovered from webpack module #153 of the original vex7.min.js
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

exports.AppearingBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Block_1.Block;

__extends(AppearingBlock, _super);

AppearingBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.actTime = 0;
  this.timeShow = t.timeShow;
  this.timeHide = t.timeHide;
  this.alive = t.initVisible;
  this.initVisible = this.alive;
  this.sprite.alpha = this.alive ? 1 : 0;
  this.sprite.visible = true;
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / this.sprite.width, this.height / this.sprite.height);
};

AppearingBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

AppearingBlock.prototype.update = function () {
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
  this.actTime += 0.5;
  if (this.alive && this.actTime >= this.timeHide) {
    this.hide();
  } else if (!this.alive && this.actTime >= this.timeShow) {
    this.show();
  }
  if (this.alive && this.actTime >= this.timeHide * (1 - BalanceData_1.BalanceData.config_AppearingBlockDisapper)) {
    this.sprite.tint = 30583;
  } else if (
    !this.alive &&
    this.actTime >= this.timeShow * (1 - BalanceData_1.BalanceData.config_AppearingBlockApper)
  ) {
    this.sprite.alpha = 0.2;
    this.sprite.tint = 16777215;
  }
};

AppearingBlock.prototype.show = function () {
  this.actTime = 0;
  this.alive = true;
  this.sprite.alpha = 1;
};

AppearingBlock.prototype.hide = function () {
  this.actTime = 0;
  this.alive = false;
  this.sprite.alpha = 0;
};

AppearingBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

AppearingBlock.prototype.resetLevel = function () {
  _super.prototype.resetLevel.call(this);
  this.actTime = 0;
  this.alive = this.initVisible;
  this.sprite.alpha = this.initVisible ? 1 : 0;
};

var _AppearingBlock = AppearingBlock;

function AppearingBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "appearingBlock 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.type = "appearingBlock";
  i.isIgnore = false;
  return i;
}

exports.AppearingBlock = _AppearingBlock;
