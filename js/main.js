document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     CONFIG
  ============================================================ */
  const YOUR_EMAIL = "hebam3aitah@gmail.com";
  const YOUR_WA = "962789908162";

  /* ============================================================
     HELPERS
  ============================================================ */
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  const visibleCount = () => (window.innerWidth <= 768 ? 1 : 2);
/* =========================
   GREETING SPLASH
========================= */
const splash = qs("#splash");
const greetingEl = qs("#greeting");

if (splash && greetingEl) {
  const greetings = [
    "Hello", "مرحبا", "Ciao", "Hola", "Bonjour", "Hallo",
    "Olá", "Привет", "你好", "こんにちは", "안녕하세요"
  ];

  let i = 0;
  const switchEveryMs = 180;     // سرعة التبديل
  const totalDurationMs = 2000;  // مدة ظهور الترحيب

  const interval = setInterval(() => {
    greetingEl.textContent = greetings[i % greetings.length];
    i++;
  }, switchEveryMs);

  setTimeout(() => {
    clearInterval(interval);
    splash.classList.add("hide");
  }, totalDurationMs);
}
/* ============================================================
   PARALLAX SCROLL EFFECT
============================================================ */
const parallaxElements = qsa('.skill-card, .experience-card, .project-card');

window.addEventListener('scroll', () => {
  if (window.innerWidth < 768) return; // بس للديسكتوب

  const scrolled = window.pageYOffset;

  parallaxElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const elementTop = rect.top + scrolled;
    const speed = 0.05 + (index % 3) * 0.02;

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const yPos = -(scrolled - elementTop) * speed;
      el.style.transform = `translateY(${yPos}px)`;
    }
  });
});
/* =========================
   HERO ROLE TOGGLE
========================= */

const heroRole = qs("#heroRole");

if (heroRole) {
  const roles = [
    "Full Stack Web Developer",
    "React & Node.js ",
    "Software Engineer"
    
  ];

  let i = 0;

  setInterval(() => {
    heroRole.style.opacity = 0;

    setTimeout(() => {
      i = (i + 1) % roles.length;
      heroRole.textContent = roles[i];
      heroRole.style.opacity = 1;
    }, 250);
  }, 2000);
}

  /* ============================================================
     SMOOTH SCROLL + CLOSE NAVBAR (MOBILE)
  ============================================================ */
  qsa('.navbar a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const target = href ? qs(href) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const nav = qs("#navbarNav");
      if (nav?.classList.contains("show") && window.bootstrap?.Collapse) {
        new bootstrap.Collapse(nav).hide();
      }
    });
  });

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
  ============================================================ */
  const sections = qsa("section[id]");
  const navLinks = qsa(".nav-link");

  const setActiveNav = () => {
    if (!sections.length) return;

    let current = sections[0].id;
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });

    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* ============================================================
     COPY BUTTONS (EMAIL / PHONE)
  ============================================================ */
  const toast = qs("#copyToast");

  const showToast = (txt = "Copied!") => {
    if (!toast) return;
    toast.textContent = txt;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1200);
  };

  const copyText = async (txt) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(txt);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
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
      const ok = await copyText(btn.dataset.copy || "");
      showToast(ok ? "Copied!" : "Copy blocked");
    });
  });

  /* ============================================================
     CONTACT FORM (MAILTO + WHATSAPP)
  ============================================================ */
  const form = qs("#contactForm");
  const waBtn = qs("#sendWhatsApp");

  const buildMsg = () => {
    const name = (qs("#name")?.value || "").trim();
    const email = (qs("#fromEmail")?.value || "").trim();
    const subject = (qs("#subject")?.value || "").trim();
    const msg = (qs("#message")?.value || "").trim();

    return {
      subject,
      body: `Hi Heba,

Name: ${name}
Email: ${email}

Message:
${msg}

— Sent from portfolio`,
    };
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const { subject, body } = buildMsg();
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  });

  waBtn?.addEventListener("click", () => {
    const { subject, body } = buildMsg();
    window.open(
      `https://wa.me/${YOUR_WA}?text=${encodeURIComponent(subject + "\n\n" + body)}`,
      "_blank",
      "noopener"
    );
  });

  /* ============================================================
     PROJECTS (RENDER + TABS + CAROUSEL + SWIPE)
  ============================================================ */
  const PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  const carouselIds = ["all", "fullstack", "frontend", "backend"];
  const pos = { all: 0, fullstack: 0, frontend: 0, backend: 0 };

  const projectCardHTML = (p) => {
    const techHTML = (p.tech || [])
      .map((t) => `<span class="tool-tag">${t}</span>`)
      .join("");

    const githubBtn = p.github
      ? `<a href="${p.github}" target="_blank" rel="noopener"
            class="project-link-btn" title="View Code">
            <i class="fa-brands fa-github"></i>
         </a>`
      : "";

    const liveBtn = p.live
      ? `<a href="${p.live}" target="_blank" rel="noopener"
            class="project-link-btn" title="Live Demo">
            <i class="fa-solid fa-external-link-alt"></i>
         </a>`
      : "";

    const docBtn = p.doc
      ? `<a href="${p.doc}" target="_blank" rel="noopener"
            class="project-link-btn" title="Documentation">
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
    if (full)
      full.innerHTML = PROJECTS.filter((p) => p.category === "fullstack")
        .map(projectCardHTML)
        .join("");
    if (front)
      front.innerHTML = PROJECTS.filter((p) => p.category === "frontend")
        .map(projectCardHTML)
        .join("");
    if (back)
      back.innerHTML = PROJECTS.filter((p) => p.category === "backend")
        .map(projectCardHTML)
        .join("");
  };

  const getGapPx = (carouselEl) => {
    const styles = window.getComputedStyle(carouselEl);
    const gap = parseFloat(styles.columnGap || styles.gap || "32");
    return Number.isFinite(gap) ? gap : 32;
  };

  const maxPositionFor = (id) => {
    const car = qs(`#${id}-carousel`);
    if (!car) return 0;
    const cards = qsa(".project-card", car);
    return Math.max(0, cards.length - visibleCount());
  };

  const updateDots = (id) => {
    const dots = qsa(`#${id}-dots .dot`);
    dots.forEach((d, i) => d.classList.toggle("active", i === pos[id]));
  };

  const createDots = (id) => {
    const dotsWrap = qs(`#${id}-dots`);
    const car = qs(`#${id}-carousel`);
    if (!dotsWrap || !car) return;

    const numDots = maxPositionFor(id) + 1; // الصحيح حسب عدد الأعمدة
    dotsWrap.innerHTML = "";

    for (let i = 0; i < numDots; i++) {
      const d = document.createElement("div");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => {
        pos[id] = i;
        moveCarousel(id);
      });
      dotsWrap.appendChild(d);
    }
  };

  const updateArrows = (id) => {
    const prev = qs(`.carousel-arrow.prev[data-carousel="${id}"]`);
    const next = qs(`.carousel-arrow.next[data-carousel="${id}"]`);
    if (!prev || !next) return;

    const maxPos = maxPositionFor(id);
    prev.disabled = pos[id] <= 0;
    next.disabled = pos[id] >= maxPos;
  };

  const moveCarousel = (id) => {
    const car = qs(`#${id}-carousel`);
    if (!car) return;

    const cards = qsa(".project-card", car);
    if (!cards.length) return;

    const gap = getGapPx(car);
    const move = (cards[0].offsetWidth + gap) * pos[id];

    car.style.transform = `translateX(-${move}px)`;
    updateDots(id);
    updateArrows(id);
  };

  // Tabs
  qsa(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (!tab) return;

      qsa(".tab-btn").forEach((b) => b.classList.remove("active"));
      qsa(".tab-content").forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      qs(`#${tab}-tab`)?.classList.add("active");

      pos[tab] = 0;
      createDots(tab);
      moveCarousel(tab);
      updateArrows(tab);
    });
  });

  // Arrows
  qsa(".carousel-arrow").forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.dataset.carousel;
      if (!id) return;

      const maxPos = maxPositionFor(id);

      if (a.classList.contains("next")) pos[id] = Math.min(maxPos, pos[id] + 1);
      else pos[id] = Math.max(0, pos[id] - 1);

      moveCarousel(id);
    });
  });

  /* =========================
     SWIPE (TOUCH) SUPPORT
  ========================= */
const addSwipe = (id) => {
  const car = qs(`#${id}-carousel`);
  if (!car) return;

  const THRESH = 55;

  // ===== TOUCH =====
  let tStartX = 0, tStartY = 0, tDragging = false;

  const tStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    tStartX = t.clientX;
    tStartY = t.clientY;
    tDragging = true;
  };

  const tMove = (e) => {
    if (!tDragging) return;
    const t = e.touches?.[0];
    if (!t) return;

    const dx = t.clientX - tStartX;
    const dy = t.clientY - tStartY;

    // امنعي سكرول الصفحة فقط إذا السحب أفقي
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  };

  const tEnd = (e) => {
    if (!tDragging) return;
    tDragging = false;

    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - tStartX;
    const dy = t.clientY - tStartY;

    if (Math.abs(dy) > Math.abs(dx)) return;

    const maxPos = maxPositionFor(id);
    if (dx <= -THRESH) pos[id] = Math.min(maxPos, pos[id] + 1);
    else if (dx >= THRESH) pos[id] = Math.max(0, pos[id] - 1);

    moveCarousel(id);
  };

  car.addEventListener("touchstart", tStart, { passive: true });
  car.addEventListener("touchmove", tMove, { passive: false });
  car.addEventListener("touchend", tEnd, { passive: true });

  // ===== MOUSE DRAG (DESKTOP) =====
  let mDown = false;
  let mStartX = 0;

  car.style.cursor = "grab";

  const mDownFn = (e) => {
    // لو ضغط على لينك/زر داخل الكارد لا نسحب
    if (e.target.closest("a, button")) return;

    mDown = true;
    mStartX = e.clientX;
    car.style.cursor = "grabbing";
    car.style.userSelect = "none";
  };

  const mMoveFn = (e) => {
    if (!mDown) return;
    // ما بنحرك الكاروسيل live (عشان يبقى بسيط)، بس بنجهز dx
  };

  const mUpFn = (e) => {
    if (!mDown) return;
    mDown = false;
    car.style.cursor = "grab";
    car.style.userSelect = "";

    const dx = e.clientX - mStartX;
    const maxPos = maxPositionFor(id);

    if (dx <= -THRESH) pos[id] = Math.min(maxPos, pos[id] + 1);
    else if (dx >= THRESH) pos[id] = Math.max(0, pos[id] - 1);

    moveCarousel(id);
  };

  car.addEventListener("mousedown", mDownFn);
  window.addEventListener("mousemove", mMoveFn);
  window.addEventListener("mouseup", mUpFn);
};

  /* ============================================================
     INIT
  ============================================================ */
  renderProjects();

  setTimeout(() => {
    carouselIds.forEach((id) => {
      pos[id] = 0;
      createDots(id);
      moveCarousel(id);
      updateArrows(id);
      addSwipe(id);
    });
  }, 50);

  window.addEventListener("resize", () => {
    carouselIds.forEach((id) => {
      createDots(id); 
      pos[id] = Math.min(pos[id], maxPositionFor(id));
      moveCarousel(id);
      updateArrows(id);
    });
  });
  
});

