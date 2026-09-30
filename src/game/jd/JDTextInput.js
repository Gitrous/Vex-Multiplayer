// jd/JDTextInput.js — recovered from webpack module #38 of the original vex7.min.js
"use strict";

var n,
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

exports.JDTextInput = exports.JDTextInputType = exports.JDTextInputBg = undefined;

var JDTextInputBg,
  JDTextInputType,
  _super,
  InputBox_1 = require("./input/InputBox"),
  data_1 = require("../data"),
  InputField_1 = require("./input/InputField"),
  JDText_1 = require("./JDText");

(_tmp = JDTextInputBg = exports.JDTextInputBg || (exports.JDTextInputBg = {}))[(_tmp.none = 0)] = "none";

_tmp[(_tmp.both = 1)] = "both";

_tmp[(_tmp.bg = 2)] = "bg";

_tmp[(_tmp.border = 3)] = "border";

(_tmp = JDTextInputType = exports.JDTextInputType || (exports.JDTextInputType = {})).text = "text";

_tmp.password = "password";

_tmp.number = "number";

_super = Phaser.GameObjects.Container;

__extends(JDTextInput, _super);

JDTextInput.prototype.renderWebGL = function (t, e, i, n) {
  _super.prototype.renderWebGL.call(this, t, e, i, n);
  if (this.inputText.visible === false) {
    InputField_1.InputField.render(i, n);
  }
};

JDTextInput.prototype.renderCanvas = function (t, e, i, n) {
  _super.prototype.renderCanvas.call(this, t, e, i, n);
  if (this.inputText.visible === false) {
    InputField_1.InputField.render(i, n);
  }
};

JDTextInput.prototype.inputDown = function () {
  this.inputText.visible = false;
  InputField_1.InputField.onTxtIn(this);
  this.emit(JDTextInput.EVENT_FOCUS_IN, this);
};

JDTextInput.prototype.inputUp = function (t, e) {
  if (this.inputText.visible === false && this.inputBox !== e[0]) {
    InputField_1.InputField.onFocusOut();
  }
};

JDTextInput.prototype.onFocusOut = function (t) {
  this.inputText.visible = true;
  this.updateText(t);
  this.emit(JDTextInput.EVENT_FOCUS_OUT, this);
};

JDTextInput.prototype.updateText = function (t) {
  this.realText = t = t || "";
  var e = this.options.bgWidth - 2 * this.options.textBorderOffX;
  if (this.options.type === JDTextInputType.password) {
    this.inputText.text = this.checkPlaceHolder("");
    for (var i = 0; i < this.realText.length && ((this.inputText.text += "•"), !(this.inputText.width > e)); i++);
  } else
    for (t = this.checkPlaceHolder(t), this.inputText.text = t; this.inputText.width > e;)
      this.inputText.text = this.inputText.text.slice(0, -1);
};

JDTextInput.prototype.checkPlaceHolder = function (t) {
  if (this.realText.length === 0 && this.options.placeHolder) {
    t = this.options.placeHolder;
    if (this.options.placeHolderColor) {
      this.inputText.setColor(this.options.placeHolderColor);
    }
  } else if (this.inputText.style.color !== this.options.fontColor) {
    this.inputText.setColor(this.options.fontColor);
  }
  return t;
};

Object.defineProperty(JDTextInput.prototype, "text", {
  get: function () {
    return this.realText;
  },
  set: function (t) {
    this.updateText(t);
  },
  enumerable: false,
  configurable: true,
});

JDTextInput.prototype.getInput = function () {
  return this.inputBox.input;
};

JDTextInput.prototype.destroy = function () {
  this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.inputUp, this);
  _super.prototype.destroy.call(this);
  this.options = null;
  this.inputBox = null;
  this.inputText = null;
};

JDTextInput.EVENT_FOCUS_IN = "EVENT_FOCUS_IN";

JDTextInput.EVENT_FOCUS_OUT = "EVENT_FOCUS_OUT";

var _tmp = JDTextInput;

function JDTextInput(t, e, i, n) {
  if (n === undefined) {
    n = {};
  }
  e = _super.call(this, t, e, i) || this;
  e.options = n;
  e.options.text = n.text === undefined ? "" : n.text;
  e.options.fontFamily = n.fontFamily === undefined ? data_1.Fonts.Main : n.fontFamily;
  e.options.fontSize = n.fontSize === undefined ? 30 : n.fontSize;
  e.options.fontColor = n.fontColor === undefined ? "#000000" : n.fontColor;
  e.options.textAlign = n.textAlign === undefined ? JDText_1.JDTextAlign.left : n.textAlign;
  e.options.textAlignVertical = n.textAlignVertical === undefined ? 0.5 : n.textAlignVertical;
  e.options.textBorderOffX = n.textBorderOffX === undefined ? 0 : n.textBorderOffX;
  e.options.textBorderOffY = n.textBorderOffY === undefined ? 0 : n.textBorderOffY;
  e.options.type = n.type || JDTextInputType.text;
  e.options.inputTextColor = n.inputTextColor === undefined ? e.options.fontColor : n.inputTextColor;
  e.realText = e.options.text;
  e.inputText = new Phaser.GameObjects.Text(t, 0, e.options.textBorderOffY, "", {
    fontFamily: e.options.fontFamily,
    fontSize: e.options.fontSize + "px",
    color: e.options.fontColor,
    align: e.options.textAlign,
  });
  if (e.options.textAlign === JDText_1.JDTextAlign.left) {
    e.inputText.setOrigin(0, e.options.textAlignVertical);
    e.inputText.x = e.options.textBorderOffX;
  } else if (e.options.textAlign === JDText_1.JDTextAlign.center) {
    e.inputText.setOrigin(0.5, e.options.textAlignVertical);
  } else if (e.options.textAlign === JDText_1.JDTextAlign.right) {
    e.inputText.setOrigin(1, e.options.textAlignVertical);
    e.inputText.x = -e.options.textBorderOffX;
  }
  e.options.bgShow = n.bgShow === undefined ? JDTextInputBg.both : n.bgShow;
  e.options.bgWidth = n.bgWidth === undefined ? e.inputText.width : n.bgWidth;
  e.options.bgHeight = n.bgHeight === undefined ? e.inputText.height : n.bgHeight;
  e.options.bgRadius = n.bgRadius === undefined ? 0 : n.bgRadius;
  e.options.bgColor = n.bgColor === undefined ? 16777215 : n.bgColor;
  e.options.bgBorderThickness = n.bgBorderThickness === undefined ? 2 : n.bgBorderThickness;
  e.options.bgBorderColor = n.bgBorderColor === undefined ? 0 : n.bgBorderColor;
  e.inputBox = new InputBox_1.InputBox(t, e.options, e.inputText.originX, e.inputText.originY);
  e.add(e.inputBox);
  e.add(e.inputText);
  e.inputBox.on(Phaser.Input.Events.POINTER_DOWN, e.inputDown, e);
  e.scene.input.on(Phaser.Input.Events.POINTER_DOWN, e.inputUp, e);
  e.updateText(e.realText);
  return e;
}

exports.JDTextInput = _tmp;
