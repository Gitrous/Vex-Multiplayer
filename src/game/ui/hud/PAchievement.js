// ui/hud/PAchievement.js — recovered from webpack module #143 of the original vex7.min.js
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

exports.PAchievement = undefined;

var data_1 = require("../../data"),
  SubSceneList_1 = require("../../subscenes/SubSceneList"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  system_1 = require("../../system"),
  Achievements_1 = require("../../system/Achievements"),
  Localization_1 = require("../../system/Localization"),
  SoundManager_1 = require("../../system/SoundManager"),
  Helpers_1 = require("../../utils/Helpers");

_super = Phaser.GameObjects.Container;

__extends(PAchievement, _super);

PAchievement.prototype.changeLang = function () {
  this.txtNewAchive.setFont(data_1.Fonts.Main);
  this.txtNewAchive.text = this.currTxtTitle;
};

PAchievement.prototype.showAchievement = function (t, e) {
  this.achiList.push({ type: t, id: e });
  if (this.achiList.length === 1) {
    this.checkNext();
  }
};

PAchievement.prototype.hide = function () {
  this.visible = false;
  this.show = SubSceneList_1.Bool3.false;
};

PAchievement.prototype.update = function () {
  var t;
  if (this.visible !== false) {
    if (this.show === SubSceneList_1.Bool3.true) {
      t = this.showY - this.y;
      this.y += t / 10;
      if (t < 1) {
        this.show = SubSceneList_1.Bool3.none;
      }
    } else if (this.show === SubSceneList_1.Bool3.none) {
      this.counterWait += 1;
      if (this.counterWait >= this.durationWait) {
        this.show = SubSceneList_1.Bool3.false;
      }
    } else if (this.show === SubSceneList_1.Bool3.false && ((t = this.hideY - this.y), (this.y += t / 10), t > -1)) {
      this.achiList.shift();
      if (this.achiList.length === 0) {
        this.hide();
      } else {
        this.checkNext();
      }
    }
  }
};

PAchievement.prototype.checkNext = function () {
  this.counterWait = 0;
  this.visible = true;
  this.show = SubSceneList_1.Bool3.true;
  var t = this.achiList[0];
  this.imgSkinBg.visible = false;
  this.imgSkin.visible = false;
  this.imgTrophy.visible = true;
  if (t.type === "Act" || t.type === "ActHard") {
    this.imgTrophy.setTexture(data_1.Atlases.ui, "trophie" + t.type + " " + (1e4 + t.id));
    this.currTxtTitle = "newAchive";
  } else if (t.type === "Skin") {
    this.imgTrophy.visible = false;
    this.imgSkinBg.visible = true;
    this.imgSkin.visible = true;
    this.imgSkin.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(t.id));
    this.currTxtTitle = "newAchiveSkin";
  } else if (t.type === "award") {
    this.imgTrophy.setTexture(data_1.Atlases.ui, "trophie_" + t.id + " 10000");
    this.currTxtTitle = "trophieDes_" + t.id;
  }
  this.txtNewAchive.text = this.currTxtTitle;
  SoundManager_1.SoundManager.playSFX("achievementUnlocked");
};

PAchievement.prototype.resize = function () {
  var t = 85 * this.scaleY;
  this.showY = -data_1.Constants.UI_SHIFT_Y + t;
  this.hideY = -data_1.Constants.UI_SHIFT_Y - t;
  this.y = this.hideY;
};

var _PAchievement = PAchievement;

function PAchievement(t) {
  t = _super.call(this, t, data_1.Constants.GHW - 50, 0) || this;
  t.durationWait = 240;
  t.currTxtTitle = "";
  t.achiList = new Array();
  t.add(new Phaser.GameObjects.Image(t.scene, 0, 0, system_1.TexturesEdit.getPanelBgTexture(t.scene, 560, 140)));
  t.txtNewAchive = new jd_1.JDBmpdTextTranslated(t.scene, 47, 0, data_1.Fonts.Main, "newAchive", 30);
  t.txtNewAchive.setFitSize(420, JDTextFit_1.JDTextFitParam.wordWrap);
  t.add(t.txtNewAchive);
  t.imgSkinBg = new Phaser.GameObjects.Image(t.scene, -210, 0, data_1.Atlases.ui, "box_round 10000");
  t.imgSkinBg.scale = 0.7;
  t.add(t.imgSkinBg);
  t.imgSkinBg.visible = false;
  t.imgSkin = new jd_1.JDSpineGameObject(t.scene, -210, 0, "player", "stand");
  t.add(t.imgSkin.getView());
  t.imgSkin.scaleX = t.imgSkin.scaleY = 2;
  t.imgSkin.y = 10 + t.imgSkin.getView().height / 2;
  t.imgTrophy = new Phaser.GameObjects.Image(t.scene, -210, 0, data_1.Atlases.ui, "trophieAct 10000");
  t.add(t.imgTrophy);
  t.hide();
  t.scale = data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE;
  t.scene.events.on(Achievements_1.Achievements.EVENT_ACHIEVEMENT_COMPLETE, t.showAchievement, t);
  t.scene.events.on(Localization_1.Localization.EVENT_CHANGE_LANG, t.changeLang, t);
  return t;
}

exports.PAchievement = _PAchievement;
