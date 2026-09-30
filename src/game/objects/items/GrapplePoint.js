// objects/items/GrapplePoint.js — recovered from webpack module #232 of the original vex7.min.js
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

exports.GrapplePoint = undefined;

var data_1 = require("../../data");

_super = require("./Item").Item;

__extends(GrapplePoint, _super);

GrapplePoint.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.currID = t.currID;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.alive = false;
};

GrapplePoint.prototype.onContact = function (t, e) {
  this.alive = t;
  this.sprite.setFrame("grappleHook 1000" + e);
  this.sprite.rotation = 0;
};

GrapplePoint.prototype.update = function () {
  if (this.alive === true) {
    this.sprite.rotation += 0.1;
  }
};

GrapplePoint.prototype.reset = function () {};

GrapplePoint.prototype.resetLevel = function () {
  this.reset();
  this.alive = false;
};

GrapplePoint.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _GrapplePoint = GrapplePoint;

function GrapplePoint(t, e, i) {
  var n = _super.call(this, t) || this;
  n.isB = i;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "grappleHook 10000");
  e.add(n.sprite);
  return n;
}

exports.GrapplePoint = _GrapplePoint;
