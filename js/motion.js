(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const progress = document.createElement("div");
  progress.className = "motion-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  revealElements.forEach((element) => {
    const delay = Number.parseInt(element.dataset.revealDelay, 10);
    if (Number.isFinite(delay)) element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  root.classList.add("motion-ready");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-inview", "motion-complete"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        window.setTimeout(() => entry.target.classList.add("motion-complete"), 1100);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -9%", threshold: 0.1 });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  let scrollFrame = 0;
  const updateScrollMotion = () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0;
      root.style.setProperty("--scroll-progress", value.toFixed(4));
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    });
  };

  window.addEventListener("scroll", updateScrollMotion, { passive: true });
  window.addEventListener("resize", updateScrollMotion, { passive: true });
  updateScrollMotion();

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursorLight = document.createElement("div");
    cursorLight.className = "motion-cursor-light";
    cursorLight.setAttribute("aria-hidden", "true");
    document.body.prepend(cursorLight);

    let pointerFrame = 0;
    window.addEventListener("pointermove", (event) => {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    }, { passive: true });
  }
})();
