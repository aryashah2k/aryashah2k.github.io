"use strict";

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = path.resolve(__dirname, "..", "..");
const CONTENT = path.join(ROOT, "content");

marked.setOptions({ mangle: false, headerIds: true, breaks: false, gfm: true });

function readMd(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return {
    data: parsed.data || {},
    body: parsed.content || "",
    html: parsed.content ? marked.parse(parsed.content) : "",
  };
}

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => ({ file: f, slug: f.replace(/\.md$/, ""), full: path.join(dir, f) }));
}

function sortByDateDesc(arr, key = "date") {
  return arr.slice().sort((a, b) => {
    const da = a[key] ? new Date(a[key]).getTime() : 0;
    const db = b[key] ? new Date(b[key]).getTime() : 0;
    return db - da;
  });
}

function sortByStartDesc(arr) {
  return arr.slice().sort((a, b) => {
    const da = a.end ? new Date(a.end).getTime() : a.start ? new Date(a.start).getTime() : 0;
    const db = b.end ? new Date(b.end).getTime() : b.start ? new Date(b.start).getTime() : 0;
    return db - da;
  });
}

/* ---- Section collectors ---- */

function collectSite() {
  const p = path.join(CONTENT, "site.md");
  if (!fs.existsSync(p)) throw new Error("Missing content/site.md");
  const { data, html } = readMd(p);
  return { ...data, intro: html };
}

function collectSingle(name) {
  const p = path.join(CONTENT, `${name}.md`);
  if (!fs.existsSync(p)) return { data: {}, html: "" };
  return readMd(p);
}

function collectList(folder, mapper) {
  const dir = path.join(CONTENT, folder);
  const files = listMd(dir);
  return files.map((f) => {
    const { data, body, html } = readMd(f.full);
    return mapper({ slug: f.slug, body, html, ...data });
  });
}

function collectExperience() {
  return sortByStartDesc(
    collectList("experience", (x) => ({
      role: x.role || "",
      org: x.org || "",
      location: x.location || "",
      start: x.start || "",
      end: x.end || "",
      tags: x.tags || [],
      description: x.html,
      slug: x.slug,
    }))
  );
}

function collectEducation() {
  return sortByStartDesc(
    collectList("education", (x) => ({
      degree: x.degree || x.role || "",
      school: x.school || x.org || "",
      location: x.location || "",
      start: x.start || "",
      end: x.end || "",
      description: x.html,
      slug: x.slug,
    }))
  );
}

function collectProjects() {
  return sortByDateDesc(
    collectList("projects", (x) => ({
      name: x.name || x.title || x.slug,
      url: x.url || "",
      repo: x.repo || "",
      tags: x.tags || [],
      date: x.date || "",
      summary: x.summary || "",
      description: x.html,
      slug: x.slug,
    }))
  );
}

function collectPublications() {
  return sortByDateDesc(
    collectList("publications", (x) => ({
      title: x.title || x.slug,
      authors: x.authors || "",
      venue: x.venue || "",
      date: x.date || x.year || "",
      year: x.year || "",
      links: x.links || [],
      description: x.html,
      slug: x.slug,
    }))
  );
}

function collectCertifications() {
  return sortByDateDesc(
    collectList("certifications", (x) => ({
      title: x.title || x.slug,
      code: x.code || "",
      issuer: x.issuer || "",
      url: x.url || "",
      date: x.date || "",
      description: x.html,
      slug: x.slug,
    }))
  );
}

function collectNews() {
  const { data } = collectSingle("news");
  const items = Array.isArray(data.items) ? data.items : [];
  return sortByDateDesc(
    items.map((n) => ({
      date: n.date || "",
      label: n.label || n.date || "",
      html: n.html || marked.parseInline(n.text || ""),
    }))
  );
}

function collectSkills() {
  const { data } = collectSingle("skills");
  return Array.isArray(data.categories) ? data.categories : [];
}

function collectAbout() {
  const { html } = collectSingle("about");
  return html;
}

function collectBlogs() {
  return sortByDateDesc(
    collectList("blogs", (x) => ({
      slug: x.slug,
      title: x.title || x.slug,
      date: x.date || "",
      summary: x.summary || "",
      tags: x.tags || [],
      cover: x.cover || "",
      html: x.html,
    }))
  );
}

function collectAll() {
  return {
    site: collectSite(),
    about: collectAbout(),
    news: collectNews(),
    experience: collectExperience(),
    education: collectEducation(),
    projects: collectProjects(),
    publications: collectPublications(),
    certifications: collectCertifications(),
    skills: collectSkills(),
    blogs: collectBlogs(),
  };
}

module.exports = { collectAll, ROOT, CONTENT };
