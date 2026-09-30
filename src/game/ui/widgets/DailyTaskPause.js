// ui/widgets/DailyTaskPause.js — recovered from webpack module #122 of the original vex7.min.js
"use strict";

var n,
  _super,
  __extends =
    (this && this.__extends) ||
    ((n = function (t, e) {
      return (n =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array
          ? function (t, e) {
              t.__proto__ = e;
            }
          : function (t, e) {
              for (var i in e) {
                if (Object.prototype.hasOwnProperty.call(e, i)) {
                  t[i] = e[i];
                }
              }
            }))(t, e);
    }),
    function (t, e) {
      if (typeof e != "function" && e !== null)
        throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
      function i() {
        this.constructor = t;
      }
      n(t, e);
      t.prototype = e === null ? Object.create(e) : ((i.prototype = e.prototype), new i());
    });

Object.defineProperty(exports, "__esModule", { value: true });

exports.DailyTaskPause = undefined;

var BasicDailyTask_1 = require("./BasicDailyTask"),
  DailyTask_1 = require("../../system/DailyTask"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons");

_super = BasicDailyTask_1.BasicDailyTask;

__extends(DailyTaskPause, _super);

DailyTaskPause.prototype.onRewarded = function (t) {
  if (this.id === t) {
    this.btnI.visible = false;
  }
};

DailyTaskPause.prototype.updateProgress = function () {
  var t = DailyTask_1.DailyTask.getData(this.id);
  this.setProgress(t.curr / t.target);
  if (t.rewarded === 1) {
    this.btnI.visible = true;
    this.parent.scene.events.on(DailyTask_1.DailyTask.EVENT_REWARDED, this.onRewarded, this);
  }
};

DailyTaskPause.prototype.destroy = function () {
  this.parent.scene.events.off(DailyTask_1.DailyTask.EVENT_REWARDED, this.onRewarded, this);
  _super.prototype.destroy.call(this);
  this.btnI = null;
};

var _DailyTaskPause = DailyTaskPause;

function DailyTaskPause(t, e, i, n) {
  var s = _super.call(this, t, e) || this,
    r = new Phaser.GameObjects.Image(t.scene, i, n, data_1.Atlases.ui, "pause_side 10000");
  t.add(r);
  var t = DailyTask_1.DailyTask.getData(e);
  s.createTittle(i - 240, n - 18, 34);
  s.txtTitle.setFitSize(290);
  s.createProgress(i - 95, n + 45, t.curr, t.target, "2");
  s.btnI = new buttons_1.ButtonScaleImage(s.parent.scene, i + 100, n + 5, data_1.Atlases.ui, "icon_alert 10000");
  s.btnI.onUp = function () {
    return s.parent.scene.showPanelDailyTask();
  };
  s.parent.add(s.btnI.getView());
  s.btnI.visible = false;
  0;
  return s;
}

exports.DailyTaskPause = _DailyTaskPause;
