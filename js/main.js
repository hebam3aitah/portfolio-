/* main.js
   - Smooth scroll + active nav
   - Render projects from window.PROJECTS
   - Tabs + carousel (with dots) for projects
   - Copy buttons (email/phone)
   - Contact form -> mailto + WhatsApp
   - Close Bootstrap navbar on mobile after click
*/

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Config
  // -----------------------------
  const YOUR_EMAIL = "hebam3aitah@gmail.com";
  const YOUR_WA = "962789908162";

  // -----------------------------
  // Helpers
  // -----------------------------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  // -----------------------------
  // Smooth scroll + close navbar on mobile
  // -----------------------------
  qsa('.navbar a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = href ? qs(href) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close navbar collapse on mobile (Bootstrap)
      const navCollapse = qs("#navbarNav");
      if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap?.Collapse) {
        new bootstrap.Collapse(navCollapse).hide();
      }
    });
  });

  // -----------------------------
  // Active nav link on scroll
  // -----------------------------
  const sections = qsa("section[id]");
  const navLinks = qsa(".nav-link");

  const setActiveNav = () => {
    if (!sections.length) return;

    let current = sections[0].id;
    sections.forEach((section) => {
      const top = section.offsetTop;
      if (window.pageYOffset >= top - 200) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
    });
  };

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  // -----------------------------
  // Copy buttons (Contact)
  // -----------------------------
  const toast = qs("#copyToast");

  const showToast = (text = "Copied!") => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1200);
  };

  const copyText = async (text) => {
    // Modern clipboard (requires https/localhost)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    // Fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  };

  qsa(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      const ok = await copyText(text);
      showToast(ok ? "Copied!" : "Copy blocked (use https/localhost)");
    });
  });

  // -----------------------------
  // Contact form -> mailto + WhatsApp
  // -----------------------------
  const contactForm = qs("#contactForm");
  const waBtn = qs("#sendWhatsApp");

  const buildMessage = () => {
    const name = (qs("#name")?.value || "").trim();
    const fromEmail = (qs("#fromEmail")?.value || "").trim();
    const subject = (qs("#subject")?.value || "").trim();
    const message = (qs("#message")?.value || "").trim();

    const body =
`Hi Heba,

Name: ${name}
Email: ${fromEmail}

Message:
${message}

— Sent from your portfolio website`;

    return { subject, body };
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const { subject, body } = buildMessage();
      const mailto = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const { subject, body } = buildMessage();
      const text = `${subject}\n\n${body}`;
      const url = `https://wa.me/${YOUR_WA}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
    });
  }

  // ============================================================
  // Projects: render from window.PROJECTS + Tabs + Carousel
  // ============================================================

  // Expecting:
  // window.PROJECTS = [
  //  { title, desc, img, tech:[], github, live, category:"fullstack|frontend|backend" }
  // ]
  const PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  const projectCardHTML = (p) => {
    const techHTML = (p.tech || []).map((t) => `<span class="tool-tag">${t}</span>`).join("");

    const githubBtn = p.github
      ? `<a href="${p.github}" target="_blank" rel="noopener" class="project-link-btn" title="View Code">
           <i class="fa-brands fa-github"></i>
         </a>`
      : "";

    const liveBtn = p.live
      ? `<a href="${p.live}" target="_blank" rel="noopener" class="project-link-btn" title="Live Demo">
           <i class="fa-solid fa-external-link-alt"></i>
         </a>`
      : "";

    const docBtn = p.doc
      ? `<a href="${p.doc}" target="_blank" rel="noopener" class="project-link-btn" title="Documentation">
           <i class="fa-solid fa-book"></i>
         </a>`
      : "";

    return `
      <div class="project-card">
        <div class="project-image">
          <img src="${p.img}" alt="${p.title}">
          <div class="project-overlay">
            <div class="project-links">
              ${githubBtn}
              ${liveBtn}
              ${docBtn}
            </div>
          </div>
        </div>

        <div class="project-body">
          <h4>${p.title}</h4>
          <p class="project-description">${p.desc}</p>

          <div class="project-tools">
            <div class="project-tools-label">
              <i class="fa-solid fa-wrench"></i> Technologies:
            </div>
            <div class="tools-list">${techHTML}</div>
          </div>
        </div>
      </div>
    `;
  };

  const renderProjects = () => {
    const all = qs("#all-carousel");
    const full = qs("#fullstack-carousel");
    const front = qs("#frontend-carousel");
    const back = qs("#backend-carousel");

    if (!PROJECTS.length) return;

    if (all) all.innerHTML = PROJECTS.map(projectCardHTML).join("");
    if (full) full.innerHTML = PROJECTS.filter((p) => p.category === "fullstack").map(projectCardHTML).join("");
    if (front) front.innerHTML = PROJECTS.filter((p) => p.category === "frontend").map(projectCardHTML).join("");
    if (back) back.innerHTML = PROJECTS.filter((p) => p.category === "backend").map(projectCardHTML).join("");
  };

  // Carousel state
  const carouselIds = ["all", "fullstack", "frontend", "backend"];
  const carouselPositions = { all: 0, fullstack: 0, frontend: 0, backend: 0 };

  const getGapPx = (carouselEl) => {
    // Try to read CSS gap from computed style
    const styles = window.getComputedStyle(carouselEl);
    // For flex, browsers may expose gap in `gap` or `columnGap`
    const gap = parseFloat(styles.columnGap || styles.gap || "32");
    return Number.isFinite(gap) ? gap : 32;
  };

  const updateCarouselButtons = (carouselId) => {
    const carousel = qs(`#${carouselId}-carousel`);
    const prevBtn = qs(`.carousel-arrow.prev[data-carousel="${carouselId}"]`);
    const nextBtn = qs(`.carousel-arrow.next[data-carousel="${carouselId}"]`);
    if (!carousel || !prevBtn || !nextBtn) return;

    const cards = qsa(".project-card", carousel);
    const maxPosition = Math.max(0, cards.length - 2);

    prevBtn.disabled = carouselPositions[carouselId] === 0;
    nextBtn.disabled = carouselPositions[carouselId] >= maxPosition;
  };

  const createDots = (carouselId) => {
    const carousel = qs(`#${carouselId}-carousel`);
    const dotsContainer = qs(`#${carouselId}-dots`);
    if (!carousel || !dotsContainer) return;

    const cards = qsa(".project-card", carousel);
    // if we show 2 cards per view, dots ~ cards-1 (like your original)
    const numDots = Math.max(1, cards.length - 1);

    dotsContainer.innerHTML = "";
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => {
        carouselPositions[carouselId] = i;
        moveCarousel(carouselId);
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = (carouselId) => {
    const dotsContainer = qs(`#${carouselId}-dots`);
    if (!dotsContainer) return;

    const dots = qsa(".dot", dotsContainer);
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === carouselPositions[carouselId]);
    });
  };

  const moveCarousel = (carouselId) => {
    const carousel = qs(`#${carouselId}-carousel`);
    if (!carousel) return;

    const cards = qsa(".project-card", carousel);
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = getGapPx(carousel);
    const moveAmount = (cardWidth + gap) * carouselPositions[carouselId];

    carousel.style.transform = `translateX(-${moveAmount}px)`;
    updateCarouselButtons(carouselId);
    updateDots(carouselId);
  };

  // Tabs
  const tabBtns = qsa(".tab-btn");
  const tabContents = qsa(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      if (!tabName) return;

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = qs(`#${tabName}-tab`);
      if (targetTab) targetTab.classList.add("active");

      carouselPositions[tabName] = 0;
      // ensure carousel is recalculated on tab switch
      createDots(tabName);
      updateCarouselButtons(tabName);
      moveCarousel(tabName);
    });
  });

  // Arrows
  qsa(".carousel-arrow").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const carouselId = arrow.getAttribute("data-carousel");
      if (!carouselId) return;

      const carousel = qs(`#${carouselId}-carousel`);
      if (!carousel) return;

      const cards = qsa(".project-card", carousel);
      const maxPosition = Math.max(0, cards.length - 2);

      if (arrow.classList.contains("prev")) {
        carouselPositions[carouselId] = Math.max(0, carouselPositions[carouselId] - 1);
      } else {
        carouselPositions[carouselId] = Math.min(maxPosition, carouselPositions[carouselId] + 1);
      }
      moveCarousel(carouselId);
    });
  });

  // -----------------------------
  // Init projects
  // -----------------------------
  renderProjects();

  // After DOM paints + images start loading, recalc sizes
  // (this prevents "style broken" widths/dots)
  setTimeout(() => {
    carouselIds.forEach((id) => {
      carouselPositions[id] = 0;
      createDots(id);
      updateCarouselButtons(id);
      moveCarousel(id);
    });
  }, 50);

  // Recalc on resize
  window.addEventListener("resize", () => {
    carouselIds.forEach((id) => moveCarousel(id));
  });
});
