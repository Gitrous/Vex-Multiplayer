// ui/panels/PanelManager.js — recovered from webpack module #21 of the original vex7.min.js
"use strict";

var n,
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

exports.PanelManager = exports.PanelList = undefined;

var PanelList,
  _super,
  data_1 = require("../../data"),
  CustomResize_1 = require("../../utils/CustomResize"),
  panels_1 = require(".");

(_tmp = PanelList = exports.PanelList || (exports.PanelList = {}))[(_tmp.NoOne = 0)] = "NoOne";

_tmp[(_tmp.PanelOptionsMenu = 1)] = "PanelOptionsMenu";

_tmp[(_tmp.PanelOptionsHub = 2)] = "PanelOptionsHub";

_tmp[(_tmp.PanelTrophies = 3)] = "PanelTrophies";

_tmp[(_tmp.PanelPause = 4)] = "PanelPause";

_tmp[(_tmp.PanelActSelect = 5)] = "PanelActSelect";

_tmp[(_tmp.PanelLevelComplete = 6)] = "PanelLevelComplete";

_tmp[(_tmp.PanelLevelObjectives = 7)] = "PanelLevelObjectives";

_tmp[(_tmp.PanelDailyTasks = 8)] = "PanelDailyTasks";

_tmp[(_tmp.PanelAreYouOk = 9)] = "PanelAreYouOk";

_tmp[(_tmp.PanelLanguages = 10)] = "PanelLanguages";

_tmp[(_tmp.PanelTowerComplete = 11)] = "PanelTowerComplete";

_tmp[(_tmp.PanelTowerDefeat = 12)] = "PanelTowerDefeat";

_tmp[(_tmp.PanelPowerUp = 13)] = "PanelPowerUp";

_tmp[(_tmp.PanelFreeSkin = 14)] = "PanelFreeSkin";

_super = Phaser.GameObjects.Container;

__extends(PanelManager, _super);

PanelManager.prototype.getPanel = function (t) {
  switch (t) {
    case PanelList.PanelOptionsMenu:
      return new panels_1.PanelOptionsMenu(this.scene);
    case PanelList.PanelOptionsHub:
      return new panels_1.PanelOptionsHub(this.scene);
    case PanelList.PanelTrophies:
      return new panels_1.PanelTrophies(this.scene);
    case PanelList.PanelPause:
      return new panels_1.PanelPause(this.scene);
    case PanelList.PanelActSelect:
      return new panels_1.PanelActSelect(this.scene);
    case PanelList.PanelLevelComplete:
      return new panels_1.PanelLevelComplete(this.scene);
    case PanelList.PanelLevelObjectives:
      return new panels_1.PanelLevelObjectives(this.scene);
    case PanelList.PanelDailyTasks:
      return new panels_1.PanelDailyTasks(this.scene);
    case PanelList.PanelAreYouOk:
      return new panels_1.PanelAreYouOk(this.scene);
    case PanelList.PanelLanguages:
      return new panels_1.PanelLanguages(this.scene);
    case PanelList.PanelTowerComplete:
      return new panels_1.PanelTowerComplete(this.scene);
    case PanelList.PanelTowerDefeat:
      return new panels_1.PanelTowerDefeat(this.scene);
    case PanelList.PanelPowerUp:
      return new panels_1.PanelPowerUp(this.scene);
    case PanelList.PanelFreeSkin:
      return new panels_1.PanelFreeSkin(this.scene);
    default:
      return null;
  }
};

PanelManager.prototype.isExist = function (t) {
  return !!this.stock[t];
};

PanelManager.prototype.show = function (t, e) {
  if (!this.stock[t]) {
    (i = this.getPanel(t)).init(e);
    i.resize();
    this.add(i);
    this.stock[t] = i;
    i = null;
  }
  var i,
    e = this.currentPanel;
  if (this.currentPanel !== PanelList.NoOne) {
    this.hide(this.currentPanel);
  }
  this.prevPanel = e;
  this.currentPanel = t;
  this.stock[t].show();
  this.visible = true;
};

PanelManager.prototype.custom = function (t, e) {
  if (this.stock[t]) {
    this.stock[t].custom(e);
  }
};

PanelManager.prototype.hide = function (t) {
  if (
    this.stock[t] &&
    ((this.currentPanel = PanelList.NoOne), this.stock[t].hide(), this.hideThis(), this.prevPanel !== PanelList.NoOne)
  ) {
    this.show(this.prevPanel);
    this.prevPanel = PanelList.NoOne;
  }
};

PanelManager.prototype.hideThis = function () {
  this.visible = false;
};

PanelManager.prototype.hideCurrent = function () {
  this.hide(this.currentPanel);
};

PanelManager.prototype.clickOnBlack = function () {
  this.stock[this.currentPanel].clikcOnBlack();
};

PanelManager.prototype.hideAll = function () {
  for (var t = 0, e = Object.keys(this.stock); t < e.length; t++) {
    var i = e[t];
    this.stock[i].hide();
  }
  this.hideThis();
  this.currentPanel = PanelList.NoOne;
  this.prevPanel = PanelList.NoOne;
};

PanelManager.prototype.update = function () {
  if (this.visible !== false)
    for (var t = 0, e = Object.keys(this.stock); t < e.length; t++) {
      var i = e[t];
      this.stock[i].update();
    }
};

PanelManager.prototype.resize = function () {
  for (var t = 0, e = Object.keys(this.stock); t < e.length; t++) {
    var i = e[t];
    this.stock[i].resize();
  }
  CustomResize_1.CustomResize.scaleFitScreen(this.black);
};

PanelManager.prototype.removePanel = function (t) {
  this.stock[t].destroy();
  this.remove(this.stock[t]);
  delete this.stock[t];
};

PanelManager.prototype.reset = function () {
  for (var t = 0, e = Object.keys(this.stock); t < e.length; t++) {
    var i = e[t];
    this.removePanel(i);
  }
  if (!(this.stock = {}) === this.notHideBlackAfterReset) {
    this.hideThis();
  }
  this.notHideBlackAfterReset = false;
  this.currentPanel = PanelList.NoOne;
  this.prevPanel = PanelList.NoOne;
};

PanelManager.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.stock = null;
  this.black = null;
  this.prevPanel = null;
  this.currentPanel = null;
};

var _tmp = PanelManager;

function PanelManager(t) {
  var e = _super.call(this, t) || this;
  e.notHideBlackAfterReset = false;
  e.stock = {};
  e.currentPanel = PanelList.NoOne;
  e.prevPanel = PanelList.NoOne;
  e.black = new Phaser.GameObjects.Rectangle(
    t,
    data_1.Constants.GHW,
    data_1.Constants.GHH,
    data_1.Constants.UI_WIDTH,
    data_1.Constants.UI_HEIGHT,
    0,
    0.6,
  );
  e.black.setInteractive();
  e.black.on(Phaser.Input.Events.POINTER_DOWN, e.clickOnBlack, e);
  e.add(e.black);
  e.hideThis();
  return e;
}

exports.PanelManager = _tmp;
