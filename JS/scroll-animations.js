(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = [
    ".main-content > .topbar",
    ".main-content .container > .header",
    ".main-content .top-bar",
    ".main-content .section-container",
    ".main-content .section-header",
    ".main-content .section-title",
    ".main-content .tabs",
    ".main-content .calendar-header",
    ".main-content .calendar-grid",
    ".main-content .filter-tabs",
    ".main-content .data-status",
    ".main-content .cards-grid > *",
    ".main-content .grid-torneos > *",
    ".main-content .carousel > *",
    ".main-content .groups-grid > *",
    ".main-content #bracketContainer > *",
    ".main-content .purchases-list > *",
    "main > section",
    ".hero-content > *",
    ".torneo-acceso-card",
    ".contact-form > *",
    ".footer-col",
    ".header .logo-container",
    ".login-container > .login-box",
  ].join(",");

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<span></span>";
  document.body.append(progress);
  const progressFill = progress.firstElementChild;
  let progressFrame = 0;

  const updateProgress = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const amount = range > 0 ? window.scrollY / range : 0;
      progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
      progressFrame = 0;
    });
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(targets).forEach((node) => node.classList.add("is-visible"));
    updateProgress();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  const reveal = (root) => {
    if (!(root instanceof Element)) return;
    const nodes = [];
    if (root.matches(targets)) nodes.push(root);
    nodes.push(...root.querySelectorAll(targets));
    nodes.forEach((node) => {
      if (node.classList.contains("scroll-reveal")) return;
      const siblings = [...node.parentElement.children].filter((item) => item.matches(targets));
      const delay = Math.min(siblings.indexOf(node), 4) * 65;
      node.style.setProperty("--reveal-delay", `${Math.max(0, delay)}ms`);
      node.classList.add("scroll-reveal");
      observer.observe(node);
    });
  };

  reveal(document.body);
  const mutations = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach(reveal));
  });
  mutations.observe(document.body, { childList: true, subtree: true });
  updateProgress();
})();
