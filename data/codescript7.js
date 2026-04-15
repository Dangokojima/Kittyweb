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
  const pricingPage = document.getElementById("pricingPage");
  const projectsPage = document.getElementById("projectsPage");

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

      const pages = [tallyPage, pricingPage, projectsPage, policyPage, termsPage];

      if (pages.some(p => p?.classList.contains("show"))) {
        changePage("home");
      }
    };
  }

  // =========================
  // THEME
  // =========================

  function updateTheme(){
    const isLight = document.body.classList.contains("theme-light");

    safe(themeIcon, el => {
      el.src = isLight
        ? `${BASE}/images/light.svg`
        : `${BASE}/images/dark.svg`;
    });
  }

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.onclick = () => {

      const isLight = document.body.classList.contains("theme-light");

      if (isLight) {
        document.body.classList.remove("theme-light");
        document.body.classList.add("theme-dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-light");
        localStorage.setItem("theme", "light");
      }

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
    sidePanel.onclick = closeMenu;
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

  const servicesGrid = document.querySelector(".services-grid");
  const servicesLeft = document.querySelector(".services-section .arrow-side.left");
  const servicesRight = document.querySelector(".services-section .arrow-side.right");

  const reviewsGrid = document.querySelector(".reviews-grid");
  const reviewsLeft = document.querySelector(".reviews-section .arrow-side.left");
  const reviewsRight = document.querySelector(".reviews-section .arrow-side.right");

  function setupCarousel(grid, leftArrow, rightArrow) {
    if (!grid || !leftArrow || !rightArrow) return;

    function updateArrows() {
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      const current = Math.round(grid.scrollLeft);

      const isOverflowing = maxScroll > 5;

      grid.style.justifyContent = isOverflowing ? "flex-start" : "center";

      const TOLERANCE = 10;

      leftArrow.classList.toggle("disabled", current <= TOLERANCE);
      rightArrow.classList.toggle("disabled", current >= maxScroll - TOLERANCE);
    }

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

  // 🔥 AQUI que você chama
  setupCarousel(servicesGrid, servicesLeft, servicesRight);
  setupCarousel(reviewsGrid, reviewsLeft, reviewsRight);

  // =========================
  // CLOSE HELPERS
  // =========================

  document.querySelectorAll(".side-menu a, .socials img").forEach(el=>{
    el.addEventListener("click", closeMenu);
  });

  // =========================
  // TERMS SPA
  // =========================

  const kittyRoot = document.getElementById("homepage-content");
  const termsPage = document.getElementById("termsPage");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const policyPage = document.getElementById("policyPage");
  
  document.querySelectorAll('[data-open="terms"]').forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      changePage("terms");
      loadTerms();
    });
  });

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu?.();
      changePage(el.dataset.page);
    });
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {

      // 👇 IGNORA BOTÕES SPA
      if (link.dataset.page || link.dataset.open) return;

      if (termsPage?.classList.contains("show")) {
        changePage("home");
      }

      if (tallyPage?.classList.contains("show")) {
        changePage("home");
      }

      if (portfolioPage?.classList.contains("show")) {
        changePage("home");
      }

      if (pricingPage?.classList.contains("show")) {
        changePage("home");
      }

      if (projectsPage?.classList.contains("show")) {
        changePage("home");
      }

      if (policyPage?.classList.contains("show")) {
        changePage("home");
      }

    });
  });
  
  document.addEventListener("click", (e)=>{
    if (e.target === portfolioPage) {
      changePage("home");
    }
  });

  // =========================
  // Static Pages (Terms & Policy)
  // =========================

  function loadTerms() {
    return loadStaticPage({
      page: termsPage,
      file: "terms",
      titleKey: "terms_title",
      fallbackTitle: "Terms",
      closeId: "closeTerms"
    });
  }

  function loadPolicy() {
    return loadStaticPage({
      page: policyPage,
      file: "policy",
      titleKey: "privacy",
      fallbackTitle: "Policy",
      closeId: "closePolicy"
    });
  }

  // =========================
  // TALLY SPA
  // =========================

  const tallyPage = document.getElementById("tallyPage");
  const openTally = document.getElementById("openTally");
  const mobileTally = document.getElementById("mobileTally");
  const tallyPT = document.getElementById("tallyPT");
  const tallyEN = document.getElementById("tallyEN");

  // botão abrir
  openTally?.addEventListener("click", (e) => {
    e.preventDefault();
    changePage("tally");
  });

  mobileTally?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
    changePage("tally");
  });

  document.querySelectorAll("[data-open-tally]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      changePage("tally");
    });
  });

  // =========================
  // LOAD SCRIPT TALLY
  // =========================

  function loadTallyScript() {
    const w = "https://tally.so/widgets/embed.js";

    if (!document.querySelector(`script[src="${w}"]`)) {
      const s = document.createElement("script");
      s.src = w;
      s.onload = () => {
        if (typeof Tally !== "undefined") {
          Tally.loadEmbeds();
        }
      };
      document.body.appendChild(s);
    } else {
      if (typeof Tally !== "undefined") {
        Tally.loadEmbeds();
      }
    }
  }

  const portfolioPage = document.getElementById("portfolioPage");
  const openPortfolio = document.getElementById("openPortfolio");
  const closePortfolio = document.querySelector(".close-portfolio");

  closePortfolio?.addEventListener("click", (e)=>{
    e.preventDefault();
    closePortfolioPage();
  });

  openPortfolio?.addEventListener("click", (e)=>{
    e.preventDefault();
    changePage("portfolio");
  });

  function setupPortfolioFilters(){

    const buttons = document.querySelectorAll(".portfolio-filters button");
    const items = document.querySelectorAll(".portfolio-full-grid .gallery-item");

    if (!buttons.length || !items.length) return;

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {

        // ativa botão
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach(item => {
          const category = item.dataset.category;

          if (filter === "all" || category === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });

      });
    });

  }

  // botão do header (IMPORTANTE)
  document.querySelectorAll('a[href="#portfolio"]').forEach(el=>{
    el.addEventListener("click",(e)=>{
      e.preventDefault();
      changePage("portfolio");
    });
  });

  // =========================
  // Page Manager
  // =========================

  async function loadStaticPage({
    page,
    file,
    titleKey,
    fallbackTitle,
    closeId
  }) {
    const container = page?.querySelector(".terms-container");
    if (!container) return;

    const lang = localStorage.getItem("lang") || "pt";
    const finalFile = lang === "pt" ? `${file}-pt.html` : `${file}-en.html`;

    try {
      // garante tradução
      if (!translations || !translations[titleKey]) {
        await new Promise(resolve => {
          loadTranslations(lang);
          setTimeout(resolve, 200);
        });
      }

      const res = await fetch(`${BASE}/data/${finalFile}?v=${Date.now()}`);
      const html = await res.text();

      container.innerHTML = `
        <h1 class="font-title">${translations[titleKey] || fallbackTitle}</h1>
        ${html}
        <button id="${closeId}" class="cta">
          ${translations.back || "Voltar"}
        </button>
      `;

      document.getElementById(closeId)?.addEventListener("click", (e) => {
        e.preventDefault();
        changePage("home");
      });

    } catch (err) {
      console.error(`Erro ao carregar ${file}:`, err);
    }
  }

  async function changePage(page){

    // =========================
    // RESET GLOBAL
    // =========================

    // esconder todas páginas
    termsPage?.classList.remove("show");
    tallyPage?.classList.remove("show");
    portfolioPage?.classList.remove("show");
    pricingPage?.classList.remove("show");
    projectsPage?.classList.remove("show");
    policyPage?.classList.remove("show");

    // reset geral
    kittyRoot?.classList.remove("hidden");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.classList.remove("terms-open");

    // =========================
    // HOME
    // =========================

    if (page === "home") {
      window.scrollTo(0, 0);
      return;
    }

    // =========================
    // ABRIR PÁGINA
    // =========================

    kittyRoot?.classList.add("hidden");
    document.body.style.overflow = "hidden";

    // =========================
    // TERMS
    // =========================

    if (page === "terms") {
      termsPage?.classList.add("show");

      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("terms-open");

      loadTerms();
    }

    // =========================
    // TALLY
    // =========================

    if (page === "tally") {
      tallyPage?.classList.add("show");

      const lang = localStorage.getItem("lang") || "pt";

      if (lang === "pt") {
        tallyPT?.classList.add("active");
        tallyEN?.classList.remove("active");
      } else {
        tallyEN?.classList.add("active");
        tallyPT?.classList.remove("active");
      }

      loadTallyScript();
    }

    // =========================
    // PORTFOLIO
    // =========================

    if (page === "portfolio") {
      portfolioPage?.classList.add("show");
      await loadGallery();
      setupPortfolioFilters();
    }

    // =========================
    // PREÇOS
    // =========================

    if (page === "pricing") {
      pricingPage?.classList.add("show");
      await loadPricing();
    }

    // =========================
    // PROJETOS
    // =========================

    if (page === "projects") {
      projectsPage?.classList.add("show");
    }

    // =========================
    // POLICY
    // =========================

    if (page === "policy") {
      policyPage?.classList.add("show");

      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("terms-open");

      loadPolicy(); // 👈 importante
    }

    // =========================
    // FINAL
    // =========================

    window.scrollTo(0, 0);
  }

  async function loadGallery(){

    const grid = document.querySelector(".portfolio-full-grid");
    if (!grid) return;

    grid.innerHTML = "";

    try {
      const res = await fetch(`./data/gallery.json?v=${Date.now()}`);
      const data = await res.json();

      Object.entries(data).forEach(([category, items]) => {

        items.forEach(item => {

          const div = document.createElement("div");
          div.className = "gallery-item";
          div.dataset.category = category;

          div.innerHTML = `
            <img src="./gallery/${category}/${item.file}">
          `;

          grid.appendChild(div);

        });

      });

    applyTranslations();
    } catch (err) {
      console.error("Erro ao carregar gallery:", err);
    }

  }

  const imagePopup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImg");

  // abrir
  document.addEventListener("click", (e) => {

    const img = e.target.closest(".gallery-item img");
    if (!img) return;

    popupImg.src = img.src;
    imagePopup.classList.add("show");
  });

  // fechar clicando fora
  imagePopup?.addEventListener("click", () => {
    imagePopup.classList.remove("show");
  });

  async function loadPricing() {
    if (!translations || !translations.addons) {
      await new Promise(resolve => {
        loadTranslations(lang);
        setTimeout(resolve, 200);
      });
    }
    const container = document.getElementById("pricingSections");
    if (!container) return;

    container.innerHTML = "";

    const lang = localStorage.getItem("lang") || "pt";
    const file = lang === "pt" ? "price-pt.json" : "price-en.json";

    try {
      const res = await fetch(`./data/${file}?v=${Date.now()}`);
      const data = await res.json();

      data.categories.forEach(category => {

        const section = document.createElement("div");
        section.className = "pricing-section-block";

        section.innerHTML = `
          <h2 class="pricing-section-title">${category.title}</h2>
          <div class="pricing-grid"></div>
        `;

        const grid = section.querySelector(".pricing-grid");

        category.items.forEach(item => {

          const card = document.createElement("div");
          card.className = "pricing-card";
          
          card.innerHTML = `
            <div class="pricing-title">${item.name}</div>

            ${item.prices?.length ? `
              <div class="pricing-section">
                <div class="pricing-label">${translations.prices}</div>
                <ul>
                  ${item.prices.map(p => `<li>${p}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${item.features?.length ? `
              <div class="pricing-section">
                <div class="pricing-label">${translations.features}</div>
                <ul>
                  ${item.features.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${item.addons?.length ? `
              <div class="pricing-section">
                <div class="pricing-label">${translations.addons}</div>
                <ul>
                  ${item.addons.map(a => `<li>${a}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${item.delivery ? `
              <div class="pricing-section">
                <div class="pricing-label">${translations.delivery}</div>
                <div class="pricing-delivery">⏳ ${item.delivery}</div>
              </div>
            ` : ""}
          `;

          grid.appendChild(card);
        });

        container.appendChild(section);
      });

    } catch (err) {
      console.error("Erro ao carregar pricing:", err);
    }
  }

});