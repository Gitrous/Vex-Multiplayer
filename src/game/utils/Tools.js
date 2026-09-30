// utils/Tools.js — recovered from webpack module #4 of the original vex7.min.js
"use strict";

function Tools() {}

Object.defineProperty(exports, "__esModule", { value: true });

exports.Tools = undefined;

Tools.random = function (t, e) {
  return Math.floor(Math.random() * (e - t + 1)) + t;
};

Tools.randomNum = function (t, e) {
  return Math.random() * (e - t) + t;
};

Tools.simpleRandom = function () {
  return 100 * Math.random();
};

Tools.randomOne = function (t) {
  if (t === undefined) {
    t = 0.5;
  }
  return Math.random() < t ? 1 : -1;
};

Tools.randomBool = function (t) {
  if (t === undefined) {
    t = 0.5;
  }
  return Math.random() < t;
};

Tools.getDir = function (t) {
  return t < 0 ? -1 : t > 0 ? 1 : 0;
};

Tools.roundDec = function (t, e) {
  if (e === undefined) {
    e = 0;
  }
  e = Math.pow(10, e);
  return Math.round(t * e) / e;
};

Tools.clamp = function (t, e, i) {
  return Math.max(e, Math.min(i, t));
};

Tools.lerp = function (t, e, i) {
  return t + (e - t) * Tools.clamp(i, 0, 1);
};

Tools.lerpUnity = function (t, e, i) {
  return t + (e - t) * Tools.clamp01Unity(i);
};

Tools.clamp01Unity = function (t) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
};

Tools.magnitudeUnity = function (t, e) {
  return Math.sqrt(t * t + e * e);
};

Tools.sqrtMagnitudeUnity = function (t, e) {
  return t * t + e * e;
};

Tools.toDeg = function (t) {
  return t * this.radToDeg;
};

Tools.toRad = function (t) {
  return t * this.degToRad;
};

Tools.rotatePointByAngle = function (t, e, i, n, s) {
  var r = Math.cos(s),
    s = Math.sin(s);
  return { x: t + (i - t) * r - (n - e) * s, y: e + (i - t) * s + (n - e) * r };
};

Tools.distance = function (t, e, i, n) {
  return Math.sqrt((i - t) * (i - t) + (n - e) * (n - e));
};

Tools.angleOfPoints = function (t, e, i, n) {
  return Math.atan2(n - e, i - t);
};

Tools.getObjectRandomProperty = function (t) {
  var e = Object.keys(t);
  return t[e[(e.length * Math.random()) << 0]];
};

Tools.abs = function (t) {
  return (t = t < 0 ? -t : t);
};

Tools.getSlideSide = function (t, e, i, n) {
  t = this.toDeg(this.angleOfPoints(t, e, i, n));
  return t < -45 && t > -135
    ? "down"
    : (t > 135 && t <= 180) || (t >= -180 && t < -135)
      ? "right"
      : t > 45 && t < 135
        ? "up"
        : t > -45 && t < 45
          ? "left"
          : undefined;
};

Tools.toPercent = function (t, e) {
  return (t / e) * 100;
};

Tools.fromPercent = function (t, e) {
  return (t * e) / 100;
};

Tools.damping = function (t, e, i) {
  if (e === undefined) {
    e = 0.05;
  }
  if (i === undefined) {
    i = 0.95;
  }
  return (t = t !== 0 && Tools.abs((t *= i)) < e ? 0 : t);
};

Tools.intersectsRectangles = function (t, e, i, n, s, r, o, a) {
  return !(t + i < s || e + n < r || s + o < t || r + a < e);
};

Tools.intersectCircleRectange = function (t, e, i, n, s, r, o) {
  r /= 2;
  o /= 2;
  t = Math.abs(t - n - r);
  n = Math.abs(e - s - o);
  return !(r + i < t || o + i < n || !(t <= r || n <= o || (e = t - r) * e + (s = n - o) * s <= i * i));
};

Tools.containsRectPoint = function (t, e, i, n, s, r) {
  return t <= s && s < t + i && e <= r && r < e + n;
};

Tools.angleDifference = function (t, e) {
  e = e < t ? t - e : e - t;
  return e < 180 ? e : 360 - e;
};

Tools.vec2Length = function (t, e) {
  return Math.sqrt(t * t + e * e);
};

Tools.getRandomCellID = function (t) {
  return Math.floor(Math.random() * t);
};

Tools.getAndDelRandomCell = function (t) {
  var e = Tools.getRandomCellID(t.length),
    i = t[e];
  t.splice(e, 1);
  return i;
};

Tools.getRandomCell = function (t) {
  return t[Tools.getRandomCellID(t.length)];
};

Tools.shuffle = function (t) {
  for (var e = t.length; e > 1;) {
    e--;
    var i = Math.floor(Math.random() * (e + 1)),
      n = t[i];
    t[i] = t[e];
    t[e] = n;
  }
};

Tools.getFrom1Dto2DIndex = function (t, e) {
  return { x: t % e, y: Math.floor(t / e) };
};

Tools.containsPointInPoly = function (t, e, i) {
  for (var n = false, s = t.length - 1, r = 0; r < t.length; s = r++) {
    var o = t[r].x,
      a = t[r].y,
      h = t[s].x,
      l = t[s].y;
    if ((i < a != i < l && e < ((h - o) * (i - a)) / (l - a) + o) == true) {
      n = !n;
    }
  }
  return n;
};

Tools.interpolateColor = function (t, e, i, n) {
  return this.getHexColorFromRBG255(this.interpolateColorRGB(this.getRGB255(t), this.getRGB255(e), i, n));
};

Tools.interpolateColorRGB = function (t, e, i, n) {
  return { r: ((e.r - t.r) * i) / n + t.r, g: ((e.g - t.g) * i) / n + t.g, b: ((e.b - t.b) * i) / n + t.b };
};

Tools.getRGB = function (t) {
  return { r: ((t >> 16) & 255) / 255, g: ((t >> 8) & 255) / 255, b: (255 & t) / 255 };
};

Tools.getRGBFromString = function (t) {
  t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
  return t ? { r: parseInt(t[1], 16) / 255, g: parseInt(t[2], 16) / 255, b: parseInt(t[3], 16) / 255 } : null;
};

Tools.getRGB255 = function (t) {
  return { r: (t >> 16) & 255, g: (t >> 8) & 255, b: 255 & t };
};

Tools.getHexColorFromRBG255 = function (t) {
  return this.getHexColorFrom255(t.r, t.g, t.b);
};

Tools.getHexColorFrom255 = function (t, e, i) {
  return (t << 16) | (e << 8) | i;
};

Tools.rgbToHexString = function (t, e, i, n) {
  return (n = n === undefined ? "#" : n) + ((1 << 24) + (t << 16) + (e << 8) + i).toString(16).slice(1);
};

Tools.formatNumber = function (t) {
  return t.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

Tools.sortArrayObectsByKey = function (t, i, e) {
  var n = -1,
    s = 1;
  if ((e = e === undefined ? true : e) === false) {
    s = -(n = 1);
  }
  t.sort(function (t, e) {
    t = t[i];
    e = e[i];
    return t < e ? n : e < t ? s : 0;
  });
};

Tools.checkSkewValue = function (t) {
  if (t > Math.PI) {
    t = -(Math.PI - (t - Math.PI));
  } else if (t < -Math.PI) {
    t = Math.PI + (t + Math.PI);
  }
  return t;
};

Tools.smartRotation = function (t) {
  if ((t %= Tools.PI2) > Math.PI) {
    t -= Tools.PI2;
  } else if (t < -Math.PI) {
    t += Tools.PI2;
  }
  return t;
};

Tools.convertNumToStr = function (t, e) {
  if (e === undefined) {
    e = 2;
  }
  var i = String(Math.floor(t));
  for (i === "NaN" && (i = "0"); i.length < e;) i = "0" + i;
  return i;
};

Tools.formatNum = function (t, e, i) {
  if (i === undefined) {
    i = -1;
  }
  var n = t < 0;
  t = Math.abs(t);
  for (var s = "" + Math.floor(t); s.length < e;) s = "0" + s;
  if (i >= 0) {
    var r = "" + t,
      t = r.indexOf(".");
    for (t === -1 && (t = r.length - 1), r = r.substr(t + 1, i); r.length < i;) r += "0";
    s += "." + r;
  }
  return (s = n == true ? "-" + s : s);
};

Tools.getVolumeFromVelocity = function (t, e, i) {
  return (i = i === undefined ? 1 : i) < t / (e = e === undefined ? 10 : e) ? i : t / e;
};

Tools.calcCurrentTime = function (t) {
  var e = new Date(Date.now()),
    t = new Date(t);
  t.setTime(t.getTime());
  return e - t;
};

Tools.isAnHour = function (t) {
  return Math.floor(t / 1e3 / 60 / 60) >= 1;
};

Tools.getFollowRotationSpeed = function (t, e, i, n, s, r) {
  if (r === undefined) {
    r = 1;
  }
  return this.getFollowRotationSpeedR(i, this.angleOfPoints(t, e, n, s), r);
};

Tools.getFollowRotationSpeedR = function (t, e, i) {
  e = (e - t) % this.PI2;
  return e > 0.001 || e < -0.001 ? (e > Math.PI ? (e -= this.PI2) : e < -Math.PI && (e += this.PI2), e * i) : 0;
};

Tools.PI2 = 2 * Math.PI;

Tools.PI05 = Math.PI / 2;

Tools.PI025 = Math.PI / 4;

Tools.degToRad = Math.PI / 180;

Tools.radToDeg = 180 / Math.PI;

exports.Tools = Tools;
