// scenes/WorldCreator.js — recovered from webpack module #109 of the original vex7.min.js
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

exports.WorldCreator = undefined;

var WorldLayers_1 = require("./WorldLayers"),
  BalanceData_1 = require("../system/BalanceData"),
  SaveGame_1 = require("../system/SaveGame"),
  entities_1 = require("../entities"),
  blocks_1 = require("../objects/blocks"),
  items_1 = require("../objects/items"),
  Levels_1 = require("../levels/Levels"),
  obstacles_1 = require("../objects/obstacles"),
  World_1 = require("./World"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  wires_1 = require("../objects/wires"),
  tower_1 = require("../objects/tower");

_super = WorldLayers_1.WorldLayers;

__extends(WorldCreator, _super);

WorldCreator.prototype.portalGetColorHue = function () {
  return this.portalColors[this.portalColorsCount];
};

WorldCreator.prototype.portalCalcNextColor = function () {
  this.portalColorsCount += 1;
  if (this.portalColorsCount === this.portalColors.length) {
    --this.portalColorsCount;
  }
};

WorldCreator.prototype.create = function () {
  this.testLine = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 0), new SAT.Vector(0, 0)]);
  this.testLine2 = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 0), new SAT.Vector(0, 0)]);
  this.player = new entities_1.Player(this);
  this.levels = new Levels_1.Levels();
  this.loadLevels();
  this.input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
};

WorldCreator.prototype.loadLevels = function () {
  this.levels.loadLevels(this);
};

WorldCreator.prototype.setBackgrounColor = function () {
  if (this.currentLevel) {
    this.background.tint = this.currentLevel.bgColor;
  } else {
    this.background.tint = 10999295;
  }
};

WorldCreator.prototype.resetVars = function () {
  this.effectsOverlay.hideDark();
  this.blocks = [];
  this.solarBlocks = [];
  this.slopes = [];
  this.obstacles = [];
  this.ziplines = [];
  this.ropes = [];
  this.poles = [];
  this.pools = [];
  this.items = [];
  this.wires = [];
  this.elevatorEliminator = [];
  this.elevators = [];
  this.misc = [];
  this.actBlocks = {};
  this.wireTrail = null;
  this.vexTNT = null;
  this.particleManager.reset();
};

WorldCreator.prototype.createLevelPlayerSpawn = function (t) {
  var e, i;
  this.createLevel(t);
  if (this.currLevelID === BalanceData_1.BalanceData.hubID) {
    if (
      (this.prevLevelID === BalanceData_1.BalanceData.towerID && this.playerEnterTowerBlock === true) ||
      (this.prevLevelID &&
        this.prevLevelID !== BalanceData_1.BalanceData.mainmenuID &&
        this.prevLevelID !== BalanceData_1.BalanceData.towerID)
    ) {
      i = (
        this.isCurrLevelHard === true
          ? ((e = this.actBlocks[this.prevLevelID + "true"].xPos), this.actBlocks[this.prevLevelID + "true"])
          : ((e = this.actBlocks[this.prevLevelID + "false"].xPos), this.actBlocks[this.prevLevelID + "false"])
      ).topEdge;
      this.playerEnterTowerBlock = false;
    } else {
      i =
        BalanceData_1.BalanceData.levelsCompleted > 0
          ? (t = SaveGame_1.SaveGame.getInstance().getCheckPoint()) === null
            ? ((e = this.actBlocks[BalanceData_1.BalanceData.levelsCompleted + "false"].xPos),
              this.actBlocks[BalanceData_1.BalanceData.levelsCompleted + "false"].topEdge)
            : ((e = t.x), t.y)
          : ((e = this.spawnX), this.spawnY);
    }
  } else {
    if (this.currLevelID === BalanceData_1.BalanceData.vexID) {
      this.wireTrail = new obstacles_1.WireTrail(this);
      this.wireTrail.addWires(this.wires);
    }
    i =
      this.prevLevelID.indexOf("skin") !== -1
        ? ((e = this.actBlocks[this.prevLevelID + "false"].xPos), this.actBlocks[this.prevLevelID + "false"].topEdge)
        : ((e = this.spawnX), this.spawnY);
  }
  this.player.spawn({ x: e, y: i });
  this.state = World_1.GameStates.Playing;
  this.cameraZoom = 1.5;
};

WorldCreator.prototype.createLevel = function (t) {
  for (var e = this.towerEndY, i = null, n = null, s = null, r = 0, o = 0; o < t.length; o++) {
    var a = t[o];
    if (
      this.currLevelID !== BalanceData_1.BalanceData.hubID ||
      !(
        (a.delActNum && a.delActNum <= BalanceData_1.BalanceData.levelsCompleted) ||
        (a.createActNum && a.createActNum > BalanceData_1.BalanceData.levelsCompleted)
      )
    ) {
      var h = a.id;
      a.y += e;
      var l = undefined,
        u = undefined;
      switch (h) {
        case "spawnPoint":
          this.spawnX = a.x;
          this.spawnY = a.y;
          break;
        case "actTower":
          (l = new blocks_1.ActTower(this, this.layerTopObstacle)).spawn(a);
          this.blocks.push(l);
          this.actBlocks[BalanceData_1.BalanceData.towerID + "false"] = l;
          break;
        case "basicBlock":
          (l = new blocks_1.BasicBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "verticalBlock":
          (l = new blocks_1.VerticalBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "horizontalBlock":
          (l = new blocks_1.HorizontalBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "fallingBlock":
          (l = new blocks_1.FallingBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "bounceBlock":
          (l = new blocks_1.BounceBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "pushBlock":
          (l = new blocks_1.PushBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "iceBlock":
          (l = new blocks_1.IceBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "glassBlock":
          (l = new blocks_1.GlassBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "speedBlock":
          (l = new blocks_1.SpeedBlock(this, this.layerBlocks, 1)).spawn(a);
          this.blocks.push(l);
          break;
        case "speedBlockLeft":
          (l = new blocks_1.SpeedBlock(this, this.layerBlocks, -1)).spawn(a);
          this.blocks.push(l);
          break;
        case "sparkBlock":
          (l = new blocks_1.SparkBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "solarBlock":
          (l = new blocks_1.SolarBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          this.solarBlocks.push(l);
          break;
        case "invisBlock":
          (l = new blocks_1.InvisBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "invisBlockUp":
          (l = new blocks_1.InvisBlockUp(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "invisBlockDown":
          (l = new blocks_1.InvisBlockDown(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "explosiveBlock":
          (l = new blocks_1.ExplosiveBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "blockedWall":
          (l = new blocks_1.BlockedWall(this, this.layerObstacle)).spawn(a);
          this.blocks.push(l);
          break;
        case "actBlock":
          (l = new blocks_1.ActBlock(this, this.layerTopObstacle, a.actNum, false)).spawn(a);
          this.blocks.push(l);
          this.actBlocks[a.actNum + "false"] = l;
          break;
        case "actBlockHard":
          (l = new blocks_1.ActBlock(this, this.layerTopObstacle, a.actNum, true)).spawn(a);
          this.blocks.push(l);
          if ((this.actBlocks[a.actNum + "true"] = l).hardEnabled === false) {
            (u = new obstacles_1.SpikeActBlockHard(this, this.layerTopObstacle)).spawn({
              x: a.x,
              y: a.y - 78,
              rotation: 0,
            });
            this.obstacles.push(u);
          }
          break;
        case "skinsBlock":
          (l = new blocks_1.SkinsBlock(this, this.layerTopObstacle, r)).spawn(a);
          this.blocks.push(l);
          (this.actBlocks["skin" + r + "false"] = l).levelStart();
          r += 1;
          break;
        case "swimmingPool":
          (l = new blocks_1.SwimmingPool(this, this.layerPool)).spawn(a);
          this.pools.push(l);
          break;
        case "leftSlope":
          (l = new blocks_1.Slope(this, this.layerBlocks, -1)).spawn(a);
          this.slopes.push(l);
          break;
        case "rightSlope":
          (l = new blocks_1.Slope(this, this.layerBlocks, 1)).spawn(a);
          this.slopes.push(l);
          break;
        case "ziplinePole":
          (l = new wires_1.ZiplinePole(this, this.layerObstacle)).spawn(a);
          i = i ? (this.ziplines.push(i.attach(l)), null) : l;
          this.misc.push(l);
          break;
        case "pole":
          (l = new wires_1.Pole(this, this.layerTopObstacle)).spawn(a);
          this.poles.push(l);
          break;
        case "checkpoint":
          (l = new items_1.Checkpoint(this, this.layerObstacle, false)).spawn(a);
          this.items.push(l);
          break;
        case "checkpointSwimming":
          var c = new items_1.Checkpoint(this, this.layerObstacle, true);
          c.spawn(a);
          this.items.push(c);
          break;
        case "checkpointHome":
          (l = new items_1.CheckpointHome(this, this.layerObstacle, false)).spawn(a);
          this.items.push(l);
          break;
        case "coin":
          (l = new items_1.Coin(this, this.layerTopObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "skinSpin":
          (l = new items_1.SkinSpin(this, this.layerTopObstacle, a.rarity)).spawn(a);
          this.items.push(l);
          break;
        case "windBlaster":
          (l = new items_1.WindBlaster(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "finishPortal":
          (l = new items_1.FinishPortal(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "lockBlock":
          (l = new blocks_1.LockBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "key":
          (l = new items_1.Key(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "timedKey":
          (l = new items_1.TimedKey(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "torch":
          (l = new items_1.Torch(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "circularCannon":
          (l = new items_1.CircularCannon(this, this.layerTopObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "lightSwitch":
          (l = new items_1.LightSwitch(this, this.layerTopObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "wire":
          (l = new wires_1.Wire(this, this.layerTopObstacle)).spawn(a);
          this.wires.push(l);
          break;
        case "buzzsaw":
          (l = new obstacles_1.Buzzsaw(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "buzzsawVertical":
          (l = new obstacles_1.BuzzsawVertical(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "buzzsawHorizontal":
          (l = new obstacles_1.BuzzsawHorizontal(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "buzzsawBouncing":
          (l = new obstacles_1.BuzzsawBouncing(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "buzzsawEnlarging":
          (l = new obstacles_1.BuzzsawEnlarging(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "buzzsawOnStick":
          (l = new obstacles_1.BuzzsawOnStick(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike":
          (l = new obstacles_1.Spike(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike5x":
          (l = new obstacles_1.Spike5x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike10x":
          (l = new obstacles_1.Spike10x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike15x":
          (l = new obstacles_1.Spike15x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike20x":
          (l = new obstacles_1.Spike20x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike25x":
          (l = new obstacles_1.Spike25x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "spike30x":
          (l = new obstacles_1.Spike30x(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "fallingSpike":
          (l = new obstacles_1.FallingSpike(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "shurikanSpawner":
          (l = new obstacles_1.ShurikanSpawner(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "classicLaser":
          (l = new obstacles_1.ClassicLaser(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "classicLaserStatic":
          (l = new obstacles_1.ClassicLaserStatic(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "quadrantRight":
          (l = new obstacles_1.Quadrant(this, this.layerObstacle, 2)).spawn(a);
          this.obstacles.push(l);
          break;
        case "quadrantLeft":
          (l = new obstacles_1.Quadrant(this, this.layerObstacle, -2)).spawn(a);
          this.obstacles.push(l);
          break;
        case "laserPoint":
          n = n
            ? ((l = new obstacles_1.LaserPoint(this, this.layerObstacle)).spawn(n.x, n.y, a.x, a.y),
              this.obstacles.push(l),
              null)
            : new Phaser.Geom.Point(a.x, a.y);
          break;
        case "reaper":
          (l = new obstacles_1.Reaper(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "shurikanDispenser":
          (l = new obstacles_1.ShurikanDispenser(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "hazardStrips":
          (l = new wires_1.HazardStrips(this, this.layerTopObstacle)).spawn(a);
          this.misc.push(l);
          break;
        case "breatheBlaster":
          (l = new items_1.BreatheBlaster(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "textFade":
          (l = new items_1.FadeText(this, this.layerText)).spawn(a);
          this.items.push(l);
          break;
        case "arrowFade":
          (l = new items_1.FadeArrow(this, this.layerText)).spawn(a);
          this.items.push(l);
          break;
        case "portal":
          (l = new items_1.Portal(this, this.layerTopObstacle, this.portalGetColorHue())).spawn(a);
          if (s) {
            l.attachPortal(s);
            s.attachPortal(l);
            s = null;
            this.portalCalcNextColor();
          } else {
            s = l;
          }
          this.items.push(l);
          break;
        case "elevatorGeneratorUp":
          l = new blocks_1.ElevatorGenerator(this, this.layerTopObstacle);
          u = new obstacles_1.Spike15x(this, this.layerObstacle);
          this.obstacles.push(u);
          l.addSpikes(u, true);
          l.spawn(a);
          this.blocks.push(l);
          break;
        case "elevatorGeneratorDown":
          l = new blocks_1.ElevatorGenerator(this, this.layerTopObstacle);
          u = new obstacles_1.Spike15x(this, this.layerObstacle);
          this.obstacles.push(u);
          l.addSpikes(u, false);
          l.spawn(a);
          this.blocks.push(l);
          break;
        case "elevatorEliminatorUp":
          l = new blocks_1.ElevatorEliminator(this, this.layerTopObstacle);
          u = new obstacles_1.Spike15x(this, this.layerObstacle);
          this.obstacles.push(u);
          l.addSpikes(u, false);
          l.spawn(a);
          this.blocks.push(l);
          this.elevatorEliminator.push(l);
          break;
        case "elevatorEliminatorDown":
          l = new blocks_1.ElevatorEliminator(this, this.layerTopObstacle);
          u = new obstacles_1.Spike15x(this, this.layerObstacle);
          this.obstacles.push(u);
          l.addSpikes(u, true);
          l.spawn(a);
          this.blocks.push(l);
          this.elevatorEliminator.push(l);
          break;
        case "appearingBlock":
          (l = new blocks_1.AppearingBlock(this, this.layerTopObstacle)).spawn(a);
          this.blocks.push(l);
          break;
        case "rope":
          (l = new wires_1.Rope(this, this.layerUnderPool)).spawn(a);
          this.ropes.push(l);
          break;
        case "blockSpike":
          (l = new blocks_1.BlockSpike(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "kite":
          (l = new items_1.Kite(this, this.layerTopObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "vexTNT":
          (l = new blocks_1.VexTNT(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          this.vexTNT = l;
          break;
        case "grapplePad":
          (l = new items_1.GrapplePad(this, this.layerTopObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "grapplePointA":
          (l = new items_1.GrapplePoint(this, this.layerText, false)).spawn(a);
          this.items.push(l);
          break;
        case "grapplePointB":
          (l = new items_1.GrapplePoint(this, this.layerText, true)).spawn(a);
          this.items.push(l);
          break;
        case "pulseBlock":
          (l = new blocks_1.PulseBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "hoverPlatform":
          (l = new blocks_1.HoverPlatform(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "leverPulse":
          (l = new items_1.LeverPulse(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "jumpPotion":
          (l = new items_1.JumpPotion(this, this.layerObstacle)).spawn(a);
          this.items.push(l);
          break;
        case "surveillanceCamera":
          (l = new obstacles_1.SurveillanceCamera(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "classicLaserCamera":
          (l = new obstacles_1.ClassicLaserCamera(this, this.layerObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "missileLauncher":
          (l = new obstacles_1.MissileLauncher(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "breakableBlock":
          (l = new tower_1.BreakableBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "autoBreakableBlock":
          (l = new tower_1.AutoBreakableBlock(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          break;
        case "gate":
          (l = new tower_1.Gate(this, this.layerBlocks)).spawn(a);
          this.blocks.push(l);
          this.setNextTowerY(l.yPos);
          break;
        case "enemyAndroid":
          (l = new tower_1.EnemyAndroid(this, this.layerSpine)).spawn(a);
          this.obstacles.push(l);
          break;
        case "enemyAndroidAdvanced":
          (l = new tower_1.EnemyAndroidAdvanced(this, this.layerSpine)).spawn(a);
          this.obstacles.push(l);
          break;
        case "enemyDrone":
          (l = new tower_1.EnemyDrone(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
          break;
        case "enemyBatteringRam":
          (l = new tower_1.EnemyBatteringRam(this, this.layerTopObstacle)).spawn(a);
          this.obstacles.push(l);
      }
      u = l = null;
    }
  }
  for (var d = 0, p = this.blocks; d < p.length; d++) (l = p[d]).levelStart();
  for (var f = 0, g = this.obstacles; f < g.length; f++) g[f].levelStart();
  for (var y = 0, v = this.items; y < v.length; y++) v[y].levelStart();
};

WorldCreator.prototype.getGrapplePoint = function (t) {
  for (var e = 0, i = this.items; e < i.length; e++) {
    var n = i[e];
    if (n instanceof items_1.GrapplePoint && n.currID === t) return n;
  }
  return null;
};

WorldCreator.prototype.createTowerWalls = function () {
  var t = new tower_1.TowerWall(this, this.layerBlocks);
  t.spawn(-1);
  this.blocks.push(t);
  (t = new tower_1.TowerWall(this, this.layerBlocks)).spawn(1);
  this.blocks.push(t);
};

WorldCreator.prototype.setNextTowerY = function (t) {
  this.towerEndY =
    Math.floor((t + this.getGameHeight()) / BalanceData_1.BalanceData.towerCellSize) *
      BalanceData_1.BalanceData.towerCellSize -
    BalanceData_1.BalanceData.towerCellSize;
};

WorldCreator.prototype.updateLogic = function () {
  this.player.update();
  for (var t = 0, e = this.blocks; t < e.length; t++) e[t].update();
  if (this.wireTrail) {
    this.wireTrail.update();
  }
  for (var i = 0, n = this.obstacles; i < n.length; i++) n[i].update();
  this.particleManager.update();
  for (var s = 0, r = this.items; s < r.length; s++) r[s].update();
};

WorldCreator.prototype.getLevel = function (t) {
  return this.levels.getLevel(t);
};

WorldCreator.prototype.destroyLevel = function (t) {
  if ((t === undefined && (t = true), this.blocks)) {
    for (var e = 0, i = this.blocks; e < i.length; e++) i[e].destroy();
    this.blocks = null;
    for (var n = 0, s = this.obstacles; n < s.length; n++) s[n].destroy();
    this.obstacles = null;
    for (var r = 0, o = this.ziplines; r < o.length; r++) o[r].destroy();
    this.ziplines = null;
    for (var a = 0, h = this.pools; a < h.length; a++) h[a].destroy();
    this.pools = null;
    for (var l = 0, u = this.poles; l < u.length; l++) u[l].destroy();
    this.poles = null;
    for (var c = 0, d = this.items; c < d.length; c++) d[c].destroy();
    this.items = null;
    for (var p = 0, f = this.slopes; p < f.length; p++) f[p].destroy();
    this.slopes = null;
    for (var g = 0, y = this.wires; g < y.length; g++) y[g].destroy();
    this.wires = null;
    for (var v = 0, m = this.ropes; v < m.length; v++) m[v].destroy();
    this.ropes = null;
    this.portalColorsCount = 0;
    this.elevatorEliminator = null;
    this.elevators = null;
    for (var x = 0, w = this.misc; x < w.length; x++) w[x].destroy();
    this.misc = null;
    if (this.wireTrail) {
      this.wireTrail.destroy();
    }
    if (!(this.wireTrail = null) === t) {
      this.player.hide();
    }
    this.particleManager.destroy();
    this.effectsOverlay.reset();
  }
};

WorldCreator.prototype.onPointerMove = function () {
  if (this.keys.isScreenButtonDown() !== true) {
    this.lookingAround = this.player.canCameraLookAround();
  }
};

WorldCreator.prototype.zoomTo = function (t, e) {
  if ((e = e === undefined ? false : e) === true) {
    this.cameraZoom = t;
    this.zoomData.c = this.zoomDuration;
    this.zoomData.e = t;
  } else if (this.zoomData.e !== t && this.currSubScene !== SubSceneList_1.SubSceneList.Menu) {
    this.zoomData.s = this.cameraZoom;
    this.zoomData.e = t;
    this.zoomData.c = 0;
    this.zoomData.t = t - this.cameraZoom;
  }
};

WorldCreator.prototype.setCameraOnPlayer = function () {
  this.cameraX = this.player.xPos;
  this.cameraY = this.player.yPos;
};

WorldCreator.prototype.cameraLogic = function () {
  if (this.zoomData.c < this.zoomDuration) {
    this.zoomData.c += 1;
    this.cameraZoom =
      this.zoomData.s + this.zoomData.t * Phaser.Math.Easing.Sine.InOut(this.zoomData.c / this.zoomDuration);
  }
  var t,
    e,
    i = 0.125,
    n = this.player.xPos,
    s = this.player.yPos;
  if (this.lookingAround === false) {
    if (this.player.canDieByFalling === true && this.player.yVelocity > 10) {
      n += t = Math.random() * this.player.yVelocity * 2;
      s += t;
    }
  } else if (this.player.canCameraLookAround() === false || this.keys.isScreenButtonDown() === true) {
    this.lookingAround = false;
  } else {
    t = this.getGameHalfWidth();
    e = this.getGameHalfHeight();
    n += ((this.input.activePointer.x - t) / t) * 200;
    s += ((this.input.activePointer.y - e) / e) * 200;
    i = 0.03;
  }
  this.cameraX += (n - this.cameraX) * i;
  this.cameraY += (s - this.cameraY) * i;
};

WorldCreator.prototype.removeBlockFrom = function (t, e) {
  e = t.indexOf(e);
  if (e >= 0) {
    t.splice(e, 1);
  }
};

WorldCreator.prototype.startElevator = function (t, e, i) {
  for (var n = 0; n < this.elevators.length; n++)
    if (this.elevators[n].alive === false) return void this.elevators[n].activate(t, e, i);
  var s = new blocks_1.Elevator(this, this.layerObstacle);
  s.spawn(t, e, i);
  this.blocks.push(s);
  this.elevators.push(s);
};

WorldCreator.prototype.raycastToPlayerTwoLines = function (t, e, i) {
  this.testLine.points[0].x = e;
  this.testLine.points[0].y = i;
  this.testLine.points[1].x = this.player.xPos;
  this.testLine.points[1].y = this.player.yPos;
  this.testLine.setAngle(0);
  this.testLine2.points[0].x = e;
  this.testLine2.points[0].y = i;
  this.testLine2.points[1].x = this.player.xPos;
  this.testLine2.points[1].y = this.player.yPos - this.player.height + 10;
  this.testLine2.setAngle(0);
  for (var n = 0, s = t; n < s.length; n++) {
    var r = s[n];
    if (
      r &&
      r.totalPolygon &&
      SAT.testPolygonPolygon(this.testLine, r.totalPolygon) === true &&
      SAT.testPolygonPolygon(this.testLine2, r.totalPolygon) === true
    )
      return false;
  }
  return true;
};

WorldCreator.prototype.raycastToPlayerOneLine = function (t, e, i) {
  return this.raycastTo(t, e, i, this.player.xPos, this.player.yPos - this.player.halfHeight);
};

WorldCreator.prototype.raycastTo = function (t, e, i, n, s) {
  this.testLine.points[0].x = e;
  this.testLine.points[0].y = i;
  this.testLine.points[1].x = n;
  this.testLine.points[1].y = s;
  this.testLine.setAngle(0);
  for (var r = 0, o = t; r < o.length; r++) {
    var a = o[r];
    if (a && a.totalPolygon && SAT.testPolygonPolygon(this.testLine, a.totalPolygon) === true) return false;
  }
  return true;
};

WorldCreator.prototype.raycastToBlock = function (t, e, i, n, s) {
  this.testLine.points[0].x = e;
  this.testLine.points[0].y = i;
  this.testLine.points[1].x = n;
  this.testLine.points[1].y = s;
  this.testLine.setAngle(0);
  return !(!t || !t.totalPolygon) && SAT.testPolygonPolygon(this.testLine, t.totalPolygon);
};

WorldCreator.prototype.raycastToClosestBlock = function (t, e, i, n, s) {
  for (var r, o, a = 0, h = s, l = new SAT.Response(); a < s;) {
    r = t + i * (a += 50);
    o = e + n * a;
    this.testLine.points[0].x = t;
    this.testLine.points[0].y = e;
    this.testLine.points[1].x = r;
    this.testLine.points[1].y = o;
    this.testLine.setAngle(0);
    for (var u = 0, c = this.blocks; u < c.length; u++) {
      var d = c[u];
      if (d && d.totalPolygon && d.alive !== false && SAT.testPolygonPolygon(this.testLine, d.totalPolygon, l) === true)
        return a - l.overlap;
    }
  }
  return h;
};

WorldCreator.prototype.checkPlayerDeathByPolygon = function (t, e) {
  return SAT.testPolygonPolygon(this.player.totalPolygon, t) === true && (this.player.kill(e), true);
};

WorldCreator.prototype.checkPlayerDeathByPolygons = function (t, e) {
  for (var i = 0, n = t; i < n.length; i++) {
    var s = n[i];
    if (SAT.testPolygonPolygon(this.player.totalPolygon, s) === true) {
      this.player.kill(e);
      return true;
    }
  }
  return false;
};

WorldCreator.prototype.checkPlayerDeathByCircle = function (t, e) {
  return SAT.testCirclePolygon(t, this.player.totalPolygon) === true && (this.player.kill(e), true);
};

WorldCreator.prototype.applyForceByCircle = function (t, e) {
  if (e === undefined) {
    e = 1;
  }
  for (var i = 0, n = this.blocks; i < n.length; i++) {
    var s = n[i];
    if (s instanceof blocks_1.BlockBehavior && SAT.testCirclePolygon(t, s.totalPolygon) === true) {
      this.applyForce(s, t.pos.x, t.pos.y, e);
    }
  }
};

WorldCreator.prototype.applyForceByPolygon = function (t, e) {
  if (e === undefined) {
    e = 1;
  }
  for (var i = 0, n = this.blocks; i < n.length; i++) {
    var s = n[i];
    if (s instanceof blocks_1.BlockBehavior && SAT.testPolygonPolygon(t, s.totalPolygon) === true) {
      this.applyForce(s, t.pos.x, t.pos.y, e);
    }
  }
};

WorldCreator.prototype.applyForce = function (t, e, i, n) {
  e = new SAT.Vector(t.xPos - e, t.yPos - i);
  e.normalize();
  e.scale(n, n);
  t.applyForce(e.x, e.y);
};

var _WorldCreator = WorldCreator;

function WorldCreator() {
  var t = (_super !== null && _super.apply(this, arguments)) || this;
  t.portalColors = [0, 180, 80, 630];
  t.gravity = 0.25;
  t.zoomStart = 1.5;
  t.zoomDefault = 1.2;
  t.zoomAct = 1.7;
  t.zoomDuration = 40;
  t.zoomData = { s: 0, e: 0, t: 0, c: 0 };
  return t;
}

exports.WorldCreator = _WorldCreator;
