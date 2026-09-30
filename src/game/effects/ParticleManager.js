// effects/ParticleManager.js — recovered from webpack module #147 of the original vex7.min.js
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

exports.ParticleManager = undefined;

var data_1 = require("../data"),
  jd_1 = require("../jd"),
  Tools_1 = require("../utils/Tools"),
  system_1 = require("../system"),
  entities_1 = require("../entities"),
  ColorParticle_1 = require("./ColorParticle");

_super = Phaser.GameObjects.Container;

__extends(ParticleManager, _super);

ParticleManager.prototype.reset = function () {
  this.particles = [];
  this.particlesUI = [];
  this.particleNum = 0;
  this.particleUINum = 0;
  this.expolsions = [];
};

ParticleManager.prototype.createPlayerGib = function (t, e, i, n, s, r, o, a, h) {
  if (
    (r === undefined && (r = 0),
    o === undefined && (o = 0),
    a === undefined && (a = 4),
    h === undefined && (h = true),
    system_1.BalanceData.particleLimit !== 0)
  ) {
    s = new entities_1.PlayerGib(this.scene, this, s, a, h);
    if (
      (s.spawn(t, e, i / 2, n / 2, r, o / 2),
      this.particleNum++,
      this.particles.push(s),
      this.particleNum >= system_1.BalanceData.particleLimit)
    )
      for (var l = 0, u = this.particles; l < u.length; l++) {
        var c = u[l];
        if (c.alive) {
          c.destroy();
          break;
        }
      }
  }
};

ParticleManager.prototype.createColorParticle = function (t, e, i, n, s, r, o, a, h, l) {
  if (
    (s === undefined && (s = 0),
    r === undefined && (r = 4),
    o === undefined && (o = true),
    a === undefined && (a = false),
    h === undefined && (h = 140),
    l === undefined && (l = false),
    system_1.BalanceData.particleLimit !== 0)
  ) {
    s = new ColorParticle_1.ColorParticle(this.scene, this, s, r, o, a, 2 * h, l);
    if (
      (s.spawn(t, e, i / 2, n / 2),
      (this.particleNum += 1),
      this.particles.push(s),
      this.particleNum >= system_1.BalanceData.particleLimit)
    )
      for (var u = 0, c = this.particles; u < c.length; u++) {
        var d = c[u];
        if (d.alive) {
          d.destroy();
          break;
        }
      }
  }
};

ParticleManager.prototype.createColorParticleUI = function (t, e, i, n, s, r, o, a, h, l, u) {
  if (
    (r === undefined && (r = 0),
    o === undefined && (o = 4),
    a === undefined && (a = true),
    h === undefined && (h = false),
    l === undefined && (l = 140),
    u === undefined && (u = false),
    system_1.BalanceData.particleLimit !== 0)
  ) {
    i = new ColorParticle_1.ColorParticle(this.scene, i, r, o, a, h, 2 * l, u);
    if (
      (i.spawn(t, e, n / 2, s / 2),
      (i.isUI = true),
      (this.particleUINum += 1),
      this.particlesUI.push(i),
      this.particleUINum >= system_1.BalanceData.particleLimit)
    )
      for (var c = 0, d = this.particlesUI; c < d.length; c++) {
        var p = d[c];
        if (p.alive) {
          p.destroy(true);
          break;
        }
      }
  }
};

ParticleManager.prototype.update = function () {
  for (var t, e = 0; e < this.particles.length; e++) {
    if ((t = this.particles[e]).alive) {
      t.update();
    } else {
      this.particles.splice(e, 1);
      e--;
    }
  }
  for (e = 0; e < this.particlesUI.length; e++) {
    if ((t = this.particlesUI[e]).alive) {
      t.update();
    } else {
      this.particlesUI.splice(e, 1);
      e--;
    }
  }
  for (var i = 0, n = this.expolsions; i < n.length; i++) n[i].update();
};

ParticleManager.prototype.magnetTo = function (t, e, i, n) {
  for (var s = 0, r = this.particles; s < r.length; s++) {
    var o = r[s];
    if (o.alive === false) return;
    var a = Tools_1.Tools.distance(t, e, o.xPos, o.yPos);
    if (a < i) {
      if (a < n) {
        o.fadeTime = 150;
        o.multAlpha(0.5);
      }
      if (o.yPos < e) {
        o.yVelocity += 0.3;
      } else if (o.yPos > e) {
        o.yVelocity -= 0.3;
      }
      if (o.xPos < t) {
        o.xVelocity += 0.3;
      } else if (o.xPos > t) {
        o.xVelocity -= 0.3;
      }
    }
  }
};

ParticleManager.prototype.showExplosion = function (t, e) {
  for (var i, n = 0, s = this.expolsions; n < s.length; n++)
    if ((i = s[n]).visible === false) {
      i.visible = true;
      i.x = t;
      i.y = e;
      return void i.playFrames(0, 15, 0, 0.8);
    }
  (i = new jd_1.JDImageAnim(this.scene, t, e, data_1.Atlases.gameplay, "enemyExpolison ")).hideOnComplete = true;
  this.scene.layerPlayer.add(i);
  i.playFrames(0, 15, 0, 0.8);
  this.expolsions.push(i);
};

ParticleManager.prototype.destroy = function () {
  for (var t = 0, e = this.particles; t < e.length; t++) e[t].destroy();
  for (var i = 0, n = this.particlesUI; i < n.length; i++) n[i].destroy(true);
  for (var s = 0, r = this.expolsions; s < r.length; s++) r[s].destroy();
};

var _ParticleManager = ParticleManager;

function ParticleManager() {
  return (_super !== null && _super.apply(this, arguments)) || this;
}

exports.ParticleManager = _ParticleManager;
