// jd/JDMaskParent.js — recovered from webpack module #102 of the original vex7.min.js
"use strict";

function JDMaskParent(t, e, i, n) {
  if (i === undefined) {
    i = 0;
  }
  if (n === undefined) {
    n = 0;
  }
  this.x = 0;
  this.y = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.rotation = 0;
  this.graphics = new Phaser.GameObjects.Graphics(t);
  this.graphics.parentContainer = e;
  if (!JDMaskParent.tempMatrix) {
    JDMaskParent.tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
    JDMaskParent.parentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  }
  this.x = i;
  this.y = n;
}

Object.defineProperty(exports, "__esModule", { value: true });

exports.JDMaskParent = undefined;

JDMaskParent.prototype.addUpdateTransformEvents = function () {
  this.graphics.scene.events.on(Phaser.Scenes.Events.PRE_RENDER, this.updateParentTransform, this);
};

JDMaskParent.prototype.setXY = function (t, e) {
  this.x = t;
  this.y = e;
};

JDMaskParent.prototype.updateParentTransform = function () {
  this.graphics.parentContainer.getWorldTransformMatrix(JDMaskParent.tempMatrix, JDMaskParent.parentMatrix);
  this.graphics.x = JDMaskParent.tempMatrix.getX(this.x, this.y);
  this.graphics.y = JDMaskParent.tempMatrix.getY(this.x, this.y);
  this.graphics.scaleX = JDMaskParent.tempMatrix.scaleX * this.scaleX;
  this.graphics.scaleY = JDMaskParent.tempMatrix.scaleY * this.scaleY;
  this.graphics.rotation = JDMaskParent.tempMatrix.rotation + this.rotation;
};

JDMaskParent.prototype.updateParentScale = function () {
  this.graphics.parentContainer.getWorldTransformMatrix(JDMaskParent.tempMatrix, JDMaskParent.parentMatrix);
  this.graphics.scaleX = JDMaskParent.tempMatrix.scaleX * this.scaleX;
  this.graphics.scaleY = JDMaskParent.tempMatrix.scaleY * this.scaleY;
};

JDMaskParent.prototype.destroy = function () {
  this.graphics.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.updateParentTransform, this);
  this.graphics.destroy();
  this.graphics = null;
};

exports.JDMaskParent = JDMaskParent;
