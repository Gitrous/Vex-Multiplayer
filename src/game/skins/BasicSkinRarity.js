// skins/BasicSkinRarity.js — recovered from webpack module #48 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BasicSkinRarity = undefined;

var data_1 = require("../data"),
  jd_1 = require("../jd"),
  system_1 = require("../system"),
  Helpers_1 = require("../utils/Helpers");

function BasicSkinRarity(t, e) {
  this.subscene = t;
  this.rarity = e;
}

BasicSkinRarity.prototype.create = function (t, e, i, n, s, r, o) {
  this.subscene.add(
    new Phaser.GameObjects.Image(
      this.subscene.scene,
      t,
      e,
      system_1.TexturesEdit.getPanelBgTexture(this.subscene.scene, 340, n),
    ),
  );
  e = new Phaser.GameObjects.Image(this.subscene.scene, t, e - n / 2 + 42, data_1.Atlases.gameplay, "whiteBlock 10000");
  e.displayWidth = 326;
  e.displayHeight = 70;
  e.setTint(4950515, 180474, 4950515, 180474);
  this.subscene.add(e);
  this.imgSkin = new jd_1.JDSpineGameObject(this.subscene.scene, t, i + 100, "player", "stand");
  this.subscene.spineContainer.add(this.imgSkin.getView());
  this.setImgSkin(s);
  this.imgSkin.scaleX = this.imgSkin.scaleY = 6.5;
  n = new jd_1.JDBmpdTextTranslated(this.subscene.scene, t, e.y, data_1.Fonts.Main, r, 40, o);
  n.setFitSize(290);
  this.subscene.add(n);
};

BasicSkinRarity.prototype.setImgSkin = function (t) {
  this.imgSkin.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(t));
};

BasicSkinRarity.prototype.spin = function (t) {};

BasicSkinRarity.prototype.destroy = function () {
  this.subscene = null;
  this.imgSkin = null;
};

exports.BasicSkinRarity = BasicSkinRarity;
