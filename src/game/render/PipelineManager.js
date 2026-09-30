// render/PipelineManager.js — recovered from webpack module #26 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.PipelineManager = exports.PipelineList = undefined;

var PipelineList,
  render_1 = require(".");

(_tmp = PipelineList = exports.PipelineList || (exports.PipelineList = {})).PivotSkew = "PivotSkew";

_tmp.Blur = "Blur";

_tmp.ColorMatrix = "ColorMatrix";

_tmp.MIXBlurColorMatrix = "MIXBlurColorMatrix";

PipelineManager.init = function (t) {
  this.game = t;
  this.pipelines = {};
};

PipelineManager.getPipeline = function (t, e) {
  var e = t + (e = e === undefined ? "" : e),
    i = this.pipelines[e];
  if (!i) {
    if (t === PipelineList.PivotSkew) {
      i = new render_1.PLPivotSkew(this.game);
    } else if (t === PipelineList.Blur) {
      i = new render_1.PLBlur(this.game);
    } else if (t === PipelineList.ColorMatrix) {
      i = new render_1.PLColorMatrix(this.game);
    } else if (t === PipelineList.MIXBlurColorMatrix) {
      i = new render_1.PLMIXBlurColorMatrix(this.game);
    }
    this.game.renderer.pipelines.add(e, i);
    this.pipelines[e] = i;
  }
  return t;
};

var _tmp = PipelineManager;

function PipelineManager() {}

exports.PipelineManager = _tmp;
