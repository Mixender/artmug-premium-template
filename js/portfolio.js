(() => {
  "use strict";

  const sliderElement = document.querySelector(".portfolio-slider");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector(".lightbox__image");
  const lightboxCaption = lightbox?.querySelector(".lightbox__caption");
  const closeButton = lightbox?.querySelector(".lightbox__close");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastTrigger = null;

  const notifyResize = () => {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: "resizePortfolio",
      height: Math.ceil(document.documentElement.scrollHeight)
    }, "*");
  };

  if (!sliderElement || typeof window.Swiper !== "function") return;

  const portfolioSwiper = new window.Swiper(sliderElement, {
    loop: true,
    speed: reduceMotion ? 0 : 720,
    slidesPerView: "auto",
    spaceBetween: 18,
    grabCursor: true,
    watchSlidesProgress: true,
    preloadImages: false,
    lazyPreloadPrevNext: 1,
    keyboard: { enabled: true, onlyInViewport: true },
    autoplay: reduceMotion ? false : {
      delay: 3800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: ".portfolio-pagination",
      clickable: true
    },
    navigation: {
      prevEl: ".portfolio-prev",
      nextEl: ".portfolio-next"
    },
    breakpoints: {
      760: { spaceBetween: 26 }
    },
    on: {
      init: notifyResize,
      imagesReady: notifyResize,
      resize: notifyResize
    }
  });

  const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const preview = trigger.querySelector("img");
    lastTrigger = trigger;
    lightboxImage.src = trigger.dataset.fullImage || preview.currentSrc || preview.src;
    lightboxImage.alt = preview.alt;
    lightboxCaption.textContent = preview.alt;
    portfolioSwiper.autoplay?.stop();
    lightbox.showModal();
    notifyResize();
  };

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
  };

  document.querySelectorAll(".portfolio-card__zoom").forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  closeButton?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
    if (!reduceMotion) portfolioSwiper.autoplay?.start();
    lastTrigger?.focus();
    notifyResize();
  });
})();
