
const cursor     = document.createElement('div');
const cursorRing = document.createElement('div');
cursor.className     = 'cursor';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursor);
document.body.appendChild(cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});


function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();


document.querySelectorAll('a, button, .proj-card, .tech-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(2)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
    cursorRing.style.borderColor = 'rgba(168,85,247,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.borderColor = 'rgba(168,85,247,0.5)';
  });
});


const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      r:    Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);


  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 130) * 0.25})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });


document.addEventListener('mousemove', e => {
  particles.forEach(p => {
    const dx   = e.clientX - p.x;
    const dy   = e.clientY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      p.vx -= (dx / dist) * force * 0.6;
      p.vy -= (dy / dist) * force * 0.6;
    }
  });
});


function countUp(el, target, suffix = '') {
  let current  = 0;
  const steps  = 60;
  const increment = target / steps;
  const interval  = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 30);
}


const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const val    = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        countUp(el, val, suffix);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.dataset.w;
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('#habilidades');
if (skillsSection) skillObserver.observe(skillsSection);


const revealElements = document.querySelectorAll(
  '.proj-card, .award-card, .stat, .contact-link, .tech-pill, .skill-row'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--purple-glow)';
    }
  });

  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

/* ═══════════════════════════════════════
   MENÚ MÓVIL
═══════════════════════════════════════ */
const menuBtn   = document.getElementById('menuBtn');
const navLinksEl = document.querySelector('.nav-links');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = navLinksEl.style.display === 'flex';
    navLinksEl.style.display    = open ? 'none' : 'flex';
    navLinksEl.style.flexDirection = 'column';
    navLinksEl.style.position   = 'absolute';
    navLinksEl.style.top        = '70px';
    navLinksEl.style.left       = '0';
    navLinksEl.style.right      = '0';
    navLinksEl.style.background = 'rgba(6,6,8,0.97)';
    navLinksEl.style.padding    = '1.5rem 2rem';
    navLinksEl.style.borderBottom = '1px solid rgba(124,58,237,0.2)';
    menuBtn.textContent = open ? '☰' : '✕';
  });
}

/* ═══════════════════════════════════════
   EFECTO GLITCH EN EL NOMBRE (sutil)
═══════════════════════════════════════ */
const heroName = document.querySelector('.hero-name');
if (heroName) {
  setInterval(() => {
    heroName.style.textShadow = '2px 0 rgba(168,85,247,0.4), -2px 0 rgba(192,132,252,0.2)';
    setTimeout(() => {
      heroName.style.textShadow = 'none';
    }, 80);
  }, 4000);
}

/* TOGGLE CONTACTO */
function toggleInfo(btn) {
  const card = btn.closest('.contact-link');
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.contact-link').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}
/* ═══════════════════════════════════════
   TÍTULO DE PESTAÑA DINÁMICO
═══════════════════════════════════════ */
const titles = [
  'Marco Rubio — Dev',
  'Marco Rubio — Builder',
  'Marco Rubio — Available ✓',
];
let titleIndex = 0;
setInterval(() => {
  titleIndex = (titleIndex + 1) % titles.length;
  document.title = titles[titleIndex];
}, 3000);