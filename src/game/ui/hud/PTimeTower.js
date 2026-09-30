// ui/hud/PTimeTower.js — recovered from webpack module #140 of the original vex7.min.js
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

exports.PTimeTower = undefined;

var data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  CustomResize_1 = require("../../utils/CustomResize"),
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  PanelManager_1 = require("../panels/PanelManager");

_super = Phaser.GameObjects.Container;

__extends(PTimeTower, _super);

PTimeTower.prototype.addBtn = function () {
  var t = this,
    e = new buttons_1.ButtonContainerFrame(
      this.scene,
      -65,
      140,
      data_1.Atlases.ui,
      "buttonBlue 10000",
      "buttonBlue 10001",
    );
  e.addIcon(data_1.Atlases.ui, "iconPause 10000");
  e.onUp = function () {
    return t.scene.panelManager.show(PanelManager_1.PanelList.PanelPause);
  };
  this.add(e.getView());
};

PTimeTower.prototype.getTime = function () {
  return this.txtTime.text;
};

PTimeTower.prototype.updateTime = function (t) {
  this.txtTime.text = t;
  if (this.scene.currHeroFloor > this.currFlor) {
    this.currFlor = this.scene.currHeroFloor;
    this.txtFloor.text = "" + this.currFlor;
    this.txtFloorBig.text = this.txtFloor.text;
    system_1.BalanceData.towerFloor = this.scene.currHeroFloor;
    this.updateBg();
  }
};

PTimeTower.prototype.updateBg = function () {
  this.iconFloor.x = this.txtFloor.x - 15 * this.txtFloor.text.length - 50;
  this.separator.x = this.iconFloor.x - 40;
  this.txtTime.x = this.separator.x - 100;
  this.bg.displayWidth = -this.txtTime.x + this.txtTime.width - 70;
  this.bgCorner.x = this.bg.x - this.bg.displayWidth + 2;
};

PTimeTower.prototype.setCoins = function (t) {
  this.txtCoins.text = "" + t;
};

PTimeTower.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.x = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X;
  this.y = -data_1.Constants.UI_SHIFT_Y;
  this.txtFloorBig.x = CustomResize_1.CustomResize.CanvasHalfW;
};

PTimeTower.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.txtFloorBig.destroy();
  this.txtFloorBig = null;
  this.scene = null;
  this.bg = null;
  this.bgCorner = null;
  this.separator = null;
  this.txtTime = null;
  this.txtCoins = null;
  this.txtFloor = null;
  this.iconFloor = null;
};

var _PTimeTower = PTimeTower;

function PTimeTower(t) {
  var t = _super.call(this, t) || this;
  t.bg = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_bar 10000");
  t.bg.setOrigin(1, 0.5);
  t.add(t.bg);
  t.bgCorner = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_corner 10000");
  t.bgCorner.setOrigin(1, 0.5);
  t.add(t.bgCorner);
  t.txtCoins = new jd_1.JDBmpdText(t.scene, -25, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  t.add(t.txtCoins);
  var e = new Phaser.GameObjects.Image(t.scene, t.txtCoins.x - 70, 31, data_1.Atlases.ui, "coinTower 10000");
  e.scale = 0.9;
  t.add(e);
  e = new Phaser.GameObjects.Image(t.scene, e.x - 40, 31, data_1.Atlases.ui, "top_separator 10000");
  t.add(e);
  t.txtFloor = new jd_1.JDBmpdText(t.scene, e.x - 20, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  t.add(t.txtFloor);
  t.iconFloor = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "floors 10000");
  t.add(t.iconFloor);
  t.separator = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_separator 10000");
  t.add(t.separator);
  t.txtTime = new jd_1.JDBmpdText(t.scene, 0, 31, data_1.Fonts.Main, "00:00:00", 40);
  t.add(t.txtTime);
  t.txtFloorBig = new jd_1.JDBmpdText(t.scene, 0, 170, data_1.Fonts.BigNumbers, "0", 250, 8947848);
  t.txtFloorBig.alpha = 0.5;
  t.scene.add.existing(t.txtFloorBig);
  t.scene.sys.displayList.moveTo(t.txtFloorBig, t.scene.sys.displayList.getIndex(t.scene.background) + 1);
  t.addBtn();
  e = null;
  t.currFlor = 0;
  t.updateBg();
  return t;
}

exports.PTimeTower = _PTimeTower;
