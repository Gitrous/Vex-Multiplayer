// jd/input/InputDom.js — recovered from webpack module #104 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.InputDom = undefined;

var InputField_1 = require("./InputField"),
  JDTextInput_1 = require("../JDTextInput");

function InputDom(t) {
  var e = this;
  this.srcMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  this.camMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  this.calcMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  this.domInput = document.createElement("input");
  t.domContainer.appendChild(this.domInput);
  var t = this.domInput.style;
  t.position = "absolute";
  t.background = "none";
  t.border = "none";
  t.outline = "none";
  t.display = "none";
  t.pointerEvents = "auto";
  this.domInput.addEventListener("keydown", function (t) {
    return e.onKeyDown(t);
  });
}

InputDom.prototype.onKeyDown = function (t) {
  if (!(t.key !== "Enter" && t.key !== "Escape")) {
    InputField_1.InputField.endFocus();
  }
  if (InputField_1.InputField.blockInput === true && t.stopPropagation) {
    t.stopPropagation();
  }
  if (!(
    this.isNumber !== true ||
    t.key === "Backspace" ||
    t.key === "Delete" ||
    isNaN(Number(this.domInput.value + t.key)) !== true
  )) {
    if (t.key !== "ArrowLeft" && t.key !== "ArrowRight" && t.key !== "-") {
      t.preventDefault();
    }
  }
};

InputDom.prototype.focus = function (t, e) {
  var i = this.domInput.style;
  i.fontSize = t.fontSize + "px";
  i.fontFamily = t.fontFamily;
  i.color = t.inputTextColor;
  i.textAlign = t.textAlign;
  this.domWidth = t.bgWidth - 2 * t.textBorderOffX;
  this.domHeight = t.bgHeight - 2 * t.textBorderOffY;
  i.width = this.domWidth + "px";
  i.height = this.domHeight + "px";
  i.display = "block";
  if (t.type === JDTextInput_1.JDTextInputType.number) {
    this.domInput.type = JDTextInput_1.JDTextInputType.text;
    this.isNumber = true;
  } else {
    this.domInput.type = t.type;
    this.isNumber = false;
  }
  this.domInput.value = e;
  this.domInput.focus();
};

InputDom.prototype.blur = function () {
  this.domInput.style.display = "none";
  this.domInput.blur();
  this.domInput.value = "";
};

InputDom.prototype.getValue = function () {
  return this.domInput.value;
};

InputDom.prototype.render = function (t, e, i) {
  var n = t.parentContainer,
    s = e.alpha * t.alpha;
  if (n) {
    s *= n.alpha;
  }
  var n = t.inputText,
    r = this.domInput.style,
    o = e.scrollX * t.scrollFactorX,
    a = e.scrollY * t.scrollFactorY;
  this.camMatrix.copyFrom(e.matrix);
  var e = this.domWidth * n.originX,
    h = this.domHeight * n.originY,
    e = t.x - e + (n.x - 1) * t.scaleX,
    h = t.y - h + n.y * t.scaleY;
  this.srcMatrix.applyITRS(e, h, t.rotation, t.scaleX, t.scaleY);
  if (i) {
    this.camMatrix.multiplyWithOffset(i, -o, -a);
    r.transformOrigin = "0% 0%";
  } else {
    this.camMatrix.translate(-o, -a);
    r.transformOrigin = 100 * n.originX + "% " + 100 * n.originY + "%";
  }
  this.camMatrix.multiply(this.srcMatrix, this.calcMatrix);
  r.opacity = "" + s;
  r.transform = this.calcMatrix.getCSSMatrix();
};

exports.InputDom = InputDom;
