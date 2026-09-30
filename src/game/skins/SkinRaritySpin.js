// skins/SkinRaritySpin.js — recovered from webpack module #211 of the original vex7.min.js
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

exports.SkinRaritySpin = undefined;

var data_1 = require("../data"),
  buttons_1 = require("../ui/buttons"),
  jd_1 = require("../jd"),
  SkinsData_1 = require("../system/SkinsData");

_super = require("./BasicSkinRarity").BasicSkinRarity;

__extends(SkinRaritySpin, _super);

SkinRaritySpin.prototype.updateProgress = function () {
  var t = SkinsData_1.SkinsData.getRaritySkinsAmount(this.rarity),
    e = SkinsData_1.SkinsData.getSkinOpened(this.rarity);
  this.progressMaskSc = e / t;
};

SkinRaritySpin.prototype.checkSpinAgain = function () {
  this.updateProgress();
  if (!(
    this.progressMaskSc === 1 ||
    (this.isSpinByMoney === true && SkinsData_1.SkinsData.enouthMoney(this.rarity) !== true)
  )) {
    this.enableBtnSpin(true, 1);
    this.subscene.scene.add.tween({ targets: this.btnSpin, duration: 400, scale: 1.05, loop: -1, yoyo: true });
  }
};

SkinRaritySpin.prototype.spin = function (t) {
  this.subscene.startChoosing(this.isSpinByMoney);
  this.updateSpinValues();
};

SkinRaritySpin.prototype.updateSpinValues = function () {
  this.enableBtnSpin(false, 0.5);
  if (this.isSpinByMoney === false) {
    if (SkinsData_1.SkinsData.hasSpinTokens(this.rarity) === false) {
      this.isSpinByMoney = true;
      this.btnSpin.icon.setFrame("coinSmall 10000");
      this.btnSpin.icon.y = 0;
      this.btnSpin.txt.text = "" + SkinsData_1.SkinsData.getPrice(this.rarity);
    } else {
      this.btnSpin.txt.text = "" + SkinsData_1.SkinsData.getSpinTokensAmount(this.rarity);
    }
  }
};

SkinRaritySpin.prototype.select = function (t) {
  this.setImgSkin(t);
};

SkinRaritySpin.prototype.enableBtnSpin = function (t, e) {
  if (
    this.btnSpin &&
    (this.subscene.scene.tweens.killTweensOf(this.btnSpin),
    (this.btnSpin.alpha = e),
    (this.btnSpin.image.input.enabled = t),
    (this.btnSpin.scale = 1),
    (this.btnSpin.image.tint = this.btnSpin.tintOut),
    t === true) &&
    this.btnSpin.image
      .getBounds()
      .contains(this.subscene.scene.input.activePointer.x, this.subscene.scene.input.activePointer.y) === true
  ) {
    this.btnSpin.image.tint = this.btnSpin.tintOver;
  }
};

SkinRaritySpin.prototype.destroy = function () {
  this.subscene.scene.tweens.killTweensOf(this.btnSpin);
  _super.prototype.destroy.call(this);
  this.btnSpin = null;
};

var _SkinRaritySpin = SkinRaritySpin;

function SkinRaritySpin(t, e, i, n, s, r, o) {
  var a,
    h = _super.call(this, t, e) || this,
    t = SkinsData_1.SkinsData.getRaritySkinsAmount(e);
  h.progressMaskSc = SkinsData_1.SkinsData.getSkinOpened(e) / t;
  if (h.progressMaskSc !== 1) {
    h.create(n, s, s, 600, i, "skinRarity" + e, o);
    h.btnSpin = new buttons_1.ButtonScale(h.subscene.scene, n, s + 185);
    h.btnSpin.addImageEvents(data_1.Atlases.ui, r, 0, 3);
    h.btnSpin.addTxtTranslated("spin", data_1.Fonts.Main, 34, 4737096);
    h.btnSpin.txtTranslated.setFitSize(200);
    t = undefined;
    r = h.btnSpin.y + 70;
    if (SkinsData_1.SkinsData.hasSpinTokens(e) === false) {
      if (SkinsData_1.SkinsData.enouthMoney(e) === false) {
        h.enableBtnSpin(false, 0.5);
      }
      (a = new Phaser.GameObjects.Image(
        h.subscene.scene,
        0,
        r,
        data_1.Atlases.ui,
        SkinsData_1.SkinsData.isTowerRarity(e) === false ? "coin 10000" : "coinTower 10000",
      )).scale = 0.9;
      h.subscene.add(a);
      t = new jd_1.JDBmpdText(
        h.subscene.scene,
        0,
        a.y,
        data_1.Fonts.Main,
        "" + SkinsData_1.SkinsData.getPrice(e),
        40,
        16777215,
        0,
      );
      h.subscene.add(t);
      h.btnSpin.onUp = function () {
        return h.spin(true);
      };
      h.isSpinByMoney = true;
    } else {
      a = new Phaser.GameObjects.Image(h.subscene.scene, 0, r, data_1.Atlases.ui, "star 1000" + e);
      h.subscene.add(a);
      t = new jd_1.JDBmpdText(
        h.subscene.scene,
        0,
        a.y,
        data_1.Fonts.Main,
        "" + SkinsData_1.SkinsData.getSpinTokensAmount(e),
        40,
        16777215,
        0,
      );
      h.subscene.add(t);
      h.btnSpin.onUp = function () {
        return h.spin(false);
      };
      h.isSpinByMoney = false;
    }
    h.subscene.add(h.btnSpin.getView());
    a.x = n - t.width / 2 - 15;
    t.x = a.x + 40;
  } else {
    h.create(n, s - 45, s, 550, i, "skinRarity" + e, o);
  }
  a = null;
  return h;
}

exports.SkinRaritySpin = _SkinRaritySpin;
