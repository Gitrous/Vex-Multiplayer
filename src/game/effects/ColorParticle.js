// effects/ColorParticle.js — recovered from webpack module #63 of the original vex7.min.js
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

exports.ColorParticle = undefined;

var Particle_1 = require("./Particle"),
  data_1 = require("../data");

_super = Particle_1.Particle;

__extends(ColorParticle, _super);

ColorParticle.prototype.spawn = function (t, e, i, n) {
  _super.prototype.spawnBase.call(this, t, e, i, n);
  this.graphics.x = t;
  this.graphics.y = e;
  this.fadeTime = 0;
};

ColorParticle.prototype.destroy = function (t) {
  if (this.alive) {
    this.graphics.destroy();
    this.graphics = null;
    this.alive = false;
    _super.prototype.destroy.call(this, t);
  }
};

ColorParticle.prototype.multAlpha = function (t) {
  this.graphics.alpha *= t;
};

ColorParticle.prototype.update = function () {
  if (this.alive !== false) {
    if (this.fadeTime >= this.fadeAfter) {
      if (((this.graphics.alpha -= 0.05), this.scaleOut && (this.graphics.scale *= 0.9), this.graphics.alpha <= 0))
        return void this.destroy(this.isUI);
    } else this.fadeTime += 1;
    var t = this.xPos,
      e = this.yPos;
    _super.prototype.update.call(this);
    if (!(!this.alive || (t === this.xPos && e === this.yPos))) {
      this.graphics.x = this.xPos;
      this.graphics.y = this.yPos;
      this.updateHitBox();
    }
  }
};

var _ColorParticle = ColorParticle;

function ColorParticle(t, e, i, n, s, r, o, a) {
  s = _super.call(this, t, n, s, r, o) || this;
  s.scaleOut = a;
  s.size = n;
  s.graphics = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, "particle" + n + " 10000");
  s.graphics.tint = i;
  e.add(s.graphics);
  s.fadeAfter = o;
  s.isUI = false;
  return s;
}

exports.ColorParticle = _ColorParticle;
