// objects/items/LeverPulse.js — recovered from webpack module #230 of the original vex7.min.js
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

exports.LeverPulse = undefined;

var data_1 = require("../../data"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  blocks_1 = require("../blocks");

_super = require("./Item").Item;

__extends(LeverPulse, _super);

LeverPulse.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.currID = t.currID;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.updatePositions();
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.alive = true;
  this.isContacted = false;
  this.isActive = false;
};

LeverPulse.prototype.levelStart = function () {
  this.pulseBlocks = [];
  for (var t = 0, e = this.main.blocks; t < e.length; t++) {
    var i = e[t];
    if (i instanceof blocks_1.PulseBlock && i.currID === this.currID) {
      this.pulseBlocks.push(i);
    }
  }
};

LeverPulse.prototype.update = function () {
  if (
    this.isActive === false &&
    this.main.player.state === PlayerBase_1.PlayerState.Crouching &&
    SAT.testPolygonPolygon(this.hitBoxPolygon, this.main.player.totalPolygon) === true
  ) {
    if (this.isContacted === false) {
      if (this.isActive === false) {
        this.sprite.flipX = true;
      } else if (this.isActive === true) {
        this.sprite.flipX = false;
      }
      this.isActive = !this.isActive;
      for (var t = 0, e = this.pulseBlocks; t < e.length; t++) e[t].enablePulsing(this.isActive);
    }
    this.isContacted = true;
  } else this.isContacted = false;
};

LeverPulse.prototype.reset = function () {
  if (this.isActive === true) {
    this.sprite.flipX = false;
  }
  this.isActive = false;
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.updatePositions();
};

LeverPulse.prototype.resetLevel = function () {
  this.reset();
  this.alive = true;
};

LeverPulse.prototype.updatePositions = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

LeverPulse.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  this.pulseBlocks = null;
  _super.prototype.destroy.call(this);
};

var _LeverPulse = LeverPulse;

function LeverPulse(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "lever 10000");
  e.add(i.sprite);
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 46, 26).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-23, -13));
  return i;
}

exports.LeverPulse = _LeverPulse;
