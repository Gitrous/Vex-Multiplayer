// ui/panels/PanelLevelObjectives.js — recovered from webpack module #130 of the original vex7.min.js
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

exports.PanelLevelObjectives = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  Helpers_1 = require("../../utils/Helpers"),
  JDTextFit_1 = require("../../jd/JDTextFit");

_super = BasicPanel_1.BasicPanel;

__extends(PanelLevelObjectives, _super);

PanelLevelObjectives.prototype.init = function () {
  var t = this;
  this.addBgTitleBtn(740, 700, "lvlObj", false);
  var e = new buttons_1.ButtonScale(this.scene, 0, 270);
  e.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 5, 1.1, 1.3);
  e.addTxtTranslated("play", data_1.Fonts.Main, 40, 4737096);
  e.onUp = function () {
    return t.play();
  };
  this.add(e.getView());
  this.addTarget(-300, -170, Helpers_1.Helpers.getLevelTargetText(1, 0), this.scene.isTargetLevelComplete());
  this.addTarget(
    -300,
    -30,
    Helpers_1.Helpers.getLevelTargetText(2, this.scene.getTargetCoins()),
    this.scene.isTargetCoinsComplete(),
  );
  this.addTarget(
    -300,
    110,
    Helpers_1.Helpers.getLevelTargetText(3, this.scene.getTargetDeath()),
    this.scene.isTargetDeathComplete(),
  );
  e = null;
  if (data_1.Constants.IS_MOBILE === false) {
    this.scene.input.keyboard.on("keydown", this.onKeyDown, this);
  }
};

PanelLevelObjectives.prototype.onKeyDown = function (t) {
  if (!(
    this.visible === false ||
    ((t = t.keyCode) !== Phaser.Input.Keyboard.KeyCodes.A &&
      t !== Phaser.Input.Keyboard.KeyCodes.LEFT &&
      t !== Phaser.Input.Keyboard.KeyCodes.D &&
      t !== Phaser.Input.Keyboard.KeyCodes.RIGHT &&
      t !== Phaser.Input.Keyboard.KeyCodes.W &&
      t !== Phaser.Input.Keyboard.KeyCodes.UP &&
      t !== Phaser.Input.Keyboard.KeyCodes.S &&
      t !== Phaser.Input.Keyboard.KeyCodes.DOWN &&
      t !== Phaser.Input.Keyboard.KeyCodes.SPACE &&
      t !== Phaser.Input.Keyboard.KeyCodes.ENTER)
  )) {
    this.play();
  }
};

PanelLevelObjectives.prototype.addTarget = function (t, e, i, n) {
  var s = new Phaser.GameObjects.Image(this.scene, 0, e, data_1.Atlases.gameplay, "whiteBlock 10000");
  s.tint = 3441150;
  s.setDisplaySize(650, 100);
  this.add(s);
  s = new Phaser.GameObjects.Image(this.scene, -t - 25, e, data_1.Atlases.ui, "checkbox 1000" + n);
  this.add(s);
  var n = new jd_1.JDBmpdTextFit(this.scene, t, e, data_1.Fonts.Main, i, 40, 16777215, 0);
  n.setFitSize(450, JDTextFit_1.JDTextFitParam.both, 100);
  this.add(n);
  s = null;
};

PanelLevelObjectives.prototype.show = function () {
  _super.prototype.show.call(this);
  this.scene.pauseWorld();
};

PanelLevelObjectives.prototype.play = function () {
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
};

PanelLevelObjectives.prototype.clikcOnBlack = function () {
  this.play();
};

PanelLevelObjectives.prototype.destroy = function () {
  this.scene.input.keyboard.off("keydown", this.onKeyDown, this);
  _super.prototype.destroy.call(this);
};

PanelLevelObjectives.prototype.addBgTitleBtn = function (t, e, i, n) {
  var s = this;
  if (n === undefined) {
    n = true;
  }
  var r = t / 2,
    e = e / 2;
  this.addBg(0, 0, t, 760).setInteractive().scaleY = 0.92;
  var o = 40 - e + 7;
  this.addBgTitle(0, o, t, 80);
  this.txtTitle = new jd_1.JDBmpdTextTranslated(this.scene, 0, o - 3, data_1.Fonts.Main, i, 58);
  this.add(this.txtTitle);
  if (n === true) {
    (t = new buttons_1.ButtonScaleImage(this.scene, r - 15, 15 - e, data_1.Atlases.ui, "btnX 10000")).onUp =
      function () {
        return s.clikcOnBlack();
      };
    this.add(t.getView());
  }
};

var _PanelLevelObjectives = PanelLevelObjectives;

function PanelLevelObjectives() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelLevelObjectives = _PanelLevelObjectives;
