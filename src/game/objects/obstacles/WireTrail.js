// objects/obstacles/WireTrail.js — recovered from webpack module #178 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.WireTrail = undefined;

var obstacles_1 = require("."),
  BalanceData_1 = require("../../system/BalanceData");

function WireTrail(t) {
  this.sparkSpeed = BalanceData_1.BalanceData.config_WireSparkSpeed;
  this.wireWidth = 50;
  this.main = t;
  this.spark = new obstacles_1.Spark(t, t.layerTopObstacle, null);
  this.main.obstacles.push(this.spark);
  this.burning = false;
}

WireTrail.prototype.addWires = function (t) {
  this.wires = t;
  this.start();
};

WireTrail.prototype.start = function () {
  this.burning = true;
  this.currentInd = this.wires.length;
  this.nextWire();
};

WireTrail.prototype.nextWire = function () {
  if (this.currentInd === 0) {
    this.burning = false;
    if (this.main.vexTNT) {
      this.main.vexTNT.exploding = true;
    }
    this.spark.hide();
  } else {
    --this.currentInd;
    this.currentWire = this.wires[this.currentInd];
    this.spark.spawn(
      this.currentWire.xPos + Math.cos(this.currentWire.sprite.rotation) * this.wireWidth,
      this.currentWire.yPos + Math.sin(this.currentWire.sprite.rotation) * this.wireWidth,
    );
  }
};

WireTrail.prototype.updateSpark = function () {
  var t = this.currentWire.sprite.scaleX * this.wireWidth;
  this.spark.setXY(
    this.currentWire.xPos + Math.cos(this.currentWire.sprite.rotation) * t,
    this.currentWire.yPos + Math.sin(this.currentWire.sprite.rotation) * t,
  );
};

WireTrail.prototype.update = function () {
  if (this.burning !== false) {
    this.currentWire.sprite.scaleX -= this.sparkSpeed / 50;
    if (this.currentWire.sprite.scaleX <= 0) {
      this.currentWire.sprite.scaleX = 0;
      this.nextWire();
    }
    this.updateSpark();
    this.main.updateProgressTnt(this.getpercent());
  }
};

WireTrail.prototype.getpercent = function () {
  for (var t = 0, e = this.wires.length, i = 0, n = this.wires; i < n.length; i++) t += n[i].sprite.scaleX;
  return t / e;
};

WireTrail.prototype.destroy = function () {
  this.burning = false;
  this.main = null;
  this.wires = null;
  this.spark = null;
};

WireTrail.prototype.resetLevel = function () {
  for (var t = 0, e = this.wires; t < e.length; t++) e[t].resetLevel();
  this.start();
};

exports.WireTrail = WireTrail;
