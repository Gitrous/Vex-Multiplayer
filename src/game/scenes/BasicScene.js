// scenes/BasicScene.js — recovered from webpack module #35 of the original vex7.min.js
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

exports.BasicScene = undefined;

_super = Phaser.Scene;

__extends(o, _super);

o.prototype.init = function () {
  this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
};

o.prototype.create = function () {
  this.initResize();
};

o.prototype.initResize = function () {
  this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
  this.resize();
};

o.prototype.resize = function () {};

o.prototype.destroy = function () {
  this.scale.off(Phaser.Scale.Events.RESIZE, this.resize, this);
};

var __extends = o;

function o() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BasicScene = __extends;
