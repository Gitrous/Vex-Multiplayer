// objects/items/Kite.js — recovered from webpack module #223 of the original vex7.min.js
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

exports.Kite = undefined;

var data_1 = require("../../data");

_super = require("./Item").Item;

__extends(Kite, _super);

Kite.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.updatePositions();
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.alive = true;
  this.following = false;
};

Kite.prototype.update = function () {
  if (this.following !== false) {
    this.xPos = this.player.xPos + 8 * this.player.scaleX;
    this.yPos = this.player.yPos - 30;
    this.sprite.scaleX = this.player.scaleX;
    this.updatePositions();
  } else if (SAT.testPolygonPolygon(this.player.bodyPolygon, this.hitBoxPolygon) === true) {
    this.following = true;
    this.player.collideWithKite(this);
  }
};

Kite.prototype.reset = function () {
  if (this.sprite) {
    this.following = false;
    this.xPos = this.startX;
    this.yPos = this.startY;
    this.sprite.scaleX = 1;
    this.updatePositions();
  }
};

Kite.prototype.resetLevel = function () {
  this.reset();
  this.alive = true;
};

Kite.prototype.updatePositions = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

Kite.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  this.player = null;
  _super.prototype.destroy.call(this);
};

var _Kite = Kite;

function Kite(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "kite 10000");
  e.add(i.sprite);
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 76, 16).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-38, -8));
  i.player = i.main.player;
  return i;
}

exports.Kite = _Kite;
