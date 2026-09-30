// ui/panels/PanelLanguages.js — recovered from webpack module #133 of the original vex7.min.js
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

exports.PanelLanguages = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  system_1 = require("../../system");

_super = BasicPanel_1.BasicPanel;

__extends(PanelLanguages, _super);

PanelLanguages.prototype.init = function () {
  var i,
    n = this;
  this.addBgTitleBtn(640, 640, "lang");
  this.langs = {};
  for (var s = this, t = 0; t < data_1.Constants.AVAILABLE_LANGUAGES.length; t++)
    !(function (t) {
      var e = data_1.Constants.AVAILABLE_LANGUAGES[t];
      (i = new buttons_1.ButtonScaleImage(s.scene, 0, 0, data_1.Atlases.ui, "flag_" + e + " 10000")).onUp =
        function () {
          return n.changeLang(e);
        };
      s.add(i.getView());
      s.langs[e] = i;
    })(t);
  i = null;
};

PanelLanguages.prototype.changeLang = function (t) {
  system_1.Localization.setLng(t);
  this.txtTitle.setFont(data_1.Fonts.Main);
  this.scene.events.emit(system_1.Localization.EVENT_CHANGE_LANG);
  this.scene.panelManager.hideCurrent();
};

PanelLanguages.prototype.show = function () {
  _super.prototype.show.call(this);
  for (
    var t = -180, e = -130, i = system_1.Localization.getLang(), n = 1, s = 0, r = data_1.Constants.AVAILABLE_LANGUAGES;
    s < r.length;
    s++
  ) {
    var o = r[s];
    if (o !== i) {
      this.langs[o].visible = true;
      this.langs[o].x = t;
      this.langs[o].y = e;
      e += 115;
      if (n % 4 == 0) {
        e = -130;
        t += 180;
      }
      n += 1;
    } else {
      this.langs[o].visible = false;
    }
  }
  this.txtTitle.text = "language";
};

PanelLanguages.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.langs = null;
  this.txtTitle = null;
};

var _PanelLanguages = PanelLanguages;

function PanelLanguages() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelLanguages = _PanelLanguages;
