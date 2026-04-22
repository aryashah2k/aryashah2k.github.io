/* Nav behaviour:
   - Mobile toggle (hamburger)
   - Highlights the current page link with aria-current="page". */
(function () {
  function normalize(p) {
    if (!p) return "/";
    p = p.split("#")[0].split("?")[0];
    if (p.endsWith("/index.html")) p = p.slice(0, -"index.html".length);
    if (p.length > 1 && p.endsWith("/")) { /* keep trailing slash */ }
    return p || "/";
  }

  function markCurrent() {
    const here = normalize(window.location.pathname);
    document.querySelectorAll(".site-nav nav a").forEach((a) => {
      const href = normalize(new URL(a.getAttribute("href"), window.location.origin).pathname);
      const match =
        href === here ||
        (href !== "/" && here.startsWith(href));
      if (match) a.setAttribute("aria-current", "page");
    });
  }

  function wireToggle() {
    const root = document.querySelector(".site-nav");
    const btn = document.querySelector(".nav-toggle");
    if (!root || !btn) return;
    btn.addEventListener("click", () => {
      const open = root.getAttribute("data-open") === "true";
      root.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
    });
    root.querySelectorAll("nav a").forEach((a) =>
      a.addEventListener("click", () => root.setAttribute("data-open", "false"))
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { markCurrent(); wireToggle(); });
  } else {
    markCurrent();
    wireToggle();
  }
})();
