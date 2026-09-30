// objects/items/BreatheBlaster.js — recovered from webpack module #217 of the original vex7.min.js
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

exports.BreatheBlaster = undefined;

var Item_1 = require("./Item"),
  data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = Item_1.Item;

__extends(BreatheBlaster, _super);

BreatheBlaster.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.sprite.visible = true;
  this.alive = true;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.hitBoxPolygon.setAngle(this.sprite.rotation);
};

BreatheBlaster.prototype.update = function () {
  var t, e;
  if (SAT.testPolygonPolygon(this.main.player.totalPolygon, this.hitBoxPolygon) === true) {
    this.main.player.collideWithBreatheBlaster();
  }
  if (Math.random() < 0.15) {
    t = 4 * Math.random();
    e = this.sprite.rotation + Tools_1.Tools.toRad(4 * Math.random() - 2);
    this.main.particleManager.createColorParticle(
      this.xPos,
      this.yPos,
      Math.cos(e) * t,
      Math.sin(e) * t,
      3394815,
      4,
      true,
      true,
      100,
    );
  }
};

BreatheBlaster.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

var _BreatheBlaster = BreatheBlaster;

function BreatheBlaster(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "breatheBlaster 10000");
  i.sprite.setOrigin(1, 0.5);
  e.add(i.sprite);
  i.sprite.visible = false;
  i.sprite.setScale(1, 0.5);
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 100, 50).toPolygon();
  i.type = "breatheBlaster";
  return i;
}

exports.BreatheBlaster = _BreatheBlaster;
