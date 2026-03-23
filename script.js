/* ============================================================
   EFFECTICAL SERVICE SOLUTIONS — script.js
   Pure JS: Scroll reveal, navbar, mobile nav, FAQ, back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (href && href !== '#' && currentPage.includes(href.replace('.html', '')))) {
      link.classList.add('active');
    }
  });

  /* ── MOBILE NAV TOGGLE ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── BACK TO TOP ── */
  const backTop = document.getElementById('back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── CONTACT FORM ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent Successfully!';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 4000);
    });
  }

});
