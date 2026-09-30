// jd/JDImagePivot.js — recovered from webpack module #55 of the original vex7.min.js
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

exports.JDImagePivot = undefined;

var PipelineManager_1 = require("../render/PipelineManager");

_super = require("./JDImage").JDImage;

__extends(JDImagePivot, _super);

JDImagePivot.prototype.setPivot = function (t, e) {
  this.pivotX = t;
  this.pivotY = e;
};

var _JDImagePivot = JDImagePivot;

function JDImagePivot(t, e, i, n, s) {
  t = _super.call(this, t, e, i, n, s) || this;
  t.pivotX = 0;
  t.pivotY = 0;
  t.setPipeline(PipelineManager_1.PipelineManager.getPipeline(PipelineManager_1.PipelineList.PivotSkew));
  return t;
}

exports.JDImagePivot = _JDImagePivot;
