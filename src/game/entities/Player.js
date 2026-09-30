// entities/Player.js — recovered from webpack module #148 of the original vex7.min.js
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

exports.Player = undefined;

var PlayerBase_1 = require("./PlayerBase"),
  Tools_1 = require("../utils/Tools"),
  GameKeys_1 = require("../input/GameKeys"),
  SoundManager_1 = require("../system/SoundManager"),
  Helpers_1 = require("../utils/Helpers"),
  BalanceData_1 = require("../system/BalanceData");

_super = PlayerBase_1.PlayerBase;

__extends(Player, _super);

Player.prototype.spawn = function (t) {
  this.canDieByFalling = !this.main.isTower();
  if (t) {
    this.xPos = t.x;
    this.yPos = t.y;
    this.checkpoint = new Phaser.Geom.Point(this.xPos, this.yPos);
  } else {
    SoundManager_1.SoundManager.stopSFXLoop("ziplineFull");
    SoundManager_1.SoundManager.stopSFXLoop("kite");
    this.resume();
    this.xPos = this.checkpoint.x;
    this.yPos = this.checkpoint.y;
  }
  this.container.visible = true;
  this.setSpawn();
  this.faceRight();
  this.addToNewLayer(this.main.layerPlayer);
  this.keysObtained = 0;
  this.heldKeys = [];
  this.xVelocity = this.forcedXVelocity = 0;
  this.yVelocity = 0;
  this.spine.scaleX = this.spine.scaleY = 1;
  this.rPos = 0;
  this.rPosDest = 0;
  this.disableControls = true;
  this.falling = false;
  this.hanging = false;
  this.scaling = false;
  this.crouching = false;
  this.swimming = false;
  this.kicking = false;
  this.pushing = false;
  this.climb = false;
  this.grapplingHook = false;
  this.grappleRope.visible = false;
  this.grapplePoint = null;
  this.onIce = false;
  this.onSpeedBlock = false;
  this.showPressDown = false;
  this.hangTime = 10;
  this.scaleHistory = undefined;
  this.scaleTime = 0;
  this.poolCoolDown = 0;
  this.currentHang = null;
  this.lastPool = null;
  this.currentPole = null;
  this.currentCannon = null;
  this.currentZipline = null;
  this.lastZipline = null;
  this.currentTorch = null;
  this.currentKite = null;
  this.currentLandBlock = null;
  this.disableCollision = false;
  this.breatheGroup.reset();
  this.poleRedSection.alpha = 0;
  this.jumpPotion.stop();
  this.alive = false;
  this.updatePositions();
};

Player.prototype.hideSprite = function (t) {
  if (t === undefined) {
    t = true;
  }
  this.prevAnimProgress = 0;
  this.setSpineOffX(0);
  this.setSpineOffY(0);
  if (t === true && this.currentKite) {
    SoundManager_1.SoundManager.stopSFXLoop("kite");
    this.currentKite.reset();
    this.currentKite = null;
  }
  this.canPlaySFXFall = true;
};

Player.prototype.setState = function (t, e) {
  this.hideSprite((e = e === undefined ? true : e));
  this.state = t;
  this.animationFinished = false;
  this.scaleTime = 0;
};

Player.prototype.onAnimationComplete = function () {
  this.animationFinished = true;
  var t = this.spine.getCurrentAnimationName();
  if (t === "spawn") {
    this.state = PlayerBase_1.PlayerState.Stand;
    this.alive = true;
    this.disableControls = false;
    this.main.startGamePlay();
  } else if (t === "punch_01") {
    this.setStand();
    this.disableControls = false;
  }
};

Player.prototype.isSpriteAnimFinished = function () {
  return this.animationFinished;
};

Player.prototype.setStand = function () {
  if (this.state === PlayerBase_1.PlayerState.Jumping || this.state === PlayerBase_1.PlayerState.Kite) {
    this.setState(PlayerBase_1.PlayerState.Land);
    this.spine.play("land");
  } else {
    this.setState(PlayerBase_1.PlayerState.Stand);
    this.spine.play("stand");
  }
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setRun = function () {
  this.setState(PlayerBase_1.PlayerState.Running);
  this.spine.play("run", true);
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setJump = function (t, e) {
  var i;
  if (t === undefined) {
    t = true;
  }
  if (e === undefined) {
    e = null;
  }
  if (!(this.state === PlayerBase_1.PlayerState.Jumping && !e)) {
    this.state = PlayerBase_1.PlayerState.Jumping;
    if (t === true) {
      this.hideSprite();
      t = "jump";
      i = 1;
      if (e) {
        if ((this.jumpState = e) === PlayerBase_1.PlayerState.JumpDown) {
          t = "jump_down";
        } else if (e === PlayerBase_1.PlayerState.JumpFrontFlip) {
          t = "jump_front_flip";
          i = this.timeScale_jumpFrontBackFlip;
          this.setSpineOffY(-5);
        } else if (e === PlayerBase_1.PlayerState.JumpBackFlip) {
          t = "jump_back_flip";
          i = this.timeScale_jumpFrontBackFlip;
          this.setSpineOffY(-5);
        }
      } else {
        this.jumpState = PlayerBase_1.PlayerState.Jumping;
      }
      this.spine.play(t, false, i);
    }
    this.setStateInfos();
    this.height = this.stateInfos[this.state].height;
    this.halfHeight = this.height / 2;
    this.resetHitBoxes();
  }
};

Player.prototype.setSlide = function () {
  if (this.state !== PlayerBase_1.PlayerState.Sliding) {
    this.setState(PlayerBase_1.PlayerState.Sliding);
    this.spine.play("slide_down", false, this.timeScale_slide);
    this.setStateInfos();
    this.resetHitBoxes();
  }
};

Player.prototype.setCrouch = function () {
  this.setState(PlayerBase_1.PlayerState.Crouching);
  this.spine.play("crouch", false, this.timeScale_crouch);
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setClimb = function () {
  if (this.state !== PlayerBase_1.PlayerState.Climb) {
    this.setState(PlayerBase_1.PlayerState.Climb);
    this.spine.play("rope_down");
    this.setStateInfos();
    this.resetHitBoxes();
  }
};

Player.prototype.setScale = function () {
  if (this.state !== PlayerBase_1.PlayerState.Scaling) {
    this.setState(PlayerBase_1.PlayerState.Scaling);
    this.spine.play("hang");
    this.setStateInfos();
    this.resetHitBoxes();
  }
};

Player.prototype.setHang = function () {
  this.setState(PlayerBase_1.PlayerState.Hanging);
  this.spine.play("hang");
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setZip = function () {
  this.setState(PlayerBase_1.PlayerState.Zipping);
  this.spine.play("pulley");
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setSwing = function () {
  this.setState(PlayerBase_1.PlayerState.Swinging);
  this.spine.play("swing", true);
  this.setSpineOffY(this.offY_swing);
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setPush = function () {
  this.setState(PlayerBase_1.PlayerState.Pushing);
  this.spine.play("push", true);
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setKick = function () {
  this.setState(PlayerBase_1.PlayerState.Kicking);
  this.spine.play("kick", false, this.timeScale_kick);
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setFall = function () {
  this.setState(PlayerBase_1.PlayerState.Falling);
  this.spine.play("fall");
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.setSwim = function () {
  this.setState(PlayerBase_1.PlayerState.Swimming);
  this.playSwimAnim("swim");
  this.isSwimingStop = false;
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.playSwimAnim = function (t) {
  this.spine.play(t, true);
  this.setSpineOffY(this.spineHeight / 4);
};

Player.prototype.setSpawn = function () {
  this.setState(PlayerBase_1.PlayerState.Spawning);
  this.spine.play("spawn", false, this.timeScale_spawn);
  this.setStateInfos();
  this.resetHitBoxes();
  this.spine.updateAnim();
};

Player.prototype.setKite = function () {
  this.setState(PlayerBase_1.PlayerState.Kite, false);
  this.spine.playFromProgress("jump", 1);
  this.setStateInfos();
  this.resetHitBoxes();
  this.falling = true;
  this.scaling = false;
};

Player.prototype.setAttack = function () {
  this.setState(PlayerBase_1.PlayerState.Attack);
  this.spine.play("punch_01");
  this.setStateInfos();
  this.resetHitBoxes();
};

Player.prototype.portToActBlock = function (t, e) {
  this.disableControls = false;
  this.alive = true;
  this.xPos = t;
  this.yPos = e;
  this.yVelocity = 0;
  this.xVelocity = 0;
  this.forcedXVelocity = 0;
  this.setStand();
  this.updateHitBoxesPos();
  this.updatePositions();
};

Player.prototype.jump = function (t, e, i) {
  if (e === undefined) {
    e = true;
  }
  if (i === undefined) {
    i = null;
  }
  this.yVelocity = t;
  this.falling = true;
  this.scaling = false;
  if (!(this.swimming = false) === this.hanging) {
    this.hanging = false;
    this.hangTime = 0;
    this.currentHang = null;
  }
  if (this.currentPole) {
    if (this.currAnimProgress >= 0 && this.currAnimProgress <= 0.45) {
      this.currentPole = null;
      this.setJump(true, PlayerBase_1.PlayerState.JumpBackFlip);
      if (this.facing === PlayerBase_1.FacingDir.Right) {
        this.xVelocity = 2.5;
        this.xPos += 10;
      } else {
        this.xVelocity = -2.5;
        this.xPos -= 10;
      }
      if (this.currAnimProgress >= 0.12 && this.currAnimProgress <= 0.3) {
        if (this.facing === PlayerBase_1.FacingDir.Right) {
          this.xVelocity = 4.5;
        } else {
          this.xVelocity = -4.5;
        }
      }
      SoundManager_1.SoundManager.playSFX("poleSwing");
      this.yVelocity -= 0.2;
      this.updatePositions();
    } else {
      this.currentPole = null;
      this.yVelocity = 0;
    }
  }
  this.currentZipline = null;
  SoundManager_1.SoundManager.stopSFXLoop("ziplineFull");
  this.setJump(e, i);
  this.updateHitBoxesPos();
};

Player.prototype.land = function (t) {
  if (
    ((this.yVelocity = 0),
    (this.forcedXVelocity *= 0.8),
    (this.yPos = t.yPos - t.halfHeight + t.yVelocity),
    (this.onIce = false),
    (this.onSpeedBlock = false),
    t.type === "ice" ? (this.onIce = true) : t.type === "speed" && (this.onSpeedBlock = true),
    (this.rPosDest = 0),
    (this.falling = false),
    (this.scaling = false),
    (this.hanging = false),
    (this.scaleHistory = undefined),
    (this.currentHang = null),
    (this.lastPool = null),
    this.landOn(t, new Phaser.Geom.Point(this.xPos - t.xPos, this.yPos - t.xPos)),
    t.type === "push" && this.crouching === true && this.kicking === false)
  ) {
    if (t.checkTrapped() === "not trapped") return;
    this.kicking = true;
    this.kickBlock = t;
    this.xVelocity = this.forcedXVelocity = 0;
    this.setKick();
    this.spine.pause();
    this.stateTime = 10;
    if (t.stuckRight) {
      this.faceLeft();
      this.tarKickX = t.rightEdge - this.halfWidth;
    } else {
      this.tarKickX = t.leftEdge + this.halfWidth;
      this.faceRight();
    }
  } else if (!(
    t.type !== "act" &&
    t.type !== "dailyTask" &&
    t.type !== "dailyStage" &&
    t.type !== "play" &&
    t.type !== "skins" &&
    t.type !== "throphie" &&
    t.type !== "gate"
  )) {
    this.landActiveBlock(t, this.crouching);
    this.crouching = false;
    this.showPressDown = true;
  }
  if (!(
    this.state !== PlayerBase_1.PlayerState.Jumping &&
    this.state !== PlayerBase_1.PlayerState.Scaling &&
    this.state !== PlayerBase_1.PlayerState.Hanging &&
    this.state !== PlayerBase_1.PlayerState.Kite
  )) {
    SoundManager_1.SoundManager.playSFX("land");
    if (
      this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === true ||
      this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === true
    ) {
      this.setRun();
    } else {
      this.setStand();
    }
  }
};

Player.prototype.landOn = function (t, e) {
  t.landOn(e);
  this.currentLandBlock = null;
  if (e) {
    this.currentLandBlock = t;
  }
};

Player.prototype.scale = function (t, e) {
  var i;
  if (e === undefined) {
    e = true;
  }
  if (this.state !== PlayerBase_1.PlayerState.Kite && this.state !== PlayerBase_1.PlayerState.Grapple) {
    if (this.scaleTime >= this.maxScaleTime) {
      i = undefined;
      if (e === false) {
        if ((i = t.leftEdge - this.bodyInfo.width / 2 - this.offX_scale_hang) < this.xPos) {
          this.xPos = i;
        }
      } else if ((i = t.rightEdge + this.bodyInfo.width / 2 + this.offX_scale_hang) > this.xPos) {
        this.xPos = i;
      }
    } else {
      if (this.scaling === true) {
        this.lastPool = null;
        if (this.yVelocity > 1) {
          this.yVelocity *= 0.8;
        }
        this.scaleTime += 1;
        if (this.scaleTime > this.maxScaleTime) {
          this.scaling = false;
          this.falling = true;
          this.setJump();
        }
        this.xVelocity = this.forcedXVelocity = 0;
      } else if ((e && this.scaleHistory !== t.rightEdge) || (!e && this.scaleHistory !== t.leftEdge)) {
        this.unGrapple(false);
        this.scaleTime = 0;
        this.scaling = true;
        this.falling = false;
        this.rPos = 0;
        this.rPosDest = 0;
        if (this.yVelocity > 5) {
          SoundManager_1.SoundManager.playSFX("wallSlide");
        } else {
          SoundManager_1.SoundManager.playSFX("connect");
        }
        if (this.yVelocity < 0) {
          this.yVelocity = 0;
        }
        this.scaleHistory = e === true ? t.rightEdge : t.leftEdge;
        this.scaleHistoryTime = 90;
        this.setScale();
        this.xVelocity = this.forcedXVelocity = 0;
      }
      this.xPos =
        e === false
          ? t.leftEdge - this.bodyInfo.width / 2 - this.offX_scale_hang
          : t.rightEdge + this.bodyInfo.width / 2 + this.offX_scale_hang;
    }
  }
};

Player.prototype.hang = function (t, e) {
  if (e === undefined) {
    e = true;
  }
  this.yVelocity = 0;
  this.yPos = t.topEdge - this.handsInfo.yOff - 4;
  this.xPos =
    e === true
      ? t.leftEdge - this.bodyInfo.width / 2 - this.offX_scale_hang
      : t.rightEdge + this.bodyInfo.width / 2 + this.offX_scale_hang;
  if (this.hanging !== true) {
    this.setHang();
    SoundManager_1.SoundManager.playSFX("connectHang");
    this.rPos = 0;
    this.rPosDest = 0;
    this.hanging = true;
    this.falling = false;
    this.currentHang = t;
    this.lastPool = null;
    this.scaleHistory = undefined;
    this.lastZipline = null;
    this.unGrapple(false);
  }
};

Player.prototype.unHang = function () {
  this.hanging = false;
  this.falling = true;
  this.hangTime = 0;
  this.currentHang = null;
};

Player.prototype.unGrapple = function (t) {
  this.disableControls = false;
  this.grappleRope.visible = false;
  this.grapplingHook = false;
  this.forcedXVelocity *= 0.5;
  if (this.grapplePoint) {
    this.grapplePoint.onContact(false, 0);
  }
  this.grapplePoint = null;
  this.yVelocity = 0;
  if (!(this.xVelocity = 0) === t) {
    this.setJump();
  }
};

Player.prototype.checkForBlock = function (t, e) {
  for (var i = 0; i < this.main.blocks.length; i++) {
    var n = this.main.blocks[i];
    if (n.alive && SAT.pointInPolygon(new SAT.Vector(t, e), n.totalPolygon)) return true;
  }
  return false;
};

Player.prototype.checkBlocks = function () {
  if (this.disableCollision !== true) {
    var t = false,
      e = false,
      i = false,
      n = false,
      s = false,
      r = 0,
      o = 0;
    this.showPressDown = false;
    for (var a = 0, h = this.main.blocks; a < h.length; a++) {
      var l,
        u = h[a];
      if (u.alive !== false) {
        if (u.type === "appearingBlock" && u.isIgnore === true) {
          if (SAT.testPolygonPolygon(this.totalPolygon, u.totalPolygon)) continue;
          u.isIgnore = false;
        }
        if (
          u.rightEdge < this.xPos - 10 ||
          u.leftEdge > this.xPos + 10 ||
          u.topEdge > this.yPos ||
          u.bottomEdge < this.yPos - this.height
        )
          u.landOn(null);
        else {
          if (this.yVelocity > this.fallingMax && SAT.testPolygonPolygon(this.totalPolygon, u.topPolygon)) {
            if (u.type === "bounce") {
              this.land(u);
              continue;
            }
            if (this.canDieByFalling === true) return void this.kill(PlayerBase_1.DeathType.hardLanding);
          }
          if (this.keysObtained > 0 && u.type === "lock") {
            var c = u;
            if (c.unlocked === false && SAT.testPolygonPolygon(this.totalPolygon, u.totalPolygon)) {
              c.unlock();
              this.heldKeys.pop().useKey();
              --this.keysObtained;
              continue;
            }
          }
          if (this.currentTorch && u.type === "explosive") {
            c = u;
            if (c.used === false && SAT.testPolygonPolygon(this.totalPolygon, u.totalPolygon)) {
              c.explode();
              this.currentTorch.useKey();
              this.currentTorch = null;
              continue;
            }
          }
          if (
            (this.yVelocity >= 0 || u.yVelocity < 0) &&
            (u.type === "hoverPlatform" || this.yVelocity - u.yVelocity >= -2) &&
            SAT.testPolygonPolygon(this.feetPolygon, u.topPolygon)
          ) {
            if (
              this.keys.isKeyPressed(GameKeys_1.KeyPressed.down) === true &&
              ((this.falling === true && u.type === "glass") || (this.falling === false && u.type === "breakableBlock"))
            ) {
              u.smash();
              if (this.yVelocity >= this.fallingMax / 2) {
                this.yVelocity = this.fallingMax / 2;
              }
            } else {
              if (this.xPos > u.leftEdge && this.xPos < u.rightEdge) {
                this.land(u);
              }
              t = e = true;
            }
          } else {
            if ((this.landOn(u, null), SAT.testPolygonPolygon(this.headPolygon, u.bottomPolygon) === true)) {
              if (this.xPos < u.leftEdge || this.xPos > u.rightEdge) continue;
              if (this.hanging === true || this.yVelocity - u.yVelocity <= 0.5) {
                if (this.scaling || this.hanging) {
                  this.setJump();
                  this.scaling = false;
                  this.scaleTime = 0;
                  this.hanging = false;
                  this.hangTime = 0;
                  this.currentHang = null;
                  this.yVelocity = 1;
                  this.falling = true;
                  this.scaleHistory = undefined;
                  this.lastZipline = null;
                } else {
                  this.yVelocity *= -0.5;
                }
                if (u.type === "ice") {
                  this.yPos = u.yPos + u.halfHeight + u.yVelocity + this.height + 2;
                } else {
                  this.yPos = u.yPos + u.halfHeight + 4 * u.yVelocity + this.height + 1;
                }
                if (u.yVelocity !== 0) {
                  this.yPos += 20;
                  this.yVelocity = 0;
                }
                t = i = true;
                continue;
              }
            }
            if (!this.currentHang && this.poolCoolDown <= 0 && this.swimming === false) {
              if (
                this.hangTime >= this.maxHangCoolDown &&
                ((u.hangable === true && this.falling === true && (this.yVelocity >= 0 || u.yVelocity < 0)) ||
                  this.grapplingHook === true)
              ) {
                if (
                  SAT.testPolygonPolygon(this.handsPolygon, u.lhPolygon) &&
                  !this.checkForBlock(u.leftEdge + 3, u.topEdge - 5) &&
                  !this.checkForBlock(u.leftEdge - 3, u.topEdge - 5)
                ) {
                  this.hang(u);
                  s = t = true;
                  o = u.xVelocity;
                  continue;
                }
                if (
                  SAT.testPolygonPolygon(this.handsPolygon, u.rhPolygon) &&
                  !this.checkForBlock(u.rightEdge + 3, u.topEdge - 5) &&
                  !this.checkForBlock(u.rightEdge + -3, u.topEdge - 5)
                ) {
                  this.hang(u, false);
                  n = t = true;
                  r = u.xVelocity;
                  continue;
                }
              }
            } else {
              if (this.currentHang && this.currentHang.alive === false) {
                this.unHang();
                this.setRun();
                this.xVelocity = 0;
                continue;
              }
              if (this.facing === PlayerBase_1.FacingDir.Right && this.currentHang === u) {
                this.hang(this.currentHang);
                t = s = true;
                o = u.xVelocity;
                continue;
              }
              if (this.facing === PlayerBase_1.FacingDir.Left && this.currentHang === u) {
                this.hang(this.currentHang, false);
                t = n = true;
                r = u.xVelocity;
                continue;
              }
            }
            if ((this.xPos > u.rightEdge || this.xPos < u.leftEdge) && u.scalable)
              if (this.facing === PlayerBase_1.FacingDir.Right) {
                if (
                  (((this.falling || this.scaling) && this.yVelocity >= -3) || this.grapplingHook === true) &&
                  SAT.testPolygonPolygon(this.handsPolygon, u.leftPolygon)
                ) {
                  this.scale(u, false);
                  s = t = true;
                  o = u.xVelocity;
                  continue;
                }
              } else if (
                (((this.falling || this.scaling) && this.yVelocity >= -3) || this.grapplingHook === true) &&
                SAT.testPolygonPolygon(this.handsPolygon, u.rightPolygon)
              ) {
                this.scale(u, true);
                n = t = true;
                r = u.xVelocity;
                continue;
              }
            if (SAT.testPolygonPolygon(this.bodyPolygon, u.leftPolygon) !== true) {
              if (SAT.testPolygonPolygon(this.bodyPolygon, u.rightPolygon) === true) {
                if (this.hanging === true && this.facing === PlayerBase_1.FacingDir.Left) {
                  this.unHang();
                }
                if (
                  u.type === "push" &&
                  this.falling === false &&
                  this.crouching === false &&
                  this.facing === PlayerBase_1.FacingDir.Left
                ) {
                  if (u.xVelocity > this.xVelocity) {
                    u.xVelocity = this.xVelocity;
                  }
                  this.xPos = (l = u).rightEdge + this.halfWidth + this.xVelocity;
                  l.pushingLeft = true;
                  l.pushed = true;
                  if (this.state !== PlayerBase_1.PlayerState.Pushing) {
                    this.setPush();
                  }
                } else {
                  this.xVelocity = this.forcedXVelocity = 0;
                  this.xPos = u.rightEdge + this.bodyInfo.width / 2 - 1;
                  t = n = true;
                  r = u.xVelocity;
                }
              }
            } else {
              if (this.hanging === true && this.facing === PlayerBase_1.FacingDir.Right) {
                this.unHang();
              }
              if (
                u.type === "push" &&
                this.falling === false &&
                this.crouching === false &&
                this.facing === PlayerBase_1.FacingDir.Right
              ) {
                if (u.xVelocity < this.xVelocity) {
                  u.xVelocity = this.xVelocity;
                }
                this.xPos = (l = u).leftEdge - this.halfWidth + this.xVelocity;
                l.pushingRight = true;
                l.pushed = true;
                if (this.state !== PlayerBase_1.PlayerState.Pushing) {
                  this.setPush();
                }
              } else {
                this.xVelocity = this.forcedXVelocity = 0;
                this.xPos = u.leftEdge - this.bodyInfo.width / 2 + 1;
                t = s = true;
                o = u.xVelocity;
              }
            }
          }
        }
      } else if (u.type === "appearingBlock" && u.isIgnore === false) {
        u.isIgnore = true;
      }
    }
    if (!(this.grapplingHook !== true || (i !== true && n !== true && s !== true && e !== true))) {
      this.unGrapple(true);
    }
    if ((e === true && i === true) || (n === true && s === true && (r !== 0 || o !== 0))) {
      this.kill(PlayerBase_1.DeathType.squashed);
    } else if (!(
      t ||
      (e && this.state !== PlayerBase_1.PlayerState.Pushing) ||
      this.currentSlope ||
      this.currentHang
    )) {
      this.falling = true;
      if (this.yVelocity <= this.fallingMax) {
        this.rPosDest = 0;
      }
      if (
        this.state === PlayerBase_1.PlayerState.Running ||
        this.state === PlayerBase_1.PlayerState.Stand ||
        this.state === PlayerBase_1.PlayerState.Pushing
      ) {
        this.setJump();
      } else if (this.crouching) {
        this.setJump();
        this.crouching = false;
      } else if (!(this.scaling !== true && this.hanging !== true)) {
        this.setJump();
        this.scaling = false;
        this.scaleTime = 0;
        this.hanging = false;
        this.hangTime = 0;
      }
    }
  }
};

Player.prototype.checkSlopeCollisions = function () {
  this.currentSlope = null;
  for (var t = 0, e = this.main.slopes; t < e.length; t++) {
    var i = e[t];
    if (i.alive !== false) {
      if (this.facing === PlayerBase_1.FacingDir.Left && i.side === -1) {
        if (
          (this.falling || this.scaling) &&
          this.yPos - this.halfHeight < i.bottomEdge &&
          this.yVelocity > 0 &&
          SAT.testPolygonPolygon(this.handsPolygon, i.wallPoly)
        ) {
          this.currentSlope = i;
          this.xPos = i.rightEdge + this.halfWidth + 1;
          continue;
        }
      } else if (
        this.facing === PlayerBase_1.FacingDir.Right &&
        i.side === 1 &&
        (this.falling || this.scaling) &&
        this.yPos - this.halfHeight < i.bottomEdge &&
        this.yVelocity > 0 &&
        SAT.testPolygonPolygon(this.handsPolygon, i.wallPoly)
      ) {
        this.currentSlope = i;
        this.xPos = i.leftEdge - this.halfWidth - 1;
        continue;
      }
      if (this.hanging === false && this.scaling === false)
        if (i.side === -1 && this.xVelocity < 0) {
          if (SAT.testPolygonPolygon(this.bodyPolygon, i.wallPoly)) {
            this.xPos = i.rightEdge + this.halfWidth;
            this.xVelocity = this.forcedXVelocity = 0;
            continue;
          }
        } else if (i.side === 1 && this.xVelocity > 0 && SAT.testPolygonPolygon(this.bodyPolygon, i.wallPoly)) {
          this.xPos = i.leftEdge - this.halfWidth;
          this.xVelocity = this.forcedXVelocity = 0;
          continue;
        }
      if (
        (this.xPos > i.leftEdge &&
          this.xPos < i.rightEdge &&
          SAT.testPolygonPolygon(this.headPolygon, i.bottomPoly) &&
          this.yPos >= i.bottomEdge + this.halfHeight &&
          this.yVelocity < 0 &&
          ((this.yPos = i.bottomEdge + this.height),
          (this.yVelocity *= -0.5),
          (this.yPos += this.yVelocity),
          this.updatePositions(),
          (this.scaleHistory = undefined),
          (this.currentZipline = null)),
        this.xPos > i.leftEdge && this.xPos < i.rightEdge && this.yPos > i.topEdge && this.yPos < i.bottomEdge)
      ) {
        var n = undefined,
          s = undefined,
          s =
            i.side === -1
              ? ((n = (this.xPos - i.leftEdge) / i.width), -Tools_1.Tools.PI025)
              : ((n = 1 - (this.xPos - i.leftEdge) / i.width), Tools_1.Tools.PI025);
        if (this.yPos >= i.bottomEdge - i.height * n && this.yVelocity > -3.5) {
          if (this.yVelocity >= 10) return void this.kill(PlayerBase_1.DeathType.squashed);
          if (this.state !== PlayerBase_1.PlayerState.Crouching) {
            if (Math.abs(this.xVelocity) > 0.5) {
              if (this.state !== PlayerBase_1.PlayerState.Running) {
                this.setRun();
              }
            } else {
              this.setStand();
            }
          }
          this.yVelocity = 0;
          this.hitBoxForSlope = +s;
          this.yPos = i.bottomEdge - i.height * n + 2;
          this.currentSlope = i;
          this.scaleHistory = undefined;
          this.currentZipline = null;
          this.falling = false;
          this.scaling = false;
          this.hanging = false;
        }
      }
    }
  }
};

Player.prototype.checkKeyboard = function () {
  if (!this.disableControls) {
    if (!(this.currentZipline || this.crouching || this.scaling || this.hanging)) {
      if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === true) {
        if (this.xVelocity > -this.maxVelocity) {
          this.xVelocity -= this.acc;
          if (this.xVelocity > 0) {
            this.xVelocity *= 0.5;
          }
        } else if (this.onIce) {
          this.xVelocity += 0.025 * this.acc;
        } else {
          this.xVelocity += 0.2 * this.acc;
        }
        if (this.state === PlayerBase_1.PlayerState.Pushing && this.xVelocity < -this.maxVelocityPush) {
          this.xVelocity = -this.maxVelocityPush;
        }
        if (this.facing === PlayerBase_1.FacingDir.Right) {
          if (this.state === PlayerBase_1.PlayerState.Pushing) {
            this.setRun();
          }
          this.faceLeft();
        }
        if (!(this.state !== PlayerBase_1.PlayerState.Stand && this.state !== PlayerBase_1.PlayerState.Land)) {
          this.setRun();
        }
      } else if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === true) {
        if (this.xVelocity < this.maxVelocity) {
          this.xVelocity += this.acc;
          if (this.xVelocity < 0) {
            this.xVelocity *= 0.5;
          } else if (this.onIce) {
            this.xVelocity -= 0.025 * this.acc;
          } else {
            this.xVelocity -= 0.2 * this.acc;
          }
        }
        if (this.state === PlayerBase_1.PlayerState.Pushing && this.xVelocity > this.maxVelocityPush) {
          this.xVelocity = this.maxVelocityPush;
        }
        if (this.facing === PlayerBase_1.FacingDir.Left) {
          if (this.state === PlayerBase_1.PlayerState.Pushing) {
            this.setRun();
          }
          this.faceRight();
        }
        if (!(this.state !== PlayerBase_1.PlayerState.Stand && this.state !== PlayerBase_1.PlayerState.Land)) {
          this.setRun();
        }
      } else {
        if (!(this.state !== PlayerBase_1.PlayerState.Running && this.state !== PlayerBase_1.PlayerState.Pushing)) {
          this.setStand();
        }
        this.calcXvelocityDamp();
      }
    }
    this.forcedXVelocity *= 0.98;
  }
};

Player.prototype.calcXvelocityDamp = function () {
  if (this.falling === true) {
    this.xVelocity *= 0.75;
  } else if (this.onIce === true) {
    this.xVelocity *= 0.9;
  } else if (this.xVelocity > 0) {
    this.xVelocity -= 2 * this.acc;
    if (this.xVelocity < 1) {
      this.xVelocity = this.forcedXVelocity = 0;
    }
  } else if (this.xVelocity < 0 && ((this.xVelocity += 2 * this.acc), this.xVelocity > -1)) {
    this.xVelocity = this.forcedXVelocity = 0;
  }
};

Player.prototype.calcXvelocityDampSliding = function () {
  if (this.state === PlayerBase_1.PlayerState.Sliding) {
    if (Math.abs(this.xVelocity) > this.maxVelocity) {
      this.xVelocity *= 0.94;
    }
    if (this.onIce) {
      this.xVelocity *= 0.993;
    } else {
      this.xVelocity *= 0.982;
    }
  } else {
    this.calcXvelocityDamp();
  }
};

Player.prototype.checkCrouch = function () {
  if (this.disableControls !== true) {
    var t = this.keys.isKeyPressed(GameKeys_1.KeyPressed.down);
    if (this.state !== PlayerBase_1.PlayerState.Kite) {
      if (
        this.swimming === false &&
        this.falling === false &&
        this.scaling === false &&
        this.hanging === false &&
        this.kicking === false
      )
        if (t === true) {
          if (this.currentZipline) {
            this.falling = true;
            this.setJump();
            this.lastZipline = this.currentZipline;
            this.currentZipline = null;
            return void SoundManager_1.SoundManager.stopSFXLoop("ziplineFull");
          }
          if (this.currentPole) {
            this.setJump();
            return void (this.currentPole = null);
          }
          if (this.crouching === false) {
            if (this.xVelocity < 0.5 && this.xVelocity > -0.5) {
              this.setCrouch();
              this.crouching = true;
              this.xVelocity = this.forcedXVelocity = 0;
            } else {
              if (this.currentSlope) {
                this.setCrouch();
                this.xVelocity = this.forcedXVelocity = 0;
              } else if (this.state !== PlayerBase_1.PlayerState.Sliding) {
                SoundManager_1.SoundManager.playSFX("slide");
                this.setSlide();
              }
              this.crouching = true;
            }
          } else if (this.xVelocity > -0.5 && this.xVelocity < 0.5) {
            if (this.state === PlayerBase_1.PlayerState.Sliding) {
              if (this.spine.getCurrentAnimationName() === "slide_down") {
                this.spine.play("slide_up");
                this.animationFinished = false;
              } else if (this.isSpriteAnimFinished() === true) {
                this.setCrouch();
              }
            }
            this.crouching = true;
            this.xVelocity = this.forcedXVelocity = 0;
          } else if (
            this.onSpeedBlock &&
            this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === false &&
            this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === false
          ) {
            if (this.state !== PlayerBase_1.PlayerState.Crouching) {
              this.setCrouch();
            }
            this.crouching = true;
            this.xVelocity = this.forcedXVelocity = 0;
          } else {
            this.calcXvelocityDampSliding();
          }
        } else if (
          (this.state === PlayerBase_1.PlayerState.Sliding || this.state === PlayerBase_1.PlayerState.Crouching) &&
          (this.calcXvelocityDampSliding(), this.isSpriteAnimFinished() === true)
        ) {
          var e = this.spine.getCurrentAnimationName();
          if (e === "crouch") {
            this.spine.play("crouch_up", false, this.timeScale_crouch);
            return void (this.animationFinished = false);
          }
          if (e === "slide_down") {
            this.spine.play("slide_up", false, this.timeScale_slide);
            return void (this.animationFinished = false);
          }
          this.setStand();
          this.crouching = false;
          this.updateHitBoxesPos();
          for (var i = 0, n = this.main.blocks; i < n.length; i++) {
            var s = n[i];
            if (s.alive !== false) {
              if (SAT.testPolygonPolygon(this.bodyPolygon, s.rightPolygon)) {
                this.xPos = s.rightEdge + 7;
              } else if (SAT.testPolygonPolygon(this.bodyPolygon, s.leftPolygon)) {
                this.xPos = s.leftEdge - 7;
              }
            }
          }
        }
      if ((this.scaling || this.hanging) && t === true) {
        this.scaling = false;
        this.scaleHistoryTime = 90;
        this.scaleTime = this.maxScaleTime;
        this.unHang();
        this.setJump();
      }
    } else if (t === false && this.yVelocity > this.fallingMaxKite) {
      this.yVelocity -= 2 * this.main.gravity;
    } else if (t === true && this.yVelocity > this.fallingMaxKiteFast) {
      this.yVelocity = this.fallingMaxKiteFast;
    }
  }
};

Player.prototype.checkZipline = function () {
  this.currentZipline = null;
  for (var t = 0, e = this.main.ziplines; t < e.length; t++) {
    var i,
      n = e[t];
    if (!(
      n === this.lastZipline ||
      this.xPos - 40 > n.rightEdge ||
      this.xPos + 40 < n.leftEdge ||
      this.yPos - 80 > n.bottomEdge ||
      this.yPos + 80 < n.topEdge ||
      SAT.testPolygonPolygon(this.handsPolygon, n.hitPolygon) !== true
    )) {
      this.yVelocity = 0.5;
      if (n.direction === PlayerBase_1.FacingDir.Left) {
        i = (n.startPosX - this.xPos) * n.scope + n.startPosY + n.yOff;
        if (this.xVelocity > -4) {
          this.xVelocity -= 0.4 * n.scope;
        }
        if (this.xVelocity < 0 && this.facing === PlayerBase_1.FacingDir.Right) {
          this.faceLeft();
        }
        this.yPos = i + 12;
      } else {
        i = (this.xPos - n.startPosX) * n.scope + n.startPosY + this.height;
        if (this.xVelocity < 4) {
          this.xVelocity += 0.4 * n.scope;
        }
        if (this.xVelocity > 0 && this.facing === PlayerBase_1.FacingDir.Left) {
          this.faceRight();
        }
        this.yPos = i - 2;
      }
      if (this.state !== PlayerBase_1.PlayerState.Zipping) {
        this.setZip();
        SoundManager_1.SoundManager.playSFX("ziplineFull", 3, true);
      }
      this.currentZipline = n;
      this.scaleHistory = undefined;
      this.lastZipline = null;
      this.falling = false;
    }
  }
  if (!(this.state !== PlayerBase_1.PlayerState.Zipping || this.currentZipline)) {
    this.setJump();
    this.falling = true;
    SoundManager_1.SoundManager.stopSFXLoop("ziplineFull");
  }
};

Player.prototype.checkPoleCollisions = function () {
  if (this.currentPole) {
    this.xPos = this.currentPole.xPos;
    this.yPos = this.currentPole.yPos + 30;
    this.xVelocity = this.forcedXVelocity = 0;
    this.yVelocity = 0;
    this.rPosDest = 0;
    this.falling = false;
    if (this.state !== PlayerBase_1.PlayerState.Swinging) {
      this.setSwing();
      this.poleRedSection.x = this.currentPole.xPos;
      this.poleRedSection.y = this.currentPole.yPos;
    }
    this.poleRedSection.alpha -= 0.5 * (this.poleRedSection.alpha - 1);
    if (this.facing === PlayerBase_1.FacingDir.Right) {
      this.poleRedSection.rotation = Tools_1.Tools.toRad(30);
      this.setSpineOffX(-this.offX_swing);
    } else {
      this.poleRedSection.rotation = Tools_1.Tools.toRad(150);
      this.setSpineOffX(this.offX_swing);
    }
    this.scaleHistory = undefined;
    this.lastZipline = null;
  } else {
    for (var t = 0, e = this.main.poles; t < e.length; t++) {
      var i = e[t];
      if (SAT.testPolygonPolygon(this.handsPolygon, i.hitBoxPolygon) === true) {
        if (!this.currentPole) {
          this.xVelocity = this.forcedXVelocity = 0;
          this.yVelocity = 0;
          this.currentPole = i;
          this.falling = false;
          this.rPos = 0;
          this.xPos = this.currentPole.xPos - 2;
          this.yPos = this.currentPole.yPos + 30;
        }
      } else if (SAT.testPolygonPolygon(this.bodyPolygon, i.hitBoxPolygon) === true) {
        if (this.xVelocity > 0) {
          this.xVelocity = this.forcedXVelocity = 0;
          this.xPos = i.xPos - 5;
        } else if (this.xVelocity < 0) {
          this.xVelocity = this.forcedXVelocity = 0;
          this.xPos = i.xPos + 5;
        }
      }
    }
    if (this.poleRedSection.alpha > 0) {
      this.poleRedSection.alpha -= 0.25 * this.poleRedSection.alpha;
    }
  }
};

Player.prototype.performKick = function () {
  if (this.kickBlock.stuckRight) {
    this.kickBlock.xVelocity = -15;
    this.xPos -= 10;
  } else {
    this.kickBlock.xVelocity = 15;
    this.xPos += 10;
  }
  this.kickBlock.stuckLeft = this.kickBlock.stuckRight = false;
  this.kickBlock.xPos += this.kickBlock.xVelocity;
  this.kicking = false;
  this.kickBlock = null;
  this.tarKickX = 0;
  this.crouching = false;
  SoundManager_1.SoundManager.playSFX("kickBlock");
  this.jump(-3.84, false);
};

Player.prototype.checkPoolCollisions = function () {
  for (var t = false, e = 0, i = this.main.pools; e < i.length; e++) {
    var n = i[e];
    if (SAT.testPolygonPolygon(this.bodyPolygon, n.totalPolygon)) {
      if ((this.currentTorch && (this.currentTorch.reset(), (this.currentTorch = null)), (t = true) === n.electric))
        return void this.kill(PlayerBase_1.DeathType.poolElectric, true);
      if (this.state !== PlayerBase_1.PlayerState.Swimming && this.yVelocity >= 0) {
        SoundManager_1.SoundManager.playSFX("splash1");
        this.swimming = true;
        this.swimminBack = true;
        this.lastSwimmingBack = false;
        this.scaling = false;
        this.hanging = false;
        this.falling = false;
        this.crouching = false;
        this.faceRight();
        this.setSwim();
        this.addToNewLayer(this.main.layerUnderPool);
        this.rPos = 0;
        this.scaleHistory = undefined;
        this.lastZipline = null;
        this.rPosDest = 0;
      }
    }
    if (this.yVelocity < 0 && SAT.testPolygonPolygon(this.feetPolygon, n.topPolygon)) {
      SoundManager_1.SoundManager.playSFX("splash1");
      this.lastPool = n;
      if (this.state === PlayerBase_1.PlayerState.Swimming) {
        this.jump(-5);
        this.poolCoolDown = 30;
        this.addToNewLayer(this.main.layerPlayer);
      }
      this.rPos = 0;
    }
  }
  if (
    t === false &&
    ((this.swimming = false),
    this.state === PlayerBase_1.PlayerState.Swimming && (this.setJump(), (this.falling = true)),
    this.poolCoolDown > 0)
  ) {
    --this.poolCoolDown;
  }
};

Player.prototype.getSwim = function () {
  var t, e, i, n, s;
  if (this.state === PlayerBase_1.PlayerState.Swimming) {
    if (
      this.keys.isKeyPressed(GameKeys_1.KeyPressed.up) === false &&
      this.keys.isKeyPressed(GameKeys_1.KeyPressed.down) === false &&
      ((this.xVelocity *= 0.88),
      (this.yVelocity *= 0.88),
      this.xVelocity < 0.5 && this.xVelocity > -0.5 && (this.xVelocity = this.forcedXVelocity = 0),
      this.yVelocity < 0.5) &&
      this.yVelocity > -0.5
    ) {
      this.yVelocity = 0;
    }
    if (!this.currentCannon) {
      if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === true) {
        this.rPos = (this.rPos - Tools_1.Tools.toRad(3.5)) % Tools_1.Tools.PI2;
        this.resetHitBoxes();
      } else if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === true) {
        this.rPos = (this.rPos + Tools_1.Tools.toRad(3.5)) % Tools_1.Tools.PI2;
        this.resetHitBoxes();
      }
      t = this.rPos;
      if (
        this.facing === PlayerBase_1.FacingDir.Left &&
        ((t > 0 && t < Math.PI) || (t > -Tools_1.Tools.PI2 && t < -Math.PI))
      ) {
        this.faceRight();
      } else if (
        this.facing === PlayerBase_1.FacingDir.Right &&
        ((t < 0 && t > -Math.PI) || (t > Math.PI && t < Tools_1.Tools.PI2))
      ) {
        this.faceLeft();
      }
      if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.up) === true) {
        this.swimminBack = false;
        e = this.rPos - Tools_1.Tools.PI05;
        i = Math.cos(e) / 2;
        n = Math.sin(e) / 2;
        s = 3;
        this.xVelocity += i;
        this.yVelocity += n;
        if ((i > 0 && this.xVelocity > i * s) || (i < 0 && this.xVelocity < i * s)) {
          this.xVelocity = i * s;
        }
        if ((n > 0 && this.yVelocity > n * s) || (n < 0 && this.yVelocity < n * s)) {
          this.yVelocity = n * s;
        }
        if (Math.random() < 0.1) {
          this.main.particleManager.createColorParticle(
            this.xPos + 10 * Math.random() - 5,
            this.yPos - 0.5 * this.height + 10 * Math.random() - 5,
            -this.xVelocity / 2 + Math.random(),
            -this.yVelocity / 2 + Math.random(),
            56814,
            4,
            true,
            true,
          );
        }
      } else if (
        this.keys.isKeyPressed(GameKeys_1.KeyPressed.down) === true &&
        ((this.swimminBack = true),
        (e = this.rPos - Tools_1.Tools.PI05),
        (i = -Math.cos(e) / 2),
        (n = -Math.sin(e) / 2),
        (s = 2),
        (this.xVelocity += i),
        (this.yVelocity += n),
        ((i > 0 && this.xVelocity > i * s) || (i < 0 && this.xVelocity < i * s)) && (this.xVelocity = i * s),
        (n > 0 && this.yVelocity > n * s) || (n < 0 && this.yVelocity < n * s))
      ) {
        this.yVelocity = n * s;
      }
    }
    this.xPos += this.xVelocity;
    this.yPos += this.yVelocity;
  }
};

Player.prototype.checkSwimBlockCollisions = function () {
  for (var t = 0; t < this.main.blocks.length; t++) {
    var e = this.main.blocks[t];
    if (!(
      e.alive === false ||
      e.rightEdge < this.xPos - 40 ||
      e.leftEdge > this.xPos + 40 ||
      e.topEdge > this.yPos + 80 ||
      e.bottomEdge < this.yPos - 80
    )) {
      if (this.keysObtained > 0 && e.type === "lock") {
        var i = e;
        if (!i.unlocked && SAT.testPolygonPolygon(this.totalPolygon, e.totalPolygon)) {
          i.unlock();
          this.heldKeys.pop().useKey();
          --this.keysObtained;
          continue;
        }
      }
      if (SAT.testPolygonPolygon(this.totalPolygon, e.topPolygon)) {
        this.yPos = e.topEdge - 20;
        this.yVelocity *= -1;
      } else if (SAT.testPolygonPolygon(this.totalPolygon, e.bottomPolygon)) {
        this.yVelocity *= -1;
        this.yPos = e.bottomEdge + 20;
      } else if (SAT.testPolygonPolygon(this.totalPolygon, e.leftPolygon)) {
        this.xVelocity *= -1;
        this.xPos = e.leftEdge - 20;
      } else if (SAT.testPolygonPolygon(this.totalPolygon, e.rightPolygon)) {
        this.xVelocity *= -1;
        this.xPos = e.rightEdge + 20;
      }
    }
  }
};

Player.prototype.kill = function (t, e) {
  if (e === undefined) {
    e = false;
  }
  if (this.isShield !== true && this.alive !== false) {
    if (this.main.currLevelID !== BalanceData_1.BalanceData.towerID) {
      this.breatheGroup.visible = false;
      this.main.playerDeath(e, this.xPos, this.yPos, this.height);
      this.spawn();
      this.appearText.show(this.xPos, this.yPos, Helpers_1.Helpers.getDeathText(t));
    } else {
      this.main.finishTowerStage();
    }
  } else if (this.shield && this.shieldCounter < 0) {
    this.shieldCounter = 0;
  }
};

Player.prototype.getRotation = function () {
  var t = Tools_1.Tools.toRad(5 + Math.abs(this.xVelocity));
  this.rPosDest = this.rPosDest % Tools_1.Tools.PI2;
  this.rPos = this.rPos % Tools_1.Tools.PI2;
  if (Math.abs(this.rPosDest - this.rPos) <= t) {
    this.rPos = this.rPosDest;
  }
  if (Math.abs(this.rPosDest - this.rPos) > Math.PI) {
    if (this.rPosDest < this.rPos) {
      this.rPosDest += Tools_1.Tools.PI2;
    } else {
      this.rPosDest -= Tools_1.Tools.PI2;
    }
  }
  if (this.rPosDest > this.rPos) {
    this.rPos += t + (this.rPosDest - this.rPos) / 6;
  } else if (this.rPosDest < this.rPos) {
    this.rPos -= t - (this.rPosDest - this.rPos) / 6;
  }
};

Player.prototype.loseKey = function (t) {
  t = this.heldKeys.indexOf(t);
  this.heldKeys.splice(t, 1);
  --this.keysObtained;
};

Player.prototype.applyForce = function (t, e) {
  if (!(this.currentLandBlock && this.currentLandBlock.type === "hoverPlatform")) {
    this.xVelocity += t;
    if (!this.currentLandBlock || e < 0) {
      this.yVelocity += e;
    }
    this.setDirToVel();
  }
};

Player.prototype.keyPressed = function (t, e) {
  if (this.alive !== false && e !== false) {
    if (this.disableControls !== true) {
      if (t === GameKeys_1.KeyPressed.left) {
        if (this.state === PlayerBase_1.PlayerState.Climb && this.facing === PlayerBase_1.FacingDir.Left) {
          this.climbFaceRight();
        }
      } else if (t === GameKeys_1.KeyPressed.right) {
        if (this.state === PlayerBase_1.PlayerState.Climb && this.facing === PlayerBase_1.FacingDir.Right) {
          this.climbFaceLeft();
        }
      } else if (t === GameKeys_1.KeyPressed.up) {
        if (this.state !== PlayerBase_1.PlayerState.Swimming) {
          if (this.state === PlayerBase_1.PlayerState.Climb) {
            if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === true) {
              this.climbJumpOut(-this.offX_climb_left, -4.5);
            } else if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === true) {
              this.climbJumpOut(this.offX_climb_right, 4.5);
            }
          } else if (this.state === PlayerBase_1.PlayerState.Kite) {
            this.jump(-3.84);
          } else if (this.grapplePoint) {
            this.grapplingHook = false;
            this.disableControls = true;
            this.state = PlayerBase_1.PlayerState.Grapple;
            this.grappleRope.visible = true;
            this.grappleRope.displayWidth = 0;
            if (this.hanging === false && this.scaling === false) {
              this.setDirTo(this.grapplePoint.xPos);
              this.setStateInfos();
              this.resetHitBoxes();
              this.setSpineOffX(0);
              this.setSpineOffY(0);
              this.spine.play("grappling_hang");
            } else {
              this.spine.play("grappling_wall");
            }
            this.xVelocity = this.forcedXVelocity = 0;
            this.yVelocity = 0;
          } else if (this.currentCannon) {
            this.currentCannon.firing = true;
          } else if (this.crouching === false) {
            if (this.falling === false) {
              this.jump(-6.15);
            } else if (this.jumpState === PlayerBase_1.PlayerState.Jumping) {
              this.setJump(true, PlayerBase_1.PlayerState.JumpFrontFlip);
            }
          }
        }
      } else if (t === GameKeys_1.KeyPressed.down) {
        if (!(
          this.state === PlayerBase_1.PlayerState.Climb ||
          this.state === PlayerBase_1.PlayerState.Kite ||
          this.falling !== true ||
          this.lastPool ||
          this.currentPole
        )) {
          if (this.state !== PlayerBase_1.PlayerState.Falling) {
            this.setJump(true, PlayerBase_1.PlayerState.JumpDown);
            if (this.yVelocity < 0) {
              this.yVelocity *= 0.5;
            }
            this.yPos += 0.75 * this.yVelocity;
          }
        }
      } else if (!(
        t !== GameKeys_1.KeyPressed.punch ||
        (this.state !== PlayerBase_1.PlayerState.Stand &&
          this.state !== PlayerBase_1.PlayerState.Running &&
          this.state !== PlayerBase_1.PlayerState.Jumping &&
          this.state !== PlayerBase_1.PlayerState.JumpBackFlip &&
          this.state !== PlayerBase_1.PlayerState.JumpDown &&
          this.state !== PlayerBase_1.PlayerState.JumpFrontFlip &&
          this.state !== PlayerBase_1.PlayerState.Crouching &&
          this.state !== PlayerBase_1.PlayerState.Falling &&
          this.state !== PlayerBase_1.PlayerState.Land)
      )) {
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.forcedXVelocity = 0;
        this.setAttack();
        this.disableControls = true;
        this.crouching = false;
      }
    } else if (this.state === PlayerBase_1.PlayerState.Grapple) {
      if (t === GameKeys_1.KeyPressed.down) {
        this.unGrapple(true);
      } else if (t === GameKeys_1.KeyPressed.up && this.grappleFlyTo === false) {
        this.unGrapple(false);
        this.jump(-6.15 - 50 * Math.abs(this.ropeAngleVel));
      }
    }
  }
};

Player.prototype.update = function () {
  if (this.alive === true) {
    if (
      ((this.currAnimProgress = this.spine.getAnimationProgress()),
      this.state === PlayerBase_1.PlayerState.Spawning || this.state === PlayerBase_1.PlayerState.Finish)
    )
      return;
    var t;
    if (this.state === PlayerBase_1.PlayerState.Climb) {
      this.updateStateClimb();
    } else if (this.state === PlayerBase_1.PlayerState.Running) {
      if (
        (this.currAnimProgress >= 0.3 && this.prevAnimProgress < 0.3) ||
        (this.currAnimProgress >= 0.8 && this.prevAnimProgress < 0.8)
      ) {
        SoundManager_1.SoundManager.playSFX("footstep" + Tools_1.Tools.random(1, 6), 2);
      }
    } else if (this.state === PlayerBase_1.PlayerState.Kicking) {
      if (this.stateTime <= 0) {
        this.performKick();
        this.spine.resume();
      } else {
        t = this.tarKickX - this.xPos;
        this.xPos += t / 5;
        if (Math.abs(t) < 0.5) {
          this.xPos = this.tarKickX;
        }
        --this.stateTime;
      }
    } else if (this.state === PlayerBase_1.PlayerState.Swinging) {
      if (this.currAnimProgress >= 0.12 && this.prevAnimProgress < 0.12) {
        SoundManager_1.SoundManager.playSFX("poleWoosh");
      }
    } else if (this.state === PlayerBase_1.PlayerState.Swimming) {
      t = this.xVelocity === 0 && this.yVelocity === 0;
      if (!this.isSwimingStop && t) {
        this.isSwimingStop = true;
        this.hideSprite();
        this.playSwimAnim("stop_swim");
      } else if (this.isSwimingStop && !t) {
        this.isSwimingStop = false;
        this.hideSprite();
        if (this.swimminBack === true) {
          this.playSwimAnim("swim_down");
        } else {
          this.playSwimAnim("swim");
        }
      } else if (!(this.isSwimingStop || t)) {
        if (this.lastSwimmingBack !== this.swimminBack) {
          this.lastSwimmingBack = this.swimminBack;
          if (this.swimminBack === true) {
            this.playSwimAnim("swim_down");
          } else {
            this.playSwimAnim("swim");
          }
        }
      }
    } else if (this.state === PlayerBase_1.PlayerState.Attack) {
      if (this.currAnimProgress >= 0.7 && this.prevAnimProgress < 0.7) {
        this.attackWindGust.start(this.xPos, this.yPos - this.halfHeight, this.facing);
      }
    } else if (
      this.state === PlayerBase_1.PlayerState.Jumping &&
      this.yVelocity > 0 &&
      this.jumpPotion.visible === true
    ) {
      this.jump(-6.15, true, PlayerBase_1.PlayerState.JumpFrontFlip);
      this.jumpPotion.stop();
    }
    if (this.currentCannon) {
      this.rPos = this.currentCannon.rad + Tools_1.Tools.PI05;
      this.rPosDest = this.rPos;
      if (this.rPos > Tools_1.Tools.PI2) {
        this.rPos -= Tools_1.Tools.PI2;
        this.rPosDest -= Tools_1.Tools.PI2;
      }
      this.falling = false;
      this.yVelocity = this.xVelocity = this.forcedXVelocity = 0;
      this.xPos = this.currentCannon.xPos + 50 * Math.cos(this.currentCannon.rad);
      this.yPos = this.currentCannon.yPos + 50 * Math.sin(this.currentCannon.rad);
    } else {
      if (this.swimming === false && this.kicking === false && this.climb === false) {
        this.checkKeyboard();
        this.checkCrouch();
        if (
          this.state !== PlayerBase_1.PlayerState.Grapple &&
          this.state !== PlayerBase_1.PlayerState.Attack &&
          ((this.yVelocity += this.main.gravity), this.yVelocity > this.fallingMax)
        ) {
          if (this.canDieByFalling === true) {
            if (this.state !== PlayerBase_1.PlayerState.Falling) {
              this.setFall();
            }
            this.rPosDest += Tools_1.Tools.toRad(-this.spine.scaleX * this.yVelocity * 0.25);
            if ((t = Math.abs(this.rPos)) > Tools_1.Tools.PI05 && this.canPlaySFXFall === true) {
              SoundManager_1.SoundManager.playSFX("fall");
              this.canPlaySFXFall = false;
            } else if (t > Math.PI) {
              this.kill(PlayerBase_1.DeathType.fall);
            }
          } else {
            this.yVelocity = this.fallingMax;
          }
        }
        this.checkRopeCollisions();
      }
      this.xPos += this.xVelocity + this.forcedXVelocity;
      this.yPos += this.yVelocity;
      if (this.currentSlope) {
        this.yPos += this.xVelocity * this.currentSlope.side;
      }
      if (this.hangTime < this.maxHangCoolDown) {
        this.hangTime += 1;
      }
      if (
        this.state !== PlayerBase_1.PlayerState.Scaling &&
        this.scaleHistory !== undefined &&
        this.scaleHistoryTime > 0 &&
        (--this.scaleHistoryTime, this.scaleHistoryTime === 0)
      ) {
        this.scaleHistory = undefined;
        this.scaleTime = 0;
      }
      this.checkPoolCollisions();
      if (this.swimming === true) {
        this.getSwim();
        this.checkSwimBlockCollisions();
        if (this.breatheGroup.show(this.rPos) <= 0) {
          this.kill(PlayerBase_1.DeathType.drowned);
        }
      } else {
        if (this.climb === false) {
          if (this.state === PlayerBase_1.PlayerState.Grapple) {
            this.updateStateGrapple();
          }
          this.checkBlocks();
          this.checkSlopeCollisions();
          this.checkPoleCollisions();
        }
        if ((this.falling === true || this.currentZipline) && this.yVelocity > 0) {
          this.checkZipline();
        }
        this.getRotation();
        this.breatheGroup.addBreath(2);
        this.breatheGroup.hide();
        this.jumpPotion.update(this.scaleX, this.state);
      }
    }
    this.updatePositions();
    this.prevAnimProgress = this.currAnimProgress;
  }
  _super.prototype.update.call(this);
};

Player.prototype.checkRopeCollisions = function () {
  for (var t = 0, e = this.main.ropes; t < e.length; t++) {
    var i = e[t];
    if (SAT.testPolygonPolygon(this.totalPolygon, i.totalBoundPolygon)) {
      if (i.yPos - this.yPos > i.halfHeight - 40) return;
      this.rPosDest = 0;
      this.rPos = 0;
      this.setClimb();
      this.currentRope = i;
      this.climb = true;
      this.falling = false;
      this.yVelocity = 0;
      this.xVelocity = 0;
      if (this.facing === PlayerBase_1.FacingDir.Right) {
        this.climbFaceRight();
      } else {
        this.climbFaceLeft();
      }
    }
  }
};

Player.prototype.climbFaceLeft = function () {
  this.xPos = this.currentRope.xPos;
  this.faceLeft();
  this.setSpineOffX(this.offX_climb_right);
};

Player.prototype.climbFaceRight = function () {
  this.xPos = this.currentRope.xPos;
  this.faceRight();
  this.setSpineOffX(-this.offX_climb_left);
};

Player.prototype.climbJumpOut = function (t, e) {
  this.climb = false;
  this.currentRope = null;
  this.xPos += t;
  this.xVelocity = e;
  this.yVelocity -= 4;
  this.setJump();
  this.falling = true;
};

Player.prototype.updateStateClimb = function () {
  if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.up) === true) {
    if (
      this.spine.currAnimationName !== "rope" ||
      (this.spine.isPlaying === false && this.spine.currAnimationName === "rope")
    ) {
      this.spine.play("rope", true);
    }
    if (this.yPos > this.currentRope.yPos - this.currentRope.halfHeight + 40) {
      this.yPos -= BalanceData_1.BalanceData.config_RopeUpVelY;
      this.checkSwimBlockCollisions();
    }
  } else if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.down) === true) {
    if (this.spine.currAnimationName !== "rope_down") {
      this.spine.play("rope_down");
    }
    this.yPos += BalanceData_1.BalanceData.config_RopeDownVelY;
    this.checkSwimBlockCollisions();
    if (this.yPos > this.currentRope.yPos + this.currentRope.halfHeight + 10) {
      this.climb = false;
      this.currentRope = null;
    }
  } else {
    this.spine.stop();
  }
};

Player.prototype.updateStateGrapple = function () {
  var t = +this.scaleX,
    e = this.height - 11,
    i = this.xPos - t,
    n = this.yPos - e;
  this.ropeAngle = Tools_1.Tools.angleOfPoints(i, n, this.grapplePoint.xPos, this.grapplePoint.yPos);
  var s,
    r = Tools_1.Tools.distance(i, n, this.grapplePoint.xPos, this.grapplePoint.yPos) - 16;
  if (this.grapplingHook === false) {
    if (r <= (s = this.grappleRope.displayWidth + 30)) {
      s = r;
      this.spine.play("grappling_hang");
      this.setStateInfos();
      this.resetHitBoxes();
      this.setSpineOffX(0);
      this.setSpineOffY(0);
      this.grapplingHook = true;
      this.grappleFlyTo = true;
      this.falling = true;
      this.xVelocity = 0;
      this.forcedXVelocity = 2 * Math.cos(this.grappleRope.rotation);
      this.yVelocity = 2 * Math.sin(this.grappleRope.rotation);
      if (!(this.hanging !== true && this.scaling !== true)) {
        this.setDirTo(this.grapplePoint.xPos);
        this.unHang();
        this.scaling = false;
        this.scaleHistory = undefined;
        this.scaleTime = 0;
      }
    }
    this.grappleRope.displayWidth = s;
  } else {
    if (this.grappleFlyTo === true) {
      if (Tools_1.Tools.vec2Length(this.forcedXVelocity, this.yVelocity) < 13) {
        this.forcedXVelocity *= 1.12;
        this.yVelocity *= 1.12;
      }
      if (this.grapplePoint.isB === true && r <= 100) {
        this.ropeAngleVel = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.forcedXVelocity = 0;
        this.grappleFlyTo = false;
      }
    } else {
      r = 100;
      s = -Tools_1.Tools.toRad(0.2) * Math.cos(this.ropeAngle);
      if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.left) === true) {
        s += 0.001;
        this.faceLeft();
      } else if (this.keys.isKeyPressed(GameKeys_1.KeyPressed.right) === true) {
        s -= 0.001;
        this.faceRight();
      }
      this.ropeAngleVel += s;
      this.ropeAngle += this.ropeAngleVel;
      this.ropeAngleVel *= 0.987;
      i = this.grapplePoint.xPos - Math.cos(this.ropeAngle) * r;
      n = this.grapplePoint.yPos - Math.sin(this.ropeAngle) * r;
      this.xPos += i - this.xPos + t;
      this.yPos += n - this.yPos + e;
      r -= 16;
    }
    this.grappleRope.displayWidth = r;
  }
  s =
    this.facing === PlayerBase_1.FacingDir.Right
      ? Tools_1.Tools.toDeg(-this.ropeAngle - Tools_1.Tools.PI05)
      : Tools_1.Tools.toDeg(this.ropeAngle + Tools_1.Tools.PI05);
  if (this.spine.currAnimationName === "grappling_hang") {
    this.spine.getView().findBone("L_arm").rotation = s - 34;
  } else {
    this.spine.getView().findBone("L_arm").rotation = s + 5;
  }
  this.spine.getView().findBone("R_arm").rotation = this.spine.getView().findBone("L_arm").rotation;
  this.grappleRope.x = i + 16 * Math.cos(this.ropeAngle);
  this.grappleRope.y = n + 16 * Math.sin(this.ropeAngle);
  this.grappleRope.rotation = this.ropeAngle;
};

Player.prototype.checkCollideWithCannon = function (t) {
  if (!(this.alive !== true || this.currentCannon)) {
    if (
      Tools_1.Tools.distance(this.xPos, this.yPos, t.xPos, t.yPos) < 85 &&
      (this.addToNewLayer(this.main.layerUnderPool),
      SoundManager_1.SoundManager.playSFX("cannonEnter"),
      (this.currentCannon = t),
      this.swimming === false)
    ) {
      this.setStand();
    }
  }
};

Player.prototype.cannonFire = function (t, e, i, n, s, r) {
  var o = i * s,
    a = n * s;
  if (!(this.currentCannon = null) === this.swimming) {
    this.xVelocity = o;
  } else {
    this.forcedXVelocity = o;
  }
  this.yVelocity = a;
  this.xPos = t + i * r;
  this.yPos = e + n * r;
  this.rPosDest = 0;
  SoundManager_1.SoundManager.playSFX("cannonFire");
  for (var h = 0; h < 10; h++)
    this.main.particleManager.createColorParticle(
      this.xPos,
      this.yPos,
      o * (Math.random() + 0.25),
      a * (Math.random() + 0.25),
      16759552,
      4,
    );
  if (this.swimming === false) {
    this.falling = true;
    this.setJump();
  }
  this.addToNewLayer(this.main.layerPlayer);
  this.updateHitBoxesPos();
};

Player.prototype.checkCollideWithFinish = function (t) {
  if (this.state === PlayerBase_1.PlayerState.Finish) {
    this.xPos += (t.xPos - this.xPos) / 20;
    this.yPos += (t.yPos - this.yPos) / 20;
    this.container.rotation += 0.07 * this.spine.scaleX;
    this.spine.scaleX *= 0.97;
    this.spine.scaleY = Math.abs(this.spine.scaleX);
    if (this.spine.scaleY < 0.3) {
      this.main.finishLevel();
    }
    this.updatePositions();
  } else if (SAT.testPolygonPolygon(this.totalPolygon, t.hitBoxPolygon)) {
    this.alive = false;
    this.spine.play("fall");
    this.state = PlayerBase_1.PlayerState.Finish;
    this.main.timerLive = false;
    BalanceData_1.BalanceData.actFinishTime = Date.now() - BalanceData_1.BalanceData.actStartTime;
  }
};

Player.prototype.collideWithKey = function (t) {
  this.heldKeys.push(t);
  this.keysObtained += 1;
};

Player.prototype.collideWithTorch = function (t) {
  this.currentTorch = t;
};

Player.prototype.collideWithKite = function (t) {
  this.currentKite = t;
  this.setKite();
  SoundManager_1.SoundManager.playSFX("kite", 0.7, true);
};

Player.prototype.collideWithJumpPotion = function () {
  this.jumpPotion.start();
};

Player.prototype.collideWithCheckPoint = function (t) {
  this.checkpoint.setTo(t.xPos, t.yPos);
  this.appearText.show(t.xPos, t.yPos - 30, "checkpoint");
};

Player.prototype.collideWithBreatheBlaster = function () {
  this.breatheGroup.addBreath(2.5);
};

var _Player = Player;

function Player(t) {
  t = _super.call(this, t) || this;
  t.timeScale_spawn = 1.5;
  t.timeScale_crouch = 1.5;
  t.timeScale_slide = 1.3;
  t.timeScale_jumpFrontBackFlip = 1.3;
  t.timeScale_kick = 1.6;
  t.offX_climb_left = 15;
  t.offX_climb_right = 10;
  t.offX_swing = 5;
  t.offY_swing = 7;
  t.offX_scale_hang = 1;
  t.maxVelocity = 3.5;
  t.maxVelocityPush = 2.5;
  t.acc = 0.5;
  t.fallingMax = 16;
  t.fallingMaxKite = 1.5;
  t.fallingMaxKiteFast = 5;
  t.scaleHistoryTime = 0;
  t.maxScaleTime = 90;
  t.maxHangCoolDown = 20;
  t.alive = false;
  t.deaths = 0;
  return t;
}

exports.Player = _Player;
