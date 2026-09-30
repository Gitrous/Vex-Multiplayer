// data/Jsons.js — recovered from webpack module #86 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Jsons = undefined;

var data_1 = require(".");

function Jsons() {}

Jsons.initLocales = function () {
  data_1.Constants.AVAILABLE_LANGUAGES.forEach(function (t) {
    Jsons.preloadList.push("locale_" + t);
  });
  Jsons.preloadList.push("locale_en_no_blood");
};

Jsons.getJson = function (t, e) {
  return t.cache.json.get(e);
};

Jsons.preloadList = [];

Jsons.list = ["balance", "levels", "domains_no_blood"];

exports.Jsons = Jsons;
