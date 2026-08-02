(() => {
  "use strict";

  const section = document.querySelector(".reviews");
  const cards = [...document.querySelectorAll("[data-review-card]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!section || !cards.length || reduceMotion) return;

  section.classList.add("has-motion");
  cards.forEach((card, index) => card.style.setProperty("--review-delay", `${index * 85}ms`));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

  cards.forEach((card) => observer.observe(card));
})();
