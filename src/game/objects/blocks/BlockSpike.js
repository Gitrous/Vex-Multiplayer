// objects/blocks/BlockSpike.js — recovered from webpack module #155 of the original vex7.min.js
"use strict";

var n,
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

exports.BlockSpike = exports.SpikeDirection = undefined;

var SpikeDirection,
  _super,
  Block_1 = require("./Block"),
  data_1 = require("../../data"),
  BalanceData_1 = require("../../system/BalanceData"),
  obstacles_1 = require("../obstacles");

(_tmp = SpikeDirection = exports.SpikeDirection || (exports.SpikeDirection = {}))[(_tmp.up = 0)] = "up";

_tmp[(_tmp.down = 1)] = "down";

_tmp[(_tmp.left = 2)] = "left";

_tmp[(_tmp.right = 3)] = "right";

_super = Block_1.Block;

__extends(BlockSpike, _super);

BlockSpike.prototype.spawn = function (t) {
  this.init(t.x, t.y, 100, 100);
  this.spikeMove = 0;
  this.isSpikeUp = t.spikeUp;
  this.startSpikeUp = t.spikeUp;
  this.timeDown = t.timeDown;
  this.timeUp = t.timeUp;
  this.actTime = this.isSpikeUp ? this.timeDown : this.timeUp;
  this.isDelay = true;
  if (t.upEnable) {
    this.enableSpike(SpikeDirection.up);
  }
  if (t.downEnable) {
    this.enableSpike(SpikeDirection.down);
  }
  if (t.leftEnable) {
    this.enableSpike(SpikeDirection.left);
  }
  if (t.rightEnable) {
    this.enableSpike(SpikeDirection.right);
  }
  t = this.isSpikeUp ? this.spikeBlockUp : this.spikeBlockDown;
  if (this.spikesUp) {
    this.spikesUp.spawn({ x: this.xPos, y: this.yPos - (49.5 + this.spikesUp.height / 2) - t, rotation: 0 });
  }
  if (this.spikesDown) {
    this.spikesDown.spawn({ x: this.xPos, y: this.yPos + (49.5 + this.spikesDown.height / 2) + t, rotation: 180 });
  }
  if (this.spikesLeft) {
    this.spikesLeft.spawn({ x: this.xPos - (49.5 + this.spikesLeft.height / 2) - t, y: this.yPos, rotation: -90 });
  }
  if (this.spikesRight) {
    this.spikesRight.spawn({ x: this.xPos + (49.5 + this.spikesRight.height / 2) + t, y: this.yPos, rotation: 90 });
  }
  this.updateGraphicPosition();
  this.sprite.setFrame(BalanceData_1.BalanceData.getBasicBlockFrame(this.main.currLevelID));
  this.sprite.setScale(this.width / this.sprite.width, this.height / this.sprite.height);
  this.sprite.visible = true;
};

BlockSpike.prototype.updateGraphicPosition = function () {
  this.sprite.x = this.xPos;
  this.sprite.y = this.yPos;
};

BlockSpike.prototype.enableSpike = function (t) {
  var e;
  if (t === SpikeDirection.up) {
    if (!this.spikesUp) {
      e = new obstacles_1.Spike10xHigh(this.main, this.main.layerObstacle);
      this.main.obstacles.push(e);
      this.spikesUp = e;
    }
  } else if (t === SpikeDirection.down) {
    if (!this.spikesDown) {
      e = new obstacles_1.Spike10xHigh(this.main, this.main.layerObstacle);
      this.main.obstacles.push(e);
      this.spikesDown = e;
    }
  } else if (t === SpikeDirection.left) {
    if (!this.spikesLeft) {
      e = new obstacles_1.Spike10xHigh(this.main, this.main.layerObstacle);
      this.main.obstacles.push(e);
      this.spikesLeft = e;
    }
  } else if (!(t !== SpikeDirection.right || this.spikesRight)) {
    e = new obstacles_1.Spike10xHigh(this.main, this.main.layerObstacle);
    this.main.obstacles.push(e);
    this.spikesRight = e;
  }
};

BlockSpike.prototype.disableSpike = function (t) {
  if (t === SpikeDirection.up) {
    this.destroySpike(this.spikesUp);
    this.spikesUp = null;
  } else if (t === SpikeDirection.down) {
    this.destroySpike(this.spikesDown);
    this.spikesDown = null;
  } else if (t === SpikeDirection.left) {
    this.destroySpike(this.spikesLeft);
    this.spikesLeft = null;
  } else if (t === SpikeDirection.right) {
    this.destroySpike(this.spikesRight);
    this.spikesRight = null;
  }
};

BlockSpike.prototype.update = function () {
  var t, e, i, n;
  if (this.isDelay) {
    this.actTime -= 0.5;
    if (this.actTime <= 0) {
      this.isDelay = false;
    }
  } else {
    t = BalanceData_1.BalanceData.config_SpikeBlockVelocity;
    this.spikeMove = this.spikeMove + t;
    n = Math.abs(this.spikeBlockDown - this.spikeBlockUp);
    if (this.spikeMove >= n) {
      t = n - (this.spikeMove - t);
      this.spikeMove = 0;
    }
    if (this.isSpikeUp) {
      t *= -1;
    }
    if (this.spikesUp) {
      e = this.spikesUp.yPos - t;
      this.spikesUp.movePosition(this.spikesUp.xPos, e);
    }
    if (this.spikesDown) {
      e = this.spikesDown.yPos + t;
      this.spikesDown.movePosition(this.spikesDown.xPos, e);
    }
    if (this.spikesLeft) {
      i = this.spikesLeft.xPos - t;
      this.spikesLeft.movePosition(i, this.spikesLeft.yPos);
    }
    if (this.spikesRight) {
      i = this.spikesRight.xPos + t;
      this.spikesRight.movePosition(i, this.spikesRight.yPos);
    }
    if (this.spikeMove === 0) {
      this.isSpikeUp = !this.isSpikeUp;
      this.isDelay = true;
      this.actTime = this.isSpikeUp ? this.timeUp : this.timeDown;
    }
    if (!(this.xPos === this.prevX && this.yPos === this.prevY)) {
      this.updatePosition();
    }
  }
};

BlockSpike.prototype.destroySpike = function (t) {
  var e;
  if (t) {
    e = this.main.obstacles.indexOf(t);
    this.main.obstacles.splice(e, 1);
    t.destroy();
  }
};

BlockSpike.prototype.destroy = function () {
  this.destroySpike(this.spikesUp);
  this.spikesUp = null;
  this.destroySpike(this.spikesDown);
  this.spikesDown = null;
  this.destroySpike(this.spikesLeft);
  this.spikesLeft = null;
  this.destroySpike(this.spikesRight);
  this.spikesRight = null;
  this.sprite.destroy();
  this.sprite = null;
  _super.prototype.destroy.call(this);
};

BlockSpike.prototype.resetLevel = function () {
  this.spikeMove = 0;
  this.isSpikeUp = this.startSpikeUp;
  var t = this.isSpikeUp ? this.spikeBlockUp : this.spikeBlockDown;
  if (this.spikesUp) {
    this.spikesUp.movePosition(this.xPos, this.yPos - (49.5 + this.spikesUp.halfHeight) - t);
  }
  if (this.spikesDown) {
    this.spikesDown.movePosition(this.xPos, this.yPos + (49.5 + this.spikesDown.halfHeight) + t);
  }
  if (this.spikesLeft) {
    this.spikesLeft.movePosition(this.xPos - (49.5 + this.spikesLeft.halfHeight) - t, this.yPos);
  }
  if (this.spikesRight) {
    this.spikesRight.movePosition(this.xPos + (49.5 + this.spikesRight.halfHeight) + t, this.yPos);
  }
};

var _tmp = BlockSpike;

function BlockSpike(t, e) {
  var i = _super.call(this, t, e) || this;
  i.spikeBlockUp = -10;
  i.spikeBlockDown = -96;
  i.sprite = new Phaser.GameObjects.Image(t, 0, 0, data_1.Atlases.gameplay);
  e.add(i.sprite);
  i.sprite.visible = false;
  i.spikesUp = null;
  i.spikesDown = null;
  i.spikesLeft = null;
  i.spikesRight = null;
  return i;
}

exports.BlockSpike = _tmp;
