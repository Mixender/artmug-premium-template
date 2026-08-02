(() => {
  "use strict";

  const ROOT_READY_CLASS = "is-ready";
  const RESIZE_MESSAGE_TYPE = "resizePortfolio";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const postHeight = () => {
    if (window.parent === window) return;

    const height = Math.ceil(document.documentElement.scrollHeight);
    window.parent.postMessage({ type: RESIZE_MESSAGE_TYPE, height }, "*");
  };

  const scheduleHeightUpdate = (() => {
    let frame = 0;
    return () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(postHeight);
    };
  })();

  const initReveal = () => {
    document.querySelectorAll("[data-reveal-delay]").forEach((element) => {
      const delay = Number.parseInt(element.dataset.revealDelay, 10);
      if (Number.isFinite(delay)) element.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    requestAnimationFrame(() => document.documentElement.classList.add(ROOT_READY_CLASS));
  };

  const initIframeResize = () => {
    window.addEventListener("load", scheduleHeightUpdate, { once: true });
    window.addEventListener("resize", scheduleHeightUpdate, { passive: true });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(scheduleHeightUpdate);
      observer.observe(document.body);
    }

    if (document.fonts?.ready) document.fonts.ready.then(scheduleHeightUpdate);
  };

  const initSubtleParallax = () => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const showcase = document.querySelector(".hero-showcase");
    if (!showcase) return;

    let frame = 0;
    window.addEventListener("pointermove", (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 6;
        const y = (event.clientY / window.innerHeight - 0.5) * 5;
        showcase.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }, { passive: true });
  };

  const init = () => {
    initReveal();
    initIframeResize();
    initSubtleParallax();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
