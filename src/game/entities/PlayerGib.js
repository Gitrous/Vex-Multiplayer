// entities/PlayerGib.js — recovered from webpack module #149 of the original vex7.min.js
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

exports.PlayerGib = undefined;

var Particle_1 = require("../effects/Particle"),
  data_1 = require("../data");

_super = Particle_1.Particle;

__extends(PlayerGib, _super);

PlayerGib.prototype.spawn = function (t, e, i, n, s, r) {
  _super.prototype.spawnBase.call(this, t, e, i, n);
  this.rotation = s;
  this.rotSpeed = r;
  this.sprite.x = t;
  this.sprite.y = e;
  this.sprite.rotation = s;
};

PlayerGib.prototype.update = function () {
  if (this.alive) {
    if (this.fadeTime >= this.fadeAfter) {
      if (((this.sprite.alpha -= 0.1), this.sprite.alpha <= 0)) return void this.destroy();
    } else this.fadeTime++;
    var t = this.xPos,
      e = this.yPos;
    _super.prototype.update.call(this);
    if (this.alive) {
      this.rotation += this.rotSpeed;
      if (this.rotSpeed > 0) {
        this.rotSpeed -= 0.5;
      } else if (this.rotSpeed < 0) {
        this.rotSpeed += 0.5;
      }
      if (Math.abs(this.rotSpeed) < 0.6) {
        this.rotSpeed = 0;
      }
      if (!(t === this.xPos && e === this.yPos)) {
        this.sprite.x = this.xPos;
        this.sprite.y = this.yPos;
        this.sprite.rotation = this.rotation;
        this.hitBox.pos.x = this.xPos - 0.5 * this.size;
        this.hitBox.pos.y = this.yPos - 0.5 * this.size;
        this.hitBoxPolygon = this.hitBox.toPolygon();
      }
    }
  }
};

PlayerGib.prototype.destroy = function () {
  if (this.alive) {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
    _super.prototype.destroy.call(this);
  }
};

var _PlayerGib = PlayerGib;

function PlayerGib(t, e, i, n, s) {
  n = _super.call(this, t, n, s, false, 150) || this;
  n.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay, i);
  e.add(n.sprite);
  return n;
}

exports.PlayerGib = _PlayerGib;
