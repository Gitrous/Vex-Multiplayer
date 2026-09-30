// data/Fonts.js — recovered from webpack module #85 of the original vex7.min.js
"use strict";

function Fonts() {}

Object.defineProperty(exports, "__esModule", { value: true });

exports.Fonts = undefined;

Fonts.setFont = function (t) {
  this.Main = t === "ar" || t === "hi" || t === "ja" ? Fonts.Arial : Fonts.Garet;
  this.TutDeath = this.Main;
};

Fonts.setTextMetrics = function (t, e) {
  this.metricsData[t] = e;
};

Fonts.getTextMetrics = function (t) {
  return this.metricsData[t];
};

Fonts.Main = "arial";

Fonts.TutDeath = "arial";

Fonts.BigNumbers = "bigNumbers";

Fonts.list = [(Fonts.Arial = "arial"), (Fonts.Garet = "garetHeavy"), Fonts.BigNumbers];

Fonts.metricsData = {};

exports.Fonts = Fonts;
