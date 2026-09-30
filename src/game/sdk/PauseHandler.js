// sdk/PauseHandler.js — recovered from webpack module #89 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.PauseHandler = undefined;

var AzerionSDK_1 = require("./AzerionSDK");

function PauseHandler(t) {
  var e = this;
  this.game = t;
  this.focused = true;
  if (this.game.device.os.iOS) {
    this.game.sound.pauseOnBlur = false;
  } else {
    this.game.sound.pauseOnBlur = true;
  }
  this.game.events.off(Phaser.Core.Events.HIDDEN);
  this.game.events.off(Phaser.Core.Events.VISIBLE);
  if (h5branding.Utils.isOnDevice()) {
    if (this.game.device.os.iOS) {
      window.addEventListener("blur", function () {
        return e.onBlur();
      });
      window.addEventListener("focus", function () {
        return e.onFocus();
      });
    } else {
      document.addEventListener("pause", function () {
        return e.onPause();
      });
      document.addEventListener("resume", function () {
        return e.onResume();
      });
    }
  }
  this.game.events.on(Phaser.Core.Events.BLUR, this.onBlur, this);
  this.game.events.on(Phaser.Core.Events.FOCUS, this.onFocus, this);
  this.game.events.on(Phaser.Core.Events.PAUSE, this.onPause, this);
  this.game.events.on(Phaser.Core.Events.RESUME, this.onResume, this);
}

PauseHandler.getInstance = function (t) {
  return (PauseHandler.instance = PauseHandler.instance ? PauseHandler.instance : new PauseHandler(t));
};

PauseHandler.prototype.onBlur = function () {
  this.focused = false;
  this.game.events.emit(Phaser.Core.Events.PAUSE);
};

PauseHandler.prototype.onFocus = function () {
  if (!(this.focused = true) === AzerionSDK_1.AzerionSDK.isAdPlaying()) {
    this.game.events.emit(Phaser.Core.Events.RESUME);
  }
};

PauseHandler.prototype.onPause = function () {
  this.game.sound.mute = true;
  this.game.sound.context.suspend();
};

PauseHandler.prototype.onResume = function () {
  this.game.sound.mute = false;
  this.game.sound.context.resume();
};

PauseHandler.prototype.pause = function () {
  this.game.events.emit(Phaser.Core.Events.PAUSE);
};

PauseHandler.prototype.resume = function () {
  if (this.focused === true) {
    this.game.events.emit(Phaser.Core.Events.RESUME);
  }
};

exports.PauseHandler = PauseHandler;
