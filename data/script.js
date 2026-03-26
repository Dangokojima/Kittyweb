document.addEventListener("DOMContentLoaded", () => {
  removeCarrdWrapper();

  /* =========================
     BASE & ELEMENTOS GLOBAIS
  ========================= */
  const BASE = "https://raw.githubusercontent.com/Dangokojima/Kittysiteimages/main";

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
  const logoWhite = document.getElementById("logoWhite");

  // Estrutura SPA
  const kittyRoot = document.getElementById("kitty-root");
  const termsPage = document.getElementById("termsPage");
  const openTerms = document.getElementById("openTerms");
  const closeTerms = document.getElementById("closeTerms");

  // Carrossel
  const grid = document.querySelector(".services-grid");
  const leftArrow = document.querySelector(".arrow-side.left");
  const rightArrow = document.querySelector(".arrow-side.right");

  /* =========================
     SISTEMA DE DEBUG
  ========================= */
  function debugLog(msg, obj = "") {
    console.log(`[KittyDebug] ${msg}`, obj);
  }

/* =========================
     CONTROLE DE VISÃO (SPA)
  ========================= */
  function updateView(showTerms = false) {
    debugLog("Trocando visão. Mostrar termos?", showTerms);

    if (!kittyRoot || !termsPage) {
      debugLog("ERRO: kittyRoot ou termsPage não encontrados no DOM!");
      return;
    }

    if (showTerms) {
      kittyRoot.style.display = "none";
      termsPage.style.display = "block"; // Mudamos para block para garantir visibilidade
      termsPage.classList.add("show");
      debugLog("Home escondida, Termos exibidos.");
    } else {
      termsPage.style.display = "none";
      termsPage.classList.remove("show");
      kittyRoot.style.display = "flex";
      debugLog("Termos escondidos, Home exibida.");
    }

    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resize'));
    setTimeout(updateArrows, 100);
  }

  /* =========================
     TERMS (Eventos com Verificação)
  ========================= */
  debugLog("Verificando botões de termos...");
  debugLog("Botão Open:", openTerms);
  debugLog("Botão Close:", closeTerms);

  if (openTerms) {
    openTerms.addEventListener("click", (e) => {
      debugLog("Clique detectado no botão de abrir termos!");
      e.preventDefault();
      e.stopPropagation(); // Impede o Carrd de resetar a página
      updateView(true);
    });
  } else {
    debugLog("AVISO: Elemento #openTerms não foi encontrado!");
  }

  if (closeTerms) {
    closeTerms.addEventListener("click", (e) => {
      debugLog("Clique detectado no botão de fechar termos!");
      e.preventDefault();
      updateView(false);
    });
  }

  /* =========================
     ASSETS & SOCIALS
  ========================= */
  if (langIcon) langIcon.src = `${BASE}/images/lang.svg`;
  if (menuIcon) menuIcon.src = `${BASE}/images/menu.svg`;
  if (closeIcon) closeIcon.src = `${BASE}/images/close.svg`;
  if (logoWhite) logoWhite.src = `${BASE}/images/Logowhite.png`;

  document.getElementById("closeBtn").onclick = closeMenu;

  document.querySelectorAll("[data-social]").forEach(el => {
    el.src = `${BASE}/images/${el.dataset.social}.svg`;
  });

  /* =========================
     FAQ ACCORDION
  ========================= */
  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("active");
        i.querySelector(".faq-icon").textContent = "+";
      });

      if (!isActive) {
        item.classList.add("active");
        item.querySelector(".faq-icon").textContent = "×";
      }
    });
  });

  /* =========================
     TRADUÇÃO (I18N)
  ========================= */
  let currentLang = localStorage.getItem("lang") || (navigator.language.includes("pt") ? "pt" : "en");
  let translations = {};

  function loadTranslations(lang) {
    fetch(`${BASE}/data/${lang}.json`)
      .then(r => r.json())
      .then(data => {
        translations = data;
        applyTranslations();
      });
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const value = translations[key];
      if (value) {
        el.innerHTML = value.replace(/\n/g, "<br>");
      }
    });
    if (langText) langText.textContent = currentLang === "pt" ? "BR" : "EN";
  }

  loadTranslations(currentLang);

  document.getElementById("langToggle").onclick = () => {
    currentLang = currentLang === "pt" ? "en" : "pt";
    localStorage.setItem("lang", currentLang);
    loadTranslations(currentLang);
  };

  /* =========================
     TEMA (DARK/LIGHT)
  ========================= */
  function updateTheme() {
    const light = document.body.classList.contains("light");
    if (themeIcon) {
      themeIcon.src = light ? `${BASE}/images/light.svg` : `${BASE}/images/dark.svg`;
    }
  }

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
  updateTheme();

  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    updateTheme();
  };

  /* =========================
     MENU MOBILE
  ========================= */
  menuBtn.onclick = () => {
    sidePanel.classList.toggle("open");
    overlay.classList.toggle("show");
  };

  overlay.onclick = closeMenu;

  function closeMenu() {
    sidePanel.classList.remove("open");
    overlay.classList.remove("show");
  }

  /* =========================
     POPUP FORMULÁRIO
  ========================= */
  const links = {
    pt: "https://tally.so/r/gD0Qq1",
    en: "https://tally.so/r/wb5pJ6"
  };

  function openForm() {
    popup.classList.add("show");
    popupText.textContent = translations.popup || "...";
    setTimeout(() => {
      window.open(links[currentLang], "_blank");
      popup.classList.remove("show");
    }, 600);
  }

  if (openPopup) openPopup.onclick = openForm;
  if (mobilePopup) mobilePopup.onclick = () => {
    closeMenu();
    openForm();
  };

  /* =========================
     SERVICES CAROUSEL
  ========================= */
  function updateArrows() {
    if (!grid || !leftArrow || !rightArrow) return;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const current = Math.round(grid.scrollLeft);
    const isOverflowing = maxScroll > 5;

    grid.style.justifyContent = isOverflowing ? "flex-start" : "center";
    const TOLERANCE = 10;
    leftArrow.classList.toggle("disabled", current <= TOLERANCE);
    rightArrow.classList.toggle("disabled", current >= maxScroll - TOLERANCE);
    
    // Esconde setas se não houver overflow
    leftArrow.style.display = isOverflowing ? "block" : "none";
    rightArrow.style.display = isOverflowing ? "block" : "none";
  }

  if (grid && leftArrow && rightArrow) {
    function scrollAndUpdate(offset) {
      grid.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    }
    leftArrow.onclick = () => scrollAndUpdate(-300);
    rightArrow.onclick = () => scrollAndUpdate(300);
    grid.addEventListener("scroll", () => requestAnimationFrame(updateArrows));
    window.addEventListener("resize", updateArrows);
    setTimeout(updateArrows, 50);
  }

  /* =========================
     LOADER & HELPERS
  ========================= */
  document.querySelectorAll(".side-menu a, .socials img").forEach(el => {
    el.addEventListener("click", closeMenu);
  });

  function removeCarrdWrapper() {
    document.querySelector(".site-wrapper")?.remove();
  }

  const loader = document.getElementById("loader");
  function hideLoader() {
    if (loader) loader.classList.add("hide");
    if (kittyRoot) kittyRoot.classList.add("show");
  }

  setTimeout(hideLoader, 1500);
  window.addEventListener("load", hideLoader);
});