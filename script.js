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
  initVirtuousCycle();
  initStickyCTA();
  initNavMochiDance();
  initActivityStatus();
  initFunFacts();
  initKonamiCode();
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

      triggerMochiCelebration();
      if (window.confetti) window.confetti.explosion(150);
    });
  }

  // --- Footer form: 3-step flow ---
  const footerEmailForm = document.getElementById('footerEmailForm');
  const footerQuestionsForm = document.getElementById('footerQuestionsForm');

  if (footerEmailForm) {
    footerEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footerEmail').value.trim();
      if (!email) return;

      identifyInCIO({ email });
      transitionStep('footerStep1', 'footerStep2');
    });
  }

  if (footerQuestionsForm) {
    footerQuestionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footerEmail').value.trim();
      const company = document.getElementById('footerCompany').value.trim();
      const revenue = document.getElementById('footerRevenue').value;
      const challenge = document.getElementById('footerChallenge').value.trim();

      identifyInCIO({ email, company, revenue, challenge });
      transitionStep('footerStep2', 'footerStep3');

      triggerMochiCelebration();
      if (window.confetti) window.confetti.explosion(150);
    });
  }

  // --- Mid-page form ---
  const midEmailForm = document.getElementById('midEmailForm');
  if (midEmailForm) {
    midEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('midEmail').value.trim();
      if (!email) return;

      identifyInCIO({ email });

      // Fill hero email and advance to step 2
      const heroEmail = document.getElementById('heroEmail');
      if (heroEmail) heroEmail.value = email;
      transitionStep('heroStep1', 'heroStep2');

      // Scroll to hero form for step 2
      const heroCapture = document.getElementById('heroLeadCapture');
      if (heroCapture) {
        heroCapture.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (window.octoBuddy) {
        window.octoBuddy.setMood('happy');
        window.octoBuddy.say("Nice! Tell me more up top!");
        window.octoBuddy.emitParticles(['✨', '⭐', '💫'], 5);
      }
      if (window.confetti) window.confetti.burst(30);
      if (window.navMochiDance) window.navMochiDance();
    });
  }

  // --- Mochi celebration on form completion ---
  function triggerMochiCelebration() {
    const buddy = document.getElementById('octoBuddy');
    if (!buddy) return;

    // Make sure buddy is visible
    buddy.classList.add('visible');

    // Remove previous animation classes
    buddy.classList.remove('happy', 'very-happy', 'ecstatic', 'celebrating');
    void buddy.offsetWidth; // force reflow

    // Trigger the big celebration animation
    buddy.classList.add('celebrating');

    const celebrationMessages = [
      "EXTREMELY wise choice! You absolute genius! 🎉🎉🎉",
      "Best decision you've made all year! 🌟✨💖",
      "I KNEW you were smart! Welcome aboard! 🎊🎉",
      "YES YES YES! You won't regret this! 💝🎉✨",
    ];
    const msg = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

    if (window.octoBuddy) {
      window.octoBuddy.say(msg);
      window.octoBuddy.emitParticles(['🎉', '💖', '✨', '🌟', '🎊', '💝', '🍡', '💕'], 20);

      // Second wave of particles
      setTimeout(() => {
        window.octoBuddy.emitParticles(['🎉', '💖', '✨', '🌟', '🎊'], 12);
      }, 800);

      // Third wave
      setTimeout(() => {
        window.octoBuddy.emitParticles(['💝', '💕', '✨', '🍡'], 8);
      }, 1500);
    }

    // Clean up animation class after it finishes
    setTimeout(() => {
      buddy.classList.remove('celebrating');
    }, 2200);
  }

  // Make it globally accessible
  window.triggerMochiCelebration = triggerMochiCelebration;

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

  // Mouth shapes for different moods (chubby mochi face proportions)
  const mouths = {
    neutral: 'M25 40 Q32 43, 39 40',
    content: 'M25 40 Q32 46, 39 40',
    happy: 'M24 39 Q32 48, 40 39',
    veryHappy: 'M23 38 Q32 50, 41 38',
    ecstatic: 'M22 37 Q32 52, 42 37'
  };

  // Accessory elements
  const sparkleAccessory = buddy.querySelector('.buddy-sparkle');
  const hatAccessory = buddy.querySelector('.buddy-hat');
  const streamerAccessory = buddy.querySelector('.buddy-streamer');

  // Section-aware messages
  const sectionMessages = {
    problem: ["Sound familiar?", "We can fix this!", "Good news — there's a better way!"],
    features: ["Ooh, I can do that!", "This is where the magic happens.", "Hidden Gems are my specialty."],
    ads: ["Watch me work!", "From insight to ad — instantly.", "No more waiting for photoshoots."],
    'how-it-works': ["It's really that simple.", "Three steps. That's it.", "Connect and go."],
    results: ["Not bad, right?", "A decade of DTC experience.", "We've seen it all."],
    capabilities: ["Meet the family!", "We're all online 24/7!", "Six agents, one family!"],
    faq: ["Great question!", "Ask away!", "Glad you're curious."]
  };
  let lastSection = null;

  // Track which sections we've shown messages for
  const sectionMessageShown = {};

  // Show buddy after scrolling past hero
  const showThreshold = 400;
  let isVisible = false;

  // Email nudge timer
  let emailNudgeTimeout = null;
  let hasNudged = false;

  function startEmailNudge() {
    if (hasNudged) return;
    emailNudgeTimeout = setTimeout(() => {
      if (!hasNudged && isVisible) {
        hasNudged = true;
        say("Psst... want a demo? ☝️");
        emitParticles(['👆', '✨'], 3);
      }
    }, 30000);
  }

  function updateAccessories(scrollPercent) {
    if (sparkleAccessory) sparkleAccessory.style.opacity = scrollPercent >= 25 ? '1' : '0';
    if (hatAccessory) hatAccessory.style.opacity = scrollPercent >= 50 ? '1' : '0';
    if (streamerAccessory) streamerAccessory.style.opacity = scrollPercent >= 75 ? '1' : '0';
  }

  function detectCurrentSection() {
    const sections = ['problem', 'features', 'ads', 'how-it-works', 'results', 'capabilities', 'faq'];
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          return sections[i];
        }
      }
    }
    return null;
  }

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
        setTimeout(() => say("Hey! I'm Momo, head of the family 👋"), 500);
        startEmailNudge();
      }
    } else if (scrollY <= showThreshold && isVisible) {
      isVisible = false;
      buddy.classList.remove('visible');
    }

    // Update accessories based on scroll depth
    updateAccessories(scrollPercent);

    // Section-aware messages
    const currentSection = detectCurrentSection();
    if (currentSection && currentSection !== lastSection && !sectionMessageShown[currentSection]) {
      lastSection = currentSection;
      sectionMessageShown[currentSection] = true;
      const msgs = sectionMessages[currentSection];
      if (msgs) {
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        setTimeout(() => say(msg), 600);
      }
    }

    // Progressive happiness based on scroll depth
    if (scrollPercent < 20) {
      setMoodQuiet('neutral');
    } else if (scrollPercent < 40) {
      setMoodQuiet('content');
      if (!scrollMilestones['25']) {
        scrollMilestones['25'] = true;
        emitParticles(['✨'], 2);
      }
    } else if (scrollPercent < 60) {
      setMoodQuiet('happy');
      if (!scrollMilestones['50']) {
        scrollMilestones['50'] = true;
        emitParticles(['⭐', '✨'], 3);
      }
    } else if (scrollPercent < 80) {
      setMoodQuiet('veryHappy');
      if (!scrollMilestones['75']) {
        scrollMilestones['75'] = true;
        emitParticles(['🌟', '⭐', '💫'], 4);
      }
    } else {
      setMoodQuiet('ecstatic');
      if (!scrollMilestones['100']) {
        scrollMilestones['100'] = true;
        say("You made it! Get a demo! 🎉");
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

  // Click on buddy for random fun reaction
  const funReactions = [
    { msg: "Boop! 😄", mood: 'happy', emojis: ['💕', '✨'] },
    { msg: "That tickles!", mood: 'veryHappy', emojis: ['😆', '✨', '⭐'] },
    { msg: "Squish! 🍡", mood: 'happy', emojis: ['🍡', '💫'] },
    { msg: "I'm squishy!", mood: 'ecstatic', emojis: ['🎉', '💖', '✨'] },
    { msg: "Hehe! 😊", mood: 'content', emojis: ['💗', '✨'] },
    { msg: "Get a demo! ☝️", mood: 'happy', emojis: ['👆', '⭐'] },
  ];

  buddy.style.pointerEvents = 'auto';
  buddy.style.cursor = 'pointer';
  buddy.addEventListener('click', () => {
    const reaction = funReactions[Math.floor(Math.random() * funReactions.length)];
    setMood(reaction.mood);
    say(reaction.msg);
    emitParticles(reaction.emojis, 4);
  });

  // Progressive dance level tracking
  let interactionScore = 0;
  let currentDanceLevel = 0;

  function updateDanceLevel() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    const scrollScore = Math.floor(scrollPercent / 25);

    const newLevel = Math.min(3, scrollScore + Math.floor(interactionScore / 3));

    if (newLevel !== currentDanceLevel) {
      currentDanceLevel = newLevel;
      buddy.classList.remove('dance-level-1', 'dance-level-2', 'dance-level-3');
      if (newLevel > 0) {
        buddy.classList.add('dance-level-' + newLevel);
      }
    }
  }

  // Count clicks as interaction
  buddy.addEventListener('click', () => {
    interactionScore++;
    updateDanceLevel();
  });

  // Update on scroll (piggybacks on existing scroll handler)
  const origUpdateOnScroll = updateOnScroll;
  function enhancedUpdateOnScroll() {
    origUpdateOnScroll();
    updateDanceLevel();
  }
  // Replace the reference — we re-hook the scroll handler
  window.addEventListener('scroll', () => {
    updateDanceLevel();
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

/* --- Virtuous Cycle Animation --- */
function initVirtuousCycle() {
  const stages = document.querySelectorAll('.cycle-stage');
  const dots = document.querySelectorAll('.cycle-dot');
  if (!stages.length) return;

  let currentStage = 0;
  let intervalId = null;
  let isPaused = false;
  const STAGE_DURATION = 3000;

  function showStage(index) {
    stages.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentStage = index;
  }

  function nextStage() {
    if (isPaused) return;
    showStage((currentStage + 1) % stages.length);
  }

  function startCycle() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextStage, STAGE_DURATION);
  }

  // Show first stage immediately
  showStage(0);
  startCycle();

  // Pause on hover
  const scene = document.querySelector('.cycle-scene');
  if (scene) {
    scene.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    scene.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }

  // Click dots to jump to stage
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const stage = parseInt(dot.getAttribute('data-stage'));
      showStage(stage);
      startCycle(); // restart timer
    });
  });
}

/* --- Sticky CTA Bar --- */
function initStickyCTA() {
  const stickyBar = document.getElementById('stickyCTABar');
  const heroCapture = document.getElementById('heroLeadCapture');
  const footerCapture = document.querySelector('.final-cta');
  if (!stickyBar || !heroCapture) return;

  let hasSubmitted = false;
  let isVisible = false;

  // Check if hero form has been submitted (step 2 or 3 visible)
  function checkSubmitted() {
    const step1 = document.getElementById('heroStep1');
    return step1 && step1.classList.contains('hidden');
  }

  function updateVisibility() {
    if (hasSubmitted || checkSubmitted()) {
      stickyBar.classList.remove('visible');
      return;
    }

    const heroRect = heroCapture.getBoundingClientRect();
    const heroOutOfView = heroRect.bottom < 0;

    let footerInView = false;
    if (footerCapture) {
      const footerRect = footerCapture.getBoundingClientRect();
      footerInView = footerRect.top < window.innerHeight;
    }

    if (heroOutOfView && !footerInView) {
      if (!isVisible) {
        isVisible = true;
        stickyBar.classList.add('visible');
      }
    } else {
      if (isVisible) {
        isVisible = false;
        stickyBar.classList.remove('visible');
      }
    }
  }

  // Throttled scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Handle sticky form submission
  const stickyForm = document.getElementById('stickyEmailForm');
  if (stickyForm) {
    stickyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('stickyEmail').value.trim();
      if (!email) return;

      // Identify in Customer.io
      if (typeof _cio !== 'undefined') {
        _cio.identify({
          id: email,
          email: email,
          created_at: Math.floor(Date.now() / 1000),
          source: 'merchie-beta',
          signup_date: new Date().toISOString()
        });
      }

      hasSubmitted = true;
      stickyBar.classList.remove('visible');

      // Fill the hero email and advance to step 2
      const heroEmail = document.getElementById('heroEmail');
      if (heroEmail) heroEmail.value = email;

      // Celebration
      if (window.octoBuddy) {
        window.octoBuddy.setMood('happy');
        window.octoBuddy.say("Nice! Tell me more up top!");
        window.octoBuddy.emitParticles(['✨', '⭐', '💫'], 5);
      }
      if (window.confetti) window.confetti.burst(30);

      // Scroll to hero and advance form
      const heroStep1 = document.getElementById('heroStep1');
      const heroStep2 = document.getElementById('heroStep2');
      if (heroStep1 && heroStep2) {
        heroStep1.classList.add('hidden');
        heroStep2.classList.remove('hidden');
        document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Dismiss button
  const dismissBtn = stickyBar.querySelector('.sticky-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      stickyBar.classList.remove('visible');
      // Don't show again for 60s
      hasSubmitted = true;
      setTimeout(() => { hasSubmitted = false; }, 60000);
    });
  }
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

/* --- Mobile Touch-to-Dance --- */
(function initTouchDance() {
  if (!('ontouchstart' in window)) return;

  document.querySelectorAll('.trading-card').forEach(card => {
    card.addEventListener('touchstart', (e) => {
      // Toggle dancing
      if (card.classList.contains('touch-dancing')) {
        card.classList.remove('touch-dancing');
        card.classList.remove('show-fun-fact');
      } else {
        card.classList.add('touch-dancing');
        // Show fun fact after dance
        setTimeout(() => {
          card.classList.add('show-fun-fact');
        }, 1500);
        // Auto-remove after animation
        setTimeout(() => {
          card.classList.remove('touch-dancing');
          card.classList.remove('show-fun-fact');
        }, 4000);
      }
    }, { passive: true });
  });
})();

/* --- Mobile Input Focus Fix --- */
(function fixMobileInputFocus() {
  if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;

  document.querySelectorAll('input[type="email"], input[type="text"], textarea, select').forEach(input => {
    input.addEventListener('focus', () => {
      // Delay to let keyboard open, then scroll input into view
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
})();

/* --- Fun Facts (appear after 2s hover) --- */
function initFunFacts() {
  const cards = document.querySelectorAll('.trading-card');
  cards.forEach(card => {
    let hoverTimer = null;
    card.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        card.classList.add('show-fun-fact');
      }, 2000);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      card.classList.remove('show-fun-fact');
    });
  });
}

/* --- Konami Code Easter Egg --- */
function initKonamiCode() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let position = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === code[position]) {
      position++;
      if (position === code.length) {
        position = 0;
        triggerKonamiEasterEgg();
      }
    } else {
      position = 0;
    }
  });

  function triggerKonamiEasterEgg() {
    // All mochis do synchronized dance
    const cards = document.querySelectorAll('.trading-card .card-mochi svg');
    cards.forEach(svg => {
      svg.style.animation = 'mochiGroove 4s ease-in-out 1';
      setTimeout(() => {
        svg.style.animation = '';
      }, 4000);
    });

    // Big confetti explosion
    if (window.confetti) window.confetti.explosion(200);

    // Buddy says something
    if (window.octoBuddy) {
      window.octoBuddy.setMood('ecstatic');
      window.octoBuddy.say("You found the secret! The family approves!");
      window.octoBuddy.emitParticles(['🎉', '🎊', '✨', '💖', '🌟', '🍡'], 20);
    }

    // Second wave
    setTimeout(() => {
      if (window.confetti) window.confetti.explosion(100);
      if (window.octoBuddy) {
        window.octoBuddy.emitParticles(['🎉', '💝', '🎊'], 10);
      }
    }, 1000);
  }
}

/* --- Live Activity Status Cycling --- */
function initActivityStatus() {
  const activities = {
    momo: [
      "Reordering collection #47...",
      "Found 3 Hidden Gems today",
      "Analyzing page 2,847 this hour",
      "Moving a bestseller to position #1",
      "Shopping your site right now",
      "Checking collection sort order",
      "Ranking 1,204 products by LTV",
      "Swapping positions on homepage"
    ],
    max: [
      "Running A/B test #12...",
      "Improved checkout flow +18%",
      "Optimizing landing page #89",
      "Testing new CTA placement",
      "Analyzing funnel drop-off",
      "Conv rate up 2.3% this week",
      "Heat mapping product pages",
      "Split-testing hero layouts"
    ],
    mila: [
      "Launched 5 campaigns today",
      "Shifting budget to top performer",
      "New audience segment discovered",
      "ROAS up 2.1x on latest campaign",
      "Scaling winning creative",
      "Pausing underperformers",
      "Launching retargeting sequence",
      "Budget optimized across 3 channels"
    ],
    maple: [
      "Crunched 847K data points today",
      "Spotted a trend in activewear",
      "Building cohort model #34",
      "Found a hidden LTV pattern",
      "Analyzing customer segments",
      "Correlating traffic to revenue",
      "Processing product analytics",
      "New insight: repeat purchase spike"
    ],
    mars: [
      "Concepting campaign #203...",
      "Designing hooks for a new brand",
      "Storyboarding full-funnel sequence",
      "Brainstorming scroll-stoppers",
      "Creative brief drafted",
      "Mapping awareness → conversion",
      "New angle: lifestyle + product",
      "Ideating 12 hook variations"
    ],
    mika: [
      "Rendered 14 assets this hour",
      "Cutting a lifestyle reel",
      "Adapting creative for 3 formats",
      "Same-day turnaround #2,847",
      "Exporting for Meta + TikTok",
      "Resizing for Stories format",
      "Batch rendering product shots",
      "Video edit done in 4 minutes"
    ]
  };

  const statusEls = document.querySelectorAll('.card-status');
  if (!statusEls.length) return;

  // Initialize each with a random activity
  statusEls.forEach(el => {
    const agent = el.dataset.agent;
    const pool = activities[agent];
    if (!pool) return;
    el.textContent = pool[Math.floor(Math.random() * pool.length)];
  });

  // Cycle every 4s with fade transition
  setInterval(() => {
    statusEls.forEach(el => {
      const agent = el.dataset.agent;
      const pool = activities[agent];
      if (!pool) return;

      el.classList.add('fading');
      setTimeout(() => {
        el.textContent = pool[Math.floor(Math.random() * pool.length)];
        el.classList.remove('fading');
      }, 400);
    });
  }, 4000);
}

/* --- Nav Mochi Dance --- */
function initNavMochiDance() {
  const navMochi = document.querySelector('.nav-mochi');
  if (!navMochi) return;

  function triggerDance() {
    navMochi.classList.remove('dancing');
    void navMochi.offsetWidth; // force reflow to restart animation
    navMochi.classList.add('dancing');
    setTimeout(() => navMochi.classList.remove('dancing'), 600);
  }

  // Dance on form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      setTimeout(triggerDance, 100);
    });
  });

  // Dance on scroll milestones (25%, 50%, 75%, 100%)
  const danced = {};
  window.addEventListener('scroll', () => {
    const pct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    [25, 50, 75, 100].forEach(m => {
      if (pct >= m && !danced[m]) {
        danced[m] = true;
        triggerDance();
      }
    });
  });

  // Dance when buddy is clicked
  const buddy = document.getElementById('octoBuddy');
  if (buddy) {
    buddy.addEventListener('click', triggerDance);
  }

  // Dance on FAQ open
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => setTimeout(triggerDance, 200));
  });

  // Expose globally for other triggers
  window.navMochiDance = triggerDance;
}
