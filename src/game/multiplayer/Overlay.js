// HTML over the canvas: a panel with the room code, invite link, connection status and
// the players (colour, name, level or lobby/race status), plus a banner at the top centre
// for lobby/race messages, the countdown and race results.
"use strict";

var protocol = require("./protocol");
var system_1 = require("../system");

var STATUS_TEXT = {
  connecting: "Conectando…",
  online: "Conectado",
  offline: "Sin conexión con el servidor, reintentando…",
  full: "Sala llena (máximo " + protocol.MAX_PLAYERS + " jugadores)",
};

var CSS =
  "#vexmp{position:fixed;left:8px;bottom:8px;z-index:1000;font:13px/1.35 system-ui,sans-serif;color:#fff;" +
  "background:rgba(10,20,40,.72);border-radius:8px;padding:8px 10px;min-width:190px;max-width:260px;user-select:none}" +
  "#vexmp b{font-weight:600}#vexmp .row{display:flex;align-items:center;gap:6px;margin-top:3px}" +
  "#vexmp .dot{width:10px;height:10px;border-radius:50%;flex:none}#vexmp .lvl{margin-left:auto;opacity:.75;white-space:nowrap}" +
  "#vexmp .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
  "#vexmp button{font:inherit;color:#fff;background:rgba(255,255,255,.15);border:0;border-radius:5px;padding:2px 7px;cursor:pointer}" +
  "#vexmp button:hover{background:rgba(255,255,255,.28)}#vexmp .status{opacity:.8;font-size:12px;margin-top:4px}" +
  "#vexmp.min .body{display:none}" +
  "#vexmp-banner{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:1000;max-width:80vw;" +
  "font:600 18px/1.4 system-ui,sans-serif;color:#fff;background:rgba(10,20,40,.8);border-radius:10px;" +
  "padding:10px 18px;text-align:center;pointer-events:none;display:none}" +
  "#vexmp-banner.big{font-size:96px;line-height:1.1;padding:6px 40px;top:35%}" +
  "#vexmp-banner ol{margin:6px 0 0;padding:0;list-style:none;font-weight:500;text-align:left}" +
  "#vexmp-spec{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:1000;display:none;" +
  "align-items:center;gap:10px;font:600 16px/1.3 system-ui,sans-serif;color:#fff;background:rgba(10,20,40,.8);" +
  "border-radius:10px;padding:6px 8px;user-select:none}" +
  "#vexmp-spec button{font:inherit;font-size:18px;color:#fff;background:rgba(255,255,255,.15);border:0;" +
  "border-radius:6px;width:34px;height:30px;cursor:pointer}#vexmp-spec button:hover{background:rgba(255,255,255,.3)}" +
  "#vexmp-spec .dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px}";

function hex(color) {
  return "#" + ("000000" + color.toString(16)).slice(-6);
}

function levelLabel(key) {
  if (!key) return "—";
  var hard = /:h$/.test(key);
  var id = key.replace(/:h$/, "");
  var B = system_1.BalanceData;
  if (id === B.mainmenuID) return "Menú";
  if (id === B.hubID) return "Hub";
  if (id === B.towerID) return "Torre";
  if (id === B.vexID) return "Vex";
  if (/^skin/.test(id)) return "Skins";
  if (/^\d+$/.test(id)) return "Acto " + id + (hard ? " (difícil)" : "");
  return id;
}

class Overlay {
  constructor(room, callbacks) {
    this.room = room;
    this.callbacks = callbacks; // { rename(name) }
    this.status = "connecting";

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    this.el = document.createElement("div");
    this.el.id = "vexmp";
    this.el.innerHTML =
      '<div class="row"><b>Sala <span class="room"></span></b>' +
      '<button class="copy" title="Copiar enlace para invitar">Invitar</button>' +
      '<button class="toggle" title="Ocultar/mostrar">–</button></div>' +
      '<div class="body"><div class="players"></div>' +
      '<div class="row"><button class="rename">Cambiar nombre</button>' +
      '<button class="join" title="Entrar en la sala de un amigo">Unirse con código</button></div>' +
      '<div class="status"></div></div>';
    this.el.querySelector(".room").textContent = room;
    this.el.querySelector(".copy").onclick = () => this.copyLink();
    this.el.querySelector(".rename").onclick = () => {
      var name = window.prompt("Tu nombre (máx. 16 caracteres):", "");
      if (name) this.callbacks.rename(name);
    };
    this.el.querySelector(".join").onclick = () => this.joinByCode();
    this.el.querySelector(".toggle").onclick = () => this.el.classList.toggle("min");
    document.body.appendChild(this.el);
    this.banner = document.createElement("div");
    this.banner.id = "vexmp-banner";
    document.body.appendChild(this.banner);
    this.bannerKey = null;
    this.spec = document.createElement("div");
    this.spec.id = "vexmp-spec";
    this.spec.innerHTML =
      '<button class="prev" title="Anterior (←)">◀</button><span><span class="dot"></span><span class="label"></span></span>' +
      '<button class="next" title="Siguiente (→)">▶</button>';
    this.onSpectate = null; // (dir) => void, set by Spectator
    this.spec.querySelector(".prev").onclick = () => this.onSpectate && this.onSpectate(-1);
    this.spec.querySelector(".next").onclick = () => this.onSpectate && this.onSpectate(1);
    document.body.appendChild(this.spec);
    this.specKey = null;
    this.playersEl = this.el.querySelector(".players");
    this.statusEl = this.el.querySelector(".status");
    this.setStatus("connecting");
  }

  setStatus(status) {
    this.status = status;
    this.statusEl.textContent = STATUS_TEXT[status] || status;
    this.statusEl.style.display = status === "online" ? "none" : "";
  }

  // title: text or null to hide; lines: optional list under it; big: countdown style.
  setBanner(title, lines, big) {
    var key = title === null ? null : JSON.stringify([title, lines, !!big]);
    if (key === this.bannerKey) return;
    this.bannerKey = key;
    this.banner.style.display = title === null ? "none" : "block";
    this.banner.classList.toggle("big", !!big);
    this.banner.textContent = title || "";
    if (lines && lines.length) {
      var ol = document.createElement("ol");
      for (var line of lines) {
        var li = document.createElement("li");
        li.textContent = line;
        ol.appendChild(li);
      }
      this.banner.appendChild(ol);
    }
  }

  // Spectator bar: label or null to hide; canSwitch shows the arrows; color of the followed player.
  setSpectator(label, canSwitch, color) {
    var key = label === null ? null : JSON.stringify([label, !!canSwitch, color]);
    if (key === this.specKey) return;
    this.specKey = key;
    this.spec.style.display = label === null ? "none" : "flex";
    if (label === null) return;
    this.spec.querySelector(".label").textContent = label;
    var dot = this.spec.querySelector(".dot");
    dot.style.display = color === undefined ? "none" : "";
    if (color !== undefined) dot.style.background = hex(color);
    this.spec.querySelector(".prev").style.visibility = canSwitch ? "visible" : "hidden";
    this.spec.querySelector(".next").style.visibility = canSwitch ? "visible" : "hidden";
  }

  // players: [{ slot, name, level, status, self }]
  render(players) {
    var html = "";
    for (var p of players) {
      html +=
        '<div class="row"><span class="dot" style="background:' +
        hex(protocol.PLAYER_COLORS[p.slot % protocol.PLAYER_COLORS.length]) +
        '"></span><span class="name"></span><span class="lvl"></span></div>';
    }
    if (this.playersEl.childElementCount !== players.length) this.playersEl.innerHTML = html;
    var rows = this.playersEl.children;
    players.forEach(function (p, i) {
      rows[i].querySelector(".dot").style.background = hex(
        protocol.PLAYER_COLORS[p.slot % protocol.PLAYER_COLORS.length],
      );
      rows[i].querySelector(".name").textContent = p.name + (p.self ? " (tú)" : "");
      rows[i].querySelector(".lvl").textContent = p.status || levelLabel(p.level);
    });
  }

  // window.prompt rather than an <input>: the game calls preventDefault on every key.
  joinByCode() {
    var answer = window.prompt("Código de la sala (o el enlace de invitación):", "");
    if (!answer) return;
    var code = answer.trim();
    var fromLink = /[?&]room=([^&#\s]+)/.exec(code);
    code = protocol.sanitizeRoom(fromLink ? decodeURIComponent(fromLink[1]) : code);
    if (!code) {
      window.alert("Ese código no es válido: usa letras, números o guiones.");
      return;
    }
    if (code === this.room) return;
    var url = new URL(location.href);
    url.searchParams.set("room", code);
    location.href = url.toString(); // reload into the new room
  }

  copyLink() {
    var url = new URL(location.href);
    url.searchParams.delete("name");
    url.searchParams.set("room", this.room);
    var link = url.toString();
    var fallback = () => window.prompt("Comparte este enlace (o el código «" + this.room + "»):", link);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => {
        var btn = this.el.querySelector(".copy");
        btn.textContent = "¡Copiado!";
        setTimeout(() => (btn.textContent = "Invitar"), 1500);
      }, fallback);
    } else {
      fallback();
    }
  }
}

exports.Overlay = Overlay;
exports.levelLabel = levelLabel;
