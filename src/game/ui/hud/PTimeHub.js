// ui/hud/PTimeHub.js — recovered from webpack module #139 of the original vex7.min.js
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

exports.PTimeHub = undefined;

var data_1 = require("../../data"),
  SubSceneList_1 = require("../../subscenes/SubSceneList"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  system_1 = require("../../system"),
  DailyTask_1 = require("../../system/DailyTask"),
  Helpers_1 = require("../../utils/Helpers"),
  PanelManager_1 = require("../panels/PanelManager");

_super = Phaser.GameObjects.Container;

__extends(PTimeHub, _super);

PTimeHub.prototype.createButtons = function () {
  var t = this,
    e = new buttons_1.ButtonContainerFrame(
      this.scene,
      -65,
      140,
      data_1.Atlases.ui,
      "buttonBlue 10000",
      "buttonBlue 10001",
    );
  e.addIcon(data_1.Atlases.ui, "iconSetting 10000");
  e.onUp = function () {
    return t.scene.panelManager.show(PanelManager_1.PanelList.PanelOptionsHub);
  };
  this.add(e.getView());
  (e = new buttons_1.ButtonContainerFrame(
    this.scene,
    -65,
    e.y + 110,
    data_1.Atlases.ui,
    "buttonBlue 10000",
    "buttonBlue 10001",
  )).addIcon(data_1.Atlases.ui, "iconDailyTask 10000");
  e.onUp = function () {
    return t.scene.panelManager.show(PanelManager_1.PanelList.PanelDailyTasks);
  };
  this.add(e.getView());
  if (DailyTask_1.DailyTask.canShowTaskI() === true) {
    this.Idaily = new Phaser.GameObjects.Image(this.scene, 40, -40, data_1.Atlases.ui, "icon_alert 10000");
    this.Idaily.scale = 0.7;
    e.add(this.Idaily);
    this.scene.events.on(DailyTask_1.DailyTask.EVENT_REWARDED, this.checkDailyI, this);
  }
  this.btnBonusStage = new buttons_1.ButtonContainerFrame(
    this.scene,
    -65,
    e.y + 110,
    data_1.Atlases.ui,
    "buttonBlue 10000",
    "buttonBlue 10001",
  );
  this.btnBonusStage.addIcon(data_1.Atlases.ui, "iconTower 10000");
  this.btnBonusStage.onUp = function () {
    return t.scene.showSubSceneTransition(SubSceneList_1.SubSceneList.Tower);
  };
  this.add(this.btnBonusStage.getView());
};

PTimeHub.prototype.checkDailyI = function () {
  this.Idaily.visible = DailyTask_1.DailyTask.canShowTaskI();
  this.updateCoins();
};

PTimeHub.prototype.updateTime = function (t) {
  this.txtTime.text = t;
};

PTimeHub.prototype.updateCoins = function () {
  this.txtCoins.text = Helpers_1.Helpers.moneyDecorator(system_1.BalanceData.totalMoney);
};

PTimeHub.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.x = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X;
  this.y = -data_1.Constants.UI_SHIFT_Y;
};

PTimeHub.prototype.destroy = function () {
  this.scene.events.off(DailyTask_1.DailyTask.EVENT_REWARDED, this.checkDailyI, this);
  _super.prototype.destroy.call(this);
  this.scene = null;
  this.txtTime = null;
  this.txtProgress = null;
  this.txtCoins = null;
  this.Idaily = null;
  this.btnBonusStage = null;
};

var _PTimeHub = PTimeHub;

function PTimeHub(t) {
  var t = _super.call(this, t) || this,
    e = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_bar 10000");
  e.setOrigin(1, 0.5);
  t.add(e);
  var i = new Phaser.GameObjects.Image(t.scene, 0, 31, data_1.Atlases.ui, "top_corner 10000");
  i.setOrigin(1, 0.5);
  t.add(i);
  t.txtCoins = new jd_1.JDBmpdText(t.scene, -25, 31, data_1.Fonts.Main, "0", 40, 16777215, 2);
  t.add(t.txtCoins);
  t.updateCoins();
  var n = new Phaser.GameObjects.Image(
    t.scene,
    t.txtCoins.x - t.txtCoins.width - 40,
    31,
    data_1.Atlases.ui,
    "coin 10000",
  );
  n.scale = 0.9;
  t.add(n);
  n = new Phaser.GameObjects.Image(t.scene, n.x - 40, 31, data_1.Atlases.ui, "top_separator 10000");
  t.add(n);
  t.txtTime = new jd_1.JDBmpdText(t.scene, n.x - 100, 31, data_1.Fonts.Main, "00:00:00", 40);
  t.add(t.txtTime);
  n = new Phaser.GameObjects.Image(t.scene, t.txtTime.x - 95, 31, data_1.Atlases.ui, "top_separator 10000");
  t.add(n);
  t.txtProgress = new jd_1.JDBmpdTextTranslated(t.scene, n.x - 20, 31, data_1.Fonts.Main, "", 40);
  t.txtProgress.setOrigin(1, 0.5);
  t.txtProgress.setTextPref("100% ", "complete");
  t.add(t.txtProgress);
  t.txtProgress.setTextPref(Math.floor(100 * system_1.Achievements.getTotalProgress()) + "% ", "complete");
  e.displayWidth = -t.txtProgress.x + t.txtProgress.width + 10;
  i.x = e.x - e.displayWidth + 2;
  i = e = n = null;
  t.createButtons();
  return t;
}

exports.PTimeHub = _PTimeHub;
