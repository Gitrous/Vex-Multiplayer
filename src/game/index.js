// Bundle entry point. It has no "use strict" on purpose: esbuild hoists the entry
// file's directive above the whole bundle (vendor code included), so main.js keeps
// its own directive by being an ordinary module instead.
require("./main");
