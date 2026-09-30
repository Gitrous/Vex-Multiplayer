// subscenes/SubMenu.js — recovered from webpack module #151 of the original vex7.min.js
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

exports.SubMenu = undefined;

var BasicSubScene_1 = require("./BasicSubScene"),
  data_1 = require("../data"),
  buttons_1 = require("../ui/buttons"),
  PanelManager_1 = require("../ui/panels/PanelManager"),
  widgets_1 = require("../ui/widgets"),
  Achievements_1 = require("../system/Achievements"),
  DailyTask_1 = require("../system/DailyTask"),
  SkinsData_1 = require("../system/SkinsData"),
  Localization_1 = require("../system/Localization"),
  JDTextFit_1 = require("../jd/JDTextFit"),
  SubSceneList_1 = require("./SubSceneList"),
  blocks_1 = require("../objects/blocks"),
  system_1 = require("../system"),
  AzerionSDK_1 = require("../sdk/AzerionSDK");

_super = BasicSubScene_1.BasicSubScene;

__extends(SubMenu, _super);

SubMenu.prototype.init = function () {
  var e = this;
  _super.prototype.init.call(this);
  this.scene.createSceneMainMenu();
  if (this.scene.game.device.os.desktop === true) {
    this.scene.zoomTo(1.5, true);
  }
  this.logo = new Phaser.GameObjects.Image(this.scene, data_1.Constants.GHW, 0, "logo");
  this.logo.setOrigin(0.5, 0);
  this.add(this.logo);
  this.btnDailyTask = new widgets_1.ButtonMenu(this.scene, data_1.Constants.GHW - 640, 0, "btn_daily 10000");
  this.btnDailyTask.btn.addTxtTranslated("dailyTasks", data_1.Fonts.Main, 48, 16777215, 1, 0, -10);
  this.btnDailyTask.btn.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 150);
  this.btnDailyTask.addTxtDop("resetsIn", data_1.Fonts.Main, 40, 4737096, 1, 0, 120);
  this.btnDailyTask.txtDop.setFitSize(250);
  this.btnDailyTask.addTxtReset("04:23:11", data_1.Fonts.Main, 36, 4737096, 1, 0, 160);
  this.btnDailyTask.btn.onUp = function () {
    return e.scene.showPanelDailyTask();
  };
  this.add(this.btnDailyTask);
  if (data_1.Constants.IS_AD_REWARD_AVAILABLE === true) {
    this.btnAD = new buttons_1.ButtonScale(this.scene, 0, 0);
    this.btnAD.addImageEvents(data_1.Atlases.ui, "btn_yellow 10000", 0, 3, 0.5, 0.95);
    this.btnAD.addIcon(data_1.Atlases.ui, "watch_icon 10000");
    this.btnAD.onUp = function () {
      return AzerionSDK_1.AzerionSDK.showADRewarded(function (t) {
        return e.adComplete(t);
      });
    };
    this.add(this.btnAD.getView());
  }
  if (DailyTask_1.DailyTask.canShowTaskI() === true) {
    this.Idaily = new Phaser.GameObjects.Image(this.scene, 110, -80, data_1.Atlases.ui, "icon_alert 10000");
    this.btnDailyTask.add(this.Idaily);
    this.scene.events.on(DailyTask_1.DailyTask.EVENT_REWARDED, this.checkDailyI, this);
  }
  this.btnDailyStage = new widgets_1.ButtonMenu(this.scene, data_1.Constants.GHW - 340, 0, "btn_tower 10000");
  this.btnDailyStage.btn.addTxtTranslated("tower", data_1.Fonts.Main, 48, 16777215, 1, 0, -10);
  this.btnDailyStage.btn.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 150);
  this.btnDailyStage.addTxtDop("highScore", data_1.Fonts.Main, 40, 4737096, 1, 0, 120);
  this.btnDailyStage.txtDop.setFitSize(250);
  this.btnDailyStage.addTxtReset(
    Localization_1.Localization.getText("floor") + " " + system_1.BalanceData.towerFloor,
    data_1.Fonts.Main,
    36,
    4737096,
    1,
    0,
    160,
  );
  this.btnDailyStage.txtReset.setFitSize(250);
  this.btnDailyStage.btn.onUp = function () {
    return e.scene.showSubSceneTransition(SubSceneList_1.SubSceneList.Tower);
  };
  this.add(this.btnDailyStage);
  this.btnPlay = new buttons_1.ButtonScale(this.scene, data_1.Constants.GHW, 0);
  this.btnPlay.addImageEvents(data_1.Atlases.ui, "btn_play 10000");
  this.btnPlay.addTxtTranslated("play", data_1.Fonts.Main, 80, 16777215, 1, 0, -10);
  this.btnPlay.txtTranslated.setFitSize(290);
  this.btnPlay.onUp = function () {
    return e.scene.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
  };
  this.add(this.btnPlay.getView());
  this.btnSkins = new widgets_1.ButtonMenu(this.scene, data_1.Constants.GHW + 340, 0, "btn_skins 10000");
  this.btnSkins.btn.addTxtTranslated("skins", data_1.Fonts.Main, 48, 16777215, 1, 0, -10);
  this.btnSkins.btn.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 150);
  this.btnSkins.addTxtReset(
    SkinsData_1.SkinsData.totalSkinsOpened + "/" + SkinsData_1.SkinsData.totalSkins,
    data_1.Fonts.Main,
    40,
    4737096,
    1,
    0,
    120,
  );
  this.btnSkins.btn.onUp = function () {
    return e.scene.showSubSceneTransition(SubSceneList_1.SubSceneList.SkinsRarity);
  };
  this.add(this.btnSkins);
  if (SkinsData_1.SkinsData.canShowI() === true) {
    this.btnSkins.btn.add(new Phaser.GameObjects.Image(this.scene, 110, -80, data_1.Atlases.ui, "icon_alert 10000"));
  }
  this.btnTrophies = new widgets_1.ButtonMenu(this.scene, data_1.Constants.GHW + 640, 0, "btn_trophies 10000");
  this.btnTrophies.btn.addTxtTranslated("trophies", data_1.Fonts.Main, 48, 16777215, 1, 0, -10);
  this.btnTrophies.btn.txtTranslated.setFitSize(220, JDTextFit_1.JDTextFitParam.both, 150);
  this.btnTrophies.addTxtReset(
    Achievements_1.Achievements.totalComplete + "/" + Achievements_1.Achievements.totalAchives,
    data_1.Fonts.Main,
    40,
    4737096,
    1,
    0,
    120,
  );
  this.btnTrophies.btn.onUp = function () {
    return e.scene.showPanelTrophies();
  };
  this.add(this.btnTrophies);
  this.btnSetting = new buttons_1.ButtonContainerFrame(
    this.scene,
    -100,
    180,
    data_1.Atlases.ui,
    "buttonBlue 10000",
    "buttonBlue 10001",
  );
  this.btnSetting.addIcon(data_1.Atlases.ui, "iconSetting 10000");
  this.btnSetting.onUp = function () {
    return e.scene.panelManager.show(PanelManager_1.PanelList.PanelOptionsMenu);
  };
  this.add(this.btnSetting.getView());
  this.blockDailyTask = this.getBlock("dailyTask");
  this.blockDailyStage = this.getBlock("dailyStage");
  this.blockPlay = this.getBlock("play");
  this.blockSkins = this.getBlock("skins");
  this.blockTrophie = this.getBlock("throphie");
  this.scene.events.on(DailyTask_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
  this.scene.events.on(DailyTask_1.DailyTask.EVENT_TIMER_TICK, this.tickTimer, this);
  DailyTask_1.DailyTask.startTimer();
  this.btnLang = new buttons_1.ButtonScaleImage(
    this.scene,
    0,
    0,
    data_1.Atlases.ui,
    "flag_" + Localization_1.Localization.getLang() + " 10000",
  );
  this.btnLang.onUp = function () {
    return e.scene.panelManager.show(PanelManager_1.PanelList.PanelLanguages);
  };
  if (data_1.Constants.SHOW_PANEL_LANGUAGE === true) {
    this.add(this.btnLang.getView());
  }
  this.scene.events.on(Localization_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
  if (SkinsData_1.SkinsData.freeSkinData) {
    this.scene.panelManager.show(PanelManager_1.PanelList.PanelFreeSkin);
  }
};

SubMenu.prototype.reset = function () {
  if (this.Idaily) {
    this.Idaily.visible = false;
  }
};

SubMenu.prototype.adComplete = function (t) {
  if (t === true) {
    DailyTask_1.DailyTask.resetByAD();
  } else {
    this.btnAD.onUp = null;
  }
};

SubMenu.prototype.getBlock = function (t) {
  var e = new blocks_1.BasicBlock(this.scene, this.scene.layerBlocks);
  e.type = t;
  this.scene.blocks.push(e);
  return e;
};

SubMenu.prototype.changeLang = function () {
  DailyTask_1.DailyTask.resetTxt();
  this.scene.player.appearText.changeLang();
  this.scene.achievements.changeLang();
  this.btnDailyTask.btn.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnDailyTask.btn.txtTranslated.text = "dailyTasks";
  this.btnDailyTask.txtDop.setFont(data_1.Fonts.Main);
  this.btnDailyTask.txtDop.text = "resetsIn";
  this.btnDailyTask.txtReset.setFont(data_1.Fonts.Main);
  this.btnDailyStage.btn.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnDailyStage.btn.txtTranslated.text = "tower";
  this.btnDailyStage.txtDop.setFont(data_1.Fonts.Main);
  this.btnDailyStage.txtDop.text = "highScore";
  this.btnDailyStage.txtReset.setFont(data_1.Fonts.Main);
  this.btnDailyStage.txtReset.text =
    Localization_1.Localization.getText("floor") + " " + system_1.BalanceData.towerFloor;
  this.btnPlay.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnPlay.txtTranslated.text = "play";
  this.btnSkins.btn.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnSkins.btn.txtTranslated.text = "skins";
  this.btnTrophies.btn.txtTranslated.setFont(data_1.Fonts.Main);
  this.btnTrophies.btn.txtTranslated.text = "trophies";
  this.btnLang.getInteractiveElement().setFrame("flag_" + Localization_1.Localization.getLang() + " 10000");
};

SubMenu.prototype.tickTimer = function (t) {
  this.btnDailyTask.txtReset.text = t;
};

SubMenu.prototype.checkDailyI = function () {
  this.Idaily.visible = DailyTask_1.DailyTask.canShowTaskI();
};

SubMenu.prototype.resize = function () {
  this.logo.y = 100 - data_1.Constants.UI_SHIFT_Y;
  var t = data_1.Constants.GH + data_1.Constants.UI_SHIFT_Y;
  this.btnPlay.y = t - 210;
  this.btnDailyTask.y = this.btnPlay.y - 80;
  if (this.btnAD) {
    this.btnAD.x = this.btnDailyTask.x;
    this.btnAD.y = this.btnDailyTask.y + 225;
  }
  this.btnDailyStage.y = this.btnPlay.y - 40;
  this.btnSkins.y = this.btnDailyStage.y;
  this.btnTrophies.y = this.btnDailyTask.y;
  this.btnSetting.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.btnSetting.x =
    data_1.Constants.GW + data_1.Constants.UI_SHIFT_X - 65 * data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  this.btnSetting.y = 65 * data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE - data_1.Constants.UI_SHIFT_Y;
  this.btnLang.x = 90 - data_1.Constants.UI_SHIFT_X;
  this.btnLang.y = this.btnSetting.y + 15;
  this.resizeBlocks();
};

SubMenu.prototype.resizeBlocks = function () {
  this.uiScale = data_1.Constants.UI_SCALE / this.scene.cameraZoom;
  this.setBlockByButtonMenu(this.btnDailyTask, this.blockDailyTask);
  this.setBlockByButtonMenu(this.btnDailyStage, this.blockDailyStage);
  this.setBlockByButton(this.btnPlay, this.blockPlay);
  this.setBlockByButtonMenu(this.btnSkins, this.blockSkins);
  this.setBlockByButtonMenu(this.btnTrophies, this.blockTrophie);
  var t = this.blockPlay.xPos,
    e = this.blockPlay.yPos - this.blockPlay.height / 2;
  if (!(this.scene.spawnX === t && this.scene.spawnY === e)) {
    this.scene.spawnX = t;
    this.scene.spawnY = e;
    this.scene.player.spawn({ x: t, y: e });
  }
};

SubMenu.prototype.setBlockByButtonMenu = function (t, e) {
  this.updateBlock(t.x, t.y, t.btn.image.width, t.btn.image.height, e);
};

SubMenu.prototype.setBlockByButton = function (t, e) {
  this.updateBlock(t.x, t.y, t.image.width, t.image.height, e);
};

SubMenu.prototype.updateBlock = function (t, e, i, n, s) {
  t = (t + data_1.Constants.UI_SHIFT_X) * this.uiScale;
  e = (e + data_1.Constants.UI_SHIFT_Y) * this.uiScale;
  s.spawn({ x: t, y: e, width: i * this.uiScale, height: (n - 6) * this.uiScale });
  s.sprite.visible = false;
};

SubMenu.prototype.destroy = function () {
  this.scene.events.off(DailyTask_1.DailyTask.EVENT_TIMER_RESET, this.reset, this);
  this.scene.events.off(DailyTask_1.DailyTask.EVENT_REWARDED, this.checkDailyI, this);
  this.scene.events.off(DailyTask_1.DailyTask.EVENT_TIMER_TICK, this.tickTimer, this);
  this.scene.events.off(Localization_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
  _super.prototype.destroy.call(this);
  this.logo = null;
  this.btnDailyTask = null;
  this.btnAD = null;
  this.btnDailyStage = null;
  this.btnPlay = null;
  this.btnSkins = null;
  this.btnTrophies = null;
  this.btnSetting = null;
  this.Idaily = null;
  this.blockDailyTask = null;
  this.blockDailyStage = null;
  this.blockPlay = null;
  this.blockSkins = null;
  this.blockTrophie = null;
  this.btnLang = null;
};

var _SubMenu = SubMenu;

function SubMenu() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubMenu = _SubMenu;
