(function() {
  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  const pager = document.getElementById('blogPagination');
  const search = document.getElementById('blogSearch');
  if (!grid) return;

  const PAGE_SIZE = 10;
  let all = [];
  let page = 1;
  let q = '';

  function readPageFromUrl(){
    try {
      const u = new URL(window.location.href);
      const p = parseInt(u.searchParams.get('page') || '1', 10);
      if (!isNaN(p) && p > 0) page = p;
    } catch(_) {}
  }

  function writePageToUrl(){
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('page', String(page));
      if (q) u.searchParams.set('q', q); else u.searchParams.delete('q');
      window.history.replaceState({}, '', u.toString());
    } catch(_) {}
  }

  function renderPage() {
    grid.innerHTML = '';
    const start = (page - 1) * PAGE_SIZE;
    const slice = getSorted().slice(start, start + PAGE_SIZE);
    slice.forEach(item => {
      const card = document.createElement('a');
      card.href = `blog.html?post=${encodeURIComponent(item.slug)}`;
      card.className = 'blog-card';
      const title = (item.title || item.slug).trim();
      const highlighted = highlightTitle(title, q);
      card.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.95 11.95c.63.63 1.15 1.39 1.46 2.23l.19.52h6.6l.19-.52c.31-.84.83-1.6 1.46-2.23A7 7 0 0 0 12 2Zm2.62 12.26c-.46.46-.84 1-.1 1.74H9.48c.74-.74.36-1.28-.1-1.74A5 5 0 1 1 17 10c0 1.33-.53 2.6-1.38 3.46Z"/>
        </svg>
        <h3>${highlighted}</h3>
      `;
      grid.appendChild(card);
    });
  }

  function renderPagination() {
    if (!pager) return;
    const pages = Math.ceil(getSorted().length / PAGE_SIZE);
    if (pages <= 1) { pager.innerHTML = ''; return; }

    function pageBtn(label, targetPage, disabled, isActive, ariaLabel) {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'page-btn' + (isActive ? ' active' : '') + (disabled ? ' disabled' : '');
      a.textContent = label;
      if (ariaLabel) a.setAttribute('aria-label', ariaLabel);
      a.disabled = !!disabled;
      a.addEventListener('click', () => {
        if (targetPage < 1 || targetPage > pages || targetPage === page) return;
        page = targetPage;
        renderPage();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return a;
    }

    pager.innerHTML = '';
    pager.appendChild(pageBtn('«', 1, page === 1, false, 'First page'));
    pager.appendChild(pageBtn('‹', page - 1, page === 1, false, 'Previous page'));
    const startWin = Math.max(1, page - 2);
    const endWin = Math.min(pages, page + 2);
    for (let p = startWin; p <= endWin; p++) {
      pager.appendChild(pageBtn(String(p), p, false, p === page));
    }
    pager.appendChild(pageBtn('›', page + 1, page === pages, false, 'Next page'));
    pager.appendChild(pageBtn('»', pages, page === pages, false, 'Last page'));

    // Status
    const status = document.createElement('span');
    status.className = 'page-status';
    status.textContent = `Page ${page} of ${pages}`;
    pager.appendChild(status);
  }

  function norm(s){ return (s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim(); }
  function score(title, query){
    if (!query) return 0; // zero extra weight when no query
    const t = norm(title), qn = norm(query);
    if (!qn) return 0;
    // token overlap
    const ts = new Set(t.split(' '));
    const qs = qn.split(' ');
    let overlap = 0; qs.forEach(w => { if (ts.has(w)) overlap += 1; });
    // subsequence score
    let i=0,j=0; while (i<t.length && j<qn.length){ if (t[i]===qn[j]) j++; i++; }
    const subseq = j/Math.max(1, qn.length);
    return overlap*2 + subseq; // weighted
  }
  function getSorted(){
    if (!q) return all;
    return [...all].sort((a,b)=> (score(b.title||b.slug, q) - score(a.title||a.slug, q)) );
  }

  function escapeHtml(s){
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function highlightTitle(title, query){
    const safe = escapeHtml(title);
    const qn = norm(query);
    if (!qn) return safe;
    const tokens = Array.from(new Set(qn.split(' ').filter(Boolean)));
    if (tokens.length === 0) return safe;
    const re = new RegExp('(' + tokens.map(escapeRegex).join('|') + ')', 'gi');
    return safe.replace(re, '<mark class="hl">$&</mark>');
  }

  fetch('blogs/index.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(list => {
      if (!Array.isArray(list) || list.length === 0) {
        empty && (empty.style.display = 'block');
        return;
      }
      all = list;
      // default to newest first if items have date
      try { all.sort((a,b) => (b.date||'').localeCompare(a.date||'')); } catch(_) {}
      readPageFromUrl();
      // read query from URL
      try { const u=new URL(window.location.href); q = u.searchParams.get('q')||''; if (search) search.value = q; } catch(_) {}
      renderPage();
      renderPagination();
    });
  // Update page in URL when navigating
  const origRenderPage = renderPage;
  renderPage = function(){
    origRenderPage();
    writePageToUrl();
  }

  // search handler
  if (search){
    let t; // debounce
    search.addEventListener('input', function(){
      q = this.value || '';
      page = 1;
      clearTimeout(t);
      t = setTimeout(function(){
        renderPage();
        renderPagination();
      }, 120);
    });
  }
})();
