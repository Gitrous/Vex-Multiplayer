// objects/blocks/SolarBlock.js — recovered from webpack module #195 of the original vex7.min.js
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

exports.SolarBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data");

_super = Block_1.Block;

__extends(SolarBlock, _super);

SolarBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
};

SolarBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

SolarBlock.prototype.update = function () {
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

SolarBlock.prototype.goDark = function () {
  this.alive = false;
  this.sprite.visible = false;
};

SolarBlock.prototype.goLight = function () {
  this.alive = true;
  this.sprite.visible = true;
};

SolarBlock.prototype.reset = function () {};

SolarBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _SolarBlock = SolarBlock;

function SolarBlock(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "solarBlock 10000");
  e.add(i.sprite);
  return i;
}

exports.SolarBlock = _SolarBlock;
