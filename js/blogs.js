(function() {
  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  const pager = document.getElementById('blogPagination');
  if (!grid) return;

  const PAGE_SIZE = 10;
  let all = [];
  let page = 1;

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
      window.history.replaceState({}, '', u.toString());
    } catch(_) {}
  }

  function renderPage() {
    grid.innerHTML = '';
    const start = (page - 1) * PAGE_SIZE;
    const slice = all.slice(start, start + PAGE_SIZE);
    slice.forEach(item => {
      const card = document.createElement('a');
      card.href = `blog.html?post=${encodeURIComponent(item.slug)}`;
      card.className = 'blog-card';
      const title = (item.title || item.slug).trim();
      card.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.95 11.95c.63.63 1.15 1.39 1.46 2.23l.19.52h6.6l.19-.52c.31-.84.83-1.6 1.46-2.23A7 7 0 0 0 12 2Zm2.62 12.26c-.46.46-.84 1-.1 1.74H9.48c.74-.74.36-1.28-.1-1.74A5 5 0 1 1 17 10c0 1.33-.53 2.6-1.38 3.46Z"/>
        </svg>
        <h3>${title}</h3>
      `;
      grid.appendChild(card);
    });
  }

  function renderPagination() {
    if (!pager) return;
    const pages = Math.ceil(all.length / PAGE_SIZE);
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
    for (let p = 1; p <= pages; p++) {
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
      renderPage();
      renderPagination();
    });
  // Update page in URL when navigating
  const origRenderPage = renderPage;
  renderPage = function(){
    origRenderPage();
    writePageToUrl();
  }
})();
