/* ============================================================
   KSOT Hero Carousel — script.js
============================================================ */

'use strict';

/* ── Book Data ── */
const BOOKS = [
  {
    vol: 'Vol.34 No.1', year: '2026', month: '03',
    cat: '작업치료 · 인지재활',
    hue: 197, sat: '72%', pattern: 'grid',
    accent: '#2DD4BF', title: 'KJOT'
  },
  {
    vol: 'Vol.33 No.4', year: '2025', month: '12',
    cat: '신체기능 · 보조공학',
    hue: 231, sat: '68%', pattern: 'circles',
    accent: '#818CF8', title: 'KJOT'
  },
  {
    vol: 'Vol.33 No.3', year: '2025', month: '09',
    cat: '정신사회 · 아동발달',
    hue: 265, sat: '62%', pattern: 'waves',
    accent: '#C084FC', title: 'KJOT'
  },
  {
    vol: 'Vol.33 No.2', year: '2025', month: '06',
    cat: '노인 · 지역사회재활',
    hue: 24, sat: '78%', pattern: 'diagonal',
    accent: '#FB923C', title: 'KJOT'
  },
  {
    vol: 'Vol.33 No.1', year: '2025', month: '03',
    cat: '연구방법론 · 측정',
    hue: 160, sat: '65%', pattern: 'dots',
    accent: '#34D399', title: 'KJOT'
  },
  {
    vol: 'Vol.32 No.4', year: '2024', month: '12',
    cat: '작업과학 · 이론',
    hue: 210, sat: '75%', pattern: 'vertical',
    accent: '#60A5FA', title: 'KJOT'
  },
  {
    vol: 'Vol.32 No.3', year: '2024', month: '09',
    cat: '임상실제 · 중재',
    hue: 336, sat: '70%', pattern: 'cross',
    accent: '#F472B6', title: 'KJOT'
  },
  {
    vol: 'Vol.32 No.2', year: '2024', month: '06',
    cat: '교육 · 직무역량',
    hue: 48, sat: '80%', pattern: 'arcs',
    accent: '#FBBF24', title: 'KJOT'
  }
];

const COUNT      = BOOKS.length;
const STEP       = 360 / COUNT;   // degrees per book slot
const SPINE_W    = 22;

/* ── State ── */
let activeIndex   = 0;
let targetAngle   = 0;
let currentAngle  = 0;
let velocity      = 0;
let rafId         = null;
let autoTimer     = null;
let isDragging    = false;
let dragStartX    = 0;
let dragStartAngle = 0;
let lastDragX     = 0;
let dragVelocity  = 0;

/* ── DOM refs populated in init ── */
let stage, dots, metaVol, metaYear, metaCat;

/* ── CSS custom property reader ── */
function getCSSNum(prop) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(prop).trim();
  return parseFloat(raw);
}

/* ============================================================
   SVG Cover Generator — 8 pattern types
============================================================ */
function getSVGCover(book, w, h) {
  const sw   = SPINE_W;
  const cw   = w - sw;
  const bg   = `hsl(${book.hue},${book.sat},14%)`;
  const mid  = `hsl(${book.hue},${book.sat},22%)`;
  const acc  = book.accent;

  const defs = `<defs>
    <linearGradient id="fg${book.hue}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${acc}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${acc}" stop-opacity="0.04"/>
    </linearGradient>
  </defs>`;

  let pattern = '';

  switch (book.pattern) {
    case 'grid': {
      const lines = [];
      for (let x = 0; x < cw; x += 18)
        lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${acc}" stroke-opacity="0.12" stroke-width="0.8"/>`);
      for (let y = 0; y < h; y += 18)
        lines.push(`<line x1="0" y1="${y}" x2="${cw}" y2="${y}" stroke="${acc}" stroke-opacity="0.12" stroke-width="0.8"/>`);
      pattern = lines.join('');
      break;
    }
    case 'circles': {
      const circles = [];
      for (let i = 0; i < 6; i++) {
        const r = 18 + i * 22;
        circles.push(`<circle cx="${cw/2}" cy="${h*0.38}" r="${r}" fill="none" stroke="${acc}" stroke-opacity="${0.18 - i*0.025}" stroke-width="1"/>`);
      }
      pattern = circles.join('');
      break;
    }
    case 'waves': {
      const waves = [];
      for (let y = 20; y < h; y += 22) {
        let d = `M0,${y}`;
        for (let x = 0; x < cw; x += 30)
          d += ` q15,-10 30,0`;
        waves.push(`<path d="${d}" fill="none" stroke="${acc}" stroke-opacity="0.15" stroke-width="1"/>`);
      }
      pattern = waves.join('');
      break;
    }
    case 'diagonal': {
      const lines = [];
      for (let i = -h; i < cw + h; i += 16)
        lines.push(`<line x1="${i}" y1="0" x2="${i+h}" y2="${h}" stroke="${acc}" stroke-opacity="0.13" stroke-width="0.8"/>`);
      pattern = lines.join('');
      break;
    }
    case 'dots': {
      const dots2 = [];
      for (let x = 10; x < cw; x += 16)
        for (let y = 10; y < h; y += 16)
          dots2.push(`<circle cx="${x}" cy="${y}" r="1.4" fill="${acc}" fill-opacity="0.22"/>`);
      pattern = dots2.join('');
      break;
    }
    case 'vertical': {
      const lines = [];
      for (let x = 0; x < cw; x += 12)
        lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${acc}" stroke-opacity="0.14" stroke-width="${x%24===0?1.4:0.6}"/>`);
      pattern = lines.join('');
      break;
    }
    case 'cross': {
      const crosses = [];
      for (let x = 12; x < cw; x += 24)
        for (let y = 12; y < h; y += 24) {
          crosses.push(`<line x1="${x-6}" y1="${y}" x2="${x+6}" y2="${y}" stroke="${acc}" stroke-opacity="0.2" stroke-width="1"/>`);
          crosses.push(`<line x1="${x}" y1="${y-6}" x2="${x}" y2="${y+6}" stroke="${acc}" stroke-opacity="0.2" stroke-width="1"/>`);
        }
      pattern = crosses.join('');
      break;
    }
    case 'arcs': {
      const arcs = [];
      for (let i = 0; i < 5; i++) {
        const r = 30 + i * 36;
        arcs.push(`<path d="M${cw*0.1},${h} a${r},${r} 0 0,1 ${r*1.6},0" fill="none" stroke="${acc}" stroke-opacity="${0.2 - i*0.03}" stroke-width="1.2"/>`);
      }
      pattern = arcs.join('');
      break;
    }
  }

  /* Spine gradient */
  const spine = `
    <rect x="0" y="0" width="${sw}" height="${h}" fill="${bg}"/>
    <rect x="0" y="0" width="${sw}" height="${h}" fill="url(#fg${book.hue})"/>
    <text x="${sw/2}" y="${h*0.5}" transform="rotate(-90,${sw/2},${h*0.5})"
      font-family="Inter,sans-serif" font-size="8" font-weight="600"
      fill="${acc}" fill-opacity="0.7" text-anchor="middle" dominant-baseline="central"
      letter-spacing="2">${book.title} ${book.year}</text>
  `;

  /* Cover body */
  const cover = `
    <rect x="${sw}" y="0" width="${cw}" height="${h}" fill="${bg}"/>
    <rect x="${sw}" y="0" width="${cw}" height="${h}" fill="${mid}" fill-opacity="0.4"/>
    ${pattern}
    <rect x="${sw}" y="0" width="${cw}" height="${h}" fill="url(#fg${book.hue})"/>
    <text x="${sw + cw/2}" y="${h*0.28}" font-family="Inter,sans-serif"
      font-size="11" font-weight="700" fill="${acc}" fill-opacity="0.9"
      text-anchor="middle" letter-spacing="3">${book.title}</text>
    <text x="${sw + cw/2}" y="${h*0.28 + 16}" font-family="Inter,sans-serif"
      font-size="7.5" font-weight="400" fill="rgba(255,255,255,0.5)"
      text-anchor="middle" letter-spacing="1.5">KJOT</text>
    <line x1="${sw+18}" y1="${h*0.36}" x2="${sw+cw-18}" y2="${h*0.36}"
      stroke="${acc}" stroke-opacity="0.25" stroke-width="0.8"/>
    <text x="${sw+cw/2}" y="${h*0.82}" font-family="Inter,sans-serif"
      font-size="8.5" font-weight="600" fill="rgba(255,255,255,0.75)"
      text-anchor="middle">${book.vol}</text>
    <text x="${sw+cw/2}" y="${h*0.82+13}" font-family="Inter,sans-serif"
      font-size="7" fill="rgba(255,255,255,0.4)"
      text-anchor="middle">${book.year} · ${book.month}</text>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${defs}${spine}${cover}
  </svg>`;
}

/* ============================================================
   Build Carousel DOM
============================================================ */
function buildCarousel() {
  const bw = getCSSNum('--book-w') || 158;
  const bh = getCSSNum('--book-h') || 228;

  BOOKS.forEach((book, i) => {
    /* ── Book element ── */
    const el = document.createElement('div');
    el.className = 'book';
    el.setAttribute('data-index', i);
    el.setAttribute('role', 'tab');
    el.setAttribute('aria-label', `${book.vol} ${book.year}`);
    el.setAttribute('tabindex', '-1');

    /* Wrap */
    const wrap = document.createElement('div');
    wrap.className = 'book-wrap';

    /* SVG cover as <img> */
    const svgStr = getSVGCover(book, bw, bh);
    const blob   = new Blob([svgStr], { type: 'image/svg+xml' });
    const url    = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.src   = url;
    img.width = bw;
    img.height = bh;
    img.alt   = `${book.title} ${book.vol}`;
    img.draggable = false;

    wrap.appendChild(img);
    el.appendChild(wrap);
    stage.appendChild(el);

    /* Click to navigate */
    el.addEventListener('click', () => {
      if (!isDragging) navigateTo(i);
    });
  });

  buildDots();
}

/* ── Nav dots ── */
function buildDots() {
  dots.innerHTML = '';
  BOOKS.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'nav-dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `${i + 1}번 학술지`);
    btn.addEventListener('click', () => navigateTo(i));
    dots.appendChild(btn);
  });
  updateDots();
}

/* ============================================================
   Navigation
============================================================ */
function shortestDelta(from, to) {
  /* in book-index space; handles wrap-around */
  let d = ((to - from) % COUNT + COUNT) % COUNT;
  if (d > COUNT / 2) d -= COUNT;
  return d;
}

function navigateTo(index) {
  const prev = activeIndex;
  activeIndex = ((index % COUNT) + COUNT) % COUNT;
  const delta = shortestDelta(prev, activeIndex);
  targetAngle -= delta * STEP;
  resetAutoRotate();
  updateMeta();
  updateDots();
}

function navigateBy(delta) {
  navigateTo(activeIndex + delta);
}

/* ============================================================
   Animation Loop — Damped Spring
============================================================ */
function tick() {
  const diff   = targetAngle - currentAngle;
  velocity    += diff * 0.055;
  velocity    *= 0.78;
  currentAngle += velocity;

  stage.style.transform = `rotateY(${currentAngle}deg)`;
  updateDepthEffects();

  rafId = requestAnimationFrame(tick);
}

function updateDepthEffects() {
  const books = stage.querySelectorAll('.book');
  const bw    = getCSSNum('--book-w') || 158;
  const bh    = getCSSNum('--book-h') || 228;
  const R     = getCSSNum('--radius') || 420;

  books.forEach((el, i) => {
    /* World angle of this book (degrees, normalised –180…180) */
    let worldAngle = (i * STEP + currentAngle) % 360;
    if (worldAngle > 180)  worldAngle -= 360;
    if (worldAngle < -180) worldAngle += 360;

    const abs  = Math.abs(worldAngle);
    const t    = 1 - Math.min(abs, 90) / 90; // 1 = front, 0 = side

    const opacity    = 0.20 + t * 0.80;
    const blur       = (1 - t) * 3.5;
    const brightness = 0.30 + t * 0.70;
    const scale      = 0.84 + t * 0.16;

    /* 3D placement */
    const angle = i * STEP;
    el.style.transform =
      `rotateY(${angle}deg) translateZ(${R}px) scale(${scale})`;
    el.style.opacity = opacity;
    el.style.filter  = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`;

    const isActive = i === activeIndex;
    el.classList.toggle('is-active', isActive);
    el.setAttribute('aria-selected', isActive);
    el.setAttribute('tabindex', isActive ? '0' : '-1');
  });
}

/* ============================================================
   Metadata + Dots sync
============================================================ */
function updateMeta() {
  const b = BOOKS[activeIndex];
  metaVol.textContent  = b.vol;
  metaYear.textContent = b.year + ' · ' + b.month;
  metaCat.textContent  = b.cat;
}

function updateDots() {
  dots.querySelectorAll('.nav-dot').forEach((d, i) => {
    d.classList.toggle('is-active', i === activeIndex);
    d.setAttribute('aria-selected', i === activeIndex);
  });
}

/* ============================================================
   Auto-Rotation
============================================================ */
function startAutoRotate() {
  autoTimer = setTimeout(() => {
    navigateBy(1);
    startAutoRotate();
  }, 3800);
}

function resetAutoRotate() {
  clearTimeout(autoTimer);
  startAutoRotate();
}

/* ============================================================
   Pointer / Drag
============================================================ */
function onPointerDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  isDragging    = true;
  dragStartX    = e.touches ? e.touches[0].clientX : e.clientX;
  dragStartAngle = targetAngle;
  lastDragX     = dragStartX;
  dragVelocity  = 0;
  clearTimeout(autoTimer);
  e.currentTarget.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e) {
  if (!isDragging) return;
  const x   = e.touches ? e.touches[0].clientX : e.clientX;
  const dx  = x - lastDragX;
  dragVelocity = dx;
  lastDragX = x;

  const total = x - dragStartX;
  targetAngle = dragStartAngle + total * 0.25;
}

function onPointerUp(e) {
  if (!isDragging) return;
  isDragging = false;

  /* Snap to nearest book */
  const snapped = Math.round(-targetAngle / STEP);
  activeIndex   = ((snapped % COUNT) + COUNT) % COUNT;
  targetAngle   = -snapped * STEP;

  updateMeta();
  updateDots();
  resetAutoRotate();
}

/* ============================================================
   Keyboard
============================================================ */
function onKeyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    navigateBy(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    navigateBy(-1);
  }
}

/* ============================================================
   Canvas Particle System
============================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.4 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.18;
    this.vy   = -(Math.random() * 0.25 + 0.08);
    this.op   = Math.random() * 0.45 + 0.05;
    this.fade = Math.random() * 0.003 + 0.001;
  };
  Particle.prototype.update = function () {
    this.x  += this.vx;
    this.y  += this.vy;
    this.op -= this.fade;
    if (this.op <= 0 || this.y < -4) this.reset();
  };

  function spawnParticles(n) {
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,220,255,${p.op})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }

  resize();
  spawnParticles(90);
  frame();
  window.addEventListener('resize', resize);
}

/* ============================================================
   Responsive — rebuild on breakpoint change
============================================================ */
function watchBreakpoints() {
  const mqs = [
    window.matchMedia('(max-width:1100px)'),
    window.matchMedia('(max-width:768px)'),
    window.matchMedia('(max-width:480px)')
  ];
  mqs.forEach(mq => mq.addEventListener('change', () => {
    /* let CSS vars settle then re-apply depth */
    requestAnimationFrame(updateDepthEffects);
  }));
}

/* ============================================================
   Init
============================================================ */
function init() {
  stage   = document.getElementById('carouselStage');
  dots    = document.getElementById('navDots');
  metaVol = document.getElementById('metaVol');
  metaYear = document.getElementById('metaYear');
  metaCat = document.getElementById('metaCat');

  if (!stage) return;

  buildCarousel();
  updateMeta();

  /* Start RAF */
  tick();

  /* Initial placement (no animation) */
  currentAngle = targetAngle = 0;
  updateDepthEffects();

  /* Auto-rotate */
  startAutoRotate();

  /* Particles */
  initParticles();

  /* Pointer events — carousel area */
  const area = document.getElementById('carouselArea');
  area.addEventListener('pointerdown',  onPointerDown, { passive: false });
  area.addEventListener('pointermove',  onPointerMove, { passive: true  });
  area.addEventListener('pointerup',    onPointerUp);
  area.addEventListener('pointercancel', onPointerUp);

  /* Touch fallback */
  area.addEventListener('touchstart',  onPointerDown, { passive: true });
  area.addEventListener('touchmove',   onPointerMove, { passive: true });
  area.addEventListener('touchend',    onPointerUp);

  /* Wheel — intentionally omitted to allow page scroll */

  /* Keyboard */
  area.addEventListener('keydown', onKeyDown);

  /* Nav arrows */
  document.getElementById('navPrev')
    ?.addEventListener('click', () => navigateBy(-1));
  document.getElementById('navNext')
    ?.addEventListener('click', () => navigateBy(1));

  /* Pause auto-rotate on focus/hover */
  area.addEventListener('mouseenter', () => clearTimeout(autoTimer));
  area.addEventListener('mouseleave', startAutoRotate);
  area.addEventListener('focusin',    () => clearTimeout(autoTimer));
  area.addEventListener('focusout',   startAutoRotate);

  /* Responsive */
  watchBreakpoints();
}

document.addEventListener('DOMContentLoaded', init);
