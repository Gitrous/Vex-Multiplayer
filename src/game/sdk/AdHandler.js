// sdk/AdHandler.js — recovered from webpack module #88 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.AdHandler = undefined;

var s,
  data_1 = require("../data"),
  LoaderHelper_1 = require("./LoaderHelper"),
  PauseHandler_1 = require("./PauseHandler");

(_tmp = s = s || {}).PAUSED = "Paused";

_tmp.RESUMED = "Resumed";

AdHandler.init = function (t) {
  this.azAdWrapper = new window.h5ads.AdWrapper(
    window._azerionIntegration.advType,
    data_1.Constants.GAME_DISTRIBUTION_ID,
  );
  this.contentStatus = s.RESUMED;
  PauseHandler_1.PauseHandler.getInstance(t);
};

AdHandler.showAd = function (t, e, i) {
  var n = this;
  LoaderHelper_1.LoaderHelper.show();
  if (data_1.Constants.IS_AD_AVAILABLE === false) {
    LoaderHelper_1.LoaderHelper.hide();
    if (e) {
      e.call(this);
    }
  } else {
    this.azAdWrapper.once(h5ads.AdEvents.CONTENT_PAUSED, function () {
      LoaderHelper_1.LoaderHelper.hide();
      if (i) {
        i.call(n);
      }
      PauseHandler_1.PauseHandler.getInstance().pause();
      n.contentStatus = s.PAUSED;
    });
    this.azAdWrapper.once(h5ads.AdEvents.CONTENT_RESUMED, function () {
      window.focus();
      LoaderHelper_1.LoaderHelper.hide();
      n.azAdWrapper.removeAllListeners(h5ads.AdEvents.CONTENT_PAUSED);
      n.azAdWrapper.removeAllListeners(h5ads.AdEvents.CONTENT_RESUMED);
      if (e) {
        e.call(n);
      }
      n.contentStatus = s.RESUMED;
      PauseHandler_1.PauseHandler.getInstance().resume();
    });
    this.azAdWrapper.showAd(h5ads.AdType.interstitial);
  }
};

AdHandler.showRewarded = function (t, e) {
  var i,
    n = this;
  LoaderHelper_1.LoaderHelper.show();
  if (data_1.Constants.IS_AD_AVAILABLE === false) {
    LoaderHelper_1.LoaderHelper.hide();
    if (t) {
      t(true);
    }
  } else {
    i = false;
    this.azAdWrapper.once(h5ads.AdEvents.CONTENT_PAUSED, function () {
      LoaderHelper_1.LoaderHelper.hide();
      PauseHandler_1.PauseHandler.getInstance().pause();
      if (e) {
        e();
      }
    });
    this.azAdWrapper.once(h5ads.AdEvents.CONTENT_RESUMED, function () {
      window.focus();
      PauseHandler_1.PauseHandler.getInstance().resume();
      n.azAdWrapper.preloadAd(h5ads.AdType.rewarded);
      LoaderHelper_1.LoaderHelper.hide();
      if (t) {
        t(i);
      }
      n.azAdWrapper.removeAllListeners(h5ads.AdEvents.CONTENT_PAUSED);
      n.azAdWrapper.removeAllListeners(h5ads.AdEvents.CONTENT_RESUMED);
      n.azAdWrapper.removeAllListeners(h5ads.AdEvents.AD_REWARDED);
    });
    this.azAdWrapper.addListener(h5ads.AdEvents.AD_REWARDED, function () {
      i = true;
    });
    this.azAdWrapper.showAd(h5ads.AdType.rewarded);
  }
};

AdHandler.isAdPlaying = function () {
  return this.contentStatus === s.PAUSED;
};

var _tmp = AdHandler;

function AdHandler() {}

exports.AdHandler = _tmp;
