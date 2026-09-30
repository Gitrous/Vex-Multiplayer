// ui/hud/PLevel.js — recovered from webpack module #141 of the original vex7.min.js
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

exports.PLevel = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd");

_super = Phaser.GameObjects.Container;

__extends(PLevel, _super);

PLevel.prototype.setDeath = function (t) {
  this.txtTotalDeath.text = "" + t;
  this.bgBar.displayWidth = this.txtTotalDeath.x + this.txtTotalDeath.width + 10;
  this.bgCorner.x = this.bgBar.x + this.bgBar.displayWidth - 3;
};

PLevel.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.x = -data_1.Constants.UI_SHIFT_X;
  this.y = -data_1.Constants.UI_SHIFT_Y;
};

PLevel.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.txtLevel = null;
  this.txtTotalDeath = null;
  this.bgBar = null;
  this.bgCorner = null;
};

var _PLevel = PLevel;

function PLevel(t, e) {
  t = _super.call(this, t) || this;
  t.bgBar = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_bar 10000");
  t.bgBar.setOrigin(0, 0.5);
  t.add(t.bgBar);
  t.bgCorner = new Phaser.GameObjects.Image(t.scene, 0, 30.5, data_1.Atlases.ui, "top_corner 10000");
  t.bgCorner.setOrigin(0, 0.5);
  t.bgCorner.flipX = true;
  t.add(t.bgCorner);
  t.txtLevel = new jd_1.JDBmpdText(t.scene, 30, 31, data_1.Fonts.Main, e, 40);
  t.txtLevel.setOrigin(0, 0.5);
  t.add(t.txtLevel);
  e = new Phaser.GameObjects.Image(
    t.scene,
    t.txtLevel.x + t.txtLevel.width + 30,
    31,
    data_1.Atlases.ui,
    "top_separator 10000",
  );
  t.add(e);
  e = new Phaser.GameObjects.Image(t.scene, e.x + 50, 31, data_1.Atlases.ui, "iconSkull 10000");
  t.add(e);
  t.txtTotalDeath = new jd_1.JDBmpdText(t.scene, e.x + 50, 31, data_1.Fonts.Main, "", 40);
  t.txtTotalDeath.setOrigin(0, 0.5);
  t.add(t.txtTotalDeath);
  return t;
}

exports.PLevel = _PLevel;
