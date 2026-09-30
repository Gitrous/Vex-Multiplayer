// ui/panels/PanelPause.js — recovered from webpack module #127 of the original vex7.min.js
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

exports.PanelPause = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  widgets_1 = require("../widgets"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  system_1 = require("../../system"),
  Helpers_1 = require("../../utils/Helpers"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK");

_super = BasicPanel_1.BasicPanel;

__extends(PanelPause, _super);

PanelPause.prototype.init = function () {
  var t = this;
  this.stars = new Array();
  if (this.scene.currLevelID !== system_1.BalanceData.towerID) {
    this.addBgTitleBtn(740, 580, "lvlObj", false);
    this.addTarget(-300, -100, Helpers_1.Helpers.getLevelTargetText(1, 0));
    this.addTarget(-300, 45, Helpers_1.Helpers.getLevelTargetText(2, this.scene.getTargetCoins()));
    this.addTarget(-300, 190, Helpers_1.Helpers.getLevelTargetText(3, this.scene.getTargetDeath()));
    this.btnRetry = new buttons_1.ButtonScale(this.scene, 0, 0);
    this.btnRetry.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 5, 1.1, 1.3);
    this.btnRetry.addTxtTranslated("retry", data_1.Fonts.Main, 40, 4737096);
    this.btnRetry.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 80);
    this.btnRetry.onUp = function () {
      return AzerionSDK_1.AzerionSDK.showAD("click_retry_pause_popup", function () {
        return t.resetlevel();
      });
    };
    this.add(this.btnRetry.getView());
  }
  this.imgPaused = new Phaser.GameObjects.Image(this.scene, 0, 0, data_1.Atlases.ui, "pause_bar 10000");
  this.add(this.imgPaused);
  this.txtPaused = new jd_1.JDBmpdTextTranslated(this.scene, 0, 0, data_1.Fonts.Main, "paused", 100);
  this.add(this.txtPaused);
  this.btnExit = new buttons_1.ButtonScale(this.scene, -310, 0);
  this.btnExit.addImageEvents(data_1.Atlases.ui, "btn_red 10000", 0, 5, 1.1, 1.3);
  this.btnExit.addTxtTranslated("exit", data_1.Fonts.Main, 40, 4737096);
  this.btnExit.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 80);
  this.btnExit.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_exit_pause_popup", function () {
      return t.goBack();
    });
  };
  this.add(this.btnExit.getView());
  this.btnContinue = new buttons_1.ButtonScale(this.scene, 310, 0);
  this.btnContinue.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 5, 1.1, 1.3);
  this.btnContinue.addTxtTranslated("continue", data_1.Fonts.Main, 40, 4737096);
  this.btnContinue.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 80);
  this.btnContinue.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_continue_pause_popup", function () {
      return t.close();
    });
  };
  this.add(this.btnContinue.getView());
  this.dailyContainer = new Phaser.GameObjects.Container(this.scene);
  this.scene.panelManager.add(this.dailyContainer);
  this.dailyTasks = new Array(4);
  this.dailyTasks[0] = new widgets_1.DailyTaskPause(this.dailyContainer, 0, 265, data_1.Constants.GHH - 180);
  this.dailyTasks[1] = new widgets_1.DailyTaskPause(this.dailyContainer, 1, 265, data_1.Constants.GHH - 60);
  this.dailyTasks[2] = new widgets_1.DailyTaskPause(this.dailyContainer, 2, 265, data_1.Constants.GHH + 60);
  this.dailyTasks[3] = new widgets_1.DailyTaskPause(this.dailyContainer, 3, 265, data_1.Constants.GHH + 180);
  this.scene.events.on(system_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
};

PanelPause.prototype.reset = function () {
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].reset();
};

PanelPause.prototype.addTarget = function (t, e, i) {
  var n = new Phaser.GameObjects.Image(this.scene, 0, e, data_1.Atlases.gameplay, "whiteBlock 10000");
  n.tint = 3441150;
  n.setDisplaySize(650, 100);
  this.add(n);
  n = new Phaser.GameObjects.Image(this.scene, -t - 25, e, data_1.Atlases.ui, "checkbox 10000");
  this.add(n);
  this.stars.push(n);
  var t = new jd_1.JDBmpdTextFit(this.scene, t, e, data_1.Fonts.Main, i, 40, 16777215, 0);
  t.setFitSize(450, JDTextFit_1.JDTextFitParam.both, 100);
  this.add(t);
  n = null;
};

PanelPause.prototype.addBgTitleBtn = function (t, e, i, n) {
  var s = this;
  if (n === undefined) {
    n = true;
  }
  var r = t / 2,
    e = e / 2;
  this.addBg(0, 0, t, 760).setInteractive().scaleY = 0.76;
  var o = 40 - e + 7;
  this.addBgTitle(0, o, t, 80);
  this.txtTitle = new jd_1.JDBmpdTextTranslated(this.scene, 0, o - 3, data_1.Fonts.Main, i, 58);
  this.txtTitle.setFitSize(t - 100);
  this.add(this.txtTitle);
  if (n === true) {
    (o = new buttons_1.ButtonScaleImage(this.scene, r - 15, 15 - e, data_1.Atlases.ui, "btnX 10000")).onUp =
      function () {
        return s.clikcOnBlack();
      };
    this.add(o.getView());
  }
};

PanelPause.prototype.show = function () {
  _super.prototype.show.call(this);
  this.dailyContainer.visible = true;
  system_1.DailyTask.startTimer();
  this.scene.pauseWorld();
  if (
    this.scene.currLevelID !== system_1.BalanceData.towerID &&
    (this.scene.isTargetLevelComplete() === 1 && this.stars[0].setFrame("checkbox 10001"),
    this.scene.isTargetCoinsComplete() === 1 && this.stars[1].setFrame("checkbox 10001"),
    this.scene.isTargetDeathComplete() === 1)
  ) {
    this.stars[2].setFrame("checkbox 10001");
  }
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].updateProgress();
};

PanelPause.prototype.hide = function () {
  _super.prototype.hide.call(this);
  this.dailyContainer.visible = false;
  system_1.DailyTask.stopTimer();
};

PanelPause.prototype.goBack = function () {
  this.scene.panelManager.hideCurrent();
  this.scene.backFromSubSkin();
};

PanelPause.prototype.resetlevel = function () {
  this.close();
  this.scene.resetLevel();
};

PanelPause.prototype.clikcOnBlack = function () {
  this.close();
};

PanelPause.prototype.close = function () {
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
};

PanelPause.prototype.resize = function () {
  _super.prototype.resize.call(this);
  this.btnExit.y = this.btnContinue.y = (410 * data_1.Constants.UI_SCALE) / this.scaleY + data_1.Constants.UI_SHIFT_Y;
  if (this.btnRetry) {
    this.btnRetry.y = this.btnExit.y;
  }
  this.imgPaused.y = (-410 * data_1.Constants.UI_SCALE) / this.scaleY - data_1.Constants.UI_SHIFT_Y;
  this.txtPaused.y = this.imgPaused.y;
  this.dailyContainer.x = -data_1.Constants.UI_SHIFT_X;
};

PanelPause.prototype.destroy = function () {
  this.scene.events.off(system_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].destroy();
  _super.prototype.destroy.call(this);
  this.btnRetry = null;
  this.btnExit = null;
  this.btnContinue = null;
  this.txtPaused = null;
  this.imgPaused = null;
  this.dailyContainer.destroy();
  this.dailyContainer = null;
  this.dailyTasks = null;
  this.stars = null;
};

var _PanelPause = PanelPause;

function PanelPause() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelPause = _PanelPause;
