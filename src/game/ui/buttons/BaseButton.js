// ui/buttons/BaseButton.js — recovered from webpack module #42 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BaseButton = undefined;

var data_1 = require("../../data"),
  system_1 = require("../../system");

function BaseButton(t) {
  this.isOver = false;
  this.currPointerID = -1;
  this.soundDown = data_1.Constants.SFX_BTN_ON_DOWN;
  this.soundUp = data_1.Constants.SFX_BTN_ON_UP;
  this.tintOut = 16777215;
  this.tintOver = 13421772;
  this.scene = t;
}

BaseButton.prototype.createView = function (t) {
  this.view = t;
  this.view.once(Phaser.GameObjects.Events.DESTROY, this.destroyInternal, this);
};

BaseButton.prototype.initEvents = function (t, e, i, n) {
  t.setInteractive(e, i, n);
  t.input.cursor = "pointer";
  t.on(Phaser.Input.Events.POINTER_DOWN, this.inputDown, this);
  this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.inputUp, this);
  t.on(Phaser.Input.Events.POINTER_OUT, this.inputOut, this);
  t.on(Phaser.Input.Events.POINTER_OVER, this.inputOver, this);
  this.interactiveElement = t;
};

BaseButton.prototype.setTintInteractive = function (t, e) {
  this.tintOut = t;
  this.tintOver = e;
  this.inputOut();
};

BaseButton.prototype.inputOut = function () {
  if (!(this.isOver = false) === this.interactiveElement.input.enabled) {
    this.interactiveElement.tint = this.tintOut;
  }
};

BaseButton.prototype.inputOver = function () {
  if ((this.isOver = true) === this.interactiveElement.input.enabled) {
    this.interactiveElement.tint = this.tintOver;
  }
};

BaseButton.prototype.inputDown = function (t) {
  this.currPointerID = t.id;
  this.downState();
  this.downComplete();
};

BaseButton.prototype.downState = function () {};

BaseButton.prototype.upState = function () {};

BaseButton.prototype.inputUp = function (t) {
  if (this.currPointerID >= 0) {
    this.upState();
  }
  if (this.isOver !== false && this.currPointerID === t.id) {
    this.currPointerID = -1;
    this.upComplete();
  } else {
    this.currPointerID = -1;
  }
};

BaseButton.prototype.downComplete = function () {
  if (this.onDown) {
    this.onDown();
  }
  if (this.soundDown) {
    system_1.SoundManager.playSFX(this.soundDown);
  }
};

BaseButton.prototype.upComplete = function () {
  if (this.onUp) {
    this.onUp();
  }
  if (this.soundUp) {
    system_1.SoundManager.playSFX(this.soundUp);
  }
};

BaseButton.prototype.setXY = function (t, e) {
  this.view.x = t;
  this.view.y = e;
};

BaseButton.prototype.setInteraction = function (t) {
  this.interactiveElement.input.enabled = t;
};

Object.defineProperty(BaseButton.prototype, "x", {
  get: function () {
    return this.view.x;
  },
  set: function (t) {
    this.view.x = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "y", {
  get: function () {
    return this.view.y;
  },
  set: function (t) {
    this.view.y = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "scaleX", {
  get: function () {
    return this.view.scaleX;
  },
  set: function (t) {
    this.view.scaleX = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "scale", {
  get: function () {
    return this.view.scale;
  },
  set: function (t) {
    this.view.scale = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "scaleY", {
  get: function () {
    return this.view.scaleY;
  },
  set: function (t) {
    this.view.scaleY = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "visible", {
  get: function () {
    return this.view.visible;
  },
  set: function (t) {
    this.view.visible = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(BaseButton.prototype, "alpha", {
  get: function () {
    return this.view.alpha;
  },
  set: function (t) {
    this.view.alpha = t;
  },
  enumerable: false,
  configurable: true,
});

BaseButton.prototype.getView = function () {
  return this.view;
};

BaseButton.prototype.getInteractiveElement = function () {
  return this.interactiveElement;
};

BaseButton.prototype.destroyInternal = function () {
  this.view = null;
  this.interactiveElement = null;
  this.scene = null;
  this.onDown = null;
  this.onUp = null;
};

BaseButton.prototype.destroy = function () {
  this.view.destroy();
};

exports.BaseButton = BaseButton;
