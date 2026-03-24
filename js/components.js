/* ============================================================
   js/components.js
   Loads shared header & footer, sets active nav, runs all UI.
   Works from both root (index.html) and pages/ subfolder.
   ============================================================ */

(function () {
  'use strict';

  /* ── PATH RESOLUTION ──
     Pages inside /pages/ need "../assets/" prefix.
     index.html at root needs "assets/" prefix.          */
  const inSubfolder = window.location.pathname.includes('/pages/');
  const base        = inSubfolder ? '../assets/' : 'assets/';
  const cssBase     = inSubfolder ? '../css/'    : 'css/';

  /* ── 1. INJECT HTML COMPONENT ── */
  async function loadComponent(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(base + file);
      if (!res.ok) throw new Error(`Cannot load ${file}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.warn('Component error:', err);
    }
  }

  /* ── 2. FIX RELATIVE LINKS in injected HTML ──
     When inside /pages/, hrefs like "index.html" → "../index.html"
     and "pages/about.html" → "../pages/about.html"          */
  function fixLinks(containerSelector) {
    if (!inSubfolder) return;
    const el = document.querySelector(containerSelector);
    if (!el) return;
    el.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('../') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      a.setAttribute('href', href.startsWith('pages/') ? '../' + href : '../' + href.replace(/^\.\//, ''));
    });
  }

  /* ── 3. ACTIVE NAV ── */
  function setActiveNav() {
    const filename = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('[data-page]').forEach(link => {
      if (link.dataset.page === filename) link.classList.add('active');
    });
  }

  /* ── 4. NAVBAR SCROLL ── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 5. MOBILE NAV ── */
  function initMobileNav() {
    const btn = document.getElementById('hamburger');
    const mob = document.getElementById('mobileNav');
    if (!btn || !mob) return;

    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      mob.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });

    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      btn.classList.remove('open');
      mob.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }));

    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !mob.contains(e.target)) {
        btn.classList.remove('open');
        mob.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 6. BACK TO TOP ── */
  function initBackToTop() {
    const bt = document.getElementById('back-top');
    if (!bt) return;
    window.addEventListener('scroll', () => bt.classList.toggle('show', window.scrollY > 400), { passive: true });
    bt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 7. FOOTER YEAR ── */
  function setYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── 8. SCROLL REVEAL ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ── 9. ANIMATED COUNTERS ── */
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target, target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '';
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / 1800, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    els.forEach(el => obs.observe(el));
  }

  /* ── 10. FAQ ACCORDION ── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item'), isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
      });
      q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
    });
  }

  /* ── 11. CONTACT FORM ── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message sent! We\'ll be in touch soon.';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; form.reset(); }, 4500);
    });
  }

  /* ── BOOT ── */
  async function boot() {
    await Promise.all([
      loadComponent('#site-header', 'header.html'),
      loadComponent('#site-footer', 'footer.html'),
    ]);
    fixLinks('#site-header');
    fixLinks('#site-footer');
    setYear();
    setActiveNav();
    initNavbar();
    initMobileNav();
    initBackToTop();
    initReveal();
    initCounters();
    initFAQ();
    initContactForm();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

})();
