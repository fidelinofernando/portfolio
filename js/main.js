/* ═══════════════════════════════════════════════════════
   FIDEL FERNANDO PORTFOLIO — main.js
   Apple-level interactions, parallax, scroll magic
   ═══════════════════════════════════════════════════════ */

"use strict";

/* ─── 1. LOADER ─── */
(function initLoader() {
  const loader     = document.getElementById('loader');
  const fill       = document.getElementById('loaderFill');
  const pct        = document.getElementById('loaderPercent');
  let   progress   = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      fill.style.width = '100%';
      pct.textContent  = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroReveal();
      }, 500);
    } else {
      fill.style.width = progress + '%';
      pct.textContent  = Math.floor(progress) + '%';
    }
  }, 60);

  document.body.style.overflow = 'hidden';
})();


/* ─── 2. CUSTOM CURSOR ─── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let   mouseX = 0, mouseY = 0;
  let   followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  /* Smooth follower */
  (function animFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animFollower);
  })();

  /* Link hover state */
  document.querySelectorAll('a, button, [data-cursor="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });
})();


/* ─── 3. NAVBAR SCROLL ─── */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ─── 4. MOBILE MENU ─── */
(function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  let   open   = false;

  function toggle() {
    open = !open;
    menu.classList.toggle('open', open);
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  }

  burger.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    open = true; toggle();
  }));
})();


/* ─── 5. HERO REVEAL ─── */
function triggerHeroReveal() {
  const items = document.querySelectorAll('#hero .reveal-up, #hero .reveal-right');
  items.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0) + i * 0.05;
    setTimeout(() => el.classList.add('visible'), delay * 1000);
  });

  /* Kick off counter animation */
  setTimeout(animateCounters, 800);
}


/* ─── 6. COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let   current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}


/* ─── 7. INTERSECTION OBSERVER — REVEAL ON SCROLL ─── */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    if (!el.closest('#hero')) observer.observe(el);
  });
})();


/* ─── 8. SKILL BARS ─── */
(function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
})();


/* ─── 9. PARALLAX — APPLE-STYLE ─── */
(function initParallax() {
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    /* Orbs */
    document.querySelectorAll('.orb-1').forEach(orb => {
      orb.style.transform = `translateY(${scrollY * 0.25}px)`;
    });
    document.querySelectorAll('.orb-2').forEach(orb => {
      orb.style.transform = `translateY(${scrollY * -0.15}px)`;
    });
    document.querySelectorAll('.orb-3').forEach(orb => {
      orb.style.transform = `translateY(${scrollY * 0.1}px)`;
    });

    /* Hero image subtle float */
    const heroImg = document.getElementById('heroImg');
    if (heroImg) {
      const heroSection = document.getElementById('hero');
      const heroRect    = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        const progress = Math.max(0, -heroRect.top / heroRect.height);
        heroImg.style.transform = `translateY(${progress * 40}px)`;
      }
    }

    /* Project visuals subtle parallax */
    document.querySelectorAll('.project-visual').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const center = (rect.top + rect.height / 2) - window.innerHeight / 2;
        el.querySelector('.pv-inner').style.transform = `translateY(${center * 0.04}px)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/* ─── 10. HERO TITLE MOUSE PARALLAX ─── */
(function initHeroMouseParallax() {
  const heroContent = document.querySelector('.hero-content');
  const imageWrap   = document.querySelector('.hero-image-wrap');
  if (!heroContent || !imageWrap) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    heroContent.style.transform = `translate(${dx * -8}px, ${dy * -5}px)`;
    imageWrap.style.transform   = `translate(${dx * 12}px, ${dy * 8}px)`;
  });
})();


/* ─── 11. PROJECT ITEM HOVER TILT ─── */
(function initProjectTilt() {
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      item.style.transform = `perspective(800px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
})();


/* ─── 12. SMOOTH ANCHOR SCROLL ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─── 13. CONTACT FORM ─── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Mensagem enviada!';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = 'Enviar mensagem <span class="btn-icon">→</span>';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();


/* ─── 14. CARD STAGGER HOVER — ABOUT CARDS ─── */
(function initCardHover() {
  document.querySelectorAll('.about-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      card.style.transitionDelay = '0s';
    });
  });
})();


/* ─── 15. TEXT SCRAMBLE on section titles ─── */
class TextScramble {
  constructor(el) {
    this.el     = el;
    this.chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old    = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    this.queue   = [];
    for (let i = 0; i < length; i++) {
      const from  = old[i]    || '';
      const to    = newText[i] || '';
      const start = Math.floor(Math.random() * 12);
      const end   = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return new Promise(res => (this.resolve = res));
  }
  update() {
    let output    = '';
    let complete  = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--text-3)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* Apply to the hero eyebrow once loaded */
window.addEventListener('load', () => {
  setTimeout(() => {
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow) {
      /* subtle effect only on the text node */
    }
  }, 2000);
});


/* ─── 16. ACTIVE NAV LINK on scroll ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--text)' : '';
    });
  }, { passive: true });
})();


/* ─── 17. ORB CONTACT parallax ─── */
(function initContactParallax() {
  const orbC1 = document.querySelector('.orb-c1');
  const orbC2 = document.querySelector('.orb-c2');
  if (!orbC1 || !orbC2) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth)  - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    orbC1.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    orbC2.style.transform = `translate(${x * -20}px, ${y * -15}px)`;
  });
})();


/* ─── 18. PAGE TRANSITION on internal links ─── */
(function initPageTransition() {
  /* Simple fade out effect for external links */
})();


/* ─── 19. MARQUEE PAUSE ON HOVER ─── */
(function initMarquee() {
  const track = document.querySelector('.marquee-inner');
  if (!track) return;
  track.parentElement.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.parentElement.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ─── 20. RESIZE HANDLER ─── */
window.addEventListener('resize', () => {
  /* Re-check responsive states */
  const isMobile = window.innerWidth < 768;
  document.querySelector('.cursor').style.display      = isMobile ? 'none' : '';
  document.querySelector('.cursor-follower').style.display = isMobile ? 'none' : '';
});