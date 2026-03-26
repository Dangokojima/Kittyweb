document.addEventListener("DOMContentLoaded", () => {
  removeCarrdWrapper();

  /* =========================
     BASE
  ========================= */
  const BASE = "https://raw.githubusercontent.com/Dangokojima/Kittysiteimages/main";

  /* =========================
     ELEMENTOS
  ========================= */

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

  const grid = document.querySelector(".services-grid");
  const leftArrow = document.querySelector(".arrow-side.left");
  const rightArrow = document.querySelector(".arrow-side.right");

/* =========================
     TERMS (Ajustado para SPA)
  ========================= */
  const kittyRoot = document.getElementById("kitty-root");
  const termsPage = document.getElementById("termsPage");
  const openTerms = document.getElementById("openTerms");
  const closeTerms = document.getElementById("closeTerms");

// ABRIR TERMOS
  openTerms?.addEventListener("click", (e) => {
    e.preventDefault();
    updateView(true);
  });

  // FECHAR TERMOS
  closeTerms?.addEventListener("click", (e) => {
    e.preventDefault();
    updateView(false);
  });

  /* =========================
     ASSETS
  ========================= */

  langIcon.src = `${BASE}/images/lang.svg`;
  menuIcon.src = `${BASE}/images/menu.svg`;
  closeIcon.src = `${BASE}/images/close.svg`;
  document.getElementById("logoWhite").src = `${BASE}/images/Logowhite.png`;

  document.getElementById("closeBtn").onclick = closeMenu;

  document.querySelectorAll("[data-social]").forEach(el=>{
    el.src = `${BASE}/images/${el.dataset.social}.svg`;
  });

  /* =========================
     FAQ ACCORDION
  ========================= */

  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {

      const item = q.parentElement;

      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("active");
        i.querySelector(".faq-icon").textContent = "+";
      });

      item.classList.add("active");
      item.querySelector(".faq-icon").textContent = "×";
    });
  });

  /* =========================
     LANG
  ========================= */

  let currentLang = localStorage.getItem("lang") || (navigator.language.includes("pt") ? "pt":"en");
  let translations = {};

  function loadTranslations(lang){
    fetch(`${BASE}/data/${lang}.json`)
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

      el.innerHTML = (value || el.textContent || "")
        .replace(/\n/g, "<br>");
    });

    langText.textContent = currentLang==="pt"?"BR":"EN";
  }

  loadTranslations(currentLang);

  document.getElementById("langToggle").onclick=()=>{
    currentLang = currentLang==="pt"?"en":"pt";
    localStorage.setItem("lang",currentLang);
    loadTranslations(currentLang);
  };

  /* =========================
     THEME
  ========================= */

  function updateTheme(){
    const light = document.body.classList.contains("light");
    themeIcon.src = light ? `${BASE}/images/light.svg` : `${BASE}/images/dark.svg`;
  }

  updateTheme();

  document.getElementById("themeToggle").onclick=()=>{
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light")?"light":"dark");
    updateTheme();
  };

  /* =========================
     MENU
  ========================= */

  menuBtn.onclick=()=>{
    sidePanel.classList.toggle("open");
    overlay.classList.toggle("show");
  };

  overlay.onclick=closeMenu;

  function closeMenu(){
    sidePanel.classList.remove("open");
    overlay.classList.remove("show");
  }

  /* =========================
     POPUP
  ========================= */

  const links={
    pt:"https://tally.so/r/gD0Qq1",
    en:"https://tally.so/r/wb5pJ6"
  };

  function openForm(){
    popup.classList.add("show");
    popupText.textContent = translations.popup || "...";

    setTimeout(()=>{
      window.open(links[currentLang],"_blank");
      popup.classList.remove("show");
    },600);
  }

  openPopup.onclick = openForm;

  mobilePopup.onclick = () => {
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

    if (current <= TOLERANCE) {
      leftArrow.classList.add("disabled");
    } else {
      leftArrow.classList.remove("disabled");
    }

    if (current >= maxScroll - TOLERANCE) {
      rightArrow.classList.add("disabled");
    } else {
      rightArrow.classList.remove("disabled");
    }
  }

  if (grid && leftArrow && rightArrow) {

    function scrollAndUpdate(offset) {
      grid.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateArrows, 350);
    }

    leftArrow.onclick = () => {
      if (leftArrow.classList.contains("disabled")) return;
      scrollAndUpdate(-300);
    };

    rightArrow.onclick = () => {
      if (rightArrow.classList.contains("disabled")) return;
      scrollAndUpdate(300);
    };

    grid.addEventListener("scroll", () => {
      requestAnimationFrame(updateArrows);
    });

    window.addEventListener("resize", updateArrows);

    setTimeout(updateArrows, 50);
  }

  /* =========================
     CLOSE HELPERS
  ========================= */

  document.querySelectorAll(".side-menu a").forEach(el=>{
    el.addEventListener("click", closeMenu);
  });

  document.querySelectorAll(".socials img").forEach(el=>{
    el.addEventListener("click", closeMenu);
  });

  function removeCarrdWrapper() {
    document.querySelector(".site-wrapper")?.remove();
  }

  const loader = document.getElementById("loader");
  const root = document.getElementById("kitty-root");

  function hideLoader() {
    loader.classList.add("hide");
    root.classList.add("show");
  }

  // 👉 garante que vai sair SEMPRE
  setTimeout(hideLoader, 1500);

  // 👉 tenta sair mais cedo se carregar rápido
  window.addEventListener("load", hideLoader);

/* =========================
     CONTROLE DE VISÃO (SPA)
  ========================= */
  function updateView(showTerms = false) {
    if (showTerms) {
      // Esconde a Home e mostra os Termos
      kittyRoot.style.display = "none";
      kittyRoot.classList.remove("show");
      termsPage.classList.add("show");
      
      // Adiciona uma classe no body para CSS específico de termos, se precisar
      document.body.classList.add("terms-open");
    } else {
      // Volta para a Home
      termsPage.classList.remove("show");
      kittyRoot.style.display = "flex";
      
      // Delay minúsculo para a animação de fade-in do root funcionar
      setTimeout(() => {
        kittyRoot.classList.add("show");
      }, 10);
      
      document.body.classList.remove("terms-open");
    }

    // O PULO DO GATO: Força o Carrd e o Navegador a recalcular tudo
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resize'));
    
    // Atualiza as setas do carrossel caso o tamanho da tela tenha mudado
    setTimeout(updateArrows, 100); 
  }

});