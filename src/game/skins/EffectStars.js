// skins/EffectStars.js — recovered from webpack module #214 of the original vex7.min.js
"use strict";

var n,
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

exports.Star = exports.EffectStars = undefined;

var data_1 = require("../data"),
  Tools_1 = require("../utils/Tools");

function EffectStars(t) {
  this.stars = new Array(10);
  for (var e = 0; e < this.stars.length; e++) this.stars[e] = new l(t);
}

EffectStars.prototype.show = function (t, e) {
  for (var i = 0; i < this.stars.length; i++) this.stars[i].show(t, e, Tools_1.Tools.PI2 * Math.random());
};

EffectStars.prototype.update = function () {
  for (var t = 0, e = this.stars; t < e.length; t++) e[t].update();
};

EffectStars.prototype.destroy = function () {
  this.stars = null;
};

exports.EffectStars = EffectStars;

_super = Phaser.GameObjects.Image;

__extends(u, _super);

u.prototype.show = function (t, e, i) {
  this.visible = true;
  this.alpha = 1;
  var n = Math.cos(i),
    i = Math.sin(i);
  this.x = t + 40 * n;
  this.y = e + 40 * i;
  this.velX = 5 * n;
  this.velY = 5 * i;
  this.velR = 0.2 * Math.random() - 0.1;
  this.scale = 0.6 + 0.4 * Math.random();
};

u.prototype.update = function () {
  if (
    this.visible !== false &&
    ((this.x += this.velX),
    (this.y += this.velY),
    (this.rotation += this.velR),
    (this.alpha -= this.velA),
    this.alpha <= 0.3)
  ) {
    this.visible = false;
  }
};

var _super,
  l = u;

function u(t) {
  var e = _super.call(this, t.scene, 0, 0, data_1.Atlases.ui, "star 10000") || this;
  e.velA = 0.02;
  t.add(e);
  e.visible = false;
  return e;
}

exports.Star = l;
