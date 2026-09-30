// ui/widgets/ControllerButton.js — recovered from webpack module #114 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.ControllerButton = undefined;

var data_1 = require("../../data");

function ControllerButton(t, e, i) {
  this.currPointerID = -1;
  this.isDown = false;
  this.keys = t;
  this.key = i;
  this.sprite = new Phaser.GameObjects.Image(t.scene, 0, 0, data_1.Atlases.ui, e);
  this.sprite.alpha = 0.8;
  this.sprite.scale = 1.6;
  i = this.sprite.width / 2;
  e = 1.1 * i;
  this.sprite.setInteractive(new Phaser.Geom.Circle(e, e, 1.3 * i), Phaser.Geom.Circle.Contains);
  this.sprite.on(Phaser.Input.Events.POINTER_DOWN, this.inputDown, this);
  t.scene.input.on(Phaser.Input.Events.POINTER_UP, this.inputUp, this);
}

ControllerButton.prototype.inputDown = function (t) {
  this.currPointerID = t.id;
  this.isDown = true;
  this.keys.setPressed(this.key, true);
};

ControllerButton.prototype.inputUp = function (t) {
  if (this.isDown !== false && this.currPointerID === t.id) {
    this.currPointerID = -1;
    this.isDown = false;
    this.keys.setPressed(this.key, false);
  }
};

ControllerButton.prototype.hide = function () {
  this.sprite.visible = false;
};

ControllerButton.prototype.show = function () {
  this.sprite.visible = true;
};

exports.ControllerButton = ControllerButton;
