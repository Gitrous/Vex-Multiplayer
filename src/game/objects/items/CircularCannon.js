// objects/items/CircularCannon.js — recovered from webpack module #218 of the original vex7.min.js
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

exports.CircularCannon = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = require("./Item").Item;

__extends(CircularCannon, _super);

CircularCannon.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.container.x = this.xPos;
  this.container.y = this.yPos;
  this.alive = true;
  this.rad = 0;
  this.cannonSpeed = Tools_1.Tools.toRad(2);
  this.firing = false;
  this.power = 13;
};

CircularCannon.prototype.update = function () {
  var t = this.main.player;
  t.checkCollideWithCannon(this);
  if (this.firing === true) {
    this.tubeSprite.scaleX -= 0.075 * (this.tubeSprite.scaleX - 0.75);
    this.tubeSprite.scaleY -= 0.075 * (this.tubeSprite.scaleY - 1.35);
    if (this.tubeSprite.scaleX < 0.9) {
      this.main.player.cannonFire(this.xPos, this.yPos, Math.cos(this.rad), Math.sin(this.rad), this.power, 80);
      this.firing = false;
    }
  } else {
    this.tubeSprite.scaleX -= 0.15 * (this.tubeSprite.scaleX - 1);
    this.tubeSprite.scaleY = this.tubeSprite.scaleX;
    if (t.currentCannon !== this) {
      this.rad = Math.atan2(t.yPos - this.yPos, t.xPos - this.xPos);
    } else {
      this.rad = (this.rad + this.cannonSpeed) % Tools_1.Tools.PI2;
    }
    this.tubeSprite.rotation = this.rad;
  }
};

CircularCannon.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.firing = false;
};

CircularCannon.prototype.resetLevel = function () {
  this.reset();
};

CircularCannon.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.tubeSprite.destroy();
  this.tubeSprite = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _CircularCannon = CircularCannon;

function CircularCannon(t, e) {
  var i = _super.call(this, t) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "cannonBase 10000");
  i.container.add(i.sprite);
  i.tubeSprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "cannonTube 10000");
  i.container.add(i.tubeSprite);
  i.tubeSprite.setOrigin(3 / 37, 0.5);
  return i;
}

exports.CircularCannon = _CircularCannon;
