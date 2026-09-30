// jd/JDImageNineSlice.js — recovered from webpack module #101 of the original vex7.min.js
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

exports.JDImageNineSlice = undefined;

_super = Phaser.GameObjects.RenderTexture;

__extends(u, _super);

u.defaultSliceConfig = function (t) {
  if (typeof t.sourceLayout.width == "number") {
    i = (n = t.sourceLayout).width;
    n = n.height;
    t.sourceLayout = { topLeft: { width: i, height: n } };
  }
  var e,
    i = t.sourceLayout;
  i.topRight = i.topRight || i.topLeft;
  i.bottomRight = i.bottomRight || i.topLeft;
  i.bottomLeft = i.bottomLeft || i.topLeft;
  var n = Math.max(i.topLeft.height, i.topRight.height),
    s = Math.max(i.topRight.width, i.bottomRight.width),
    r = Math.max(i.bottomLeft.height, i.bottomRight.height),
    i = Math.max(i.topLeft.width, i.bottomLeft.width);
  if (!t.safeOffsets) {
    t.safeOffsets = { top: n, right: s, bottom: r, left: i };
  }
  if (t.minSizing === undefined || t.minSizing !== false) {
    e = t.safeOffsets;
    t.minSizing = {
      width: e ? Math.max(e.left + e.right, i + s) : i + s,
      height: e ? Math.max(e.top + e.bottom, n + r) : n + r,
    };
  } else {
    t.minSizing = false;
  }
  return t;
};

u.shortSliceLayout = function (t) {
  return {
    tl: { x: t.topLeft.width, y: t.topLeft.height },
    tr: { x: t.topRight.width, y: t.topRight.height },
    bl: { x: t.bottomLeft.width, y: t.bottomLeft.height },
    br: { x: t.bottomRight.width, y: t.bottomRight.height },
  };
};

u.prototype.changeFrame = function (t, e, i) {
  if (e === undefined) {
    e = 0;
  }
  if (i === undefined) {
    i = 0;
  }
  this.sourceFrame = this.sourceTex.get(t);
  this.initFrames();
  if (e === 0 && i === 0) {
    this.drawFrames();
  } else {
    this.resize(e, i);
  }
};

u.prototype.resize = function (t, e) {
  var i, n;
  if (this.sliceConfig) {
    i = (n = this.sliceConfig.minSizing) ? Math.max(n.height, e) : e;
    n = n ? Math.max(n.width, t) : t;
    if (e < i || t < n) {
      "Attempted to set NineSlice size less than minimum (".concat(t, "x").concat(e, ").");
    }
    _super.prototype.resize.call(this, n, i);
    this.drawFrames();
  }
};

u.prototype.initFrames = function () {
  function t(t, e, i, n, s) {
    var r = (r = (r = o.sourceFrame.name) === "__BASE" ? o.sourceTex.key : r) + t;
    if (a.has(r)) {
      o._frameCache[t] = a.frames[r];
    } else {
      o._frameCache[t] = a.add(r, 0, h + e, l + i, n, s);
    }
  }
  var o = this,
    a = this.sourceTex,
    e = this.sourceFrame.width,
    i = this.sourceFrame.height,
    h = this.sourceFrame.cutX,
    l = this.sourceFrame.cutY,
    n = u.shortSliceLayout(this.sliceConfig.sourceLayout);
  t("topLeft", 0, 0, n.tl.x, n.tl.y);
  t("topRight", e - n.tr.x, 0, n.tr.x, n.tr.y);
  t("bottomRight", e - n.br.x, i - n.br.y, n.br.x, n.br.y);
  t("bottomLeft", 0, i - n.bl.y, n.bl.x, n.bl.y);
  t("topMiddle", n.tl.x, 0, e - (n.tl.x + n.tr.x), Math.max(n.tl.y, n.tr.y));
  t("bottomMiddle", n.bl.x, i - Math.max(n.bl.y, n.br.y), e - (n.bl.x + n.br.x), Math.max(n.bl.y, n.br.y));
  t("leftMiddle", 0, n.tl.y, Math.max(n.tl.x, n.bl.x), i - (n.tl.y + n.bl.y));
  t("rightMiddle", e - Math.max(n.tr.x, n.br.x), n.tr.y, Math.max(n.tr.x, n.br.x), i - n.tr.y - n.br.y);
  var s = Math.min(n.tl.x, n.bl.x),
    r = Math.min(n.tl.y, n.tr.y);
  t("center", s, r, e - s - Math.min(n.tr.x, n.br.x), i - r - Math.min(n.br.y, n.bl.y));
};

u.prototype.drawFrames = function () {
  function t(t, e, i, n, s) {
    if (r) {
      r.setFrame(t.name);
    } else {
      (r = new Phaser.GameObjects.Image(o.scene, 0, 0, o.sourceTex.key, t.name)).setOrigin(0);
    }
    r.setScale(n / t.width, s / t.height);
    o.draw(r, e, i);
  }
  var r,
    o = this,
    e = u.shortSliceLayout(this.sliceConfig.sourceLayout),
    i = this._frameCache,
    n = Math.min(e.tl.x, e.bl.x),
    s = Math.min(e.tr.x, e.br.x),
    a = Math.min(e.tl.y, e.tr.y),
    h = Math.min(e.bl.y, e.br.y);
  this.clear();
  t(i.center, n, a, this.width - n - s, this.height - a - h);
  t(i.topMiddle, e.tl.x, 0, this.width - e.tl.x - e.tr.x, i.topMiddle.height);
  t(i.bottomMiddle, e.bl.x, this.height - i.bottomMiddle.height, this.width - e.bl.x - e.br.x, i.bottomMiddle.height);
  t(i.leftMiddle, 0, e.tl.y, i.leftMiddle.width, this.height - e.tl.y - e.bl.y);
  t(i.rightMiddle, this.width - e.tr.x, e.tr.y, i.rightMiddle.width, this.height - e.tr.y - e.br.y);
  t(i.topLeft, 0, 0, e.tl.x, e.tl.y);
  t(i.topRight, this.width - e.tr.x, 0, e.tr.x, e.tr.y);
  t(i.bottomRight, this.width - e.br.x, this.height - e.br.y, e.br.x, e.br.y);
  t(i.bottomLeft, 0, this.height - e.bl.y, e.bl.x, e.bl.y);
  r.destroy();
};

var __extends = u;

function u(t, e, i, n, s, r, o, a) {
  e = _super.call(this, t, e, i, n, s) || this;
  i = { sourceKey: r.key, sourceFrame: r.frame, sourceLayout: { width: o, height: o } };
  if (a) {
    i.safeOffsets = { top: a, right: a, bottom: a, left: a };
  }
  e.sliceConfig = u.defaultSliceConfig(i);
  e.sourceTex = t.sys.textures.get(r.key);
  e._frameCache = {};
  n = typeof r.frame == "string" || typeof r.frame == "number" ? r.frame : "__BASE";
  e.sourceFrame = e.sourceTex.get(n);
  e.initFrames();
  e.setOrigin(0.5, 0.5);
  return e;
}

exports.JDImageNineSlice = __extends;
