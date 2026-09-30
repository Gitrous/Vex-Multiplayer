// main.js — recovered from webpack module #76 of the original vex7.min.js
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

exports.Game = undefined;

require("./lib/phaser");

var scenes_1 = require("./scenes"),
  data_1 = require("./data"),
  CustomResize_1 = require("./utils/CustomResize"),
  render_1 = require("./render"),
  NativeChanges_1 = require("./lib/NativeChanges"),
  AzerionSDK_1 = require("./sdk/AzerionSDK");

_super = Phaser.Game;

__extends(Game, _super);

Game.prototype.initScenes = function () {
  this.scene.add(scenes_1.Boot.Name, scenes_1.Boot);
  this.scene.add(scenes_1.World.Name, scenes_1.World);
  this.scene.start(scenes_1.Boot.Name);
};

var _Game = Game;

function Game() {
  var t = this;
  CustomResize_1.CustomResize.init();
  NativeChanges_1.NativeChanges.addDelay(11);
  NativeChanges_1.NativeChanges.setBitmapTextSize();
  NativeChanges_1.NativeChanges.deleteInstanceFromAtlasJSON();
  NativeChanges_1.NativeChanges.strokePath();
  t =
    _super.call(this, {
      parent: data_1.Constants.DIV_ID,
      title: data_1.Constants.GAME_NAME,
      disableContextMenu: true,
      type: Phaser.AUTO,
      scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.CENTER_BOTH },
      plugins: { scene: [{ key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" }] },
      clearBeforeRender: false,
      batchSize: 256,
      powerPreference: "high-performance",
    }) || this;
  render_1.JDRender.init(t);
  if (t.device.os.desktop === false) {
    data_1.Constants.IS_MOBILE = true;
    data_1.Constants.GW = 1280;
    data_1.Constants.GH = 720;
    data_1.Constants.UI_ADDITIONAL_TOP_PANELS_SCALE = 1.3;
    data_1.Constants.UI_ADDITIONAL_PANELS_SCALE = 1.18;
  } else {
    data_1.Constants.IS_MOBILE = false;
  }
  CustomResize_1.CustomResize.setGameSize(data_1.Constants.GW, data_1.Constants.GH);
  CustomResize_1.CustomResize.setMaxCanvasSize(1.5 * data_1.Constants.GW, 1.5 * data_1.Constants.GH);
  CustomResize_1.CustomResize.refresh(t);
  AzerionSDK_1.AzerionSDK.init(
    t,
    function () {
      return t.initScenes();
    },
    true,
  );
  return t;
}

new (exports.Game = _Game)();
