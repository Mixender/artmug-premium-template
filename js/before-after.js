(() => {
  "use strict";

  const comparisons = document.querySelectorAll("[data-comparison]");

  const notifyResize = () => {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: "resizePortfolio",
      height: Math.ceil(document.documentElement.scrollHeight)
    }, "*");
  };

  comparisons.forEach((comparison) => {
    const range = comparison.querySelector(".comparison-slider__range");
    if (!range) return;

    const update = () => {
      const value = Number(range.value);
      comparison.style.setProperty("--comparison-position", `${value}%`);
      range.setAttribute("aria-valuetext", `전후 이미지 중 완성본이 ${value}% 보임`);
    };

    const startDragging = () => comparison.classList.add("is-dragging");
    const stopDragging = () => comparison.classList.remove("is-dragging");

    range.addEventListener("input", update, { passive: true });
    range.addEventListener("pointerdown", startDragging, { passive: true });
    range.addEventListener("pointerup", stopDragging, { passive: true });
    range.addEventListener("pointercancel", stopDragging, { passive: true });
    range.addEventListener("change", stopDragging, { passive: true });

    update();
  });

  window.addEventListener("load", notifyResize, { once: true });
})();
