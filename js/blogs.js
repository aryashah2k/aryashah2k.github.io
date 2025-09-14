(function() {
  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  if (!grid) return;

  fetch('blogs/index.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(list => {
      if (!Array.isArray(list) || list.length === 0) {
        empty && (empty.style.display = 'block');
        return;
      }
      list.forEach(item => {
        const card = document.createElement('a');
        card.href = `blog.html?post=${encodeURIComponent(item.slug)}`;
        card.className = 'blog-card';
        card.innerHTML = `
          <img src="${item.thumbnail || 'img/portfolio.png'}" alt="${item.title || item.slug}">
          <h3>${item.title || item.slug}</h3>
          <p>${item.description || ''}</p>
        `;
        grid.appendChild(card);
      });
    });
})();
