// render/PLBlur.js — recovered from webpack module #95 of the original vex7.min.js
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

exports.PLBlur = undefined;

_super = Phaser.Renderer.WebGL.Pipelines.SinglePipeline;

__extends(o, _super);

o.prototype.onBind = function (t) {
  _super.prototype.onBind.call(this);
  t = t.pipelineData;
  this.set1f("blurX", t.blurX);
  this.set1f("blurY", t.blurY);
};

o.prototype.onBatch = function (t) {
  if (t) {
    this.flush();
  }
};

o.setBlur = function (t, e, i) {
  t.pipelineData.blurX = e * o.blurCoef;
  t.pipelineData.blurY = i * o.blurCoef;
};

o.blurCoef = 1 / 7e3;

var __extends = o;

function o(t) {
  return (
    _super.call(this, {
      game: t,
      fragShader:
        "precision mediump float;\n            varying vec2 outTexCoord;\n            varying vec4 vColor;\n            uniform float blurX;\n            uniform float blurY;\n            uniform sampler2D uSampler;\n\n            void main(void) {\n                vec4 sum = vec4(0.0);\n\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 4.0*blurX, outTexCoord.y - 4.0*blurY)) * 0.05;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 3.0*blurX, outTexCoord.y - 3.0*blurY)) * 0.09;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 2.0*blurX, outTexCoord.y - 2.0*blurY)) * 0.12;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - blurX, outTexCoord.y - blurY)) * 0.15;\n\n                sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.16;\n\n                sum += texture2D(uSampler, vec2(outTexCoord.x + blurX, outTexCoord.y + blurY)) * 0.15;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 2.0*blurX, outTexCoord.y + 2.0*blurY)) * 0.12;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 3.0*blurX, outTexCoord.y + 3.0*blurY)) * 0.09;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 4.0*blurX, outTexCoord.y + 4.0*blurY)) * 0.05;\n\n                gl_FragColor = sum;\n            }",
      uniforms: ["blurX", "blurY"],
    }) || this
  );
}

exports.PLBlur = __extends;
