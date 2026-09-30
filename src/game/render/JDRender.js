// render/JDRender.js — recovered from webpack module #94 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.JDRender = undefined;

var PipelineManager_1 = require("./PipelineManager"),
  PLPivotSkew_1 = require("./PLPivotSkew");

function JDRender() {}

JDRender.init = function (t) {
  PipelineManager_1.PipelineManager.init(t);
  if (t.renderer.type === Phaser.CANVAS) {
    this.canvasGameObjectDestroy();
    this.canvasRenderImages();
    this.canvas = document.createElement("canvas");
    Phaser.GameObjects.BitmapText.prototype.renderCanvas = this.canvasRenderBitmapText;
  }
};

JDRender.canvasGameObjectDestroy = function () {
  Phaser.GameObjects.GameObject.prototype.destroy = function () {
    if (this.scene && !this.ignoreDestroy) {
      if (this.cachedTintedTexture) {
        Phaser.Display.Canvas.CanvasPool.remove(this);
        this.cachedTintedTexture = undefined;
      }
      if (this.preDestroy) {
        this.preDestroy.call(this);
      }
      this.emit(Phaser.Core.Events.DESTROY, this);
      this.removeAllListeners();
      if (this.postPipelines) {
        this.resetPostPipeline(true);
      }
      if (this.displayList) {
        this.displayList.queueDepthSort();
        this.displayList.remove(this);
      }
      if (this.input) {
        this.scene.sys.input.clear(this);
        this.input = undefined;
      }
      if (this.data) {
        this.data.destroy();
        this.data = undefined;
      }
      if (this.body) {
        this.body.destroy();
        this.body = undefined;
      }
      this.active = false;
      this.visible = false;
      this.scene = undefined;
      this.displayList = undefined;
      this.parentContainer = undefined;
    }
  };
};

JDRender.canvasRenderImages = function () {
  Phaser.Renderer.Canvas.CanvasRenderer.prototype.batchSprite = function (t, e, i, n) {
    var s,
      r,
      o,
      a,
      h,
      l,
      u,
      c,
      d,
      p,
      f,
      g,
      y,
      v,
      m,
      x,
      w = i.alpha * t.alpha;
    if (w != 0) {
      s = this.currentContext;
      r = this._tempMatrix1;
      o = this._tempMatrix2;
      a = this._tempMatrix3;
      h = (l = e.canvasData).x;
      l = l.y;
      u = e.cutWidth;
      c = e.cutHeight;
      m = e.customPivot;
      d = e.source.resolution;
      v = t.displayOriginX;
      x = t.displayOriginY;
      p = -v + e.x;
      f = -x + e.y;
      if (
        t.isCropped &&
        (((g = t._crop).flipX === t.flipX && g.flipY === t.flipY) || e.updateCropUVs(g, t.flipX, t.flipY),
        (u = g.cw),
        (c = g.ch),
        (h = g.cx),
        (l = g.cy),
        (p = -v + g.x),
        (f = -x + g.y),
        t.flipX && (p >= 0 ? (p = -(p + u)) : p < 0 && (p = Math.abs(p) - u)),
        t.flipY)
      ) {
        if (f >= 0) {
          f = -(f + c);
        } else if (f < 0) {
          f = Math.abs(f) - c;
        }
      }
      y = g = 1;
      if (t.flipX) {
        if (!m) {
          p += -e.realWidth + 2 * v;
        }
        g = -1;
      }
      if (t.flipY) {
        if (!m) {
          f += -e.realHeight + 2 * x;
        }
        y = -1;
      }
      PLPivotSkew_1.PLPivotSkew.calculateMatrix(t, g, y, r, o, a, i, n);
      s.save();
      a.setToContext(s);
      s.globalAlpha = w;
      s.imageSmoothingEnabled = !(!this.antialias || e.source.scaleMode);
      s.globalCompositeOperation = this.blendModes[t.blendMode];
      if ((v = t.tintTopLeft) !== 16777215) {
        m = JDRender.getGameObjectTintCanvas(t);
        if (!(t.cachedTint === v && t.refreshDrawTint !== true)) {
          x = m.getContext("2d");
          if (!(m.width === u && m.height === c)) {
            m.width = u;
            m.height = c;
          }
          x.clearRect(0, 0, u, c);
          x.fillStyle = "#" + ("00000" + (0 | v).toString(16)).substr(-6);
          x.fillRect(0, 0, u, c);
          x.globalCompositeOperation = "multiply";
          x.drawImage(e.source.image, h, l, u, c, 0, 0, u, c);
          x.globalCompositeOperation = "destination-atop";
          x.drawImage(e.source.image, h, l, u, c, 0, 0, u, c);
          t.cachedTint = v;
          t.refreshDrawTint = false;
        }
        s.drawImage(m, 0, 0, u, c, p, f, u / d, c / d);
      } else {
        s.drawImage(e.source.image, h, l, u, c, p, f, u / d, c / d);
      }
      s.restore();
    }
  };
};

JDRender.canvasRenderBitmapText = function (t, e, i, n) {
  var s = e._text,
    r = s.length,
    o = t.currentContext;
  if (r !== 0 && Phaser.Renderer.Canvas.SetTransform(t, o, e, i, n)) {
    i.addToRenderList(e);
    var a,
      h,
      t = e.texture.frames.__BASE,
      l = e.fontData.chars,
      u = e.fontData.lineHeight,
      c = e._letterSpacing,
      d = 0,
      p = 0,
      f = 0,
      g = 0,
      y = 0,
      v = 0,
      m = 0,
      x = 0,
      w = null,
      b = 0,
      T = t.source.image,
      S = t.cutX,
      P = t.cutY,
      _ = e._fontSize / e.fontData.size,
      E = e._align,
      A = 0,
      M = 0,
      n = e.getTextBounds(false),
      t = n.local.width,
      C = n.local.height;
    if (e.maxWidth > 0) {
      r = (s = n.wrappedText).length;
    }
    var O = e._bounds.lines;
    if (E === 1) {
      M = (O.longest - O.lengths[0]) / 2;
    } else if (E === 2) {
      M = O.longest - O.lengths[0];
    }
    o.translate(-e.displayOriginX, -e.displayOriginY);
    var B = i.roundPixels;
    if (!e.cachedTint) {
      e.cachedTint = 16777215;
    }
    var R,
      n = e.tintTopLeft,
      i = n !== 16777215,
      k = e.cachedTint !== n,
      D = o;
    if (i == true) {
      if (!((R = JDRender.canvas).width === t && R.height === C)) {
        R.width = t;
        R.height = C;
      }
      (D = R.getContext("2d")).clearRect(0, 0, t, C);
    }
    for (var L, I = 0; I < r; I++) {
      if ((a = s.charCodeAt(I)) !== 10) {
        if (
          (h = l[a]) &&
          ((f = S + h.x),
          (g = P + h.y),
          (y = h.width),
          (v = h.height),
          (m = h.xOffset + d),
          (x = h.yOffset + p),
          w !== null && (m += (L = h.kerning[b]) !== undefined ? L : 0),
          (x *= _),
          (m = m * _ + M),
          (d += h.xAdvance + c),
          (w = h),
          (b = a),
          y !== 0) &&
          v !== 0 &&
          a !== 32
        ) {
          if (B) {
            m = Math.round(m);
            x = Math.round(x);
          }
          D.save();
          D.translate(m, x);
          D.scale(_, _);
          D.drawImage(T, f, g, y, v, 0, 0, y, v);
          D.restore();
        }
      } else {
        A++;
        if (E === 1) {
          M = (O.longest - O.lengths[A]) / 2;
        } else if (E === 2) {
          M = O.longest - O.lengths[A];
        }
        d = 0;
        p += u;
        w = null;
      }
    }
    if (i == true) {
      i = JDRender.getGameObjectTintCanvas(e);
      if (!(k != true && e.refreshDrawTint !== true)) {
        k = i.getContext("2d");
        if (!(i.width === t && i.height === C)) {
          i.width = t;
          i.height = C;
        }
        k.clearRect(0, 0, t, C);
        k.fillStyle = "#" + ("00000" + (0 | n).toString(16)).substr(-6);
        k.fillRect(0, 0, t, C);
        k.globalCompositeOperation = "multiply";
        k.drawImage(R, 0, 0, t, C);
        k.globalCompositeOperation = "destination-atop";
        k.drawImage(R, 0, 0, t, C);
        e.cachedTint = n;
        e.refreshDrawTint = false;
      }
      o.drawImage(i, 0, 0, t, C);
    }
    o.restore();
  }
};

JDRender.getGameObjectTintCanvas = function (t) {
  var e = t.cachedTintedTexture;
  if (!e) {
    e = t.cachedTintedTexture = Phaser.Display.Canvas.CanvasPool.create(t);
    t.cachedTint = 16777215;
  }
  return e;
};

exports.JDRender = JDRender;
