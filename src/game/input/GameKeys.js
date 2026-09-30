// input/GameKeys.js — recovered from webpack module #41 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.GameKeys = exports.KeyPressed = undefined;

var KeyPressed,
  data_1 = require("../data"),
  widgets_1 = require("../ui/widgets"),
  World_1 = require("../scenes/World");

(_tmp = KeyPressed = exports.KeyPressed || (exports.KeyPressed = {})).left = "l";

_tmp.right = "r";

_tmp.up = "u";

_tmp.down = "d";

_tmp.punch = "punch";

GameKeys.prototype.isKeyPressed = function (t) {
  return this.isPressed[t];
};

GameKeys.prototype.setPressed = function (t, e) {
  if (this.isPressed[t] !== e) {
    this.isPressed[t] = e;
    this.scene.player.keyPressed(t, e);
  }
};

GameKeys.prototype.onKeyDown = function (t) {
  if (this.disable !== true) {
    if ((t = t.keyCode) === Phaser.Input.Keyboard.KeyCodes.A || t === Phaser.Input.Keyboard.KeyCodes.LEFT) {
      this.setPressed(KeyPressed.left, true);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.D || t === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
      this.setPressed(KeyPressed.right, true);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.W || t === Phaser.Input.Keyboard.KeyCodes.UP) {
      this.setPressed(KeyPressed.up, true);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.S || t === Phaser.Input.Keyboard.KeyCodes.DOWN) {
      this.setPressed(KeyPressed.down, true);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.SPACE) {
      this.setPressed(KeyPressed.punch, true);
    }
  }
};

GameKeys.prototype.onKeyUp = function (t) {
  if (this.disable !== true) {
    if ((t = t.keyCode) === Phaser.Input.Keyboard.KeyCodes.A || t === Phaser.Input.Keyboard.KeyCodes.LEFT) {
      this.setPressed(KeyPressed.left, false);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.D || t === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
      this.setPressed(KeyPressed.right, false);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.W || t === Phaser.Input.Keyboard.KeyCodes.UP) {
      this.setPressed(KeyPressed.up, false);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.S || t === Phaser.Input.Keyboard.KeyCodes.DOWN) {
      this.setPressed(KeyPressed.down, false);
    } else if (t === Phaser.Input.Keyboard.KeyCodes.SPACE && this.scene.isTower() === true) {
      this.setPressed(KeyPressed.punch, false);
    }
  }
};

GameKeys.prototype.show = function () {
  if (data_1.Constants.IS_MOBILE === true) {
    if (this.scene.state === World_1.GameStates.MainMenu) {
      this.checkMenu();
    } else {
      this.showButtons();
    }
  }
};

GameKeys.prototype.showButtons = function () {
  this.circleMovement.show();
  this.buttonJump.show();
  this.buttonCrouch.show();
  if (this.scene.isTower() === true) {
    this.buttonAttack.show();
  }
};

GameKeys.prototype.hide = function () {
  if (data_1.Constants.IS_MOBILE === true) {
    this.hideButtons();
  }
};

GameKeys.prototype.hideButtons = function () {
  this.circleMovement.hide();
  this.buttonJump.hide();
  this.buttonCrouch.hide();
  this.buttonAttack.hide();
};

GameKeys.prototype.isScreenButtonDown = function () {
  return (
    data_1.Constants.IS_MOBILE === true &&
    (this.circleMovement.isDown === true ||
      this.buttonJump.isDown === true ||
      this.buttonCrouch.isDown === true ||
      this.buttonAttack.isDown === true)
  );
};

GameKeys.prototype.setAlpha = function (t) {
  if (data_1.Constants.IS_MOBILE === true) {
    this.circleMovement.sprite.alpha = t;
    this.buttonJump.sprite.alpha = t;
    this.buttonCrouch.sprite.alpha = t;
    this.buttonAttack.sprite.alpha = t;
  }
};

GameKeys.prototype.resetKeys = function () {
  this.setPressed(KeyPressed.left, false);
  this.setPressed(KeyPressed.right, false);
  this.setPressed(KeyPressed.up, false);
  this.setPressed(KeyPressed.down, false);
  this.setPressed(KeyPressed.punch, false);
};

GameKeys.prototype.resize = function () {
  var t;
  if (
    data_1.Constants.IS_MOBILE === true &&
    ((this.circleMovement.sprite.x = 270 - data_1.Constants.UI_SHIFT_X),
    (this.circleMovement.sprite.y = 440 + data_1.Constants.UI_SHIFT_Y),
    (t = data_1.Constants.GW + data_1.Constants.UI_SHIFT_X),
    (this.buttonCrouch.sprite.x = t - 520),
    (this.buttonCrouch.sprite.y = this.circleMovement.sprite.y + 70),
    (this.buttonJump.sprite.x = t - 200),
    (this.buttonJump.sprite.y = this.buttonCrouch.sprite.y - 100),
    (this.buttonAttack.sprite.x = this.buttonJump.sprite.x),
    (this.buttonAttack.sprite.y = this.buttonJump.sprite.y - 320),
    this.scene.state === World_1.GameStates.MainMenu)
  ) {
    this.checkMenu();
  }
};

GameKeys.prototype.checkMenu = function () {
  if (this.buttonCrouch.sprite.x > 1560) {
    this.showButtons();
  } else {
    this.hideButtons();
  }
};

var _tmp = GameKeys;

function GameKeys(t, e) {
  this.scene = t;
  this.disable = false;
  this.isPressed = {};
  this.isPressed[KeyPressed.left] = false;
  this.isPressed[KeyPressed.right] = false;
  this.isPressed[KeyPressed.down] = false;
  this.isPressed[KeyPressed.up] = false;
  if (!(this.isPressed[KeyPressed.punch] = false) === data_1.Constants.IS_MOBILE) {
    this.circleMovement = new widgets_1.ControllerStick(this);
    e.add(this.circleMovement.sprite);
    this.buttonJump = new widgets_1.ControllerButton(this, "jumpButton 10000", KeyPressed.up);
    e.add(this.buttonJump.sprite);
    this.buttonCrouch = new widgets_1.ControllerButton(this, "crouchButton 10000", KeyPressed.down);
    e.add(this.buttonCrouch.sprite);
    this.buttonAttack = new widgets_1.ControllerButton(this, "attackButton 10000", KeyPressed.punch);
    e.add(this.buttonAttack.sprite);
  }
  t.input.keyboard.on("keydown", this.onKeyDown, this);
  t.input.keyboard.on("keyup", this.onKeyUp, this);
}

exports.GameKeys = _tmp;
