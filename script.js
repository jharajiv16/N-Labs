// enhanced script for agency page: dropdown, reveals, cursor follower, blobs, tilt, and Lottie init
document.addEventListener('DOMContentLoaded', function () {
  // toggle header 'All' dropdown
  const allBtn = document.getElementById('allBtn');
  const allDropdown = document.getElementById('allDropdown');
  if (allBtn && allDropdown) {
    allBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      allDropdown.classList.toggle('show');
    });
    document.addEventListener('click', function () {
      allDropdown.classList.remove('show');
    });
  }

  // --- Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar nav');
  const navLinks = document.querySelectorAll('.navbar nav a'); // Select all links

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Form Submission Handler (Mock) ---
  const contactForm = document.getElementById('contactFormStatic');
  if (contactForm) {
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerText;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Basic validation
      const inputs = contactForm.querySelectorAll('input[required]');
      let valid = true;
      inputs.forEach(i => { if(!i.value) valid = false; });

      if(!valid) {
        alert('Please fill in all required fields.');
        return;
      }

      // Simulate sending
      btn.innerText = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = 'Message Sent! ✅';
        btn.style.backgroundColor = '#10B981'; // Green success color
        contactForm.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }

  // Reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  // Cursor follower
  const cursor = document.getElementById('cursor-follower');
  if (cursor) {
    let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    // smooth follow using requestAnimationFrame
    const loop = () => {
      posX += (mouseX - posX) * 0.16;
      posY += (mouseY - posY) * 0.16;
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    // interactive hover states
    const interactive = document.querySelectorAll('a, button, .btn');
    interactive.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Blob parallax / subtle follow
  const blobs = document.querySelectorAll('.animated-bg .blob');
  if (blobs.length) {
    window.addEventListener('mousemove', (e) => {
      const w = window.innerWidth; const h = window.innerHeight;
      const rx = (e.clientX - w/2) / (w/2); const ry = (e.clientY - h/2) / (h/2);
      blobs.forEach((b, i) => {
        const depth = (i+1) * 8;
        b.style.transform = `translate3d(${rx * depth}px, ${ry * depth * -1}px, 0) scale(${1 + i*0.02})`;
      });
    });
  }

  // service-card tilt effect
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2;
      const dx = e.clientX - cx; const dy = e.clientY - cy;
      const rx = (dy / rect.height) * -8; const ry = (dx / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // mark cards with accent to show subtle border glow
  cards.forEach((c, idx) => { if (!c.hasAttribute('data-accent')) c.setAttribute('data-accent', ''); });

  // Initialize Lottie animations (if lottie available)
  try {
    if (window.lottie) {
      const heroContainer = document.getElementById('lottie-hero');
      if (heroContainer) {
        lottie.loadAnimation({
          container: heroContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets7.lottiefiles.com/packages/lf20_tfb3estd.json'
        });
      }
    }
  } catch (err) {
    console.warn('Lottie init failed:', err);
  }

  // scroll progress bar
  const progressBar = document.querySelector('#scroll-progress .bar');
  if (progressBar) {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  // button ripple effect
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = x + 'px'; r.style.top = y + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });

  // Pause heavy animations when user prefers reduced motion
  const prm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prm.matches) {
    document.documentElement.classList.add('reduced-motion');
  }

  
  // Add gentle pulse to hero CTA briefly to draw attention
  if (!prm.matches) {
    const heroBtn = document.querySelector('.hero .btn');
    if (heroBtn) {
      setTimeout(() => heroBtn.classList.add('pulse'), 1200);
      // remove pulse after a while so it isn't distracting
      setTimeout(() => heroBtn.classList.remove('pulse'), 9000);
    }
  }

  // hero entrance and logo animation
  setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('is-visible');
    const logoSpan = document.querySelector('.logo span');
    if (logoSpan) logoSpan.classList.add('logo-anim');
  }, 220);

  // smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Function to set theme
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initial Theme Check
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    // Default is dark in CSS, if user prefers light we switch?
    // Current CSS assumes dark is default (root variables).
    // So if users prefers light, we set data-theme="light".
    /* 
       Actually, since the site is natively dark, maybe we just respect system pref if it is explicitly light?
       But let's stick to: if no stored pref, default is dark (as per design).
       Or if we want to respect system preference:
    */
     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
       // setTheme('light'); // Optional: auto-switch to light if system is light
     }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
});
