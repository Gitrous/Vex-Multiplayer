// jd/JDSpineGameObject.js — recovered from webpack module #100 of the original vex7.min.js
"use strict";

function JDSpineGameObject(t, e, i, n, s, r) {
  this.currTimeScale = 1;
  this.isPaused = false;
  this.isPlaying = false;
  this.scene = t;
  this.spine = t.make.spine({ key: n, animationName: s, loop: r }, false);
  this.x = e;
  this.y = i;
}

Object.defineProperty(exports, "__esModule", { value: true });

exports.JDSpineGameObject = undefined;

JDSpineGameObject.prototype.pause = function () {
  this.isPaused = true;
  this.spine.timeScale = 0;
};

JDSpineGameObject.prototype.resume = function () {
  this.isPaused = false;
  this.spine.timeScale = this.currTimeScale;
};

JDSpineGameObject.prototype.stop = function () {
  this.spine.timeScale = 0;
  this.isPlaying = false;
};

JDSpineGameObject.prototype.getView = function () {
  return this.spine;
};

JDSpineGameObject.prototype.updateAnim = function () {
  this.spine.preUpdate(0, 0);
};

JDSpineGameObject.prototype.setSkin = function (t) {
  this.spine.setSkinByName(t);
};

JDSpineGameObject.prototype.play = function (t, e, i, n) {
  this.currTimeScale = i = i === undefined ? 1 : i;
  this.spine.timeScale = this.currTimeScale;
  this.spine.play(t, e, n);
  this.isPlaying = true;
  this.currAnimationName = t;
};

JDSpineGameObject.prototype.playFromProgress = function (t, e, i, n, s) {
  this.play(t, i, (n = n === undefined ? 1 : n), s);
  if (this.spine.state.getCurrent(0)) {
    this.spine.state.getCurrent(0).trackTime = this.getCurrentAnimationDuration() * e;
  }
};

JDSpineGameObject.prototype.getCurrentAnimationName = function () {
  return this.currAnimationName;
};

JDSpineGameObject.prototype.getCurrentAnimationDuration = function () {
  return this.spine.getCurrentAnimation() ? this.spine.getCurrentAnimation().duration : 0;
};

JDSpineGameObject.prototype.getAnimationDuration = function (t) {
  return this.spine.findAnimation(t).duration;
};

JDSpineGameObject.prototype.getAnimationProgress = function () {
  var t;
  return this.spine.state.getCurrent(0)
    ? ((t = this.getCurrentAnimationDuration()), (this.spine.state.getCurrent(0).trackTime % t) / t)
    : 0;
};

Object.defineProperty(JDSpineGameObject.prototype, "x", {
  get: function () {
    return this.spine.x;
  },
  set: function (t) {
    this.spine.x = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDSpineGameObject.prototype, "y", {
  get: function () {
    return this.spine.y;
  },
  set: function (t) {
    this.spine.y = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDSpineGameObject.prototype, "rotation", {
  get: function () {
    return this.spine.rotation;
  },
  set: function (t) {
    this.spine.rotation = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDSpineGameObject.prototype, "scaleX", {
  get: function () {
    return this.spine.scaleX;
  },
  set: function (t) {
    this.spine.scaleX = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDSpineGameObject.prototype, "scaleY", {
  get: function () {
    return this.spine.scaleY;
  },
  set: function (t) {
    this.spine.scaleY = t;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(JDSpineGameObject.prototype, "visible", {
  get: function () {
    return this.spine.visible;
  },
  set: function (t) {
    this.spine.visible = t;
  },
  enumerable: false,
  configurable: true,
});

JDSpineGameObject.prototype.destroy = function () {
  this.scene = null;
  this.spine = null;
};

JDSpineGameObject.EVENT_COMPLETE = "complete";

JDSpineGameObject.EVENT_DISPOSE = "dispose";

JDSpineGameObject.EVENT_END = "end";

JDSpineGameObject.EVENT_EVENT = "event";

JDSpineGameObject.EVENT_INTERRUPTED = "interrupted";

JDSpineGameObject.EVENT_START = "start";

exports.JDSpineGameObject = JDSpineGameObject;
