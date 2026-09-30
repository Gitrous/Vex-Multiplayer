// objects/blocks/VexTNT.js — recovered from webpack module #201 of the original vex7.min.js
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

exports.VexTNT = undefined;

var data_1 = require("../../data"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Block").Block;

__extends(VexTNT, _super);

VexTNT.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.used = false;
  this.updateGraphicPosition();
  this.container.setScale(this.width / 100, this.height / 100);
  this.container.visible = true;
  this.explodingOverlay.visible = true;
  this.explodingOverlay.alpha = 0;
};

VexTNT.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

VexTNT.prototype.update = function () {
  if (this.alive !== false) {
    if (
      this.exploding === true &&
      ((this.container.scaleX -= 0.1 * (this.container.scaleX - 1.5)),
      (this.container.scaleY = this.container.scaleX),
      (this.explodingOverlay.alpha += 0.05),
      this.explodingOverlay.alpha >= 1)
    ) {
      this.exploding = false;
      this.alive = false;
      this.used = true;
      SoundManager_1.SoundManager.playSFX("explosion");
      this.main.effectsOverlay.explode();
    }
    if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
      this.updatePosition();
    }
  }
};

VexTNT.prototype.resetLevel = function () {
  this.used = false;
  this.alive = true;
  this.exploding = false;
  this.explodingOverlay.alpha = 0;
  this.container.setScale(1, 1);
  this.container.visible = true;
};

VexTNT.prototype.reset = function () {};

VexTNT.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.explodingOverlay.destroy();
  this.explodingOverlay = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _VexTNT = VexTNT;

function VexTNT(t, e) {
  var i = _super.call(this, t, e) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.container.visible = false;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "bigTNT 10000");
  i.container.add(i.sprite);
  i.explodingOverlay = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "whiteBlock 10000");
  i.container.add(i.explodingOverlay);
  i.used = false;
  i.type = "explosive";
  return i;
}

exports.VexTNT = _VexTNT;
