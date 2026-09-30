// objects/blocks/HorizontalBlock.js — recovered from webpack module #188 of the original vex7.min.js
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

exports.HorizontalBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data");

_super = Block_1.Block;

__extends(HorizontalBlock, _super);

HorizontalBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.moveDist = t.moveDist;
  this.startSpeed = t.speed;
  this.xVelocity = this.startSpeed;
};

HorizontalBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

HorizontalBlock.prototype.update = function () {
  var t = this.xPos;
  if (this.xVelocity > 0) {
    if (this.xPos > this.startX + this.moveDist) {
      this.xVelocity = -this.xVelocity;
    }
  } else if (this.xPos < this.startX - this.moveDist) {
    this.xVelocity = -this.xVelocity;
  }
  this.xPos += this.xVelocity;
  if (this.xPos !== t) {
    this.updatePosition();
  }
  if (this.landed) {
    t = this.main.player.xPos - t - this.landed.x;
    this.landed.x += t;
    this.main.player.xPos = this.xPos + this.landed.x;
    this.main.player.updatePositions();
  }
};

HorizontalBlock.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.xPos = this.startX;
  this.xVelocity = this.startSpeed;
  this.updatePosition();
};

HorizontalBlock.prototype.resetLevel = function () {
  this.reset();
};

HorizontalBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _HorizontalBlock = HorizontalBlock;

function HorizontalBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "horizontalBlock 10000");
  e.add(i.sprite);
  return i;
}

exports.HorizontalBlock = _HorizontalBlock;
