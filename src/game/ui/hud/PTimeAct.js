// ui/hud/PTimeAct.js — recovered from webpack module #138 of the original vex7.min.js
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

exports.PTimeAct = undefined;

var data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  PanelManager_1 = require("../panels/PanelManager");

_super = Phaser.GameObjects.Container;

__extends(PTimeAct, _super);

PTimeAct.prototype.getTime = function () {
  return this.txtTime.text;
};

PTimeAct.prototype.updateTime = function (t) {
  this.txtTime.text = t;
};

PTimeAct.prototype.setCoins = function (t) {
  this.txtCoins.text = "" + t;
};

PTimeAct.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.x = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X;
  this.y = -data_1.Constants.UI_SHIFT_Y;
};

PTimeAct.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.txtTime = null;
  this.txtCoins = null;
};

var _PTimeAct = PTimeAct;

function PTimeAct(t) {
  var e = _super.call(this, t) || this,
    i = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "top_bar 10000");
  i.setOrigin(1, 0.5);
  e.add(i);
  var n = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "top_corner 10000");
  n.setOrigin(1, 0.5);
  e.add(n);
  e.txtCoins = new jd_1.JDBmpdText(e.scene, -25, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  e.add(e.txtCoins);
  var s = new Phaser.GameObjects.Image(e.scene, e.txtCoins.x - 70, 31, data_1.Atlases.ui, "coin 10000");
  s.scale = 0.9;
  e.add(s);
  s = new Phaser.GameObjects.Image(e.scene, s.x - 40, 31, data_1.Atlases.ui, "top_separator 10000");
  e.add(s);
  e.txtTime = new jd_1.JDBmpdText(e.scene, s.x - 100, 31, data_1.Fonts.Main, "00:00:00", 40);
  e.add(e.txtTime);
  i.displayWidth = -e.txtTime.x + e.txtTime.width - 70;
  n.x = i.x - i.displayWidth + 2;
  n = i = s = null;
  var s = new buttons_1.ButtonContainerFrame(
    e.scene,
    -65,
    140,
    data_1.Atlases.ui,
    "buttonBlue 10000",
    "buttonBlue 10001",
  );
  s.addIcon(data_1.Atlases.ui, "iconPause 10000");
  s.onUp = function () {
    return t.panelManager.show(PanelManager_1.PanelList.PanelPause);
  };
  e.add(s.getView());
  s = null;
  return e;
}

exports.PTimeAct = _PTimeAct;
