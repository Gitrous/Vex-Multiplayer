// system/SkinsData.js — recovered from webpack module #24 of the original vex7.min.js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.SkinsData = undefined;

var Helpers_1 = require("../utils/Helpers"),
  BalanceData_1 = require("./BalanceData"),
  SaveGame_1 = require("./SaveGame");

function SkinsData() {}

SkinsData.init = function (t, e, i) {
  if (
    ((this.skinsPrice = t),
    (this.skinRareIDs = e),
    (this.skinIDs = i),
    (this.skinsRarity = this.skinRareIDs.length),
    (this.totalSkins = 0),
    (this.data = SaveGame_1.SaveGame.getInstance().getSkins()),
    this.data)
  ) {
    for (n = 0; n < this.skinsRarity; n++)
      if (((s = this.skinIDs[n].length), (this.totalSkins += s), this.data[n].length < s))
        for (r = 0; r < s; r++) this.data[n].push(0);
  } else {
    this.data = new Array(this.skinsRarity + 1);
    for (var n = 0; n < this.skinsRarity; n++) {
      var s = this.skinIDs[n].length;
      this.totalSkins += s;
      this.data[n] = new Array(s);
      for (var r = 0; r < s; r++) this.data[n][r] = 0;
    }
    this.data[this.skinsRarity] = [0, 0, 0, 0, 0];
    this.data[0][0] = 2;
  }
  for (
    this.save(), this.totalSkinsOpened = 0, this.skinsOpened = new Array(this.skinsRarity), n = 0;
    n < this.skinsRarity;
    n++
  )
    for (r = this.skinsOpened[n] = 0; r < this.data[n].length; r++) {
      if (this.data[n][r] !== 0) {
        this.skinsOpened[n] += 1;
        this.totalSkinsOpened += 1;
      }
    }
};

SkinsData.checkFreeSkin = function (t) {
  for (
    var e = new Date(),
      i =
        Helpers_1.Helpers.formatNumberZeroLess10(e.getDate()) +
        "/" +
        Helpers_1.Helpers.formatNumberZeroLess10(e.getMonth() + 1) +
        "/" +
        e.getFullYear(),
      n = -1,
      s = 0;
    s < t.length;
    s++
  )
    if (i === t[s].date) {
      n = t[s].skinID;
      break;
    }
  if (!(n < 0))
    for (s = 0; s < this.skinsRarity; s++)
      for (var r = this.skinIDs[s].length, o = 0; o < r; o++)
        if (this.skinIDs[s][o] === n)
          return this.data[s][o] > 0
            ? undefined
            : ((this.freeSkinData = { rare: s, id: o, skinID: n }), void this.openSkin(s, o));
};

SkinsData.getSkinFrameName = function (t) {
  return Helpers_1.Helpers.formatNumberZeroLess10(t) + " 10000";
};

SkinsData.getSkinIndex = function (t, e) {
  return this.skinIDs[t].indexOf(e);
};

SkinsData.getSkinCell = function (t, e) {
  return this.skinIDs[t][e];
};

SkinsData.getRaritySkinsAmount = function (t) {
  return this.data[t].length;
};

SkinsData.getSlotStatus = function (t, e) {
  return this.data[t][e];
};

SkinsData.hasUnusedSkin = function (t) {
  for (var e = 0; e < this.data[t].length; e++) if (this.data[t][e] === 1) return true;
  return false;
};

SkinsData.canShowI = function () {
  for (var t = 0; t < this.skinsRarity; t++) if (this.canShowIRarity(t) === true) return true;
  return false;
};

SkinsData.canShowIRarity = function (t) {
  for (var e = 0; e < this.data[t].length; e++) if (this.data[t][e] === 1) return true;
  return false;
};

SkinsData.enouthMoney = function (t) {
  var e = this.getPrice(t);
  if (this.isTowerRarity(t) === true) {
    if (BalanceData_1.BalanceData.totalTowerMoney >= e) return true;
  } else if (BalanceData_1.BalanceData.totalMoney >= e) return true;
  return false;
};

SkinsData.isTowerRarity = function (t) {
  return t === this.skinsRarity - 1;
};

SkinsData.hasSpinTokens = function (t) {
  return this.data[this.skinsRarity][t] !== 0;
};

SkinsData.getSpinTokensAmount = function (t) {
  return this.data[this.skinsRarity][t];
};

SkinsData.getPrice = function (t) {
  return this.skinsPrice[t];
};

SkinsData.getSkinOpened = function (t) {
  return this.skinsOpened[t];
};

SkinsData.openSkin = function (t, e) {
  this.skinsOpened[t] += 1;
  this.totalSkinsOpened += 1;
  this.data[t][e] = 1;
  this.save();
};

SkinsData.setSkinStatus2 = function (t, e) {
  this.data[t][e] = 2;
  this.save();
};

SkinsData.addSpinToken = function (t, e) {
  this.data[this.skinsRarity][t] += e = e === undefined ? 1 : e;
  this.save();
};

SkinsData.save = function () {
  SaveGame_1.SaveGame.getInstance().saveSkins(this.data);
};

exports.SkinsData = SkinsData;
