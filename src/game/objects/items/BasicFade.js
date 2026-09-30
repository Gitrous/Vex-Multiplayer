// objects/items/BasicFade.js — recovered from webpack module #50 of the original vex7.min.js
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

exports.BasicFade = undefined;

var Tools_1 = require("../../utils/Tools");

_super = require("./Item").Item;

__extends(BasicFade, _super);

BasicFade.prototype.spawn = function (t) {
  this.id = t.textNum;
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.sprite.scale = this.startScale;
  this.sprite.visible = true;
  this.sprite.alpha = 0;
  this.reappear = 0;
  this.alive = true;
  this.canAppear = false;
  this.canDisappear = false;
};

BasicFade.prototype.update = function () {
  var t,
    e = Tools_1.Tools.distance(this.main.player.xPos, this.main.player.yPos, this.xPos, this.yPos);
  if (e < this.appearDistSq) {
    this.canAppear = true;
    this.canDisappear = false;
  } else if (e > this.disappearDistSq) {
    this.canDisappear = true;
  }
  if (this.canAppear === true) {
    this.sprite.alpha -= 0.25 * (this.sprite.alpha - 1);
    t = this.sprite.scaleX;
    if ((t -= 0.25 * (t - this.startScale)) >= this.startScale - 0.01) {
      this.canAppear = false;
      this.reappear = 0;
    }
    this.sprite.scale = t;
  } else if (this.canDisappear === true) {
    if (this.reappear >= this.reappearTime) {
      this.sprite.alpha -= 0.25 * this.sprite.alpha;
      t = this.sprite.scaleX;
      if ((t -= 0.25 * t) <= 0) {
        this.canDisappear = false;
      }
      this.sprite.scale = t;
    } else {
      this.reappear += 1;
    }
  }
};

BasicFade.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _BasicFade = BasicFade;

function BasicFade() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.appearDistSq = 150;
  t.disappearDistSq = 170;
  t.reappearTime = 30;
  t.startScale = 1;
  return t;
}

exports.BasicFade = _BasicFade;
