// objects/obstacles/ShurikanDispenser.js — recovered from webpack module #166 of the original vex7.min.js
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

exports.ShurikanDispenser = undefined;

var obstacles_1 = require("."),
  data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  Tools_1 = require("../../utils/Tools"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = require("./Obstacle").Obstacle;

__extends(ShurikanDispenser, _super);

ShurikanDispenser.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.setScale(1, 1);
  this.sprite.visible = true;
  this.alive = true;
  this.charge = ShurikanDispenser.CHARGE_TIME;
  for (var e = 0; e < 4; e++) this.spikes[e].spawn({ x: this.xPos, y: this.yPos, rotation: 90 * e });
  this.hitBoxPoly.pos.x = this.xPos;
  this.hitBoxPoly.pos.y = this.yPos;
  this.rad = 0;
  this.sprite.rotation = 0;
  this.sprite.gotoAndStop(24);
};

ShurikanDispenser.prototype.levelStart = function () {
  this.platforms = [];
  for (
    var t = new SAT.Circle(new SAT.Vector(this.xPos, this.yPos), 250), e = 0, i = this.main.blocks;
    e < i.length;
    e++
  ) {
    var n = i[e];
    if (SAT.testCirclePolygon(t, n.totalPolygon)) {
      this.platforms.push(n);
    }
  }
  for (var s = 0; s < 4; s++) this.spikes[s].levelStart();
};

ShurikanDispenser.prototype.fireSpikes = function () {
  for (var t = 0; t < 4; t++) this.spikes[t].dispenserFire();
  this.sprite.playFrames(0, 24, 0, 0.5);
};

ShurikanDispenser.prototype.update = function () {
  this.sprite.update();
  var t = this.main.player;
  if (
    t.alive === true &&
    Tools_1.Tools.distance(this.xPos, this.yPos, t.xPos, t.yPos) <= 250 &&
    this.main.raycastToPlayerOneLine(this.platforms, this.xPos, this.yPos) === true &&
    this.charge >= ShurikanDispenser.CHARGE_TIME
  ) {
    this.fireSpikes();
    this.charge = 0;
    this.rad = 0;
  }
  if (this.charge < ShurikanDispenser.CHARGE_TIME) {
    this.charge += 1;
    this.rad += Math.PI / ShurikanDispenser.CHARGE_TIME;
  }
  this.sprite.rotation = this.rad;
  this.main.checkPlayerDeathByPolygon(this.hitBoxPoly, PlayerBase_1.DeathType.shurikan);
  for (var e = 0; e < 4; e++) this.spikes[e].update();
};

ShurikanDispenser.prototype.destroy = function () {
  for (var t = 0; t < 4; t++) this.spikes[t].destroy();
  this.spikes = null;
  this.sprite.destroy();
  this.sprite = null;
  this.platforms = null;
  this.hitBoxPoly = null;
  _super.prototype.destroy.call(this);
};

ShurikanDispenser.prototype.resetLevel = function () {
  for (var t = (this.charge = 0); t < 4; t++) this.spikes[t].resetLevel();
};

ShurikanDispenser.CHARGE_TIME = 70;

var _ShurikanDispenser = ShurikanDispenser;

function ShurikanDispenser(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "shurikanDispenser ", 24);
  e.add(i.sprite);
  i.sprite.visible = false;
  i.hitBoxPoly = new SAT.Box(new SAT.Vector(0, 0), 20, 20).toPolygon();
  i.hitBoxPoly.setOffset(new SAT.Vector(-10, -10));
  i.spikes = [];
  for (var n = 0; n < 4; n++) i.spikes[n] = new obstacles_1.FallingSpike(t, e, true);
  return i;
}

exports.ShurikanDispenser = _ShurikanDispenser;
