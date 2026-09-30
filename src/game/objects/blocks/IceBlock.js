// objects/blocks/IceBlock.js — recovered from webpack module #189 of the original vex7.min.js
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

exports.IceBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Block_1.Block;

__extends(IceBlock, _super);

IceBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.startXScale = this.width / 100;
  this.startYScale = this.height / 100;
  this.sprite.setScale(this.startXScale, this.startYScale);
  this.sprite.visible = true;
  this.depletionRate = 5e-4;
  this.meltScale = 1;
  if (BalanceData_1.BalanceData.blend === true) {
    this.setCrop();
  }
};

IceBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

IceBlock.prototype.update = function () {
  if (
    this.alive === true &&
    this.main.inCameraView(this.leftEdge, this.rightEdge, this.topEdge, this.bottomEdge) === true
  ) {
    this.meltScale -= this.depletionRate;
    if (this.meltScale <= 0) {
      this.melted = true;
      this.alive = false;
      this.sprite.visible = false;
    } else {
      if (BalanceData_1.BalanceData.blend === true) {
        this.setCrop();
      } else {
        this.sprite.scaleY = (this.height / 100) * this.meltScale;
        this.sprite.y = this.yPos - this.halfHeight * (1 - this.meltScale);
      }
      this.totalPolygon = this.getPolygon(this.width, this.height * this.meltScale);
      this.totalPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
      this.leftPolygon = this.getPolygon(Block_1.Block.TOP_BOUND_WIDTH, this.height * this.meltScale);
      this.leftPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
      this.rightPolygon = this.getPolygon(Block_1.Block.TOP_BOUND_WIDTH, this.height * this.meltScale);
      this.rightPolygon.setOffset(new SAT.Vector(this.halfWidth - Block_1.Block.TOP_BOUND_WIDTH, -this.halfHeight));
      this.bottomEdge = this.topEdge + this.height * this.meltScale;
      this.bottomPolygon.setOffset(new SAT.Vector(-this.halfWidth, this.bottomEdge));
    }
  }
};

IceBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

IceBlock.prototype.resetLevel = function () {
  this.reset();
};

IceBlock.prototype.reset = function () {
  this.meltScale = 1;
  if (BalanceData_1.BalanceData.blend === true) {
    this.setCrop();
  }
  this.sprite.setScale(this.startXScale, this.startYScale);
  this.sprite.visible = true;
  this.alive = true;
  this.melted = false;
  _super.prototype.reset.call(this);
};

IceBlock.prototype.setCrop = function () {
  this.sprite.setCrop(0, 0, this.sprite.width, this.sprite.height * this.meltScale);
};

var _IceBlock = IceBlock;

function IceBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "iceBlock 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.type = "ice";
  return i;
}

exports.IceBlock = _IceBlock;
