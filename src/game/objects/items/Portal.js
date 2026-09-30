// objects/items/Portal.js — recovered from webpack module #225 of the original vex7.min.js
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

exports.Portal = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd"),
  render_1 = require("../../render"),
  PipelineManager_1 = require("../../render/PipelineManager"),
  BalanceData_1 = require("../../system/BalanceData");

_super = require("./Item").Item;

__extends(Portal, _super);

Portal.prototype.attachPortal = function (t) {
  this.portalAttached = t;
};

Portal.prototype.disablePortal = function () {
  this.isEnable = false;
  this.sprite.gotoAndPlay(14, 27, 14 + this.sprite.currFrame, -1, 0.5);
  this.cooldown = BalanceData_1.BalanceData.config_PortalTimeCooldown;
  render_1.PLColorMatrix.blackAndWhite(this.sprite, true);
};

Portal.prototype.update = function () {
  if (this.isEnable === true) {
    if (this.portalAttached && SAT.testPolygonPolygon(this.main.player.totalPolygon, this.hitBoxPolygon) === true) {
      this.portalAttached.disablePortal();
      this.disablePortal();
      this.main.player.setPosition(this.portalAttached.xPos, this.portalAttached.yPos + 20);
    }
  } else {
    --this.cooldown;
    if (this.cooldown <= 0) {
      this.isEnable = true;
      this.sprite.gotoAndPlay(0, 13, this.sprite.currFrame - 14, -1, 0.5);
      render_1.PLColorMatrix.hue(this.sprite, this.color);
    }
  }
  this.sprite.update();
};

Portal.prototype.spawn = function (t) {
  this.xPos = t.x;
  this.yPos = t.y;
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
  this.hitBoxPolygon.pos.x = this.xPos;
  this.hitBoxPolygon.pos.y = this.yPos;
  this.alive = true;
};

Portal.prototype.destroy = function () {
  this.sprite.destroy();
  this.sprite = null;
  this.portalAttached = null;
  _super.prototype.destroy.call(this);
};

var _Portal = Portal;

function Portal(t, e, i) {
  var n = _super.call(this, t) || this;
  n.color = i;
  n.sprite = new jd_1.JDImageAnim(t, 0, 0, data_1.Atlases.gameplay, "portal_blueAnim ");
  n.sprite.scale = 1.12;
  e.add(n.sprite);
  n.sprite.playFrames(0, 13, -1, 0.5);
  if (BalanceData_1.BalanceData.blend === true) {
    n.sprite.setPipeline(render_1.PipelineManager.getPipeline(PipelineManager_1.PipelineList.MIXBlurColorMatrix));
    render_1.PLColorMatrix.hue(n.sprite, n.color);
    render_1.PLBlur.setBlur(n.sprite, 2, 2);
  }
  n.isEnable = true;
  n.cooldown = 0;
  n.hitBoxPolygon = new SAT.Box(new SAT.Vector(0, 0), 10, 32).toPolygon();
  n.hitBoxPolygon.setOffset(new SAT.Vector(-5, -16));
  return n;
}

exports.Portal = _Portal;
