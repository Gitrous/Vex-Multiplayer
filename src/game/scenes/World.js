// scenes/World.js — recovered from webpack module #39 of the original vex7.min.js
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

exports.World = exports.GameStates = undefined;

var GameStates,
  _super,
  WorldCreator_1 = require("./WorldCreator"),
  BalanceData_1 = require("../system/BalanceData"),
  SaveGame_1 = require("../system/SaveGame"),
  PanelManager_1 = require("../ui/panels/PanelManager"),
  SoundManager_1 = require("../system/SoundManager"),
  Achievements_1 = require("../system/Achievements"),
  DailyTask_1 = require("../system/DailyTask"),
  Tools_1 = require("../utils/Tools"),
  data_1 = require("../data"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  obstacles_1 = require("../objects/obstacles"),
  Helpers_1 = require("../utils/Helpers"),
  AzerionSDK_1 = require("../sdk/AzerionSDK"),
  Multiplayer_1 = require("../multiplayer/Multiplayer");

(_tmp = GameStates = exports.GameStates || (exports.GameStates = {}))[(_tmp.Loading = 0)] = "Loading";

_tmp[(_tmp.Playing = 1)] = "Playing";

_tmp[(_tmp.MainMenu = 2)] = "MainMenu";

_tmp[(_tmp.Skins = 3)] = "Skins";

_tmp[(_tmp.Pause = 4)] = "Pause";

_super = WorldCreator_1.WorldCreator;

__extends(World, _super);

World.prototype.create = function () {
  _super.prototype.create.call(this);
  this.firstSpawn = false;
  this.currLevelID = BalanceData_1.BalanceData.mainmenuID;
  this.state = GameStates.MainMenu;
  if (this.skipMenu === true) {
    this.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
  } else {
    this.showSubMenu();
  }
  this.game.events.on(Phaser.Core.Events.BLUR, this.onFocusLost, this);
  this.game.events.on(Phaser.Core.Events.FOCUS, this.onFocusFound, this);
  this.multiplayer = Multiplayer_1.Multiplayer.attach(this, GameStates);
  if (!this.multiplayer) {
    // Debug shortcut from the original game; it would let anybody win a race.
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).on("down", this.finishLevel, this);
  }
};

World.prototype.showPanelTrophies = function () {
  this.pauseState();
  this.panelManager.show(PanelManager_1.PanelList.PanelTrophies);
};

World.prototype.showPanelDailyTask = function () {
  this.pauseState();
  this.panelManager.show(PanelManager_1.PanelList.PanelDailyTasks);
};

World.prototype.showSubSceneTransition = function (t, e, i) {
  if (this.multiplayer && this.multiplayer.flow.interceptTransition(t, e, i)) {
    return;
  }
  if (e === undefined) {
    e = -1;
  }
  if (i === undefined) {
    i = false;
  }
  if (this.transition.visible !== true) {
    if (t === SubSceneList_1.SubSceneList.Menu) {
      this.transition.beginTransition(this.showSubMenu, this);
    } else if (t === SubSceneList_1.SubSceneList.Hub) {
      this.preparePlayingScene();
      this.transition.beginTransition(this.showSubHub, this);
    } else if (t === SubSceneList_1.SubSceneList.Act) {
      this.preparePlayingScene();
      this.transition.beginTransition(this.showSubAct, this, e, i);
    } else if (t === SubSceneList_1.SubSceneList.Tower) {
      this.preparePlayingScene();
      this.transition.beginTransition(this.showSubTower, this, this.firstSession === true ? 0 : e);
    } else if (t === SubSceneList_1.SubSceneList.Vex) {
      this.preparePlayingScene();
      this.transition.beginTransition(this.showSubVex, this, e, i);
    } else if (t === SubSceneList_1.SubSceneList.SkinsRarity) {
      this.transition.beginTransition(this.showSubSkinRarity, this, e);
    }
    this.state = GameStates.Loading;
  }
};

World.prototype.backFromSubSkin = function () {
  if (this.prevLevelID === BalanceData_1.BalanceData.mainmenuID) {
    this.showSubSceneTransition(SubSceneList_1.SubSceneList.Menu);
  } else if (this.prevLevelID === BalanceData_1.BalanceData.hubID) {
    this.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
  } else {
    this.showSubSceneTransition(SubSceneList_1.SubSceneList.Act, Number(this.prevLevelID), this.isCurrLevelHard);
  }
};

World.prototype.showSubSkinRarity = function (t) {
  this.resetSubScene();
  this.keys.hide();
  this.currLevelID = "skin" + t;
  this.state = GameStates.Skins;
  this.showSubScene(SubSceneList_1.SubSceneList.SkinsRarity);
};

World.prototype.showSubMenu = function () {
  SaveGame_1.SaveGame.getInstance().saveProgress();
  this.resetSubScene();
  this.keys.show();
  this.state = GameStates.MainMenu;
  this.showSubScene(SubSceneList_1.SubSceneList.Menu);
};

World.prototype.resetSubScene = function () {
  this.prevLevelID = this.currLevelID;
  this.destroyLevel();
  this.timerLive = false;
  this.currLevelID = BalanceData_1.BalanceData.mainmenuID;
  this.setCameraZero();
  this.zoomTo(1, true);
  this.backgroundStaticPos();
};

World.prototype.preparePlayingScene = function () {
  this.lookingAround = false;
  if (!BalanceData_1.BalanceData.levelMapStartTime) {
    BalanceData_1.BalanceData.levelMapStartTime = Date.now();
  }
  SaveGame_1.SaveGame.getInstance().saveProgress();
  if (this.state === GameStates.MainMenu) {
    this.prevLevelID = BalanceData_1.BalanceData.mainmenuID;
  } else {
    this.prevLevelID = this.currLevelID;
    if (!(
      this.currSubScene !== SubSceneList_1.SubSceneList.Hub && this.prevLevelID === BalanceData_1.BalanceData.mainmenuID
    )) {
      this.prevLevelID = this.currLevelID;
    }
  }
};

World.prototype.beforeStartPlayingScene = function (t, e) {
  if (
    this.currLevelID !== BalanceData_1.BalanceData.mainmenuID &&
    this.prevLevelID === BalanceData_1.BalanceData.hubID
  ) {
    SaveGame_1.SaveGame.getInstance().removeCheckPoint();
  }
  if (this.prevLevelID !== BalanceData_1.BalanceData.mainmenuID) {
    this.prevLevelID = this.currLevelID;
  }
  this.isCurrLevelHard = e;
  this.currLevelID = "" + t;
  this.currentLevel = this.getLevel(this.currLevelID);
  this.effectsOverlay.hideFlash();
  this.destroyLevel();
};

World.prototype.startPlayingScene = function (t) {
  this.resetVars();
  this.towerEndY = 0;
  this.createLevelPlayerSpawn(t === false ? this.currentLevel.data : this.currentLevel.dataHard);
  this.startPlayingSceneNoCreateLevel();
};

World.prototype.startPlayingSceneNoCreateLevel = function () {
  this.firstSpawn = false;
  this.timerLive = false;
  this.currentTime = null;
  this.currentDeaths = 0;
  this.currentMoney = 0;
  this.state = GameStates.Playing;
  this.keys.show();
  if (BalanceData_1.BalanceData.levelsCompleted === 0) {
    this.keys.setAlpha(0.8);
  } else if (BalanceData_1.BalanceData.levelsCompleted === 1) {
    this.keys.setAlpha(0.5);
  } else {
    this.keys.setAlpha(0.3);
  }
  this.setCameraOnPlayer();
};

World.prototype.startPlayingScene2 = function () {
  BalanceData_1.BalanceData.actStartTime = Date.now();
  this.subScene.enterLevel(false);
  this.setBackgrounColor();
  this.updateParallax();
};

World.prototype.showSubHub = function () {
  this.beforeStartPlayingScene(BalanceData_1.BalanceData.hubID, this.isCurrLevelHard);
  this.showSubScene(SubSceneList_1.SubSceneList.Hub);
  this.startPlayingScene(false);
  SoundManager_1.SoundManager.playMusic("mus_hub");
  this.setBackgrounColor();
  this.subScene.updateDeaths(BalanceData_1.BalanceData.totalDeaths);
};

World.prototype.showSubAct = function (t, e) {
  this.beforeStartPlayingScene(t, e);
  this.showSubScene(SubSceneList_1.SubSceneList.Act);
  if (data_1.Constants.IS_EDITOR === true) {
    SoundManager_1.SoundManager.playMusic("mus_act1");
  } else if (e === true) {
    SoundManager_1.SoundManager.playMusic("mus_act" + t + "hard");
  } else {
    SoundManager_1.SoundManager.playMusic("mus_act" + t);
  }
  this.startPlayingScene(e);
  this.startPlayingScene2();
};

World.prototype.showSubVex = function () {
  this.beforeStartPlayingScene(BalanceData_1.BalanceData.vexID, false);
  this.showSubScene(SubSceneList_1.SubSceneList.Vex);
  SoundManager_1.SoundManager.playMusic("mus_vex");
  this.startPlayingScene(false);
  this.startPlayingScene2();
};

World.prototype.showSubTower = function (t) {
  this.beforeStartPlayingScene(BalanceData_1.BalanceData.towerID, false);
  this.showSubScene(SubSceneList_1.SubSceneList.Tower);
  SoundManager_1.SoundManager.playMusic("mus_tower");
  this.resetVars();
  this.towerEndY = 0;
  this.currHeroFloor = 0;
  this.currTowerDifficult = 0;
  this.minTowerDifficult = 0;
  this.currPatternCompleted = 0;
  this.prevTowerPattern = -1;
  if (t < 0) {
    this.minTowerPattern = 1;
    this.addNextRandomTower();
  } else {
    this.minTowerPattern = 0;
    this.createBonusLevel(this.currentLevel.data[this.currTowerDifficult][t]);
    this.firstSession = false;
    this.minTowerPattern = 1;
  }
  this.startPlayingSceneNoCreateLevel();
  this.startPlayingScene2();
};

World.prototype.createBonusLevel = function (t) {
  this.createTowerWalls();
  if (this.towerEndY === 0) {
    this.createLevelPlayerSpawn(JSON.parse(JSON.stringify(t)));
  } else {
    this.createLevel(JSON.parse(JSON.stringify(t)));
  }
};

World.prototype.addNextRandomTower = function () {
  for (
    var t, e = Tools_1.Tools.random(this.minTowerDifficult, this.currTowerDifficult);
    (t = Tools_1.Tools.random(this.minTowerPattern, this.currentLevel.data[this.currTowerDifficult].length - 1)) ===
    this.prevTowerPattern;
  );
  this.createBonusLevel(this.currentLevel.data[e][t]);
  this.prevTowerPattern = t;
};

World.prototype.createNextPattern = function () {
  this.currPatternCompleted += 1;
  this.destroyLevel(false);
  this.resetVars();
  this.addNextRandomTower();
  if (this.currPatternCompleted % 3 == 0) {
    if (data_1.Constants.IS_AD_REWARD_AVAILABLE === true && this.player.isShield === false) {
      this.panelManager.show(PanelManager_1.PanelList.PanelPowerUp);
    }
    if (this.currTowerDifficult < this.currentLevel.data.length - 1) {
      this.currTowerDifficult += 1;
    }
    if (this.currTowerDifficult > 2 && this.minTowerDifficult < this.currTowerDifficult) {
      this.minTowerDifficult += 1;
    }
    this.minTowerPattern = 0;
  }
};

World.prototype.finishTowerStage = function () {
  this.timerLive = false;
  this.player.hide();
  if (
    data_1.Constants.IS_AD_REWARD_AVAILABLE === true &&
    this.panelManager.isExist(PanelManager_1.PanelList.PanelTowerDefeat) === false
  ) {
    this.panelManager.show(PanelManager_1.PanelList.PanelTowerDefeat);
  } else {
    this.showTowerCompletePanel();
  }
  this.pauseWorld();
};

World.prototype.showTowerCompletePanel = function () {
  this.panelManager.show(PanelManager_1.PanelList.PanelTowerComplete);
  DailyTask_1.DailyTask.saveData(DailyTask_1.TaskID.playTowerOfTerror);
};

World.prototype.restartTowerStage = function () {
  this.firstSpawn = false;
  this.zoomTo(this.zoomStart, true);
  this.resetLevel(false);
  this.setCameraOnPlayer();
  this.resumeWorld();
};

World.prototype.finishLevel = function () {
  if (this.multiplayer && this.multiplayer.flow.interceptFinish()) {
    return;
  }
  this.pauseWorld();
  var t = Number(this.currLevelID);
  if (t > BalanceData_1.BalanceData.levelsCompleted) {
    BalanceData_1.BalanceData.levelsCompleted = t;
  }
  DailyTask_1.DailyTask.saveData(DailyTask_1.TaskID.completeLevel, t);
  DailyTask_1.DailyTask.saveData(DailyTask_1.TaskID.completeAny3Levels);
  if (this.currLevelID === BalanceData_1.BalanceData.vexID) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.vex);
  } else {
    Achievements_1.Achievements.completeAct(Number(this.currLevelID), this.isCurrLevelHard);
  }
  this.panelManager.show(PanelManager_1.PanelList.PanelLevelComplete);
  this.currentLevel.complete(BalanceData_1.BalanceData.actFinishTime, this.currentDeaths, this.isCurrLevelHard);
};

World.prototype.updateProgressTnt = function (t) {
  if (this.subScene.updateProgressTnt) {
    this.subScene.updateProgressTnt(t);
  }
};

World.prototype.resumeOnFinish = function () {
  this.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
  this.keys.show();
  this.player.resume();
};

World.prototype.createSceneMainMenu = function () {
  this.resetVars();
  this.spawnX = this.spawnY = 0;
  this.state = GameStates.MainMenu;
  SoundManager_1.SoundManager.playMusic("mus_menu");
};

World.prototype.checkpointTriggered = function (t) {
  this.player.collideWithCheckPoint(t);
  for (var e = 0; e < 10; e++)
    this.particleManager.createColorParticle(t.xPos, t.yPos, 10 * Math.random() - 5, -6 - 4 * Math.random(), 65280);
  SoundManager_1.SoundManager.playSFX("ding");
  this.effectsOverlay.checkPoint();
  if (this.currLevelID === BalanceData_1.BalanceData.hubID) {
    SaveGame_1.SaveGame.getInstance().saveCheckPoint(t.xPos, t.yPos);
  }
  for (var i = 0, n = this.obstacles; i < n.length; i++) {
    var s = n[i];
    if (s.alive === true && s instanceof obstacles_1.BulletMissile) {
      s.die();
    }
  }
};

World.prototype.portToActBlock = function (t) {
  this.panelManager.hideAll();
  this.resumeWorld();
  this.lookingAround = false;
  this.player.portToActBlock(this.actBlocks[t + "false"].xPos, this.actBlocks[t + "false"].topEdge);
  this.setCameraOnPlayer();
  this.startGamePlay();
};

World.prototype.collectCoin = function () {
  this.currentMoney += 1;
  if (this.isTower() === false) {
    BalanceData_1.BalanceData.totalMoney += 1;
    DailyTask_1.DailyTask.saveData(DailyTask_1.TaskID.collectCoins);
  } else {
    BalanceData_1.BalanceData.totalTowerMoney += 1;
  }
  this.subScene.updateMoney(this.currentMoney);
  SaveGame_1.SaveGame.getInstance().saveProgress();
};

World.prototype.update = function () {
  if (this.multiplayer) {
    this.multiplayer.update();
  }
  if (this.state === GameStates.Playing) {
    this.updateLogic();
    this.cameraLogic();
    this.updateParallax();
  } else if (this.state === GameStates.MainMenu) {
    this.updateLogic();
    this.moveBackground(-0.5, -0.5);
  } else if (this.state === GameStates.Skins) {
    this.moveBackground(-0.5, -0.5);
  }
  _super.prototype.update.call(this);
};

World.prototype.explodeComplete = function () {
  this.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
};

World.prototype.updateLogic = function () {
  if (this.currSubScene === SubSceneList_1.SubSceneList.Hub) {
    this.subScene.updateTime();
  } else if (
    this.currSubScene !== SubSceneList_1.SubSceneList.Menu &&
    (this.currSubScene === SubSceneList_1.SubSceneList.Tower &&
      (this.calcHeroFloor(),
      this.cameraY + this.getGameHalfHeight() - BalanceData_1.BalanceData.towerCellSize > this.towerEndY) &&
      this.createNextPattern(),
    this.timerLive === true &&
      ((this.currentTime = BalanceData_1.BalanceData.actStartTime), this.subScene.updateTime()),
    BalanceData_1.BalanceData.autoReset === true) &&
    this.currentLevel.isTargetLevelComplete(this.isCurrLevelHard) === true &&
    Math.round(Date.now() - BalanceData_1.BalanceData.actStartTime) > this.currentLevel.getTopTime(this.isCurrLevelHard)
  ) {
    this.resetLevel(true);
  }
  if (
    Achievements_1.Achievements.isAchieveCompleted(Achievements_1.TrophieAchieves.playHour) === false &&
    Helpers_1.Helpers.isAnHour(Date.now() - BalanceData_1.BalanceData.levelMapStartTime) === true
  ) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.playHour);
  }
  _super.prototype.updateLogic.call(this);
  this.effectsOverlay.update();
};

World.prototype.calcHeroFloor = function () {
  this.currHeroFloor = Math.floor((this.player.yPos - 10) / BalanceData_1.BalanceData.towerCellSize);
  if (this.currHeroFloor >= 500) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieTower.floors500);
  } else if (this.currHeroFloor >= 100) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieTower.floors100);
  } else if (this.currHeroFloor >= 10) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieTower.floors10);
  }
};

World.prototype.reset = function () {
  this.currentTime = Date.now();
  for (var t = 0, e = this.blocks; t < e.length; t++) e[t].reset();
  for (var i = 0, n = this.obstacles; i < n.length; i++) n[i].reset();
  for (var s = 0, r = this.items; s < r.length; s++) r[s].reset();
  this.effectsOverlay.goLight();
  if (this.state !== GameStates.MainMenu) {
    this.keys.show();
  }
};

World.prototype.resetLevel = function (t) {
  if ((t === undefined && (t = true), this.currSubScene !== SubSceneList_1.SubSceneList.Menu)) {
    this.effectsOverlay.goLight();
    for (var e = 0, i = this.obstacles; e < i.length; e++) i[e].resetLevel();
    for (var n = 0, s = this.blocks; n < s.length; n++) s[n].resetLevel();
    for (var r = 0, o = this.items; r < o.length; r++) o[r].resetLevel();
    if (this.wireTrail) {
      this.wireTrail.resetLevel();
    }
    this.player.spawn({ x: this.spawnX, y: this.spawnY });
    this.subScene.resetLevel();
    this.currentDeaths = 0;
    this.subScene.updateDeaths(this.currentDeaths);
    if (t === true) {
      this.currentTime = null;
      BalanceData_1.BalanceData.actStartTime = Date.now();
    }
  }
};

World.prototype.resize = function () {
  _super.prototype.resize.call(this);
  this.checkResizePauseResume();
  if (this.state === GameStates.Playing && this.player) {
    this.setCameraOnPlayer();
  } else {
    this.backgroundStaticPos();
  }
};

World.prototype.checkResizePauseResume = function () {
  if (BalanceData_1.BalanceData.incorrectOrientation === true) {
    this.onFocusLost();
  } else {
    this.resumeMenu();
  }
};

World.prototype.onFocusLost = function () {
  if (
    AzerionSDK_1.AzerionSDK.isAdPlaying() !== true &&
    this.panelManager.currentPanel === PanelManager_1.PanelList.NoOne
  ) {
    if (this.state === GameStates.Playing) {
      if (this.currSubScene === SubSceneList_1.SubSceneList.Hub) {
        this.panelManager.show(PanelManager_1.PanelList.PanelOptionsHub);
      } else {
        this.panelManager.show(PanelManager_1.PanelList.PanelPause);
      }
    } else if (this.state === GameStates.MainMenu) this.panelManager.show(PanelManager_1.PanelList.PanelOptionsMenu);
    else if (this.state === GameStates.Skins) return;
    this.pauseState();
  }
};

World.prototype.onFocusFound = function () {
  if (AzerionSDK_1.AzerionSDK.isAdPlaying() !== true) {
    this.resumeMenu();
  }
};

World.prototype.pauseWorld = function () {
  BalanceData_1.BalanceData.mapPausedTime = Date.now();
  BalanceData_1.BalanceData.actPausedTime = BalanceData_1.BalanceData.mapPausedTime;
  this.player.pause();
  this.pauseState();
  this.events.emit("pauseWorld");
};

World.prototype.pauseState = function () {
  this.state = GameStates.Pause;
  this.keys.hide();
};

World.prototype.resumeWorld = function () {
  var t = Date.now();
  BalanceData_1.BalanceData.levelMapStartTime += t - BalanceData_1.BalanceData.mapPausedTime;
  BalanceData_1.BalanceData.actStartTime += t - BalanceData_1.BalanceData.actPausedTime;
  this.state = GameStates.Playing;
  this.player.resume();
  this.keys.show();
  this.events.emit("resumeWorld");
};

World.prototype.resumeMenu = function () {
  if (
    this.state === GameStates.Pause &&
    this.currSubScene === SubSceneList_1.SubSceneList.Menu &&
    this.panelManager.currentPanel === PanelManager_1.PanelList.NoOne
  ) {
    this.state = GameStates.MainMenu;
    this.player.resume();
    this.keys.show();
  }
};

World.prototype.startGamePlay = function () {
  if (
    this.firstSpawn === false &&
    ((this.firstSpawn = true), (this.timerLive = true), this.currLevelID !== BalanceData_1.BalanceData.mainmenuID) &&
    this.cameraZoom !== this.zoomDefault &&
    data_1.Constants.IS_EDITOR === false
  ) {
    this.zoomTo(this.zoomDefault);
  }
};

World.prototype.isTargetLevelComplete = function () {
  return Number(this.currentLevel.isTargetLevelComplete(this.isCurrLevelHard));
};

World.prototype.isTargetCoinsComplete = function () {
  return this.currentLevel.isTargetCoinsComplete(this.isCurrLevelHard);
};

World.prototype.isTargetDeathComplete = function () {
  return this.currentLevel.isTargetDeathComplete(this.isCurrLevelHard);
};

World.prototype.completeTargetCoins = function () {
  this.currentLevel.completeTargetCoins(this.isCurrLevelHard);
};

World.prototype.completeTargetDeath = function () {
  this.currentLevel.completeTargetDeath(this.isCurrLevelHard);
};

World.prototype.getTargetCoins = function () {
  return this.currentLevel.getTargetCoins(this.isCurrLevelHard);
};

World.prototype.getTargetDeath = function () {
  return this.currentLevel.getTargetDeath(this.isCurrLevelHard);
};

World.Name = "world";

var _tmp = World;

function World() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.skipMenu = false;
  t.currHeroFloor = 0;
  t.firstSession = true;
  return t;
}

exports.World = _tmp;
