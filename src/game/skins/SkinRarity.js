// skins/SkinRarity.js — recovered from webpack module #210 of the original vex7.min.js
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

exports.SkinRarity = undefined;

var data_1 = require("../data"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  buttons_1 = require("../ui/buttons"),
  jd_1 = require("../jd"),
  JDTextFit_1 = require("../jd/JDTextFit"),
  system_1 = require("../system"),
  SkinsData_1 = require("../system/SkinsData");

_super = require("./BasicSkinRarity").BasicSkinRarity;

__extends(SkinRarity, _super);

SkinRarity.prototype.spin = function (t) {
  this.subscene.scene.showSubScene(SubSceneList_1.SubSceneList.SkinsSelect, {
    id: this.rarity,
    spinFrame: this.spinFrame,
    tittleColor: this.titleColor,
    spin: t,
  });
};

SkinRarity.prototype.destroy = function () {
  this.subscene.scene.tweens.killTweensOf(this.btnSpin);
  _super.prototype.destroy.call(this);
  this.btnSpin = null;
  this.txtEquipped = null;
};

var _SkinRarity = SkinRarity;

function SkinRarity(t, e, i, n, s, r) {
  var o,
    a,
    h = _super.call(this, t, e) || this;
  h.spinFrame = s;
  h.titleColor = r;
  var t = SkinsData_1.SkinsData.skinRareIDs[e],
    l = SkinsData_1.SkinsData.getSkinIndex(e, system_1.BalanceData.currSkin);
  if (l >= 0) {
    t = system_1.BalanceData.currSkin;
  }
  h.create(i, n, n + 10, 600, t, "skinRarity" + e, r);
  if (l >= 0) {
    h.imgSkin.play("run", true);
    h.txtEquipped = new jd_1.JDBmpdTextTranslated(
      h.subscene.scene,
      i,
      n - 200,
      data_1.Fonts.Main,
      "equipped",
      30,
      9823743,
    );
    h.txtEquipped.setFitSize(280);
    h.subscene.add(h.txtEquipped);
  }
  (t = new buttons_1.ButtonScale(h.subscene.scene, i, n + 180)).addImageEvents(
    data_1.Atlases.ui,
    "btn_yellow 10000",
    0,
    3,
  );
  t.addTxtTranslated("chooseSkin", data_1.Fonts.Main, 34, 4737096);
  t.txtTranslated.setFitSize(200, JDTextFit_1.JDTextFitParam.both, 60);
  t.onUp = function () {
    return h.subscene.scene.showSubScene(SubSceneList_1.SubSceneList.SkinsSelect, {
      id: e,
      spinFrame: s,
      titleColor: r,
    });
  };
  h.subscene.add(t.getView());
  var t = null,
    l = SkinsData_1.SkinsData.getRaritySkinsAmount(e);
  if (SkinsData_1.SkinsData.getSkinOpened(e) / l != 1) {
    h.btnSpin = new buttons_1.ButtonScale(h.subscene.scene, i, n + 380);
    h.btnSpin.addImageEvents(data_1.Atlases.ui, s, 0, 3);
    h.btnSpin.addTxtTranslated("spin", data_1.Fonts.Main, 34, 4737096);
    h.btnSpin.txtTranslated.setFitSize(200);
    h.subscene.add(h.btnSpin.getView());
    t = h.btnSpin.y + 70;
    if (SkinsData_1.SkinsData.hasSpinTokens(e) === false) {
      if (SkinsData_1.SkinsData.enouthMoney(e) === false) {
        h.btnSpin.alpha = 0.5;
        h.btnSpin.image.input.enabled = false;
      }
      (o = new Phaser.GameObjects.Image(
        h.subscene.scene,
        0,
        t,
        data_1.Atlases.ui,
        SkinsData_1.SkinsData.isTowerRarity(e) === false ? "coin 10000" : "coinTower 10000",
      )).scale = 0.9;
      h.subscene.add(o);
      a = new jd_1.JDBmpdText(
        h.subscene.scene,
        0,
        o.y,
        data_1.Fonts.Main,
        "" + SkinsData_1.SkinsData.getPrice(e),
        40,
        4737096,
        0,
      );
      h.subscene.add(a);
      h.btnSpin.onUp = function () {
        return h.spin(true);
      };
    } else {
      o = new Phaser.GameObjects.Image(h.subscene.scene, 0, t, data_1.Atlases.ui, "star 1000" + e);
      h.subscene.add(o);
      a = new jd_1.JDBmpdText(
        h.subscene.scene,
        0,
        o.y,
        data_1.Fonts.Main,
        "" + SkinsData_1.SkinsData.getSpinTokensAmount(e),
        40,
        4737096,
        0,
      );
      h.subscene.add(a);
      h.btnSpin.onUp = function () {
        return h.spin(false);
      };
    }
    if (h.btnSpin.image.input.enabled === true) {
      h.subscene.scene.add.tween({ targets: h.btnSpin, duration: 400, scale: 1.05, loop: -1, yoyo: true });
    }
    o.x = i - a.width / 2 - 15;
    a.x = o.x + 40;
  }
  if (SkinsData_1.SkinsData.canShowIRarity(h.rarity) === true) {
    o = new Phaser.GameObjects.Image(h.subscene.scene, i + 150, n - 288, data_1.Atlases.ui, "icon_alert 10000");
    h.subscene.add(o);
  }
  a = new jd_1.JDBmpdText(
    h.subscene.scene,
    i,
    n + 250,
    data_1.Fonts.Main,
    SkinsData_1.SkinsData.getSkinOpened(e) + "/" + l,
    40,
  );
  h.subscene.add(a);
  a = o = null;
  return h;
}

exports.SkinRarity = _SkinRarity;
