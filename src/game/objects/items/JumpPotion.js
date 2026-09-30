// objects/items/JumpPotion.js — recovered from webpack module #229 of the original vex7.min.js
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

exports.JumpPotion = undefined;

var data_1 = require("../../data");

_super = require("./Item").Item;

__extends(JumpPotion, _super);

JumpPotion.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.visible = true;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.alive = true;
};

JumpPotion.prototype.update = function () {
  if (this.alive === true) {
    if (SAT.testPolygonPolygon(this.main.player.bodyPolygon, this.hitBoxPolygon) === true) {
      this.alive = false;
      this.sprite.visible = false;
      this.counter = 0;
      this.main.player.collideWithJumpPotion();
    }
  } else if (this.sprite.visible === false && ((this.counter += 1), this.counter >= 180)) {
    this.resetLevel();
  }
};

JumpPotion.prototype.resetLevel = function () {
  this.alive = true;
  this.sprite.visible = true;
};

JumpPotion.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

var _JumpPotion = JumpPotion;

function JumpPotion(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "jumpPotion 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 24, 30).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-12, -15));
  return i;
}

exports.JumpPotion = _JumpPotion;
