// Small HTML panel over the canvas: room code, invite link, connection status and the
// players in the room with their colour and current level.
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
  "#vexmp.min .body{display:none}";

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
      '<div class="row"><button class="rename">Cambiar nombre</button></div>' +
      '<div class="status"></div></div>';
    this.el.querySelector(".room").textContent = room;
    this.el.querySelector(".copy").onclick = () => this.copyLink();
    this.el.querySelector(".rename").onclick = () => {
      var name = window.prompt("Tu nombre (máx. 16 caracteres):", "");
      if (name) this.callbacks.rename(name);
    };
    this.el.querySelector(".toggle").onclick = () => this.el.classList.toggle("min");
    document.body.appendChild(this.el);
    this.playersEl = this.el.querySelector(".players");
    this.statusEl = this.el.querySelector(".status");
    this.setStatus("connecting");
  }

  setStatus(status) {
    this.status = status;
    this.statusEl.textContent = STATUS_TEXT[status] || status;
    this.statusEl.style.display = status === "online" ? "none" : "";
  }

  // players: [{ slot, name, level, self }]
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
      rows[i].querySelector(".lvl").textContent = levelLabel(p.level);
    });
  }

  copyLink() {
    var url = new URL(location.href);
    url.searchParams.delete("name");
    url.searchParams.set("room", this.room);
    var link = url.toString();
    var fallback = () => window.prompt("Comparte este enlace:", link);
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
