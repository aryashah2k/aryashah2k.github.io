(function(){
  const grid = document.getElementById('blogsGrid');
  const PLACEHOLDER_IMG = 'img/portfolio.png';

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function inferRepo() {
    if (window.BLOG_REPO) return window.BLOG_REPO;
    const host = location.hostname; // e.g. aryashah2k.github.io
    const path = location.pathname.replace(/^\//, ''); // e.g. arya-terminal/blogs.html
    let owner = host.split('.')[0];
    let repo = path.split('/')[0] || owner; // for user site root
    // For custom domains, require manual override via window.BLOG_REPO
    if (!/github\.io$/.test(host)) {
      // best-effort: try to read meta data-repo/data-owner if present
      const metaOwner = document.querySelector('meta[name="gh-owner"]');
      const metaRepo = document.querySelector('meta[name="gh-repo"]');
      if (metaOwner && metaRepo) {
        owner = metaOwner.getAttribute('content');
        repo = metaRepo.getAttribute('content');
      }
    }
    return { owner, repo, branch: 'main' };
  }

  async function getDefaultBranch(owner, repo) {
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!r.ok) throw new Error('Repo meta fetch failed');
      const j = await r.json();
      return j.default_branch || 'main';
    } catch(_) {
      return 'main';
    }
  }

  async function listMarkdown(owner, repo, branch) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/blogs?ref=${branch}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Cannot list blogs directory');
    const items = await res.json();
    return items.filter(it => it.type === 'file' && /\.(md|mdx)$/i.test(it.name));
  }

  async function fetchMarkdownPreview(rawUrl) {
    try {
      const r = await fetch(rawUrl);
      if (!r.ok) return {};
      const t = await r.text();
      // title: from first level-1 heading or from first line
      const titleMatch = t.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : (t.split('\n')[0].replace(/^#\s*/,'').trim() || 'Untitled');
      // excerpt: next non-empty line after title
      let excerpt = '';
      const lines = t.split('\n');
      const start = titleMatch ? lines.indexOf(titleMatch[0]) + 1 : 1;
      for (let i=start; i<lines.length; i++) {
        const L = lines[i].trim();
        if (L && !L.startsWith('#')) { excerpt = L; break; }
      }
      return { title, excerpt };
    } catch(_) { return {}; }
  }

  async function init() {
    if (!grid) return;
    const repoInfo = inferRepo();
    const branch = await getDefaultBranch(repoInfo.owner, repoInfo.repo);
    const items = await listMarkdown(repoInfo.owner, repoInfo.repo, branch).catch(()=>[]);

    if (!items.length) {
      const empty = el('p','', 'No blogs found yet. Add markdown files to the <code>blogs/</code> directory.');
      grid.appendChild(empty);
      return;
    }

    // Build cards
    for (const it of items) {
      const raw = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/blogs/${encodeURIComponent(it.name)}`;
      const meta = await fetchMarkdownPreview(raw);
      const card = el('article','blog-card');
      const a = el('a','blog-link');
      a.href = `blog.html?p=${encodeURIComponent('blogs/' + it.name)}&b=${encodeURIComponent(branch)}`;

      const img = el('img','blog-thumb');
      img.src = PLACEHOLDER_IMG;
      img.alt = meta.title || it.name;

      const h3 = el('h3','', meta.title || it.name.replace(/\.(md|mdx)$/i,''));
      const p = el('p','blog-excerpt', meta.excerpt || '');

      a.appendChild(img);
      a.appendChild(h3);
      a.appendChild(p);
      card.appendChild(a);
      grid.appendChild(card);
    }
  }

  init();
})();
