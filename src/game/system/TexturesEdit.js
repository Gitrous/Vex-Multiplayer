// system/TexturesEdit.js — recovered from webpack module #107 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.TexturesEdit = undefined;

var data_1 = require("../data"),
  BalanceData_1 = require("./BalanceData");

function TexturesEdit() {}

TexturesEdit.init = function (t) {
  for (var e = 0; e < BalanceData_1.BalanceData.basicBlockColorFrames; e++) {
    this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "basicBlockColors " + (1e4 + e)), 100, 100, 2, 2);
    this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "leftSlopeColors " + (1e4 + e)), 100, 100, 2, 2);
  }
  for (
    this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "swimmingPool 10000"), 100, 100, 2, 2),
      this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "swimmingPool 10001"), 100, 100, 2, 2),
      this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "whiteBlock 10000"), 100, 100, 2, 2),
      this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "whiteLine 10000"), 100, 2, 2, 0),
      this.changeFrameSize(t.textures.getFrame(data_1.Atlases.ui, "top_bar 10000"), 62, 64, 2, 0),
      e = 0;
    e < 60;
    e++
  )
    this.changeFrameSize(t.textures.getFrame(data_1.Atlases.gameplay, "finish " + (1e4 + e)), 44, 52, 2, 2);
  var i = new Phaser.GameObjects.Graphics(t);
  i.fillStyle(16777215);
  i.fillRoundedRect(0, 0, 390, 70, { tl: 20, tr: 20, bl: 0, br: 0 });
  i.generateTexture("texTrophieTab", 390, 70);
  i.destroy();
};

TexturesEdit.changeFrameSize = function (t, e, i, n, s) {
  t.setSize(e, i, t.cutX + n, t.cutY + s);
};

TexturesEdit.getPanelBgTexture = function (t, e, i, n) {
  n = "panelBg" + e + i + (n = n === undefined ? "" : n);
  if (t.textures.exists(n) === false) {
    (t = new Phaser.GameObjects.Graphics(t)).fillStyle(19660);
    t.fillRect(0, 0, e, i);
    t.lineStyle(4, 9823743);
    t.strokeRect(5, 5, e - 10, i - 10);
    t.generateTexture(n, e, i);
    t.destroy();
    t = null;
  }
  return n;
};

exports.TexturesEdit = TexturesEdit;
