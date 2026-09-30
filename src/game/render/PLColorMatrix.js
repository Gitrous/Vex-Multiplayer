// render/PLColorMatrix.js — recovered from webpack module #96 of the original vex7.min.js
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

exports.PLColorMatrix = undefined;

_super = Phaser.Renderer.WebGL.Pipelines.SinglePipeline;

__extends(o, _super);

o.prototype.onBoot = function () {
  this.set1fv("m", o.getDefaultColorMatrix());
};

o.prototype.onBind = function (t) {
  _super.prototype.onBind.call(this);
  t = t.pipelineData;
  if (t && t.colorMatrix) {
    this.set1fv("m", t.colorMatrix);
  }
};

o.prototype.onBatch = function (t) {
  if (t) {
    this.flush();
  }
};

o.brightness = function (t, e, i) {
  this._loadMatrix(t, [e, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, 1, 0], i);
};

o.greyscale = function (t, e, i) {
  this._loadMatrix(t, [e, e, e, 0, 0, e, e, e, 0, 0, e, e, e, 0, 0, 0, 0, 0, 1, 0], i);
};

o.blackAndWhite = function (t, e) {
  this._loadMatrix(t, [0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1, 0], e);
};

o.hue = function (t, e, i) {
  e = ((e || 0) / 180) * Math.PI;
  var n = Math.cos(e),
    e = Math.sin(e);
  this._loadMatrix(
    t,
    [
      0.213 + 0.787 * n + -0.213 * e,
      0.715 + -0.715 * n + -0.715 * e,
      0.072 + -0.072 * n + 0.928 * e,
      0,
      0,
      0.213 + -0.213 * n + 0.143 * e,
      0.715 + n * (1 - 0.715) + 0.14 * e,
      0.072 + -0.072 * n + -0.283 * e,
      0,
      0,
      0.213 + -0.213 * n + -0.787 * e,
      0.715 + -0.715 * n + 0.715 * e,
      0.072 + 0.928 * n + 0.072 * e,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ],
    i,
  );
};

o.contrast = function (t, e, i) {
  var e = (e || 0) + 1,
    n = -128 * (e - 1);
  this._loadMatrix(t, [e, 0, 0, 0, n, 0, e, 0, 0, n, 0, 0, e, 0, n, 0, 0, 0, 1, 0], i);
};

o.saturate = function (t, e, i) {
  var e = (2 * (e || 0)) / 3 + 1,
    n = -0.5 * (e - 1);
  this._loadMatrix(t, [e, n, n, 0, 0, n, e, n, 0, 0, n, n, e, 0, 0, 0, 0, 0, 1, 0], i);
};

o.desaturate = function (t, e) {
  this.saturate(t, -1, e);
};

o.negative = function (t, e) {
  this._loadMatrix(t, [0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0], e);
};

o.sepia = function (t, e) {
  this._loadMatrix(
    t,
    [
      0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999, 0.16799999, 0, 0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0,
      0, 1, 0,
    ],
    e,
  );
};

o.technicolor = function (t, e) {
  this._loadMatrix(
    t,
    [
      1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, 11.793603434377337, -0.3087833385928097,
      1.7658908555458428, -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616, -0.7501899197440212,
      1.847597816108189, 0, 30.950940869491138, 0, 0, 0, 1, 0,
    ],
    e,
  );
};

o.polaroid = function (t, e) {
  this._loadMatrix(
    t,
    [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0],
    e,
  );
};

o.toBGR = function (t, e) {
  this._loadMatrix(t, [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0], e);
};

o.kodachrome = function (t, e) {
  this._loadMatrix(
    t,
    [
      1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502, -0.16404339962244616,
      1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203, -0.16786010706155763, -0.5603416277695248,
      1.6014850761964943, 0, 35.62982807460946, 0, 0, 0, 1, 0,
    ],
    e,
  );
};

o.browni = function (t, e) {
  this._loadMatrix(
    t,
    [
      0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873, -0.037703249837783157,
      0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335, -0.07441037908422492,
      0.44972182064877153, 0, -7.562075277591283, 0, 0, 0, 1, 0,
    ],
    e,
  );
};

o.vintage = function (t, e) {
  this._loadMatrix(
    t,
    [
      0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0, 9.651285835294123, 0.02578397704808868,
      0.6441188644374771, 0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719, -0.0851232987247891,
      0.5241648018700465, 0, 5.159190588235296, 0, 0, 0, 1, 0,
    ],
    e,
  );
};

o.colorTone = function (t, e, i, n, s, r) {
  var o = (((n = n || 16770432) >> 16) & 255) / 255,
    a = ((n >> 8) & 255) / 255,
    n = (255 & n) / 255,
    h = (((s = s || 3375104) >> 16) & 255) / 255,
    l = ((s >> 8) & 255) / 255,
    s = (255 & s) / 255,
    e = [0.3, 0.59, 0.11, 0, 0, o, a, n, (e = e || 0.2), 0, h, l, s, (i = i || 0.15), 0, o - h, a - l, n - s, 0, 0];
  this._loadMatrix(t, e, r);
};

o.night = function (t, e, i) {
  e = [-2 * (e = e || 0.1), -e, 0, 0, 0, -e, 0, e, 0, 0, 0, e, 2 * e, 0, 0, 0, 0, 0, 1, 0];
  this._loadMatrix(t, e, i);
};

o.predator = function (t, e, i) {
  this._loadMatrix(
    t,
    [
      11.224130630493164 * e,
      -4.794486999511719 * e,
      -2.8746118545532227 * e,
      0 * e,
      0.40342438220977783 * e,
      -3.6330697536468506 * e,
      9.193157196044922 * e,
      -2.951810836791992 * e,
      0 * e,
      -1.316135048866272 * e,
      -3.2184197902679443 * e,
      -4.2375030517578125 * e,
      7.476448059082031 * e,
      0 * e,
      0.8044459223747253 * e,
      0,
      0,
      0,
      1,
      0,
    ],
    i,
  );
};

o.lsd = function (t, e) {
  this._loadMatrix(t, [2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0, 0, 0, 1, 0], e);
};

o.reset = function (t) {
  this._loadMatrix(t, this.getDefaultColorMatrix(), false);
};

o.kill = function (t, e, i) {
  t.resetPipeline(e, i);
};

o._loadMatrix = function (t, e, i) {
  var n = e;
  if ((i = !!i)) {
    i = (i = t.pipelineData.colorMatrix) || o.getDefaultColorMatrix();
    this._multiply(n, i, e);
    n = this._colorMatrix(n);
  }
  t.pipelineData.colorMatrix = n;
};

o._multiply = function (t, e, i) {
  t[0] = e[0] * i[0] + e[1] * i[5] + e[2] * i[10] + e[3] * i[15];
  t[1] = e[0] * i[1] + e[1] * i[6] + e[2] * i[11] + e[3] * i[16];
  t[2] = e[0] * i[2] + e[1] * i[7] + e[2] * i[12] + e[3] * i[17];
  t[3] = e[0] * i[3] + e[1] * i[8] + e[2] * i[13] + e[3] * i[18];
  t[4] = e[0] * i[4] + e[1] * i[9] + e[2] * i[14] + e[3] * i[19];
  t[5] = e[5] * i[0] + e[6] * i[5] + e[7] * i[10] + e[8] * i[15];
  t[6] = e[5] * i[1] + e[6] * i[6] + e[7] * i[11] + e[8] * i[16];
  t[7] = e[5] * i[2] + e[6] * i[7] + e[7] * i[12] + e[8] * i[17];
  t[8] = e[5] * i[3] + e[6] * i[8] + e[7] * i[13] + e[8] * i[18];
  t[9] = e[5] * i[4] + e[6] * i[9] + e[7] * i[14] + e[8] * i[19];
  t[10] = e[10] * i[0] + e[11] * i[5] + e[12] * i[10] + e[13] * i[15];
  t[11] = e[10] * i[1] + e[11] * i[6] + e[12] * i[11] + e[13] * i[16];
  t[12] = e[10] * i[2] + e[11] * i[7] + e[12] * i[12] + e[13] * i[17];
  t[13] = e[10] * i[3] + e[11] * i[8] + e[12] * i[13] + e[13] * i[18];
  t[14] = e[10] * i[4] + e[11] * i[9] + e[12] * i[14] + e[13] * i[19];
  t[15] = e[15] * i[0] + e[16] * i[5] + e[17] * i[10] + e[18] * i[15];
  t[16] = e[15] * i[1] + e[16] * i[6] + e[17] * i[11] + e[18] * i[16];
  t[17] = e[15] * i[2] + e[16] * i[7] + e[17] * i[12] + e[18] * i[17];
  t[18] = e[15] * i[3] + e[16] * i[8] + e[17] * i[13] + e[18] * i[18];
  t[19] = e[15] * i[4] + e[16] * i[9] + e[17] * i[14] + e[18] * i[19];
  return t;
};

o._colorMatrix = function (t) {
  t = new Float32Array(t);
  t[4] /= 255;
  t[9] /= 255;
  t[14] /= 255;
  t[19] /= 255;
  return t;
};

o.getDefaultColorMatrix = function () {
  return [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
};

var __extends = o;

function o(t) {
  return (
    _super.call(this, {
      game: t,
      vertShader:
        "\n        precision mediump float;\n        uniform mat4 uProjectionMatrix;\n\n        attribute vec2 inPosition;\n        attribute vec2 inTexCoord;\n        attribute vec4 inTint;\n\n        varying vec2 outTexCoord;\n        varying vec4 outTint;\n\n        void main () {\n            gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);\n\n            outTexCoord = inTexCoord;\n            outTint = inTint;\n        }\n        ",
      fragShader:
        "precision mediump float;\n        varying vec2 outTexCoord;\n        uniform float m[20];\n        uniform sampler2D uSampler;\n\n        varying vec4 outTint;\n\n        void main(void){\n            vec4 c = texture2D(uSampler, outTexCoord) * vec4(outTint.rgb * outTint.a, outTint.a);\n\n            gl_FragColor.r = (m[0] * c.r);\n                gl_FragColor.r += (m[1] * c.g);\n                gl_FragColor.r += (m[2] * c.b);\n                gl_FragColor.r += (m[3] * c.a);\n                gl_FragColor.r += m[4];\n            gl_FragColor.g = (m[5] * c.r);\n                gl_FragColor.g += (m[6] * c.g);\n                gl_FragColor.g += (m[7] * c.b);\n                gl_FragColor.g += (m[8] * c.a);\n                gl_FragColor.g += m[9];\n            gl_FragColor.b = (m[10] * c.r);\n                gl_FragColor.b += (m[11] * c.g);\n                gl_FragColor.b += (m[12] * c.b);\n                gl_FragColor.b += (m[13] * c.a);\n                gl_FragColor.b += m[14];\n            gl_FragColor.a = (m[15] * c.r);\n                gl_FragColor.a += (m[16] * c.g);\n                gl_FragColor.a += (m[17] * c.b);\n                gl_FragColor.a += (m[18] * c.a);\n                gl_FragColor.a += m[19];\n        }",
      uniforms: ["m"],
    }) || this
  );
}

exports.PLColorMatrix = __extends;
