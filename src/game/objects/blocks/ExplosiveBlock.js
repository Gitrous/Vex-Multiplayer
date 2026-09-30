// objects/blocks/ExplosiveBlock.js — recovered from webpack module #185 of the original vex7.min.js
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

exports.ExplosiveBlock = undefined;

var data_1 = require("../../data"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Block").Block;

__extends(ExplosiveBlock, _super);

ExplosiveBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, t.width, t.height);
  this.used = false;
  this.updateGraphicPosition();
  this.sprite.setScale(this.width / 100, this.height / 100);
  this.sprite.visible = true;
};

ExplosiveBlock.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

ExplosiveBlock.prototype.update = function () {
  if (!(this.alive === false || (this.xPos === this.prevX && this.yPos === this.prevY))) {
    this.updatePosition();
  }
};

ExplosiveBlock.prototype.explode = function () {
  this.used = true;
  this.alive = false;
  this.sprite.visible = false;
  this.main.effectsOverlay.explode();
  SoundManager_1.SoundManager.playSFX("explosion");
};

ExplosiveBlock.prototype.resetLevel = function () {
  this.used = false;
  this.alive = true;
  this.sprite.visible = true;
};

ExplosiveBlock.prototype.reset = function () {};

ExplosiveBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _ExplosiveBlock = ExplosiveBlock;

function ExplosiveBlock(t, e) {
  e = _super.call(this, t, e) || this;
  e.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "explosiveBlock 10000");
  e.layer.add(e.sprite);
  e.sprite.visible = false;
  e.used = false;
  e.type = "explosive";
  return e;
}

exports.ExplosiveBlock = _ExplosiveBlock;
