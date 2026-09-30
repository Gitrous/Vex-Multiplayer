// ui/panels/PanelTowerComplete.js — recovered from webpack module #135 of the original vex7.min.js
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

exports.PanelTowerComplete = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd");

_super = BasicPanel_1.BasicPanel;

__extends(PanelTowerComplete, _super);

PanelTowerComplete.prototype.init = function () {
  var t = this;
  this.addBgTitleBtn(740, 760, "towerComplete", false);
  var e = new jd_1.JDBmpdTextTranslated(this.scene, 0, -170, data_1.Fonts.Main, "towerCreditsCollect", 50);
  e.setFitSize(680);
  this.add(e);
  var i = new Phaser.GameObjects.Image(this.scene, -60, e.y + 100, data_1.Atlases.ui, "coinTower 10000");
  this.add(i);
  this.txtCurrCoins = new jd_1.JDBmpdText(this.scene, i.x + 60, i.y - 5, data_1.Fonts.Main, "207", 70);
  this.txtCurrCoins.setOrigin(0, 0.5);
  this.add(this.txtCurrCoins);
  (e = new jd_1.JDBmpdTextTranslated(this.scene, 0, i.y + 120, data_1.Fonts.Main, "floorsPassed", 50)).setFitSize(680);
  this.add(e);
  i = new Phaser.GameObjects.Image(this.scene, i.x, e.y + 100, data_1.Atlases.ui, "floors 10000");
  this.add(i);
  this.txtCurrFloors = new jd_1.JDBmpdText(this.scene, i.x + 60, i.y - 5, data_1.Fonts.Main, "207", 70);
  this.txtCurrFloors.setOrigin(0, 0.5);
  this.add(this.txtCurrFloors);
  var i = new buttons_1.ButtonScale(this.scene, 0, 300);
  i.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 5, 1.1, 1.3);
  i.addTxtTranslated("continue", data_1.Fonts.Main, 40, 4737096);
  i.txtTranslated.setFitSize(220);
  i.onUp = function () {
    return t.close();
  };
  this.add(i.getView());
  e = null;
};

PanelTowerComplete.prototype.show = function () {
  _super.prototype.show.call(this);
  this.txtCurrCoins.text = "" + this.scene.currentMoney;
  this.txtCurrFloors.text = "" + this.scene.currHeroFloor;
};

PanelTowerComplete.prototype.clikcOnBlack = function () {
  this.close();
};

PanelTowerComplete.prototype.close = function () {
  this.closeCurr();
  this.scene.backFromSubSkin();
};

PanelTowerComplete.prototype.closeCurr = function () {
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
};

PanelTowerComplete.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.txtCurrCoins = null;
  this.txtCurrFloors = null;
};

var _PanelTowerComplete = PanelTowerComplete;

function PanelTowerComplete() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelTowerComplete = _PanelTowerComplete;
