/* ============================================================
   EFFECTICAL SERVICE SOLUTIONS — components.js
   Shared component loader: header, footer, and all UI logic.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. INJECT HEADER & FOOTER ── */
  async function loadComponent(selector, file) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.warn('Component load error:', err);
    }
  }

  async function initComponents() {
    await loadComponent('#site-header', 'header.html');
    await loadComponent('#site-footer', 'footer.html');

    // After both are injected, run all UI init
    setFooterYear();
    setActiveNav();
    initNavbar();
    initMobileNav();
    initBackToTop();
    initReveal();
    initCounters();
    initFAQ();
    initContactForm();
  }

  /* ── 2. FOOTER YEAR ── */
  function setFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── 3. ACTIVE NAV LINK ── */
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('[data-page]').forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  }

  /* ── 4. NAVBAR SCROLL BEHAVIOUR ── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 5. MOBILE NAV TOGGLE ── */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav  = document.getElementById('mobileNav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 6. BACK TO TOP ── */
  function initBackToTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 7. SCROLL REVEAL ── */
  function initReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  /* ── 8. ANIMATED COUNTERS ── */
  function animateCounter(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    const start   = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── 9. FAQ ACCORDION ── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item   = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        // Toggle clicked
        if (!isOpen) {
          item.classList.add('open');
          q.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard support
      q.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          q.click();
        }
      });
    });
  }

  /* ── 10. CONTACT FORM ── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn      = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      btn.innerHTML  = '✓ Message Sent — We\'ll be in touch soon!';
      btn.disabled   = true;
      btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled  = false;
        btn.style.background = '';
        form.reset();
      }, 4500);
    });
  }

  /* ── BOOT ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }

})();
