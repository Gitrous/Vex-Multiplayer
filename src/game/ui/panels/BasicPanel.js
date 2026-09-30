// ui/panels/BasicPanel.js — recovered from webpack module #16 of the original vex7.min.js
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

exports.BasicPanel = undefined;

var system_1 = require("../../system"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK");

_super = Phaser.GameObjects.Container;

__extends(BasicPanel, _super);

BasicPanel.prototype.init = function (t) {};

BasicPanel.prototype.clikcOnBlack = function () {
  this.scene.panelManager.hideCurrent();
};

BasicPanel.prototype.show = function () {
  this.visible = true;
};

BasicPanel.prototype.hide = function () {
  this.visible = false;
};

BasicPanel.prototype.resize = function () {
  this.scale = data_1.Constants.UI_ADDITIONAL_PANELS_SCALE;
};

BasicPanel.prototype.update = function () {};

BasicPanel.prototype.custom = function (t) {};

BasicPanel.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.scene = null;
  this.txtTitle = null;
};

BasicPanel.prototype.addBg = function (t, e, i, n) {
  t = new Phaser.GameObjects.Image(this.scene, t, e, system_1.TexturesEdit.getPanelBgTexture(this.scene, i, n));
  this.add(t);
  return t;
};

BasicPanel.prototype.addBgTitle = function (t, e, i, n) {
  t = new Phaser.GameObjects.Image(this.scene, t, e, data_1.Atlases.gameplay, "whiteBlock 10000");
  t.setTint(4950515, 180474, 4950515, 180474);
  t.setDisplaySize(i - 14, n);
  this.add(t);
  return t;
};

BasicPanel.prototype.addBgTitleBtn = function (t, e, i, n, s) {
  var r = this;
  if (n === undefined) {
    n = true;
  }
  if (s === undefined) {
    s = null;
  }
  var o = t / 2,
    a = e / 2;
  this.addBg(0, 0, t, e).setInteractive();
  var e = 40 - a + 7;
  this.addBgTitle(0, e, t, 80);
  this.txtTitle = new jd_1.JDBmpdTextTranslated(this.scene, 0, e - 3, data_1.Fonts.Main, i, 58);
  this.txtTitle.setFitSize(t - 100);
  this.add(this.txtTitle);
  if (n === true) {
    (e = new buttons_1.ButtonScaleImage(this.scene, o - 15, 15 - a, data_1.Atlases.ui, "btnX 10000")).onUp = s
      ? function () {
          return AzerionSDK_1.AzerionSDK.showAD(s, function () {
            return r.clikcOnBlack();
          });
        }
      : function () {
          return r.clikcOnBlack();
        };
    this.add(e.getView());
  }
};

var _BasicPanel = BasicPanel;

function BasicPanel(t) {
  return _super.call(this, t, data_1.Constants.GHW, data_1.Constants.GHH) || this;
}

exports.BasicPanel = _BasicPanel;
