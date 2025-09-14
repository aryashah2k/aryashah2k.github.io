(function(){
  const STORAGE_MODE = 'themeMode'; // 'light' or 'color'
  const STORAGE_COLOR = 'themeColorClass'; // e.g., 'color3'

  function getToggleEl(){ return document.getElementById('themeToggle'); }

  function getCurrentColorClass(){
    const body = document.body;
    // consider only color1..color8 as meaningful palette classes
    const match = Array.from(body.classList).find(c => /^color[1-8]$/.test(c));
    return match || '';
  }

  function applyMode(mode){
    const body = document.body;
    if(mode === 'light'){
      body.classList.add('theme-light');
    } else {
      body.classList.remove('theme-light');
      // remove any existing color0..8 classes first
      body.classList.forEach(c => { if(/^color[0-8]$/.test(c)) body.classList.remove(c); });
      // Re-apply stored color class if present and not color0
      const saved = localStorage.getItem(STORAGE_COLOR);
      if(saved && saved !== 'color0'){
        body.classList.add(saved);
      }
    }
    localStorage.setItem(STORAGE_MODE, mode);
    updateToggleLabel();
    callSyncHeader();
  }

  function svgSun(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function svgMoon(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
  }

  function updateToggleLabel(){
    const btn = getToggleEl();
    if(!btn) return;
    const mode = localStorage.getItem(STORAGE_MODE) || 'color';
    // Show icon for the ACTION that will happen on click
    if(mode === 'light'){
      // currently light -> clicking goes to color; show moon icon
      btn.innerHTML = svgMoon();
      btn.title = 'Switch to color theme';
      btn.setAttribute('aria-label', 'Switch to color theme');
    } else {
      // currently color -> clicking goes to light; show sun icon
      btn.innerHTML = svgSun();
      btn.title = 'Switch to light theme';
      btn.setAttribute('aria-label', 'Switch to light theme');
    }
    btn.setAttribute('aria-pressed', mode === 'light');
    callSyncHeader();
  }

  function init(){
    // Save any present color class for restoration later
    const currentColor = getCurrentColorClass();
    if(currentColor){
      localStorage.setItem(STORAGE_COLOR, currentColor);
    }

    const mode = localStorage.getItem(STORAGE_MODE) || 'color';
    applyMode(mode);

    const btn = getToggleEl();
    if(btn){
      btn.addEventListener('click', function(){
        const cur = localStorage.getItem(STORAGE_MODE) || 'color';
        const next = (cur === 'light') ? 'color' : 'light';
        // Before leaving color mode, capture latest colorX from body
        if(cur === 'color'){
          const cc = getCurrentColorClass();
          if(cc) localStorage.setItem(STORAGE_COLOR, cc);
        }
        applyMode(next);
      });
    }
    callSyncHeader();
  }

  function callSyncHeader(){
    try {
      if (typeof window.syncHeader === 'function') {
        window.syncHeader();
        return;
      }
      // Fallback: adjust spacer width locally if syncHeader is not defined
      var headerActions = document.querySelector('.header-actions');
      var headerSpacer = document.querySelector('.site-header .spacer');
      if (headerActions && headerSpacer) {
        headerSpacer.style.width = headerActions.offsetWidth + 'px';
      }
    } catch(_) {}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
