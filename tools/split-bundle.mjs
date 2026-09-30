#!/usr/bin/env node
// Turns the shipped single-file build (reference/vex7.min.js) into the editable
// source tree under src/. This is a one-off recovery tool: src/ is the source of
// truth afterwards, so re-running it overwrites any edits made there.
//
//   node tools/split-bundle.mjs [input=reference/vex7.min.js] [outDir=src]
//
// Layout of the input bundle (one ExpressionStatement joined with commas):
//   function x(){...}            SAT.js (collision library), exported further down
//   !function(t,e){...}          Phaser 3.55.2 (UMD)            -> src/vendor
//   !function(t,e){...}          h5branding (Azerion splash)     -> src/vendor
//   (()=>{...})()                h5ads (Azerion ad wrapper)      -> src/vendor
//   window.SpinePlugin=...       Phaser Spine plugin (spine 3.8) -> src/vendor
//   define(x) / this.SAT=x()     SAT.js export                   -> src/vendor
//   !function(i){...}([...])     the game: webpack 4 + TypeScript -> src/game (one file per module)
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import * as t from "@babel/types";
import * as prettier from "prettier";

const traverse = _traverse.default || _traverse;
const generate = _generate.default || _generate;

const [input = "reference/vex7.min.js", outRoot = "src"] = process.argv.slice(2);
const GAME_DIR = path.join(outRoot, "game");
const VENDOR_DIR = path.join(outRoot, "vendor");
const ENTRY_ID = 76;

// Barrel modules (TypeScript index.ts files that only re-export) -> folder they stand for.
const BARREL_DIRS = {
  0: "data",
  1: "jd",
  3: "system",
  6: "ui/buttons",
  20: "objects/obstacles",
  25: "ui/hud",
  27: "render",
  29: "objects/blocks",
  32: "ui/widgets",
  51: "scenes",
  65: "entities",
  70: "skins",
  73: "objects/wires",
  111: "effects",
  123: "ui/panels",
  150: "subscenes",
  216: "objects/items",
  243: "objects/tower",
};
// Modules no barrel re-exports, placed next to the code that uses them.
const EXTRA_DIRS = {
  4: "utils",
  7: "utils",
  28: "utils",
  8: "entities",
  12: "sdk",
  52: "sdk",
  88: "sdk",
  89: "sdk",
  16: "ui/panels",
  21: "ui/panels",
  19: "subscenes",
  41: "input",
  48: "skins",
  57: "jd/input",
  103: "jd/input",
  104: "jd/input",
  58: "jd",
  64: "ui/widgets",
  75: "objects/tower",
  76: "",
  77: "lib",
  78: "lib",
  79: "lib",
  251: "lib",
  109: "scenes",
  110: "scenes",
  147: "effects",
  234: "levels",
  235: "levels",
};
// File names that can't be derived from a module's exports.
const NAME_OVERRIDES = { 77: "phaser", 78: "global", 79: "phaser-bundled.min", 8: "PlayerBase", 21: "PanelManager" };
// Kept minified: a second, bundled copy of Phaser 3.55.2 that the game actually uses.
const KEEP_MINIFIED = new Set([79]);

const src = fs.readFileSync(input, "utf8");
const ast = parse(src, { sourceType: "script" });
const [satDecl, seqStmt] = ast.program.body;
const seq = seqStmt.expression.expressions;
if (satDecl.type !== "FunctionDeclaration" || satDecl.id.name !== "x" || seq.length !== 6) {
  throw new Error("Unexpected bundle layout; this tool only understands the original vex7.min.js");
}
const slice = (n) => src.slice(n.start, n.end);

// ---------------------------------------------------------------- vendor ----
fs.rmSync(VENDOR_DIR, { recursive: true, force: true });
fs.mkdirSync(VENDOR_DIR, { recursive: true });
const vendorFiles = [
  ["01-phaser-3.55.2.min.js", slice(seq[0])],
  ["02-h5branding.min.js", slice(seq[1])],
  ["03-h5ads.min.js", slice(seq[2])],
  ["04-spine-plugin.min.js", slice(seq[3])],
  ["05-sat.min.js", slice(satDecl) + "\n" + slice(seq[4])],
];
for (const [name, code] of vendorFiles) fs.writeFileSync(path.join(VENDOR_DIR, name), code + ";\n");

// ------------------------------------------------------------ game modules ----
const gameCall = seq[5].argument;
const moduleArray = gameCall.arguments[0];
const bootstrap = slice(gameCall.callee);
if (!bootstrap.includes(`s.s=${ENTRY_ID}`)) throw new Error("Entry module is not #" + ENTRY_ID);

let modulePaths = null;
traverse(ast, {
  ArrayExpression(p) {
    if (p.node !== moduleArray) return;
    modulePaths = p.get("elements");
    p.stop();
  },
});

const isRequireCall = (ref, reqBinding) => {
  const parent = ref.parentPath;
  return (
    parent.isCallExpression() &&
    parent.node.callee === ref.node &&
    parent.node.arguments.length === 1 &&
    t.isNumericLiteral(parent.node.arguments[0]) &&
    ref.scope.getBinding(ref.node.name) === reqBinding
  );
};
const lastOfSequence = (node) => (t.isSequenceExpression(node) ? node.expressions.at(-1) : node);
const isExportsMember = (node, exportsBinding, scope) =>
  t.isMemberExpression(node) &&
  !node.computed &&
  t.isIdentifier(node.object) &&
  scope.getBinding(node.object.name) === exportsBinding;

// Pass 1: facts about every module (deps, exports, barrel-ness).
const info = modulePaths.map((fp, id) => {
  const [mParam, eParam, rParam] = fp.node.params.map((p) => p.name);
  const reqBinding = rParam && fp.scope.getBinding(rParam);
  const eBinding = eParam && fp.scope.getBinding(eParam);
  const deps = [];
  const exportNames = [];
  let getters = 0;
  let otherFns = 0;
  fp.traverse({
    CallExpression(cp) {
      const c = cp.node;
      if (reqBinding && t.isIdentifier(c.callee, { name: rParam }) && isRequireCall(cp.get("callee"), reqBinding))
        deps.push(c.arguments[0].value);
      // Object.defineProperty(exports, "X", { get() { return m.X } })  -> re-export
      if (
        t.isMemberExpression(c.callee) &&
        t.isIdentifier(c.callee.property, { name: "defineProperty" }) &&
        eBinding &&
        t.isIdentifier(c.arguments[0]) &&
        cp.scope.getBinding(c.arguments[0].name) === eBinding &&
        t.isStringLiteral(c.arguments[1]) &&
        c.arguments[1].value !== "__esModule"
      )
        exportNames.push(c.arguments[1].value);
    },
    AssignmentExpression(ap) {
      if (
        eBinding &&
        isExportsMember(ap.node.left, eBinding, ap.scope) &&
        !t.isUnaryExpression(ap.node.right, { operator: "void" })
      ) {
        exportNames.push(ap.node.left.property.name);
      }
    },
    Function(f) {
      const b = f.node.body.body;
      if (
        f.node.params.length === 0 &&
        b &&
        b.length === 1 &&
        t.isReturnStatement(b[0]) &&
        t.isMemberExpression(b[0].argument)
      )
        getters++;
      else otherFns++;
    },
  });
  const isBarrel = getters > 0 && otherFns === 0;
  return { id, fp, params: [mParam, eParam, rParam], deps, exportNames: [...new Set(exportNames)], isBarrel };
});

// Folder + file name for every module.
const dirOf = {};
for (const [barrelId, dir] of Object.entries(BARREL_DIRS)) {
  dirOf[barrelId] = dir;
  for (const dep of info[barrelId].deps) dirOf[dep] = dir;
}
Object.assign(dirOf, EXTRA_DIRS);

function primaryName(m) {
  if (NAME_OVERRIDES[m.id]) return NAME_OVERRIDES[m.id];
  if (m.isBarrel) return "index";
  // The class the module is named after: `exports.X = <function declared in this module>`.
  const fnNames = new Set(
    Object.values(m.fp.scope.bindings)
      .filter((b) => b.kind === "hoisted")
      .map((b) => b.identifier.name),
  );
  const classExports = [];
  m.fp.traverse({
    AssignmentExpression(ap) {
      const { left, right } = ap.node;
      if (!t.isMemberExpression(left) || !t.isIdentifier(left.object, { name: m.params[1] })) return;
      if (ap.scope.getBinding(m.params[1]) !== m.fp.scope.getBinding(m.params[1])) return;
      if (t.isIdentifier(right) && (fnNames.has(right.name) || right.name === m.params[2]))
        classExports.push(left.property.name);
    },
  });
  return classExports[0] || m.exportNames[0] || `module${m.id}`;
}

const fileOf = {};
const taken = new Set();
for (const m of info) {
  if (dirOf[m.id] === undefined) throw new Error(`No folder assigned to module #${m.id} (${m.exportNames.join(", ")})`);
  let rel = path.posix.join(dirOf[m.id], primaryName(m) + ".js");
  if (m.id === ENTRY_ID) rel = "main.js";
  while (taken.has(rel.toLowerCase())) rel = rel.replace(/\.js$/, `_${m.id}.js`);
  taken.add(rel.toLowerCase());
  fileOf[m.id] = rel;
}

function requireSpecifier(fromId, toId) {
  let target = fileOf[toId].replace(/\.js$/, "");
  if (path.posix.basename(target) === "index") target = path.posix.dirname(target);
  let rel = path.posix.relative(path.posix.dirname(fileOf[fromId]), target);
  if (rel === "") rel = ".";
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}
function importVarName(toId) {
  let base = fileOf[toId].replace(/\.js$/, "");
  if (path.posix.basename(base) === "index") base = path.posix.dirname(base);
  return path.posix.basename(base).replace(/[^\w$]/g, "_") + "_1"; // TypeScript's own naming convention
}

// Free identifiers of a function/program path (names used but not declared inside it).
function freeNames(p) {
  const free = new Set();
  p.traverse({
    Identifier(ip) {
      if (ip.isReferencedIdentifier() || ip.parentPath.isAssignmentExpression({ left: ip.node })) {
        if (!ip.scope.hasBinding(ip.node.name, { noGlobals: true })) free.add(ip.node.name);
      }
    },
  });
  return free;
}
// Every name that is declared somewhere inside p, or read from the global scope. A new
// name outside this set can't shadow or be captured by anything in the module.
function boundOrFreeNames(p) {
  const names = new Set(Object.keys(p.scope.bindings));
  p.traverse({
    Scopable(sp) {
      for (const n of Object.keys(sp.scope.bindings)) names.add(n);
    },
  });
  for (const n of freeNames(p)) names.add(n);
  return names;
}

// Undo the minifier's statement packing. Every rewrite here is exactly equivalent:
//   a, b;                -> a; b;
//   return a, b;         -> a; return b;
//   var x = (a, b), y;   -> a; var x = b, y;        (var hoists, evaluation order kept)
//   a && b;  a || b;     -> if (a) b;  if (!a) b;
//   a ? b : c;           -> if (a) b; else c;
//   !0 / !1 / void 0     -> true / false / undefined (when `undefined` isn't shadowed)
//   "x" === typeof y     -> typeof y === "x"        (literal operand has no side effects)
const FLIP = { "==": "==", "!=": "!=", "===": "===", "!==": "!==", "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const NEGATE = { "==": "!=", "!=": "==", "===": "!==", "!==": "===" };
const isLiteralish = (n) =>
  t.isStringLiteral(n) ||
  t.isNumericLiteral(n) ||
  t.isNullLiteral(n) ||
  t.isBooleanLiteral(n) ||
  t.isIdentifier(n, { name: "undefined" }) ||
  (t.isUnaryExpression(n) && ["void", "!", "-"].includes(n.operator) && t.isNumericLiteral(n.argument));
function negate(test) {
  if (t.isUnaryExpression(test, { operator: "!" })) return test.argument;
  if (t.isBinaryExpression(test) && NEGATE[test.operator])
    return t.binaryExpression(NEGATE[test.operator], test.left, test.right);
  return t.unaryExpression("!", test);
}
function replaceStatement(p, stmts) {
  const inStatementList =
    Array.isArray(p.container) &&
    (p.parentPath.isBlockStatement() || p.parentPath.isProgram() || p.parentPath.isSwitchCase());
  if (inStatementList) p.replaceWithMultiple(stmts);
  else p.replaceWith(t.blockStatement(stmts));
}
const exprStmt = (e) => t.expressionStatement(e);
function unminify(fileAst) {
  traverse(fileAst, {
    UnaryExpression(p) {
      const { operator, argument } = p.node;
      if (operator === "!" && t.isNumericLiteral(argument) && (argument.value === 0 || argument.value === 1)) {
        p.replaceWith(t.booleanLiteral(argument.value === 0));
      } else if (
        operator === "void" &&
        t.isNumericLiteral(argument, { value: 0 }) &&
        !p.scope.hasBinding("undefined", { noGlobals: true })
      ) {
        p.replaceWith(t.identifier("undefined"));
      }
    },
    BinaryExpression(p) {
      const { operator, left, right } = p.node;
      if (FLIP[operator] && isLiteralish(left) && !isLiteralish(right)) {
        p.replaceWith(t.binaryExpression(FLIP[operator], right, left));
      }
    },
    ExpressionStatement(p) {
      const e = p.node.expression;
      if (t.isSequenceExpression(e)) {
        replaceStatement(p, e.expressions.map(exprStmt));
      } else if (t.isLogicalExpression(e) && (e.operator === "&&" || e.operator === "||")) {
        const test = e.operator === "&&" ? e.left : negate(e.left);
        replaceStatement(p, [t.ifStatement(test, t.blockStatement([exprStmt(e.right)]))]);
      } else if (t.isConditionalExpression(e)) {
        const toIf = (c) =>
          t.ifStatement(
            c.test,
            t.blockStatement([exprStmt(c.consequent)]),
            t.isConditionalExpression(c.alternate) ? toIf(c.alternate) : t.blockStatement([exprStmt(c.alternate)]),
          );
        replaceStatement(p, [toIf(e)]);
      }
    },
    IfStatement: {
      exit(p) {
        // else { if (...) ... }  ->  else if (...) ...
        const alt = p.node.alternate;
        if (
          t.isBlockStatement(alt) &&
          alt.body.length === 1 &&
          t.isIfStatement(alt.body[0]) &&
          !alt.directives?.length
        ) {
          p.get("alternate").replaceWith(alt.body[0]);
        }
      },
    },
    ReturnStatement(p) {
      const a = p.node.argument;
      if (t.isSequenceExpression(a)) {
        replaceStatement(p, [...a.expressions.slice(0, -1).map(exprStmt), t.returnStatement(a.expressions.at(-1))]);
      }
    },
    VariableDeclaration(p) {
      if (p.node.kind !== "var" || !Array.isArray(p.container)) return;
      if (!(p.parentPath.isBlockStatement() || p.parentPath.isProgram() || p.parentPath.isSwitchCase())) return;
      const decls = p.node.declarations;
      const k = decls.findIndex((d) => t.isSequenceExpression(d.init));
      if (k < 0) return;
      const seqExprs = decls[k].init.expressions;
      const out = [];
      if (k > 0) out.push(t.variableDeclaration("var", decls.slice(0, k)));
      out.push(...seqExprs.slice(0, -1).map(exprStmt));
      out.push(
        t.variableDeclaration("var", [t.variableDeclarator(decls[k].id, seqExprs.at(-1)), ...decls.slice(k + 1)]),
      );
      p.replaceWithMultiple(out);
    },
  });
}

// Pass 2: rewrite each module into a standalone CommonJS file.
const outputs = [];
for (const m of info) {
  const { fp } = m;
  const [mParam, eParam, rParam] = m.params;
  const freeBefore = freeNames(fp);
  const used = boundOrFreeNames(fp);
  const fresh = (want) => {
    let name = want;
    for (let n = 2; used.has(name) || ["module", "exports", "require"].includes(name); n++) name = `${want}${n}`;
    used.add(name);
    return name;
  };
  for (const reserved of ["module", "exports", "require"]) {
    if (used.has(reserved)) throw new Error(`Module #${m.id} already uses the name "${reserved}"`);
  }

  // require(<id>) -> require("<relative path>"), and split the minifier's reuse of the
  // require parameter as a scratch variable into its own binding.
  if (rParam) {
    const reqBinding = fp.scope.getBinding(rParam);
    for (const ref of [...reqBinding.referencePaths]) {
      if (!isRequireCall(ref, reqBinding)) continue;
      const call = ref.parentPath;
      const depId = call.node.arguments[0].value;
      call.replaceWith(t.callExpression(t.identifier("require"), [t.stringLiteral(requireSpecifier(m.id, depId))]));
    }
    fp.scope.crawl();
  }

  const renames = []; // [binding name, new name]
  // Imports: `var a = require("../data")` (optionally after a comma sequence) -> data_1.
  for (const [name, binding] of Object.entries(fp.scope.bindings)) {
    if (binding.kind !== "var" || binding.constantViolations.length) continue;
    const decl = binding.path.node;
    if (!t.isVariableDeclarator(decl) || !decl.init) continue;
    const last = lastOfSequence(decl.init);
    if (
      !t.isCallExpression(last) ||
      !t.isIdentifier(last.callee, { name: "require" }) ||
      !t.isStringLiteral(last.arguments[0])
    )
      continue;
    const depSpec = last.arguments[0].value;
    const depId = m.deps.find((d) => requireSpecifier(m.id, d) === depSpec);
    renames.push([name, fresh(importVarName(depId))]);
  }
  // TypeScript helpers: `r = (this && this.__extends) || ...` -> __extends.
  let extendsName = null;
  for (const [name, binding] of Object.entries(fp.scope.bindings)) {
    const decl = binding.path.node;
    if (!t.isVariableDeclarator(decl) || !t.isLogicalExpression(decl.init, { operator: "||" })) continue;
    const left = decl.init.left;
    if (
      t.isLogicalExpression(left, { operator: "&&" }) &&
      t.isThisExpression(left.left) &&
      t.isMemberExpression(left.right) &&
      t.isIdentifier(left.right.property) &&
      left.right.property.name.startsWith("__")
    ) {
      const helper = fresh(left.right.property.name);
      renames.push([name, helper]);
      if (left.right.property.name === "__extends") extendsName = name;
    }
  }
  // Classes: function declarations exported as exports.X, and the `_super` of __extends(X, _super).
  const classRenames = new Map();
  fp.traverse({
    AssignmentExpression(ap) {
      const { left, right } = ap.node;
      if (!t.isMemberExpression(left) || left.computed || !t.isIdentifier(left.object, { name: eParam })) return;
      if (ap.scope.getBinding(eParam) !== fp.scope.getBinding(eParam)) return;
      let fnId = null;
      if (t.isIdentifier(right)) {
        const b = fp.scope.getBinding(right.name);
        if (b && b.kind === "hoisted" && ap.scope.getBinding(right.name) === b) fnId = right.name;
        else if (b && right.name === rParam) {
          // exports.X = i where i = ( ..., X.prototype..., FnDecl )
          for (const v of b.constantViolations) {
            const val = v.isAssignmentExpression() ? v.node.right : v.isVariableDeclarator() ? v.node.init : null;
            const tail = val && lastOfSequence(val);
            if (t.isIdentifier(tail) && fp.scope.getBinding(tail.name)?.kind === "hoisted") fnId = tail.name;
          }
        }
      }
      if (fnId && !classRenames.has(fnId)) classRenames.set(fnId, left.property.name);
    },
    CallExpression(cp) {
      if (!extendsName || !t.isIdentifier(cp.node.callee, { name: extendsName }) || cp.node.arguments.length !== 2)
        return;
      const sup = cp.node.arguments[1];
      if (!t.isIdentifier(sup)) return;
      const b = fp.scope.getBinding(sup.name);
      if (
        b &&
        b.scope === fp.scope &&
        b.kind === "var" &&
        b.constantViolations.length === 1 &&
        !renames.some(([n]) => n === sup.name) &&
        !classRenames.has("super:" + sup.name)
      ) {
        classRenames.set("super:" + sup.name, "_super");
      }
    },
  });
  for (const [from, to] of classRenames) renames.push([from.replace(/^super:/, ""), fresh(to)]);

  // Enums: `o = exports.X || (exports.X = {})` -> X.
  for (const [name, binding] of Object.entries(fp.scope.bindings)) {
    if (binding.kind !== "var" || binding.constantViolations.length !== 1 || renames.some(([n]) => n === name))
      continue;
    const v = binding.constantViolations[0].node;
    if (!t.isAssignmentExpression(v) || !t.isLogicalExpression(v.right, { operator: "||" })) continue;
    const l = v.right.left;
    if (isExportsMember(l, fp.scope.getBinding(eParam), fp.scope)) renames.push([name, fresh(l.property.name)]);
  }

  // Whatever is left of the require parameter is a scratch variable.
  const scratch = rParam && fp.scope.getBinding(rParam);
  if (scratch && (scratch.referenced || scratch.constantViolations.length)) {
    const exported = classRenames.size ? [...classRenames.values()].find((v) => v !== "_super") : null;
    renames.push([rParam, fresh(exported && scratch.constantViolations.length === 1 ? `_${exported}` : "_tmp")]);
  }
  if (mParam) renames.push([mParam, "module"]);
  if (eParam) renames.push([eParam, "exports"]);

  for (const [from, to] of renames) fp.scope.rename(from, to);

  // Unwrap the function body into a program.
  const body = fp.node.body;
  const program = t.program(body.body, body.directives, "script");
  const file = t.file(program);
  const reparse = (node) => parse(generate(node, { compact: true }).code, { sourceType: "script" });
  let tmpAst = reparse(file);
  if (!KEEP_MINIFIED.has(m.id)) {
    unminify(tmpAst);
    tmpAst = reparse(tmpAst);
  }

  // Undeclared scratch variables (the old parameter was their declaration) need a `var`.
  let freeAfter = null;
  traverse(tmpAst, {
    Program(pp) {
      freeAfter = freeNames(pp);
      const newVars = [...freeAfter].filter(
        (n) => !freeBefore.has(n) && !["module", "exports", "require", "undefined"].includes(n),
      );
      if (newVars.length) {
        pp.unshiftContainer(
          "body",
          t.variableDeclaration(
            "var",
            newVars.map((n) => t.variableDeclarator(t.identifier(n))),
          ),
        );
        // keep "use strict" first: directives live separately from body, so this is safe
        pp.scope.crawl();
        freeAfter = freeNames(pp);
      }
      pp.stop();
    },
  });
  // Safety net: renaming must not have changed which globals the module touches.
  const expected = new Set([...freeBefore, "undefined"]);
  const actual = new Set([...freeAfter, "undefined"].filter((n) => !["module", "exports", "require"].includes(n)));
  const diff = [...new Set([...expected, ...actual])].filter((n) => expected.has(n) !== actual.has(n));
  if (diff.length) throw new Error(`Module #${m.id}: free identifiers changed: ${diff.join(", ")}`);

  const header = `// ${fileOf[m.id]} — recovered from webpack module #${m.id} of the original vex7.min.js\n`;
  let code;
  if (KEEP_MINIFIED.has(m.id)) {
    code = header + generate(tmpAst, { minified: true }).code + "\n";
  } else {
    // Compact per-statement output lets prettier choose the layout; the blank lines
    // between top-level statements (methods, imports, ...) are what it keeps.
    const { directives, body: stmts } = tmpAst.program;
    const raw = [
      ...directives.map((d) => generate(d).code),
      ...stmts.map((s) => generate(s, { compact: true }).code),
    ].join("\n\n");
    code = header + (await prettier.format(raw, { parser: "babel", printWidth: 120 }));
  }
  outputs.push([fileOf[m.id], code]);
}

outputs.push([
  "index.js",
  `// Bundle entry point. It has no "use strict" on purpose: esbuild hoists the entry
// file's directive above the whole bundle (vendor code included), so main.js keeps
// its own directive by being an ordinary module instead.
require("./${fileOf[ENTRY_ID].replace(/\.js$/, "")}");
`,
]);

fs.rmSync(GAME_DIR, { recursive: true, force: true });
for (const [rel, code] of outputs) {
  const dest = path.join(GAME_DIR, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, code);
}

const manifest = Object.fromEntries(info.map((m) => [m.id, { file: fileOf[m.id], exports: m.exportNames }]));
fs.writeFileSync(path.join(outRoot, "module-map.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`vendor: ${vendorFiles.length} files, game: ${info.length} modules -> ${outRoot}/`);
