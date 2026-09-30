// levels/Level.js — recovered from webpack module #235 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Level = undefined;

var BalanceData_1 = require("../system/BalanceData"),
  Localization_1 = require("../system/Localization"),
  SaveGame_1 = require("../system/SaveGame");

function Level(t, e) {
  this.id = t;
  if (this.id === BalanceData_1.BalanceData.towerID) {
    this.data = e;
  } else {
    this.bgColor = Number("0x" + e.bgc);
    this.data = e.data;
    this.dataHard = e.dataHard;
  }
  if (!this.bgColor) {
    this.bgColor = 10999295;
  }
  this.targetCoins = e.tc;
  this.targetDeath = e.td;
  this.targetHardCoins = e.htc;
  this.targetHardDeath = e.htd;
  if (!this.targetCoins) {
    this.targetCoins = this.targetDeath = this.targetHardCoins = this.targetHardDeath = 0;
  }
  if (this.id !== BalanceData_1.BalanceData.hubID && this.id !== BalanceData_1.BalanceData.editID) {
    this.saveData = SaveGame_1.SaveGame.getInstance().getLevel(this.id);
  }
}

Level.prototype.complete = function (t, e, i) {
  if (this.saveData) {
    if (i === false) {
      if (this.saveData.tt === -1 || t < this.saveData.tt) {
        this.saveData.tt = t;
      }
    } else if (this.saveData.tth === -1 || t < this.saveData.tth) {
      this.saveData.tth = t;
    }
    this.save();
  }
};

Level.prototype.save = function () {
  SaveGame_1.SaveGame.getInstance().saveLevel(this.id, this.saveData);
};

Level.prototype.getName = function () {
  return this.id === BalanceData_1.BalanceData.editID
    ? this.id
    : this.id === BalanceData_1.BalanceData.vexID
      ? Localization_1.Localization.getText("actVex")
      : this.id === BalanceData_1.BalanceData.hubID
        ? Localization_1.Localization.getText("acthub")
        : Localization_1.Localization.getText("actNorm") + " " + this.id;
};

Level.prototype.getNameHard = function () {
  return Localization_1.Localization.getText("actHard");
};

Level.prototype.act3Star = function () {
  return this.saveData.tt !== -1 && this.saveData.cc === 1 && this.saveData.nd === 1;
};

Level.prototype.getTopTime = function (t) {
  return t === false ? this.saveData.tt : this.saveData.tth;
};

Level.prototype.isTargetLevelComplete = function (t) {
  return !!this.saveData && (t === false ? this.saveData.tt !== -1 : this.saveData.tth !== -1);
};

Level.prototype.isTargetCoinsComplete = function (t) {
  return this.saveData ? (t === false ? this.saveData.cc : this.saveData.cch) : 0;
};

Level.prototype.isTargetDeathComplete = function (t) {
  return this.saveData ? (t === false ? this.saveData.nd : this.saveData.ndh) : 0;
};

Level.prototype.completeTargetCoins = function (t) {
  if (this.saveData) {
    if (t === false) {
      this.saveData.cc = 1;
    } else {
      this.saveData.cch = 1;
    }
  }
};

Level.prototype.completeTargetDeath = function (t) {
  if (this.saveData) {
    if (t === false) {
      this.saveData.nd = 1;
    } else {
      this.saveData.ndh = 1;
    }
  }
};

Level.prototype.getTargetCoins = function (t) {
  return t === false ? this.targetCoins : this.targetHardCoins;
};

Level.prototype.getTargetDeath = function (t) {
  return t === false ? this.targetDeath : this.targetHardDeath;
};

exports.Level = Level;
