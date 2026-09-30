// subscenes/SubSkinsRarity.js — recovered from webpack module #209 of the original vex7.min.js
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

exports.SubSkinsRarity = undefined;

var BasicSubSkins_1 = require("./BasicSubSkins"),
  data_1 = require("../data"),
  skins_1 = require("../skins");

_super = BasicSubSkins_1.BasicSubSkins;

__extends(SubSkinsRarity, _super);

SubSkinsRarity.prototype.init = function () {
  _super.prototype.init.call(this);
  this.raritys = new Array(5);
  var t = data_1.Constants.GHH + 20;
  this.raritys[0] = new skins_1.SkinRarity(this, 0, data_1.Constants.GHW - 760, t, "btn_yellow 10000", 16777215);
  this.raritys[1] = new skins_1.SkinRarity(this, 1, data_1.Constants.GHW - 380, t, "btn_yellow 10000", 65280);
  this.raritys[2] = new skins_1.SkinRarity(this, 2, data_1.Constants.GHW, t, "btn_yellow 10000", 7996071);
  this.raritys[3] = new skins_1.SkinRarity(this, 3, data_1.Constants.GHW + 380, t, "btn_yellow 10000", 16707329);
  this.raritys[4] = new skins_1.SkinRarity(this, 4, data_1.Constants.GHW + 760, t, "btn_yellow 10000", 16711680);
  this.moveSpineContainerTop();
};

SubSkinsRarity.prototype.destroy = function () {
  for (var t = 0; t < this.raritys.length; t++) this.raritys[t].destroy();
  this.raritys = null;
  _super.prototype.destroy.call(this);
};

var _SubSkinsRarity = SubSkinsRarity;

function SubSkinsRarity() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubSkinsRarity = _SubSkinsRarity;
