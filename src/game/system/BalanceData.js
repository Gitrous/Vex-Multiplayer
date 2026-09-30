// system/BalanceData.js — recovered from webpack module #2 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BalanceData = exports.BalanceConfig = undefined;

var BalanceConfig,
  data_1 = require("../data"),
  Tools_1 = require("../utils/Tools");

(_tmp = BalanceConfig = exports.BalanceConfig || (exports.BalanceConfig = {})).WireSparkSpeed = "wss";

_tmp.TimeNewElevator = "tne";

_tmp.SpeedElevator = "se";

_tmp.PortalTimeCooldown = "ptc";

_tmp.RopeUpVelY = "ruvy";

_tmp.RopeDownVelY = "rdvy";

_tmp.AppearingBlockApper = "aba";

_tmp.AppearingBlockDisapper = "abd";

_tmp.SpikeBlockVelocity = "sbv";

_tmp.TowerWallWidth = "tww";

_tmp.ClassicLaserFireTime = "clft";

_tmp.ClassicLaserFireDistance = "clfd";

_tmp.MissileLauncherFireTime = "mlft";

_tmp.MissileLauncherFireDistance = "mlfd";

_tmp.MissileSpeed = "ms";

_tmp.MissileLifeTime = "mlt";

_tmp.MissileFollowSpeed = "mfs";

_tmp.ClassicLaserCameraFireTime = "clcft";

_tmp.SurveillanceCameraRotaionSpeed = "scrs";

_tmp.SurveillanceCameraFollowSpeed = "scfs";

_tmp.PulseBlockPushPlayer = "pbpp";

_tmp.PulseBlockPushOther = "pbpo";

_tmp.PulseBlockDistanceEmit = "pbde";

BalanceData.init = function () {
  this.configDefault = {};
  this.configDefault[BalanceConfig.WireSparkSpeed] = 0.15;
  this.configDefault[BalanceConfig.TimeNewElevator] = 120;
  this.configDefault[BalanceConfig.SpeedElevator] = 2;
  this.configDefault[BalanceConfig.PortalTimeCooldown] = 240;
  this.configDefault[BalanceConfig.RopeUpVelY] = 2.5;
  this.configDefault[BalanceConfig.RopeDownVelY] = 2.5;
  this.configDefault[BalanceConfig.AppearingBlockApper] = 0.3;
  this.configDefault[BalanceConfig.AppearingBlockDisapper] = 0.3;
  this.configDefault[BalanceConfig.SpikeBlockVelocity] = 0.3;
  this.configDefault[BalanceConfig.TowerWallWidth] = 880;
  this.configDefault[BalanceConfig.ClassicLaserFireTime] = 80;
  this.configDefault[BalanceConfig.ClassicLaserFireDistance] = 250;
  this.configDefault[BalanceConfig.MissileLauncherFireTime] = 80;
  this.configDefault[BalanceConfig.MissileLauncherFireDistance] = 400;
  this.configDefault[BalanceConfig.MissileSpeed] = 3;
  this.configDefault[BalanceConfig.MissileLifeTime] = 150;
  this.configDefault[BalanceConfig.MissileFollowSpeed] = 1;
  this.configDefault[BalanceConfig.ClassicLaserCameraFireTime] = 50;
  this.configDefault[BalanceConfig.SurveillanceCameraRotaionSpeed] = 1;
  this.configDefault[BalanceConfig.SurveillanceCameraFollowSpeed] = 2;
  this.configDefault[BalanceConfig.PulseBlockPushPlayer] = 20;
  this.configDefault[BalanceConfig.PulseBlockPushOther] = 20;
  this.configDefault[BalanceConfig.PulseBlockDistanceEmit] = 200;
};

BalanceData.getConfigData = function (t, e) {
  t = t[e];
  return (t = t === undefined ? this.configDefault[e] : t);
};

BalanceData.initConfig = function (t) {
  this.config_ElevatorTimeNew = this.getConfigData(t, BalanceConfig.TimeNewElevator);
  this.config_ElevatorSpeed = this.getConfigData(t, BalanceConfig.SpeedElevator);
  this.config_PortalTimeCooldown = this.getConfigData(t, BalanceConfig.PortalTimeCooldown);
  this.config_RopeUpVelY = this.getConfigData(t, BalanceConfig.RopeUpVelY);
  this.config_RopeDownVelY = this.getConfigData(t, BalanceConfig.RopeUpVelY);
  this.config_AppearingBlockApper = this.getConfigData(t, BalanceConfig.AppearingBlockApper);
  this.config_AppearingBlockDisapper = this.getConfigData(t, BalanceConfig.AppearingBlockDisapper);
  this.config_SpikeBlockVelocity = this.getConfigData(t, BalanceConfig.SpikeBlockVelocity);
  this.config_WireSparkSpeed = this.getConfigData(t, BalanceConfig.WireSparkSpeed);
  this.config_TowerWallWidth = this.getConfigData(t, BalanceConfig.TowerWallWidth);
  this.config_ClassicLaserFireTime = this.getConfigData(t, BalanceConfig.ClassicLaserFireTime);
  this.config_ClassicLaserFireDistance = this.getConfigData(t, BalanceConfig.ClassicLaserFireDistance);
  this.config_MissileLauncherFireTime = this.getConfigData(t, BalanceConfig.MissileLauncherFireTime);
  this.config_MissileLauncherFireDistance = this.getConfigData(t, BalanceConfig.MissileLauncherFireDistance);
  this.config_MissileSpeed = this.getConfigData(t, BalanceConfig.MissileSpeed);
  this.config_MissileLifeTime = this.getConfigData(t, BalanceConfig.MissileLifeTime);
  this.config_MissileFollowSpeed = this.getConfigData(t, BalanceConfig.MissileFollowSpeed);
  this.config_ClassicLaserCameraFireTime = this.getConfigData(t, BalanceConfig.ClassicLaserCameraFireTime);
  this.config_SurveillanceCameraRotaionSpeed = Tools_1.Tools.toRad(
    this.getConfigData(t, BalanceConfig.SurveillanceCameraRotaionSpeed) / 60,
  );
  this.config_SurveillanceCameraFollowSpeed =
    Tools_1.Tools.toRad(this.getConfigData(t, BalanceConfig.SurveillanceCameraFollowSpeed)) / 10;
  this.config_PulseBlockPushPlayer = this.getConfigData(t, BalanceConfig.PulseBlockPushPlayer);
  this.config_PulseBlockPushOther = this.getConfigData(t, BalanceConfig.PulseBlockPushOther);
  this.config_PulseBlockDistanceEmit = this.getConfigData(t, BalanceConfig.PulseBlockDistanceEmit);
  this.towerCellSize = this.config_TowerWallWidth / this.towerHorizontalCells;
  this.towerHalfCellSize = this.towerCellSize / 2;
  if (data_1.Constants.IS_MOBILE === true) {
    this.particleLimit = 0;
    this.blend = false;
    this.parallax = false;
  }
};

BalanceData.getBasicBlockFrame = function (t) {
  t = Number(t);
  return "basicBlockColors " + (1e4 + (t = !t || t >= this.basicBlockColorFrames ? 0 : t));
};

BalanceData.getSlopeFrame = function (t) {
  t = Number(t);
  return "leftSlopeColors " + (1e4 + (t = !t || t >= this.basicBlockColorFrames ? 0 : t));
};

(_tmp = BalanceData).mutedSfx = false;

BalanceData.mutedMusic = false;

BalanceData.incorrectOrientation = false;

BalanceData.actsStarts = 1;

BalanceData.totalActs = 10;

BalanceData.editID = "edit";

BalanceData.mainmenuID = "mainmenu";

BalanceData.hubID = "hub";

BalanceData.towerID = "tower";

BalanceData.vexID = "" + _tmp.totalActs;

BalanceData.basicBlockColorFrames = 10;

BalanceData.towerFloor = 0;

BalanceData.totalMoney = 0;

BalanceData.totalTowerMoney = 0;

BalanceData.totalDeaths = 0;

BalanceData.currSkin = 0;

BalanceData.autoReset = false;

BalanceData.autoRestart = false;

BalanceData.noBlood = false;

BalanceData.particleLimit = 30;

BalanceData.blend = true;

BalanceData.parallax = true;

BalanceData.levelsCompleted = 0;

BalanceData.actFinishTime = -1;

BalanceData.towerHorizontalCells = 11;

BalanceData.towerCellSize = 1;

BalanceData.towerHalfCellSize = 1;

var _tmp = BalanceData;

function BalanceData() {}

exports.BalanceData = _tmp;
