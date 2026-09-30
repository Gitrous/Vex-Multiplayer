// objects/tower/Gate.js — recovered from webpack module #246 of the original vex7.min.js
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

exports.Gate = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools"),
  system_1 = require("../../system");

_super = require("../blocks").Block;

__extends(Gate, _super);

Gate.prototype.spawn = function (t) {
  this.init(t.x, t.y + 40, system_1.BalanceData.towerCellSize + 10, 20);
  this.updateGraphicPosition();
  this.container.scale = system_1.BalanceData.towerCellSize / 100;
  this.opening = false;
  this.spriteLeft.rotation = this.spriteRight.rotation = 0;
};

Gate.prototype.open = function () {
  this.opening = true;
  this.alive = false;
};

Gate.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos - 40;
};

Gate.prototype.update = function () {
  if (this.opening === true) {
    this.spriteLeft.rotation += 0.1;
    if (this.spriteLeft.rotation >= Tools_1.Tools.PI05) {
      this.spriteLeft.rotation = Tools_1.Tools.PI05;
      this.opening = false;
    }
    this.spriteRight.rotation = -this.spriteLeft.rotation;
  }
};

Gate.prototype.reset = function () {
  _super.prototype.reset.call(this);
  this.alive = true;
  this.opening = false;
  this.spriteLeft.rotation = this.spriteRight.rotation = 0;
};

Gate.prototype.resetLevel = function () {
  this.reset();
};

Gate.prototype.destroy = function () {
  this.spriteLeft.destroy();
  this.spriteLeft = null;
  this.spriteRight.destroy();
  this.spriteRight = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _Gate = Gate;

function Gate(t, e) {
  var i = _super.call(this, t, e) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.spriteLeft = new Phaser.GameObjects.Image(t, -50, 40, data_1.Atlases.gameplay, "basicBlockColors 10000");
  i.spriteLeft.setOrigin(0, 0.5);
  i.spriteLeft.setDisplaySize(50, 20);
  i.container.add(i.spriteLeft);
  i.spriteRight = new Phaser.GameObjects.Image(t, 50, 40, data_1.Atlases.gameplay, "basicBlockColors 10000");
  i.spriteRight.setOrigin(1, 0.5);
  i.spriteRight.setDisplaySize(50, 20);
  i.container.add(i.spriteRight);
  i.scalable = i.hangable = false;
  i.type = "gate";
  return i;
}

exports.Gate = _Gate;
