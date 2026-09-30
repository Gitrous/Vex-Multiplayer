// objects/blocks/FallingBlock.js — recovered from webpack module #186 of the original vex7.min.js
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

exports.FallingBlock = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  BalanceData_1 = require("../../system/BalanceData"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Block").Block;

__extends(FallingBlock, _super);

FallingBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.container.setScale(this.width / 100, this.height / 100);
  if (BalanceData_1.BalanceData.blend === true) {
    this.arrowAnimation.playFrames(0, 23, -1, 0.5);
  }
  this.container.visible = true;
  this.falling = false;
};

FallingBlock.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

FallingBlock.prototype.update = function () {
  if ((this.arrowAnimation.update(), this.alive === false)) {
    if (SAT.testPolygonPolygon(this.totalPolygon, this.main.player.bodyPolygon)) return;
    this.alive = true;
  }
  this.prevY = this.yPos;
  if (this.falling === false) {
    if (this.landed) {
      this.falling = true;
      this.yVelocity = -1.5;
      SoundManager_1.SoundManager.playSFX("fallingBlock", 0.4);
    } else if (this.container.alpha < 1) {
      this.container.alpha += 0.02;
    }
  } else {
    this.yVelocity += this.main.gravity;
    this.container.alpha -= 0.01;
    if (this.yVelocity >= 15) {
      SoundManager_1.SoundManager.playSFX("blockDestroy");
      this.alive = false;
      this.container.alpha = 0;
      this.yPos = this.startY;
      this.yVelocity = 0;
      this.falling = false;
    }
  }
  this.yPos += this.yVelocity;
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

FallingBlock.prototype.reset = function () {
  this.yPos = this.startY;
  this.yVelocity = 0;
  this.falling = false;
  this.alive = true;
  this.container.alpha = 1;
  this.updatePosition();
  _super.prototype.reset.call(this);
};

FallingBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.arrowAnimation.destroy();
  this.arrowAnimation = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _FallingBlock = FallingBlock;

function FallingBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "fallingBlock 10000");
  i.container.add(i.sprite);
  i.arrowAnimation = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "fallingBlockArrow ");
  i.container.add(i.arrowAnimation);
  i.container.visible = false;
  return i;
}

exports.FallingBlock = _FallingBlock;
