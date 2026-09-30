// system/Localization.js — recovered from webpack module #15 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Localization = undefined;

var data_1 = require("../data"),
  BalanceData_1 = require("./BalanceData"),
  SaveGame_1 = require("./SaveGame");

function Localization() {}

Localization.load = function () {
  if (!(this.language && data_1.Constants.SHOW_PANEL_LANGUAGE !== false)) {
    this.language = (navigator.language || navigator.userLanguage).substr(0, 2);
    if (data_1.Constants.AVAILABLE_LANGUAGES.indexOf(this.language) === -1) {
      this.language = "en";
    }
    this.setLng(this.language, false);
  }
};

Localization.getLang = function () {
  return this.language;
};

Localization.add = function (t, e) {
  this.data[t] = e;
};

Localization.setLng = function (t, e) {
  if (e === undefined) {
    e = true;
  }
  this.language = t;
  data_1.Fonts.setFont(t);
  if (e === true) {
    SaveGame_1.SaveGame.getInstance().saveProgress();
  }
};

Localization.getText = function (t) {
  var e = this.language;
  if (BalanceData_1.BalanceData.noBlood === true && this.language === "en") {
    e = this.language + "_no_blood";
  }
  var e = this.data[e][t];
  return e || t === "" ? e : t;
};

Localization.getData = function () {
  return this.data[this.language];
};

Localization.EVENT_CHANGE_LANG = "event_change_lang";

Localization.data = {};

exports.Localization = Localization;
