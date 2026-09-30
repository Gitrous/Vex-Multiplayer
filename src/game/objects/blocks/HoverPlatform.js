// objects/blocks/HoverPlatform.js — recovered from webpack module #203 of the original vex7.min.js
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

exports.HoverPlatform = undefined;

var BlockBehavior_1 = require("./BlockBehavior"),
  data_1 = require("../../data");

_super = BlockBehavior_1.BlockBehavior;

__extends(HoverPlatform, _super);

HoverPlatform.prototype.landOn = function (t) {
  this.landed = t;
  if (this.landed) {
    if (this.isActive === false) {
      this.activate();
    }
  } else if (this.isActive === true) {
    this.deactivate();
  }
};

HoverPlatform.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.deactivate();
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 60, this.height / 10);
  this.sprite.visible = true;
};

HoverPlatform.prototype.applyForce = function (t, e) {
  if (this.landed) {
    _super.prototype.applyForce.call(this, t, e);
  }
};

HoverPlatform.prototype.update = function () {
  var t = this.xPos;
  _super.prototype.update.call(this);
  if (this.landed) {
    t = this.main.player.xPos - t - this.landed.x;
    this.landed.x += t;
    this.main.player.xPos = this.xPos + this.landed.x;
    this.main.player.yPos = this.yPos - 4;
    this.main.player.updatePositions();
  }
};

HoverPlatform.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

HoverPlatform.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

HoverPlatform.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.deactivate();
  this.updatePosition();
};

HoverPlatform.prototype.resetLevel = function () {
  this.reset();
};

HoverPlatform.prototype.activate = function () {
  this.isActive = true;
  this.sprite.setFrame("hoverPlatform 10001");
};

HoverPlatform.prototype.deactivate = function () {
  this.isActive = false;
  this.sprite.setFrame("hoverPlatform 10000");
};

var _HoverPlatform = HoverPlatform;

function HoverPlatform(t, e) {
  e = _super.call(this, t, e) || this;
  e.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "hoverPlatform 10000");
  e.layer.add(e.sprite);
  e.sprite.visible = false;
  e.hangable = false;
  e.scalable = false;
  e.type = "hoverPlatform";
  return e;
}

exports.HoverPlatform = _HoverPlatform;
