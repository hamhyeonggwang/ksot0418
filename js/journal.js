/**
 * 학회지 — Supabase 연동 (미설정 시 로컬 files/journal + 시드 데이터)
 */
(function () {
  'use strict';

  const CFG = window.KSOT_SUPABASE || {};
  const BUCKET = CFG.storageBucket || 'journal';
  const LOCAL_PDF_BASE = '../files/journal/';

  /** Supabase 미연결 시 사용 (제34권 1호 — journal.html 과 동기화) */
  const SEED = {
    issues: [
      {
        volume: 34,
        issue: 1,
        year: 2026,
        month: 3,
        label: '제34권 제1호',
        published_label: '2026년 3월 발행',
        article_count: 8,
        sort_order: 3401,
      },
    ],
    articles: [
      { volume: 34, issue: 1, article_num: 1, category: '원저', category_variant: 'primary', title: '척수장애인의 여가활동 만족도가 삶의 만족도에 미치는 영향: 자립과 정서적 도움의 다중매개효과', authors: '유승모, 차태현, 김희 외 1명', pages: 'pp. 1-12', doi: '10.14519/kjot.2026.34.1.01', pdf_storage_path: '34-1/01.pdf', sort_order: 1 },
      { volume: 34, issue: 1, article_num: 2, category: '원저', category_variant: 'primary', title: 'Sensory Profile-2 Summary and Interpretation (SPSI) ChatBot 프로토타입 개발 및 활용 전망', authors: '박다솔', pages: 'pp. 13-22', doi: '10.14519/kjot.2026.34.1.02', pdf_storage_path: '34-1/02.pdf', sort_order: 2 },
      { volume: 34, issue: 1, article_num: 3, category: '원저', category_variant: 'primary', title: '중국인유학생을 위한 작업역할기반 시간사용중재 프로그램 적용의 효과', authors: '양몽은, 정민예', pages: 'pp. 23-36', doi: '10.14519/kjot.2026.34.1.03', pdf_storage_path: '34-1/03.pdf', sort_order: 3 },
      { volume: 34, issue: 1, article_num: 4, category: '원저', category_variant: 'primary', title: '상호작용식 메트로놈 중재가 뇌졸중 환자의 집중력, 기능적 활동 및 삶의 질에 미치는 영향', authors: '손솔, 김덕주', pages: 'pp. 37-58', doi: '10.14519/kjot.2026.34.1.04', pdf_storage_path: '34-1/04.pdf', sort_order: 4 },
      { volume: 34, issue: 1, article_num: 5, category: '계량서지학적 분석', category_variant: 'teal', title: '중환자실 작업치료의 연구 동향: 계량서지학적 분석', authors: '심혜림, 김수경', pages: 'pp. 59-72', doi: '10.14519/kjot.2026.34.1.05', pdf_storage_path: '34-1/05.pdf', sort_order: 5 },
      { volume: 34, issue: 1, article_num: 6, category: '범위 문헌고찰', category_variant: 'teal', title: '커뮤니티 케어 서비스 대상자 선정기준에 관한 연구: 범위 문헌고찰', authors: '박은지, 홍익표', pages: 'pp. 73-85', doi: '10.14519/kjot.2026.34.1.06', pdf_storage_path: '34-1/06.pdf', sort_order: 6 },
      { volume: 34, issue: 1, article_num: 7, category: '체계적 고찰 및 메타분석', category_variant: 'teal', title: '감각통합기반 중재가 발달지연 및 장애 아동의 운동기능에 미치는 효과: 체계적 고찰 및 메타분석', authors: '임대웅, 차태현, 유두한 외 1명', pages: 'pp. 87-102', doi: '10.14519/kjot.2026.34.1.07', pdf_storage_path: '34-1/07.pdf', sort_order: 7 },
      { volume: 34, issue: 1, article_num: 8, category: '체계적 고찰', category_variant: 'teal', title: '휠체어 사용자의 이승(Transfer)에 영향을 미치는 요인에 관한 체계적 고찰', authors: '홍진이, 권영훈, 김종배', pages: 'pp. 103-121', doi: '10.14519/kjot.2026.34.1.08', pdf_storage_path: '34-1/08.pdf', sort_order: 8 },
    ],
  };

  let state = {
    issues: [],
    articles: [],
    source: 'local',
    latestKey: '34-1',
  };

  function isSupabaseReady() {
    return Boolean(CFG.url && CFG.anonKey);
  }

  function pdfUrl(path) {
    if (!path) return '#';
    if (isSupabaseReady()) {
      const base = CFG.url.replace(/\/$/, '');
      return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
    }
    return LOCAL_PDF_BASE + path.replace(/^\//, '');
  }

  function issueKey(vol, iss) {
    return `${vol}-${iss}`;
  }

  function tagClass(variant) {
    return variant === 'teal' ? 'tag tag-teal' : 'tag tag-primary';
  }

  function shortAuthors(authors) {
    if (!authors) return '';
    if (authors.includes(' 외')) return authors.split(',')[0].trim() + ' 외';
    const parts = authors.split(',');
    return parts.length > 2 ? parts[0].trim() + ' 외' : authors;
  }

  function renderArticleCard(a) {
    const url = pdfUrl(a.pdf_storage_path);
    return `
      <div class="article-item journal-article-card" style="background:#fff;border:1px solid var(--border-light);border-radius:var(--radius-md);padding:20px 22px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span class="${tagClass(a.category_variant)}">${escapeHtml(a.category)}</span>
          <span style="font-size:11px;color:var(--text-light);">${escapeHtml(a.pages || '')}</span>
        </div>
        <div style="font-size:15px;font-weight:600;color:var(--text-dark);line-height:1.5;margin-bottom:8px;">${escapeHtml(a.title)}</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <span style="font-size:12.5px;color:var(--text-light);"><i class="fa-solid fa-user"></i> ${escapeHtml(a.authors)}</span>
          ${a.doi ? `<span style="font-size:12.5px;color:var(--text-light);"><i class="fa-solid fa-link"></i> DOI ${escapeHtml(a.doi)}</span>` : ''}
          <a href="${url}" target="_blank" rel="noopener noreferrer" download style="font-size:12.5px;color:var(--primary);font-weight:600;"><i class="fa-solid fa-file-pdf"></i> PDF</a>
        </div>
      </div>`;
  }

  function renderArchiveRow(a) {
    const url = pdfUrl(a.pdf_storage_path);
    const volIss = `${a.volume}(${a.issue})`;
    return `
      <tr data-issue-key="${issueKey(a.volume, a.issue)}">
        <td><span class="${tagClass(a.category_variant)}">${escapeHtml(a.category)}</span></td>
        <td>${escapeHtml(a.title)}</td>
        <td>${escapeHtml(shortAuthors(a.authors))}</td>
        <td>${volIss}</td>
        <td><a href="${url}" target="_blank" rel="noopener noreferrer" download style="color:var(--primary);font-weight:600;"><i class="fa-solid fa-file-pdf"></i></a></td>
      </tr>`;
  }

  function escapeHtml(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function normalizeFromSeed() {
    state.issues = SEED.issues.map((i) => ({ ...i, id: issueKey(i.volume, i.issue) }));
    state.articles = SEED.articles.map((a) => ({
      ...a,
      volume: a.volume,
      issue: a.issue,
    }));
    state.source = 'local';
    const latest = state.issues.sort((x, y) => y.sort_order - x.sort_order)[0];
    if (latest) state.latestKey = issueKey(latest.volume, latest.issue);
  }

  async function fetchFromSupabase() {
    const base = CFG.url.replace(/\/$/, '');
    const headers = {
      apikey: CFG.anonKey,
      Authorization: `Bearer ${CFG.anonKey}`,
    };

    const [issuesRes, articlesRes] = await Promise.all([
      fetch(`${base}/rest/v1/journal_issues?select=*&order=sort_order.desc,volume.desc,issue.desc`, { headers }),
      fetch(`${base}/rest/v1/journal_articles?select=*&order=sort_order.asc`, { headers }),
    ]);

    if (!issuesRes.ok) throw new Error('journal_issues 조회 실패');
    if (!articlesRes.ok) throw new Error('journal_articles 조회 실패');

    const issues = await issuesRes.json();
    const rawArticles = await articlesRes.json();
    const issueMap = Object.fromEntries(issues.map((i) => [i.id, i]));

    state.issues = issues;
    state.articles = rawArticles.map((row) => {
      const iss = issueMap[row.issue_id] || {};
      return {
        ...row,
        volume: iss.volume,
        issue: iss.issue,
      };
    });
    state.source = 'supabase';

    const latest = state.issues[0];
    if (latest) state.latestKey = issueKey(latest.volume, latest.issue);
  }

  function articlesForIssue(vol, iss) {
    if (vol == null || iss == null) return state.articles;
    return state.articles.filter((a) => a.volume === vol && a.issue === iss);
  }

  function renderCurrent(issue) {
    const titleEl = document.getElementById('journal-current-title');
    const metaEl = document.getElementById('journal-current-meta');
    const listEl = document.getElementById('journal-current-list');
    if (!listEl) return;

    const arts = articlesForIssue(issue.volume, issue.issue).sort((a, b) => a.sort_order - b.sort_order);

    if (titleEl) titleEl.textContent = `최신호 (${issue.label})`;
    if (metaEl) {
      metaEl.innerHTML = `<strong style="font-size:15px;color:var(--text-dark);">Vol.${issue.volume}, No.${issue.issue} | ${escapeHtml(issue.published_label || '')}</strong>
        <p style="font-size:13px;color:var(--text-mid);margin-top:2px;">수록 논문 ${arts.length}편${state.source === 'supabase' ? ' · Supabase' : ''}</p>`;
    }
    listEl.innerHTML = arts.map(renderArticleCard).join('');
  }

  function renderArchiveTable(filterVol, filterIss, searchQuery, searchField) {
    const tbody = document.getElementById('journal-archive-tbody');
    if (!tbody) return;

    let list = [...state.articles];
    if (filterVol != null && filterIss != null) {
      list = list.filter((a) => a.volume === filterVol && a.issue === filterIss);
    }

    const q = (searchQuery || '').trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const title = (a.title || '').toLowerCase();
        const authors = (a.authors || '').toLowerCase();
        const doi = (a.doi || '').toLowerCase();
        if (searchField === '저자') return authors.includes(q);
        if (searchField === '키워드' || searchField === '초록') return title.includes(q);
        return title.includes(q) || authors.includes(q) || doi.includes(q);
      });
    }

    list.sort((a, b) => {
      if (b.volume !== a.volume) return b.volume - a.volume;
      if (b.issue !== a.issue) return b.issue - a.issue;
      return a.sort_order - b.sort_order;
    });

    tbody.innerHTML = list.length
      ? list.map(renderArchiveRow).join('')
      : '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-mid);">검색 결과가 없습니다.</td></tr>';

    const countEl = document.getElementById('journal-result-count');
    if (countEl) countEl.textContent = String(list.length);
  }

  function fillIssueSelect() {
    const sel = document.getElementById('journal-issue-select');
    if (!sel) return;

    const opts = ['<option value="all">-전체-</option>'];
    state.issues.forEach((i) => {
      const key = issueKey(i.volume, i.issue);
      opts.push(`<option value="${key}">${escapeHtml(i.label)}</option>`);
    });
    sel.innerHTML = opts.join('');
    sel.value = state.latestKey || 'all';
  }

  function parseIssueSelect(val) {
    if (!val || val === 'all') return { volume: null, issue: null };
    const [v, n] = val.split('-').map(Number);
    return { volume: v, issue: n };
  }

  function bindUi() {
    const toggle = document.getElementById('current-toggle');
    const body = document.getElementById('current-body');
    if (toggle && body) {
      toggle.addEventListener('click', () => {
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        const chev = toggle.querySelector('.accordion-chevron');
        if (chev) chev.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

    const searchBtn = document.getElementById('journal-search-btn');
    const issueSel = document.getElementById('journal-issue-select');
    const queryInput = document.getElementById('journal-search-query');
    const fieldSel = document.getElementById('journal-search-field');

    function runSearch() {
      const { volume, issue } = parseIssueSelect(issueSel?.value);
      renderArchiveTable(volume, issue, queryInput?.value, fieldSel?.value);
    }

    if (searchBtn) searchBtn.addEventListener('click', runSearch);
    if (queryInput) {
      queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runSearch();
      });
    }
    if (issueSel) issueSel.addEventListener('change', runSearch);
  }

  function showStatus() {
    const el = document.getElementById('journal-data-source');
    if (!el) return;
    el.textContent =
      state.source === 'supabase'
        ? '데이터: Supabase · PDF: Storage'
        : '데이터: 로컬 시드 · PDF: files/journal';
    el.className = 'journal-source-badge journal-source-badge--' + state.source;
  }

  async function init() {
    const statusEl = document.getElementById('journal-loading');
    try {
      if (isSupabaseReady()) {
        if (statusEl) statusEl.textContent = '학회지 목록을 불러오는 중…';
        await fetchFromSupabase();
      } else {
        normalizeFromSeed();
      }
    } catch (err) {
      console.warn('[journal] Supabase 로드 실패, 로컬 시드 사용:', err);
      normalizeFromSeed();
    } finally {
      if (statusEl) statusEl.remove();
    }

    const latest =
      state.issues.find((i) => issueKey(i.volume, i.issue) === state.latestKey) || state.issues[0];
    if (latest) renderCurrent(latest);

    fillIssueSelect();
    const { volume, issue } = parseIssueSelect(state.latestKey);
    renderArchiveTable(volume, issue, '', '논문명');
    showStatus();
    bindUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
