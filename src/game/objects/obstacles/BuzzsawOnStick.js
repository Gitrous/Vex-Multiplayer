// objects/obstacles/BuzzsawOnStick.js — recovered from webpack module #157 of the original vex7.min.js
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

exports.BuzzsawOnStick = undefined;

var Obstacle_1 = require("./Obstacle"),
  obstacles_1 = require("."),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Obstacle_1.Obstacle;

__extends(BuzzsawOnStick, _super);

BuzzsawOnStick.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startRotation = Tools_1.Tools.toRad(t.rotation);
  this.resetLevel();
  this.sprite.visible = true;
  this.alive = true;
  this.buzzsaw.spawn({
    x: this.xPos + 130 * Math.cos(this.startRotation),
    y: this.yPos + 130 * Math.sin(this.startRotation),
    size: 50,
  });
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

BuzzsawOnStick.prototype.update = function () {
  this.sprite.rotation += this.rotationSpeed;
  this.updatePosition();
};

BuzzsawOnStick.prototype.updatePosition = function () {
  this.buzzsaw.xPos = this.xPos + 130 * Math.cos(this.sprite.rotation);
  this.buzzsaw.yPos = this.yPos + 130 * Math.sin(this.sprite.rotation);
  this.buzzsaw.updatePosition();
};

BuzzsawOnStick.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.sprite.destroy();
  this.sprite = null;
  this.buzzsaw = null;
};

BuzzsawOnStick.prototype.resetLevel = function () {
  this.sprite.rotation = this.startRotation;
  this.updatePosition();
};

var _BuzzsawOnStick = BuzzsawOnStick;

function BuzzsawOnStick(t, e) {
  var i = _super.call(this, t, e) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "buzzsawOnStick 10000");
  e.add(i.sprite);
  i.sprite.setOrigin(0.1, 0.5);
  i.sprite.visible = false;
  i.buzzsaw = new obstacles_1.Buzzsaw(i.main, e);
  i.buzzsaw.checkUnderPool = false;
  i.main.obstacles.push(i.buzzsaw);
  i.rotationSpeed = Tools_1.Tools.toRad(4);
  return i;
}

exports.BuzzsawOnStick = _BuzzsawOnStick;
