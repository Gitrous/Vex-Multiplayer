// objects/items/GrapplePad.js — recovered from webpack module #231 of the original vex7.min.js
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

exports.GrapplePad = undefined;

var data_1 = require("../../data"),
  Tools_1 = require("../../utils/Tools");

_super = require("./Item").Item;

__extends(GrapplePad, _super);

GrapplePad.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.currID = t.currID;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.sprite.rotation = Tools_1.Tools.toRad(t.rotation);
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.hitBoxPolygon.setAngle(this.sprite.rotation);
  this.onContact = false;
  this.alive = true;
};

GrapplePad.prototype.levelStart = function () {
  this.grapplePoint = this.main.getGrapplePoint(this.currID);
};

GrapplePad.prototype.update = function () {
  if (this.grapplePoint) {
    if (this.onContact === false) {
      if (SAT.testPolygonPolygon(this.hitBoxPolygon, this.main.player.totalPolygon) === true) {
        this.onContact = true;
        this.main.player.showGrappleTarget(true, this.grapplePoint);
      }
    } else if (this.onContact === true) {
      if (SAT.testPolygonPolygon(this.hitBoxPolygon, this.main.player.totalPolygon) === false) {
        this.onContact = false;
        this.main.player.showGrappleTarget(false, this.grapplePoint);
      } else if (this.main.player.grapplePoint !== this.grapplePoint) {
        this.main.player.showGrappleTarget(true, this.grapplePoint);
      }
    }
  }
};

GrapplePad.prototype.reset = function () {};

GrapplePad.prototype.resetLevel = function () {
  this.reset();
  this.alive = true;
};

GrapplePad.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  this.grapplePoint = null;
  _super.prototype.destroy.call(this);
};

var _GrapplePad = GrapplePad;

function GrapplePad(t, e) {
  var i = _super.call(this, t) || this;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "grapplePlatform 10000");
  e.add(i.sprite);
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 80, 40).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-40, -30));
  return i;
}

exports.GrapplePad = _GrapplePad;
