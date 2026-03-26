document.addEventListener("DOMContentLoaded", () => {

  const BASE = "https://raw.githubusercontent.com/Dangokojima/Kittysiteimages/main";

  // =========================
  // ELEMENTOS
  // =========================

  const themeIcon = document.getElementById("themeIcon");
  const langText = document.getElementById("langText");
  const langIcon = document.getElementById("langIcon");
  const menuIcon = document.getElementById("menuIcon");

  const menuBtn = document.getElementById("menuBtn");
  const sidePanel = document.getElementById("sidePanel");
  const overlay = document.getElementById("overlay");

  const openPopup = document.getElementById("openPopup");
  const mobilePopup = document.getElementById("mobilePopup");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");

  const closeIcon = document.getElementById("closeIcon");
  const closeBtn = document.getElementById("closeBtn");
  const logoWhite = document.getElementById("logoWhite");

  const grid = document.querySelector(".services-grid");
  const leftArrow = document.querySelector(".arrow-side.left");
  const rightArrow = document.querySelector(".arrow-side.right");

  // =========================
  // SAFE HELPER 😏
  // =========================
  const safe = (el, fn) => el && fn(el);

  // =========================
  // ASSETS
  // =========================

  safe(langIcon, el => el.src = `${BASE}/images/lang.svg`);
  safe(menuIcon, el => el.src = `${BASE}/images/menu.svg`);
  safe(closeIcon, el => el.src = `${BASE}/images/close.svg`);
  safe(logoWhite, el => el.src = `${BASE}/images/Logowhite.png`);

  if (closeBtn) closeBtn.onclick = closeMenu;

  document.querySelectorAll("[data-social]").forEach(el=>{
    el.src = `${BASE}/images/${el.dataset.social}.svg`;
  });

  // =========================
  // FAQ
  // =========================

  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {

      const item = q.parentElement;

      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("active");
        const icon = i.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
      });

      item.classList.add("active");
      const icon = item.querySelector(".faq-icon");
      if (icon) icon.textContent = "×";
    });
  });

  // =========================
  // LANG
  // =========================

  let currentLang = localStorage.getItem("lang") || (navigator.language.includes("pt") ? "pt":"en");
  let translations = {};

  function loadTranslations(lang){
    fetch(`${BASE}/data/${lang}.json?v=${Date.now()}`)
      .then(r=>r.json())
      .then(data=>{
        translations = data;
        applyTranslations();
      });
  }

  function applyTranslations(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.dataset.i18n;
      const value = translations[key];

      el.innerHTML = (value || el.textContent || "").replace(/\n/g, "<br>");
    });

    if (langText) langText.textContent = currentLang==="pt"?"BR":"EN";
  }

  loadTranslations(currentLang);

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.onclick = () => {
      currentLang = currentLang==="pt"?"en":"pt";
      localStorage.setItem("lang",currentLang);
      loadTranslations(currentLang);
    };
  }

  // =========================
  // THEME
  // =========================

  function updateTheme(){
    const light = document.body.classList.contains("light");
    safe(themeIcon, el => {
      el.src = light
        ? `${BASE}/images/light.svg`
        : `${BASE}/images/dark.svg`;
    });
  }

  updateTheme();

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle("light");
      localStorage.setItem("theme",
        document.body.classList.contains("light")?"light":"dark"
      );
      updateTheme();
    };
  }

  // =========================
  // MENU
  // =========================

  if (menuBtn && sidePanel && overlay) {
    menuBtn.onclick = () => {
      sidePanel.classList.toggle("open");
      overlay.classList.toggle("show");
    };

    overlay.onclick = closeMenu;
  }

  function closeMenu(){
    safe(sidePanel, el => el.classList.remove("open"));
    safe(overlay, el => el.classList.remove("show"));
  }

  // =========================
  // POPUP
  // =========================

  const links={
    pt:"https://tally.so/r/gD0Qq1",
    en:"https://tally.so/r/wb5pJ6"
  };

  function openForm(){
    if (!popup || !popupText) return;

    popup.classList.add("show");
    popupText.textContent = translations.popup || "...";

    setTimeout(()=>{
      window.open(links[currentLang],"_blank");
      popup.classList.remove("show");
    },600);
  }

  if (openPopup) openPopup.onclick = openForm;

  if (mobilePopup) {
    mobilePopup.onclick = () => {
      closeMenu();
      openForm();
    };
  }

  // =========================
  // CAROUSEL
  // =========================

  function updateArrows() {
    if (!grid || !leftArrow || !rightArrow) return;

    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const current = Math.round(grid.scrollLeft);

    const isOverflowing = maxScroll > 5;

    grid.style.justifyContent = isOverflowing ? "flex-start" : "center";

    const TOLERANCE = 10;

    leftArrow.classList.toggle("disabled", current <= TOLERANCE);
    rightArrow.classList.toggle("disabled", current >= maxScroll - TOLERANCE);
  }

  if (grid && leftArrow && rightArrow) {

    function scrollAndUpdate(offset) {
      grid.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    }

    leftArrow.onclick = () => {
      if (!leftArrow.classList.contains("disabled")) scrollAndUpdate(-300);
    };

    rightArrow.onclick = () => {
      if (!rightArrow.classList.contains("disabled")) scrollAndUpdate(300);
    };

    grid.addEventListener("scroll", () => {
      requestAnimationFrame(updateArrows);
    });

    window.addEventListener("resize", updateArrows);
    setTimeout(updateArrows, 50);
  }

  // =========================
  // CLOSE HELPERS
  // =========================

  document.querySelectorAll(".side-menu a, .socials img").forEach(el=>{
    el.addEventListener("click", closeMenu);
  });

  // =========================
  // TERMS SPA
  // =========================

  const kittyRoot = document.getElementById("kitty-root");
  const termsPage = document.getElementById("termsPage");
  const openTerms = document.getElementById("openTerms");
  const closeTerms = document.getElementById("closeTerms");

  function updateView(showTerms = false) {

    if (showTerms) {
      if (kittyRoot) kittyRoot.classList.add("hidden");
      if (termsPage) termsPage.classList.add("show");
      document.body.style.overflow = "hidden";
    } else {
      if (termsPage) termsPage.classList.remove("show");
      if (kittyRoot) kittyRoot.classList.remove("hidden");
      document.body.style.overflow = "";
    }

    window.scrollTo(0, 0);
  }

  // abrir
  if (openTerms) {
    openTerms.addEventListener("click", (e) => {
      e.preventDefault();
      updateView(true);
    });
  }

  // fechar
  if (closeTerms) {
    closeTerms.addEventListener("click", (e) => {
      e.preventDefault();
      updateView(false);
    });
  }

});