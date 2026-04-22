"use strict";

/* -------------------------------------------------------------------------
 * Section renderers — turn structured content into the exact HTML that the
 * landing page injects between `<!-- inject:FOO -->` / `<!-- /inject:FOO -->`
 * markers. Every renderer returns a string of trusted HTML.
 * ----------------------------------------------------------------------- */

const { escapeHtml } = require("./template");

function fmtDate(s) {
  if (!s) return "";
  // Accept YYYY, YYYY-MM, YYYY-MM-DD, or full ISO.
  if (/^\d{4}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split("-");
    const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m - 1] || "";
    return `${mo} ${y}`;
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return escapeHtml(s);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function range(start, end) {
  const left = fmtDate(start);
  const right = end ? fmtDate(end) : "Present";
  if (!left && !end) return "";
  if (!left) return right;
  return `${left} – ${right}`;
}

/* ---- About ---- */
function renderAbout(html) {
  return html || "";
}

/* ---- News ---- */
function renderNews(items) {
  if (!items.length) return "<p class='text-muted'>No news yet.</p>";
  const li = items
    .map(
      (n) => `
      <li>
        <span class="news-date">${escapeHtml(n.label || fmtDate(n.date))}</span>
        <div class="news-content">${n.html}</div>
      </li>`
    )
    .join("");
  return `<ul class="news-list">${li}</ul>`;
}

/* ---- Experience ---- */
function renderExperience(items) {
  if (!items.length) return "<p class='text-muted'>Coming soon.</p>";
  return items
    .map(
      (x) => `
      <article class="timeline-row">
        <div class="when">${escapeHtml(range(x.start, x.end))}</div>
        <div>
          <h3>${escapeHtml(x.role)}</h3>
          <div class="org">${escapeHtml(x.org)}${x.location ? ` · ${escapeHtml(x.location)}` : ""}</div>
          <div>${x.description || ""}</div>
          ${renderChips(x.tags)}
        </div>
      </article>`
    )
    .join("");
}

/* ---- Education ---- */
function renderEducation(items) {
  if (!items.length) return "<p class='text-muted'>Coming soon.</p>";
  return items
    .map(
      (x) => `
      <article class="timeline-row">
        <div class="when">${escapeHtml(range(x.start, x.end))}</div>
        <div>
          <h3>${escapeHtml(x.degree)}</h3>
          <div class="org">${escapeHtml(x.school)}${x.location ? ` · ${escapeHtml(x.location)}` : ""}</div>
          <div>${x.description || ""}</div>
        </div>
      </article>`
    )
    .join("");
}

/* ---- Projects ---- */
function renderProjects(items) {
  if (!items.length) return "<p class='text-muted'>Coming soon.</p>";
  const cards = items
    .map((p) => {
      const title = p.url
        ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.name)}</a>`
        : escapeHtml(p.name);
      return `
        <article class="card">
          <h3>${title}</h3>
          ${p.summary ? `<p>${escapeHtml(p.summary)}</p>` : p.description || ""}
          ${renderChips(p.tags)}
        </article>`;
    })
    .join("");
  return `<div class="grid-cards">${cards}</div>`;
}

/* ---- Publications ---- */
function renderPublications(items) {
  if (!items.length) return "<p class='text-muted'>Coming soon.</p>";
  return `<div class="pub-list">${items
    .map((p) => {
      const links = (p.links || [])
        .map((l) => `<a href="${escapeHtml(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`)
        .join("");
      return `
        <article class="pub">
          <div class="pub-title">${
            p.links && p.links[0]
              ? `<a href="${escapeHtml(p.links[0].href)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>`
              : escapeHtml(p.title)
          }</div>
          <div class="pub-meta">${escapeHtml(p.authors)}${p.venue ? ` · <em>${escapeHtml(p.venue)}</em>` : ""}${p.year || p.date ? ` · ${escapeHtml(p.year || fmtDate(p.date))}` : ""}</div>
          ${links ? `<div class="pub-links">${links}</div>` : ""}
        </article>`;
    })
    .join("")}</div>`;
}

/* ---- Certifications ---- */
function renderCertifications(items) {
  if (!items.length) return "<p class='text-muted'>Coming soon.</p>";
  const li = items
    .map((c) => {
      const label = c.url
        ? `<a href="${escapeHtml(c.url)}" target="_blank" rel="noopener">${escapeHtml(c.title)}</a>`
        : escapeHtml(c.title);
      return `<li>
        ${c.code ? `<span class="cert-code">${escapeHtml(c.code)}</span>` : ""}
        <span>${label}</span>
        ${c.issuer ? `<span class="text-muted">${escapeHtml(c.issuer)}</span>` : ""}
      </li>`;
    })
    .join("");
  return `<ul class="cert-list">${li}</ul>`;
}

/* ---- Skills (recursive) ---- */
function renderSkillItems(items = []) {
  if (!items.length) return "";
  return `<div class="chips">${items.map((i) => `<span class="chip">${escapeHtml(i)}</span>`).join("")}</div>`;
}

function renderSkillGroup(cat, level = 0) {
  const tag = level === 0 ? "h3" : "h4";
  const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
  const subsHtml = subs
    .map(
      (sc) => `<div class="subgroup">
        <h4>${escapeHtml(sc.name)}</h4>
        ${renderSkillItems(sc.items)}
      </div>`
    )
    .join("");
  return `<div class="skill-group">
    <${tag}>${escapeHtml(cat.name)}</${tag}>
    ${renderSkillItems(cat.items)}
    ${subsHtml}
  </div>`;
}

function renderSkills(categories) {
  if (!categories.length) return "<p class='text-muted'>Coming soon.</p>";
  return `<div class="skills-root">${categories.map((c) => renderSkillGroup(c, 0)).join("")}</div>`;
}

/* ---- Blogs preview ---- */
function renderBlogsPreview(blogs, limit = 3) {
  if (!blogs.length) return "<p class='text-muted'>No posts yet.</p>";
  const items = blogs.slice(0, limit);
  return `<div class="blog-list">${items
    .map(
      (b) => `
      <a class="blog-card" href="/blogs/${escapeHtml(b.slug)}/">
        <div class="blog-date">${escapeHtml(fmtDate(b.date))}</div>
        <h3>${escapeHtml(b.title)}</h3>
        <p>${escapeHtml(b.summary || "")}</p>
      </a>`
    )
    .join("")}</div>`;
}

/* ---- Blogs full list (blogs/index.html) ---- */
function renderBlogsList(blogs) {
  if (!blogs.length) return "<p class='text-muted'>No posts yet.</p>";
  return `<div class="blog-list">${blogs
    .map(
      (b) => `
      <a class="blog-card" href="/blogs/${escapeHtml(b.slug)}/">
        <div class="blog-date">${escapeHtml(fmtDate(b.date))}</div>
        <h3>${escapeHtml(b.title)}</h3>
        <p>${escapeHtml(b.summary || "")}</p>
        ${renderChips(b.tags)}
      </a>`
    )
    .join("")}</div>`;
}

function renderChips(tags) {
  if (!Array.isArray(tags) || !tags.length) return "";
  return `<div class="chips" style="margin-top: var(--sp-3)">${tags
    .map((t) => `<span class="chip chip-outline">${escapeHtml(t)}</span>`)
    .join("")}</div>`;
}

module.exports = {
  renderAbout,
  renderNews,
  renderExperience,
  renderEducation,
  renderProjects,
  renderPublications,
  renderCertifications,
  renderSkills,
  renderBlogsPreview,
  renderBlogsList,
  fmtDate,
};
