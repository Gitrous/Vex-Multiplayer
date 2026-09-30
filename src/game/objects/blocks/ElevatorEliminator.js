// objects/blocks/ElevatorEliminator.js — recovered from webpack module #183 of the original vex7.min.js
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

exports.ElevatorEliminator = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData");

_super = Block_1.Block;

__extends(ElevatorEliminator, _super);

ElevatorEliminator.prototype.destroySelf = function () {
  this.main.removeBlockFrom(this.main.elevatorEliminator, this);
  _super.prototype.destroySelf.call(this);
};

ElevatorEliminator.prototype.addSpikes = function (t, e) {
  this.spikes = t;
  this.isSpikeUp = e;
};

ElevatorEliminator.prototype.spawn = function (t) {
  this.init(t.x, t.y, 150, 60);
  this.updatePosition();
  this.sprite.setFrame(BalanceData_1.BalanceData.getBasicBlockFrame(this.main.currLevelID));
  this.sprite.setScale(this.width / this.sprite.width, this.height / this.sprite.height);
  if ((this.sprite.visible = true) === this.isSpikeUp) {
    this.spikes.spawn({ x: this.xPos, y: this.yPos - 34.5, rotation: 0 });
  } else {
    this.spikes.spawn({ x: this.xPos, y: this.yPos + 34.5, rotation: 180 });
  }
};

ElevatorEliminator.prototype.destroy = function () {
  this.spikes = null;
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

ElevatorEliminator.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

var _ElevatorEliminator = ElevatorEliminator;

function ElevatorEliminator(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(i.sprite);
  return i;
}

exports.ElevatorEliminator = _ElevatorEliminator;
