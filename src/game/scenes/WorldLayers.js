// scenes/WorldLayers.js — recovered from webpack module #110 of the original vex7.min.js
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

exports.WorldLayers = undefined;

var BasicScene_1 = require("./BasicScene"),
  data_1 = require("../data"),
  CustomResize_1 = require("../utils/CustomResize"),
  effects_1 = require("../effects"),
  GameKeys_1 = require("../input/GameKeys"),
  PanelManager_1 = require("../ui/panels/PanelManager"),
  hud_1 = require("../ui/hud"),
  DailyTask_1 = require("../system/DailyTask"),
  SkinsData_1 = require("../system/SkinsData"),
  BalanceData_1 = require("../system/BalanceData"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  system_1 = require("../system"),
  ParticleManager_1 = require("../effects/ParticleManager"),
  Achievements_1 = require("../system/Achievements"),
  subscenes_1 = require("../subscenes");

_super = BasicScene_1.BasicScene;

__extends(WorldLayers, _super);

WorldLayers.prototype.init = function () {
  var t = data_1.Jsons.getJson(this, "balance");
  DailyTask_1.DailyTask.init(this, t.dailyRewardCoins, t.dailyTaskCollectCoins);
  SkinsData_1.SkinsData.init(t.skinsPrice, t.skinRareIDs, t.skinIDs);
  SkinsData_1.SkinsData.checkFreeSkin(t.skinsFree);
  system_1.Achievements.init(this);
  this.cameras.main.setBackgroundColor(16777215);
  this.canShowPanel = true;
  this.countDeath = 0;
  this.input.addPointer(2);
  this.background = new Phaser.GameObjects.TileSprite(
    this,
    0,
    0,
    CustomResize_1.CustomResize.MaxCanvasW,
    CustomResize_1.CustomResize.MaxCanvasH,
    data_1.Atlases.gameplay,
    "bgPattern 10000",
  );
  this.background.setOrigin(0, 0);
  this.add.existing(this.background);
  this.setBackgrounColor();
  this.cameraGroup = this.add.container();
  this.layerUnderPool = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerUnderPool);
  this.layerPool = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerPool);
  this.layerObstacle = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerObstacle);
  this.layerBlocks = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerBlocks);
  this.layerTopObstacle = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerTopObstacle);
  this.particleManager = new ParticleManager_1.ParticleManager(this);
  this.cameraGroup.add(this.particleManager);
  this.layerText = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerText);
  this.layerSpine = this.make.spineContainer({});
  this.cameraGroup.add(this.layerSpine);
  this.layerPlayer = new Phaser.GameObjects.Container(this);
  this.cameraGroup.add(this.layerPlayer);
  this.effectsOverlay = new effects_1.Overlays(this, this.cameraGroup);
  this.guiLayer = this.add.container();
  this.guiLayer.depth = 5;
  this.keys = new GameKeys_1.GameKeys(this, this.guiLayer);
  this.keys.hide();
  this.achievements = new hud_1.PAchievement(this);
  this.guiLayer.add(this.achievements);
  this.panelManager = new PanelManager_1.PanelManager(this);
  this.guiLayer.add(this.panelManager);
  this.transition = new effects_1.Transition(this);
  this.guiLayer.add(this.transition);
  this.initResize();
};

WorldLayers.prototype.setBackgrounColor = function () {};

WorldLayers.prototype.showSubScene = function (t, e) {
  DailyTask_1.DailyTask.stopTimer();
  this.panelManager.reset();
  this.tweens.killAll();
  this.currSubScene = t;
  if (this.subScene) {
    this.subScene.destroy();
    this.subScene = null;
  }
  if (t === SubSceneList_1.SubSceneList.Menu) {
    this.subScene = new subscenes_1.SubMenu(this);
  } else if (t === SubSceneList_1.SubSceneList.Hub) {
    this.subScene = new subscenes_1.SubHub(this);
  } else if (t === SubSceneList_1.SubSceneList.Act) {
    this.subScene = new subscenes_1.SubAct(this);
  } else if (t === SubSceneList_1.SubSceneList.Vex) {
    this.subScene = new subscenes_1.SubVex(this);
  } else if (t === SubSceneList_1.SubSceneList.Tower) {
    this.subScene = new subscenes_1.SubTower(this);
  } else if (t === SubSceneList_1.SubSceneList.SkinsRarity) {
    this.subScene = new subscenes_1.SubSkinsRarity(this);
  } else if (t === SubSceneList_1.SubSceneList.SkinsSelect) {
    this.subScene = new subscenes_1.SubSkinsSelect(this);
  }
  this.subScene.init(e);
  this.guiLayer.addAt(this.subScene, 0);
  this.subScene.resize();
};

WorldLayers.prototype.isTower = function () {
  return this.currSubScene === SubSceneList_1.SubSceneList.Tower;
};

WorldLayers.prototype.update = function () {
  if (this.subScene) {
    this.subScene.update();
  }
  this.panelManager.update();
  this.transition.update();
  if (this.transition.visible === false) {
    this.achievements.update();
  }
};

WorldLayers.prototype.updateParallax = function () {
  if (BalanceData_1.BalanceData.parallax === true) {
    this.background.tilePositionX = -this.cameraX / 10;
    this.background.tilePositionY = -this.cameraY / 10;
  } else {
    this.background.tilePositionX = 0;
    this.background.tilePositionY = 0;
  }
};

WorldLayers.prototype.moveBackground = function (t, e) {
  this.background.tilePositionX += t;
  this.background.tilePositionY += e;
};

WorldLayers.prototype.backgroundStaticPos = function () {
  this.background.tilePositionX = -this.cameraX;
  this.background.tilePositionY = -this.cameraY;
};

WorldLayers.prototype.resize = function () {
  CustomResize_1.CustomResize.resizeContainer(this.guiLayer);
  if (this.subScene) {
    this.subScene.resize();
  }
  this.panelManager.resize();
  this.transition.resize();
  this.achievements.resize();
  this.keys.resize();
};

WorldLayers.prototype.resetLevel = function (t) {};

WorldLayers.prototype.playerDeath = function (t, e, i, n) {
  if (this.currSubScene !== SubSceneList_1.SubSceneList.Menu)
    if (
      ((this.currentDeaths += 1),
      BalanceData_1.BalanceData.autoRestart === true &&
        this.currentDeaths >= this.currentLevel.getTargetDeath(this.isCurrLevelHard))
    )
      this.resetLevel();
    else {
      if (
        ((BalanceData_1.BalanceData.totalDeaths += 1),
        BalanceData_1.BalanceData.totalDeaths >= 100 &&
          system_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.death),
        this.currSubScene === SubSceneList_1.SubSceneList.Hub
          ? this.subScene.updateDeaths(BalanceData_1.BalanceData.totalDeaths)
          : this.subScene.updateDeaths(this.currentDeaths),
        system_1.SaveGame.getInstance().saveProgress(),
        t === false
          ? system_1.SoundManager.playSFX("death" + (Math.random() < 0.5 ? 1 : 2))
          : system_1.SoundManager.playSFX("electricity"),
        BalanceData_1.BalanceData.noBlood === false)
      ) {
        for (var s = 0; s < 5; s++)
          this.particleManager.createColorParticle(
            e + 10 * Math.random() - 5,
            i - n * Math.random(),
            10 * Math.random() - 5,
            -10 * Math.random(),
            16711680,
          );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-head 10000",
        );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-body 10000",
          2 * Math.random() * Math.PI,
          8 * Math.random() - 4,
        );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-arm 10000",
          2 * Math.random() * Math.PI,
          8 * Math.random() - 4,
        );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-arm 10000",
          2 * Math.random() * Math.PI,
          8 * Math.random() - 4,
        );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-leg 10000",
          2 * Math.random() * Math.PI,
          8 * Math.random() - 4,
        );
        this.particleManager.createPlayerGib(
          e + 10 * Math.random() - 5,
          i - n * Math.random(),
          10 * Math.random() - 5,
          -10 * Math.random(),
          "player-leg 10000",
          2 * Math.random() * Math.PI,
          8 * Math.random() - 4,
        );
      } else this.effectsOverlay.explode();
      this.reset();
      if (this.canShowPanel === true && ((this.countDeath += 1), this.countDeath === 3)) {
        this.countDeath = 0;
        this.showPanelAreYouOK();
      }
    }
};

WorldLayers.prototype.reset = function () {};

WorldLayers.prototype.setCanShowPanelAreYouOK = function () {
  this.canShowPanel = true;
};

WorldLayers.prototype.showPanelAreYouOK = function () {
  var t = this;
  this.panelManager.show(PanelManager_1.PanelList.PanelAreYouOk);
  this.canShowPanel = false;
  setTimeout(function () {
    return t.setCanShowPanelAreYouOK();
  }, 6e4);
};

Object.defineProperty(WorldLayers.prototype, "cameraZoom", {
  get: function () {
    return this._cameraZoom;
  },
  set: function (t) {
    if (this._cameraZoom !== t) {
      this._cameraZoom = t;
      this.cameraGroup.scale = this._cameraZoom;
    }
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(WorldLayers.prototype, "cameraX", {
  get: function () {
    return this._cameraX;
  },
  set: function (t) {
    this._cameraX = t;
    this.cameraGroup.x = -this._cameraX * this._cameraZoom + this.getGameHalfWidth();
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(WorldLayers.prototype, "cameraY", {
  get: function () {
    return this._cameraY;
  },
  set: function (t) {
    this._cameraY = t;
    this.cameraGroup.y = -this._cameraY * this._cameraZoom + this.getGameHalfHeight();
  },
  enumerable: false,
  configurable: true,
});

WorldLayers.prototype.setCameraZero = function () {
  this._cameraX = 0;
  this._cameraY = 0;
  this.cameraGroup.x = 0;
  this.cameraGroup.y = 0;
};

WorldLayers.prototype.inCameraView = function (t, e, i, n) {
  var s = this.getGameHalfWidth() / this._cameraZoom,
    r = this.getGameHalfHeight() / this._cameraZoom,
    o = this._cameraX - s,
    s = this._cameraX + s,
    a = this._cameraY - r,
    r = this._cameraY + r;
  return !(e < o || s < t || n < a || r < i);
};

WorldLayers.prototype.getGameWidth = function () {
  return CustomResize_1.CustomResize.CanvasW;
};

WorldLayers.prototype.getGameHeight = function () {
  return CustomResize_1.CustomResize.CanvasH;
};

WorldLayers.prototype.getGameHalfWidth = function () {
  return CustomResize_1.CustomResize.CanvasHalfW;
};

WorldLayers.prototype.getGameHalfHeight = function () {
  return CustomResize_1.CustomResize.CanvasHalfH;
};

var _WorldLayers = WorldLayers;

function WorldLayers() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t._cameraZoom = 1;
  return t;
}

exports.WorldLayers = _WorldLayers;
