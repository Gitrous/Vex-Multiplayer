// jd/JDImageAnim.js — recovered from webpack module #91 of the original vex7.min.js
"use strict";

var n,
  _super,
  __extends =
    (this && this.__extends) ||
    ((n = function (t, e) {
      return (n =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array
          ? function (t, e) {
              t.__proto__ = e;
            }
          : function (t, e) {
              for (var i in e) {
                if (Object.prototype.hasOwnProperty.call(e, i)) {
                  t[i] = e[i];
                }
              }
            }))(t, e);
    }),
    function (t, e) {
      if (typeof e != "function" && e !== null)
        throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
      function i() {
        this.constructor = t;
      }
      n(t, e);
      t.prototype = e === null ? Object.create(e) : ((i.prototype = e.prototype), new i());
    });

Object.defineProperty(exports, "__esModule", { value: true });

exports.JDImageAnim = undefined;

_super = require("./JDImage").JDImage;

__extends(JDImageAnim, _super);

JDImageAnim.prototype.setFrameName = function (t, e) {
  if (e === undefined) {
    e = 0;
  }
  this.currFrame = -1;
  this.frameName = t;
  this.setAnimFrame(e);
};

JDImageAnim.prototype.start = function () {
  this.isPlaying = true;
};

JDImageAnim.prototype.stop = function () {
  this.isPlaying = false;
};

JDImageAnim.prototype.gotoAndPlay = function (t, e, i, n, s) {
  this.playFrames(t, e, (n = n === undefined ? 0 : n), (s = s === undefined ? 0 : s));
  this.counterAnim = i;
  this.setAnimFrame(this.counterAnim);
};

JDImageAnim.prototype.gotoAndStop = function (t) {
  this.stop();
  this.counterAnim = t;
  this.setAnimFrame(this.counterAnim);
};

JDImageAnim.prototype.playFrames = function (t, e, i, n) {
  if (i === undefined) {
    i = 0;
  }
  if (n === undefined) {
    n = 0.6;
  }
  this.isPlaying = true;
  if (t < e) {
    this.dir = n;
  } else if (e < t) {
    this.dir = -n;
  } else if (t === e) {
    this.isPlaying = false;
  }
  this.startFrame = t;
  this.endFrame = e;
  this.loop = i;
  this.counterAnim = this.startFrame;
  this.setAnimFrame(this.counterAnim);
};

JDImageAnim.prototype.reverse = function () {
  var t;
  this.dir = -this.dir;
  if ((this.dir > 0 && this.endFrame < this.startFrame) || (this.dir < 0 && this.endFrame > this.startFrame)) {
    t = this.startFrame;
    this.startFrame = this.endFrame;
    this.endFrame = t;
  }
  if (this.isPlaying === false) {
    this.playFrames(this.startFrame, this.endFrame, this.loop, Math.abs(this.dir));
  }
};

JDImageAnim.prototype.setAnimFrame = function (t) {
  t = Math.floor(t);
  if (this.currFrame !== t) {
    this.currFrame = t;
    this.setFrame(this.frameName + (1e4 + this.currFrame));
  }
};

JDImageAnim.prototype.update = function () {
  if (this.isPlaying === true) {
    this.counterAnim += this.dir;
    if ((this.dir > 0 && this.counterAnim > this.endFrame) || (this.dir < 0 && this.counterAnim < this.endFrame)) {
      if (this.loop === 0) {
        this.isPlaying = false;
        this.counterAnim = this.endFrame;
        this.visible = !this.hideOnComplete;
      } else if (this.loop > 0) {
        this.counterAnim = this.startFrame;
        --this.loop;
      } else if (this.loop < 0) {
        this.counterAnim = this.startFrame;
      }
      this.emit(JDImageAnim.EVENT_COMPLETE, this);
    }
    this.setAnimFrame(this.counterAnim);
  }
};

JDImageAnim.EVENT_COMPLETE = "jdimageanimcomplete";

var _JDImageAnim = JDImageAnim;

function JDImageAnim(t, e, i, n, s, r) {
  if (r === undefined) {
    r = 0;
  }
  t = _super.call(this, t, e, i, n) || this;
  t.isPlaying = false;
  t.currFrame = -1;
  t.loop = 0;
  t.hideOnComplete = false;
  t.setFrameName(s, r);
  return t;
}

exports.JDImageAnim = _JDImageAnim;
