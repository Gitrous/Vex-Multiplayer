// objects/items/WindBlaster.js — recovered from webpack module #221 of the original vex7.min.js
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

exports.WindBlaster = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  Tools_1 = require("../../utils/Tools"),
  blocks_1 = require("../blocks");

_super = require("./Item").Item;

__extends(WindBlaster, _super);

WindBlaster.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.container.x = this.xPos;
  this.container.y = this.yPos;
  this.fanPolygon.pos.x = this.xPos;
  this.fanPolygon.pos.y = this.yPos;
  this.fanPolygon.setAngle(-Tools_1.Tools.PI05);
  this.alive = true;
  this.inc = 0;
  this.sin = Math.sin(this.fanPolygon.angle);
  for (var e = 0, i = this.windGraphics; e < i.length; e++) {
    var n = i[e];
    n.x = 46 * Math.random() - 23;
    n.y = -130 * Math.random();
    n.visible = true;
  }
};

WindBlaster.prototype.update = function () {
  this.fanSprite.update();
  var t,
    e,
    i = this.main.player;
  if (i.alive === true) {
    if (SAT.testPolygonPolygon(this.fanPolygon, i.totalPolygon)) {
      t = 0;
      if ((e = 0.15 * this.sin) < -0.12) {
        this.inc = Math.max(2, this.inc);
      }
      t += 0.13 * this.sin * this.inc;
      if (e < -0.12 && i.yPos > this.yPos - 5) {
        t = -2;
        i.yPos = this.yPos - 5;
        i.falling = true;
        i.updatePositions();
      }
      if (this.inc < 2.5) {
        this.inc += 0.25;
      } else {
        this.inc = 2.5;
      }
      i.applyForce(0, t);
    } else {
      this.inc -= 0.25;
      if (this.inc < 0) {
        this.inc = 0;
      }
    }
    for (var n = 0, s = this.main.blocks; n < s.length; n++) {
      var r = s[n];
      if (r instanceof blocks_1.BlockBehavior && SAT.testPolygonPolygon(this.fanPolygon, r.totalPolygon) === true) {
        r.applyForce(0, -0.2);
      }
    }
  }
  for (var o = 0, a = this.windGraphics; o < a.length; o++) {
    var h = a[o];
    h.y -= 3;
    h.alpha -= 0.03;
    if (h.y < -130) {
      h.y = 0;
      h.x = 46 * Math.random() - 23;
      h.alpha = 1;
    }
  }
};

WindBlaster.prototype.die = function () {
  this.alive = false;
  this.container.visible = false;
};

WindBlaster.prototype.destroy = function () {
  this.container.destroy();
  this.container = null;
  this.fanSprite.destroy();
  this.fanSprite = null;
  for (var t = 0, e = this.windGraphics; t < e.length; t++) e[t].destroy();
  _super.prototype.destroy.call(this);
};

var _WindBlaster = WindBlaster;

function WindBlaster(t, e) {
  var i = _super.call(this, t) || this;
  i.container = new Phaser.GameObjects.Container(t);
  e.add(i.container);
  i.windGraphics = [];
  for (var n = 0; n < 6; n++) {
    var s = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "windWind 10000");
    i.container.add(s);
    s.visible = false;
    i.windGraphics.push(s);
  }
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "windBlaster 10000");
  i.container.add(i.sprite);
  i.fanSprite = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "windFan ");
  i.fanSprite.playFrames(0, 5, -1, 0.5);
  i.container.add(i.fanSprite);
  i.fanPolygon = new SAT.Box(new SAT.Vector(0, 0), 180, 50).toPolygon();
  i.fanPolygon.setOffset(new SAT.Vector(0, -25));
  return i;
}

exports.WindBlaster = _WindBlaster;
