// objects/blocks/SkinsBlock.js — recovered from webpack module #200 of the original vex7.min.js
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

exports.SkinsBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  jd_1 = require("../../jd");

_super = Block_1.Block;

__extends(SkinsBlock, _super);

SkinsBlock.prototype.toggleTickBox = function () {};

SkinsBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, 120, 10);
  this.sprite.visible = true;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos - 5;
  this.txt.x = this.xPos;
  this.txt.y = this.sprite.y + 7;
};

SkinsBlock.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.txt.destroy();
  this.txt = null;
  _super.prototype.destroy.call(this);
};

var _SkinsBlock = SkinsBlock;

function SkinsBlock(t, e, i) {
  if (i === undefined) {
    i = 0;
  }
  e = _super.call(this, t, e) || this;
  e.id = i;
  e.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "charactersBlock 10000");
  e.sprite.setOrigin(0.5, 1);
  e.layer.add(e.sprite);
  e.txt = new jd_1.JDBmpdTextTranslated(t, 0, 0, data_1.Fonts.Main, "actSkin", 28);
  e.txt.setOrigin(0.5, 0);
  e.layer.add(e.txt);
  e.type = "skins";
  e.hangable = false;
  e.scalable = false;
  return e;
}

exports.SkinsBlock = _SkinsBlock;
