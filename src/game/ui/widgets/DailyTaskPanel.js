// ui/widgets/DailyTaskPanel.js — recovered from webpack module #121 of the original vex7.min.js
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

exports.DailyTaskPanel = undefined;

var BasicDailyTask_1 = require("./BasicDailyTask"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  DailyTask_1 = require("../../system/DailyTask"),
  jd_1 = require("../../jd"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK");

_super = BasicDailyTask_1.BasicDailyTask;

__extends(DailyTaskPanel, _super);

DailyTaskPanel.prototype.createBtnReward = function (t, e, i, n, s) {
  var r = this;
  this.btnReward = new buttons_1.ButtonScale(this.parent.scene, t, e);
  this.btnReward.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 3, i, n);
  this.btnReward.addTxtTranslated(this.rewardLocalize, data_1.Fonts.Main, 40, 4737096);
  this.btnReward.onUp = function () {
    return r.reward();
  };
  this.btnReward.txtTranslated.setFitSize(200);
  this.parent.add(this.btnReward.getView());
  if (s <= 0) {
    this.disableRewardBtn();
  } else if (s === 2) {
    this.rewarded();
  }
};

DailyTaskPanel.prototype.createDes = function (t, e, i, n, s) {
  this.txtDes = new jd_1.JDBmpdTextFit(this.parent.scene, t, e, data_1.Fonts.Main, n, i, 16777215, 0);
  this.txtDes.setFitSize(s, JDTextFit_1.JDTextFitParam.wordWrap);
  this.parent.add(this.txtDes);
};

DailyTaskPanel.prototype.createProgress = function (t, e, i, n) {
  this.txtProgress = new jd_1.JDBmpdText(this.parent.scene, t, e + 12, data_1.Fonts.Main, i + "/" + n, 30);
  this.parent.add(this.txtProgress);
  _super.prototype.createProgress.call(this, t, e, i, n);
};

DailyTaskPanel.prototype.changeLang = function () {
  if (this.btnAD) {
    this.btnAD.txtTranslated.setFont(data_1.Fonts.Main);
    if (this.btnAD.onUp === null) {
      this.btnAD.txtTranslated.text = "unavailable";
    } else {
      this.btnAD.txtTranslated.text = "watchAD";
    }
  }
  this.btnReward.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnReward.txtTranslated.text = this.rewardLocalize;
  this.txtTitle.setFont(data_1.Fonts.Main);
  this.txtTitle.text = "dailyTaskTitle" + this.id;
  this.txtDes.setFont(data_1.Fonts.Main);
  this.txtDes.text = DailyTask_1.DailyTask.getData(this.id).des;
};

DailyTaskPanel.prototype.reset = function () {
  _super.prototype.reset.call(this);
  var t = DailyTask_1.DailyTask.getData(this.id);
  this.txtTitle.text = "dailyTaskTitle" + this.id;
  this.txtProgress.text = t.curr + "/" + t.target;
  this.txtDes.text = t.des;
  this.disableRewardBtn();
  this.rewardLocalize = "reward";
  this.btnReward.txtTranslated.text = this.rewardLocalize;
  if (this.btnAD) {
    this.btnAD.visible = true;
  }
  this.btnReward.x = this.x + 135;
};

DailyTaskPanel.prototype.rewarded = function () {
  _super.prototype.rewarded.call(this);
  var t = DailyTask_1.DailyTask.getData(this.id);
  this.txtProgress.text = t.curr + "/" + t.target;
  this.setProgress(1);
  this.rewardLocalize = "rewarded";
  this.btnReward.txtTranslated.text = this.rewardLocalize;
  this.disableRewardBtn(0.7);
};

DailyTaskPanel.prototype.enableRewardBtn = function () {
  this.btnReward.alpha = 1;
  this.btnReward.image.input.enabled = true;
};

DailyTaskPanel.prototype.disableRewardBtn = function (t) {
  this.btnReward.alpha = t = t === undefined ? 0.5 : t;
  this.btnReward.image.input.enabled = false;
};

DailyTaskPanel.prototype.adComplete = function (t) {
  if (t === true) {
    this.reward();
    this.btnReward.x = this.x;
    if (this.btnAD) {
      this.btnAD.visible = false;
    }
  } else {
    this.btnAD.txtTranslated.text = "unavailable";
    this.btnAD.onUp = null;
  }
};

DailyTaskPanel.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.btnReward = null;
  this.btnAD = null;
  this.txtProgress = null;
  this.txtDes = null;
};

var _DailyTaskPanel = DailyTaskPanel;

function DailyTaskPanel(t, e, i, n) {
  var s = _super.call(this, t, e) || this;
  s.rewardLocalize = "reward";
  var r = new Phaser.GameObjects.Image(t.scene, i, n, data_1.Atlases.gameplay, "whiteBlock 10000");
  r.setTint(29409, 33507, 29409, 33507);
  r.setDisplaySize(570, 300);
  t.add(r);
  (r = new Phaser.GameObjects.Image(t.scene, i, n - 150, data_1.Atlases.gameplay, "whiteBlock 10000")).setOrigin(
    0.5,
    0,
  );
  r.setTint(37870, 44785, 37870, 44785);
  r.setDisplaySize(570, 80);
  t.add(r);
  r = null;
  s.x = i;
  var r = DailyTask_1.DailyTask.getData(e),
    e = 0,
    o = n + 90;
  if (data_1.Constants.IS_AD_REWARD_AVAILABLE === true) {
    s.btnAD = new buttons_1.ButtonScale(t.scene, i - 135, o);
    s.btnAD.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 3);
    s.btnAD.addIcon(data_1.Atlases.ui, "watch_icon 10000", -90);
    s.btnAD.addTxtTranslated("watchAD", data_1.Fonts.Main, 40, 4737096, 1, 25);
    s.btnAD.txtTranslated.setFitSize(155, JDTextFit_1.JDTextFitParam.both, 65);
    s.btnAD.onUp = function () {
      return AzerionSDK_1.AzerionSDK.showADRewarded(function (t) {
        return s.adComplete(t);
      });
    };
    t.add(s.btnAD.getView());
    if (r.rewarded <= 0) {
      e = 135;
    } else {
      s.btnAD.visible = false;
    }
  }
  s.createTittle(i - 260, n - 125, 32);
  s.createDes(i - 260, n - 95, 26, r.des, 500);
  s.createProgress(i, n, r.curr, r.target);
  s.createBtnReward(i + e, o, 1, 1, r.rewarded);
  return s;
}

exports.DailyTaskPanel = _DailyTaskPanel;
