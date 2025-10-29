import "./style.css";
import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Scrollbar,
  Keyboard,
  Mousewheel,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function initResponsiveSwiper(selector, breakpointsConfig) {
  const container = document.querySelector(selector);
  const slidesCount = container.querySelectorAll(".swiper-slide").length;

  const screenWidth = window.innerWidth;
  let slidesPerView = 1;

  if (screenWidth >= 1440 && breakpointsConfig[1440]) {
    slidesPerView = breakpointsConfig[1440].slidesPerView;
  } else if (screenWidth >= 834 && breakpointsConfig[834]) {
    slidesPerView = breakpointsConfig[834].slidesPerView;
  } else if (breakpointsConfig[375]) {
    slidesPerView = breakpointsConfig[375].slidesPerView;
  }

  if (slidesCount <= slidesPerView) {
    container.classList.add("hide-swiper-nav");
  }

  return new Swiper(selector, {
    modules: [Pagination, Navigation],
    loop: true,
    breakpoints: breakpointsConfig,
    pagination: {
      el: `${selector} .swiper-pagination`,
      clickable: true,
    },
    navigation: {
      nextEl: `${selector} .swiper-button-next`,
      prevEl: `${selector} .swiper-button-prev`,
    },
  });
}
initResponsiveSwiper(".swiper-one", {
  375: { slidesPerView: 1, spaceBetween: 16 },
  834: { slidesPerView: 2, spaceBetween: 24 },
  1440: { slidesPerView: 3, spaceBetween: 32 },
});

// src/js/modal.js
document.addEventListener("DOMContentLoaded", () => {
  // Підтримуємо і data-атрибути, і старі класи для сумісності
  const openTriggers = document.querySelectorAll(
    "[data-modal-open], .open-modal"
  );
  const modals = document.querySelectorAll(".modal");

  // Відкриття
  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      // Пріоритет: data-modal-open="id"; fallback: якщо тригер поруч з модалкою
      const targetId = trigger.getAttribute("data-modal-open");
      let modal = targetId ? document.getElementById(targetId) : null;

      if (!modal) {
        // fallback: шукаємо першу модалку в документі (для дуже простих кейсів)
        modal = document.querySelector(".modal");
      }
      if (!modal) return;

      openModal(modal, trigger);
    });
  });

  // Закриття по кліку на overlay/×/лінк, по Esc
  modals.forEach((modal) => {
    const overlay =
      modal.querySelector("[data-modal-overlay]") ||
      modal.querySelector(".modal-overlay");

    // кнопки закриття — data-атрибут або клас
    const closeBtns = modal.querySelectorAll(
      "[data-modal-close], .close-modal"
    );

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modal));
    });

    if (overlay) {
      overlay.addEventListener("click", () => closeModal(modal));
    }

    // клік по лінку всередині модалки — теж закриває
    modal.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (link) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal:not(.hidden)").forEach(closeModal);
    }
  });

  function openModal(modal, triggerEl = null) {
    modal.classList.remove("hidden");
    document.body.classList.add("body-no-scroll");
    if (triggerEl?.setAttribute)
      triggerEl.setAttribute("aria-expanded", "true");

    // Фокус у модалку (доступність)
    const focusableSel =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const panel = modal.querySelector(".modal-content") || modal;
    const firstFocusable = panel.querySelector(focusableSel) || panel;
    setTimeout(() => firstFocusable.focus(), 0);
  }

  function closeModal(modal) {
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");

    // якщо це була остання відкрита модалка — повертаємо скрол
    const stillOpen = document.querySelectorAll(".modal:not(.hidden)").length;
    if (!stillOpen) {
      document.body.classList.remove("body-no-scroll");
    }

    // aria-expanded у зв'язаного тригера
    const trigger = document.querySelector(`[data-modal-open="${modal.id}"]`);
    if (trigger?.setAttribute) trigger.setAttribute("aria-expanded", "false");
  }
});
