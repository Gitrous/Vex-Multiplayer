// effects/Transition.js — recovered from webpack module #112 of the original vex7.min.js
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

exports.Transition = undefined;

var data_1 = require("../data"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  Tools_1 = require("../utils/Tools");

_super = Phaser.GameObjects.Container;

__extends(Transition, _super);

Transition.prototype.beginTransition = function (t, e) {
  for (var i = [], n = 2; n < arguments.length; n++) i[n - 2] = arguments[n];
  this.callback = t;
  this.context = e;
  this.argums = i;
  this.visible = true;
  this.counter = 0;
  this.anim = "in";
  this.logo.showIn();
};

Transition.prototype.onInComplete = function () {
  this.anim = "stand";
  this.counter = 0;
  this.callback.apply(this.context, this.argums);
  this.endTransition();
};

Transition.prototype.endTransition = function () {
  this.logo.showOut();
  this.anim = "out";
  this.counter = this.maxDur;
};

Transition.prototype.update = function () {
  if (this.visible !== false) {
    if (this.anim === "in") {
      this.counter += 1;
      this.updateElements();
      if (this.counter >= this.maxDur) {
        this.anim = "none";
      }
    } else if (this.anim === "out" && (--this.counter, this.updateElements(), this.counter === 0)) {
      this.visible = false;
    }
    this.logo.update();
  }
};

Transition.prototype.updateElements = function () {
  for (var t = 0; t < this.elements.length; t++) this.elements[t].update(this.counter);
};

Transition.prototype.resize = function () {
  this.scale =
    2 *
    (data_1.Constants.UI_SCALE_FIT_X > data_1.Constants.UI_SCALE_FIT_Y
      ? data_1.Constants.UI_SCALE_FIT_X
      : data_1.Constants.UI_SCALE_FIT_Y);
};

var _Transition = Transition;

function Transition(t) {
  var e,
    i = _super.call(this, t, data_1.Constants.GHW, data_1.Constants.GHH) || this;
  i.elementsStart = [
    0, 1, 2, 3, 4, 5, 4, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1, 4, 5, 4, 3, 2, 1, 0,
  ];
  i.countStep = 6;
  i.elements = new Array();
  i.maxDur = Math.ceil(6 * i.countStep);
  for (var n = -296, s = -444, r = 0; r < 35; r++) {
    e = new d(t, s, n, i.elementsStart[r], i.countStep);
    i.add(e);
    i.elements.push(e);
    if ((r + 1) % 7 == 0) {
      s = -444;
      n += 148;
    } else {
      s += 148;
    }
  }
  e = null;
  i.logo = new p(t, i.countStep);
  i.logo.on("animInComp", i.onInComplete, i);
  i.add(i.logo);
  i.visible = false;
  return i;
}

exports.Transition = _Transition;

_super2 = Phaser.GameObjects.Image;

__extends(g, _super2);

g.prototype.update = function (t) {
  if (t >= this.start && t <= this.duration) {
    this.scaleX = (t - this.start) / (this.duration - this.start);
  }
};

var _super3,
  _super2,
  d = g;

_super3 = Phaser.GameObjects.Image;

__extends(f, _super3);

f.prototype.showIn = function () {
  this.start();
  this.durationID = 0;
  this.angle = -10;
  this.scale = 0;
  this.duration = this.durationIn[this.durationID].d;
  this.updateAnim = SubSceneList_1.Bool3.true;
};

f.prototype.showOut = function () {
  this.start();
  this.duration = 1;
  this.durationID = -1;
  this.updateAnim = SubSceneList_1.Bool3.false;
};

f.prototype.start = function () {
  this.counter = 0;
  this.visible = true;
  this.stepScale = 0;
  this.stepAngle = 0;
};

f.prototype.update = function () {
  var t, e;
  if (this.updateAnim === SubSceneList_1.Bool3.true) {
    this.counter += 1;
    this.scale += this.stepScale;
    this.angle += this.stepAngle;
    if (this.counter === this.duration) {
      this.durationID += 1;
      if (this.durationID === this.durationIn.length) {
        this.updateAnim = SubSceneList_1.Bool3.none;
        this.emit("animInComp");
      } else {
        t = this.durationIn[this.durationID];
        this.duration = t.d;
        e = this.duration - this.counter;
        this.stepScale = (t.sc - this.scale) / e;
        this.stepAngle = (t.a - this.angle) / e;
      }
    }
  } else if (
    this.updateAnim === SubSceneList_1.Bool3.false &&
    ((this.counter += 1), (this.scale += this.stepScale), this.counter === this.duration)
  ) {
    this.durationID += 1;
    if (this.durationID === this.durationOut.length) {
      this.updateAnim = SubSceneList_1.Bool3.none;
    } else {
      t = this.durationOut[this.durationID];
      this.duration = t.d;
      e = this.duration - this.counter;
      this.stepScale = (t.sc - this.scale) / e;
    }
  }
};

var p = f;

function f(t, e) {
  t = _super3.call(this, t, 0, 0, "logo") || this;
  function i(t) {
    return Math.ceil((t / 125) * e);
  }
  t.durationIn = new Array();
  t.durationIn.push({ d: i(700), sc: 0, a: -10 });
  t.durationIn.push({ d: i(850), sc: 0.6, a: 6 });
  t.durationIn.push({ d: i(975), sc: 0.45, a: -3 });
  t.durationIn.push({ d: i(1100), sc: 0.5, a: 0 });
  t.durationOut = new Array();
  t.durationOut.push({ d: i(50), sc: 0.6 });
  t.durationOut.push({ d: i(175), sc: 0 });
  t.visible = false;
  t.updateAnim = SubSceneList_1.Bool3.none;
  return t;
}

function g(t, e, i, n, s) {
  t = _super2.call(this, t, e, i, data_1.Atlases.ui, "transition_romb 10000") || this;
  t.rotation = Tools_1.Tools.PI025;
  t.start = n * s;
  t.duration = t.start + s;
  t.scaleX = 0;
  return t;
}
