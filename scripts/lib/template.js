"use strict";

/* ----------------------------------------------------------------------------
 * Tiny template engine — enough features for our layouts, no dependencies.
 *
 * Supported syntax:
 *   {{ var.path }}           HTML-escaped interpolation
 *   {{{ var.path }}}         Raw (unescaped) interpolation
 *   {{> partialName }}       Partial inclusion (pre-registered)
 *   {{#if expr}}...{{/if}}
 *   {{#if expr}}...{{else}}...{{/if}}
 *   {{#unless expr}}...{{/unless}}
 *   {{#each list}}...{{/each}}          — `this`, @index, @first, @last available
 *
 * Inside #each blocks, `this` refers to the current item and `this.foo` accesses
 * its fields. Outside #each, paths are resolved against the root context.
 * -------------------------------------------------------------------------- */

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
}

function resolvePath(path, scopes) {
  if (path === "this") return scopes[scopes.length - 1];
  if (path.startsWith("this.")) {
    return getIn(scopes[scopes.length - 1], path.slice(5));
  }
  if (path.startsWith("@")) {
    const meta = scopes[scopes.length - 1];
    return meta && meta.__meta ? meta.__meta[path.slice(1)] : undefined;
  }
  for (let i = scopes.length - 1; i >= 0; i--) {
    const v = getIn(scopes[i], path);
    if (v !== undefined) return v;
  }
  return undefined;
}

function getIn(obj, path) {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  return !!v;
}

/* Tokenize a template into [{type:'text'|'expr'|'raw'|'partial'|'open'|'close'|'else', ...}] */
function tokenize(tpl) {
  const re = /\{\{\{\s*([^}]+?)\s*\}\}\}|\{\{\s*([^}]+?)\s*\}\}/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(tpl))) {
    if (m.index > last) out.push({ type: "text", value: tpl.slice(last, m.index) });
    if (m[1] !== undefined) {
      out.push({ type: "raw", value: m[1].trim() });
    } else {
      const body = m[2].trim();
      if (body.startsWith(">")) {
        out.push({ type: "partial", value: body.slice(1).trim() });
      } else if (body.startsWith("#if ")) {
        out.push({ type: "open", tag: "if", value: body.slice(4).trim() });
      } else if (body.startsWith("#unless ")) {
        out.push({ type: "open", tag: "unless", value: body.slice(8).trim() });
      } else if (body.startsWith("#each ")) {
        out.push({ type: "open", tag: "each", value: body.slice(6).trim() });
      } else if (body === "else") {
        out.push({ type: "else" });
      } else if (body.startsWith("/")) {
        out.push({ type: "close", tag: body.slice(1).trim() });
      } else {
        out.push({ type: "expr", value: body });
      }
    }
    last = m.index + m[0].length;
  }
  if (last < tpl.length) out.push({ type: "text", value: tpl.slice(last) });
  return out;
}

/* Parse tokens into a simple AST with block children */
function parse(tokens) {
  const root = { type: "root", children: [] };
  const stack = [root];
  for (const t of tokens) {
    const top = stack[stack.length - 1];
    if (t.type === "open") {
      const node = { type: "block", tag: t.tag, expr: t.value, children: [], elseChildren: null, inElse: false };
      top.children.push(node);
      stack.push(node);
    } else if (t.type === "close") {
      if (top.type !== "block" || top.tag !== t.tag) {
        throw new Error(`Mismatched closing tag {{/${t.tag}}}`);
      }
      stack.pop();
    } else if (t.type === "else") {
      if (top.type !== "block" || (top.tag !== "if" && top.tag !== "unless")) {
        throw new Error(`{{else}} outside of if/unless`);
      }
      top.inElse = true;
      top.elseChildren = [];
    } else {
      (top.inElse ? top.elseChildren : top.children).push(t);
    }
  }
  if (stack.length !== 1) throw new Error("Unclosed block in template");
  return root;
}

function render(nodeOrList, scopes, partials) {
  if (Array.isArray(nodeOrList)) {
    return nodeOrList.map((n) => renderOne(n, scopes, partials)).join("");
  }
  return nodeOrList.children.map((n) => renderOne(n, scopes, partials)).join("");
}

function renderOne(node, scopes, partials) {
  if (node.type === "text") return node.value;
  if (node.type === "expr") return escapeHtml(resolvePath(node.value, scopes));
  if (node.type === "raw") return String(resolvePath(node.value, scopes) ?? "");
  if (node.type === "partial") {
    const p = partials[node.value];
    if (!p) throw new Error(`Unknown partial: ${node.value}`);
    return render(p, scopes, partials);
  }
  if (node.type === "block") {
    const v = resolvePath(node.expr, scopes);
    if (node.tag === "if") {
      return truthy(v)
        ? render(node.children, scopes, partials)
        : (node.elseChildren ? render(node.elseChildren, scopes, partials) : "");
    }
    if (node.tag === "unless") {
      return !truthy(v)
        ? render(node.children, scopes, partials)
        : (node.elseChildren ? render(node.elseChildren, scopes, partials) : "");
    }
    if (node.tag === "each") {
      if (!Array.isArray(v) || v.length === 0) return "";
      return v
        .map((item, i) => {
          const frame =
            item && typeof item === "object" && !Array.isArray(item)
              ? { ...item }
              : { value: item };
          frame.__meta = { index: i, first: i === 0, last: i === v.length - 1 };
          return render(node.children, [...scopes, frame], partials);
        })
        .join("");
    }
  }
  return "";
}

/* Public API ---------------------------------------------------------------- */

function compile(tpl) {
  return parse(tokenize(tpl));
}

function renderTemplate(tpl, data, partials = {}) {
  const ast = compile(tpl);
  const compiledPartials = {};
  for (const [k, v] of Object.entries(partials)) compiledPartials[k] = compile(v);
  return render(ast, [data], compiledPartials);
}

module.exports = { compile, render, renderTemplate, escapeHtml };
