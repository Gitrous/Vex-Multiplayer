// ui/hud/PTNT.js — recovered from webpack module #144 of the original vex7.min.js
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

exports.PTNT = undefined;

var data_1 = require("../../data"),
  jd_1 = require("../../jd");

_super = Phaser.GameObjects.Container;

__extends(PTNT, _super);

PTNT.prototype.setTnt = function (t) {
  this.txtTnt.setText(Math.floor(100 * t) + "%");
  t = this.progressBar.width * (1 - t);
  this.progressBar.setCrop(t, 0, this.progressBar.width, this.progressBar.height);
  this.sparkSprite.x = this.progressBar.x - this.progressBar.width + t;
  if (Math.random() < 0.2) {
    this.scene.particleManager.createColorParticleUI(
      this.sparkSprite.x,
      this.sparkSprite.y,
      this,
      5 * Math.random() - 2.5,
      5 * Math.random() - 2.5,
      16763904,
      4,
      false,
      false,
      20,
      true,
    );
  }
};

PTNT.prototype.destroy = function () {
  _super.prototype.destroy.call(this);
  this.scene = null;
  this.txtTnt = null;
  this.sparkSprite = null;
  this.progressBar = null;
};

var _PTNT = PTNT;

function PTNT(t) {
  var e = _super.call(this, t, data_1.Constants.GHW) || this,
    i = new Phaser.GameObjects.Image(e.scene, 0, 0, data_1.Atlases.ui, "vexTntPanel 10000");
  i.setOrigin(0.5, 0);
  e.add(i);
  var n = new jd_1.JDBmpdText(e.scene, 0, 42, data_1.Fonts.Main, "TNT", 50);
  e.add(n);
  e.txtTnt = new jd_1.JDBmpdText(e.scene, 75, 116, data_1.Fonts.Main, "100%", 30);
  e.add(e.txtTnt);
  (i = new Phaser.GameObjects.Image(e.scene, 40, 120, data_1.Atlases.ui, "tntBarBg 10000")).setOrigin(1, 0.5);
  e.add(i);
  e.progressBar = new Phaser.GameObjects.Image(e.scene, 40, 120, data_1.Atlases.ui, "tntBarProgress 10000");
  e.progressBar.setOrigin(1, 0.5);
  e.add(e.progressBar);
  e.sparkSprite = new Phaser.GameObjects.Image(
    t,
    e.progressBar.x - e.progressBar.displayWidth,
    e.progressBar.y,
    data_1.Atlases.ui,
    "spark 10000",
  );
  e.add(e.sparkSprite);
  i = null;
  return e;
}

exports.PTNT = _PTNT;
