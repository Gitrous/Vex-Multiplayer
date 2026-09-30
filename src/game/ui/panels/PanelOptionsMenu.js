// ui/panels/PanelOptionsMenu.js — recovered from webpack module #124 of the original vex7.min.js
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

exports.PanelOptionsMenu = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  BalanceData_1 = require("../../system/BalanceData"),
  Localization_1 = require("../../system/Localization"),
  SaveGame_1 = require("../../system/SaveGame"),
  SoundManager_1 = require("../../system/SoundManager");

_super = BasicPanel_1.BasicPanel;

__extends(PanelOptionsMenu, _super);

PanelOptionsMenu.prototype.init = function () {
  var t = this,
    e = 480,
    i = -70;
  if (data_1.Constants.SHOW_NO_BLOOD_CHECKBOX === true) {
    e = 560;
    i = -105;
  }
  this.addBgTitleBtn(640, e, "settings", true, "close_settings_in_maimenu");
  this.btnSfx = new buttons_1.ButtonScale(this.scene, -160, i);
  this.btnSfx.addImageEvents(data_1.Atlases.ui, "btnPanelSmall 10000", 0, 5);
  this.btnSfx.addIcon(data_1.Atlases.ui, "iconSFX 10000");
  this.btnSfx.addIcon(data_1.Atlases.ui, "panelOnOff 10000");
  this.btnSfx.onUp = function () {
    return t.switchSfx();
  };
  this.add(this.btnSfx.getView());
  this.btnMusic = new buttons_1.ButtonScale(this.scene, 100, i);
  this.btnMusic.addImageEvents(data_1.Atlases.ui, "btnPanelSmall 10000", 0, 5);
  this.btnMusic.addIcon(data_1.Atlases.ui, "iconMusic 10000");
  this.btnMusic.addIcon(data_1.Atlases.ui, "panelOnOff 10000");
  this.btnMusic.onUp = function () {
    return t.switchMusic();
  };
  this.add(this.btnMusic.getView());
  this.txtSfx = new jd_1.JDBmpdTextTranslated(
    this.scene,
    this.btnSfx.x + 60,
    this.btnSfx.y,
    data_1.Fonts.Main,
    "",
    34,
    15196527,
    0,
  );
  this.txtSfx.setFitSize(130);
  this.add(this.txtSfx);
  this.txtMusic = new jd_1.JDBmpdTextTranslated(
    this.scene,
    this.btnMusic.x + 60,
    this.btnMusic.y,
    data_1.Fonts.Main,
    "",
    34,
    15196527,
    0,
  );
  this.txtMusic.setFitSize(130);
  this.add(this.txtMusic);
  this.txtAutoRestart = new jd_1.JDBmpdTextTranslated(
    this.scene,
    -180,
    i + 120,
    data_1.Fonts.Main,
    "autoRestart",
    32,
    16777215,
    0,
  );
  this.txtAutoRestart.setFitSize(460, JDTextFit_1.JDTextFitParam.both, 80);
  this.add(this.txtAutoRestart);
  this.btnCheckRestart = new buttons_1.ButtonScale(this.scene, this.txtAutoRestart.x - 50, this.txtAutoRestart.y);
  this.btnCheckRestart.addImageEvents(data_1.Atlases.ui, "checkbox 10000");
  this.btnCheckRestart.onUp = function () {
    return t.switchAutoRestart();
  };
  this.add(this.btnCheckRestart.getView());
  this.txtAutoReset = new jd_1.JDBmpdTextTranslated(
    this.scene,
    -180,
    this.txtAutoRestart.y + 100,
    data_1.Fonts.Main,
    "autoReset",
    32,
    16777215,
    0,
  );
  this.txtAutoReset.setFitSize(460, JDTextFit_1.JDTextFitParam.both, 80);
  this.txtAutoReset.toUpperCase();
  this.add(this.txtAutoReset);
  this.btnCheckReset = new buttons_1.ButtonScale(this.scene, this.txtAutoReset.x - 50, this.txtAutoReset.y);
  this.btnCheckReset.addImageEvents(data_1.Atlases.ui, "checkbox 10000");
  this.btnCheckReset.onUp = function () {
    return t.switchAutoReset();
  };
  this.add(this.btnCheckReset.getView());
  if (data_1.Constants.SHOW_NO_BLOOD_CHECKBOX === true) {
    this.txtNoBlood = new jd_1.JDBmpdTextTranslated(
      this.scene,
      -180,
      this.txtAutoReset.y + 100,
      data_1.Fonts.Main,
      "noBlood",
      32,
      16777215,
      0,
    );
    this.txtNoBlood.setFitSize(500, JDTextFit_1.JDTextFitParam.wordWrap);
    this.add(this.txtNoBlood);
    this.btnNoBlood = new buttons_1.ButtonScale(this.scene, this.txtNoBlood.x - 50, this.txtNoBlood.y);
    this.btnNoBlood.addImageEvents(data_1.Atlases.ui, "checkbox 10000");
    this.btnNoBlood.onUp = function () {
      return t.switchNoBlood();
    };
    this.add(this.btnNoBlood.getView());
  }
  this.scene.events.on(Localization_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
};

PanelOptionsMenu.prototype.changeLang = function () {
  this.txtTitle.setFont(data_1.Fonts.Main);
  this.txtTitle.text = "settings";
  this.txtAutoReset.setFont(data_1.Fonts.Main);
  this.txtAutoReset.text = "autoReset";
  this.txtAutoReset.toUpperCase();
  this.txtAutoRestart.setFont(data_1.Fonts.Main);
  this.txtAutoRestart.text = "autoRestart";
  if (this.txtNoBlood) {
    this.txtNoBlood.setFont(data_1.Fonts.Main);
    this.txtNoBlood.text = "noBlood";
  }
  this.txtMusic.setFont(data_1.Fonts.Main);
  this.txtSfx.setFont(data_1.Fonts.Main);
};

PanelOptionsMenu.prototype.show = function () {
  _super.prototype.show.call(this);
  this.setFrameSfx();
  this.setFrameMusic();
  this.setFrameAutoReset();
  this.setFrameAutoRestart();
  this.setFrameNoBlood();
  this.scene.pauseWorld();
};

PanelOptionsMenu.prototype.hide = function () {
  _super.prototype.hide.call(this);
  this.scene.resumeMenu();
};

PanelOptionsMenu.prototype.switchSfx = function () {
  SoundManager_1.SoundManager.setEnabled(SoundManager_1.SoundType.SFX);
  this.setFrameSfx();
};

PanelOptionsMenu.prototype.setFrameSfx = function () {
  if (BalanceData_1.BalanceData.mutedSfx === true) {
    this.btnSfx.icon.setFrame("panelOnOff 10001");
    this.txtSfx.text = "off";
  } else {
    this.btnSfx.icon.setFrame("panelOnOff 10000");
    this.txtSfx.text = "on";
  }
};

PanelOptionsMenu.prototype.switchMusic = function () {
  SoundManager_1.SoundManager.setEnabled(SoundManager_1.SoundType.Music);
  this.setFrameMusic();
};

PanelOptionsMenu.prototype.setFrameMusic = function () {
  if (BalanceData_1.BalanceData.mutedMusic === true) {
    this.btnMusic.icon.setFrame("panelOnOff 10001");
    this.txtMusic.text = "off";
  } else {
    this.btnMusic.icon.setFrame("panelOnOff 10000");
    this.txtMusic.text = "on";
  }
};

PanelOptionsMenu.prototype.switchAutoRestart = function () {
  BalanceData_1.BalanceData.autoRestart = !BalanceData_1.BalanceData.autoRestart;
  this.setFrameAutoRestart();
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

PanelOptionsMenu.prototype.setFrameAutoRestart = function () {
  this.btnCheckRestart.image.setFrame(
    BalanceData_1.BalanceData.autoRestart === false ? "checkbox 10000" : "checkbox 10001",
  );
};

PanelOptionsMenu.prototype.switchAutoReset = function () {
  BalanceData_1.BalanceData.autoReset = !BalanceData_1.BalanceData.autoReset;
  this.setFrameAutoReset();
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

PanelOptionsMenu.prototype.setFrameAutoReset = function () {
  this.btnCheckReset.image.setFrame(
    BalanceData_1.BalanceData.autoReset === false ? "checkbox 10000" : "checkbox 10001",
  );
};

PanelOptionsMenu.prototype.switchNoBlood = function () {
  BalanceData_1.BalanceData.noBlood = !BalanceData_1.BalanceData.noBlood;
  this.setFrameNoBlood();
  SaveGame_1.SaveGame.getInstance().saveProgress();
  this.txtAutoRestart.setFont(data_1.Fonts.Main);
  this.txtAutoRestart.text = "autoRestart";
};

PanelOptionsMenu.prototype.setFrameNoBlood = function () {
  if (this.btnNoBlood) {
    this.btnNoBlood.image.setFrame(BalanceData_1.BalanceData.noBlood === false ? "checkbox 10000" : "checkbox 10001");
  }
};

PanelOptionsMenu.prototype.destroy = function () {
  this.scene.events.off(Localization_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
  _super.prototype.destroy.call(this);
  this.btnMusic = null;
  this.btnSfx = null;
  this.txtMusic = null;
  this.txtSfx = null;
  this.btnCheckReset = null;
  this.txtAutoReset = null;
  this.btnCheckRestart = null;
  this.txtAutoRestart = null;
  this.btnNoBlood = null;
  this.txtNoBlood = null;
};

var _PanelOptionsMenu = PanelOptionsMenu;

function PanelOptionsMenu() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelOptionsMenu = _PanelOptionsMenu;
