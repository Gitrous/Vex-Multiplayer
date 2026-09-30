// subscenes/SubSkinsSelect.js — recovered from webpack module #215 of the original vex7.min.js
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

exports.SubSkinsSelect = undefined;

var BasicSubSkins_1 = require("./BasicSubSkins"),
  data_1 = require("../data"),
  SubSceneList_1 = require("./SubSceneList"),
  jd_1 = require("../jd"),
  Tools_1 = require("../utils/Tools"),
  system_1 = require("../system"),
  Achievements_1 = require("../system/Achievements"),
  BalanceData_1 = require("../system/BalanceData"),
  SkinsData_1 = require("../system/SkinsData"),
  SoundManager_1 = require("../system/SoundManager"),
  skins_1 = require("../skins");

_super = BasicSubSkins_1.BasicSubSkins;

__extends(SubSkinsSelect, _super);

SubSkinsSelect.prototype.init = function (t) {
  _super.prototype.init.call(this);
  this.currRarity = t.id;
  this.currSelected = SkinsData_1.SkinsData.getSkinIndex(this.currRarity, BalanceData_1.BalanceData.currSkin);
  var e = data_1.Constants.GHH + 100;
  this.panSpin = new skins_1.SkinRaritySpin(
    this,
    this.currRarity,
    BalanceData_1.BalanceData.currSkin,
    data_1.Constants.GHW - 760,
    e,
    t.spinFrame,
    t.titleColor,
  );
  this.panEquip = new skins_1.SkinRarityEquip(
    this,
    this.currSelected,
    data_1.Constants.GHW + 760,
    e,
    "btnGreen 10000",
    t.titleColor,
  );
  e -= 30;
  var i = new Phaser.GameObjects.Image(
    this.scene,
    data_1.Constants.GHW,
    e,
    system_1.TexturesEdit.getPanelBgTexture(this.scene, 1100, 780),
  );
  this.add(i);
  (i = new Phaser.GameObjects.Image(
    this.scene,
    i.x,
    i.y - 348,
    data_1.Atlases.gameplay,
    "whiteBlock 10000",
  )).displayWidth = 1086;
  i.displayHeight = 70;
  i.setTint(4950515, 180474, 4950515, 180474);
  this.add(i);
  this.txtProgress = new jd_1.JDBmpdText(this.scene, i.x, i.y, data_1.Fonts.Main, "", 40);
  this.add(this.txtProgress);
  this.stars = new skins_1.EffectStars(this);
  this.imgSelected = new Phaser.GameObjects.Image(this.scene, 0, 0, data_1.Atlases.ui, "skinSelecte 10000");
  this.add(this.imgSelected);
  this.slots = new Array();
  for (
    var n = data_1.Constants.GHW - 430, s = n, r = e - 215, o = 0;
    o < SkinsData_1.SkinsData.skinIDs[this.currRarity].length;
    o++
  ) {
    var a = SkinsData_1.SkinsData.getSlotStatus(this.currRarity, o),
      h = new skins_1.SkinSlot(this, o, SkinsData_1.SkinsData.skinIDs[this.currRarity][o], a, s, r);
    this.add(h);
    this.slots.push(h);
    s += 170;
    if ((o + 1) % 6 == 0) {
      s = n;
      r += 170;
    }
  }
  i = h = null;
  this.updateProgress();
  if (this.currSelected === -1) {
    this.imgSelected.visible = false;
  } else {
    this.select(this.currSelected, false);
  }
  if (t.spin !== undefined) {
    this.startChoosing(t.spin);
    this.panSpin.updateSpinValues();
  } else {
    this.panSpin.checkSpinAgain();
  }
  this.moveSpineContainerTop();
};

SubSkinsSelect.prototype.updateProgress = function () {
  var t = SkinsData_1.SkinsData.getRaritySkinsAmount(this.currRarity),
    e = SkinsData_1.SkinsData.getSkinOpened(this.currRarity);
  this.txtProgress.text = e + "/" + t;
};

SubSkinsSelect.prototype.select = function (t, e) {
  if (e === undefined) {
    e = true;
  }
  this.currSelected = t;
  this.scene.tweens.killTweensOf(this.imgSelected);
  this.imgSelected.visible = true;
  this.imgSelected.scale = 1;
  this.imgSelected.x = this.slots[this.currSelected].x;
  this.imgSelected.y = this.slots[this.currSelected].y;
  if (e === true) {
    this.panEquip.select(SkinsData_1.SkinsData.skinIDs[this.currRarity][this.currSelected]);
  }
};

SubSkinsSelect.prototype.equip = function () {
  BalanceData_1.BalanceData.currSkin = SkinsData_1.SkinsData.skinIDs[this.currRarity][this.currSelected];
  this.panSpin.select(BalanceData_1.BalanceData.currSkin);
  this.scene.player.setSkin(BalanceData_1.BalanceData.currSkin);
  this.slots[this.currSelected].equiped();
  SkinsData_1.SkinsData.setSkinStatus2(this.currRarity, this.currSelected);
  this.back();
};

SubSkinsSelect.prototype.back = function () {
  this.scene.showSubScene(SubSceneList_1.SubSceneList.SkinsRarity);
};

SubSkinsSelect.prototype.update = function () {
  _super.prototype.update.call(this);
  this.stars.update();
};

SubSkinsSelect.prototype.destroy = function () {
  this.panSpin.destroy();
  this.panEquip.destroy();
  this.slots = null;
  this.imgSelected = null;
  this.openArray = null;
  this.stars.destroy();
  this.stars = null;
  this.txtProgress = null;
  _super.prototype.destroy.call(this);
};

SubSkinsSelect.prototype.startChoosing = function (t) {
  if (t === true) {
    this.addMoney(-SkinsData_1.SkinsData.getPrice(this.currRarity), this.currRarity);
  } else {
    SkinsData_1.SkinsData.addSpinToken(this.currRarity, -1);
  }
  this.openArray = new Array();
  for (var e = 0; e < this.slots.length; e++) {
    if (this.slots[e].status === 0) {
      this.openArray.push(e);
    }
  }
  if (((this.currChoosingID = 0), this.openArray.length === 1)) {
    SkinsData_1.SkinsData.openSkin(this.currRarity, this.openArray[this.currChoosingID]);
    this.applyPrize();
  } else {
    Tools_1.Tools.shuffle(this.openArray);
    this.step = Tools_1.Tools.random(12, 15);
    for (var i = 0; i < this.step - 1; i++) {
      this.currChoosingID += 1;
      if (this.currChoosingID === this.openArray.length) {
        this.currChoosingID = 0;
      }
    }
    SkinsData_1.SkinsData.openSkin(this.currRarity, this.openArray[this.currChoosingID]);
    this.currChoosingID = 0;
    this.setNextPrizeID();
    this.scene.input.enabled = false;
    this.scene.game.canvas.style.cursor = "default";
  }
};

SubSkinsSelect.prototype.setNextPrizeID = function () {
  var t = this.openArray[this.currChoosingID];
  this.unselectItem(t);
  this.currChoosingID += 1;
  if (this.currChoosingID === this.openArray.length) {
    this.currChoosingID = 0;
  }
  t = this.openArray[this.currChoosingID];
  this.selectItem(t);
  SoundManager_1.SoundManager.playSFX("slot_random");
};

SubSkinsSelect.prototype.applyPrize = function () {
  this.scene.input.enabled = true;
  var t = this.openArray[this.currChoosingID];
  this.select(t);
  this.scene.add.tween({ targets: this.imgSelected, scale: 1.2, duration: 250, yoyo: true, loop: 2 });
  this.scene.add.tween({ targets: this.slots[t], scale: 1.2, duration: 250, yoyo: true, loop: 2 });
  SoundManager_1.SoundManager.playSFX("slot_unlock");
  this.slots[t].open();
  this.panSpin.checkSpinAgain();
  this.stars.show(this.imgSelected.x, this.imgSelected.y);
  this.scene.events.emit(
    Achievements_1.Achievements.EVENT_ACHIEVEMENT_COMPLETE,
    "Skin",
    SkinsData_1.SkinsData.getSkinCell(this.currRarity, t),
  );
  this.updateProgress();
  if (SkinsData_1.SkinsData.totalSkinsOpened === SkinsData_1.SkinsData.totalSkins) {
    Achievements_1.Achievements.saveAchive(Achievements_1.TrophieAchieves.allSkins);
  }
};

SubSkinsSelect.prototype.unselectItem = function (t) {
  if (this.slots[t].scaleX !== 1) {
    this.scene.add.tween({ targets: this.slots[t], scale: 1, duration: 150 });
  }
};

SubSkinsSelect.prototype.selectItem = function (t) {
  --this.step;
  if (this.step !== 1) {
    this.select(t, false);
    this.scene.add.tween({ targets: this.imgSelected, scale: 1.2, duration: 150 });
    this.scene.add.tween({
      targets: this.slots[t],
      scale: 1.2,
      duration: 150,
      onComplete: this.setNextPrizeID,
      onCompleteScope: this,
    });
  } else {
    this.applyPrize();
  }
};

var _SubSkinsSelect = SubSkinsSelect;

function SubSkinsSelect() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.SubSkinsSelect = _SubSkinsSelect;
