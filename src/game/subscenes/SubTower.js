// subscenes/SubTower.js — recovered from webpack module #207 of the original vex7.min.js
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

exports.SubTower = undefined;

var BasicSubGamePlay_1 = require("./BasicSubGamePlay"),
  BalanceData_1 = require("../system/BalanceData"),
  Helpers_1 = require("../utils/Helpers"),
  hud_1 = require("../ui/hud");

_super = BasicSubGamePlay_1.BasicSubGamePlay;

__extends(SubTower, _super);

SubTower.prototype.init = function () {
  _super.prototype.init.call(this);
  this.level = new hud_1.PLevelTower(this.scene, "Tower");
  this.add(this.level);
  this.time = new hud_1.PTimeTower(this.scene);
  this.add(this.time);
};

SubTower.prototype.enterLevel = function (t) {
  this.resetLevel();
  if (t === true) {
    this.time.updateTime(Helpers_1.Helpers.timeDecorator(Date.now() - BalanceData_1.BalanceData.actStartTime));
  } else {
    this.time.updateTime("00:00:00");
  }
  this.updateDeaths(0);
};

SubTower.prototype.updateTime = function () {
  var t = Date.now() - BalanceData_1.BalanceData.actStartTime;
  this.time.updateTime(Helpers_1.Helpers.timeDecorator(t));
};

SubTower.prototype.updateMoney = function (t) {
  this.time.setCoins(t);
};

SubTower.prototype.getTime = function () {
  return this.time.getTime();
};

SubTower.prototype.resize = function () {
  _super.prototype.resize.call(this);
  this.level.resize();
  this.time.resize();
};

SubTower.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.level = null;
  this.time = null;
};

var _SubTower = SubTower;

function SubTower() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubTower = _SubTower;
