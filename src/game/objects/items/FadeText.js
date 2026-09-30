// objects/items/FadeText.js — recovered from webpack module #227 of the original vex7.min.js
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

exports.FadeText = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  JDTextFit_1 = require("../../jd/JDTextFit"),
  Localization_1 = require("../../system/Localization");

_super = require("./BasicFade").BasicFade;

__extends(FadeText, _super);

FadeText.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, t);
  this.sprite.setColor(Number("0x" + t.color));
  var e = "tf" + this.id;
  if (!(data_1.Constants.IS_MOBILE !== true || (this.id !== 13 && this.id !== 44 && this.id !== 47))) {
    e += "Mob";
  }
  this.sprite.charColors = [];
  this.sprite.setText(Localization_1.Localization.getText(e));
  this.sprite.setFitSize(t.width, JDTextFit_1.JDTextFitParam.both, t.height);
};

FadeText.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.sprite = null;
};

var _FadeText = FadeText;

function FadeText(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new jd_1.JDBmpdTextFit(t, 0, 0, data_1.Fonts.TutDeath, "", 20);
  e.add(i.sprite);
  i.sprite.visible = false;
  return i;
}

exports.FadeText = _FadeText;
