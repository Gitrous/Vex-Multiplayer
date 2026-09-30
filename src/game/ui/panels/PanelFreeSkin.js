// ui/panels/PanelFreeSkin.js — recovered from webpack module #134 of the original vex7.min.js
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

exports.PanelFreeSkin = undefined;

var data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  Helpers_1 = require("../../utils/Helpers");

_super = require("./BasicPanel").BasicPanel;

__extends(PanelFreeSkin, _super);

PanelFreeSkin.prototype.init = function () {
  var t = this;
  this.addBgTitleBtn(640, 560, "newAchiveSkin", false);
  var e = new jd_1.JDSpineGameObject(this.scene, 0, 0, "player", "stand");
  this.add(e.getView());
  e.play("run", true);
  e.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(system_1.SkinsData.freeSkinData.skinID));
  e.scaleX = e.scaleY = 6.5;
  e.y = 90 + e.getView().height / 2;
  var e = new buttons_1.ButtonScale(this.scene, -145, 210);
  e.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 3);
  e.addTxtTranslated("equip", data_1.Fonts.Main, 34, 4737096);
  e.txtTranslated.setFitSize(200);
  e.onUp = function () {
    return t.equip();
  };
  this.add(e.getView());
  (e = new buttons_1.ButtonScale(this.scene, 145, 210)).addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 3);
  e.addTxtTranslated("continue", data_1.Fonts.Main, 34, 4737096);
  e.txtTranslated.setFitSize(200);
  e.onUp = function () {
    return t.close();
  };
  this.add(e.getView());
};

PanelFreeSkin.prototype.show = function () {
  _super.prototype.show.call(this);
  this.scene.pauseWorld();
};

PanelFreeSkin.prototype.hide = function () {
  _super.prototype.hide.call(this);
  this.scene.resumeMenu();
};

PanelFreeSkin.prototype.equip = function () {
  system_1.BalanceData.currSkin = system_1.SkinsData.freeSkinData.skinID;
  this.scene.player.setSkin(system_1.BalanceData.currSkin);
  system_1.SkinsData.setSkinStatus2(system_1.SkinsData.freeSkinData.rare, system_1.SkinsData.freeSkinData.id);
  this.close();
};

PanelFreeSkin.prototype.close = function () {
  this.scene.panelManager.hideCurrent();
  system_1.SkinsData.freeSkinData = null;
};

PanelFreeSkin.prototype.clikcOnBlack = function () {};

var _PanelFreeSkin = PanelFreeSkin;

function PanelFreeSkin() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelFreeSkin = _PanelFreeSkin;
