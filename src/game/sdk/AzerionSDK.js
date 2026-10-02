// sdk/AzerionSDK.js — recovered from webpack module #12 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.AzerionSDK = undefined;

var AdHandler_1 = require("./AdHandler"),
  data_1 = require("../data"),
  LoaderHelper_1 = require("./LoaderHelper");

function AzerionSDK() {}

AzerionSDK.init = function (t, e, i) {
  if ((i = i === undefined ? true : i) === true) {
    // Multiplayer: keys typed into text fields (the room chat) must reach them.
    var isTextField = function (el) {
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable === true);
    };
    window.addEventListener("keydown", function (t) {
      if (!isTextField(t.target)) t.preventDefault();
    });
    window.addEventListener("keyup", function (t) {
      if (!isTextField(t.target)) t.preventDefault();
    });
  }
  if (window._azerionIntegration.sa && window._azerionIntegration.sa) {
    h5branding.Utils.ASSET_LOCATION = "assets/";
  }
  h5branding.SplashLoader.getInstance({
    gameId: data_1.Constants.GAME_DISTRIBUTION_ID,
    gameName: data_1.Constants.GAME_TITLE,
    gameTitle: data_1.Constants.GAME_SPLASH_TITLE,
    libs: libs,
    version: version,
  })
    .create()
    .then(function () {
      AdHandler_1.AdHandler.init(t);
      e();
    })
    .catch(function (t) {});
};

AzerionSDK.onLoadProgress = function (t) {
  h5branding.SplashLoader.getInstance().setLoadProgress(t);
};

AzerionSDK.removeSplashLoader = function (t) {
  var e = this;
  this.onLoadProgress(100);
  h5branding.SplashLoader.getInstance().setButtonCallback(function () {
    h5branding.SplashLoader.getInstance().destroy();
    if (h5branding.Utils.inGDGameZone()) {
      LoaderHelper_1.LoaderHelper.hide();
      t();
    } else {
      e.showAD("splash", t);
    }
  });
};

AzerionSDK.showAD = function (t, e, i) {
  AdHandler_1.AdHandler.showAd(t, e, i);
};

AzerionSDK.showADRewarded = function (t, e) {
  AdHandler_1.AdHandler.showRewarded(t, (e = e === undefined ? null : e));
};

AzerionSDK.isAdPlaying = function () {
  return AdHandler_1.AdHandler.isAdPlaying();
};

exports.AzerionSDK = AzerionSDK;
