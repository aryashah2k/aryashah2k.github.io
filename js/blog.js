(function() {
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const slug = getParam('post');
  const container = document.getElementById('postContent');
  if (!container) return;

  if (!slug) {
    container.innerHTML = '<p class="muted">No post specified. <a href="blogs.html">Go back</a>.</p>';
    return;
  }

  const mdUrl = `blogs/${encodeURIComponent(slug)}.md`;

  fetch(mdUrl, { cache: 'no-store' })
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(md => {
      // Configure marked
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
      });
      const html = marked.parse(md);
      container.innerHTML = DOMPurify.sanitize(html);

      // Fix GitHub blob image URLs to raw URLs so they load correctly
      container.querySelectorAll('img').forEach(img => {
        try {
          const src = img.getAttribute('src') || '';
          if (/https?:\/\/github\.com\//i.test(src) && /\/blob\//i.test(src)) {
            const raw = src.replace(/^https?:\/\/github\.com\//i, 'https://raw.githubusercontent.com/').replace(/\/blob\//i, '/');
            img.setAttribute('src', raw);
          }
        } catch (_) {}
      });

      // Typeset math with MathJax if available
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([container]).catch(() => {});
      }

      // Smooth scroll for on-page anchors
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
          const id = this.getAttribute('href').slice(1);
          const el = document.getElementById(id);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    })
    .catch(() => {
      container.innerHTML = '<p class="muted">Post not found. <a href="blogs.html">Go back</a>.</p>';
    });
})();
