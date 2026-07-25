/* ==========================================================================
   Anisha Bairagi — Portfolio JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------
     Sticky navbar background on scroll
  ------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* -------------------------------------------------
     Mobile nav toggle
  ------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('active', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -------------------------------------------------
     Active nav link highlight on scroll
  ------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* -------------------------------------------------
     Typing animation for hero role
  ------------------------------------------------- */
  const roles = [
    'Cyber Security Student',
    'Web Developer',
    'AI Enthusiast'
  ];
  const typedEl = document.getElementById('typedRole');

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles.join(' · ');
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(type, 1500);
            return;
          }
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(type, deleting ? 45 : 85);
      };

      type();
    }
  }

  /* -------------------------------------------------
     Scroll reveal
  ------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 40);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* -------------------------------------------------
     Animated counters
  ------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal, 10) : null;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (decimal !== null) {
        // e.g. 8.30 — animate integer part then append decimal
        const value = (target + decimal / 100) * eased;
        el.textContent = value.toFixed(2);
      } else {
        el.textContent = Math.round(target * eased);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimal !== null ? `${target}.${decimal}` : target;
      }
    };

    if (prefersReducedMotion) {
      el.textContent = decimal !== null ? `${target}.${decimal}` : target;
    } else {
      requestAnimationFrame(step);
    }
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => counterObserver.observe(el));

  /* -------------------------------------------------
     Skill progress bars
  ------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = `${fill.dataset.width}%`;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* -------------------------------------------------
     Scroll-to-top button
  ------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* -------------------------------------------------
     Contact form with EmailJS
  ------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitButton');

  if (window.emailjs) {
    window.emailjs.init('Kky_fNhNpOvXHJyPL');
  } else {
    console.error('EmailJS failed to load.');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.elements.namedItem('name').value.trim();
    const email = form.elements.namedItem('email').value.trim();
    const subject = form.elements.namedItem('subject').value.trim();
    const message = form.elements.namedItem('message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      status.textContent = 'Please fill in every field before sending.';
      status.className = 'form-status error';
      return;
    }

    if (!emailPattern.test(email)) {
      status.textContent = 'That email address doesn’t look right.';
      status.className = 'form-status error';
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="btn-text"><i class="fa-solid fa-spinner fa-spin"></i> Sending...</span>';
    status.textContent = 'Sending your message...';
    status.className = 'form-status';

    try {
      if (!window.emailjs) {
        throw new Error('EmailJS is not available right now.');
      }

      await window.emailjs.sendForm('service_g8s5wc9', 'template_dka7t58', form);

      status.textContent = '✅ Message sent successfully!';
      status.className = 'form-status success';
      form.reset();
    } catch (error) {
      status.textContent = '❌ Failed to send message. Please try again.';
      status.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span class="btn-text"><i class="fa-regular fa-paper-plane"></i> Send Message</span>';
    }
  });

  /* -------------------------------------------------
     Cursor glow (desktop only, decorative)
  ------------------------------------------------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* -------------------------------------------------
     Footer year
  ------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});