// ui/widgets/BasicDailyTask.js — recovered from webpack module #64 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BasicDailyTask = undefined;

var system_1 = require("../../system"),
  data_1 = require("../../data"),
  jd_1 = require("../../jd");

function BasicDailyTask(t, e) {
  this.parent = t;
  this.id = e;
}

BasicDailyTask.prototype.createTittle = function (t, e, i) {
  this.txtTitle = new jd_1.JDBmpdTextTranslated(
    this.parent.scene,
    t,
    e,
    data_1.Fonts.Main,
    "dailyTaskTitle" + this.id,
    i,
    16777215,
    0,
  );
  this.parent.add(this.txtTitle);
};

BasicDailyTask.prototype.createProgress = function (t, e, i, n, s) {
  if (s === undefined) {
    s = "";
  }
  var r = new Phaser.GameObjects.Image(this.parent.scene, t, e - 20, data_1.Atlases.ui, "progressBg" + s + " 10000");
  this.parent.add(r);
  this.progress = new Phaser.GameObjects.Image(
    this.parent.scene,
    t,
    e - 20,
    data_1.Atlases.ui,
    "progress" + s + " 10000",
  );
  this.parent.add(this.progress);
  this.setProgress(i / n);
};

BasicDailyTask.prototype.setProgress = function (t) {
  this.progress.setCrop(0, 0, this.progress.width * t, this.progress.height);
};

BasicDailyTask.prototype.reset = function () {
  this.setProgress(0);
};

BasicDailyTask.prototype.reward = function () {
  system_1.DailyTask.reward(this.id);
  this.rewarded();
};

BasicDailyTask.prototype.rewarded = function () {};

BasicDailyTask.prototype.destroy = function () {
  this.progress = null;
  this.parent = null;
  this.txtTitle = null;
};

exports.BasicDailyTask = BasicDailyTask;
