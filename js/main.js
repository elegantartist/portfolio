/* ============================================================
   Portfolio — Alex Chen · main.js
   ============================================================ */

'use strict';

/* ── 1. NAVBAR: scroll-class + active link ─────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky glass effect
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Highlight active section
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. MOBILE HAMBURGER ───────────────────────────────────── */
(function initHamburger() {
  const btn     = document.getElementById('hamburger');
  const linksEl = document.getElementById('navLinks');

  if (!btn || !linksEl) return;

  btn.addEventListener('click', () => {
    const open = linksEl.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  linksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      linksEl.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── 3. TYPEWRITER EFFECT ──────────────────────────────────── */
(function initTypewriter() {
  const el    = document.getElementById('typedText');
  if (!el) return;

  const words = [
    'Python Developer',
    'Backend Engineer',
    'API Architect',
    'Data Engineer',
    'ML Enthusiast',
    'Open-Source Author',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseMs  = 0;

  function tick() {
    const word    = words[wordIdx];
    const current = deleting
      ? word.slice(0, --charIdx)
      : word.slice(0, ++charIdx);

    el.textContent = current;

    if (!deleting && charIdx === word.length) {
      pauseMs  = 1600;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      pauseMs  = 300;
    } else {
      pauseMs = deleting ? 55 : 95;
    }

    setTimeout(tick, pauseMs);
  }

  setTimeout(tick, 900);
})();

/* ── 4. PARTICLE CANVAS ─────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const COUNT       = 60;
  const PY_BLUE     = '55, 118, 171';
  const PY_YELLOW   = '255, 212, 59';
  const LINK_DIST   = 130;
  const MOUSE_REPEL = 90;

  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2 + 1;
    this.col = Math.random() > 0.75 ? PY_YELLOW : PY_BLUE;
  };

  Particle.prototype.update = function () {
    // Mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const d  = Math.hypot(dx, dy);
    if (d < MOUSE_REPEL) {
      const force = (MOUSE_REPEL - d) / MOUSE_REPEL * 0.8;
      this.vx += (dx / d) * force;
      this.vy += (dy / d) * force;
    }

    // Damping
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.col}, ${(1 - d / LINK_DIST) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col}, 0.7)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
  });

  init();
  draw();
})();

/* ── 5. COUNTER ANIMATION (hero stats) ──────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  let done = false;

  function animateCounters() {
    if (done) return;
    done = true;
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1400;
      const start  = performance.now();

      function frame(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      }
      requestAnimationFrame(frame);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      animateCounters();
      obs.disconnect();
    }
  }, { threshold: 0.4 });

  const hero = document.querySelector('.hero-stats');
  if (hero) obs.observe(hero);
})();

/* ── 6. SCROLL REVEAL ANIMATIONS ──────────────────────────────── */
(function initReveal() {
  // Add 'reveal' to generic section children
  const autoReveal = [
    '.skill-category',
    '.project-card',
    '.contact-link',
    '.proficiency',
  ];

  autoReveal.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 70}ms`;
    });
  });

  // Timeline items already have .timeline-item animation
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => obs.observe(el));
})();

/* ── 7. SKILL BAR ANIMATION ──────────────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll('.bar-fill[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
})();

/* ── 8. CONTACT FORM (simulated submit) ──────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fields   = ['fname', 'femail', 'fmessage'];
    let   hasError = false;

    fields.forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const empty = !input.value.trim();
      input.classList.toggle('error', empty);
      if (empty) hasError = true;
    });

    const emailInput = document.getElementById('femail');
    if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('error');
      hasError = true;
    }

    if (hasError) {
      note.textContent = 'Please fill in all required fields correctly.';
      note.className   = 'form-note error-msg';
      return;
    }

    // Simulate async send
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending…';
    note.textContent = '';

    setTimeout(() => {
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = 'Message Sent! <span class="btn-arrow">✓</span>';
      note.textContent = "Thanks! I'll get back to you within 24 hours.";
      note.className   = 'form-note success';

      setTimeout(() => {
        btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
        note.textContent = '';
        note.className = 'form-note';
      }, 5000);
    }, 1100);
  });

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
})();

/* ── 9. SMOOTH SECTION TAG ANIMATION ─────────────────────────── */
(function initSectionHeaders() {
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
  });
})();
