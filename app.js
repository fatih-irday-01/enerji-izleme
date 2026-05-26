/* ── CANVAS CIRCUIT BACKGROUND ── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, connections;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    const count = Math.floor((W * H) / 14000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
    connections = [];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    const DIST = 140;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── LIVE DATA TICKER ── */
(function () {
  const devices = [
    { id: 'Cihaz-1', key: 'Gerilim',  unit: 'V',   base: 380 },
    { id: 'Cihaz-2', key: 'Akım',     unit: 'A',   base: 42  },
    { id: 'Cihaz-3', key: 'Sıcaklık', unit: '°C',  base: 72  },
    { id: 'Cihaz-4', key: 'Basınç',   unit: 'bar', base: 6.2 },
    { id: 'Cihaz-5', key: 'Frekans',  unit: 'Hz',  base: 50  },
    { id: 'Cihaz-6', key: 'Güç',      unit: 'kW',  base: 18  },
    { id: 'Cihaz-7', key: 'Hız',      unit: 'rpm', base: 1450},
    { id: 'Cihaz-8', key: 'Nem',      unit: '%',   base: 65  },
  ];

  function fmtVal(d) {
    const v = (d.base + (Math.random() - 0.5) * d.base * 0.04).toFixed(1);
    return `${d.id} › ${d.key}: <span>${v} ${d.unit}</span>`;
  }

  const ticker = document.getElementById('tickerItems');

  function build() {
    const items = [...devices, ...devices].map(d => `<span style="margin-right:2rem">${fmtVal(d)}</span>`).join('');
    ticker.innerHTML = items;
  }

  build();
  setInterval(build, 3000);
})();

/* ── COUNTER ANIMATION ── */
(function () {
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString('tr-TR');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.stat-value[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ── MINI CHART ── */
(function () {
  const canvas = document.getElementById('miniChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let points = Array.from({ length: 40 }, () => 0.3 + Math.random() * 0.55);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0, 200, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 200, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - p * H;
      i === 0 ? ctx.lineTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - p * H;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Moving dot
    const last = points[points.length - 1];
    const lx = W - 2, ly = H - last * H;
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00c8ff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function update() {
    points.shift();
    const last = points[points.length - 1];
    const next = Math.max(0.1, Math.min(0.95, last + (Math.random() - 0.5) * 0.12));
    points.push(next);
    draw();
  }

  draw();
  setInterval(update, 600);
})();

/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.feature-card, .stat-card, .tech-item, .arch-node, .section-header');
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();

/* ── NOTIFY FORM ── */
(function () {
  const form    = document.getElementById('notifyForm');
  const success = document.getElementById('notifySuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });
})();

/* ── DASHBOARD MOCKUP CHART ── */
(function () {
  const canvas = document.getElementById('dashChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let points = Array.from({ length: 30 }, () => 0.4 + Math.random() * 0.45);

  function draw() {
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    if (W === 0 || H === 0) return;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(101,118,255,0.3)');
    grad.addColorStop(1, 'rgba(101,118,255,0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    points.forEach((p, i) => {
      ctx.lineTo((i / (points.length - 1)) * W, H - p * H * 0.85);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - p * H * 0.85;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#6576ff';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    const last = points[points.length - 1];
    const lx = W - 2, ly = H - last * H * 0.85;
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#6576ff';
    ctx.fill();
  }

  function update() {
    points.shift();
    const last = points[points.length - 1];
    points.push(Math.max(0.1, Math.min(0.95, last + (Math.random() - 0.5) * 0.1)));
    draw();
  }

  const ro = new ResizeObserver(draw);
  ro.observe(canvas);
  draw();
  setInterval(update, 800);
})();

/* ── SMOOTH PARALLAX HERO ── */
(function () {
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hero) {
      hero.style.transform = `translateY(${y * 0.25}px)`;
      hero.style.opacity = Math.max(0, 1 - y / 600);
    }
  }, { passive: true });
})();
