// system/DailyTask.js — recovered from webpack module #23 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.DailyTask = exports.TaskID = undefined;

var TaskID,
  Tools_1 = require("../utils/Tools"),
  Helpers_1 = require("../utils/Helpers"),
  Achievements_1 = require("./Achievements"),
  BalanceData_1 = require("./BalanceData"),
  Localization_1 = require("./Localization"),
  SaveGame_1 = require("./SaveGame");

(_tmp = TaskID = exports.TaskID || (exports.TaskID = {}))[(_tmp.collectCoins = 0)] = "collectCoins";

_tmp[(_tmp.completeLevel = 1)] = "completeLevel";

_tmp[(_tmp.playTowerOfTerror = 2)] = "playTowerOfTerror";

_tmp[(_tmp.completeAny3Levels = 3)] = "completeAny3Levels";

DailyTask.init = function (t, e, i) {
  this.scene = t;
  this.rewardCoins = e;
  this.taskCollectCoins = i;
  this.timeToReset = 864e5;
  this.data = SaveGame_1.SaveGame.getInstance().getDaily();
  if (!this.data) {
    this.reset(this.timeToReset);
  }
  this.resetTxt();
  this.startTimer();
};

DailyTask.tickTimer = function () {
  var t = Date.now();
  if (this.data.rTime < t) {
    e = (t - this.data.rTime) % this.timeToReset;
    this.reset(this.timeToReset - e);
    this.resetTxt();
    this.scene.events.emit(this.EVENT_TIMER_RESET);
  }
  var e = this.data.rTime - t;
  this.scene.events.emit(this.EVENT_TIMER_TICK, Helpers_1.Helpers.timeDecoratorHub(e));
};

DailyTask.startTimer = function () {
  var t = this;
  this.tickTimer();
  if (!this.intervalID) {
    this.intervalID = setInterval(function () {
      return t.tickTimer();
    }, 1e3);
  }
};

DailyTask.stopTimer = function () {
  if (this.intervalID) {
    clearInterval(this.intervalID);
    this.intervalID = null;
  }
};

DailyTask.getRewardCoins = function () {
  return this.rewardCoins;
};

DailyTask.reward = function (t) {
  BalanceData_1.BalanceData.totalMoney += this.rewardCoins;
  this.data.tasks[t].c = this.data.tasks[t].t;
  this.data.tasks[t].r = 2;
  this.save();
  this.scene.events.emit(this.EVENT_REWARDED);
};

DailyTask.getData = function (t) {
  return {
    curr: this.data.tasks[t].c,
    target: this.data.tasks[t].t,
    rewarded: this.data.tasks[t].r,
    des: this.dataTxt[t],
  };
};

DailyTask.saveData = function (t, e) {
  if (!(this.data.tasks[t].r !== 0 || (t === TaskID.completeLevel && e !== this.data.tasks[t].l))) {
    this.data.tasks[t].c += 1;
    if (this.data.tasks[t].c >= this.data.tasks[t].t) {
      this.data.tasks[t].r = 1;
      Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.daily10, 1, false);
      Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.daily50, 1, false);
      Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.daily100, 1);
    }
    this.save();
  }
};

DailyTask.canShowTaskI = function () {
  for (var t = 0; t < this.data.tasks.length; t++) if (this.data.tasks[t].r === 1) return true;
  return false;
};

DailyTask.resetByAD = function () {
  this.reset(this.timeToReset);
  this.scene.events.emit(this.EVENT_TIMER_RESET);
};

DailyTask.reset = function (t) {
  var e = new Array(4);
  e[TaskID.collectCoins] = { c: 0, t: Tools_1.Tools.getRandomCell(this.taskCollectCoins), r: 0 };
  var i = BalanceData_1.BalanceData.levelsCompleted + 1;
  if (i > BalanceData_1.BalanceData.totalActs) {
    i = BalanceData_1.BalanceData.totalActs;
  }
  e[TaskID.completeLevel] = { c: 0, t: 1, r: 0, l: Tools_1.Tools.random(1, i) };
  e[TaskID.playTowerOfTerror] = { c: 0, t: 1, r: 0 };
  e[TaskID.completeAny3Levels] = { c: 0, t: 3, r: 0 };
  this.data = { rTime: Date.now() + t, tasks: e };
  this.resetTxt();
  this.save();
};

DailyTask.resetTxt = function () {
  this.dataTxt = [
    Localization_1.Localization.getText("dailyTaskDes0").replace("<x>", "" + this.data.tasks[TaskID.collectCoins].t),
    Localization_1.Localization.getText("dailyTaskDes1") + " " + this.data.tasks[TaskID.completeLevel].l,
    Localization_1.Localization.getText("dailyTaskDes2"),
    Localization_1.Localization.getText("dailyTaskDes3"),
  ];
};

DailyTask.save = function () {
  SaveGame_1.SaveGame.getInstance().saveDaily(this.data);
};

DailyTask.EVENT_REWARDED = "event_daily_rewarded";

DailyTask.EVENT_TIMER_TICK = "event_daily_timer_tick";

DailyTask.EVENT_TIMER_RESET = "event_daily_timer_reset";

DailyTask.taskCollectCoins = [];

var _tmp = DailyTask;

function DailyTask() {}

exports.DailyTask = _tmp;
