// objects/items/Coin.js — recovered from webpack module #72 of the original vex7.min.js
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

exports.Coin = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  SoundManager_1 = require("../../system/SoundManager");

_super = require("./Item").Item;

__extends(Coin, _super);

Coin.prototype.init = function (t, e, i) {
  this.sprite = new Phaser.GameObjects.Image(
    t,
    0,
    0,
    data_1.Atlases.gameplay,
    t.isTower() === false ? "coinGame 10000" : "coinTower 10000",
  );
  e.add(this.sprite);
  this.sprite.visible = false;
};

Coin.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.visible = true;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.alive = true;
};

Coin.prototype.update = function () {
  if (
    this.alive === true &&
    Tools_1.Tools.distance(
      this.xPos,
      this.yPos,
      this.main.player.xPos,
      this.main.player.yPos - this.main.player.halfHeight,
    ) <= 40
  ) {
    this.collect();
    for (var t = 0; t < 15; t++)
      this.main.particleManager.createColorParticle(
        this.xPos,
        this.yPos,
        10 * Math.random() - 5,
        -10 * Math.random(),
        16763904,
      );
  }
};

Coin.prototype.collect = function () {
  this.main.collectCoin();
  SoundManager_1.SoundManager.playSFX("starPickup");
  this.die();
};

Coin.prototype.die = function () {
  this.alive = false;
  this.sprite.visible = false;
};

Coin.prototype.resetLevel = function () {
  this.alive = true;
  this.sprite.visible = true;
};

Coin.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _Coin = Coin;

function Coin(t, e, i) {
  var n = _super.call(this, t) || this;
  n.init(t, e, i);
  return n;
}

exports.Coin = _Coin;
