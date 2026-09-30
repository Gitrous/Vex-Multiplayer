// ui/panels/PanelActSelect.js — recovered from webpack module #128 of the original vex7.min.js
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

exports.PanelActSelect = undefined;

var BasicPanel_1 = require("./BasicPanel"),
  data_1 = require("../../data"),
  buttons_1 = require("../buttons"),
  Achievements_1 = require("../../system/Achievements"),
  BalanceData_1 = require("../../system/BalanceData");

_super = BasicPanel_1.BasicPanel;

__extends(PanelActSelect, _super);

PanelActSelect.prototype.init = function () {
  this.addBgTitleBtn(640, 400, "actSelect", true, "close_act_select");
  for (var t = -230, e = -30, i = 1; i < BalanceData_1.BalanceData.totalActs; i++) {
    this.addBtn(t, e, i, data_1.Atlases.ui, "trophieAct " + (1e4 + i));
    t += 115;
    if (i % 5 == 0) {
      t = -230;
      e += 140;
    }
  }
  this.addBtn(t, e, Number(BalanceData_1.BalanceData.vexID), data_1.Atlases.ui, "actVex 10000");
};

PanelActSelect.prototype.addBtn = function (t, e, i, n, s) {
  var r = this,
    t = new buttons_1.ButtonScale(this.scene, t, e);
  t.addImageEvents(n, s);
  t.onUp = function () {
    return r.scene.portToActBlock(i);
  };
  this.add(t.getView());
  if (Achievements_1.Achievements.isCompletedAct(i, false) === false) {
    t.alpha = 0.5;
    t.getInteractiveElement().input.enabled = false;
  }
};

var _PanelActSelect = PanelActSelect;

function PanelActSelect() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.PanelActSelect = _PanelActSelect;
