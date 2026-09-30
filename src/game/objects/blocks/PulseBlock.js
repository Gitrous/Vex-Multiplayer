// objects/blocks/PulseBlock.js — recovered from webpack module #202 of the original vex7.min.js
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

exports.PulseBlock = undefined;

var data_1 = require("../../data"),
  system_1 = require("../../system"),
  Block_1 = require("./Block"),
  BlockBehavior_1 = require("./BlockBehavior");

_super = Block_1.Block;

__extends(PulseBlock, _super);

PulseBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, 100, 100);
  this.horizontal.pos.x = this.xPos;
  this.horizontal.pos.y = this.yPos;
  this.vertical.pos.x = this.xPos;
  this.vertical.pos.y = this.yPos;
  this.pulseTime = t.time;
  this.currID = t.currID;
  this.reset();
  this.updateGraphicPosition();
  this.sprite.visible = true;
};

PulseBlock.prototype.enablePulsing = function (t, e) {
  if (e === undefined) {
    e = this.pulseTime;
  }
  this.canPulse = t;
  this.pulseCount = e;
  if (this.canPulse === true) {
    this.sprite.setFrame("pulseBlock 10001");
  } else {
    this.sprite.setFrame("pulseBlock 10000");
  }
};

PulseBlock.prototype.update = function () {
  if (this.canPulse === true && ((this.pulseCount += 1), this.pulseCount >= this.pulseTime)) {
    for (var t = (this.pulseCount = 0), e = this.main.blocks; t < e.length; t++) {
      var i = e[t];
      if (i instanceof BlockBehavior_1.BlockBehavior) {
        this.checkCollision(i, system_1.BalanceData.config_PulseBlockPushOther);
      }
    }
    this.checkCollision(this.main.player, system_1.BalanceData.config_PulseBlockPushPlayer);
  }
};

PulseBlock.prototype.checkCollision = function (t, e) {
  if (SAT.testPolygonPolygon(this.horizontal, t.totalPolygon) === true) {
    t.applyForce(this.xPos < t.xPos ? e : -e, 0);
  } else if (SAT.testPolygonPolygon(this.vertical, t.totalPolygon) === true) {
    t.applyForce(0, this.yPos < t.yPos ? e : -e);
  }
};

PulseBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

PulseBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

PulseBlock.prototype.reset = function () {
  _super.prototype.reset.call(this);
  if (this.currID === -1) {
    this.enablePulsing(true, 0);
  } else {
    this.enablePulsing(false);
  }
  this.pulseCount = 0;
};

PulseBlock.prototype.resetLevel = function () {
  this.reset();
};

var _PulseBlock = PulseBlock;

function PulseBlock(t, e) {
  e = _super.call(this, t, e) || this;
  e.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "pulseBlock 10000");
  e.layer.add(e.sprite);
  e.sprite.visible = false;
  t = system_1.BalanceData.config_PulseBlockDistanceEmit;
  e.horizontal = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(-t, -50),
    new SAT.Vector(t, -50),
    new SAT.Vector(t, 50),
    new SAT.Vector(-t, 50),
  ]);
  e.vertical = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(-50, -t),
    new SAT.Vector(50, -t),
    new SAT.Vector(50, t),
    new SAT.Vector(-50, t),
  ]);
  return e;
}

exports.PulseBlock = _PulseBlock;
