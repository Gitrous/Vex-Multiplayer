// jd/JD9SliceContainer.js — recovered from webpack module #105 of the original vex7.min.js
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

exports.JD9SliceContainer = undefined;

_super = require("./JD9SliceBase").JD9SliceBase;

__extends(JD9SliceContainer, _super);

JD9SliceContainer.prototype.setInteractive = function () {
  this.view.setInteractive(
    new Phaser.Geom.Rectangle(-this.originOffX, -this.originOffY, this.width, this.height),
    Phaser.Geom.Rectangle.Contains,
  );
};

JD9SliceContainer.prototype.drawFrame = function (t, e, i, n, s, r) {
  var o;
  if (this.view.getAt(this.imgID)) {
    if ((o = this.view.getAt(this.imgID)).texture.key !== t.tKey) {
      o.setTexture(t.tKey);
    }
    o.setFrame(e.name);
  } else {
    (o = new Phaser.GameObjects.Image(this.scene, 0, 0, t.tKey, e.name)).setOrigin(0);
    this.view.add(o);
  }
  o.setScale(s / e.width, r / e.height);
  o.x = t.x + i - this.originOffX;
  o.y = t.y + n - this.originOffY;
  this.tintFragments(o, e.name);
  this.imgID += 1;
};

JD9SliceContainer.prototype.clear = function () {
  _super.prototype.clear.call(this);
  this.view.removeAll();
};

JD9SliceContainer.prototype.drawFrames = function (t) {
  this.imgID = 9 * t;
  _super.prototype.drawFrames.call(this, t);
};

JD9SliceContainer.prototype.addGameObject = function (t) {
  this.view.add(t);
};

JD9SliceContainer.prototype.destroyInternal = function () {
  _super.prototype.destroyInternal.call(this);
  this.view = null;
};

var _JD9SliceContainer = JD9SliceContainer;

function JD9SliceContainer(t, e, i, n, s, r, o) {
  n = _super.call(this, t, n, s, (r = r === undefined ? 0 : r), (o = o === undefined ? 0 : o)) || this;
  n.addView(new Phaser.GameObjects.Container(t, e, i));
  n.originOffX = n.width * n.originX;
  n.originOffY = n.height * n.originY;
  return n;
}

exports.JD9SliceContainer = _JD9SliceContainer;
