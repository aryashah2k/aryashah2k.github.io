/* Scroll-reveal via IntersectionObserver.
   Respects prefers-reduced-motion by immediately revealing everything. */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => io.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
