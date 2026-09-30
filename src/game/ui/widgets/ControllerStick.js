// ui/widgets/ControllerStick.js — recovered from webpack module #115 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.ControllerStick = undefined;

var data_1 = require("../../data"),
  GameKeys_1 = require("../../input/GameKeys");

function ControllerStick(t) {
  this.currPointerID = -1;
  this.isDown = false;
  this.keys = t;
  this.sprite = new Phaser.GameObjects.Image(t.scene, 0, 0, data_1.Atlases.ui, "btnStick 10000");
  this.sprite.alpha = 0.8;
  this.sprite.scale = 2.4;
  this.sprite.setInteractive();
  var e = 1.2 * this.sprite.width,
    i = 1.35 * this.sprite.height,
    n = (this.sprite.width - e) / 2,
    s = (this.sprite.height - i) / 2;
  this.sprite.input.hitArea.setTo(n, s, e, i);
  this.sprite.on(Phaser.Input.Events.POINTER_DOWN, this.inputDown, this);
  t.scene.input.on(Phaser.Input.Events.POINTER_UP, this.inputUp, this);
  t.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.inputMove, this);
}

ControllerStick.prototype.inputDown = function (t) {
  this.currPointerID = t.id;
  this.pointer = t;
  this.isDown = true;
  this.inputMove();
};

ControllerStick.prototype.inputUp = function (t) {
  if (this.isDown !== false && this.currPointerID === t.id) {
    this.currPointerID = -1;
    this.isDown = false;
    this.setSpriteFrame("btnStick 10000");
    this.keys.setPressed(GameKeys_1.KeyPressed.left, false);
    this.keys.setPressed(GameKeys_1.KeyPressed.right, false);
  }
};

ControllerStick.prototype.hide = function () {
  this.sprite.visible = false;
};

ControllerStick.prototype.show = function () {
  this.sprite.visible = true;
};

ControllerStick.prototype.setSpriteFrame = function (t) {
  if (this.sprite.frame.name !== t) {
    this.sprite.setFrame(t);
  }
};

ControllerStick.prototype.inputMove = function () {
  var t;
  if (this.isDown === true) {
    t = (this.sprite.x + data_1.Constants.UI_SHIFT_X) * data_1.Constants.UI_SCALE;
    if (this.pointer.x < t) {
      this.setSpriteFrame("btnStick 10001");
      this.keys.setPressed(GameKeys_1.KeyPressed.left, true);
      this.keys.setPressed(GameKeys_1.KeyPressed.right, false);
    } else {
      this.setSpriteFrame("btnStick 10002");
      this.keys.setPressed(GameKeys_1.KeyPressed.left, false);
      this.keys.setPressed(GameKeys_1.KeyPressed.right, true);
    }
  }
};

exports.ControllerStick = ControllerStick;
