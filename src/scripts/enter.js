/* Mast name wipe, then a staggered rise of each landing section.
   No-ops when GSAP is missing or motion is reduced. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap) return;

  var gsap = window.gsap;
  var name = document.querySelector("#name");
  var rule = document.querySelector(".mast-rule");
  var bands = document.querySelectorAll(".band");

  if (name) {
    gsap.from(name, {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.9,
      ease: "power3.out",
      clearProps: "clipPath"
    });
  }

  if (rule) {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.75,
      delay: 0.18,
      ease: "power2.out",
      clearProps: "transform"
    });
  }

  if (bands.length) {
    gsap.from(bands, {
      y: 56,
      opacity: 0,
      duration: 0.8,
      stagger: 0.16,
      delay: 0.28,
      ease: "power3.out",
      clearProps: "opacity,transform"
    });
  }
})();
