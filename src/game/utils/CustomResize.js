// utils/CustomResize.js — recovered from webpack module #28 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.CustomResize = undefined;

var data_1 = require("../data"),
  BalanceData_1 = require("../system/BalanceData");

function CustomResize() {}

CustomResize.init = function () {
  if ((this.userRatio = 1) < (window.devicePixelRatio || 1)) {
    this.userRatio = 0.85;
  }
  this.orientationDiv = document.getElementById(data_1.Constants.DIV_ID_ORIENTATION);
  this.contentDiv = document.getElementById(data_1.Constants.DIV_ID);
  this.contentDiv.style.width = "100vw";
  this.contentDiv.style.height = "100vh";
  this.contentDiv.style.outline = "0";
  Phaser.Scale.ScaleManager.prototype.boot = function () {
    this.canvas = this.game.canvas;
    this.fullscreen = this.game.device.fullscreen;
    this.game.events.on(Phaser.Core.Events.PRE_STEP, this.step, this);
    this.game.events.once(Phaser.Core.Events.DESTROY, this.destroy, this);
    this.startListeners();
  };
  Phaser.Scale.ScaleManager.prototype.getParentBounds = function () {
    var t, e, i;
    return !(
      !this.parent ||
      ((t = this.parentSize), (e = window.innerWidth), (i = window.innerHeight), t.width === e && t.height === i) ||
      (t.setSize(e, i), 0)
    );
  };
  Phaser.Scale.ScaleManager.prototype.step = function (t, e) {
    if (this.parent && ((this._lastCheck += e), this.dirty || this._lastCheck > this.resizeInterval)) {
      if (this.getParentBounds()) {
        CustomResize.resize(this.game, this.parentSize.width, this.parentSize.height);
      }
      this.dirty = false;
      this._lastCheck = 0;
    }
  };
  Phaser.Scale.ScaleManager.prototype.updateScale = function () {
    var t = this.parentSize.width;
    if (this.gameSize.width === CustomResize.MaxCanvasW) {
      t = CustomResize.MaxCanvasW / CustomResize.scaleFactor;
    }
    var e = this.parentSize.height;
    if (this.gameSize.height === CustomResize.MaxCanvasH) {
      e = CustomResize.MaxCanvasH / CustomResize.scaleFactor;
    }
    this.displaySize.resize(t, e);
    var t = this.canvas.style;
    t.width = this.displaySize.width + "px";
    t.height = this.displaySize.height + "px";
    this.getParentBounds();
    this.updateCenter();
  };
};

CustomResize.setGameSize = function (t, e) {
  data_1.Constants.GW = t;
  data_1.Constants.GH = e;
  data_1.Constants.GHW = Math.floor(data_1.Constants.GW / 2);
  data_1.Constants.GHH = Math.floor(data_1.Constants.GH / 2);
  if (data_1.Constants.GW > data_1.Constants.GH) {
    data_1.Constants.ORIENTATION_LANDSCAPE = true;
    this.contentDiv.style.position = "relative";
  } else {
    data_1.Constants.ORIENTATION_LANDSCAPE = false;
    this.contentDiv.style.position = "fixed";
  }
};

CustomResize.setMaxCanvasSize = function (t, e) {
  this.MaxCanvasW = t;
  this.MaxCanvasH = e;
  this.OW = (this.MaxCanvasW - data_1.Constants.GW) / 2;
  this.OH = (this.MaxCanvasH - data_1.Constants.GH) / 2;
};

CustomResize.refresh = function (t) {
  this.resize(t, window.innerWidth, window.innerHeight);
};

CustomResize.resize = function (t, e, i) {
  var n = data_1.Constants.GW,
    s = data_1.Constants.GH;
  this.scaleFactor = this.userRatio;
  this.scaleFactor /= i < e ? i / s : i / n;
  data_1.Constants.userRatio = this.scaleFactor;
  this.CanvasW = Math.ceil(e * this.scaleFactor);
  this.CanvasH = Math.ceil(i * this.scaleFactor);
  if (this.CanvasW > this.MaxCanvasW) {
    this.CanvasW = this.MaxCanvasW;
  }
  if (this.CanvasH > this.MaxCanvasH) {
    this.CanvasH = this.MaxCanvasH;
  }
  this.CanvasHalfW = this.CanvasW / 2;
  this.CanvasHalfH = this.CanvasH / 2;
  this.resizeUI(this.CanvasW, this.CanvasH, data_1.Constants.UI_WIDTH, data_1.Constants.UI_HEIGHT);
  this.nativeResize(t.scale, this.CanvasW, this.CanvasH);
  if (data_1.Constants.IS_MOBILE === true) {
    this.checkOrientation(e, i);
    window.scroll(0, 0);
  }
};

CustomResize.nativeResize = function (t, e, i) {
  var n = t.width,
    s = t.height;
  t.gameSize.resize(e, i);
  t.baseSize.resize(e, i);
  t.canvas.width = t.baseSize.width;
  t.canvas.height = t.baseSize.height;
  var r = t.canvas.style;
  r.width = e + "px";
  r.height = i + "px";
  t.refresh(n, s);
};

CustomResize.checkOrientation = function (t, e) {
  if (e < t === data_1.Constants.ORIENTATION_LANDSCAPE) {
    this.orientationDiv.style.display = "none";
    BalanceData_1.BalanceData.incorrectOrientation = false;
  } else {
    this.orientationDiv.style.display = "block";
    BalanceData_1.BalanceData.incorrectOrientation = true;
  }
};

CustomResize.resizeUI = function (t, e, i, n) {
  var s = i < t ? 1 : t / i,
    r = n < e ? 1 : e / n,
    s = s < r ? s : r,
    r = (i - data_1.Constants.GW) / 2,
    o = (n - data_1.Constants.GH) / 2,
    r = Math.round(t / 2 - (i * s) / 2) + r * s,
    o = Math.round(e / 2 - (n * s) / 2) + o * s;
  data_1.Constants.UI_SCALE_FIT_X = (t / i / s) * 1.01;
  data_1.Constants.UI_SCALE_FIT_Y = (e / n / s) * 1.01;
  data_1.Constants.UI_SCALE = s;
  data_1.Constants.UI_SHIFT_X = Math.round(r / s);
  data_1.Constants.UI_SHIFT_Y = Math.round(o / s);
};

CustomResize.resizeCamera = function (t) {
  t.setOrigin(0, 0);
  t.zoom = data_1.Constants.UI_SCALE;
  t.setScroll(-data_1.Constants.UI_SHIFT_X, -data_1.Constants.UI_SHIFT_Y);
};

CustomResize.resizeContainer = function (t) {
  t.scale = data_1.Constants.UI_SCALE;
  t.x = data_1.Constants.UI_SHIFT_X * data_1.Constants.UI_SCALE;
  t.y = data_1.Constants.UI_SHIFT_Y * data_1.Constants.UI_SCALE;
};

CustomResize.scaleFitScreen = function (t) {
  t.scaleX = data_1.Constants.UI_SCALE_FIT_X;
  t.scaleY = data_1.Constants.UI_SCALE_FIT_Y;
};

CustomResize.scaleFactor = 1;

exports.CustomResize = CustomResize;
