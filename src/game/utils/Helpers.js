// utils/Helpers.js — recovered from webpack module #7 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.Helpers = undefined;

var Tools_1 = require("./Tools"),
  Localization_1 = require("../system/Localization"),
  PlayerBase_1 = require("../entities/PlayerBase");

function Helpers() {}

Helpers.timeDecorator = function (t) {
  var e = Math.floor((t / 100) % 10),
    i = e.toString();
  if (e < 10) {
    i = "0" + e;
  }
  var e = Math.floor((t / 1e3) % 60),
    n = e.toString();
  if (e < 10) {
    n = "0" + n;
  }
  var e = Math.floor((t / 1e3 / 60) % 60),
    t = e.toString();
  return ""
    .concat((t = e < 10 ? "0" + t : t), ":")
    .concat(n, ":")
    .concat(i);
};

Helpers.timeDecoratorHub = function (t) {
  var e = Math.floor((t / 1e3) % 60),
    i = e.toString();
  if (e < 10) {
    i = "0" + i;
  }
  var e = Math.floor((t / 1e3 / 60) % 60),
    n = e.toString();
  if (e < 10) {
    n = "0" + n;
  }
  var e = Math.floor((t / 1e3 / 60 / 60) | 0),
    t = e.toString();
  return ""
    .concat((t = e < 10 ? "0" + t : t), ":")
    .concat(n, ":")
    .concat(i);
};

Helpers.timeDecoratorActBlock = function (t) {
  var e = Math.floor((t / 1e3) % 60),
    i = e.toString();
  if (e < 10) {
    i = "0" + i;
  }
  var e = Math.floor((t / 1e3 / 60) % 60),
    t = e.toString();
  return "".concat((t = e < 10 ? "0" + t : t), ":").concat(i);
};

Helpers.moneyDecorator = function (t) {
  return t < 1e3 ? "" + t : t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

Helpers.getDeathText = function (t) {
  var e = 1;
  if (
    t === PlayerBase_1.DeathType.spike ||
    t === PlayerBase_1.DeathType.hardLanding ||
    t === PlayerBase_1.DeathType.quadrant ||
    t === PlayerBase_1.DeathType.dead_15
  ) {
    e = 2;
  } else if (
    t === PlayerBase_1.DeathType.buzzsaw ||
    t === PlayerBase_1.DeathType.squashed ||
    t === PlayerBase_1.DeathType.drowned ||
    t === PlayerBase_1.DeathType.fall ||
    t === PlayerBase_1.DeathType.dead_7 ||
    t === PlayerBase_1.DeathType.shurikan ||
    t === PlayerBase_1.DeathType.sparkElectric ||
    t === PlayerBase_1.DeathType.poolElectric ||
    t === PlayerBase_1.DeathType.dead_13 ||
    t === PlayerBase_1.DeathType.laser
  ) {
    e = 3;
  } else if (t === PlayerBase_1.DeathType.noEntry) {
    e = 1;
  } else if (t === PlayerBase_1.DeathType.reaper) {
    e = 4;
  }
  return "death" + t + "_" + Tools_1.Tools.random(1, e);
};

Helpers.formatNumberZeroLess10 = function (t) {
  return t < 10 ? "0" + t : "" + t;
};

Helpers.getLevelTargetText = function (t, e) {
  return t === 1
    ? Localization_1.Localization.getText("lvlTarget1")
    : t === 2
      ? Localization_1.Localization.getText("lvlTarget2").replace("<x>", "" + e)
      : t === 3
        ? e <= 1
          ? Localization_1.Localization.getText("lvlTarget3")
          : Localization_1.Localization.getText("lvlTarget3less").replace("<x>", "" + e)
        : undefined;
};

Helpers.getPolygon = function (t, e, i, n) {
  return new SAT.Polygon(new SAT.Vector(t, e), [
    new SAT.Vector(0, 0),
    new SAT.Vector(i, 0),
    new SAT.Vector(i, n),
    new SAT.Vector(0, n),
  ]);
};

Helpers.getPolygonOffset = function (t, e, i, n, s, r) {
  t = this.getPolygon(t, e, i, n);
  t.setOffset(new SAT.Vector(s, r));
  return t;
};

Helpers.isAnHour = function (t) {
  return !!t && Math.floor(t / 1e3 / 60 / 60) >= 1;
};

exports.Helpers = Helpers;
