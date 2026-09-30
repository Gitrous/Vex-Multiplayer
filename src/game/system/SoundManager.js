// system/SoundManager.js — recovered from webpack module #10 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.SoundManager = exports.SoundType = undefined;

var SoundType,
  BalanceData_1 = require("./BalanceData"),
  SaveGame_1 = require("./SaveGame");

(_tmp = SoundType = exports.SoundType || (exports.SoundType = {})).Music = "mus";

_tmp.SFX = "sfx";

SoundManager.init = function (t) {
  this.soundManager = t.sound;
  if (this.soundManager.locked === true && this.soundManager.context) {
    this.soundManager.context.suspend();
  }
};

SoundManager.getSound = function (t) {
  if (this.sfxInstances[t] === undefined) {
    this.sfxInstances[t] = this.soundManager.add(t);
  }
  return this.sfxInstances[t];
};

SoundManager.getSfxLoop = function (t) {
  if (this.sfxLoopInstances[t] === undefined) {
    this.sfxLoopInstances[t] = this.soundManager.add(t);
  }
  return this.sfxLoopInstances[t];
};

SoundManager.getSoundCheck = function (t, e) {
  return e === false ? this.getSound(t) : this.getSfxLoop(t);
};

SoundManager.isPlaying = function (t, e) {
  return this.getSoundCheck(t, e).isPlaying;
};

SoundManager.isPaused = function (t, e) {
  return this.getSoundCheck(t, e).isPaused;
};

SoundManager.pause = function (t, e) {
  this.getSoundCheck(t, e).pause();
};

SoundManager.resume = function (t, e) {
  this.getSoundCheck(t, e).resume();
};

SoundManager.playMusic = function (t) {
  if (this.music) {
    if (BalanceData_1.BalanceData.mutedMusic === false) {
      if (this.music.key === t) {
        if (this.music.isPlaying === false) {
          this.music.play(undefined, { volume: 1, loop: true });
        }
      } else {
        this.music.stop();
        this.music = this.getSound(t);
        this.music.play(undefined, { volume: 1, loop: true });
      }
    } else {
      this.music.volume = 1;
    }
  } else {
    this.music = this.getSound(t);
    if (BalanceData_1.BalanceData.mutedMusic === false) {
      this.music.play(undefined, { volume: 1, loop: true });
    }
  }
};

SoundManager.stopMusic = function () {
  if (this.music) {
    this.music.stop();
  }
};

SoundManager.playSFX = function (t, e, i) {
  if (e === undefined) {
    e = 1;
  }
  if (i === undefined) {
    i = false;
  }
  if (BalanceData_1.BalanceData.mutedSfx !== true) {
    if (i === true) {
      this.getSfxLoop(t).play(undefined, { volume: e, loop: true });
    } else {
      this.getSound(t).play(undefined, { volume: e });
    }
  } else if (i === true) {
    this.getSfxLoop(t);
  }
};

SoundManager.stopSFX = function (t) {
  if (this.sfxInstances[t] !== undefined) {
    this.sfxInstances[t].stop();
  }
};

SoundManager.stopSFXLoop = function (t) {
  if (this.sfxLoopInstances[t] !== undefined) {
    this.sfxLoopInstances[t].stop();
  }
};

SoundManager.stopAllSFXLoop = function () {
  for (var t = 0, e = Object.keys(this.sfxLoopInstances); t < e.length; t++) {
    var i = e[t];
    this.sfxLoopInstances[i].stop();
  }
};

SoundManager.changeEnabledMusic = function () {
  if (BalanceData_1.BalanceData.mutedMusic === false) {
    if (this.music !== null) {
      this.music.pause();
    }
  } else if (this.music !== null) {
    if (this.music.isPaused === true) {
      this.music.resume();
    } else {
      this.music.play(undefined);
    }
  }
  BalanceData_1.BalanceData.mutedMusic = !BalanceData_1.BalanceData.mutedMusic;
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

SoundManager.changeEnabledSFX = function () {
  if (BalanceData_1.BalanceData.mutedSfx === false)
    for (var t = 0, e = Object.keys(this.sfxLoopInstances); t < e.length; t++) {
      var i = e[t];
      if (this.sfxLoopInstances[i].isPlaying === true) {
        this.sfxLoopInstances[i].pause();
      }
    }
  else
    for (var n = 0, s = Object.keys(this.sfxLoopInstances); n < s.length; n++) {
      i = s[n];
      if (this.sfxLoopInstances[i].isPaused === true) {
        this.sfxLoopInstances[i].resume();
      }
    }
  BalanceData_1.BalanceData.mutedSfx = !BalanceData_1.BalanceData.mutedSfx;
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

SoundManager.setEnabled = function (t) {
  if (t === SoundType.Music) {
    this.changeEnabledMusic();
  } else {
    this.changeEnabledSFX();
  }
};

SoundManager.music = null;

SoundManager.sfxLoopInstances = {};

SoundManager.sfxInstances = {};

var _tmp = SoundManager;

function SoundManager() {}

exports.SoundManager = _tmp;
