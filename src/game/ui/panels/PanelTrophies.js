// ui/panels/PanelTrophies.js — recovered from webpack module #126 of the original vex7.min.js
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

exports.PanelTrophies = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  system_1 = require("../../system"),
  jd_1 = require("../../jd"),
  buttons_1 = require("../buttons"),
  Achievements_1 = require("../../system/Achievements");

_super = BasicPanel_1.BasicPanel;

__extends(PanelTrophies, _super);

PanelTrophies.prototype.init = function () {
  this.addBgTitleBtn(1200, 800, "trophies", true, "close_trophies");
  var t = new Phaser.GameObjects.Graphics(this.scene);
  this.add(t);
  t.fillStyle(3441150);
  t.fillRoundedRect(-585, -200, 1170, 585, { tl: 0, tr: 0, bl: 15, br: 15 });
  this.buttonsTab = new Array(3);
  this.titleActs = this.createTabTitle(0, -390, "trophieActs");
  this.titleTower = this.createTabTitle(1, 0, "trophieTower");
  this.titleAchive = this.createTabTitle(2, 390, "trophieAchive");
  this.tabs = new Array();
  this.createTabActs();
  this.createTabTower();
  this.createTabAchive();
  this.txtDescription = new jd_1.JDBmpdTextFit(this.scene, 0, 345, data_1.Fonts.Main, "", 40);
  this.txtDescription.setFitSize(1050);
  this.add(this.txtDescription);
  this.hideDescription();
  this.scene.events.on(system_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
};

PanelTrophies.prototype.showTab = function (t) {
  for (var e = 0; e < this.buttonsTab.length; e++) {
    if (e === t) {
      this.buttonsTab[e].getView().tint = 3441150;
      this.buttonsTab[e].setInteraction(false);
      this.tabs[e].visible = true;
    } else {
      this.buttonsTab[e].setInteraction(true);
      this.buttonsTab[e].inputOut();
      this.tabs[e].visible = false;
    }
  }
};

PanelTrophies.prototype.createTabTitle = function (t, e, i) {
  var n = this,
    e = new buttons_1.ButtonImage(this.scene, e, -230, "texTrophieTab");
  e.setTintInteractive(1926874, 1461670);
  this.add(e.getView());
  e.onUp = function () {
    return n.showTab(t);
  };
  this.buttonsTab[t] = e;
  var e = new jd_1.JDBmpdTextTranslated(this.scene, e.x, e.y, data_1.Fonts.Main, i, 40);
  this.add(e);
  return e;
};

PanelTrophies.prototype.createTabActs = function () {
  var i = this,
    n = new Phaser.GameObjects.Container(this.scene);
  this.add(n);
  this.tabs.push(n);
  var s,
    r = -480;
  this.txtActStandarts = new jd_1.JDBmpdTextTranslated(
    this.scene,
    -520,
    -110,
    data_1.Fonts.Main,
    "trophieStandart",
    40,
    16777215,
    0,
  );
  n.add(this.txtActStandarts);
  this.txtActHard = new jd_1.JDBmpdTextTranslated(
    this.scene,
    -520,
    145,
    data_1.Fonts.Main,
    "trophieHard",
    40,
    16777215,
    0,
  );
  n.add(this.txtActHard);
  for (var o = this, t = 1; t < system_1.BalanceData.totalActs; t++)
    !(function (t) {
      var e = 0;
      if (system_1.Achievements.isCompletedAct(t, false) === true) {
        e = t;
      }
      s = new Phaser.GameObjects.Image(o.scene, r, 0, data_1.Atlases.ui, "trophieAct " + (1e4 + e));
      n.add(s);
      s.setInteractive();
      s.on(
        Phaser.Input.Events.POINTER_OVER,
        function () {
          return i.showDescriptionActs("Act", t);
        },
        o,
      );
      s.on(Phaser.Input.Events.POINTER_OUT, o.hideDescription, o);
      if (!(e = 0) === system_1.Achievements.isCompletedAct(t, true)) {
        e = t;
      }
      s = new Phaser.GameObjects.Image(o.scene, r, 250, data_1.Atlases.ui, "trophieActHard " + (1e4 + e));
      n.add(s);
      s.setInteractive();
      s.on(
        Phaser.Input.Events.POINTER_OVER,
        function () {
          return i.showDescriptionActs("ActHard", t);
        },
        o,
      );
      s.on(Phaser.Input.Events.POINTER_OUT, o.hideDescription, o);
      r += 120;
    })(t);
  n = s = null;
};

PanelTrophies.prototype.createTabTower = function () {
  var i = this,
    n = new Phaser.GameObjects.Container(this.scene);
  this.add(n);
  this.tabs.push(n);
  for (var s, r = -200, o = 0, a = Object.keys(Achievements_1.TrophieTower), h = this, t = 0; t < a.length; t++)
    !(function (t) {
      var e = Achievements_1.TrophieTower[a[t]];
      s =
        system_1.Achievements.isAchieveCompleted(e) === false
          ? new Phaser.GameObjects.Image(h.scene, r, o, data_1.Atlases.ui, "trophieAct 10000")
          : new Phaser.GameObjects.Image(h.scene, r, o, data_1.Atlases.ui, "trophie_" + e + " 10000");
      n.add(s);
      s.setInteractive();
      s.on(
        Phaser.Input.Events.POINTER_OVER,
        function () {
          return i.showDescription(e);
        },
        h,
      );
      s.on(Phaser.Input.Events.POINTER_OUT, h.hideDescription, h);
      r += 200;
      if ((t + 1) % 3 == 0) {
        r = -200;
        o += 230;
      }
    })(t);
  n = s = null;
};

PanelTrophies.prototype.createTabAchive = function () {
  var i = this,
    n = new Phaser.GameObjects.Container(this.scene);
  this.add(n);
  this.tabs.push(n);
  for (var s, r = -360, o = 0, a = Object.keys(Achievements_1.TrophieAchieves), h = this, t = 0; t < a.length; t++)
    !(function (t) {
      var e = Achievements_1.TrophieAchieves[a[t]];
      s =
        system_1.Achievements.isAchieveCompleted(e) === false
          ? new Phaser.GameObjects.Image(h.scene, r, o, data_1.Atlases.ui, "trophieAct 10000")
          : new Phaser.GameObjects.Image(h.scene, r, o, data_1.Atlases.ui, "trophie_" + e + " 10000");
      n.add(s);
      s.setInteractive();
      s.on(
        Phaser.Input.Events.POINTER_OVER,
        function () {
          return i.showDescription(e);
        },
        h,
      );
      s.on(Phaser.Input.Events.POINTER_OUT, h.hideDescription, h);
      r += 180;
      if ((t + 1) % 5 == 0) {
        r = -360;
        o += 230;
      }
    })(t);
  n = s = null;
};

PanelTrophies.prototype.changeLang = function () {
  this.txtTitle.setFont(data_1.Fonts.Main);
  this.txtTitle.text = "trophies";
  this.titleActs.setFont(data_1.Fonts.Main);
  this.titleActs.text = "trophieActs";
  this.txtActStandarts.setFont(data_1.Fonts.Main);
  this.txtActStandarts.text = "trophieStandart";
  this.txtActHard.setFont(data_1.Fonts.Main);
  this.txtActHard.text = "trophieHard";
  this.titleTower.setFont(data_1.Fonts.Main);
  this.titleTower.text = "trophieTower";
  this.titleAchive.setFont(data_1.Fonts.Main);
  this.titleAchive.text = "trophieAchive";
  this.txtDescription.setFont(data_1.Fonts.Main);
};

PanelTrophies.prototype.showDescriptionActs = function (t, e) {
  this.txtDescription.visible = true;
  this.txtDescription.text = system_1.Localization.getText("trophieDes" + t).replace("<x>", "" + e);
};

PanelTrophies.prototype.showDescription = function (t) {
  this.txtDescription.visible = true;
  this.txtDescription.text = system_1.Localization.getText("trophieDes_" + t);
};

PanelTrophies.prototype.hideDescription = function () {
  this.txtDescription.visible = false;
};

PanelTrophies.prototype.show = function () {
  _super.prototype.show.call(this);
  this.showTab(0);
};

PanelTrophies.prototype.hide = function () {
  _super.prototype.hide.call(this);
  this.scene.resumeMenu();
};

PanelTrophies.prototype.destroy = function () {
  this.scene.events.off(system_1.Localization.EVENT_CHANGE_LANG, this.changeLang, this);
  _super.prototype.destroy.call(this);
  this.buttonsTab = null;
  this.tabs = null;
  this.titleActs = null;
  this.txtActStandarts = null;
  this.txtActHard = null;
  this.titleTower = null;
  this.titleAchive = null;
  this.txtDescription = null;
};

var _PanelTrophies = PanelTrophies;

function PanelTrophies() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelTrophies = _PanelTrophies;
