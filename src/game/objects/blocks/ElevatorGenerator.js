// objects/blocks/ElevatorGenerator.js — recovered from webpack module #184 of the original vex7.min.js
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

exports.ElevatorGenerator = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Block_1.Block;

__extends(ElevatorGenerator, _super);

ElevatorGenerator.prototype.addSpikes = function (t, e) {
  this.spikes = t;
  this.isSpikeUp = e;
};

ElevatorGenerator.prototype.levelStart = function () {
  this.cable.x = this.xPos;
  this.cable.visible = true;
  for (var t = 0, e = this.main.elevatorEliminator; t < e.length; t++) {
    var i = e[t];
    if (i.xPos + i.width / 2 >= this.xPos && i.xPos - i.width / 2 <= this.xPos) {
      if (i.yPos > this.yPos) {
        this.cable.y = this.yPos;
        this.cable.setCrop(0, 0, 6, i.yPos - this.yPos);
        return void (this.eliminatorY = i.yPos);
      }
      if (i.yPos < this.yPos) {
        this.cable.y = i.yPos;
        this.cable.setCrop(0, 0, 6, this.yPos - i.yPos);
        return void (this.eliminatorY = i.yPos);
      }
    }
  }
  this.cable.visible = false;
};

ElevatorGenerator.prototype.spawn = function (t) {
  this.init(t.x, t.y, 150, 60);
  this.updatePosition();
  this.sprite.setFrame(BalanceData_1.BalanceData.getBasicBlockFrame(this.main.currLevelID));
  this.sprite.setScale(this.width / this.sprite.width, this.height / this.sprite.height);
  if ((this.sprite.visible = true) === this.isSpikeUp) {
    this.spikes.spawn({ x: this.xPos, y: this.yPos - 35, rotation: 0 });
  } else {
    this.spikes.spawn({ x: this.xPos, y: this.yPos + 35, rotation: 180 });
  }
};

ElevatorGenerator.prototype.update = function () {
  --this.timeNextPlatform;
  if (this.timeNextPlatform <= 0) {
    this.main.startElevator(this.xPos, this.yPos, this.eliminatorY);
    this.timeNextPlatform = this.delayNextPlatform;
  }
};

ElevatorGenerator.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

ElevatorGenerator.prototype.destroy = function () {
  this.cable.destroy();
  this.cable = null;
  this.sprite.destroy();
  this.sprite = null;
  this.spikes = null;
  this.hitBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

var _ElevatorGenerator = ElevatorGenerator;

function ElevatorGenerator(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(i.sprite);
  i.timeNextPlatform = BalanceData_1.BalanceData.config_ElevatorTimeNew;
  i.delayNextPlatform = BalanceData_1.BalanceData.config_ElevatorTimeNew;
  i.cable = new Phaser.GameObjects.Image(i.main, 0, 0, data_1.Atlases.gameplay, "cable 10000");
  i.cable.setOrigin(0.5, 0);
  i.main.layerUnderPool.add(i.cable);
  return i;
}

exports.ElevatorGenerator = _ElevatorGenerator;
