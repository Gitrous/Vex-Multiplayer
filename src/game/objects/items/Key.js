// objects/items/Key.js — recovered from webpack module #49 of the original vex7.min.js
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

exports.Key = undefined;

var data_1 = require("../../data"),
  PlayerBase_1 = require("../../entities/PlayerBase"),
  Tools_1 = require("../../utils/Tools");

_super = require("./Item").Item;

__extends(Key, _super);

Key.prototype.init = function (t, e, i) {
  this.sprite = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, e);
  t.add(this.sprite);
  this.lineGraphic = new Phaser.GameObjects.Image(this.main, 0, 0, data_1.Atlases.gameplay, "whiteLine 10000");
  this.lineGraphic.setOrigin(0, 0.5);
  this.lineGraphic.tint = i;
  t.add(this.lineGraphic);
};

Key.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startX = this.xPos;
  this.startY = this.yPos;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.alive = true;
  this.used = false;
  this.keyNum = 0;
  this.saveUse = false;
  this.following = false;
  this.lineGraphic.visible = false;
  this.rad = 0;
};

Key.prototype.useKey = function () {
  this.used = true;
  this.lineGraphic.visible = false;
  this.sprite.visible = false;
  this.alive = false;
};

Key.prototype.followPlayer = function () {
  var t,
    e = 10 * (this.keyNum - 1);
  this.rad = Tools_1.Tools.toRad(-4 * this.player.xVelocity);
  if (this.yVelocity < 0) {
    this.yVelocity += 0.5;
  }
  this.yPos += this.yVelocity;
  e = this.player.swimming
    ? ((t = this.player.xPos), this.player.yPos - e)
    : ((t = this.player.facing === PlayerBase_1.FacingDir.Right ? this.player.xPos - 30 : this.player.xPos + 30),
      this.player.yPos - 6 - e);
  var i = t - this.xPos,
    n = e - this.yPos;
  this.xPos += i / 5;
  this.yPos += n / 5;
  if (Math.abs(i) < 1) {
    this.xPos = t;
  }
  if (Math.abs(n) < 1) {
    this.yPos = e;
  }
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
};

Key.prototype.runCollisions = function () {
  for (var t = 0, e = this.main.blocks; t < e.length; t++) {
    var i = e[t];
    if (i.alive) {
      if (SAT.testPolygonPolygon(i.topPolygon, this.hitBoxPolygon)) {
        if (this.player.xVelocity < 5) {
          this.yVelocity = this.player.xVelocity * this.player.xVelocity * -0.2;
        } else {
          this.yVelocity = -5;
        }
        this.yPos = i.topEdge - 20;
        this.hitBoxPolygon.pos.y = this.yPos;
      } else if (SAT.testPolygonPolygon(i.rightPolygon, this.hitBoxPolygon)) {
        this.xPos = i.rightEdge + 11;
      } else if (SAT.testPolygonPolygon(i.leftPolygon, this.hitBoxPolygon)) {
        this.xPos = i.leftEdge - 11;
      } else if (SAT.testPolygonPolygon(i.bottomPolygon, this.hitBoxPolygon)) {
        this.yVelocity *= -1;
        this.yPos = i.bottomEdge + 21;
      }
    }
  }
};

Key.prototype.collideWithHero = function () {
  this.player.collideWithKey(this);
};

Key.prototype.update = function () {
  if (this.alive !== false) {
    if (this.used !== true) {
      if (this.following === true) {
        this.followPlayer();
        this.runCollisions();
        if (this.player.currentPole) {
          this.updateLineToPlayer(this.player.xPos, this.player.yPos - 31);
        } else if (this.player.crouching) {
          this.updateLineToPlayer(this.player.xPos, this.player.yPos - 6);
        } else {
          this.updateLineToPlayer(this.player.xPos, this.player.yPos - 16);
        }
        this.updatePositions();
      } else if (SAT.testPolygonPolygon(this.player.bodyPolygon, this.hitBoxPolygon) === true) {
        this.following = true;
        this.lineGraphic.visible = true;
        this.collideWithHero();
      }
    } else if (this.sprite.scaleX > 0.1) {
      this.sprite.scaleX -= 0.1;
      this.sprite.scaleY = this.sprite.scaleX;
      this.rad -= Tools_1.Tools.toRad(5);
      this.sprite.rotation = this.rad;
    } else {
      this.alive = false;
      this.sprite.visible = false;
    }
  }
};

Key.prototype.updateLineToPlayer = function (t, e) {
  this.lineGraphic.x = this.xPos;
  this.lineGraphic.y = this.yPos;
  this.lineGraphic.displayWidth = Tools_1.Tools.distance(this.xPos, this.yPos, t, e);
  this.lineGraphic.rotation = Tools_1.Tools.angleOfPoints(this.xPos, this.yPos, t, e);
};

Key.prototype.reset = function () {
  if (this.used === false) {
    this.xPos = this.startX;
    this.yPos = this.startY;
    this.updatePositions();
    this.following = false;
    this.lineGraphic.visible = false;
  }
};

Key.prototype.resetLevel = function () {
  this.xPos = this.startX;
  this.yPos = this.startY;
  this.updatePositions();
  this.sprite.setScale(1, 1);
  this.used = false;
  this.alive = true;
  this.sprite.visible = true;
  this.lineGraphic.visible = false;
  this.following = false;
};

Key.prototype.updatePositions = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
};

Key.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  this.lineGraphic.destroy();
  this.lineGraphic = null;
  this.player = null;
  _super.prototype.destroy.call(this);
};

var _Key = Key;

function Key(t, e) {
  t = _super.call(this, t) || this;
  t.init(e, "key 10000", 16763904);
  t.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 20, 40).toPolygon();
  t.hitBoxPolygon.setOffset(new SAT.Vector(-10, -20));
  t.player = t.main.player;
  return t;
}

exports.Key = _Key;
