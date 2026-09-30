// WebSocket to the multiplayer server. Sends "hello" on every (re)connect and retries
// with backoff until the room answers "full".
"use strict";

var protocol = require("./protocol");

class Connection {
  constructor(url, handlers) {
    this.url = url;
    this.handlers = handlers; // { hello(): msg, onStatus(status), onMessage(msg) }
    this.ws = null;
    this.retryMs = 1000;
    this.stopped = false;
    this.connect();
  }

  connect() {
    if (this.stopped) return;
    this.handlers.onStatus("connecting");
    var ws;
    try {
      ws = new WebSocket(this.url);
    } catch (e) {
      this.scheduleRetry();
      return;
    }
    this.ws = ws;
    ws.onopen = () => {
      this.retryMs = 1000;
      ws.send(JSON.stringify(this.handlers.hello()));
    };
    ws.onmessage = (ev) => {
      var msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        return;
      }
      this.handlers.onMessage(msg);
    };
    ws.onclose = (ev) => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (ev.code === protocol.CLOSE_ROOM_FULL) {
        this.stopped = true;
        this.handlers.onStatus("full");
        return;
      }
      this.handlers.onStatus("offline");
      this.scheduleRetry();
    };
  }

  scheduleRetry() {
    if (this.stopped) return;
    setTimeout(() => this.connect(), this.retryMs);
    this.retryMs = Math.min(this.retryMs * 2, 10000);
  }

  get open() {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  send(msg) {
    if (this.open) this.ws.send(JSON.stringify(msg));
  }
}

exports.Connection = Connection;
