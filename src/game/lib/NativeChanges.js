// lib/NativeChanges.js — recovered from webpack module #251 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.NativeChanges = undefined;

var data_1 = require("../data");

function NativeChanges() {}

NativeChanges.addDelay = function (a) {
  Phaser.Core.TimeStep.prototype.step = function () {
    var t = window.performance.now(),
      e = (this.now = t) - this.lastTime;
    if (!((e = e < 0 ? 0 : e) < a)) {
      this.rawDelta = e;
      var i = this.deltaIndex,
        n = this.deltaHistory,
        s = this.deltaSmoothingMax;
      if (this._coolDown > 0 || !this.inFocus) {
        this._coolDown--;
        e = Math.min(e, this._target);
      }
      if (e > this._min) {
        e = n[i];
        e = Math.min(e, this._min);
      }
      n[i] = e;
      this.deltaIndex++;
      if (this.deltaIndex > s) {
        this.deltaIndex = 0;
      }
      for (var r = 0, o = 0; o < s; o++) r += n[o];
      this.delta = r /= s;
      this.time += this.rawDelta;
      if (t > this.nextFpsUpdate) {
        this.actualFps = 0.25 * this.framesThisSecond + 0.75 * this.actualFps;
        this.nextFpsUpdate = t + 1e3;
        this.framesThisSecond = 0;
      }
      this.framesThisSecond++;
      i = r / this._target;
      this.callback(t, r, i);
      this.lastTime = t;
      this.frame++;
    }
  };
};

NativeChanges.enableTJSDepthTesting = function (p) {
  if (p === undefined) {
    p = false;
  }
  Phaser.Renderer.WebGL.WebGLRenderer.prototype.init = function (t) {
    var e,
      i = this.game,
      n = this.canvas,
      s = t.backgroundColor;
    if (
      ((t.contextCreation.depth = p),
      !(e =
        i.config.context ||
        n.getContext("webgl2", t.contextCreation) ||
        n.getContext("webgl", t.contextCreation) ||
        n.getContext("experimental-webgl", t.contextCreation)) || e.isContextLost())
    )
      throw ((this.contextLost = true), new Error("WebGL unsupported"));
    this.gl = e;
    var r = this;
    this.contextLostHandler = function (t) {
      r.contextLost = true;
      r.game.events.emit(Phaser.Core.Events.CONTEXT_LOST, r);
      t.preventDefault();
    };
    this.contextRestoredHandler = function () {
      r.contextLost = false;
      r.init(r.config);
      r.game.events.emit(Phaser.Core.Events.CONTEXT_RESTORED, r);
    };
    n.addEventListener("webglcontextlost", this.contextLostHandler, false);
    n.addEventListener("webglcontextrestored", this.contextRestoredHandler, false);
    i.context = e;
    for (var o = 0; o <= 27; o++) this.blendModes.push({ func: [e.ONE, e.ONE_MINUS_SRC_ALPHA], equation: e.FUNC_ADD });
    this.blendModes[1].func = [e.ONE, e.DST_ALPHA];
    this.blendModes[2].func = [e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA];
    this.blendModes[3].func = [e.ONE, e.ONE_MINUS_SRC_COLOR];
    this.blendModes[17] = { func: [e.ZERO, e.ONE_MINUS_SRC_ALPHA], equation: e.FUNC_REVERSE_SUBTRACT };
    this.glFormats[0] = e.BYTE;
    this.glFormats[1] = e.SHORT;
    this.glFormats[2] = e.UNSIGNED_BYTE;
    this.glFormats[3] = e.UNSIGNED_SHORT;
    this.glFormats[4] = e.FLOAT;
    this.glFuncMap = {
      mat2: { func: e.uniformMatrix2fv, length: 1, matrix: true },
      mat3: { func: e.uniformMatrix3fv, length: 1, matrix: true },
      mat4: { func: e.uniformMatrix4fv, length: 1, matrix: true },
      "1f": { func: e.uniform1f, length: 1 },
      "1fv": { func: e.uniform1fv, length: 1 },
      "1i": { func: e.uniform1i, length: 1 },
      "1iv": { func: e.uniform1iv, length: 1 },
      "2f": { func: e.uniform2f, length: 2 },
      "2fv": { func: e.uniform2fv, length: 1 },
      "2i": { func: e.uniform2i, length: 2 },
      "2iv": { func: e.uniform2iv, length: 1 },
      "3f": { func: e.uniform3f, length: 3 },
      "3fv": { func: e.uniform3fv, length: 1 },
      "3i": { func: e.uniform3i, length: 3 },
      "3iv": { func: e.uniform3iv, length: 1 },
      "4f": { func: e.uniform4f, length: 4 },
      "4fv": { func: e.uniform4fv, length: 1 },
      "4i": { func: e.uniform4i, length: 4 },
      "4iv": { func: e.uniform4iv, length: 1 },
    };
    var n = e.getSupportedExtensions();
    if (!(t.maxTextures && t.maxTextures !== -1)) {
      t.maxTextures = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
    }
    if (!t.maxTextureSize) {
      t.maxTextureSize = e.getParameter(e.MAX_TEXTURE_SIZE);
    }
    var a = "WEBGL_compressed_texture_",
      h = "WEBKIT_" + a;
    this.compression.ETC1 = e.getExtension(a + "etc1") || e.getExtension(h + "etc1");
    this.compression.PVRTC = e.getExtension(a + "pvrtc") || e.getExtension(h + "pvrtc");
    this.compression.S3TC = e.getExtension(a + "s3tc") || e.getExtension(h + "s3tc");
    this.supportedExtensions = n;
    this.instancedArraysExtension =
      n.indexOf("ANGLE_instanced_arrays") > -1 ? e.getExtension("ANGLE_instanced_arrays") : null;
    this.vaoExtension = n.indexOf("OES_vertex_array_object") > -1 ? e.getExtension("OES_vertex_array_object") : null;
    e.disable(e.DEPTH_TEST);
    e.disable(e.CULL_FACE);
    e.enable(e.BLEND);
    e.clearColor(s.redGL, s.greenGL, s.blueGL, s.alphaGL);
    this.mipmapFilter = e[t.mipmapFilter];
    this.maxTextures = Phaser.Renderer.WebGL.Utils.checkShaderMax(e, t.maxTextures);
    this.textureIndexes = [];
    var l = this.tempTextures;
    if (Array.isArray(l)) for (var u = 0; u < this.maxTextures; u++) e.deleteTexture(l[u]);
    else l = new Array(this.maxTextures);
    for (var c = 0; c < this.maxTextures; c++) {
      var d = e.createTexture();
      e.activeTexture(e.TEXTURE0 + c);
      e.bindTexture(e.TEXTURE_2D, d);
      e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      l[c] = d;
      this.textureIndexes.push(c);
    }
    this.tempTextures = l;
    this.currentActiveTexture = 1;
    this.startActiveTexture++;
    e.activeTexture(e.TEXTURE1);
    this.pipelines = new Phaser.Renderer.WebGL.PipelineManager(this);
    this.setBlendMode(Phaser.BlendModes.NORMAL);
    this.projectionMatrix = new Phaser.Math.Matrix4().identity();
    i.textures.once(Phaser.Textures.Events.READY, this.boot, this);
    return this;
  };
};

NativeChanges.updateText = function (w, b) {
  Phaser.GameObjects.Text.prototype.updateText = function () {
    var t = this.canvas,
      e = this.context,
      i = this.style,
      n = i.resolution,
      s = i.metrics;
    i.syncFont(t, e);
    var r = this._text,
      o = (r = i.wordWrapWidth || i.wordWrapCallback ? this.runWordWrap(this._text) : r).split(this.splitRegExp),
      a = Phaser.GameObjects.GetTextSize(this, s, o);
    this.lineSpacing = w * (Number(i.fontSize.replace("px", "")) / b);
    var h,
      r = this.padding;
    if (i.fixedWidth === 0) {
      this.width = a.width + r.left + r.right;
      h = a.width;
    } else {
      this.width = i.fixedWidth;
      if ((h = this.width - r.left - r.right) < a.width) {
        h = a.width;
      }
    }
    if (i.fixedHeight === 0) {
      this.height = a.height + r.top + r.bottom;
    } else {
      this.height = i.fixedHeight;
    }
    var l,
      u,
      c = this.width,
      d = this.height;
    this.updateDisplayOrigin();
    c *= n;
    d *= n;
    c = Math.max(c, 1);
    d = Math.max(d, 1);
    if (t.width !== c || t.height !== d) {
      t.width = c;
      t.height = d;
      this.frame.setSize(c, d);
      i.syncFont(t, e);
    } else {
      e.clearRect(0, 0, c, d);
    }
    e.save();
    e.scale(n, n);
    if (i.backgroundColor) {
      e.fillStyle = i.backgroundColor;
      e.fillRect(0, 0, c, d);
    }
    i.syncStyle(t, e);
    e.textBaseline = "alphabetic";
    e.translate(r.left, r.top);
    for (var p = 0; p < a.lines; p++) {
      if (
        ((l = i.strokeThickness / 2),
        (u = i.strokeThickness / 2 + p * a.lineHeight + s.ascent),
        p > 0 && (u += a.lineSpacing * p),
        i.rtl)
      )
        l = c - l;
      else if (i.align === "right") l += h - a.lineWidths[p];
      else if (i.align === "center") l += (h - a.lineWidths[p]) / 2;
      else if (i.align === "justify" && a.lineWidths[p] / a.width >= 0.85) {
        var f = a.width - a.lineWidths[p],
          g = e.measureText(" ").width,
          y = o[p].trim(),
          v = y.split(" ");
        f += (o[p].length - y.length) * g;
        for (var m = Math.floor(f / g), x = 0; m > 0;) {
          v[x] += " ";
          x = (x + 1) % (v.length - 1 || 1);
          --m;
        }
        o[p] = v.join(" ");
      }
      if (this.autoRound) {
        l = Math.round(l);
        u = Math.round(u);
      }
      if (i.strokeThickness) {
        this.style.syncShadow(e, i.shadowStroke);
        e.strokeText(o[p], l, u);
      }
      if (i.color) {
        this.style.syncShadow(e, i.shadowFill);
        e.fillText(o[p], l, u);
      }
    }
    e.restore();
    if (this.renderer && this.renderer.gl) {
      this.frame.source.glTexture = this.renderer.canvasToTexture(t, this.frame.source.glTexture, true);
      this.frame.glTexture = this.frame.source.glTexture;
    }
    this.dirty = true;
    n = this.input;
    if (n && !n.customHitArea) {
      n.hitArea.width = this.width;
      n.hitArea.height = this.height;
    }
    return this;
  };
};

NativeChanges.strokePath = function () {
  Phaser.Renderer.WebGL.Pipelines.MultiPipeline.prototype.batchLine = function (t, e, i, n, s, r, o, a, h, l, u) {
    this.renderer.pipelines.set(this);
    var c = this.calcMatrix;
    if (u) {
      u.multiply(l, c);
    }
    var u = i - t,
      l = n - e,
      u = Math.sqrt(u * u + l * l),
      l = (s * (n - e)) / u,
      s = (s * (t - i)) / u,
      d = (r * (n - e)) / u,
      r = (r * (t - i)) / u,
      u = i - d,
      p = n - r,
      f = t - l,
      g = e - s,
      i = i + d,
      d = n + r,
      n = t + l,
      r = e + s,
      t = c.getX(u, p),
      l = c.getY(u, p),
      e = c.getX(f, g),
      s = c.getY(f, g),
      u = c.getX(i, d),
      p = c.getY(i, d),
      f = c.getX(n, r),
      g = c.getY(n, r),
      i = this.strokeTint,
      d = i.TL,
      c = i.TR,
      n = i.BL,
      r = i.BR;
    this.batchQuad(null, f, g, e, s, t, l, u, p, 0, 0, 1, 1, d, c, n, r, 2);
  };
};

NativeChanges.setVisibility = function (t) {
  t.events.on(Phaser.Core.Events.HIDDEN, function () {
    e.suspend();
  });
  t.events.on(Phaser.Core.Events.VISIBLE, function () {
    e.resume();
  });
  var e = t.sound.context;
};

NativeChanges.deleteInstanceFromAtlasJSON = function () {
  Phaser.Textures.Parsers.JSONArray = function (t, e, i) {
    if (i.frames || i.textures) {
      var n = t.source[e];
      t.add("__BASE", e, 0, 0, n.width, n.height);
      for (var s, r = (Array.isArray(i.textures) ? i.textures[e] : i).frames, o = 0; o < r.length; o++) {
        var a = r[o],
          h = t.add(a.filename.replace("instance ", ""), e, a.frame.x, a.frame.y, a.frame.w, a.frame.h);
        if (a.trimmed) {
          h.setTrim(
            a.sourceSize.w,
            a.sourceSize.h,
            a.spriteSourceSize.x,
            a.spriteSourceSize.y,
            a.spriteSourceSize.w,
            a.spriteSourceSize.h,
          );
        }
        if (a.rotated) {
          h.rotated = true;
          h.updateUVsInverted();
        }
        var l = a.anchor || a.pivot;
        if (l) {
          h.customPivot = true;
          h.pivotX = l.x;
          h.pivotY = l.y;
        }
        h.customData = Phaser.Utils.Objects.Clone(a);
      }
      for (s in i) {
        if (s !== "frames") {
          if (Array.isArray(i[s])) {
            t.customData[s] = i[s].slice(0);
          } else {
            t.customData[s] = i[s];
          }
        }
      }
      return t;
    }
  };
};

NativeChanges.setBitmapTextSize = function () {
  function s(t, B, F, e) {
    if ((F === undefined && (F = false), !(e = e === undefined ? null : e)))
      return {
        local: { x: 0, y: 0, width: 0, height: 0 },
        global: { x: 0, y: 0, width: 0, height: 0 },
        lines: { shortest: 0, longest: 0, lengths: null, height: 0 },
        wrappedText: "",
        words: [],
        characters: [],
        scaleX: 0,
        scaleY: 0,
      };
    var i = 90,
      N = 74;
    if (data_1.Fonts.Main === data_1.Fonts.Garet) {
      i = 70;
      N = 66;
    }
    var Y,
      X,
      n,
      s = t.text,
      U = s.length,
      z = t.maxWidth * t.scaleX,
      V = t.wordWrapCharCode,
      r = Number.MAX_VALUE,
      o = Number.MAX_VALUE,
      a = 0,
      h = 0,
      G = t.fontData.chars,
      W = t.letterSpacing,
      l = 0,
      u = 0,
      c = 0,
      d = null,
      j = t._align,
      p = 0,
      f = 0,
      g = t.fontSize / t.fontData.size,
      y = g * t.scaleX,
      v = g * t.scaleY,
      m = null,
      H = 0,
      x = [],
      w = Number.MAX_VALUE,
      b = 0,
      K = 0,
      T = 0,
      S = [],
      q = [],
      P = null;
    if (z > 0) {
      for (M = 0; M < U; M++) {
        if ((c = s.charCodeAt(M)) !== 10) {
          if ((d = G[c])) {
            n = undefined;
            if (m !== null) {
              n = d.kerning[H];
            }
            if (c === V) {
              if (P !== null) {
                S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v, cr: false });
                P = null;
              }
            } else {
              (P = P === null ? { word: "", i: M, x: l, y: u, w: 0, h: i, cr: false } : P).word = P.word.concat(s[M]);
              P.w += d.xOffset + d.xAdvance + (n !== undefined ? n : 0);
            }
            l += d.xAdvance + W;
            m = d;
            H = c;
          }
        } else {
          if (P !== null) {
            S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v, cr: true });
            P = null;
          }
          l = 0;
          u += i;
          m = null;
        }
      }
      if (P !== null) {
        S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v, cr: false });
      }
      for (var l = 0, u = 0, m = null, H = 0, _ = undefined, E = 0, A = [], M = 0; M < S.length; M++) {
        var C = S[M],
          J = C.x,
          Z = C.x + C.w;
        if (_) {
          E = J - (J - (_.x + _.w) + _.w);
          _ = null;
        }
        if (z < J - E || z < Z - E) {
          A.push(C.i - 1);
          _ = C.cr ? (A.push(C.i + C.word.length), (E = 0), null) : C;
        } else if (C.cr) {
          A.push(C.i + C.word.length);
          E = 0;
          _ = null;
        }
      }
      for (M = A.length - 1; M >= 0; M--) {
        if (A[M] >= 0) {
          s = (Y = s).substr(0, (X = A[M])) + "\n" + Y.substr(X + 1);
        }
      }
      U = (e.wrappedText = s).length;
      S = [];
      P = null;
    }
    var O,
      Q,
      $,
      tt = 0;
    for (M = 0; M < U; M++) {
      if ((c = s.charCodeAt(M)) !== 10) {
        if ((d = G[c])) {
          p = l;
          f = u;
          O = undefined;
          if (m !== null) {
            p += (O = d.kerning[H]) !== undefined ? O : 0;
          }
          if (p < r) {
            r = p;
          }
          if (f < o) {
            o = f;
          }
          if (a < (Q = p + d.xAdvance)) {
            a = Q;
          }
          if (h < ($ = f + i)) {
            h = $;
          }
          $ = d.xOffset + d.xAdvance + (O !== undefined ? O : 0);
          if (c === V) {
            if (P !== null) {
              S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v });
              P = null;
            }
          } else {
            (P = P === null ? { word: "", i: tt, x: l, y: u, w: 0, h: i } : P).word = P.word.concat(s[M]);
            P.w += $;
          }
          q.push({
            i: tt,
            char: s[M],
            code: c,
            x: (d.xOffset + l) * g,
            y: (d.yOffset + u) * g,
            w: d.width * g,
            h: d.height * g,
            t: u * g,
            r: Q * g,
            b: i * g,
            line: K,
            glyph: d,
          });
          l += d.xAdvance + W;
          m = d;
          H = c;
          T = Q * g;
          tt++;
        }
      } else {
        if (P !== null) {
          S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v });
          P = null;
        }
        l = 0;
        u += N;
        m = null;
        if (b < (x[K] = T)) {
          b = T;
        }
        if (T < w) {
          w = T;
        }
        K++;
        T = 0;
      }
    }
    if (
      (P !== null && S.push({ word: P.word, i: P.i, x: P.x * y, y: P.y * v, w: P.w * y, h: P.h * v }),
      b < (x[K] = T) && (b = T),
      T < w && (w = T),
      j > 0)
    )
      for (var et = 0; et < q.length; et++) {
        var R,
          k = q[et];
        if (j === 1) {
          R = (b - x[k.line]) / 2;
          k.x += R;
          k.r += R;
        } else if (j === 2) {
          R = b - x[k.line];
          k.x += R;
          k.r += R;
        }
      }
    var D = e.local,
      L = e.global,
      I = e.lines;
    D.x = r * g;
    D.y = o * g;
    D.width = a * g;
    D.height = h * g;
    L.x = t.x - t._displayOriginX + r * y;
    L.y = t.y - t._displayOriginY + o * v;
    L.width = a * y;
    L.height = h * v;
    I.shortest = w;
    I.longest = b;
    I.lengths = x;
    if (B) {
      D.x = Math.ceil(D.x);
      D.y = Math.ceil(D.y);
      D.width = Math.ceil(D.width);
      D.height = Math.ceil(D.height);
      L.x = Math.ceil(L.x);
      L.y = Math.ceil(L.y);
      L.width = Math.ceil(L.width);
      L.height = Math.ceil(L.height);
      I.shortest = Math.ceil(w);
      I.longest = Math.ceil(b);
    }
    if (
      F &&
      ((t._displayOriginX = t.originX * D.width),
      (t._displayOriginY = t.originY * D.height),
      (L.x = t.x - t._displayOriginX * t.scaleX),
      (L.y = t.y - t._displayOriginY * t.scaleY),
      B)
    ) {
      L.x = Math.ceil(L.x);
      L.y = Math.ceil(L.y);
    }
    e.words = S;
    e.characters = q;
    e.lines.height = i;
    e.scale = g;
    e.scaleX = t.scaleX;
    e.scaleY = t.scaleY;
  }
  Phaser.GameObjects.BitmapText.prototype.getTextBounds = function (t) {
    var e = this._bounds;
    if (this._dirty || t || this.scaleX !== e.scaleX || this.scaleY !== e.scaleY) {
      s(this, t, true, e);
      this._dirty = false;
    }
    return e;
  };
  Phaser.GameObjects.BitmapText.prototype.setFont = function (t, e, i) {
    var n;
    if (e === undefined) {
      e = this._fontSize;
    }
    if (i === undefined) {
      i = this._align;
    }
    if (t !== this.font && (n = this.scene.sys.cache.bitmapFont.get(t))) {
      this.font = t;
      this.fontData = n.data;
      this._fontSize = e;
      this._align = i;
      this.fromAtlas = n.fromAtlas === true;
      this.setTexture(n.texture, n.frame);
      s(this, false, true, this._bounds);
    }
    return this;
  };
};

exports.NativeChanges = NativeChanges;
