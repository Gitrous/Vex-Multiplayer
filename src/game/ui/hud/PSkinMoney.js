// ui/hud/PSkinMoney.js — recovered from webpack module #146 of the original vex7.min.js
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

exports.PSkinMoney = undefined;

var AzerionSDK_1 = require("../../sdk/AzerionSDK"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  Helpers_1 = require("../../utils/Helpers");

_super = Phaser.GameObjects.Container;

__extends(PSkinMoney, _super);

PSkinMoney.prototype.updateCoins = function () {
  this.txtCoins.text = Helpers_1.Helpers.moneyDecorator(system_1.BalanceData.totalMoney);
  this.txtCoinTower.text = Helpers_1.Helpers.moneyDecorator(system_1.BalanceData.totalTowerMoney);
  this.coin.x = -(this.txtCoins.width + 60);
  this.bgSeparator.x = this.coin.x - 40;
  this.txtCoinTower.x = this.bgSeparator.x - 25;
  this.coinTower.x = this.txtCoinTower.x - (this.txtCoinTower.width + 35);
  this.bgBar.displayWidth = 500;
  this.bgBar.displayWidth = -(this.coinTower.x - 30);
  this.bgCorner.x = this.bgBar.x - this.bgBar.displayWidth + 2;
};

PSkinMoney.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.x = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X;
  this.y = -data_1.Constants.UI_SHIFT_Y;
};

PSkinMoney.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.txtCoins = null;
  this.bgBar = null;
  this.bgCorner = null;
  this.coin = null;
  this.bgSeparator = null;
  this.coinTower = null;
  this.txtCoinTower = null;
};

var _PSkinMoney = PSkinMoney;

function PSkinMoney(t) {
  var e = _super.call(this, t) || this;
  e.bgBar = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "top_bar 10000");
  e.bgBar.setOrigin(1, 0.5);
  e.add(e.bgBar);
  e.bgCorner = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "top_corner 10000");
  e.bgCorner.setOrigin(1, 0.5);
  e.add(e.bgCorner);
  e.txtCoins = new jd_1.JDBmpdText(e.scene, -25, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  e.add(e.txtCoins);
  e.coin = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "coin 10000");
  e.coin.scale = 0.9;
  e.add(e.coin);
  e.bgSeparator = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "top_separator 10000");
  e.add(e.bgSeparator);
  e.txtCoinTower = new jd_1.JDBmpdText(e.scene, -25, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  e.add(e.txtCoinTower);
  e.coinTower = new Phaser.GameObjects.Image(e.scene, 0, 31, data_1.Atlases.ui, "coinTower 10000");
  e.coinTower.scale = 0.85;
  e.add(e.coinTower);
  var i = new buttons_1.ButtonContainerFrame(
    e.scene,
    -65,
    140,
    data_1.Atlases.ui,
    "buttonBlue 10000",
    "buttonBlue 10001",
  );
  i.addIcon(data_1.Atlases.ui, "iconDoor 10000", 0, 3);
  i.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("exit_skins", function () {
      return t.subScene.back();
    });
  };
  e.add(i.getView());
  i = null;
  e.updateCoins();
  return e;
}

exports.PSkinMoney = _PSkinMoney;
