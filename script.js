/* ============================================================
   Ho Services – script.js
   Pure vanilla JS: navbar, scroll animations, FAQ,
   product filter, stats counter, form handling
   ============================================================ */

/* ---- Navbar: scroll class + active link ---- */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* highlight active nav link based on viewport position */
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Hamburger mobile menu ---- */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  /* close on link click */
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  /* close on outside click */
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();

/* ---- Scroll reveal (IntersectionObserver) ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ---- Animated stats counter ---- */
(function initStats() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1800);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();

/* ---- FAQ accordion ---- */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';

      /* close all others */
      items.forEach(i => {
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-a').classList.remove('open');
      });

      /* toggle current */
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        ans.classList.add('open');
      }
    });
  });
})();

/* ---- Product filter ---- */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden-filter');
          /* re-trigger reveal if needed */
          card.classList.add('visible');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
})();

/* ---- File upload label ---- */
(function initFileUpload() {
  const input   = document.getElementById('artwork');
  const nameEl  = document.getElementById('fileName');
  const area    = document.getElementById('fileUploadArea');
  if (!input) return;

  input.addEventListener('change', () => {
    if (input.files.length) {
      nameEl.textContent = input.files[0].name;
      area.classList.add('active');
    } else {
      nameEl.textContent = '';
      area.classList.remove('active');
    }
  });
})();

/* ---- Quote form with FormSubmit ---- */
(function initForm() {
  const form       = document.getElementById('quoteForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoader  = submitBtn.querySelector('.btn-loader');
  const successEl  = document.getElementById('formSuccess');
  const errorEl    = document.getElementById('formError');

  /* field validation rules */
  const rules = [
    {
      id: 'name', errId: 'nameError',
      validate: v => v.trim().length >= 2,
      msg: 'Please enter your full name.'
    },
    {
      id: 'email', errId: 'emailError',
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: 'Please enter a valid email address.'
    },
    {
      id: 'phone', errId: 'phoneError',
      validate: v => /^[\d\s\+\-\(\)]{6,20}$/.test(v.trim()),
      msg: 'Please enter a valid phone number.'
    },
    {
      id: 'service', errId: 'serviceError',
      validate: v => v !== '',
      msg: 'Please select a printing service.'
    },
    {
      id: 'message', errId: 'messageError',
      validate: v => v.trim().length >= 10,
      msg: 'Please describe your requirements (at least 10 characters).'
    }
  ];

  function validateField(rule) {
    const el  = document.getElementById(rule.id);
    const err = document.getElementById(rule.errId);
    if (!el) return true;

    const ok = rule.validate(el.value);
    err.textContent = ok ? '' : rule.msg;
    el.classList.toggle('error', !ok);
    return ok;
  }

  /* live validation on blur */
  rules.forEach(rule => {
    const el = document.getElementById(rule.id);
    if (el) el.addEventListener('blur', () => validateField(rule));
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.classList.toggle('hidden', loading);
    btnLoader.classList.toggle('hidden', !loading);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* validate all fields */
    const allValid = rules.map(r => validateField(r)).every(Boolean);
    if (!allValid) {
      /* scroll to first error */
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    /* Build form data for FormSubmit.co */
    const fd = new FormData(form);
    fd.append('_subject', 'New Print Quote Request – Ho Services');
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');

    /* Replace YOUR_EMAIL with the actual destination email */
    const FORM_ENDPOINT = 'https://formsubmit.co/ajax/hello@print.com.sg';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        successEl.classList.remove('hidden');
        form.reset();
        document.getElementById('fileName').textContent = '';
        document.getElementById('fileUploadArea').classList.remove('active');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Server error');
      }
    } catch {
      errorEl.classList.remove('hidden');
    } finally {
      setLoading(false);
    }
  });
})();

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; /* navbar height buffer */
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Back to top ---- */
(function initBackTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
