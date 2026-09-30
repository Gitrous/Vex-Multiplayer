// subscenes/SubVex.js — recovered from webpack module #208 of the original vex7.min.js
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

exports.SubVex = undefined;

var BasicSubGamePlay_1 = require("./BasicSubGamePlay"),
  data_1 = require("../data"),
  BalanceData_1 = require("../system/BalanceData"),
  Helpers_1 = require("../utils/Helpers"),
  PanelManager_1 = require("../ui/panels/PanelManager"),
  hud_1 = require("../ui/hud");

_super = BasicSubGamePlay_1.BasicSubGamePlay;

__extends(SubVex, _super);

SubVex.prototype.init = function () {
  _super.prototype.init.call(this);
  this.level = new hud_1.PLevel(this.scene, this.scene.currentLevel.getName());
  this.add(this.level);
  this.time = new hud_1.PTimeAct(this.scene);
  this.add(this.time);
  this.tnt = new hud_1.PTNT(this.scene);
  this.add(this.tnt);
};

SubVex.prototype.enterLevel = function (t) {
  this.resetLevel();
  if (t === true) {
    this.time.updateTime(Helpers_1.Helpers.timeDecorator(Date.now() - BalanceData_1.BalanceData.actStartTime));
  } else {
    this.time.updateTime("00:00:00");
  }
  this.updateDeaths(0);
  this.scene.panelManager.show(PanelManager_1.PanelList.PanelLevelObjectives);
};

SubVex.prototype.updateDeaths = function (t) {
  this.level.setDeath(t);
};

SubVex.prototype.updateTime = function () {
  var t = Date.now() - BalanceData_1.BalanceData.actStartTime;
  this.time.updateTime(Helpers_1.Helpers.timeDecorator(t));
};

SubVex.prototype.updateMoney = function (t) {
  this.time.setCoins(t);
};

SubVex.prototype.getTime = function () {
  return this.time.getTime();
};

SubVex.prototype.updateProgressTnt = function (t) {
  this.tnt.setTnt(t);
};

SubVex.prototype.resize = function () {
  _super.prototype.resize.call(this);
  this.level.x = -data_1.Constants.UI_SHIFT_X;
  this.level.y = -data_1.Constants.UI_SHIFT_Y;
  this.time.x = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X;
  this.time.y = -data_1.Constants.UI_SHIFT_Y;
  this.tnt.y = this.time.y;
};

SubVex.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.level = null;
  this.time = null;
  this.tnt = null;
};

var _SubVex = SubVex;

function SubVex() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubVex = _SubVex;
