// objects/blocks/BlockedWall.js — recovered from webpack module #154 of the original vex7.min.js
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

exports.BlockedWall = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Block_1.Block;

__extends(BlockedWall, _super);

BlockedWall.prototype.spawn = function (t) {
  var e = Tools_1.Tools.toRad(t.rotation);
  if (Math.abs(e) === Tools_1.Tools.PI05) {
    this.init(t.x, t.y, 444, 65);
  } else {
    this.init(t.x, t.y, 65, 444);
  }
  this.sprite.rotation = e;
  this.sprite.visible = true;
  this.updateGraphicPosition();
};

BlockedWall.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

BlockedWall.prototype.update = function () {
  if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
    this.updatePosition();
  }
};

BlockedWall.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

BlockedWall.prototype.reset = function () {};

var _BlockedWall = BlockedWall;

function BlockedWall(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "blockedWall 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.hangable = false;
  i.scalable = false;
  i.type = "wall";
  return i;
}

exports.BlockedWall = _BlockedWall;
