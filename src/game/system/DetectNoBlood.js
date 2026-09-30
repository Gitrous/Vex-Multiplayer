// system/DetectNoBlood.js — recovered from webpack module #108 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.DetectNoBlood = undefined;

var data_1 = require("../data"),
  BalanceData_1 = require("./BalanceData"),
  Localization_1 = require("./Localization");

function DetectNoBlood() {}

DetectNoBlood.detect = function (t) {
  var e = data_1.Jsons.getJson(t, "domains_no_blood"),
    i = window.location !== window.parent.location ? document.referrer : document.location.href;
  try {
    var n = BalanceData_1.BalanceData.noBlood;
    BalanceData_1.BalanceData.noBlood = this.isUrl(i, e.enableCheckbox);
    if (this.isUrl(i, e.hideCheckbox) === true) {
      data_1.Constants.SHOW_NO_BLOOD_CHECKBOX = false;
      data_1.Constants.SHOW_PANEL_LANGUAGE = false;
      Localization_1.Localization.setLng("en", false);
    }
    if (data_1.Constants.SHOW_NO_BLOOD_CHECKBOX === true && BalanceData_1.BalanceData.noBlood === false) {
      BalanceData_1.BalanceData.noBlood = n;
    }
  } catch (t) {}
  t.cache.json.remove("domains_no_blood");
};

DetectNoBlood.isUrl = function (t, e) {
  for (var i = 0; i < e.length; i++) if (t.indexOf(e[i]) > -1) return true;
  return false;
};

exports.DetectNoBlood = DetectNoBlood;
