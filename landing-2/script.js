/* =========================================================
   ENERJI IZLEME — Landing Page Scripts
   ========================================================= */

/* ---- CANVAS BACKGROUND ---- */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], gridLines = [];

  const COLORS = {
    cyan:   'rgba(0,200,255,',
    green:  'rgba(0,255,136,',
    orange: 'rgba(255,123,53,'
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }

  function buildGrid() {
    gridLines = [];
    const step = 80;
    for (let x = 0; x < W; x += step) {
      gridLines.push({ type: 'v', x, alpha: Math.random() * 0.04 + 0.02 });
    }
    for (let y = 0; y < H; y += step) {
      gridLines.push({ type: 'h', y, alpha: Math.random() * 0.04 + 0.02 });
    }
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
      const keys = Object.keys(COLORS);
      this.colorKey = keys[Math.floor(Math.random() * keys.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[this.colorKey] + (this.life * 0.6) + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    /* grid */
    gridLines.forEach(g => {
      ctx.strokeStyle = 'rgba(255,255,255,' + g.alpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (g.type === 'v') { ctx.moveTo(g.x, 0); ctx.lineTo(g.x, H); }
      else                { ctx.moveTo(0, g.y); ctx.lineTo(W, g.y); }
      ctx.stroke();
    });

    /* particles */
    particles.forEach(p => { p.update(); p.draw(); });

    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

/* ---- NAVBAR ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- LIVE CLOCK ---- */
function updateClock() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('tr-TR', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

/* ---- LIVE KWH JITTER ---- */
const kwhEl     = document.getElementById('kwh');
const savingsEl = document.getElementById('savings');
let kwhBase = 842.3;
let savingsBase = 12480;

function jitter() {
  kwhBase += (Math.random() - 0.5) * 4;
  kwhBase = Math.max(820, Math.min(870, kwhBase));

  savingsBase += (Math.random() - 0.5) * 20;
  savingsBase = Math.max(12200, Math.min(12700, savingsBase));

  if (kwhEl)     kwhEl.textContent     = kwhBase.toFixed(1);
  if (savingsEl) savingsEl.textContent = '₺' + Math.round(savingsBase).toLocaleString('tr-TR');
}
setInterval(jitter, 2200);

/* ---- CHART BARS ---- */
(function buildChart() {
  const wrap = document.getElementById('chartBars');
  if (!wrap) return;

  const heights = [30, 45, 38, 62, 55, 40, 70, 58, 48, 65, 72, 50, 44, 68, 60, 52, 75, 63, 41, 56];
  const max = Math.max(...heights);

  heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar' + (i === heights.length - 3 ? ' highlight' : '');
    bar.style.height = Math.round((h / max) * 52) + 'px';
    wrap.appendChild(bar);
  });

  /* animate last few bars */
  let offset = 0;
  setInterval(() => {
    const bars = wrap.querySelectorAll('.bar');
    const newH = Math.floor(Math.random() * 50 + 20);
    const idx  = (offset % bars.length);
    bars[idx].style.height = Math.round((newH / max) * 52) + 'px';
    offset++;
  }, 1800);
})();

/* ---- INTERSECTION OBSERVER — REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal || '0');
  const dur     = 1800;
  const start   = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / dur, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = target * ease;
    el.textContent = decimal ? current.toFixed(decimal) : Math.round(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- SMOOTH SCROLL for anchors ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ---- DEVICE CARD CURSOR GLOW ---- */
document.querySelectorAll('.device-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const glow = card.querySelector('.device-glow');
    if (glow) {
      glow.style.left = (x - 30) + '%';
      glow.style.top  = (y - 30) + '%';
    }
  });
});

/* ---- MODULE CARD TILT ---- */
document.querySelectorAll('.module-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const rx     = ((e.clientY - cy) / rect.height) * 4;
    const ry     = ((e.clientX - cx) / rect.width)  * -4;
    card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ---- FLOW STEP STAGGER on reveal ---- */
document.querySelectorAll('.flow-step').forEach((step, i) => {
  step.style.transitionDelay = (i * 80) + 'ms';
  step.setAttribute('data-reveal', '');
  revealObserver.observe(step);
});
