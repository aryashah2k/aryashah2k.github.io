(function(){
  const container = document.getElementById('post');

  function getParam(name) {
    const u = new URL(location.href);
    return u.searchParams.get(name);
  }

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function inferRepo() {
    if (window.BLOG_REPO) return window.BLOG_REPO;
    const host = location.hostname; // e.g. aryashah2k.github.io
    const path = location.pathname.replace(/^\//, ''); // e.g. arya-terminal/blog.html
    let owner = host.split('.')[0];
    let repo = path.split('/')[0] || owner; // fallback
    if (!/github\.io$/.test(host)) {
      const metaOwner = document.querySelector('meta[name="gh-owner"]');
      const metaRepo = document.querySelector('meta[name="gh-repo"]');
      if (metaOwner && metaRepo) {
        owner = metaOwner.getAttribute('content');
        repo = metaRepo.getAttribute('content');
      }
    }
    return { owner, repo, branch: 'main' };
  }

  function renderError(msg) {
    container.innerHTML = '';
    container.appendChild(el('p','error', msg));
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

  async function fetchAndRender() {
    if (!container) return;
    const p = getParam('p');
    const b = getParam('b');
    if (!p) return renderError('No post specified.');

    const repoInfo = inferRepo();
    const branch = b || await getDefaultBranch(repoInfo.owner, repoInfo.repo);

    const raw = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/${p}`;
    const res = await fetch(raw);
    if (!res.ok) return renderError('Unable to load this post.');
    const md = await res.text();

    // Render markdown safely
    const html = DOMPurify.sanitize(marked.parse(md), {USE_PROFILES: {html: true}});
    container.innerHTML = html;

    // Smooth scroll anchor support
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  fetchAndRender();
})();
