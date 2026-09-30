// objects/blocks/BounceBlock.js — recovered from webpack module #181 of the original vex7.min.js
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

exports.BounceBlock = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  BalanceData_1 = require("../../system/BalanceData"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Block").Block;

__extends(BounceBlock, _super);

BounceBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.offScale = 0;
  this.startScaleX = this.width / 100;
  this.startScaleY = this.height / 100;
  this.updateGraphicPosition();
  this.container.setScale(this.startScaleX, this.startScaleY);
  if (BalanceData_1.BalanceData.blend === true) {
    this.arrowAnimation.playFrames(0, 23, -1, 0.5);
  }
  this.bouncing = false;
};

BounceBlock.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

BounceBlock.prototype.update = function () {
  this.arrowAnimation.update();
  if (this.landed) {
    this.specificLand();
  } else if (!(this.container.scaleX === 1 && this.container.scaleY === 1)) {
    this.container.scaleY -= 0.075 * (this.container.scaleY - this.startScaleY);
    this.container.scaleX -= 0.075 * (this.container.scaleX - this.startScaleX);
    this.offScale = 1 - this.container.scaleY / this.startScaleY;
  }
  this.container.y = this.yPos + this.halfHeight * this.offScale;
};

BounceBlock.prototype.specificLand = function () {
  this.container.scaleX += 0.02;
  this.container.scaleY -= 0.02;
  this.offScale = 1 - this.container.scaleY / this.startScaleY;
  var t = this.main.player;
  if (this.bouncing === false) {
    this.lockX = t.xPos;
    t.setCrouch();
    t.disableControls = true;
    t.disableCollision = true;
    this.bouncing = true;
  } else {
    t.yVelocity = 0;
    t.xPos = this.lockX;
    t.yPos = this.yPos - this.halfHeight;
    t.setSpineOffY(this.height * this.offScale);
    t.updatePositions();
  }
  if (this.container.scaleY < 0.25) {
    t.jump(-0.26 * this.height);
    t.disableControls = false;
    t.disableCollision = false;
    t.setSpineOffY(0);
    this.bouncing = false;
    SoundManager_1.SoundManager.playSFX("bounce1");
  }
};

BounceBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.arrowAnimation.destroy();
  this.arrowAnimation = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _BounceBlock = BounceBlock;

function BounceBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "bounceBlock 10000");
  i.container.add(i.sprite);
  i.arrowAnimation = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "bounceBlockArrow ");
  i.container.add(i.arrowAnimation);
  i.type = "bounce";
  return i;
}

exports.BounceBlock = _BounceBlock;
