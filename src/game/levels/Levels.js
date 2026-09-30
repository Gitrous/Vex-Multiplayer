// levels/Levels.js — recovered from webpack module #234 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Levels = undefined;

var Level_1 = require("./Level"),
  BalanceData_1 = require("../system/BalanceData"),
  data_1 = require("../data");

function Levels() {
  this.levels = {};
  BalanceData_1.BalanceData.init();
}

Levels.prototype.loadLevels = function (t) {
  for (var e = data_1.Jsons.getJson(t, "levels"), i = 0, n = Object.keys(e); i < n.length; i++) {
    var s = n[i];
    if (s !== "config") {
      this.loadLevel(s, e[s]);
    } else {
      BalanceData_1.BalanceData.initConfig(e[s]);
    }
  }
};

Levels.prototype.loadLevelEdit = function () {
  this.loadLevel(BalanceData_1.BalanceData.editID, {});
};

Levels.prototype.loadLevel = function (t, e) {
  this.levels[t] = new Level_1.Level(t, e);
};

Levels.prototype.getLevel = function (t) {
  var e = this.levels[t];
  if (!(e || t === "0")) {
    this.levels[t] = new Level_1.Level(t, {});
    e = this.levels[t];
  }
  return e;
};

exports.Levels = Levels;
