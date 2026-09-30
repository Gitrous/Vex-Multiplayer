// jd/input/InputField.js — recovered from webpack module #57 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.InputField = undefined;

var InputDom_1 = require("./InputDom");

function InputField() {}

InputField.init = function (t) {
  this.game = t;
  this.dom = new InputDom_1.InputDom(t);
};

InputField.onFocusOut = function () {
  if (this.txt) {
    this.endFocus();
  }
};

InputField.onTxtIn = function (t) {
  if (
    this.txt !== t &&
    (this.onTxtOut(),
    (this.txt = t),
    this.dom.focus(this.txt.options, this.txt.text),
    this.game.device.os.desktop === false)
  ) {
    InputField.KeyboardOpen = true;
    this.game.events.emit(InputField.EVENT_KEYBOARD_OPEN);
  }
};

InputField.onTxtOut = function () {
  if (this.txt) {
    this.txt.onFocusOut(this.dom.getValue());
  }
  this.txt = null;
};

InputField.endFocus = function () {
  if (this.game.device.os.desktop === false) {
    InputField.KeyboardOpen = false;
    this.game.events.emit(InputField.EVENT_KEYBOARD_CLOSED);
  }
  this.onTxtOut();
  this.dom.blur();
};

InputField.render = function (t, e) {
  this.dom.render(this.txt, t, e);
};

InputField.EVENT_KEYBOARD_OPEN = "EVENT_KEYBOARD_OPEN";

InputField.EVENT_KEYBOARD_CLOSED = "EVENT_KEYBOARD_CLOSED";

InputField.KeyboardOpen = false;

InputField.blockInput = true;

exports.InputField = InputField;
