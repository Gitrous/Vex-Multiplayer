// objects/blocks/Block.js — recovered from webpack module #5 of the original vex7.min.js
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

exports.Block = undefined;

var Entity_1 = require("../../entities/Entity"),
  Helpers_1 = require("../../utils/Helpers");

_super = Entity_1.Entity;

__extends(Block, _super);

Block.prototype.update = function () {};

Block.prototype.landOn = function (t) {
  this.landed = t;
};

Block.prototype.applyForce = function (t, e) {};

Block.prototype.levelStart = function () {};

Block.prototype.destroy = function () {
  this.topPolygon = null;
  this.bottomPolygon = null;
  this.leftPolygon = null;
  this.rightPolygon = null;
  this.lhPolygon = null;
  this.rhPolygon = null;
  this.totalPolygon = null;
  this.layer = null;
  this.landed = null;
  _super.prototype.destroy.call(this);
};

Block.prototype.resetLevel = function () {
  this.landed = null;
};

Block.prototype.reset = function () {
  this.landed = null;
};

Block.prototype.init = function (t, e, i, n) {
  this.xPos = t;
  this.yPos = e;
  this.prevX = t;
  this.prevY = e;
  this.startX = t;
  this.startY = e;
  this.width = i;
  this.height = n;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.landed = null;
  this.alive = true;
  this.halfWidth = 0.5 * this.width;
  this.halfHeight = 0.5 * this.height;
  this.initEdges();
  this.initBounds();
  this.initOffsets();
};

Block.prototype.initEdges = function () {
  this.leftEdge = this.xPos - this.halfWidth;
  this.rightEdge = this.xPos + this.halfWidth;
  this.topEdge = this.yPos - this.halfHeight;
  this.bottomEdge = this.yPos + this.halfHeight;
};

Block.prototype.initBounds = function () {
  this.lhPolygon = this.getPolygon(Block.TOP_BOUND_WIDTH, Block.TOP_BOUND_HEIGHT);
  this.rhPolygon = this.getPolygon(Block.TOP_BOUND_WIDTH, Block.TOP_BOUND_HEIGHT);
  this.totalPolygon = this.getPolygon(this.width, this.height);
  this.leftPolygon = this.getPolygon(Block.TOP_BOUND_WIDTH, this.height);
  this.rightPolygon = this.getPolygon(Block.TOP_BOUND_WIDTH, this.height);
  this.topPolygon = this.getPolygon(this.width, Block.TOP_BOUND_HEIGHT);
  this.bottomPolygon = this.getPolygon(this.width, Block.TOP_BOUND_HEIGHT);
};

Block.prototype.getPolygon = function (t, e) {
  return Helpers_1.Helpers.getPolygon(this.xPos, this.yPos, t, e);
};

Block.prototype.initOffsets = function () {
  this.lhPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
  this.rhPolygon.setOffset(new SAT.Vector(this.halfWidth - Block.TOP_BOUND_WIDTH, -this.halfHeight));
  this.totalPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
  this.leftPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
  this.rightPolygon.setOffset(new SAT.Vector(this.halfWidth - Block.TOP_BOUND_WIDTH, -this.halfHeight));
  this.topPolygon.setOffset(new SAT.Vector(-this.halfWidth, -this.halfHeight));
  this.bottomPolygon.setOffset(new SAT.Vector(-this.halfWidth, this.halfHeight - Block.TOP_BOUND_HEIGHT));
};

Block.prototype.updatePosition = function () {
  this.initEdges();
  this.totalPolygon.pos.x = this.xPos;
  this.totalPolygon.pos.y = this.yPos;
  this.topPolygon.pos.x = this.xPos;
  this.topPolygon.pos.y = this.yPos;
  this.lhPolygon.pos.x = this.xPos;
  this.lhPolygon.pos.y = this.yPos;
  this.rhPolygon.pos.x = this.xPos;
  this.rhPolygon.pos.y = this.yPos;
  this.leftPolygon.pos.x = this.xPos;
  this.leftPolygon.pos.y = this.yPos;
  this.rightPolygon.pos.x = this.xPos;
  this.rightPolygon.pos.y = this.yPos;
  this.bottomPolygon.pos.x = this.xPos;
  this.bottomPolygon.pos.y = this.yPos;
  this.updateGraphicPosition();
};

Block.prototype.updateGraphicPosition = function () {};

Block.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.blocks, this);
  _super.prototype.destroySelf.call(this);
};

Block.prototype.drawTestBounds = function () {
  this.clearDebugGraphics();
  this.drawDebugPolyLine(this.totalPolygon, 16711680, 1);
  this.drawDebugPoly(this.leftPolygon, 16711680);
  this.drawDebugPoly(this.leftPolygon, 16711680);
  this.drawDebugPoly(this.rightPolygon, 65280);
  this.drawDebugPoly(this.topPolygon, 255);
  this.drawDebugPoly(this.bottomPolygon, 16711935);
};

Block.TOP_BOUND_WIDTH = 10;

Block.TOP_BOUND_HEIGHT = 10;

var _Block = Block;

function Block(t, e) {
  t = _super.call(this, t) || this;
  t.scalable = true;
  t.hangable = true;
  t.layer = e;
  return t;
}

exports.Block = _Block;
