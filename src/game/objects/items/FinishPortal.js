// objects/items/FinishPortal.js — recovered from webpack module #226 of the original vex7.min.js
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

exports.FinishPortal = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  render_1 = require("../../render"),
  PipelineManager_1 = require("../../render/PipelineManager"),
  system_1 = require("../../system");

_super = require("./Item").Item;

__extends(FinishPortal, _super);

FinishPortal.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.particleTimer = 0;
  this.alive = true;
};

FinishPortal.prototype.update = function () {
  this.sprite.update();
  this.particleTimer += 1;
  if (this.particleTimer > this.particleSpawnRate) {
    this.main.particleManager.createColorParticle(
      this.xPos - 80 + 160 * Math.random(),
      this.yPos - 80 + 160 * Math.random(),
      0,
      0,
      4649252,
      4,
      false,
    );
    this.particleTimer = 0;
  }
  this.main.particleManager.magnetTo(this.xPos, this.yPos, 250, 50);
  this.main.player.checkCollideWithFinish(this);
};

FinishPortal.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.hitBoxPolygon = null;
  _super.prototype.destroy.call(this);
};

var _FinishPortal = FinishPortal;

function FinishPortal(t, e) {
  var i = _super.call(this, t) || this;
  i.particleSpawnRate = 3;
  i.sprite = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "finish ");
  i.sprite.scale = 1.18;
  i.sprite.playFrames(0, 59, -1, 0.3);
  e.add(i.sprite);
  if (system_1.BalanceData.blend === true) {
    i.sprite.setPipeline(render_1.PipelineManager.getPipeline(PipelineManager_1.PipelineList.Blur));
    render_1.PLBlur.setBlur(i.sprite, 4, 4);
  }
  i.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 60, 60).toPolygon();
  i.hitBoxPolygon.setOffset(new SAT.Vector(-30, -30));
  return i;
}

exports.FinishPortal = _FinishPortal;
