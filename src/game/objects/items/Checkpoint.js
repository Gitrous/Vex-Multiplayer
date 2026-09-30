// objects/items/Checkpoint.js — recovered from webpack module #71 of the original vex7.min.js
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

exports.Checkpoint = undefined;

var Item_1 = require("./Item"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Item_1.Item;

__extends(Checkpoint, _super);

Checkpoint.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.startY = this.yPos;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.state = 0;
  this.floatRad = 0;
  this.alive = true;
};

Checkpoint.prototype.resetLevel = function () {
  this.setSpriteFrame(0);
  this.state = 0;
};

Checkpoint.prototype.setSpriteFrame = function (t) {
  if (this.floating === true) {
    this.sprite.setFrame("checkpointSwimming 1000" + t);
  } else {
    this.sprite.setFrame("checkpoint 1000" + t);
  }
};

Checkpoint.prototype.update = function () {
  this.updateState();
  if (this.floating === true) {
    this.floatRad = (this.floatRad + 0.02) % Tools_1.Tools.PI2;
    this.sprite.y = this.startY + (25 + 10 * Math.sin(this.floatRad));
    this.sprite.rotation = 0.5 * Math.cos(this.floatRad);
  }
};

Checkpoint.prototype.updateState = function () {
  if (this.state === 0 && SAT.testPolygonPolygon(this.main.player.bodyPolygon, this.hitBoxPolygon)) {
    this.main.checkpointTriggered(this);
    this.setSpriteFrame(1);
    this.state = 1;
  } else if (!(
    this.state !== 1 ||
    (this.xPos === this.main.player.checkpoint.x && this.yPos === this.main.player.checkpoint.y)
  )) {
    this.setSpriteFrame(2);
    this.state = 2;
  }
};

Checkpoint.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

var _Checkpoint = Checkpoint;

function Checkpoint(t, e, i) {
  var n = _super.call(this, t) || this;
  if ((n.floating = i) === true) {
    n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "checkpointSwimming 10000");
  } else {
    n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "checkpoint 10000");
    n.sprite.setOrigin(8 / 21.15, 17 / 55);
  }
  e.add(n.sprite);
  n.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 60, 80).toPolygon();
  n.hitBoxPolygon.setOffset(new SAT.Vector(-30, -40));
  n.type = "checkPoint";
  return n;
}

exports.Checkpoint = _Checkpoint;
