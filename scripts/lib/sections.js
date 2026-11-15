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
  return `${left} to ${right}`;
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

function noteIndex(items) {
  if (!items.length) return "<p class='text-muted'>No notes yet.</p>";
  return `<ol class="note-index">${items
    .map(
      (b) => `
      <li>
        <a href="/blogs/${escapeHtml(b.slug)}/">
          <time datetime="${escapeHtml(b.date || "")}">${escapeHtml(fmtDate(b.date))}</time>
          <span class="note-title">${escapeHtml(b.title)}</span>
          ${b.summary ? `<span class="note-sum">${escapeHtml(b.summary)}</span>` : ""}
        </a>
      </li>`
    )
    .join("")}</ol>`;
}

/* ---- Blogs preview ---- */
function renderBlogsPreview(blogs, limit = 3) {
  return noteIndex((blogs || []).slice(0, limit));
}

/* ---- Blogs full list (blogs/index.html) ---- */
function renderBlogsList(blogs) {
  return noteIndex(blogs || []);
}

function proofRow(bodyHtml) {
  return `<div class="proof-row"><div class="proof-body">${bodyHtml}</div></div>`;
}

function linkList(links) {
  if (!links || !links.length) return "";
  return `<p class="proof-more">${links
    .map((l) => `<a href="${escapeHtml(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`)
    .join("")}</p>`;
}

function venueLine(p) {
  const year = p.year || "";
  const venue = p.venue || "";
  if (venue && year && String(venue).indexOf(String(year)) !== -1) return venue;
  return [venue, year].filter(Boolean).join(", ");
}

/* Latest role only. The heading above this row says Now. */
function renderNow(data) {
  const x = (data.experience || []).filter((item) => item.featured)[0];
  if (!x) return "<p class='text-muted'>Nothing listed yet.</p>";
  const meta = [range(x.start, x.end), x.location].filter(Boolean).join(". ");
  return `<div class="proof">${proofRow(
    `<p class="proof-title">${escapeHtml(x.role)}, ${escapeHtml(x.org)}</p>${meta ? `<p class="proof-meta">${escapeHtml(meta)}</p>` : ""}`
  )}</div>`;
}

/* Latest degree only. The heading above this row says Education. */
function renderEduBrief(data) {
  const x = (data.education || []).filter((item) => item.featured)[0];
  if (!x) return "<p class='text-muted'>Nothing listed yet.</p>";
  const meta = [range(x.start, x.end), x.location].filter(Boolean).join(". ");
  const detail = meta ? `${escapeHtml(x.school)}. ${escapeHtml(meta)}` : escapeHtml(x.school);
  return `<div class="proof">${proofRow(
    `<p class="proof-title">${escapeHtml(x.degree)}</p><p class="proof-meta">${detail}</p>`
  )}</div>`;
}

/* Featured repos only. The heading above these rows says Work. */
function renderWorkList(data) {
  const projects = (data.projects || []).filter((item) => item.featured);
  if (!projects.length) return "<p class='text-muted'>Nothing listed yet.</p>";
  return `<div class="proof">${projects
    .map((p) => {
      const title = p.url
        ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.name)}</a>`
        : escapeHtml(p.name);
      return proofRow(
        `<p class="proof-title">${title}</p>${p.summary ? `<p class="proof-meta">${escapeHtml(p.summary)}</p>` : ""}`
      );
    })
    .join("")}</div>`;
}

/* Featured papers. Venue text carries CVPR 2026 for Purrturbed. */
function renderPaperList(data) {
  const pubs = (data.publications || []).filter((item) => item.featured);
  if (!pubs.length) return "<p class='text-muted'>Nothing listed yet.</p>";
  return `<div class="proof">${pubs
    .map((p) => {
      const primary = (p.links || [])[0];
      const title = primary
        ? `<a href="${escapeHtml(primary.href)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>`
        : escapeHtml(p.title);
      const meta = venueLine(p);
      return proofRow(
        `<p class="proof-title">${title}</p>${meta ? `<p class="proof-meta">${escapeHtml(meta)}</p>` : ""}${linkList(p.links || [])}`
      );
    })
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
  renderNow,
  renderEduBrief,
  renderWorkList,
  renderPaperList,
  fmtDate,
};
