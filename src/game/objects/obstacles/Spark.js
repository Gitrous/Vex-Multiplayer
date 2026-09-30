// objects/obstacles/Spark.js — recovered from webpack module #169 of the original vex7.min.js
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

exports.Spark = undefined;

var Obstacle_1 = require("./Obstacle"),
  data_1 = require("../../data"),
  PlayerBase_1 = require("../../entities/PlayerBase");

_super = Obstacle_1.Obstacle;

__extends(Spark, _super);

Spark.prototype.spawn = function (t, e) {
  if (this.sparkBlock) {
    t = this.sparkBlock.leftEdge;
    e = this.sparkBlock.topEdge;
    this.direction = "right";
  }
  this.alive = true;
  this.sprite.visible = true;
  this.setXY(t, e);
};

Spark.prototype.hide = function () {
  this.sprite.visible = false;
  this.alive = false;
};

Spark.prototype.update = function () {
  if (this.alive !== false) {
    if (
      (this.sparkBlock &&
        (this.direction === "right"
          ? ((this.xPos += 2.5),
            this.xPos > this.sparkBlock.rightEdge &&
              ((this.xPos = this.sparkBlock.rightEdge), (this.direction = "down")))
          : this.direction === "down"
            ? ((this.yPos += 2.5),
              this.yPos > this.sparkBlock.bottomEdge &&
                ((this.yPos = this.sparkBlock.bottomEdge), (this.direction = "left")))
            : this.direction === "left"
              ? ((this.xPos -= 2.5),
                this.xPos < this.sparkBlock.leftEdge &&
                  ((this.xPos = this.sparkBlock.leftEdge), (this.direction = "up")))
              : this.direction === "up" &&
                ((this.yPos -= 2.5), this.yPos < this.sparkBlock.topEdge) &&
                ((this.yPos = this.sparkBlock.topEdge), (this.direction = "right"))),
      Math.random() < 0.2 &&
        this.main.particleManager.createColorParticle(
          this.xPos,
          this.yPos,
          10 * Math.random() - 5,
          5 * Math.random() - 2.5,
          16763904,
          4,
          false,
          false,
          10,
          true,
        ),
      this.updatePosition(),
      this.sparkBlock)
    )
      for (var t = 0, e = this.main.pools; t < e.length; t++) {
        var i = e[t];
        i.setElectric(SAT.testPolygonPolygon(this.deathBoxPolygon, i.totalPolygon));
      }
    this.main.checkPlayerDeathByPolygon(this.deathBoxPolygon, PlayerBase_1.DeathType.sparkElectric);
  }
};

Spark.prototype.setXY = function (t, e) {
  this.xPos = t;
  this.yPos = e;
  this.updatePosition();
};

Spark.prototype.updatePosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.deathBoxPolygon.pos.x = this.xPos;
  this.deathBoxPolygon.pos.y = this.yPos;
};

Spark.prototype.resetLevel = function () {
  var t, e;
  if (this.sparkBlock) {
    t = this.sparkBlock.leftEdge;
    e = this.sparkBlock.topEdge;
    this.direction = "right";
    this.xPos = t;
    this.yPos = e;
  }
  this.updatePosition();
};

Spark.prototype.destroy = function () {
  if (this.sprite !== null) {
    this.sprite.destroy();
    this.sprite = null;
    this.deathBoxPolygon = null;
  }
};

var _Spark = Spark;

function Spark(t, e, i) {
  var n = _super.call(this, t, e) || this;
  n.sparkBlock = i;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "spark 10000");
  e.add(n.sprite);
  n.sprite.visible = false;
  n.deathBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 16, 16).toPolygon();
  n.deathBoxPolygon.setOffset(new SAT.Vector(-8, -8));
  return n;
}

exports.Spark = _Spark;
