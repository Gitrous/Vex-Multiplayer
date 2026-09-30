// objects/items/CheckpointHome.js — recovered from webpack module #233 of the original vex7.min.js
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

exports.CheckpointHome = undefined;

_super = require("./Checkpoint").Checkpoint;

__extends(CheckpointHome, _super);

CheckpointHome.prototype.updateState = function () {
  if (this.state === 0 && SAT.testPolygonPolygon(this.main.player.bodyPolygon, this.hitBoxPolygon)) {
    this.main.checkpointTriggered(this);
    this.setSpriteFrame(1);
    this.state = 1;
  } else if (!(
    this.state !== 1 ||
    (this.xPos === this.main.player.checkpoint.x && this.yPos === this.main.player.checkpoint.y)
  )) {
    this.setSpriteFrame(0);
    this.state = 0;
  }
};

var _CheckpointHome = CheckpointHome;

function CheckpointHome() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.CheckpointHome = _CheckpointHome;
