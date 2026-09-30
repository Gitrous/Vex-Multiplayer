// ui/panels/PanelAreYouOk.js — recovered from webpack module #132 of the original vex7.min.js
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

exports.PanelAreYouOk = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  AzerionSDK_1 = require("../../sdk/AzerionSDK");

_super = BasicPanel_1.BasicPanel;

__extends(PanelAreYouOk, _super);

PanelAreYouOk.prototype.init = function () {
  var t = this;
  this.addBgTitleBtn(740, 220, "youOk", false);
  var e = new buttons_1.ButtonScale(this.scene, -170, 40);
  e.addImageEvents(data_1.Atlases.ui, "btn_red 10000", 0, 5, 1.1, 1.3);
  e.addTxtTranslated("no", data_1.Fonts.Main, 40, 4737096);
  e.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_no_death_popup", function () {
      return t.sayNo();
    });
  };
  this.add(e.getView());
  (e = new buttons_1.ButtonScale(this.scene, 170, e.y)).addImageEvents(
    data_1.Atlases.ui,
    "btn_green 10000",
    0,
    5,
    1.1,
    1.3,
  );
  e.addTxtTranslated("yes", data_1.Fonts.Main, 40, 4737096);
  e.onUp = function () {
    return AzerionSDK_1.AzerionSDK.showAD("click_yes_death_popup", function () {
      return t.close();
    });
  };
  this.add(e.getView());
};

PanelAreYouOk.prototype.show = function () {
  _super.prototype.show.call(this);
  this.scene.pauseWorld();
};

PanelAreYouOk.prototype.sayNo = function () {
  this.scene.player.addShield();
  this.close();
};

PanelAreYouOk.prototype.close = function () {
  this.scene.panelManager.hideCurrent();
  this.scene.resumeWorld();
};

PanelAreYouOk.prototype.clikcOnBlack = function () {};

var _PanelAreYouOk = PanelAreYouOk;

function PanelAreYouOk() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelAreYouOk = _PanelAreYouOk;
