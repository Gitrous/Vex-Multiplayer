// entities/AppearingText.js — recovered from webpack module #62 of the original vex7.min.js
"use strict";

var n,
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

exports.AppearingText = undefined;

var r,
  _super,
  jd_1 = require("../jd"),
  data_1 = require("../data"),
  Localization_1 = require("../system/Localization"),
  JDTextFit_1 = require("../jd/JDTextFit");

(_tmp = r = r || {})[(_tmp.checkPoint = 0)] = "checkPoint";

_tmp[(_tmp.downEndter = 1)] = "downEndter";

_tmp[(_tmp.death = 2)] = "death";

_super = jd_1.JDBmpdTextFit;

__extends(AppearingText, _super);

AppearingText.prototype.show = function (t, e, i) {
  this.xPos = t;
  this.yPos = e;
  this.x = t;
  this.y = e;
  this.currText = i;
  this.visible = true;
  this.alpha = 1;
  this.alive = true;
  if (i === "checkpoint") {
    this.setFitSize(0);
    this.setColor(56396);
    this.scale = 1;
    this.currType = r.checkPoint;
    this.displayTime = 60;
    this.moveDist = 0;
  } else if (i === "pressDownEnter") {
    this.setColor(0);
    this.displayTime = 60;
    this.scale = 1;
    this.setFitSize(200, JDTextFit_1.JDTextFitParam.both, 70);
    this.currType = r.downEndter;
    this.visible = false;
  } else {
    this.setFitSize(0);
    this.setColor(16711680);
    this.scale = this.scaleXY = 0.75;
    this.currType = r.death;
  }
  this.changeLang();
};

AppearingText.prototype.changeLang = function () {
  if (this.currText) {
    this.setFont(data_1.Fonts.Main);
    this.setText(Localization_1.Localization.getText(this.currText));
  }
};

AppearingText.prototype.isPressDown = function () {
  return this.alive === true && this.currType === r.downEndter;
};

AppearingText.prototype.hide = function () {
  this.alive = false;
  this.visible = false;
};

AppearingText.prototype.update = function () {
  if (this.alive !== false) {
    if (this.currType === r.checkPoint) {
      if (this.moveDist > -30) {
        this.moveDist -= 2;
      }
      this.y = this.yPos + this.moveDist;
      --this.displayTime;
      if (this.displayTime <= 0) {
        this.hide();
      }
    } else if (this.currType === r.death) {
      if (this.scaleXY < 1.2) {
        this.scaleXY -= 0.03 * (this.scaleXY - 1.2);
        if (1.2 - this.scaleXY < 0.01) {
          this.scaleXY = 1.2;
        }
        this.scale = this.scaleXY;
      } else {
        this.alpha -= 0.075 * this.alpha;
        if (this.alpha <= 0.02) {
          this.hide();
        }
      }
      this.yPos -= 0.5;
      this.y = this.yPos;
    } else if (
      this.currType === r.downEndter &&
      ((this.x = this.scene.player.xPos), (this.y = this.yPos), --this.displayTime, this.displayTime <= 0)
    ) {
      this.visible = !this.visible;
      this.displayTime = 30;
    }
  }
};

var _tmp = AppearingText;

function AppearingText(t, e) {
  t = _super.call(this, t, 0, 0, data_1.Fonts.TutDeath, "", 20, 16711680) || this;
  t.visible = false;
  t.alive = false;
  e.add(t);
  return t;
}

exports.AppearingText = _tmp;
