// jd/JD9SliceBase.js — recovered from webpack module #58 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.JD9SliceBase = undefined;

(n = c = c || {}).tl = "tl";

n.tr = "tr";

n.br = "br";

n.bl = "bl";

n.tm = "tm";

n.bm = "bm";

n.lm = "lm";

n.rm = "rm";

n.c = "c";

d.addConfig = function (t, e, i, n, s) {
  this.configs[t.key + this.getFrameName(t.frame)] = {
    tl: { x: e, y: n },
    tr: { x: i, y: n },
    bl: { x: e, y: s },
    br: { x: i, y: s },
    minWidth: e + i,
    minHeight: n + s,
  };
};

d.getConfig = function (t) {
  this.configs[t];
  return this.configs[t];
};

d.getFrameName = function (t) {
  return t !== undefined ? t : this._baseFrameName;
};

d.removeConfig = function (t, e) {
  delete this.configs[t + this.getFrameName(e)];
};

d.removeFromTexture = function (t, e, i) {
  var n = t.textures.get(e);
  i = i || e;
  for (var s = 0, r = Object.keys(c); s < r.length; s++) {
    var o = r[s];
    n.remove(i + c[o]);
  }
};

d.prototype.getView = function () {
  return this.view;
};

d.prototype.addView = function (t) {
  this.view = t;
  this.view.once(Phaser.GameObjects.Events.DESTROY, this.destroyInternal, this);
};

d.prototype.setInteractive = function () {};

d.prototype.add9Slice = function (t, e, i, n, s, r, o) {
  var a = this.data9Slice.length;
  s.frame = d.getFrameName(s.frame);
  if (r === undefined) {
    r = this.originX;
  }
  if (o === undefined) {
    o = this.originY;
  }
  this.data9Slice.push({
    x: t + (this.width - i) * r,
    y: e + (this.height - n) * o,
    tKey: s.key,
    tFrame: s.frame,
    config: d.getConfig(s.key + s.frame),
    frames: {},
  });
  this.setSize(a, i, n);
  this.initFrames(a);
};

d.prototype.changeFrame = function (t, e) {
  var i = this.data9Slice[t];
  if (e.key !== undefined) {
    i.tKey = e.key;
  }
  i.tFrame = d.getFrameName(e.frame);
  if (e.x !== undefined) {
    i.x = e.x;
  }
  if (e.y !== undefined) {
    i.y = e.y;
  }
  this.setSize(t, e.width, e.height);
  if (e.key !== undefined && e.frame !== undefined) {
    this.initFrames(t);
  }
};

d.prototype.removeFrames = function (t) {
  this.data9Slice.splice(t, 1);
};

d.prototype.clear = function () {
  this.data9Slice = [];
};

d.prototype.initFrames = function (t) {
  var o = this.data9Slice[t],
    t = o.tKey,
    a = o.tFrame,
    h = this.scene.textures.get(t),
    e = h.get(a),
    i = e.width,
    n = e.height,
    l = e.cutX,
    u = e.cutY;
  function s(t, e, i, n, s) {
    var r = a + t;
    if (h.has(r)) {
      o.frames[t] = h.frames[r];
    } else {
      o.frames[t] = h.add(r, 0, l + e, u + i, n, s);
    }
  }
  if (a === d._baseFrameName) {
    a = t;
  }
  var e = o.config;
  s(c.tl, 0, 0, e.tl.x, e.tl.y);
  s(c.tr, i - e.tr.x, 0, e.tr.x, e.tr.y);
  s(c.br, i - e.br.x, n - e.br.y, e.br.x, e.br.y);
  s(c.bl, 0, n - e.bl.y, e.bl.x, e.bl.y);
  s(c.tm, e.tl.x, 0, i - (e.tl.x + e.tr.x), Math.max(e.tl.y, e.tr.y));
  s(c.bm, e.bl.x, n - Math.max(e.bl.y, e.br.y), i - (e.bl.x + e.br.x), Math.max(e.bl.y, e.br.y));
  s(c.lm, 0, e.tl.y, Math.max(e.tl.x, e.bl.x), n - (e.tl.y + e.bl.y));
  s(c.rm, i - Math.max(e.tr.x, e.br.x), e.tr.y, Math.max(e.tr.x, e.br.x), n - e.tr.y - e.br.y);
  var t = Math.min(e.tl.x, e.bl.x),
    r = Math.min(e.tl.y, e.tr.y);
  s(c.c, t, r, i - t - Math.min(e.tr.x, e.br.x), n - r - Math.min(e.br.y, e.bl.y));
};

d.prototype.drawFrame = function (t, e, i, n, s, r) {};

d.prototype.drawFrames = function (t) {
  var t = this.data9Slice[t],
    e = t.config,
    i = t.frames,
    n = Math.min(e.tl.x, e.bl.x),
    s = Math.min(e.tr.x, e.br.x),
    r = Math.min(e.tl.y, e.tr.y),
    o = Math.min(e.bl.y, e.br.y);
  this.drawFrame(t, i[c.c], n, r, t.width - n - s, t.height - r - o);
  this.drawFrame(t, i[c.tm], e.tl.x, 0, t.width - e.tl.x - e.tr.x, i[c.tm].height);
  this.drawFrame(t, i[c.bm], e.bl.x, t.height - i[c.bm].height, t.width - e.bl.x - e.br.x, i[c.bm].height);
  this.drawFrame(t, i[c.lm], 0, e.tl.y, i[c.lm].width, t.height - e.tl.y - e.bl.y);
  this.drawFrame(t, i[c.rm], t.width - e.tr.x, e.tr.y, i[c.rm].width, t.height - e.tr.y - e.br.y);
  this.drawFrame(t, i[c.tl], 0, 0, e.tl.x, e.tl.y);
  this.drawFrame(t, i[c.tr], t.width - e.tr.x, 0, e.tr.x, e.tr.y);
  this.drawFrame(t, i[c.br], t.width - e.br.x, t.height - e.br.y, e.br.x, e.br.y);
  this.drawFrame(t, i[c.bl], 0, t.height - e.bl.y, e.bl.x, e.bl.y);
};

d.prototype.draw = function () {
  for (var t = 0; t < this.data9Slice.length; t++) this.drawFrames(t);
};

d.prototype.setSize = function (t, e, i) {
  var n = this.data9Slice[t].config;
  if (e === undefined) {
    e = n.minWidth;
  }
  if (i === undefined) {
    i = n.minHeight;
  }
  var s = e > n.minWidth ? e : n.minWidth,
    i = i > n.minHeight ? i : n.minHeight;
  if (!(n.minWidth > e)) {
    n.minHeight;
  }
  this.data9Slice[t].width = s;
  this.data9Slice[t].height = i;
};

d.prototype.tintFragments = function (t, e) {};

d.prototype.destroyInternal = function () {
  this.view = null;
  this.scene = null;
  this.data9Slice = null;
};

d.prototype.destroy = function () {
  this.view.destroy();
};

d.configs = {};

d._baseFrameName = "__BASE";

var c,
  n = d;

function d(t, e, i, n, s) {
  this.scene = t;
  this.data9Slice = new Array();
  this.width = e;
  this.height = i;
  this.originX = n;
  this.originY = s;
}

exports.JD9SliceBase = n;
