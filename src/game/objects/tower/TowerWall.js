// objects/tower/TowerWall.js — recovered from webpack module #247 of the original vex7.min.js
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

exports.TowerWall = undefined;

var system_1 = require("../../system");

_super = require("../blocks/BasicBlock").BasicBlock;

__extends(TowerWall, _super);

TowerWall.prototype.spawn = function (t) {
  _super.prototype.spawn.call(this, {
    x: (system_1.BalanceData.config_TowerWallWidth / 2 + 25) * t,
    y: 0,
    width: 50,
    height: 3e3,
  });
  this.nextY = this.nextYStep;
};

TowerWall.prototype.update = function () {
  var t = this.main.player.yPos;
  if (t >= this.nextY) {
    this.yPos = t;
    this.nextY += this.nextYStep;
  }
  _super.prototype.update.call(this);
};

TowerWall.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.yPos = this.startY;
  this.nextY = this.nextYStep;
  this.updatePosition();
};

TowerWall.prototype.resetLevel = function () {
  this.reset();
};

var _TowerWall = TowerWall;

function TowerWall(t, e) {
  t = _super.call(this, t, e) || this;
  t.nextY = 0;
  t.nextYStep = 1e3;
  t.type = "towerWall";
  return t;
}

exports.TowerWall = _TowerWall;
