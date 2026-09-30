// objects/tower/BreakableBlock.js — recovered from webpack module #245 of the original vex7.min.js
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

exports.BreakableBlock = undefined;

var data_1 = require("../../data"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("../blocks/Block").Block;

__extends(BreakableBlock, _super);

BreakableBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.sprite.visible = true;
};

BreakableBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

BreakableBlock.prototype.smash = function () {
  this.sprite.visible = false;
  SoundManager_1.SoundManager.playSFX("glassSmash");
  for (var t = 0.25 * this.width, e = 0; e < t; e++) {
    var i = this.xPos - this.halfWidth + Math.random() * this.width,
      n = this.yPos - this.halfHeight + Math.random() * this.height;
    this.main.particleManager.createColorParticle(
      i,
      n,
      5 * Math.random() - 2.5,
      this.main.player.yVelocity * Math.random(),
      5903066,
      8,
    );
    this.alive = false;
  }
};

BreakableBlock.prototype.update = function () {
  if (this.alive !== false && this.main.player.checkAttackPolyCollision(this.totalPolygon) === true) {
    this.smash();
  }
};

BreakableBlock.prototype.resetLevel = function () {
  this.reset();
};

BreakableBlock.prototype.reset = function () {
  this.alive = true;
  this.sprite.visible = true;
  _super.prototype.reset.call(this);
};

BreakableBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
};

var _BreakableBlock = BreakableBlock;

function BreakableBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "glassBlock 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.type = "breakableBlock";
  return i;
}

exports.BreakableBlock = _BreakableBlock;
