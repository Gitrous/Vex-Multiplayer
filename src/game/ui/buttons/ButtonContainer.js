// ui/buttons/ButtonContainer.js — recovered from webpack module #43 of the original vex7.min.js
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

exports.ButtonContainer = undefined;

var jd_1 = require("../../jd");

_super = require("./BaseButton").BaseButton;

__extends(ButtonContainer, _super);

ButtonContainer.prototype.add = function (t) {
  this.view.add(t);
};

ButtonContainer.prototype.addImageEvents = function (t, e, i, n, s, r) {
  if (i === undefined) {
    i = 0;
  }
  if (n === undefined) {
    n = 0;
  }
  if (s === undefined) {
    s = 1;
  }
  if (r === undefined) {
    r = 1;
  }
  this.image = new Phaser.GameObjects.Image(this.scene, i, n, t, e);
  this.image.setScale(s, r);
  this.add(this.image);
  this.initEvents(this.image);
};

ButtonContainer.prototype.addIcon = function (t, e, i, n, s, r) {
  if (i === undefined) {
    i = 0;
  }
  if (n === undefined) {
    n = 0;
  }
  if (s === undefined) {
    s = 1;
  }
  if (r === undefined) {
    r = 1;
  }
  this.icon = new Phaser.GameObjects.Image(this.scene, i, n, t, e);
  this.icon.setScale(s, r);
  this.add(this.icon);
};

ButtonContainer.prototype.addTxt = function (t, e, i, n, s, r, o) {
  this.txt = new jd_1.JDBmpdText(
    this.scene,
    (r = r === undefined ? 0 : r),
    (o = o === undefined ? 0 : o),
    e,
    t,
    i,
    (n = n === undefined ? 16777215 : n),
    (s = s === undefined ? 1 : s),
  );
  this.add(this.txt);
};

ButtonContainer.prototype.addTxtFit = function (t, e, i, n, s, r, o) {
  this.txtFit = new jd_1.JDBmpdTextFit(
    this.scene,
    (r = r === undefined ? 0 : r),
    (o = o === undefined ? 0 : o),
    e,
    t,
    i,
    (n = n === undefined ? 16777215 : n),
    (s = s === undefined ? 1 : s),
  );
  this.add(this.txtFit);
};

ButtonContainer.prototype.addTxtTranslated = function (t, e, i, n, s, r, o) {
  this.txtTranslated = new jd_1.JDBmpdTextTranslated(
    this.scene,
    (r = r === undefined ? 0 : r),
    (o = o === undefined ? 0 : o),
    e,
    t,
    i,
    (n = n === undefined ? 16777215 : n),
    (s = s === undefined ? 1 : s),
  );
  this.add(this.txtTranslated);
};

ButtonContainer.prototype.destroyInternal = function () {
  _super.prototype.destroyInternal.call(this);
  this.image = null;
  this.icon = null;
  this.txt = null;
  this.txtFit = null;
  this.txtTranslated = null;
};

var _ButtonContainer = ButtonContainer;

function ButtonContainer(t, e, i) {
  var n = _super.call(this, t) || this;
  n.createView(new Phaser.GameObjects.Container(t, e, i));
  return n;
}

exports.ButtonContainer = _ButtonContainer;
