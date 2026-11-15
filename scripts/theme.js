/* Theme toggle — dark/light, persisted in localStorage.
   Runs as early as possible to avoid flash-of-wrong-theme. */
(function () {
  const KEY = "theme";
  const root = document.documentElement;

  const stored = localStorage.getItem(KEY);
  const initial = stored || "dark";
  root.setAttribute("data-theme", initial);

  function wire() {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
