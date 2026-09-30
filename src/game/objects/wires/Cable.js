// objects/wires/Cable.js — recovered from webpack module #236 of the original vex7.min.js
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

exports.Cable = undefined;

var Entity_1 = require("../../entities/Entity"),
  data_1 = require("../../data");

_super = Entity_1.Entity;

__extends(Cable, _super);

Cable.prototype.spawn = function (t, e, i) {
  this.xPos = t;
  this.yPos = e;
  this.alive = true;
  var n = 1,
    s = 0;
  if (i < 0) {
    n = -1;
    s = 1;
    i = Math.abs(i);
  }
  var r,
    i = i / this.imgHeight,
    o = Math.ceil(i),
    a = 1 - (o - i) / o,
    h = o;
  if (h < this.cables.length) {
    h = this.cables.length;
  }
  for (var l, u = 0; u < h; u++) {
    if (u < o) {
      if (u < this.cables.length) {
        r = this.cables[u];
      } else {
        r = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "cable 10000");
        this.layer.add(r);
        r.setOrigin(0.5, s);
        this.cables.push(r);
      }
      l = e + this.imgHeight * a * u * n;
      this.setCableParam(r, t, l, a);
    } else {
      this.cables[u].visible = false;
    }
  }
};

Cable.prototype.setCableParam = function (t, e, i, n) {
  t.x = e;
  t.y = i;
  t.scaleY = n;
  t.visible = true;
};

Cable.prototype.destroy = function () {
  for (var t = 0; t < this.cables.length; t++) this.cables[t].destroy();
  this.cables = null;
  this.layer = null;
  _super.prototype.destroy.call(this);
};

var _Cable = Cable;

function Cable(t, e) {
  t = _super.call(this, t) || this;
  t.imgHeight = 99;
  t.layer = e;
  t.cables = new Array();
  return t;
}

exports.Cable = _Cable;
