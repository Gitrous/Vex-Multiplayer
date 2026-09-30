// skins/SkinRarityEquip.js — recovered from webpack module #212 of the original vex7.min.js
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

exports.SkinRarityEquip = undefined;

var data_1 = require("../data"),
  buttons_1 = require("../ui/buttons"),
  BalanceData_1 = require("../system/BalanceData");

_super = require("./BasicSkinRarity").BasicSkinRarity;

__extends(SkinRarityEquip, _super);

SkinRarityEquip.prototype.select = function (t) {
  this.setActivityBtn(true, 1);
  this.setImgSkin(t);
};

SkinRarityEquip.prototype.setActivityBtn = function (t, e) {
  this.imgSkin.visible = t;
  this.btnEquip.image.input.enabled = t;
  this.btnEquip.alpha = e;
};

SkinRarityEquip.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.btnEquip = null;
};

var _SkinRarityEquip = SkinRarityEquip;

function SkinRarityEquip(t, e, i, n, s, r) {
  var o = _super.call(this, t, 0) || this;
  o.create(i, n, n, 600, BalanceData_1.BalanceData.currSkin, "preview", r);
  o.imgSkin.x -= 5;
  o.imgSkin.play("run", true);
  o.btnEquip = new buttons_1.ButtonScale(o.subscene.scene, i, n + 225);
  o.btnEquip.addImageEvents(data_1.Atlases.ui, "btn_green 10000", 0, 3);
  o.btnEquip.addTxtTranslated("equip", data_1.Fonts.Main, 34, 4737096);
  o.btnEquip.txtTranslated.setFitSize(200);
  o.btnEquip.onUp = function () {
    return t.equip();
  };
  o.subscene.add(o.btnEquip.getView());
  if (e === -1) {
    o.setActivityBtn(false, 0.5);
  }
  return o;
}

exports.SkinRarityEquip = _SkinRarityEquip;
