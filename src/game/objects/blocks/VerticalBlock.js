// objects/blocks/VerticalBlock.js — recovered from webpack module #199 of the original vex7.min.js
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

exports.VerticalBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data");

_super = Block_1.Block;

__extends(VerticalBlock, _super);

VerticalBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.moveDist = t.moveDist;
  this.startSpeed = t.speed;
  this.yVelocity = this.startSpeed;
  if (t.speed > 0) {
    this.sprite.setFrame("verticalDownBlock 10000");
  } else {
    this.sprite.setFrame("verticalUpBlock 10000");
  }
};

VerticalBlock.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.yPos = this.startY;
  this.yVelocity = this.startSpeed;
  this.updatePosition();
};

VerticalBlock.prototype.resetLevel = function () {
  this.reset();
};

VerticalBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

VerticalBlock.prototype.update = function () {
  if (this.yVelocity < 0) {
    if (this.yPos < this.startY - this.moveDist && ((this.yVelocity = -this.yVelocity), this.landed)) {
      this.main.player.yPos += 2 * this.yVelocity;
      this.main.player.updatePositions();
    }
  } else if (this.yPos > this.startY + this.moveDist && ((this.yVelocity = -this.yVelocity), this.landed)) {
    this.main.player.yPos += 2 * this.yVelocity;
    this.main.player.updatePositions();
  }
  this.yPos += this.yVelocity;
  this.updatePosition();
};

VerticalBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _VerticalBlock = VerticalBlock;

function VerticalBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "verticalUpBlock 10000");
  e.add(i.sprite);
  return i;
}

exports.VerticalBlock = _VerticalBlock;
