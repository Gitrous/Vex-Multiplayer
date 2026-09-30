// entities/PlayerBase.js — recovered from webpack module #8 of the original vex7.min.js
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

exports.PlayerBase = exports.DeathType = exports.PlayerState = exports.FacingDir = undefined;

function r(t, e, i, n) {
  this.xOff = t;
  this.yOff = e;
  this.width = i;
  this.height = n;
}

var o,
  FacingDir,
  PlayerState,
  _super,
  Entity_1 = require("./Entity"),
  data_1 = require("../data"),
  jd_1 = require("../jd"),
  system_1 = require("../system"),
  Helpers_1 = require("../utils/Helpers"),
  SubSceneList_1 = require("../subscenes/SubSceneList"),
  PlayerBreatheBar_1 = require("./PlayerBreatheBar"),
  PlayerWindGust_1 = require("./PlayerWindGust"),
  PlayerJumpPotion_1 = require("./PlayerJumpPotion"),
  AppearingText_1 = require("./AppearingText");

(_tmp = o = o || {})[(_tmp.Head = 0)] = "Head";

_tmp[(_tmp.Body = 1)] = "Body";

_tmp[(_tmp.Hands = 2)] = "Hands";

_tmp[(_tmp.Feet = 3)] = "Feet";

(_tmp = FacingDir = exports.FacingDir || (exports.FacingDir = {}))[(_tmp.Left = 0)] = "Left";

_tmp[(_tmp.Right = 1)] = "Right";

(_tmp = PlayerState = exports.PlayerState || (exports.PlayerState = {}))[(_tmp.Finish = 0)] = "Finish";

_tmp[(_tmp.Stand = 1)] = "Stand";

_tmp[(_tmp.Running = 2)] = "Running";

_tmp[(_tmp.Jumping = 3)] = "Jumping";

_tmp[(_tmp.Falling = 4)] = "Falling";

_tmp[(_tmp.Sliding = 5)] = "Sliding";

_tmp[(_tmp.Crouching = 6)] = "Crouching";

_tmp[(_tmp.Scaling = 7)] = "Scaling";

_tmp[(_tmp.Hanging = 8)] = "Hanging";

_tmp[(_tmp.Zipping = 9)] = "Zipping";

_tmp[(_tmp.Swinging = 10)] = "Swinging";

_tmp[(_tmp.Pushing = 11)] = "Pushing";

_tmp[(_tmp.Kicking = 12)] = "Kicking";

_tmp[(_tmp.Spawning = 13)] = "Spawning";

_tmp[(_tmp.Swimming = 14)] = "Swimming";

_tmp[(_tmp.JumpDown = 15)] = "JumpDown";

_tmp[(_tmp.JumpFrontFlip = 16)] = "JumpFrontFlip";

_tmp[(_tmp.JumpBackFlip = 17)] = "JumpBackFlip";

_tmp[(_tmp.Land = 18)] = "Land";

_tmp[(_tmp.SwimmingStand = 19)] = "SwimmingStand";

_tmp[(_tmp.Climb = 20)] = "Climb";

_tmp[(_tmp.Kite = 21)] = "Kite";

_tmp[(_tmp.Grapple = 22)] = "Grapple";

_tmp[(_tmp.Attack = 23)] = "Attack";

(_tmp = exports.DeathType || (exports.DeathType = {})).spike = "0";

_tmp.hardLanding = "1";

_tmp.buzzsaw = "2";

_tmp.squashed = "3";

_tmp.drowned = "4";

_tmp.fall = "5";

_tmp.noEntry = "6";

_tmp.dead_7 = "7";

_tmp.reaper = "8";

_tmp.shurikan = "9";

_tmp.quadrant = "10";

_tmp.sparkElectric = "11";

_tmp.poolElectric = "12";

_tmp.dead_13 = "13";

_tmp.laser = "14";

_tmp.dead_15 = "15";

_super = Entity_1.Entity;

__extends(PlayerBase, _super);

PlayerBase.prototype.addToNewLayer = function (t) {
  var e = this.container.parentContainer;
  if (e !== t) {
    if (e) {
      t.remove(this.grappleRope);
      t.remove(this.container);
      t.remove(this.attackWindGust);
    }
    t.add(this.grappleRope);
    t.add(this.container);
    t.add(this.attackWindGust);
  }
};

PlayerBase.prototype.addStateInfo = function (t, e, i, n, s) {
  var r = {};
  r[o.Head] = e;
  r[o.Body] = i;
  r[o.Hands] = n;
  r[o.Feet] = s;
  this.makeTotalBounds(r);
  this.stateInfos[t] = r;
};

PlayerBase.prototype.createStateInfos = function () {
  this.stateInfos = {};
  this.addStateInfo(
    PlayerState.Stand,
    new r(-4, -33, 8, 10),
    new r(-6, -24, 12, 17),
    new r(1, -20, 8, 10),
    new r(-7, -6, 13, 10),
  );
  this.addStateInfo(
    PlayerState.Running,
    new r(-4, -33, 8, 10),
    new r(-12, -30, 24, 27),
    new r(1, -20, 8, 10),
    new r(-7, -6, 13, 10),
  );
  this.addStateInfo(
    PlayerState.Jumping,
    new r(-4, -33, 8, 17),
    new r(-5, -23, 12, 17),
    new r(4, -35, 8, 16),
    new r(-6, -6, 8, 9),
  );
  this.addStateInfo(
    PlayerState.Sliding,
    new r(-16, -10, 8, 7),
    new r(-13, -12, 18, 10),
    new r(0, -12, 8, 10),
    new r(-7, -6, 13, 10),
  );
  this.addStateInfo(
    PlayerState.Crouching,
    new r(-4, -19, 8, 10),
    new r(-5, -11, 12, 10),
    new r(0, -15, 8, 10),
    new r(-7, -6, 13, 10),
  );
  this.addStateInfo(
    PlayerState.Scaling,
    new r(-4, -33, 8, 10),
    new r(-6, -24, 15, 17),
    new r(4, -37, 8, 20),
    new r(-6, -7, 7, 6),
  );
  this.addStateInfo(
    PlayerState.Zipping,
    new r(-4, -33, 8, 10),
    new r(-4.8, -23, 12, 17),
    new r(-1, -36, 8, 10),
    new r(-7, -6, 13, 9),
  );
  this.addStateInfo(
    PlayerState.Swinging,
    new r(-4, -33, 8, 17),
    new r(-4.8, -23, 12, 17),
    new r(-1, -36, 8, 10),
    new r(-7, -6, 13, 9),
  );
  this.addStateInfo(
    PlayerState.Pushing,
    new r(-4, -33, 8, 17),
    new r(-4.8, -23, 12, 17),
    new r(-2, -26, 8, 10),
    new r(-7, -6, 13, 9),
  );
  this.addStateInfo(
    PlayerState.Swimming,
    new r(-4, -18, 8, 10),
    new r(-6, -9, 12, 17),
    new r(1, -5, 8, 10),
    new r(-7, 9, 13, 10),
  );
  this.stateInfos[PlayerState.Hanging] = this.stateInfos[PlayerState.Scaling];
  this.stateInfos[PlayerState.SwimmingStand] = this.stateInfos[PlayerState.Swimming];
  this.stateInfos[PlayerState.JumpDown] = this.stateInfos[PlayerState.Jumping];
  this.stateInfos[PlayerState.Falling] = this.stateInfos[PlayerState.Jumping];
  this.stateInfos[PlayerState.Kite] = this.stateInfos[PlayerState.Jumping];
  this.stateInfos[PlayerState.Climb] = this.stateInfos[PlayerState.Jumping];
  this.stateInfos[PlayerState.Grapple] = this.stateInfos[PlayerState.Jumping];
  this.stateInfos[PlayerState.Spawning] = this.stateInfos[PlayerState.Stand];
  this.stateInfos[PlayerState.Kicking] = this.stateInfos[PlayerState.Stand];
  this.stateInfos[PlayerState.Land] = this.stateInfos[PlayerState.Stand];
  this.stateInfos[PlayerState.Attack] = this.stateInfos[PlayerState.Stand];
};

PlayerBase.prototype.makeTotalBounds = function (t) {
  t.leftEdgeOff = Math.min(t[o.Hands].xOff, t[o.Feet].xOff, t[o.Head].xOff, t[o.Body].xOff);
  t.topEdgeOff = Math.min(t[o.Hands].yOff, t[o.Feet].yOff, t[o.Head].yOff, t[o.Body].yOff);
  t.rightEdgeOff = Math.max(
    t[o.Hands].xOff + t[o.Hands].width,
    t[o.Feet].xOff + t[o.Feet].width,
    t[o.Head].xOff + t[o.Head].width,
    t[o.Body].xOff + t[o.Body].width,
  );
  t.bottomEdgeOff = Math.max(
    t[o.Hands].yOff + t[o.Hands].height,
    t[o.Feet].yOff + t[o.Feet].height,
    t[o.Head].yOff + t[o.Head].height,
    t[o.Body].yOff + t[o.Body].height,
  );
};

PlayerBase.prototype.setStateInfos = function () {
  this.headInfo = this.stateInfos[this.state][o.Head];
  this.bodyInfo = this.stateInfos[this.state][o.Body];
  this.handsInfo = this.stateInfos[this.state][o.Hands];
  this.feetInfo = this.stateInfos[this.state][o.Feet];
};

PlayerBase.prototype.setPolygon = function (t, e, i, n, s) {
  t.points[0].x = 0;
  t.points[0].y = 0;
  t.points[1].x = e;
  t.points[1].y = 0;
  t.points[2].x = e;
  t.points[2].y = i;
  t.points[3].x = 0;
  t.points[3].y = i;
  t.offset.x = n;
  t.offset.y = s;
};

PlayerBase.prototype.resetHitBoxes = function () {
  var t,
    e,
    i,
    n =
      this.facing === FacingDir.Right
        ? ((t = this.headInfo.xOff), (e = this.handsInfo.xOff), (i = this.bodyInfo.xOff), this.feetInfo.xOff)
        : ((t = -this.headInfo.xOff - this.headInfo.width),
          (e = -this.handsInfo.xOff - this.handsInfo.width),
          (i = -this.bodyInfo.xOff - this.bodyInfo.width),
          -this.feetInfo.xOff - this.feetInfo.width);
  this.setPolygon(this.headPolygon, this.headInfo.width, this.headInfo.height, t, this.headInfo.yOff);
  this.setPolygon(this.handsPolygon, this.handsInfo.width, this.handsInfo.height, e, this.handsInfo.yOff);
  this.setPolygon(this.feetPolygon, this.feetInfo.width, this.feetInfo.height, n, this.feetInfo.yOff);
  this.setPolygon(this.bodyPolygon, this.bodyInfo.width, this.bodyInfo.height, i, this.bodyInfo.yOff);
  this.width = this.stateInfos[this.state].rightEdgeOff - this.stateInfos[this.state].leftEdgeOff;
  this.height = this.stateInfos[this.state].bottomEdgeOff - this.stateInfos[this.state].topEdgeOff;
  this.halfWidth = this.width / 2;
  this.halfHeight = this.height / 2;
  this.setPolygon(
    this.totalPolygon,
    this.width,
    this.height,
    this.stateInfos[this.state].leftEdgeOff,
    this.stateInfos[this.state].topEdgeOff,
  );
  this.updateHitBoxesPos();
};

PlayerBase.prototype.onAnimationComplete = function () {};

PlayerBase.prototype.faceLeft = function () {
  if (this.facing !== FacingDir.Left) {
    this.facing = FacingDir.Left;
    if (this.spine.scaleX > 0) {
      this.spine.scaleX *= -1;
    }
    this.resetHitBoxes();
  }
};

PlayerBase.prototype.faceRight = function () {
  if (this.facing !== FacingDir.Right) {
    this.facing = FacingDir.Right;
    if (this.spine.scaleX < 0) {
      this.spine.scaleX *= -1;
    }
    this.resetHitBoxes();
  }
};

PlayerBase.prototype.setSpineOffX = function (t) {
  this.spine.x = t;
};

PlayerBase.prototype.setSpineOffY = function (t) {
  this.spine.y = t;
};

PlayerBase.prototype.setSkin = function (t) {
  this.spine.setSkin(Helpers_1.Helpers.formatNumberZeroLess10(t));
};

PlayerBase.prototype.updateHitBoxesPos = function () {
  this.headPolygon.pos.x = this.xPos;
  this.headPolygon.pos.y = this.yPos;
  this.bodyPolygon.pos.x = this.xPos;
  this.bodyPolygon.pos.y = this.yPos;
  this.handsPolygon.pos.x = this.xPos;
  this.handsPolygon.pos.y = this.yPos;
  this.feetPolygon.pos.x = this.xPos;
  this.feetPolygon.pos.y = this.yPos;
  this.totalPolygon.pos.x = this.xPos;
  this.totalPolygon.pos.y = this.yPos;
  var t = this.currentSlope ? this.hitBoxForSlope : this.rPos;
  this.headPolygon.setAngle(t);
  this.bodyPolygon.setAngle(t);
  this.handsPolygon.setAngle(t);
  this.feetPolygon.setAngle(t);
  this.totalPolygon.setAngle(t);
};

PlayerBase.prototype.setDirTo = function (t) {
  if (this.facing === FacingDir.Left && t > this.xPos) {
    this.faceRight();
  } else if (this.facing === FacingDir.Right && t < this.xPos) {
    this.faceLeft();
  }
};

PlayerBase.prototype.setDirToVel = function () {
  if (this.facing === FacingDir.Left && this.xVelocity > 0) {
    this.faceRight();
  } else if (this.facing === FacingDir.Right && this.xVelocity < 0) {
    this.faceLeft();
  }
};

PlayerBase.prototype.setPosition = function (t, e) {
  this.xPos = t;
  this.yPos = e;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.forcedXVelocity = 0;
  this.rPos = 0;
  this.rPosDest = 0;
};

PlayerBase.prototype.canCameraLookAround = function () {
  return (
    this.container.visible !== false &&
    (this.state === PlayerState.Stand ||
      this.state === PlayerState.Swimming ||
      this.state === PlayerState.Hanging ||
      this.state === PlayerState.Climb ||
      this.state === PlayerState.Land)
  );
};

PlayerBase.prototype.hide = function () {
  this.hideSprite();
  this.container.visible = false;
  this.alive = false;
  this.appearText.hide();
  this.attackWindGust.stop();
};

PlayerBase.prototype.updatePositions = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
  this.container.rotation = this.rPos;
  this.updateHitBoxesPos();
};

PlayerBase.prototype.hideSprite = function (t) {};

PlayerBase.prototype.landActiveBlock = function (t, e) {
  if (e !== false) {
    if (t.type === "dailyTask") {
      this.main.showPanelDailyTask();
    } else if (t.type === "dailyStage") {
      this.main.playerEnterTowerBlock = true;
      this.main.showSubSceneTransition(SubSceneList_1.SubSceneList.Tower);
    } else if (t.type === "play") {
      this.main.showSubSceneTransition(SubSceneList_1.SubSceneList.Hub);
    } else if (t.type === "skins") {
      this.main.showSubSceneTransition(SubSceneList_1.SubSceneList.SkinsRarity, t.id);
    } else if (t.type === "throphie") {
      this.main.showPanelTrophies();
    } else if (t.type === "gate") {
      t.open();
    } else if (t.hardEnabled !== false) {
      if (t.levelNum === Number(system_1.BalanceData.vexID)) {
        this.main.showSubSceneTransition(SubSceneList_1.SubSceneList.Vex, t.levelNum, t.isHard);
      } else {
        this.main.showSubSceneTransition(SubSceneList_1.SubSceneList.Act, t.levelNum, t.isHard);
      }
    }
  }
};

PlayerBase.prototype.addShield = function () {
  this.shield = new Phaser.GameObjects.Image(this.main, 0, -18, data_1.Atlases.gameplay, "shield 10000");
  this.container.add(this.shield);
  this.shieldCounter = -1;
  this.isShield = true;
};

PlayerBase.prototype.update = function () {
  if (this.showPressDown === true) {
    if (this.appearText.alive === false) {
      this.appearText.show(this.xPos, this.yPos - 70, "pressDownEnter");
    }
    this.main.zoomTo(this.main.zoomAct);
  } else {
    if (this.appearText.isPressDown() === true) {
      this.appearText.hide();
    }
    this.main.zoomTo(this.main.zoomDefault);
  }
  this.appearText.update();
  if (this.shield && this.shieldCounter >= 0) {
    if (this.shieldCounter > 18) {
      this.shield.scale -= 0.05;
      if (this.shield.scaleX <= 0) {
        this.shield.destroy();
        this.shield = null;
        this.isShield = false;
      }
    } else {
      this.shieldCounter += 0.15;
      this.shield.scale = 0.8 + 0.2 * (0.5 + 0.5 * Math.cos(this.shieldCounter));
    }
  }
  this.attackWindGust.update();
};

PlayerBase.prototype.checkAttackPolyCollision = function (t) {
  return this.attackWindGust.visible === true && SAT.testPolygonPolygon(t, this.attackWindGust.poly) === true;
};

PlayerBase.prototype.showGrappleTarget = function (t, e) {
  if (t === false) {
    if (this.state !== PlayerState.Grapple) {
      e.onContact(false, 0);
      this.grapplePoint = null;
    }
  } else {
    if (this.grapplePoint) {
      this.grapplePoint.onContact(false, 0);
    }
    e.onContact(true, 1);
    this.grapplePoint = e;
  }
};

Object.defineProperty(PlayerBase.prototype, "scaleX", {
  get: function () {
    return this.spine.scaleX;
  },
  enumerable: false,
  configurable: true,
});

PlayerBase.prototype.pause = function () {
  this.spine.pause();
  if (system_1.SoundManager.isPlaying("ziplineFull", true) === true) {
    system_1.SoundManager.pause("ziplineFull", true);
  }
  if (system_1.SoundManager.isPlaying("kite", true) === true) {
    system_1.SoundManager.pause("kite", true);
  }
};

PlayerBase.prototype.resume = function () {
  if (system_1.SoundManager.isPaused("ziplineFull", true) === true) {
    system_1.SoundManager.resume("ziplineFull", true);
  }
  if (system_1.SoundManager.isPaused("kite", true) === true) {
    system_1.SoundManager.resume("kite", true);
  }
  this.spine.resume();
  this.keys.resetKeys();
};

var _tmp = PlayerBase;

function PlayerBase(t) {
  var e = _super.call(this, t) || this;
  e.showPressDown = false;
  e.isShield = false;
  e.keys = t.keys;
  e.appearText = new AppearingText_1.AppearingText(t, t.cameraGroup);
  e.container = new Phaser.GameObjects.Container(t);
  e.container.visible = false;
  e.poleRedSection = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "poleRedSection 10000");
  e.poleRedSection.setOrigin(0, 0.5);
  e.poleRedSection.alpha = 0;
  t.layerTopObstacle.add(e.poleRedSection);
  e.grappleRope = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  e.grappleRope.setOrigin(0, 0.5);
  e.grappleRope.tint = 3903231;
  e.grappleRope.visible = false;
  e.breatheGroup = new PlayerBreatheBar_1.PlayerBreatheBar(t);
  e.container.add(e.breatheGroup);
  e.spine = new jd_1.JDSpineGameObject(e.main, 0, 0, "player");
  e.setSkin(system_1.BalanceData.currSkin);
  var i = e.spine.getView();
  i.on(jd_1.JDSpineGameObject.EVENT_COMPLETE, e.onAnimationComplete, e);
  e.container.add(i);
  e.spineHeight = i.height;
  e.jumpPotion = new PlayerJumpPotion_1.PlayerJumpPotion(t);
  e.container.add(e.jumpPotion);
  e.attackWindGust = new PlayerWindGust_1.PlayerWindGust(t, 0, 0);
  e.createStateInfos();
  e.headPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
  ]);
  e.handsPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
  ]);
  e.feetPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
  ]);
  e.bodyPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
  ]);
  e.totalPolygon = new SAT.Polygon(new SAT.Vector(0, 0), [
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
    new SAT.Vector(0, 0),
  ]);
  return e;
}

exports.PlayerBase = _tmp;
