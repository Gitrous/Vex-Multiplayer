// objects/blocks/SpeedBlock.js — recovered from webpack module #197 of the original vex7.min.js
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

exports.SpeedBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Block_1.Block;

__extends(SpeedBlock, _super);

SpeedBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.container.setScale(this.width / 100, this.height / 100);
  if (BalanceData_1.BalanceData.blend === true) {
    this.arrowAnimation.playFrames(0, 23, -1, 0.5);
  }
};

SpeedBlock.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

SpeedBlock.prototype.update = function () {
  this.arrowAnimation.update();
  if (this.landed) {
    this.land();
  }
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

SpeedBlock.prototype.land = function () {
  if (
    ((this.speedInc > 0 && this.main.player.xVelocity < this.maxSpeed) ||
      (this.speedInc < 0 && this.main.player.xVelocity > this.maxSpeed)) &&
    ((this.main.player.xVelocity += this.speedInc), this.main.player.xVelocity === this.speedInc)
  ) {
    this.main.player.xVelocity += this.addSpeed;
  }
};

SpeedBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.container.destroy();
  this.container = null;
  this.arrowAnimation = null;
  _super.prototype.destroy.call(this);
};

var _SpeedBlock = SpeedBlock;

function SpeedBlock(t, e, i) {
  var n = _super.call(this, t, e) || this;
  n.container = new Phaser.GameObjects.Container(t);
  e.add(n.container);
  n.speedInc = 1.6 * i;
  n.maxSpeed = 5 * n.speedInc;
  n.addSpeed = 0.75 * n.speedInc;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "speedBlock 10000");
  n.container.add(n.sprite);
  n.arrowAnimation = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "speedBlockArrow ");
  n.container.add(n.arrowAnimation);
  if (n.speedInc > 0) {
    n.sprite.scaleX = 1;
    n.arrowAnimation.scaleX = 1;
  } else {
    n.sprite.scaleX = -1;
    n.arrowAnimation.scaleX = -1;
  }
  n.type = "speed";
  return n;
}

exports.SpeedBlock = _SpeedBlock;
