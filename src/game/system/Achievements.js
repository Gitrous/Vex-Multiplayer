// system/Achievements.js — recovered from webpack module #18 of the original vex7.min.js
"use strict";

var _tmp;

Object.defineProperty(exports, "__esModule", { value: true });

exports.TrophieAchieves = exports.TrophieTower = exports.Achievements = undefined;

var TrophieTower,
  TrophieAchieves,
  BalanceData_1 = require("./BalanceData"),
  SaveGame_1 = require("./SaveGame");

function Achievements() {}

Achievements.init = function (t) {
  if (
    ((this.main = t), (this.achievements = SaveGame_1.SaveGame.getInstance().getAchievements()), !this.achievements)
  ) {
    this.achievements = {};
    this.achievements = { a: [], ah: [] };
    for (var e = BalanceData_1.BalanceData.actsStarts; e <= BalanceData_1.BalanceData.totalActs; e++) {
      this.achievements.a[e] = 0;
      this.achievements.ah[e] = 0;
    }
  }
  for (e = BalanceData_1.BalanceData.actsStarts; e <= BalanceData_1.BalanceData.totalActs; e++) {
    this.actCompletes += this.achievements.a[e];
    this.actHardCompletes += this.achievements.ah[e];
  }
  this.totalComplete = this.actCompletes + this.actHardCompletes;
  this.totalAchives = 2 * BalanceData_1.BalanceData.totalActs - 1;
  this.initAchievesList();
  this.save();
};

Achievements.isCompletedAct = function (t, e) {
  return e === false ? this.achievements.a[t] === 1 : this.achievements.ah[t] === 1;
};

Achievements.completeAct = function (t, e) {
  if (((this.totalComplete += 1), e === false)) {
    if (this.achievements.a[t] !== 0) return;
    this.achievements.a[t] = 1;
    this.actCompletes += 1;
    this.openAchieve("Act", t);
    if (this.actCompletes === BalanceData_1.BalanceData.totalActs - 1) {
      this.saveAchive(TrophieAchieves.allActs);
    }
  } else {
    if (this.achievements.ah[t] !== 0) return;
    this.achievements.ah[t] = 1;
    this.actHardCompletes += 1;
    this.openAchieve("ActHard", t);
    if (this.actHardCompletes === BalanceData_1.BalanceData.totalActs - 1) {
      this.saveAchive(TrophieAchieves.allActsHard);
    }
  }
  this.save();
};

Achievements.save = function () {
  SaveGame_1.SaveGame.getInstance().saveAchievements(this.achievements);
};

Achievements.getTotalProgress = function () {
  return this.totalComplete / this.totalAchives;
};

Achievements.initAchievesList = function () {
  this.achieveList = {};
  this.createAchieve(TrophieTower.floors10, 1);
  this.createAchieve(TrophieTower.floors100, 1);
  this.createAchieve(TrophieTower.floors500, 1);
  this.createAchieve(TrophieTower.killAndroid, 1);
  this.createAchieve(TrophieTower.killBatteringRam, 1);
  this.createAchieve(TrophieTower.killDrone, 1);
  this.createAchieve(TrophieAchieves.death, 1);
  this.createAchieve(TrophieAchieves.playHour, 1);
  this.createAchieve(TrophieAchieves.gasping, 1);
  this.createAchieve(TrophieAchieves.vex, 1);
  this.createAchieve(TrophieAchieves.allActs, 1);
  this.createAchieve(TrophieAchieves.allActsHard, 1);
  this.createAchieve(TrophieAchieves.allSkins, 1);
  this.createAchieve(TrophieAchieves.daily10, 10);
  this.createAchieve(TrophieAchieves.daily50, 50);
  this.createAchieve(TrophieAchieves.daily100, 100);
};

Achievements.createAchieve = function (t, e, i) {
  if (i === undefined) {
    i = false;
  }
  if (!(this.getAchiveCount(t) < 0)) {
    this.achieveList[t] = { amount: e, once: i };
  }
};

Achievements.openAchieve = function (t, e) {
  this.main.events.emit(this.EVENT_ACHIEVEMENT_COMPLETE, t, e);
};

Achievements.saveAchive = function (t, e, i) {
  if ((e === undefined && (e = 1), i === undefined && (i = true), this.achieveList[t])) {
    e = this.getAchiveCount(t) + e;
    if (e >= this.achieveList[t].amount) {
      this.openAchieve("award", t);
      this.achievements[t] = -1;
      delete this.achieveList[t];
    } else {
      if (this.achieveList[t].once === true) return;
      this.achievements[t] = e;
    }
    if (i === true) {
      this.save();
    }
  }
};

Achievements.getAchiveCount = function (t) {
  return Number(this.achievements[t]) || 0;
};

Achievements.isAchieveCompleted = function (t) {
  return !this.achieveList[t];
};

Achievements.EVENT_ACHIEVEMENT_COMPLETE = "event_achievement_complete";

Achievements.actCompletes = 0;

Achievements.actHardCompletes = 0;

Achievements.totalAchives = 0;

Achievements.totalComplete = 0;

exports.Achievements = Achievements;

(_tmp = TrophieTower = exports.TrophieTower || (exports.TrophieTower = {})).floors10 = "floor10";

_tmp.floors100 = "floor100";

_tmp.floors500 = "floor500";

_tmp.killAndroid = "killAndroid";

_tmp.killBatteringRam = "killBatteringRam";

_tmp.killDrone = "killDrone";

(_tmp = TrophieAchieves = exports.TrophieAchieves || (exports.TrophieAchieves = {})).death = "death";

_tmp.playHour = "playh";

_tmp.gasping = "gasping";

_tmp.vex = "vex";

_tmp.allActs = "allActs";

_tmp.allActsHard = "allActsHard";

_tmp.allSkins = "allSkins";

_tmp.daily10 = "daily10";

_tmp.daily50 = "daily50";

_tmp.daily100 = "daily100";
