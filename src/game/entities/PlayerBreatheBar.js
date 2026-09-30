// entities/PlayerBreatheBar.js — recovered from webpack module #59 of the original vex7.min.js
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

exports.PlayerBreatheBar = undefined;

var data_1 = require("../data"),
  system_1 = require("../system"),
  Achievements_1 = require("../system/Achievements");

_super = Phaser.GameObjects.Container;

__extends(PlayerBreatheBar, _super);

PlayerBreatheBar.prototype.reset = function () {
  this.breathe = this.maxBreathe;
};

PlayerBreatheBar.prototype.show = function (t) {
  --this.breathe;
  if (this.breathe < 90) {
    system_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.gasping);
  }
  this.visible = true;
  this.rotation = -t;
  if (this.scaleX < 1) {
    this.scaleX -= 0.05;
    if (this.scaleX > 1) {
      this.scaleX = 1;
    }
    this.scaleY = this.scaleX;
    this.alpha = this.scaleX;
  }
  for (var e = Math.floor(this.breathe / 60), i = 0; i < 10; i++) {
    var n = this.breatheBlocks[i];
    if (e < i) {
      if (n.alpha > 0 && ((n.alpha -= 0.1), (n.y -= 0.5), n.alpha < 0)) {
        n.alpha = 0;
        n.y = -85;
      }
    } else if (n.alpha < 1 && ((n.alpha += 0.1), (n.y = -65), n.alpha > 1)) {
      n.alpha = 1;
      n.y = -65;
    }
  }
  return this.breathe;
};

PlayerBreatheBar.prototype.addBreath = function (t) {
  if (this.breathe < this.maxBreathe) {
    this.breathe += t;
  } else {
    this.breathe = this.maxBreathe;
  }
};

PlayerBreatheBar.prototype.hide = function () {
  this.visible = false;
};

var _PlayerBreatheBar = PlayerBreatheBar;

function PlayerBreatheBar(t) {
  var e = _super.call(this, t) || this;
  e.maxBreathe = 600;
  e.hide();
  e.breatheBlocks = [];
  for (var i = 0; i < 10; i++) {
    var n = new Phaser.GameObjects.Image(t, 10 * (i - 4.5), -65, data_1.Atlases.gameplay, "breatheBlock 10000");
    e.add(n);
    e.breatheBlocks.push(n);
  }
  return e;
}

exports.PlayerBreatheBar = _PlayerBreatheBar;
