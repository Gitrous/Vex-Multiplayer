// render/PLPivotSkew.js — recovered from webpack module #56 of the original vex7.min.js
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

exports.PLPivotSkew = undefined;

_super = Phaser.Renderer.WebGL.Pipelines.MultiPipeline;

__extends(b, _super);

b.prototype.batchSprite = function (t, e, i) {
  this.manager.set(this, t);
  var n = this._tempMatrix1,
    s = this._tempMatrix2,
    r = this._tempMatrix3,
    o = t.frame,
    a = o.glTexture,
    h = o.u0,
    l = o.v0,
    u = o.u1,
    c = o.v1,
    d = o.x,
    p = o.y,
    f = o.cutWidth,
    g = o.cutHeight,
    y = o.customPivot,
    v = t.displayOriginX,
    m = t.displayOriginY,
    d = -v + d,
    p = -m + p;
  if (t.isCropped) {
    if (!((x = t._crop).flipX === t.flipX && x.flipY === t.flipY)) {
      o.updateCropUVs(x, t.flipX, t.flipY);
    }
    h = x.u0;
    l = x.v0;
    u = x.u1;
    c = x.v1;
    f = x.width;
    g = x.height;
    d = -v + x.x;
    p = -m + x.y;
  }
  var x = 1,
    w = 1;
  if (t.flipX) {
    if (!y) {
      d += -o.realWidth + 2 * v;
    }
    x = -1;
  }
  if (t.flipY || (o.source.isGLTexture && !a.flipY)) {
    if (!y) {
      p += -o.realHeight + 2 * m;
    }
    w = -1;
  }
  b.calculateMatrix(t, x, w, n, s, r, e, i);
  var v = d + f,
    y = p + g,
    m = e.roundPixels,
    x = r.getXRound(d, p, m),
    w = r.getYRound(d, p, m),
    n = r.getXRound(d, y, m),
    s = r.getYRound(d, y, m),
    i = r.getXRound(v, y, m),
    f = r.getYRound(v, y, m),
    g = r.getXRound(v, p, m),
    d = r.getYRound(v, p, m),
    y = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha,
    r = e.alpha,
    v = y(t.tintTopLeft, r * t._alphaTL),
    p = y(t.tintTopRight, r * t._alphaTR),
    m = y(t.tintBottomLeft, r * t._alphaBL),
    e = y(t.tintBottomRight, r * t._alphaBR);
  if (this.shouldFlush(6)) {
    this.flush();
  }
  var y = this.setGameObject(t, o);
  this.manager.preBatch(t);
  this.batchQuad(t, x, w, n, s, i, f, g, d, h, l, u, c, v, p, m, e, t.tintFill, a, y);
  this.manager.postBatch(t);
};

b.calculateMatrix = function (i, t, e, n, s, r, o, a) {
  var h,
    l,
    u,
    c,
    d,
    p,
    f = i.scaleX * t,
    g = i.scaleY * e,
    t = i.x,
    e = i.y;
  function y() {
    var t, e;
    c =
      i.rotation !== 0
        ? ((t = Math.cos(i.rotation)), (e = Math.sin(i.rotation)), (h = t * f), (l = e * f), (u = -e * g), t * g)
        : ((h = f), (u = l = 0), g);
  }
  if ((i.skewX || i.skewY) && ((d = i.rotation + i.skewX), (p = i.rotation + i.skewY) % b.PI2 || d % b.PI2)) {
    if (!(d === i._cachedRotX && p === i._cachedRotY)) {
      i._cachedRotX = d;
      i._cachedRotY = p;
      i._crA = Math.cos(p);
      i._srB = Math.sin(p);
      i._srC = Math.sin(-d);
      i._crD = Math.cos(d);
    }
    h = i._crA * f;
    l = i._srB * f;
    u = i._srC * g;
    c = i._crD * g;
  } else {
    y();
  }
  if (i.pivotX || i.pivotY) {
    t += i.pivotX * h + i.pivotY * u;
    e += i.pivotX * l + i.pivotY * c;
  }
  n.copyFrom(o.matrix);
  if (a) {
    n.multiplyWithOffset(a, -o.scrollX * i.scrollFactorX, -o.scrollY * i.scrollFactorY);
  } else {
    t -= o.scrollX * i.scrollFactorX;
    e -= o.scrollY * i.scrollFactorY;
  }
  s.setTransform(h, l, u, c, t, e);
  n.multiply(s, r);
};

b.PI2 = 2 * Math.PI;

var __extends = b;

function b(t) {
  return _super.call(this, { game: t }) || this;
}

exports.PLPivotSkew = __extends;
