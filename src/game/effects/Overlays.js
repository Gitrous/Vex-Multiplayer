// effects/Overlays.js — recovered from webpack module #113 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Overlays = undefined;

var data_1 = require("../data"),
  CustomResize_1 = require("../utils/CustomResize");

function Overlays(t, e) {
  this.scene = t;
  var i = CustomResize_1.CustomResize.MaxCanvasW,
    n = CustomResize_1.CustomResize.MaxCanvasH;
  this.dark = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "blackPixel 10000");
  e.add(this.dark);
  this.dark.scale = 10;
  this.darkBackground = new Phaser.GameObjects.Image(t, 0, 0, "darkOverlay");
  this.darkBackground.scale = 2;
  e.add(this.darkBackground);
  this.flash = new Phaser.GameObjects.Image(t, i / 2, n / 2, data_1.Atlases.gameplay, "whiteBlock 10000");
  this.flash.setScale(i / 100, n / 100);
  t.add.existing(this.flash);
  this.reset();
}

Overlays.prototype.hideDark = function () {
  this.isDark = false;
  this.dark.visible = false;
  this.darkBackground.visible = false;
};

Overlays.prototype.hideFlash = function () {
  this.flash.visible = false;
};

Overlays.prototype.reset = function () {
  this.hideDark();
  this.hideFlash();
  this.isExploding = false;
};

Overlays.prototype.checkPoint = function () {
  if (this.isDark === true) {
    this.goLight();
  }
};

Overlays.prototype.goDark = function () {
  if (this.isDark !== true) {
    this.isDark = true;
    this.darkDelay = 6;
    this.dark.visible = true;
    this.dark.alpha = 1;
    this.darkBackground.visible = true;
    this.hideFlash();
    for (var t = 0, e = this.scene.solarBlocks; t < e.length; t++) e[t].goDark();
  }
};

Overlays.prototype.goLight = function () {
  if (this.isDark !== false) {
    this.flash.visible = true;
    this.flash.alpha = 1;
    this.hideDark();
    for (var t = 0, e = this.scene.solarBlocks; t < e.length; t++) e[t].goLight();
  }
};

Overlays.prototype.explode = function (t, e) {
  if (this.isExploding !== true) {
    this.isExploding = true;
    this.flash.visible = true;
    this.flash.alpha = 0;
    this.explodeCallback = t;
    this.explodeContext = e;
  }
};

Overlays.prototype.update = function () {
  if (this.flash.visible === true) {
    if (this.isExploding === true) {
      this.flash.alpha += 0.1;
      if (this.flash.alpha >= 1) {
        this.isExploding = false;
        if (this.explodeCallback) {
          this.explodeCallback.apply(this.explodeContext);
        } else if (this.scene.vexTNT && this.scene.vexTNT.used === true) {
          this.scene.explodeComplete();
        }
      }
    } else {
      this.flash.alpha -= 0.03;
      if (this.flash.alpha <= 0) {
        this.flash.visible = false;
      }
    }
  }
  if (this.isDark === true) {
    if (this.darkDelay === 0) {
      if (this.dark.alpha > 0) {
        this.dark.alpha -= 0.025;
      }
    } else {
      --this.darkDelay;
    }
    this.dark.x = this.darkBackground.x = this.scene.player.xPos;
    this.dark.y = this.darkBackground.y = this.scene.player.yPos;
  }
};

exports.Overlays = Overlays;
