// subscenes/SubHub.js — recovered from webpack module #205 of the original vex7.min.js
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

exports.SubHub = undefined;

var BasicSubGamePlay_1 = require("./BasicSubGamePlay"),
  system_1 = require("../system"),
  Helpers_1 = require("../utils/Helpers"),
  hud_1 = require("../ui/hud");

_super = BasicSubGamePlay_1.BasicSubGamePlay;

__extends(SubHub, _super);

SubHub.prototype.init = function () {
  _super.prototype.init.call(this);
  this.level = new hud_1.PLevel(this.scene, this.scene.currentLevel.getName());
  this.add(this.level);
  this.time = new hud_1.PTimeHub(this.scene);
  this.add(this.time);
};

SubHub.prototype.updateDeaths = function (t) {
  this.level.setDeath(t);
};

SubHub.prototype.updateTime = function () {
  this.time.updateTime(Helpers_1.Helpers.timeDecoratorHub(Date.now() - system_1.BalanceData.levelMapStartTime));
};

SubHub.prototype.updateMoney = function (t) {
  this.time.updateCoins();
};

SubHub.prototype.resize = function () {
  _super.prototype.resize.call(this);
  this.level.resize();
  this.time.resize();
};

SubHub.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.level = null;
  this.time = null;
};

var _SubHub = SubHub;

function SubHub() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubHub = _SubHub;
