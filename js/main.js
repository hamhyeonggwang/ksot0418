/* ===================================
   KSOT - 대한작업치료학회 Main JS
   =================================== */

'use strict';

/* ---- Utility ---- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ---- Hero Slider ---- */
class HeroSlider {
  constructor() {
    this.slides = $$('.hero-slide');
    this.dots = $$('.hero-dot');
    this.current = 0;
    this.total = this.slides.length;
    this.timer = null;
    this.interval = 5500;
    this.init();
  }
  init() {
    if (!this.slides.length) return;
    this.goTo(0);
    this.startAuto();
    $$('.hero-arrow').forEach(btn => {
      on(btn, 'click', () => {
        const dir = btn.dataset.dir === 'next' ? 1 : -1;
        this.goTo((this.current + dir + this.total) % this.total);
        this.resetAuto();
      });
    });
    this.dots.forEach((dot, i) => {
      on(dot, 'click', () => { this.goTo(i); this.resetAuto(); });
    });
    // Touch/swipe
    let sx = 0;
    const hero = $('#hero-slides');
    if (hero) {
      on(hero, 'touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      on(hero, 'touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) {
          this.goTo((this.current + (dx < 0 ? 1 : -1) + this.total) % this.total);
          this.resetAuto();
        }
      });
    }
  }
  goTo(n) {
    this.slides[this.current]?.classList.remove('active');
    this.dots[this.current]?.classList.remove('active');
    this.current = n;
    this.slides[this.current]?.classList.add('active');
    this.dots[this.current]?.classList.add('active');
  }
  startAuto() {
    this.timer = setInterval(() => this.goTo((this.current + 1) % this.total), this.interval);
  }
  resetAuto() {
    clearInterval(this.timer);
    this.startAuto();
  }
}

/* ---- Header Scroll Effect ---- */
function initHeader() {
  const header = $('#header');
  if (!header) return;
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    lastY = y;
  };
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile Drawer ---- */
function initDrawer() {
  const drawer = $('#mobileDrawer');
  const overlay = $('#drawerOverlay');
  const openBtn = $('#btnHamburger');
  const closeBtn = $('#btnDrawerClose');

  const open = () => {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  on(openBtn, 'click', open);
  on(closeBtn, 'click', close);
  on(overlay, 'click', close);

  // Accordion sub-menus
  $$('.drawer-nav-item').forEach(item => {
    on(item, 'click', () => {
      const sub = item.nextElementSibling;
      if (!sub?.classList.contains('drawer-sub-nav')) return;
      const isOpen = sub.classList.contains('show');
      $$('.drawer-sub-nav.show').forEach(el => el.classList.remove('show'));
      $$('.drawer-nav-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) {
        sub.classList.add('show');
        item.classList.add('open');
      }
    });
  });
}

/* ---- Search Overlay ---- */
function initSearch() {
  const overlay = $('#searchOverlay');
  const closeBtn = $('#searchClose');
  const input = $('#searchInput');
  const openBtns = $$('[data-action="search"]');

  const open = () => {
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input?.focus(), 300);
  };
  const close = () => {
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    if (input) input.value = '';
  };

  openBtns.forEach(btn => on(btn, 'click', open));
  on(closeBtn, 'click', close);
  on(overlay, 'click', e => { if (e.target === overlay) close(); });
  on(document, 'keydown', e => { if (e.key === 'Escape') close(); });

  on(input, 'keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val) {
        alert(`"${val}" 검색 결과 페이지로 이동합니다.`);
        close();
      }
    }
  });

  $$('.search-tag').forEach(tag => {
    on(tag, 'click', () => {
      if (input) { input.value = tag.textContent; input.focus(); }
    });
  });
}

/* ---- Popup System ---- */
class PopupManager {
  constructor() {
    this.popups = {};
    this.init();
  }
  init() {
    $$('[data-popup]').forEach(el => {
      on(el, 'click', () => this.open(el.dataset.popup));
    });
    $$('.popup-overlay').forEach(overlay => {
      const id = overlay.id;
      this.popups[id] = overlay;
      // Close on overlay click
      on(overlay, 'click', e => {
        if (e.target === overlay) this.close(id);
      });
      // Close button
      const closeBtn = overlay.querySelector('.popup-close, .btn-popup-close');
      on(closeBtn, 'click', () => this.close(id));
    });
    on(document, 'keydown', e => {
      if (e.key === 'Escape') {
        const open = $$('.popup-overlay.active');
        if (open.length) this.close(open[open.length-1].id);
      }
    });
  }
  open(id) {
    const overlay = $(`#${id}`);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Popup tabs
    const tabs = $$('.popup-tab', overlay);
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === 0);
      on(tab, 'click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const panels = $$('.popup-tab-panel', overlay);
        panels.forEach((p, j) => p.classList.toggle('hidden', j !== i));
      });
    });
  }
  close(id) {
    const overlay = $(`#${id}`);
    if (!overlay) return;
    // Check "today no show"
    const noShow = overlay.querySelector('.popup-no-show input');
    if (noShow?.checked) {
      const key = `popup_${id}_closed`;
      const exp = new Date(); exp.setHours(23,59,59,999);
      localStorage.setItem(key, exp.toISOString());
    }
    sessionStorage.setItem('popup_announcement_closed', '1');
    overlay.classList.remove('active');
    const anyOpen = $$('.popup-overlay.active').length > 0;
    if (!anyOpen) document.body.style.overflow = '';
  }
}

/* ---- Notice Board Tabs ---- */
function initNoticeTabs() {
  const container = $('#noticeBoard');
  if (!container) return;
  const tabs = $$('.tab', container);
  const lists = $$('.notice-tab-content', container);
  tabs.forEach((tab, i) => {
    on(tab, 'click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      lists.forEach(l => l.classList.add('hidden'));
      tab.classList.add('active');
      lists[i]?.classList.remove('hidden');
    });
  });
}

/* ---- Counter Animation ---- */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();
      const step = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const els = $$('.fade-up, .fade-left, .fade-right');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ---- Scroll To Top ---- */
function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;
  on(window, 'scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Smooth Anchor Scroll ---- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/* ---- Sidebar Scrollspy ---- */
function initSidebarScrollspy() {
  const links = $$('.sidebar-nav a[href^="#"]');
  if (!links.length) return;

  const items = links
    .map(a => ({ link: a, section: document.querySelector(a.getAttribute('href')) }))
    .filter(item => {
      if (!item.section) return false;
      return getComputedStyle(item.section).display !== 'none';
    });

  if (!items.length) return;

  const update = () => {
    const threshold = window.scrollY + window.innerHeight * 0.25;
    let current = items[0];
    for (const item of items) {
      if (item.section.offsetTop <= threshold) current = item;
    }
    links.forEach(a => a.classList.remove('active'));
    current.link.classList.add('active');
  };

  on(window, 'scroll', update, { passive: true });
  update();
}

/* ---- Active Nav Highlight ---- */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.gnb > ul > li').forEach(li => {
    const link = li.querySelector('a');
    if (link?.getAttribute('href') === path) li.classList.add('active');
  });
}

/* ---- Tooltip ---- */
function initTooltips() {
  $$('[data-tooltip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip-box';
    tip.textContent = el.dataset.tooltip;
    tip.style.cssText = `
      position:absolute; bottom:calc(100%+8px); left:50%; transform:translateX(-50%);
      background:#1a202c; color:#fff; font-size:12px; padding:5px 10px;
      border-radius:6px; white-space:nowrap; pointer-events:none;
      opacity:0; transition:opacity 0.2s ease; z-index:200;
    `;
    el.style.position = 'relative';
    el.appendChild(tip);
    on(el, 'mouseenter', () => tip.style.opacity = '1');
    on(el, 'mouseleave', () => tip.style.opacity = '0');
  });
}


/* ---- Partner Track Pause on Hover ---- */
function initPartnerTrack() {
  const inner = $('.partner-inner');
  if (!inner) return;
  on(inner, 'mouseenter', () => inner.style.animationPlayState = 'paused');
  on(inner, 'mouseleave', () => inner.style.animationPlayState = 'running');
}

/* ---- Lazy Images ---- */
function initLazyImages() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

/* ---- Community Feed Tabs ---- */
function initFeedTabs() {
  const tabs = $$('.feed-tab');
  const items = $$('.feed-item');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    on(tab, 'click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const cat = tab.dataset.tab;
      items.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ---- Conference Countdown ---- */
function initCountdown() {
  const timer = $('#countdownTimer');
  if (!timer) return;
  const target = new Date(timer.dataset.target);
  const pad = n => String(n).padStart(2, '0');
  const update = () => {
    const diff = target - new Date();
    if (diff <= 0) { timer.querySelector('.countdown-timer') && (timer.innerHTML = '<p style="color:rgba(255,255,255,0.6);font-size:18px;">학술대회가 종료되었습니다</p>'); return; }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    const cdDays  = $('#cdDays');
    const cdHours = $('#cdHours');
    const cdMins  = $('#cdMins');
    const cdSecs  = $('#cdSecs');
    if (cdDays)  cdDays.textContent  = days;
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins)  cdMins.textContent  = pad(mins);
    if (cdSecs)  cdSecs.textContent  = pad(secs);
  };
  update();
  setInterval(update, 1000);
}

/* ---- YouTube TV Facade ---- */
function initTVFacade() {
  const facade = $('#tvMainFacade');
  if (!facade) return;
  const playBtn = facade.querySelector('.tv-play-btn');
  on(playBtn, 'click', () => {
    const videoId = facade.dataset.videoid;
    if (!videoId) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allow = 'autoplay; encrypted-media; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:16px;';
    facade.style.position = 'relative';
    facade.innerHTML = '';
    facade.appendChild(iframe);
  });
}

/* ---- Education Hub Drag Scroll ---- */
function initEduHubDrag() {
  const wrap = $('.edu-hub-scroll-wrap');
  if (!wrap) return;
  let isDown = false, startX = 0, scrollLeft = 0;
  on(wrap, 'mousedown', e => {
    isDown = true;
    wrap.classList.add('grabbing');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  on(wrap, 'mouseleave', () => { isDown = false; wrap.classList.remove('grabbing'); });
  on(wrap, 'mouseup',    () => { isDown = false; wrap.classList.remove('grabbing'); });
  on(wrap, 'mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX);
  });
}

/* ---- Popup Notice ---- */
function initPopupNotice() {
  const overlay = $('#popupNotice');
  if (!overlay) return;

  const STORAGE_KEY = 'pn_hide_until';
  const today = new Date().toDateString();
  if (localStorage.getItem(STORAGE_KEY) === today) return;

  const slides = overlay.querySelectorAll('.pn-slide');
  const dots   = overlay.querySelectorAll('.pn-dot');
  const counter = $('#pnCounter');
  const total = slides.length;
  let current = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  on($('#pnPrev'), 'click', () => goTo(current - 1));
  on($('#pnNext'), 'click', () => goTo(current + 1));
  dots.forEach(dot => on(dot, 'click', () => goTo(+dot.dataset.idx)));

  function close() {
    if ($('#pnNoShow')?.checked) localStorage.setItem(STORAGE_KEY, today);
    overlay.classList.remove('is-visible');
  }

  on($('#pnClose'), 'click', close);
  on($('#pnX'),    'click', close);
  on(overlay, 'click', e => { if (e.target === overlay) close(); });
  on(document, 'keydown', e => { if (e.key === 'Escape') close(); });

  setTimeout(() => overlay.classList.add('is-visible'), 400);
}

/* ---- 회원 세션(데모): 마이페이지 메뉴 노출 ---- */
const KSOT_MEMBER_SESSION_KEY = 'ksot_member_session';

function syncMemberSessionNav() {
  const on = localStorage.getItem(KSOT_MEMBER_SESSION_KEY) === '1';
  document.documentElement.classList.toggle('ksot-logged-in', on);
  if (document.body) document.body.classList.toggle('is-logged-in', on);
}

function initMemberSessionNav() {
  syncMemberSessionNav();
  window.addEventListener('storage', e => {
    if (e.key === KSOT_MEMBER_SESSION_KEY) syncMemberSessionNav();
  });

  const loginBtn = document.getElementById('btnKsotMemberLogin');
  if (loginBtn) {
    on(loginBtn, 'click', e => {
      e.preventDefault();
      localStorage.setItem(KSOT_MEMBER_SESSION_KEY, '1');
      const path = window.location.pathname || '';
      const onMemberPage = /member\.html/i.test(path);
      if (onMemberPage) {
        window.location.hash = 'mypage';
        window.location.reload();
      } else {
        window.location.href = path.includes('/pages/') ? 'member.html#mypage' : 'pages/member.html#mypage';
      }
    });
  }
}

/* ---- Initialize All ---- */
if (document.body) syncMemberSessionNav();

document.addEventListener('DOMContentLoaded', () => {
  initMemberSessionNav();
  new HeroSlider();
  initHeader();
  initDrawer();
  initSearch();
  new PopupManager();
  initNoticeTabs();
  initCounters();
  initScrollAnimations();
  initScrollTop();
  initSmoothScroll();
  initActiveNav();
  initTooltips();
  initPartnerTrack();
  initLazyImages();
  initFeedTabs();
  initCountdown();
  initTVFacade();
  initEduHubDrag();
  initPopupNotice();
  initSidebarScrollspy();
});
