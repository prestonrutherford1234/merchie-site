/* ============================================
   MERCHIE — script.js
   Scroll animations, mobile menu, counters
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();
  initFAQ();
  initSignupForms();
});

/* --- Navigation Scroll Effect --- */
function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      btn.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll, .animate-scale');
  if (!elements.length) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Animated Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(counter => {
      counter.textContent = counter.getAttribute('data-count');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = el.getAttribute('data-count');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const isDecimal = target.includes('.');

  // Parse numeric value
  const numericStr = target.replace(/[^0-9.]/g, '');
  const targetNum = parseFloat(numericStr);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = targetNum * eased;

    if (isDecimal) {
      el.textContent = prefix + current.toFixed(1) + suffix;
    } else {
      el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Signup Forms (Customer.io JavaScript SDK) --- */
function initSignupForms() {

  // --- Hero form: 3-step flow ---
  const heroEmailForm = document.getElementById('heroEmailForm');
  const heroQuestionsForm = document.getElementById('heroQuestionsForm');

  if (heroEmailForm) {
    heroEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('heroEmail').value.trim();
      if (!email) return;

      // Identify in Customer.io with email only (step 1)
      identifyInCIO({ email });
      transitionStep('heroStep1', 'heroStep2');
    });
  }

  if (heroQuestionsForm) {
    heroQuestionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('heroEmail').value.trim();
      const company = document.getElementById('heroCompany').value.trim();
      const revenue = document.getElementById('heroRevenue').value;
      const challenge = document.getElementById('heroChallenge').value.trim();

      // Update the person in Customer.io with additional details
      identifyInCIO({ email, company, revenue, challenge });
      transitionStep('heroStep2', 'heroStep3');
    });
  }

  // --- Footer form: 2-step flow ---
  const footerEmailForm = document.getElementById('footerEmailForm');

  if (footerEmailForm) {
    footerEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footerEmail').value.trim();
      if (!email) return;

      identifyInCIO({ email });
      transitionStep('footerStep1', 'footerStep2');
    });
  }

  // --- Customer.io identify helper ---
  function identifyInCIO(data) {
    if (typeof _cio === 'undefined') {
      console.warn('Customer.io not loaded');
      return;
    }

    const payload = {
      id: data.email,
      email: data.email,
      created_at: Math.floor(Date.now() / 1000),
      source: 'merchie-beta',
      signup_date: new Date().toISOString()
    };

    if (data.company) payload.company = data.company;
    if (data.revenue) payload.revenue_range = data.revenue;
    if (data.challenge) payload.biggest_challenge = data.challenge;

    _cio.identify(payload);
  }

  function transitionStep(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!from || !to) return;

    from.classList.add('fading-out');
    setTimeout(() => {
      from.classList.add('hidden');
      from.classList.remove('fading-out');
      to.classList.remove('hidden');
      to.classList.add('fading-in');
      to.offsetHeight;
      requestAnimationFrame(() => {
        to.classList.remove('fading-in');
      });
    }, 300);
  }
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
