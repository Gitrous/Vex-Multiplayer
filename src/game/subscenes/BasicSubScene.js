// subscenes/BasicSubScene.js — recovered from webpack module #33 of the original vex7.min.js
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

exports.BasicSubScene = undefined;

_super = Phaser.GameObjects.Container;

__extends(o, _super);

o.prototype.init = function (t) {};

o.prototype.resize = function () {};

o.prototype.update = function () {};

o.prototype.updateMoney = function (t) {};

o.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.scene = null;
};

var __extends = o;

function o() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.BasicSubScene = __extends;
