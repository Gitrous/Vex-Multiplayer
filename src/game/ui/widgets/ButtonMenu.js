// ui/widgets/ButtonMenu.js — recovered from webpack module #116 of the original vex7.min.js
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

exports.ButtonMenu = undefined;

var data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  jd_1 = require("../../jd");

_super = Phaser.GameObjects.Container;

__extends(ButtonMenu, _super);

ButtonMenu.prototype.addTxtDop = function (t, e, i, n, s, r, o) {
  this.txtDop = new jd_1.JDBmpdTextTranslated(
    this.scene,
    (r = r === undefined ? 0 : r),
    (o = o === undefined ? 0 : o),
    e,
    t,
    i,
    (n = n === undefined ? 16777215 : n),
    (s = s === undefined ? 1 : s),
  );
  this.add(this.txtDop);
};

ButtonMenu.prototype.addTxtReset = function (t, e, i, n, s, r, o) {
  this.txtReset = new jd_1.JDBmpdTextFit(
    this.scene,
    (r = r === undefined ? 0 : r),
    (o = o === undefined ? 0 : o),
    e,
    t,
    i,
    (n = n === undefined ? 16777215 : n),
    (s = s === undefined ? 1 : s),
  );
  this.add(this.txtReset);
};

ButtonMenu.prototype.destroy = function (t) {
  _super.prototype.destroy.call(this, t);
  this.btn = null;
  this.txtDop = null;
  this.txtReset = null;
};

var _ButtonMenu = ButtonMenu;

function ButtonMenu(t, e, i, n) {
  e = _super.call(this, t, e, i) || this;
  e.btn = new buttons_1.ButtonScale(t, 0, 0);
  e.btn.addImageEvents(data_1.Atlases.ui, n);
  e.add(e.btn.getView());
  return e;
}

exports.ButtonMenu = _ButtonMenu;
