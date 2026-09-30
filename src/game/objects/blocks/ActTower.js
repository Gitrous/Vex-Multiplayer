// objects/blocks/ActTower.js — recovered from webpack module #204 of the original vex7.min.js
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

exports.ActTower = undefined;

var Block_1 = require("./Block"),
  data_1 = require("../../data");

_super = Block_1.Block;

__extends(ActTower, _super);

ActTower.prototype.spawn = function (t) {
  this.init(t.x, t.y, 140, 140);
  this.updateGraphicPosition();
  this.container.visible = true;
};

ActTower.prototype.updateGraphicPosition = function () {
  this.container.x = this.xPos;
  this.container.y = this.yPos;
};

ActTower.prototype.destroy = function () {
  this.sprite = null;
  this.container.destroy();
  this.container = null;
  _super.prototype.destroy.call(this);
};

var _ActTower = ActTower;

function ActTower(t, e) {
  var i = _super.call(this, t, e) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.sprite = new Phaser.GameObjects.Image(t, 0, 1, data_1.Atlases.gameplay, "actBlockTower 10000");
  i.sprite.scale = 1.01;
  i.container.add(i.sprite);
  i.type = "dailyStage";
  return i;
}

exports.ActTower = _ActTower;
