#!/usr/bin/env node
// Builds the playable bundle from src/:
//   src/vendor/*.js  (plain scripts, concatenated in file-name order)
//   src/game/index.js (CommonJS tree, bundled by esbuild)
//
//   node tools/build.mjs            -> dist/vex7.js (readable) + dist/vex7.js.map
//   node tools/build.mjs --release  -> dist/vex7.js (minified) + dist/vex7.js.map
//   node tools/build.mjs --watch    -> readable build, rebuilt whenever src/ changes
//   node tools/build.mjs --serve    -> --watch + the multiplayer server (server/server.mjs) on $PORT (default 8080)
import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = new Set(process.argv.slice(2));
const release = args.has("--release");
const watch = args.has("--watch");
const serve = args.has("--serve");
const outfile = path.join(root, "dist", "vex7.js");
const vendorDir = path.join(root, "src", "vendor");

function vendorBanner() {
  return fs
    .readdirSync(vendorDir)
    .filter((f) => f.endsWith(".js"))
    .sort()
    .map((f) => fs.readFileSync(path.join(vendorDir, f), "utf8").trimEnd())
    .join("\n");
}

const options = {
  entryPoints: [path.join(root, "src", "game", "index.js")],
  outfile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2017",
  // Vendor libraries are already minified and must run as plain top-level scripts
  // before the game (they install window.Phaser, window.SpinePlugin, h5branding, ...).
  banner: { js: vendorBanner() },
  minify: release,
  sourcemap: true,
  legalComments: "none",
  logLevel: "info",
};

if (watch || serve) {
  // Vendor files are read once here: restart after changing src/vendor/.
  const ctx = await esbuild.context(options);
  await ctx.watch();
  if (serve) {
    // The multiplayer server also serves the repo's static files.
    const { startServer, lanUrls } = await import("../server/server.mjs");
    const port = await startServer({ port: Number(process.env.PORT) || 8080, host: process.env.HOST }).ready;
    console.log(`serving ${lanUrls(port).join("  ")} (rebuilds on save; reload the page to see changes)`);
  } else {
    console.log("watching src/ ...");
  }
} else {
  await esbuild.build(options);
}
