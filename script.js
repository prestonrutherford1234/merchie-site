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
  initOctoBuddy();
  initConfetti();
  initCursorGlow();
  initTiltCards();
  initTextReveal();
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

      identifyInCIO({ email });
      transitionStep('heroStep1', 'heroStep2');

      // Celebration: buddy gets happy + small confetti burst
      if (window.octoBuddy) {
        window.octoBuddy.setMood('happy');
        window.octoBuddy.say("Nice! Tell me more!");
        window.octoBuddy.emitParticles(['✨', '⭐', '💫'], 5);
      }
      if (window.confetti) window.confetti.burst(30);
    });
  }

  if (heroQuestionsForm) {
    heroQuestionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('heroEmail').value.trim();
      const company = document.getElementById('heroCompany').value.trim();
      const revenue = document.getElementById('heroRevenue').value;
      const challenge = document.getElementById('heroChallenge').value.trim();

      identifyInCIO({ email, company, revenue, challenge });
      transitionStep('heroStep2', 'heroStep3');

      // BIG celebration: ecstatic octopus + confetti explosion + hearts
      if (window.octoBuddy) {
        window.octoBuddy.setMood('ecstatic');
        window.octoBuddy.say("YOU'RE IN! 🎉🎉🎉");
        window.octoBuddy.emitParticles(['❤️', '🎁', '🎉', '🌟', '💝', '🎊'], 15);
      }
      if (window.confetti) window.confetti.explosion(150);
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

      if (window.octoBuddy) {
        window.octoBuddy.setMood('ecstatic');
        window.octoBuddy.say("Welcome aboard! 🎉");
        window.octoBuddy.emitParticles(['❤️', '🎉', '🌟', '💝'], 10);
      }
      if (window.confetti) window.confetti.explosion(100);
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

/* --- Floating Octopus Buddy --- */
function initOctoBuddy() {
  const buddy = document.getElementById('octoBuddy');
  const bubble = document.getElementById('buddyBubble');
  const particles = document.getElementById('buddyParticles');
  const mouth = buddy?.querySelector('.buddy-mouth');
  const cheekL = buddy?.querySelector('.buddy-cheek-l');
  const cheekR = buddy?.querySelector('.buddy-cheek-r');
  if (!buddy) return;

  let currentMood = 'neutral';
  let bubbleTimeout = null;
  let hasShownGreeting = false;
  let scrollMilestones = { '25': false, '50': false, '75': false, '100': false };

  // Mouth shapes for different moods
  const mouths = {
    neutral: 'M25 34 Q32 38, 39 34',
    content: 'M25 34 Q32 40, 39 34',
    happy: 'M24 33 Q32 42, 40 33',
    veryHappy: 'M23 32 Q32 44, 41 32',
    ecstatic: 'M22 31 Q32 46, 42 31'
  };

  // Show buddy after scrolling past hero
  const showThreshold = 400;
  let isVisible = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Show/hide buddy
    if (scrollY > showThreshold && !isVisible) {
      isVisible = true;
      buddy.classList.add('visible');
      if (!hasShownGreeting) {
        hasShownGreeting = true;
        setTimeout(() => say("Hey! I'm Merchie 👋"), 500);
      }
    } else if (scrollY <= showThreshold && isVisible) {
      isVisible = false;
      buddy.classList.remove('visible');
    }

    // Progressive happiness based on scroll depth
    if (scrollPercent < 20) {
      setMoodQuiet('neutral');
    } else if (scrollPercent < 40) {
      setMoodQuiet('content');
      if (!scrollMilestones['25']) {
        scrollMilestones['25'] = true;
        say("Keep going! ✨");
        emitParticles(['✨'], 2);
      }
    } else if (scrollPercent < 60) {
      setMoodQuiet('happy');
      if (!scrollMilestones['50']) {
        scrollMilestones['50'] = true;
        say("Ooh, good stuff! 🤓");
        emitParticles(['⭐', '✨'], 3);
      }
    } else if (scrollPercent < 80) {
      setMoodQuiet('veryHappy');
      if (!scrollMilestones['75']) {
        scrollMilestones['75'] = true;
        say("Almost there! 🎯");
        emitParticles(['🌟', '⭐', '💫'], 4);
      }
    } else {
      setMoodQuiet('ecstatic');
      if (!scrollMilestones['100']) {
        scrollMilestones['100'] = true;
        say("You made it! Join us! 🎉");
        emitParticles(['🎉', '❤️', '🌟'], 5);
        if (window.confetti) window.confetti.burst(20);
      }
    }
  }

  // Set mood without animation trigger (for scroll-based updates)
  function setMoodQuiet(mood) {
    if (currentMood === mood) return;
    currentMood = mood;
    if (mouth) mouth.setAttribute('d', mouths[mood] || mouths.neutral);

    // Cheeks get rosier with happiness
    const cheekOpacity = { neutral: 0.3, content: 0.35, happy: 0.45, veryHappy: 0.55, ecstatic: 0.65 };
    const cheekSize = { neutral: 3, content: 3.5, happy: 4, veryHappy: 4.5, ecstatic: 5 };
    const op = cheekOpacity[mood] || 0.3;
    const sz = cheekSize[mood] || 3;
    if (cheekL) { cheekL.setAttribute('opacity', op); cheekL.setAttribute('r', sz); }
    if (cheekR) { cheekR.setAttribute('opacity', op); cheekR.setAttribute('r', sz); }
  }

  // Set mood WITH animation (for event-triggered celebrations)
  function setMood(mood) {
    setMoodQuiet(mood);
    buddy.classList.remove('happy', 'very-happy', 'ecstatic');
    void buddy.offsetWidth; // force reflow
    if (mood === 'happy' || mood === 'content') buddy.classList.add('happy');
    else if (mood === 'veryHappy') buddy.classList.add('very-happy');
    else if (mood === 'ecstatic') buddy.classList.add('ecstatic');
  }

  function say(text) {
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('show');
    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('show');
    }, 3000);
  }

  function emitParticles(emojis, count) {
    if (!particles) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const p = document.createElement('span');
        p.className = 'buddy-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = (Math.random() * 40 - 10) + 'px';
        p.style.animationDelay = (Math.random() * 0.3) + 's';
        p.style.animationDuration = (1 + Math.random() * 0.8) + 's';
        particles.appendChild(p);
        setTimeout(() => p.remove(), 2000);
      }, i * 100);
    }
  }

  // Throttled scroll listener
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Expose API for form celebrations
  window.octoBuddy = { setMood, say, emitParticles };
}

/* --- Confetti System --- */
function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FF6B6B', '#F4A261', '#1B4332', '#D4A84B', '#C73D75', '#FF9E9E', '#4CAF50', '#2196F3'];

  function createParticle(x, y) {
    return {
      x: x || Math.random() * canvas.width,
      y: y || -10,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -8 - 4,
      gravity: 0.15 + Math.random() * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      decay: 0.005 + Math.random() * 0.005,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    };
  }

  function animate() {
    if (particles.length === 0) { animating = false; return; }
    animating = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;
      p.vx *= 0.99;

      if (p.opacity <= 0 || p.y > canvas.height + 20) return false;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    });

    requestAnimationFrame(animate);
  }

  // Small burst — used for scroll milestones
  function burst(count) {
    const cx = window.innerWidth - 60;
    const cy = window.innerHeight - 60;
    for (let i = 0; i < count; i++) {
      const p = createParticle(cx, cy);
      p.vx = (Math.random() - 0.5) * 8;
      p.vy = -Math.random() * 6 - 2;
      particles.push(p);
    }
    if (!animating) animate();
  }

  // Big explosion — used for form submissions
  function explosion(count) {
    // Multi-point explosion across the screen
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const p = createParticle(x, -10);
      p.vy = Math.random() * 2 + 1;
      p.gravity = 0.08 + Math.random() * 0.08;
      p.decay = 0.003 + Math.random() * 0.003;
      particles.push(p);
    }
    // Also burst from the buddy corner
    const cx = window.innerWidth - 60;
    const cy = window.innerHeight - 60;
    for (let i = 0; i < Math.floor(count / 3); i++) {
      const p = createParticle(cx, cy);
      p.vx = (Math.random() - 0.5) * 16;
      p.vy = -Math.random() * 12 - 4;
      particles.push(p);
    }
    if (!animating) animate();
  }

  window.confetti = { burst, explosion };
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

/* --- Cursor Glow Effect --- */
function initCursorGlow() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
  });

  // Smooth follow with lerp
  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* --- 3D Tilt on Cards --- */
function initTiltCards() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.feature-visual, .problem-card, .ads-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --- Text Reveal Animation --- */
function initTextReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Add a typewriter effect to the hero counter stats when they come into view
  const stats = document.querySelectorAll('.stat-value');
  stats.forEach(stat => {
    stat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  // Add staggered reveal to section eyebrows
  const eyebrows = document.querySelectorAll('.eyebrow');
  eyebrows.forEach(eyebrow => {
    if (eyebrow.closest('.hero')) return; // hero already has its own animation
    eyebrow.style.opacity = '0';
    eyebrow.style.transform = 'translateY(10px)';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          eyebrow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          eyebrow.style.opacity = '1';
          eyebrow.style.transform = 'translateY(0)';
          observer.unobserve(eyebrow);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(eyebrow);
  });

  // Number counter glow effect when counting
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counter.style.textShadow = '0 0 20px var(--coral-glow-strong)';
          setTimeout(() => {
            counter.style.transition = 'text-shadow 1s ease';
            counter.style.textShadow = 'none';
          }, 1600);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}
