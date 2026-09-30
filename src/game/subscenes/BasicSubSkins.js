// subscenes/BasicSubSkins.js — recovered from webpack module #47 of the original vex7.min.js
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

exports.BasicSubSkins = undefined;

var BasicSubScene_1 = require("./BasicSubScene"),
  system_1 = require("../system"),
  BalanceData_1 = require("../system/BalanceData"),
  SaveGame_1 = require("../system/SaveGame"),
  hud_1 = require("../ui/hud");

_super = BasicSubScene_1.BasicSubScene;

__extends(BasicSubSkins, _super);

BasicSubSkins.prototype.init = function () {
  _super.prototype.init.call(this);
  this.title = new hud_1.PSkinTitle(this.scene);
  this.add(this.title);
  this.coins = new hud_1.PSkinMoney(this.scene);
  this.add(this.coins);
  this.spineContainer = this.scene.make.spineContainer({});
  this.add(this.spineContainer);
};

BasicSubSkins.prototype.moveSpineContainerTop = function () {
  this.moveTo(this.spineContainer, this.length - 1);
};

BasicSubSkins.prototype.back = function () {
  this.scene.backFromSubSkin();
};

BasicSubSkins.prototype.addMoney = function (t, e) {
  if (system_1.SkinsData.isTowerRarity(e) === true) {
    BalanceData_1.BalanceData.totalTowerMoney += t;
  } else {
    BalanceData_1.BalanceData.totalMoney += t;
  }
  this.coins.updateCoins();
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

BasicSubSkins.prototype.resize = function () {
  this.title.resize();
  this.coins.resize();
};

BasicSubSkins.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.title = null;
  this.coins = null;
  this.spineContainer = null;
};

var _BasicSubSkins = BasicSubSkins;

function BasicSubSkins() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BasicSubSkins = _BasicSubSkins;
