// Room chat: a box at the bottom right. Enter (or the 💬 button) opens the text field,
// Enter sends, Escape closes. While typing, the game's keyboard is switched off so WASD and
// the arrows don't move the player. Recent lines stay visible for a while, then fade; opening
// the chat shows the whole history. Messages from others also appear as a bubble over their
// character (RemotePlayer.say).
"use strict";

var protocol = require("./protocol");
var PanelManager_1 = require("../ui/panels/PanelManager");

var VISIBLE_MS = 12000; // closed chat: how long a new line stays on screen
var LOG_LINES = 50;

var CSS =
  "#vexchat{position:fixed;right:8px;bottom:8px;z-index:1000;width:min(340px,calc(100vw - 16px));" +
  "font:13px/1.35 system-ui,sans-serif;color:#fff;pointer-events:none}" +
  "#vexchat .log{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;padding:4px 0}" +
  "#vexchat .line{background:rgba(10,20,40,.72);border-radius:6px;padding:3px 8px;overflow-wrap:anywhere;" +
  "transition:opacity .6s;align-self:flex-start;max-width:100%}" +
  "#vexchat .line.old{opacity:0}#vexchat.open .line.old{opacity:1}" +
  "#vexchat .line.sys{font-style:italic;opacity:.85;background:rgba(10,20,40,.55)}" +
  "#vexchat .line.sys.old{opacity:0}#vexchat.open .line.sys.old{opacity:.85}" +
  "#vexchat .who{font-weight:600;margin-right:4px}" +
  "#vexchat .bar{display:flex;gap:6px;align-items:center;justify-content:flex-end;pointer-events:auto}" +
  "#vexchat input{display:none;flex:1;font:inherit;color:#fff;background:rgba(10,20,40,.85);border:1px solid rgba(255,255,255,.35);" +
  "border-radius:6px;padding:5px 8px;outline:none}" +
  "#vexchat.open input{display:block}#vexchat.open .log{pointer-events:auto;background:rgba(10,20,40,.35);border-radius:8px}" +
  "#vexchat button{font:inherit;color:#fff;background:rgba(10,20,40,.72);border:0;border-radius:6px;padding:4px 9px;cursor:pointer}" +
  "#vexchat button:hover{background:rgba(40,60,100,.85)}#vexchat .hint{opacity:.6;font-size:11px}#vexchat.open .hint{display:none}";

function hex(color) {
  return "#" + ("000000" + color.toString(16)).slice(-6);
}

class Chat {
  constructor(mp) {
    this.mp = mp;
    this.world = mp.world;
    this.isOpen = false;

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    this.el = document.createElement("div");
    this.el.id = "vexchat";
    this.el.innerHTML =
      '<div class="log"></div><div class="bar"><span class="hint">Enter para chatear</span>' +
      '<input type="text" autocomplete="off" placeholder="Escribe un mensaje…">' +
      '<button class="toggle" title="Chat (Enter)">💬</button></div>';
    document.body.appendChild(this.el);
    this.logEl = this.el.querySelector(".log");
    this.input = this.el.querySelector("input");
    this.input.maxLength = protocol.CHAT_MAX_LENGTH;

    var toggle = this.el.querySelector(".toggle");
    toggle.onmousedown = (ev) => ev.preventDefault(); // keep the field focused (no blur → close → reopen)
    toggle.onclick = () => (this.isOpen ? this.close() : this.open());
    this.input.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Enter") {
        this.send(this.input.value);
        this.close();
      } else if (ev.key === "Escape") {
        this.close();
      }
    });
    this.input.addEventListener("blur", () => this.close());
    // Enter anywhere in the game opens the chat (capture phase: before the game sees it).
    window.addEventListener(
      "keydown",
      (ev) => {
        var t = ev.target;
        var inField = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable === true);
        if (!this.isOpen && ev.key === "Enter" && this.mp.self && !inField && !this.gameUsesEnter()) {
          ev.preventDefault();
          this.open();
        }
      },
      true,
    );
  }

  // The "level objectives" panel that opens every act starts it with Enter (as well as the
  // arrows and space): leave Enter to the game there.
  gameUsesEnter() {
    var panels = this.world.panelManager;
    var objectives = PanelManager_1.PanelList.PanelLevelObjectives;
    return !!panels && panels.currentPanel === objectives;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.el.classList.add("open");
    // Keys typed now belong to the text field, not the game.
    this.world.keys.resetKeys();
    this.world.input.keyboard.enabled = false;
    this.input.value = "";
    this.input.focus();
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.el.classList.remove("open");
    this.world.input.keyboard.enabled = true;
    this.world.keys.resetKeys();
    if (document.activeElement === this.input) this.input.blur();
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  send(text) {
    text = protocol.sanitizeChat(text);
    if (text) this.mp.connection.send({ t: "chat", text: text });
  }

  // A chat line from the server ({ id, name, slot, text }).
  addLine(line) {
    var row = document.createElement("div");
    row.className = "line";
    var who = document.createElement("span");
    who.className = "who";
    who.textContent = line.name + ":";
    who.style.color = hex(protocol.PLAYER_COLORS[line.slot % protocol.PLAYER_COLORS.length]);
    row.appendChild(who);
    row.appendChild(document.createTextNode(line.text));
    this.append(row, line.fresh);
    var remote = this.mp.remotes.get(line.id);
    if (remote && line.fresh) remote.say(line.text);
  }

  // Joins, leaves and similar notices.
  addSystem(text) {
    var row = document.createElement("div");
    row.className = "line sys";
    row.textContent = text;
    this.append(row, true);
  }

  append(row, fresh) {
    var atBottom = this.logEl.scrollTop + this.logEl.clientHeight >= this.logEl.scrollHeight - 4;
    this.logEl.appendChild(row);
    while (this.logEl.childElementCount > LOG_LINES) this.logEl.firstChild.remove();
    if (atBottom || !this.isOpen) this.logEl.scrollTop = this.logEl.scrollHeight;
    if (!fresh) row.classList.add("old");
    else setTimeout(() => row.classList.add("old"), VISIBLE_MS);
  }

  // History sent with "welcome": shown only when the chat is opened.
  setHistory(lines) {
    this.logEl.textContent = "";
    for (var line of lines || []) this.addLine(Object.assign({}, line, { fresh: false }));
  }
}

exports.Chat = Chat;
