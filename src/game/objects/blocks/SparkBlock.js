// objects/blocks/SparkBlock.js — recovered from webpack module #196 of the original vex7.min.js
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

exports.SparkBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  obstacles_1 = require("../obstacles");

_super = Block_1.Block;

__extends(SparkBlock, _super);

SparkBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(t.width / 100, t.height / 100);
  this.spark.spawn();
};

SparkBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

SparkBlock.prototype.update = function () {
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

SparkBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.spark = null;
  _super.prototype.destroy.call(this);
};

var _SparkBlock = SparkBlock;

function SparkBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "sparkBlock 10000");
  e.add(i.sprite);
  i.spark = new obstacles_1.Spark(t, e, i);
  i.main.obstacles.push(i.spark);
  return i;
}

exports.SparkBlock = _SparkBlock;
