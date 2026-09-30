// scenes/Boot.js — recovered from webpack module #80 of the original vex7.min.js
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

exports.Boot = undefined;

var BasicScene_1 = require("./BasicScene"),
  data_1 = require("../data"),
  scenes_1 = require("."),
  Localization_1 = require("../system/Localization"),
  SaveGame_1 = require("../system/SaveGame"),
  AzerionSDK_1 = require("../sdk/AzerionSDK"),
  system_1 = require("../system");

_super = BasicScene_1.BasicScene;

__extends(Boot, _super);

Boot.prototype.preload = function () {
  this.load.on(Phaser.Loader.Events.PROGRESS, this.onLoadProgress, this);
  this.preBoot();
  this.prePreloader();
};

Boot.prototype.preBoot = function () {
  var e = this;
  data_1.Jsons.initLocales();
  data_1.Jsons.preloadList.forEach(function (t) {
    e.load.json(t, "assets/jsons/" + t + ".json");
  });
  data_1.Images.preloadList.forEach(function (t) {
    e.load.image(t, "assets/images/" + t + ".png");
  });
  data_1.Atlases.preloadList.forEach(function (t) {
    e.load.atlas(t, "assets/atlases/" + t + ".png", "assets/atlases/" + t + ".json");
  });
  data_1.Sounds.preloadList.forEach(function (t) {
    if (e.game.device.os.iOS) {
      e.load.audio(t, ["assets/sounds/" + t + ".m4a"]);
    } else {
      e.load.audio(t, ["assets/sounds/" + t + ".ogg", "assets/sounds/" + t + ".mp3"]);
    }
  });
};

Boot.prototype.prePreloader = function () {
  var e = this;
  data_1.Fonts.list.forEach(function (t) {
    e.load.bitmapFont(t, "assets/fonts/" + t + ".png", "assets/fonts/" + t + ".fnt");
  });
  data_1.Jsons.list.forEach(function (t) {
    e.load.json(t, "assets/jsons/" + t + ".json?version=" + window._azerionIntegration.build.version);
  });
  data_1.Images.list.forEach(function (t) {
    e.load.image(t, "assets/images/" + t + ".png");
  });
  data_1.Atlases.list.forEach(function (t) {
    e.load.atlas(t, "assets/atlases/" + t + ".png", "assets/atlases/" + t + ".json");
  });
  data_1.Spines.list.forEach(function (t) {
    e.load.spine(t, "assets/spine/" + t + ".json", "assets/spine/" + t + ".atlas", true);
  });
  data_1.Sounds.list.forEach(function (t) {
    if (e.game.device.os.iOS) {
      e.load.audio(t, ["assets/sounds/" + t + ".m4a"]);
    } else {
      e.load.audio(t, ["assets/sounds/" + t + ".ogg", "assets/sounds/" + t + ".mp3"]);
    }
  });
};

Boot.prototype.create = function () {
  var t = this;
  AzerionSDK_1.AzerionSDK.removeSplashLoader(function () {
    return t.startGame();
  });
};

Boot.prototype.onLoadProgress = function (t) {
  AzerionSDK_1.AzerionSDK.onLoadProgress(t);
};

Boot.prototype.startGame = function () {
  var e = this;
  SaveGame_1.SaveGame.getInstance();
  Localization_1.Localization.load();
  data_1.Constants.AVAILABLE_LANGUAGES.forEach(function (t) {
    Localization_1.Localization.add(t, data_1.Jsons.getJson(e, "locale_" + t));
  });
  Localization_1.Localization.add("en_no_blood", data_1.Jsons.getJson(this, "locale_en_no_blood"));
  this.showPreloader();
};

Boot.prototype.showPreloader = function () {
  system_1.DetectNoBlood.detect(this);
  system_1.TexturesEdit.init(this);
  system_1.SoundManager.init(this.game);
  this.scene.start(scenes_1.World.Name);
};

Boot.Name = "boot";

var _Boot = Boot;

function Boot() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.Boot = _Boot;
