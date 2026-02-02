// enhanced script for agency page: dropdown, reveals, cursor follower, blobs, tilt, and Lottie init

/**
 * script.js - DOM Manipulations & Interactive Elements
 * 
 * Handles non-3D interactions such as:
 * - Mobile Menu Toggling
 * - Form Validation & Mock Submission
 * - Scroll Reveal Effects

 * - Custom Cursor & Parallax
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // --- Header "All" Dropdown Toggle ---
  // Toggles the visibility of the services dropdown menu
  const allBtn = document.getElementById('allBtn');
  const allDropdown = document.getElementById('allDropdown');
  if (allBtn && allDropdown) {
    allBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent closing immediately
      allDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
      allDropdown.classList.remove('show');
    });
  }

  // --- Mobile Menu Toggle ---
  // Controls the hamburger menu state and navigation visibility
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar nav');
  const navLinks = document.querySelectorAll('.navbar nav a'); // Select all links

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
    });

    // Close menu when a link is clicked to improve UX
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Form Submission Handler (Mock) ---
  // Intercepts the contact form submission for client-side feedback
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

      // Simulate sending logic (Mock API call)
      btn.innerText = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        // Success State
        btn.innerText = 'Message Sent! ✅';
        btn.style.backgroundColor = '#10B981'; // Green success color
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }

  // --- Scroll Reveal Animation ---
  // Uses IntersectionObserver to trigger 'is-visible' class when elements enter viewport
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target); // Only animate once
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else {
    // Fallback for older browsers
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  // --- Custom Cursor Follower ---
  // Creates a trailing cursor effect for better immersion
  const cursor = document.getElementById('cursor-follower');
  if (cursor) {
    let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    
    // Smooth follow using requestAnimationFrame (Linear Interpolation)
    const loop = () => {
      posX += (mouseX - posX) * 0.16;
      posY += (mouseY - posY) * 0.16;
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    
    // Interactive hover states for clickable elements
    const interactive = document.querySelectorAll('a, button, .btn');
    interactive.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // --- Animated Background Blobs Parallax ---
  // Moves background blobs slightly opposite to mouse movement (Depth Effect)
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

  // --- Service Card 3D Tilt Effect ---
  // Adds a 3D tilt interaction on mouse hover over service cards
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2;
      const dx = e.clientX - cx; const dy = e.clientY - cy;
      const rx = (dy / rect.height) * -8; const ry = (dx / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    // Reset transform on leave
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Helper: Mark cards with data-accent if missing (for CSS styling)
  cards.forEach((c, idx) => { if (!c.hasAttribute('data-accent')) c.setAttribute('data-accent', ''); });

  // --- Lottie Animation Initialization ---
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




});
