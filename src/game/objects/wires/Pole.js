// objects/wires/Pole.js — recovered from webpack module #237 of the original vex7.min.js
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

exports.Pole = undefined;

var Entity_1 = require("../../entities/Entity"),
  data_1 = require("../../data");

_super = Entity_1.Entity;

__extends(Pole, _super);

Pole.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.visible = true;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
};

Pole.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

Pole.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.poles, this);
  _super.prototype.destroySelf.call(this);
};

var _Pole = Pole;

function Pole(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "pole 10000");
  e.add(i.sprite);
  i.sprite.visible = false;
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 10, 10).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-5, -5));
  return i;
}

exports.Pole = _Pole;
