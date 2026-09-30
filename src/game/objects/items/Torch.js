// objects/items/Torch.js — recovered from webpack module #222 of the original vex7.min.js
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

exports.Torch = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Key").Key;

__extends(Torch, _super);

Torch.prototype.init = function (t) {
  this.sprite = new jd_1.JDImageAnim(this.main, 0, 0, data_1.Atlases.gameplay, "torch ");
  t.add(this.sprite);
  this.lineGraphic = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  this.lineGraphic.setOrigin(0, 0.5);
  this.lineGraphic.tint = 65280;
  t.add(this.lineGraphic);
};

Torch.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.sprite.playFrames(0, 6, -1, 0.5);
};

Torch.prototype.update = function () {
  if (this.alive !== false) {
    this.sprite.update();
    _super.prototype.update.call(this);
  }
};

Torch.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.items, this);
  _super.prototype.destroySelf.call(this);
};

Torch.prototype.collideWithHero = function () {
  this.player.collideWithTorch(this);
  SoundManager_1.SoundManager.playSFX("torch");
};

var _Torch = Torch;

function Torch(t, e) {
  return _super.call(this, t, e) || this;
}

exports.Torch = _Torch;
