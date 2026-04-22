#!/usr/bin/env node
"use strict";

/* Portfolio build orchestrator.
 *
 *   1. Collect structured content from /content (markdown + frontmatter).
 *   2. Render section HTML.
 *   3. Render templates in /src, replacing `{{> partial }}` and
 *      `<!-- inject:NAME -->` regions.
 *   4. Copy static assets (styles, scripts, assets, terminal, daw, CNAME).
 *   5. Emit /dist.
 */

const fs = require("fs");
const path = require("path");

const { collectAll, ROOT } = require("./lib/collect");
const { renderTemplate, escapeHtml } = require("./lib/template");
const S = require("./lib/sections");

const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

/* ---------- fs helpers ---------- */
function rimraf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, s) { mkdirp(path.dirname(p)); fs.writeFileSync(p, s); }

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
}

/* ---------- inject markers ---------- */
function injectRegion(html, name, replacement) {
  const re = new RegExp(
    `<!--\\s*inject:${name}\\s*-->[\\s\\S]*?<!--\\s*/inject:${name}\\s*-->`,
    "g"
  );
  return html.replace(re, replacement || "");
}

/* ---------- partials ---------- */
function loadPartials() {
  const dir = path.join(SRC, "partials");
  const partials = {};
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".html")) partials[path.basename(f, ".html")] = read(path.join(dir, f));
  }
  return partials;
}

/* ---------- main ---------- */
function build() {
  console.log("▸ Collecting content...");
  const data = collectAll();
  const partials = loadPartials();

  const baseCtx = { site: data.site, year: new Date().getFullYear() };

  rimraf(DIST);
  mkdirp(DIST);

  /* ----- static assets ----- */
  console.log("▸ Copying static assets...");
  copyDir(path.join(SRC, "styles"), path.join(DIST, "styles"));
  copyDir(path.join(SRC, "scripts"), path.join(DIST, "scripts"));
  copyDir(path.join(SRC, "assets"), path.join(DIST, "assets"));
  copyIfExists(path.join(ROOT, "CNAME"), path.join(DIST, "CNAME"));
  copyIfExists(path.join(ROOT, ".nojekyll"), path.join(DIST, ".nojekyll"));

  /* ----- landing page ----- */
  console.log("▸ Rendering landing page...");
  {
    const tpl = read(path.join(SRC, "index.html"));
    let html = renderTemplate(tpl, baseCtx, partials);
    html = injectRegion(html, "about", S.renderAbout(data.about));
    html = injectRegion(html, "news", S.renderNews(data.news));
    html = injectRegion(html, "experience", S.renderExperience(data.experience));
    html = injectRegion(html, "education", S.renderEducation(data.education));
    html = injectRegion(html, "projects", S.renderProjects(data.projects));
    html = injectRegion(html, "publications", S.renderPublications(data.publications));
    html = injectRegion(html, "certifications", S.renderCertifications(data.certifications));
    html = injectRegion(html, "skills", S.renderSkills(data.skills));
    html = injectRegion(html, "blogs-preview", S.renderBlogsPreview(data.blogs, 3));
    write(path.join(DIST, "index.html"), html);
  }

  /* ----- blogs index ----- */
  console.log("▸ Rendering blogs index...");
  {
    const tpl = read(path.join(SRC, "blogs", "index.html"));
    let html = renderTemplate(tpl, baseCtx, partials);
    html = injectRegion(html, "blogs-list", S.renderBlogsList(data.blogs));
    write(path.join(DIST, "blogs", "index.html"), html);
  }

  /* ----- individual blog posts ----- */
  console.log(`▸ Rendering ${data.blogs.length} blog post(s)...`);
  {
    const tpl = read(path.join(SRC, "blogs", "post.html"));
    for (const post of data.blogs) {
      const ctx = {
        ...baseCtx,
        post: {
          title: post.title,
          date: post.date,
          dateFormatted: S.fmtDate(post.date),
          summary: post.summary,
          tags: post.tags || [],
          html: post.html,
        },
      };
      let html = renderTemplate(tpl, ctx, partials);
      html = injectRegion(html, "post-body", post.html || "");
      html = injectRegion(
        html,
        "post-tags",
        (post.tags || []).length
          ? `<div class="chips">${post.tags.map((t) => `<span class="chip chip-outline">${escapeHtml(t)}</span>`).join("")}</div>`
          : ""
      );
      write(path.join(DIST, "blogs", post.slug, "index.html"), html);
    }
  }

  /* ----- terminal page ----- */
  console.log("▸ Rendering terminal page...");
  {
    const tpl = read(path.join(SRC, "terminal", "index.html"));
    const html = renderTemplate(tpl, baseCtx, partials);
    write(path.join(DIST, "terminal", "index.html"), html);
    for (const f of ["terminal.css", "terminal.js", "text.js", "caret.js", "interacth.js", "main.js"]) {
      const src = path.join(SRC, "terminal", f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, "terminal", f));
    }
  }

  /* ----- DAW page ----- */
  console.log("▸ Rendering DAW page...");
  {
    const srcDir = path.join(SRC, "daw");
    if (fs.existsSync(srcDir)) {
      const distDir = path.join(DIST, "daw");
      mkdirp(distDir);
      // Render index.html through the template engine (for the nav partial)
      const indexPath = path.join(srcDir, "index.html");
      if (fs.existsSync(indexPath)) {
        const tpl = read(indexPath);
        const html = renderTemplate(tpl, baseCtx, partials);
        write(path.join(distDir, "index.html"), html);
      }
      // Copy every other file verbatim.
      for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
        if (entry.name === "index.html") continue;
        const s = path.join(srcDir, entry.name);
        const d = path.join(distDir, entry.name);
        if (entry.isDirectory()) copyDir(s, d);
        else fs.copyFileSync(s, d);
      }
    }
  }

  /* ----- search index ----- */
  const searchIndex = [
    ...data.blogs.map((b) => ({ type: "blog", title: b.title, url: `/blogs/${b.slug}/`, summary: b.summary })),
    ...data.projects.map((p) => ({ type: "project", title: p.name, url: p.url || "", summary: p.summary })),
    ...data.publications.map((p) => ({ type: "publication", title: p.title, url: (p.links && p.links[0] && p.links[0].href) || "", summary: p.venue })),
  ];
  write(path.join(DIST, "search-index.json"), JSON.stringify(searchIndex, null, 2));

  console.log(`✓ Built to ${path.relative(ROOT, DIST)}`);
}

try {
  build();
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
}
