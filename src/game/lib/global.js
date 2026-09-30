// lib/global.js — recovered from webpack module #78 of the original vex7.min.js
var i = (function () {
  return this;
})();

try {
  i = i || new Function("return this")();
} catch (t) {
  if (typeof window == "object") {
    i = window;
  }
}

module.exports = i;
