// ui/panels/PanelLevelComplete.js — recovered from webpack module #129 of the original vex7.min.js
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

exports.PanelLevelComplete = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  Helpers_1 = require("../../utils/Helpers"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK");

_super = BasicPanel_1.BasicPanel;

__extends(PanelLevelComplete, _super);

PanelLevelComplete.prototype.init = function () {
  var t = this;
  this.checkMark = new Array();
  this.addBgTitleBtn(740, 760, "lvlComplete", false);
  var e = new buttons_1.ButtonScale(this.scene, -190, 300);
  e.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 5, 1.1, 1.3);
  e.addTxtTranslated("retry", data_1.Fonts.Main, 40, 4737096);
  e.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 80);
  e.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_retry_level_complete", function () {
      return t.close(true);
    });
  };
  this.add(e.getView());
  (e = new buttons_1.ButtonScale(this.scene, 190, 300)).addImageEvents(
    data_1.Atlases.ui,
    "btn_green 10000",
    0,
    5,
    1.1,
    1.3,
  );
  e.addTxtTranslated("continue", data_1.Fonts.Main, 40, 4737096);
  e.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 80);
  e.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_continue_level_complete", function () {
      return t.close();
    });
  };
  this.add(e.getView());
  this.addTarget(-300, -130, Helpers_1.Helpers.getLevelTargetText(1, 0), 1);
  this.addTarget(-300, 10, Helpers_1.Helpers.getLevelTargetText(2, this.scene.getTargetCoins()));
  this.addTarget(-300, 150, Helpers_1.Helpers.getLevelTargetText(3, this.scene.getTargetDeath()));
  var i = new Phaser.GameObjects.Image(this.scene, -210, -240, data_1.Atlases.ui, "iconSkull 10000");
  this.add(i);
  this.txtCurrDeath = new jd_1.JDBmpdText(this.scene, i.x + 60, i.y - 2, data_1.Fonts.Main, "25", 60, 16777215, 0);
  this.add(this.txtCurrDeath);
  i = new Phaser.GameObjects.Image(this.scene, 50, -240, data_1.Atlases.ui, "coin 10000");
  this.add(i);
  this.txtCurrCoins = new jd_1.JDBmpdText(this.scene, i.x + 60, i.y - 2, data_1.Fonts.Main, "207", 60, 16777215, 0);
  this.add(this.txtCurrCoins);
  e = null;
};

PanelLevelComplete.prototype.addTarget = function (t, e, i, n) {
  if (n === undefined) {
    n = 0;
  }
  var s = new Phaser.GameObjects.Image(this.scene, 0, e, data_1.Atlases.gameplay, "whiteBlock 10000");
  s.tint = 3441150;
  s.setDisplaySize(650, 100);
  this.add(s);
  s = new Phaser.GameObjects.Image(this.scene, -t - 25, e, data_1.Atlases.ui, "checkbox 1000" + n);
  this.add(s);
  this.checkMark.push(s);
  var n = new jd_1.JDBmpdTextFit(this.scene, t, e, data_1.Fonts.Main, i, 40, 16777215, 0);
  n.setFitSize(450, JDTextFit_1.JDTextFitParam.both, 100);
  this.add(n);
  s = null;
};

PanelLevelComplete.prototype.show = function () {
  _super.prototype.show.call(this);
  this.txtCurrDeath.text = "" + this.scene.currentDeaths;
  this.txtCurrCoins.text = "" + this.scene.currentMoney;
  this.checkMark[0].setFrame("checkbox 10001");
  if (this.scene.isTargetCoinsComplete() === 1) {
    this.checkMark[1].setFrame("checkbox 10001");
  } else if (this.scene.currentMoney >= this.scene.getTargetCoins()) {
    this.scene.completeTargetCoins();
    this.checkMark[1].setFrame("checkbox 10001");
  }
  if (this.scene.isTargetDeathComplete() === 1) {
    this.checkMark[2].setFrame("checkbox 10001");
  } else if (this.scene.currentDeaths === 0 || this.scene.currentDeaths < this.scene.getTargetDeath()) {
    this.scene.completeTargetDeath();
    this.checkMark[2].setFrame("checkbox 10001");
  }
};

PanelLevelComplete.prototype.clikcOnBlack = function () {
  this.close();
};

PanelLevelComplete.prototype.close = function (t) {
  if (t === undefined) {
    t = false;
  }
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
  if (t === true) {
    this.scene.player.spawn();
    this.scene.firstSpawn = true;
    this.scene.reset();
    this.scene.resetLevel();
  } else {
    this.scene.resumeOnFinish();
  }
};

PanelLevelComplete.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.checkMark = null;
  this.txtCurrCoins = null;
  this.txtCurrDeath = null;
};

var _PanelLevelComplete = PanelLevelComplete;

function PanelLevelComplete() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelLevelComplete = _PanelLevelComplete;
