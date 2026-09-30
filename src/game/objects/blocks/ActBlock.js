// objects/blocks/ActBlock.js — recovered from webpack module #152 of the original vex7.min.js
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

exports.ActBlock = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  BalanceData_1 = require("../../system/BalanceData"),
  Helpers_1 = require("../../utils/Helpers");

_super = Block_1.Block;

__extends(ActBlock, _super);

ActBlock.prototype.spawn = function (t) {
  this.init(t.x, t.y, 140, 140);
  this.updateGraphicPosition();
  if ((this.container.visible = true) === this.level.isTargetLevelComplete(false)) {
    BalanceData_1.BalanceData.actFinishTime = -1;
  }
};

ActBlock.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

ActBlock.prototype.update = function () {
  if (this.landed) {
    this.txtMyTime.visible = true;
  } else {
    this.txtMyTime.visible = false;
  }
};

ActBlock.prototype.destroy = function () {
  this.sprite = null;
  this.title = null;
  this.titleNum = null;
  this.txtMyTime = null;
  this.container.destroy();
  this.container = null;
  this.level = null;
  _super.prototype.destroy.call(this);
};

var _ActBlock = ActBlock;

function ActBlock(t, e, i, n) {
  var s = _super.call(this, t, e) || this;
  s.hardEnabled = false;
  s.level = s.main.getLevel("" + i);
  s.levelNum = i;
  s.isHard = n;
  var r = s.levelNum - 1;
  if (r < 0) {
    r = 0;
  }
  var o = n === true ? "actBlockHard " : "actBlock ";
  s.container = new Phaser.GameObjects.Container(t);
  e.add(s.container);
  s.container.name = "container" + i;
  s.sprite = new Phaser.GameObjects.Image(t, 0, 1, data_1.Atlases.gameplay, o + (1e4 + r));
  s.sprite.scale = 1.01;
  s.container.add(s.sprite);
  s.title = new jd_1.JDBmpdTextTranslated(t, 0, -48, data_1.Fonts.Main, "actNorm", 22);
  s.container.add(s.title);
  s.titleNum = new jd_1.JDBmpdText(t, 0, -5, data_1.Fonts.Main, "" + i, 50);
  s.container.add(s.titleNum);
  if (i === BalanceData_1.BalanceData.totalActs) {
    s.titleNum.visible = false;
    s.title.text = "actVex";
  }
  if (s.level.isTargetLevelComplete(n) === true) {
    a = new Phaser.GameObjects.Image(t, -39, 46, data_1.Atlases.gameplay, "actStar 10000");
    s.container.add(a);
  }
  if (s.level.isTargetCoinsComplete(n) === 1) {
    a = new Phaser.GameObjects.Image(t, -1, 46, data_1.Atlases.gameplay, "actStar 10000");
    s.container.add(a);
  }
  if (s.level.isTargetDeathComplete(n) === 1) {
    a = new Phaser.GameObjects.Image(t, 38, 46, data_1.Atlases.gameplay, "actStar 10000");
    s.container.add(a);
  }
  var a = null,
    e = s.level.getTopTime(n);
  s.txtMyTime = new jd_1.JDBmpdTextTranslated(t, 0, 100, data_1.Fonts.Main, "", 26);
  s.txtMyTime.setText("bestTime", "\n" + Helpers_1.Helpers.timeDecoratorActBlock(e > -1 ? e : 0));
  s.container.add(s.txtMyTime);
  if ((s.txtMyTime.visible = false) === s.isHard) {
    s.hardEnabled = true;
  } else {
    s.hardEnabled = s.level.act3Star();
  }
  s.type = "act";
  return s;
}

exports.ActBlock = _ActBlock;
