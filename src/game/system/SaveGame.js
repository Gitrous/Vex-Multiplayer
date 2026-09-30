// system/SaveGame.js — recovered from webpack module #17 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.SaveGame = undefined;

var Localization_1 = require("./Localization"),
  data_1 = require("../data"),
  BalanceData_1 = require("./BalanceData");

function SaveGame() {
  var t;
  this.isCookie = navigator.cookieEnabled;
  if ((t = this.isCookie === true ? localStorage.getItem(data_1.Constants.STORAGE_KEY) : t)) {
    t = JSON.parse(t);
    this.checkPoint = t.checkPoint;
    BalanceData_1.BalanceData.levelsCompleted = t.levelsCompleted;
    this.setOptions(t.options);
    this.setStats(t.stats);
    this.levels = t.levels;
    this.achievements = t.achievements;
    this.daily = t.daily;
    this.skins = t.skins;
  } else {
    this.clearAll();
  }
}

SaveGame.getInstance = function () {
  return (SaveGame.instance = SaveGame.instance ? SaveGame.instance : new SaveGame());
};

SaveGame.prototype.clearAll = function () {
  this.checkPoint = null;
  this.levels = {};
  for (var t = BalanceData_1.BalanceData.actsStarts; t <= BalanceData_1.BalanceData.totalActs; t++)
    this.levels[t] = this.getNewLevelData();
  BalanceData_1.BalanceData.levelsCompleted = 0;
  this.saveProgress();
};

SaveGame.prototype.getNewLevelData = function () {
  return { tt: -1, tth: -1, cc: 0, nd: 0, cch: 0, ndh: 0 };
};

SaveGame.prototype.getAllValues = function () {
  return {
    checkPoint: this.checkPoint,
    levelsCompleted: BalanceData_1.BalanceData.levelsCompleted,
    options: this.getOptions(),
    stats: this.getStats(),
    levels: this.getAllLevels(),
    achievements: this.getAchievements(),
    daily: this.getDaily(),
    skins: this.getSkins(),
  };
};

SaveGame.prototype.getOptions = function () {
  return {
    ar: BalanceData_1.BalanceData.autoReset,
    art: BalanceData_1.BalanceData.autoRestart,
    nb: BalanceData_1.BalanceData.noBlood,
    mts: BalanceData_1.BalanceData.mutedSfx,
    mtm: BalanceData_1.BalanceData.mutedMusic,
    lng: Localization_1.Localization.getLang(),
  };
};

SaveGame.prototype.setOptions = function (t) {
  BalanceData_1.BalanceData.autoReset = t.ar;
  BalanceData_1.BalanceData.autoRestart = t.art;
  BalanceData_1.BalanceData.noBlood = t.nb;
  BalanceData_1.BalanceData.mutedSfx = t.mts;
  BalanceData_1.BalanceData.mutedMusic = t.mtm;
  Localization_1.Localization.setLng(t.lng, false);
};

SaveGame.prototype.getStats = function () {
  return {
    td: BalanceData_1.BalanceData.totalDeaths,
    tm: BalanceData_1.BalanceData.totalMoney,
    cs: BalanceData_1.BalanceData.currSkin,
    ttm: BalanceData_1.BalanceData.totalTowerMoney,
    tf: BalanceData_1.BalanceData.towerFloor,
  };
};

SaveGame.prototype.setStats = function (t) {
  BalanceData_1.BalanceData.totalDeaths = t.td;
  BalanceData_1.BalanceData.totalMoney = t.tm;
  BalanceData_1.BalanceData.currSkin = t.cs;
  BalanceData_1.BalanceData.totalTowerMoney = t.ttm;
  BalanceData_1.BalanceData.towerFloor = t.tf;
};

SaveGame.prototype.getCheckPoint = function () {
  return this.checkPoint;
};

SaveGame.prototype.saveCheckPoint = function (t, e) {
  this.checkPoint = { x: t, y: e };
  this.saveProgress();
};

SaveGame.prototype.removeCheckPoint = function () {
  this.checkPoint = null;
  this.saveProgress();
};

SaveGame.prototype.getAllLevels = function () {
  return this.levels;
};

SaveGame.prototype.getLevel = function (t) {
  return this.levels[t];
};

SaveGame.prototype.saveLevel = function (t, e) {
  this.levels[t] = e;
  BalanceData_1.BalanceData.levelsCompleted = Number(t);
  this.saveProgress();
};

SaveGame.prototype.getAchievements = function () {
  return this.achievements;
};

SaveGame.prototype.saveAchievements = function (t) {
  this.achievements = t;
  this.saveProgress();
};

SaveGame.prototype.getDaily = function () {
  return this.daily;
};

SaveGame.prototype.saveDaily = function (t) {
  this.daily = t;
  this.saveProgress();
};

SaveGame.prototype.getSkins = function () {
  return this.skins;
};

SaveGame.prototype.saveSkins = function (t) {
  this.skins = t;
  this.saveProgress();
};

SaveGame.prototype.saveProgress = function () {
  if (this.isCookie === true && navigator.cookieEnabled === true) {
    localStorage.setItem(data_1.Constants.STORAGE_KEY, JSON.stringify(this.getAllValues()));
  }
};

exports.SaveGame = SaveGame;
