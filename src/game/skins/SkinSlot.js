// skins/SkinSlot.js — recovered from webpack module #213 of the original vex7.min.js
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

exports.SkinSlot = undefined;

var data_1 = require("../data"),
  jd_1 = require("../jd"),
  Helpers_1 = require("../utils/Helpers");

_super = Phaser.GameObjects.Container;

__extends(SkinSlot, _super);

SkinSlot.prototype.addInteraction = function () {
  this.imgBg.setInteractive(new Phaser.Geom.Circle(68, 68, 68), Phaser.Geom.Circle.Contains);
  this.imgBg.input.cursor = "pointer";
  this.imgBg.on(Phaser.Input.Events.POINTER_DOWN, this.onDown, this);
};

SkinSlot.prototype.addImgCauntion = function () {
  if (!this.imgCaution) {
    this.imgCaution = new Phaser.GameObjects.Image(this.subscene.scene, 60, -55, data_1.Atlases.ui, "icon_alert 10000");
    this.imgCaution.scale = 0.8;
    this.add(this.imgCaution);
  }
};

SkinSlot.prototype.onDown = function () {
  this.subscene.select(this.id);
};

SkinSlot.prototype.open = function () {
  this.status = 1;
  this.imgBg.alpha = 1;
  this.imgSkin.visible = true;
  this.imgLock.visible = false;
  this.addImgCauntion();
  this.addInteraction();
};

SkinSlot.prototype.equiped = function () {
  if (this.imgCaution) {
    this.imgCaution.visible = false;
  }
};

SkinSlot.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.subscene = null;
  this.imgBg = null;
  this.imgCaution = null;
  this.imgSkin = null;
  this.imgLock = null;
};

var _SkinSlot = SkinSlot;

function SkinSlot(t, e, i, n, s, r) {
  var o = _super.call(this, t.scene, s, r) || this;
  o.subscene = t;
  o.id = e;
  o.status = n;
  o.imgBg = new Phaser.GameObjects.Image(t.scene, 0, 0, data_1.Atlases.ui, "box_round 10000");
  o.add(o.imgBg);
  o.imgSkin = new jd_1.JDSpineGameObject(t.scene, s, r, "player", "stand");
  o.imgSkin.scaleX = o.imgSkin.scaleY = 2.8;
  o.imgSkin.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(i));
  t.spineContainer.add(o.imgSkin.getView());
  o.imgSkin.y += o.imgSkin.getView().displayHeight / 3;
  if (n === 0) {
    o.imgLock = new Phaser.GameObjects.Image(t.scene, 0, 0, data_1.Atlases.ui, "iconLock 10000");
    o.imgBg.alpha = o.imgLock.alpha = 0.4;
    o.add(o.imgLock);
    o.imgSkin.visible = false;
  } else {
    o.addInteraction();
  }
  if (n === 1) {
    o.addImgCauntion();
  }
  return o;
}

exports.SkinSlot = _SkinSlot;
