// render/PLMIXBlurColorMatrix.js — recovered from webpack module #97 of the original vex7.min.js
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

exports.PLMIXBlurColorMatrix = undefined;

var render_1 = require(".");

_super = Phaser.Renderer.WebGL.Pipelines.SinglePipeline;

__extends(PLMIXBlurColorMatrix, _super);

PLMIXBlurColorMatrix.prototype.onBoot = function () {
  this.set1fv("m", render_1.PLColorMatrix.getDefaultColorMatrix());
};

PLMIXBlurColorMatrix.prototype.onBind = function (t) {
  _super.prototype.onBind.call(this);
  t = t.pipelineData;
  if (t.blurX) {
    this.set1f("blurX", t.blurX);
  }
  if (t.blurY) {
    this.set1f("blurY", t.blurY);
  }
  if (t.colorMatrix) {
    this.set1fv("m", t.colorMatrix);
  }
};

PLMIXBlurColorMatrix.prototype.onBatch = function (t) {
  if (t) {
    this.flush();
  }
};

var _PLMIXBlurColorMatrix = PLMIXBlurColorMatrix;

function PLMIXBlurColorMatrix(t) {
  return (
    _super.call(this, {
      game: t,
      vertShader:
        "\n        precision mediump float;\n        uniform mat4 uProjectionMatrix;\n\n        attribute vec2 inPosition;\n        attribute vec2 inTexCoord;\n        attribute vec4 inTint;\n\n        varying vec2 outTexCoord;\n        varying vec4 outTint;\n\n        void main () {\n            gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);\n\n            outTexCoord = inTexCoord;\n            outTint = inTint;\n        }\n        ",
      fragShader:
        "precision mediump float;\n            varying vec2 outTexCoord;\n            varying vec4 vColor;\n            uniform float blurX;\n            uniform float blurY;\n            uniform sampler2D uSampler;\n\n            uniform float m[20];\n            varying vec4 outTint;\n\n            void main(void) {\n                //blur\n                vec4 sum = vec4(0.0);\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 4.0*blurX, outTexCoord.y - 4.0*blurY)) * 0.05;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 3.0*blurX, outTexCoord.y - 3.0*blurY)) * 0.09;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - 2.0*blurX, outTexCoord.y - 2.0*blurY)) * 0.12;\n                sum += texture2D(uSampler, vec2(outTexCoord.x - blurX, outTexCoord.y - blurY)) * 0.15;\n\n                sum += texture2D(uSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.16;\n\n                sum += texture2D(uSampler, vec2(outTexCoord.x + blurX, outTexCoord.y + blurY)) * 0.15;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 2.0*blurX, outTexCoord.y + 2.0*blurY)) * 0.12;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 3.0*blurX, outTexCoord.y + 3.0*blurY)) * 0.09;\n                sum += texture2D(uSampler, vec2(outTexCoord.x + 4.0*blurX, outTexCoord.y + 4.0*blurY)) * 0.05;\n\n                //color matrix\n                vec4 c = sum * vec4(outTint.rgb * outTint.a, outTint.a);\n\n                gl_FragColor.r = (m[0] * c.r);\n                    gl_FragColor.r += (m[1] * c.g);\n                    gl_FragColor.r += (m[2] * c.b);\n                    gl_FragColor.r += (m[3] * c.a);\n                    gl_FragColor.r += m[4];\n                gl_FragColor.g = (m[5] * c.r);\n                    gl_FragColor.g += (m[6] * c.g);\n                    gl_FragColor.g += (m[7] * c.b);\n                    gl_FragColor.g += (m[8] * c.a);\n                    gl_FragColor.g += m[9];\n                gl_FragColor.b = (m[10] * c.r);\n                    gl_FragColor.b += (m[11] * c.g);\n                    gl_FragColor.b += (m[12] * c.b);\n                    gl_FragColor.b += (m[13] * c.a);\n                    gl_FragColor.b += m[14];\n                gl_FragColor.a = (m[15] * c.r);\n                    gl_FragColor.a += (m[16] * c.g);\n                    gl_FragColor.a += (m[17] * c.b);\n                    gl_FragColor.a += (m[18] * c.a);\n                    gl_FragColor.a += m[19];\n            }",
      uniforms: ["blurX", "blurY", "m"],
    }) || this
  );
}

exports.PLMIXBlurColorMatrix = _PLMIXBlurColorMatrix;
