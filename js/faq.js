(() => {
  "use strict";

  const accordion = document.querySelector("[data-accordion]");
  if (!accordion) return;

  const items = [...accordion.querySelectorAll(".faq-item")];

  const notifyResize = () => {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: "resizePortfolio",
      height: Math.ceil(document.documentElement.scrollHeight)
    }, "*");
  };

  const setItemState = (item, open) => {
    const button = item.querySelector(".faq-item__question");
    const answer = item.querySelector(".faq-item__answer");
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    answer.toggleAttribute("inert", !open);
  };

  items.forEach((item) => {
    const button = item.querySelector(".faq-item__question");
    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((candidate) => setItemState(candidate, candidate === item && willOpen));
      window.setTimeout(notifyResize, 440);
    });
  });
})();
