// ui/panels/PanelDailyTasks.js — recovered from webpack module #131 of the original vex7.min.js
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

exports.PanelDailyTasks = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK"),
  data_1 = require("../../data"),
  SubSceneList_1 = require("../../subscenes/SubSceneList"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  widgets_1 = require("../widgets");

_super = BasicPanel_1.BasicPanel;

__extends(PanelDailyTasks, _super);

PanelDailyTasks.prototype.init = function () {
  var e = this;
  this.addBgTitleBtn(1200, 800, "dailyTasks", true, "close_daily_tasks");
  this.resetInLocale = system_1.Localization.getText("resetsIn");
  this.txtResetIn = new jd_1.JDBmpdText(this.scene, 0, -275, data_1.Fonts.Main, "", 40);
  this.add(this.txtResetIn);
  if (data_1.Constants.IS_AD_REWARD_AVAILABLE === true) {
    this.btnAD = new buttons_1.ButtonScale(this.scene, 0, this.txtResetIn.y);
    this.btnAD.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 3, 0.5, 0.95);
    this.btnAD.addIcon(data_1.Atlases.ui, "watch_icon 10000");
    this.btnAD.onUp = function () {
      return AzerionSDK_1.AzerionSDK.showADRewarded(function (t) {
        return e.adComplete(t);
      });
    };
    this.add(this.btnAD.getView());
  }
  this.dailyTasks = new Array(4);
  this.dailyTasks[0] = new widgets_1.DailyTaskPanel(this, 0, -290, -85);
  this.dailyTasks[1] = new widgets_1.DailyTaskPanel(this, 1, 290, -85);
  this.dailyTasks[2] = new widgets_1.DailyTaskPanel(this, 2, -290, 225);
  this.dailyTasks[3] = new widgets_1.DailyTaskPanel(this, 3, 290, 225);
  this.scene.events.on(system_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
  this.scene.events.on(system_1.DailyTask.EVENT_TIMER_TICK, this.tickTimer, this);
  system_1.DailyTask.startTimer();
  this.scene.events.on(system_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
};

PanelDailyTasks.prototype.adComplete = function (t) {
  if (t === true) {
    system_1.DailyTask.resetByAD();
  } else {
    this.btnAD.onUp = null;
  }
};

PanelDailyTasks.prototype.changeLang = function () {
  this.txtTitle.setFont(data_1.Fonts.Main);
  this.txtTitle.text = "dailyTasks";
  this.resetInLocale = system_1.Localization.getText("resetsIn");
  this.txtResetIn.setFont(data_1.Fonts.Main);
  this.txtResetIn.text = this.resetInLocale + ": " + this.decoratedTime;
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].changeLang();
};

PanelDailyTasks.prototype.reset = function () {
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].reset();
};

PanelDailyTasks.prototype.tickTimer = function (t) {
  this.txtResetIn.text = this.resetInLocale + ": " + t;
  this.decoratedTime = t;
};

PanelDailyTasks.prototype.show = function () {
  _super.prototype.show.call(this);
  this.scene.pauseWorld();
  if (this.btnAD) {
    this.btnAD.x = this.txtResetIn.x + this.txtResetIn.width / 2 + 100;
  }
};

PanelDailyTasks.prototype.hide = function () {
  _super.prototype.hide.call(this);
  if (this.scene.currSubScene === SubSceneList_1.SubSceneList.Menu) {
    this.scene.resumeMenu();
  } else {
    this.scene.resumeWorld();
  }
};

PanelDailyTasks.prototype.destroy = function () {
  this.scene.events.off(system_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
  this.scene.events.off(system_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
  this.scene.events.off(system_1.DailyTask.EVENT_TIMER_TICK, this.tickTimer, this);
  _super.prototype.destroy.call(this);
  for (var t = 0; t < this.dailyTasks.length; t++) this.dailyTasks[t].destroy();
  this.dailyTasks = null;
  this.txtResetIn = null;
};

var _PanelDailyTasks = PanelDailyTasks;

function PanelDailyTasks() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelDailyTasks = _PanelDailyTasks;
