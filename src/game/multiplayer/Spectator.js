// Spectating: after reaching the finish, while the others are still racing, the camera
// follows another player's ghost instead of the (frozen) local player. ←/→ (or A/D) and
// the arrows in the spectator bar switch between the players visible in the level.
"use strict";

var CAMERA_EASE = 0.125; // same as WorldCreator.cameraLogic

class Spectator {
  constructor(mp) {
    this.mp = mp;
    this.world = mp.world;
    this.active = false;
    this.targetId = null;
    this.manual = false; // the player picked the target with ←/→
    this.world.input.keyboard.on("keydown", (ev) => {
      if (!this.active) return;
      var K = Phaser.Input.Keyboard.KeyCodes;
      if (ev.keyCode === K.LEFT || ev.keyCode === K.A) this.cycle(-1);
      else if (ev.keyCode === K.RIGHT || ev.keyCode === K.D) this.cycle(1);
    });
    mp.overlay.onSpectate = (dir) => this.cycle(dir);
  }

  // Remote players drawn in this level, in slot order.
  candidates() {
    return [...this.mp.remotes.values()].filter((r) => r.container.visible).sort((a, b) => a.slot - b.slot);
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.targetId = null;
    this.manual = false;
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    this.targetId = null;
    this.mp.overlay.setSpectator(null);
    if (this.world.player) this.world.setCameraOnPlayer();
  }

  cycle(dir) {
    var list = this.candidates();
    if (!list.length) return;
    var i = list.findIndex((r) => r.id === this.targetId);
    i = i < 0 ? 0 : (i + dir + list.length) % list.length;
    this.targetId = list[i].id;
    this.manual = true;
  }

  // isRacing(id): still running (preferred when picking a target automatically).
  update(isRacing) {
    if (!this.active) return;
    var list = this.candidates();
    var target = list.find((r) => r.id === this.targetId);
    // Picked automatically and no longer racing (finished or quit): move on to someone who is.
    if (target && !this.manual && !isRacing(target.id) && list.some((r) => isRacing(r.id))) target = null;
    if (!target) {
      target = list.find((r) => isRacing(r.id)) || list[0] || null;
      this.targetId = target ? target.id : null;
    }
    if (!target) {
      this.mp.overlay.setSpectator("Nadie a quien seguir", false);
      return;
    }
    var w = this.world;
    w.cameraX += (target.container.x - w.cameraX) * CAMERA_EASE;
    w.cameraY += (target.container.y - w.cameraY) * CAMERA_EASE;
    w.updateParallax();
    this.mp.overlay.setSpectator(
      "Viendo a " + target.name + (isRacing(target.id) ? " (corriendo)" : " (en meta)"),
      list.length > 1,
      target.color,
    );
  }
}

exports.Spectator = Spectator;
