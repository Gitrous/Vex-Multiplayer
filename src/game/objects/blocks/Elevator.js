// objects/blocks/Elevator.js — recovered from webpack module #182 of the original vex7.min.js
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

exports.Elevator = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  system_1 = require("../../system");

_super = Block_1.Block;

__extends(Elevator, _super);

Elevator.prototype.spawn = function (t, e, i) {
  this.init(t, e, 100, 50);
  this.activate(t, e, i);
};

Elevator.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

Elevator.prototype.update = function () {
  if (
    this.alive !== false &&
    ((this.yPos += this.yVelocity),
    this.updatePosition(),
    (this.yVelocity < 0 && this.yPos < this.eliminatorY) || (this.yVelocity > 0 && this.yPos > this.eliminatorY))
  ) {
    this.sprite.visible = false;
    this.alive = false;
  }
};

Elevator.prototype.activate = function (t, e, i) {
  if (e < i) {
    if (this.isMovingDown !== true) {
      this.yVelocity = system_1.BalanceData.config_ElevatorSpeed;
      this.sprite.setFrame("elevatorDown 10000");
    }
    this.isMovingDown = true;
  } else {
    if (this.isMovingDown !== false) {
      this.yVelocity = -system_1.BalanceData.config_ElevatorSpeed;
      this.sprite.setFrame("elevatorUp 10000");
    }
    this.isMovingDown = false;
  }
  this.eliminatorY = i;
  this.sprite.x = this.xPos = t;
  this.sprite.y = this.yPos = e;
  this.sprite.visible = true;
  this.alive = true;
};

Elevator.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

Elevator.prototype.reset = function () {};

var _Elevator = Elevator;

function Elevator(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(i.sprite);
  i.sprite.visible = false;
  return i;
}

exports.Elevator = _Elevator;
