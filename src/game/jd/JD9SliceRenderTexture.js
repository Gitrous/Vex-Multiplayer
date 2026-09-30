// jd/JD9SliceRenderTexture.js — recovered from webpack module #106 of the original vex7.min.js
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

exports.JD9SliceRenderTexture = undefined;

_super = require("./JD9SliceBase").JD9SliceBase;

__extends(JD9SliceRenderTexture, _super);

JD9SliceRenderTexture.prototype.setInteractive = function () {
  this.view.setInteractive();
};

JD9SliceRenderTexture.prototype.drawFrame = function (t, e, i, n, s, r) {
  if (this.frameImage) {
    if (this.frameImage.texture.key !== t.tKey) {
      this.frameImage.setTexture(t.tKey);
    }
    this.frameImage.setFrame(e.name);
  } else {
    this.frameImage = new Phaser.GameObjects.Image(this.scene, 0, 0, t.tKey, e.name);
    this.frameImage.setOrigin(0);
  }
  this.frameImage.setScale(s / e.width, r / e.height);
  this.tintFragments(this.frameImage, e.name);
  this.drawGameObject(this.frameImage, t.x + i, t.y + n);
};

JD9SliceRenderTexture.prototype.drawGameObject = function (t, e, i) {
  this.view.draw(t, (e = e === undefined ? 0 : e), (i = i === undefined ? 0 : i));
};

JD9SliceRenderTexture.prototype.saveAsTexture = function (t) {
  this.view.saveTexture(t);
};

JD9SliceRenderTexture.prototype.clear = function () {
  _super.prototype.clear.call(this);
  this.view.clear();
};

JD9SliceRenderTexture.prototype.resize = function (t, e) {
  this.width = t;
  this.height = e;
  this.view.resize(t, e);
};

JD9SliceRenderTexture.prototype.draw = function () {
  this.view.clear();
  _super.prototype.draw.call(this);
  this.frameImage.destroy();
  this.frameImage = null;
};

JD9SliceRenderTexture.prototype.destroyInternal = function () {
  _super.prototype.destroyInternal.call(this);
  this.frameImage = null;
  this.view = null;
};

var _JD9SliceRenderTexture = JD9SliceRenderTexture;

function JD9SliceRenderTexture(t, e, i, n, s, r, o) {
  var a = _super.call(this, t, n, s, (r = r === undefined ? 0 : r), (o = o === undefined ? 0 : o)) || this;
  a.addView(new Phaser.GameObjects.RenderTexture(t, e, i, n, s));
  a.view.setOrigin(r, o);
  return a;
}

exports.JD9SliceRenderTexture = _JD9SliceRenderTexture;
