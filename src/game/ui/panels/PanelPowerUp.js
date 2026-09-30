// ui/panels/PanelPowerUp.js — recovered from webpack module #137 of the original vex7.min.js
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

exports.PanelPowerUp = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit");

_super = BasicPanel_1.BasicPanel;

__extends(PanelPowerUp, _super);

PanelPowerUp.prototype.init = function () {
  var e = this;
  this.addBgTitleBtn(640, 460, "powerUpTitle", false);
  var t = new jd_1.JDBmpdTextTranslated(this.scene, 0, -20, data_1.Fonts.Main, "powerUpDes", 36);
  t.setFitSize(560, JDTextFit_1.JDTextFitParam.both);
  this.add(t);
  this.btnAD = new buttons_1.ButtonContainer(this.scene, 0, 150);
  this.btnAD.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 5, 1.1, 1.3);
  this.btnAD.addIcon(data_1.Atlases.ui, "watch_icon 10000", -90);
  this.btnAD.addTxtTranslated("watchAD", data_1.Fonts.Main, 40, 4737096, 1, 25);
  this.btnAD.txtTranslated.setFitSize(155, JDTextFit_1.JDTextFitParam.both, 65);
  this.btnAD.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showADRewarded(function (t) {
      return e.adComplete(t);
    });
  };
  this.add(this.btnAD.getView());
  this.scene.tweens.add({ targets: this.btnAD, scale: 1.1, loop: -1, yoyo: true, duration: 400 });
  this.btnNoTHX = new buttons_1.ButtonScale(this.scene, 0, this.btnAD.y + 160);
  this.btnNoTHX.addImageEvents(data_1.Atlases.ui, "btn_red 10000", 0, 5, 1.1, 1.3);
  this.btnNoTHX.addTxtTranslated("noThanks", data_1.Fonts.Main, 40, 4737096);
  this.btnNoTHX.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 65);
  this.btnNoTHX.onUp = function () {
    return e.close();
  };
  this.add(this.btnNoTHX.getView());
  this.btnNoTHX.visible = false;
};

PanelPowerUp.prototype.show = function () {
  _super.prototype.show.call(this);
  this.scene.pauseWorld();
};

PanelPowerUp.prototype.update = function () {
  if (!(this.visible === false || this.counter <= 0)) {
    --this.counter;
    if (this.counter === 0) {
      this.btnNoTHX.visible = true;
    }
  }
};

PanelPowerUp.prototype.adComplete = function (t) {
  if (t === true) {
    this.close();
    this.scene.player.addShield();
  } else {
    this.btnAD.txtTranslated.text = "unavailable";
    this.btnAD.onUp = null;
    this.scene.tweens.killTweensOf(this.btnAD);
  }
};

PanelPowerUp.prototype.clikcOnBlack = function () {};

PanelPowerUp.prototype.close = function () {
  this.scene.tweens.killTweensOf(this.btnAD);
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
};

PanelPowerUp.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.btnAD = null;
  this.btnNoTHX = null;
};

var _PanelPowerUp = PanelPowerUp;

function PanelPowerUp() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.counter = 120;
  return t;
}

exports.PanelPowerUp = _PanelPowerUp;
