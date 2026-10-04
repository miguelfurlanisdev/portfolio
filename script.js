/* ==========================================================
   MV. — comportamento do site
   Conteúdo editável fica em data.js. Aqui só a lógica.
   ========================================================== */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = window.SITE;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------
     1. Conteúdo gerado a partir de data.js
     --------------------------------------------------------- */
  function renderStack() {
    const root = $('#tiles');
    if (!root) return;
    const tiles = D.stack.map((t) => `
      <li class="tile card reveal" data-spot>
        <span class="glyph" aria-hidden="true">${t.glyph.startsWith('#') ? icon(t.glyph.slice(1)) : esc(t.glyph)}</span>
        <div><h3>${esc(t.name)}</h3><small>${esc(t.note)}</small></div>
      </li>`);
    if (D.showAddTile) {
      tiles.push(`
      <li class="tile card add reveal" data-spot>
        <span class="glyph" aria-hidden="true">+</span>
        <div><h3>[ Adicionar tecnologia ]</h3><small>Em breve</small></div>
      </li>`);
    }
    root.innerHTML = tiles.join('');
    $$('.tile', root).forEach((el, i) => el.style.setProperty('--d', `${i * 70}ms`));
  }

  const MOCKS = [
    // 1: página com título, botão e blocos
    `<span class="l h w70"></span><span class="l w85"></span><span class="l w55"></span>
     <span class="l ac w30" style="height:22px;border-radius:99px;margin-top:.3rem"></span>
     <div class="blocks"><i></i><i></i><i></i></div><div class="blocks two"><i></i><i></i></div>`,
    // 2: grade de cards
    `<span class="l h w55"></span><span class="l w85"></span>
     <div class="blocks two"><i></i><i></i></div>`,
    // 3: lista
    `<span class="l h w40"></span><span class="l w85"></span><span class="l w70"></span><span class="l ac w30"></span>`
  ];

  function renderProjects() {
    const root = $('#projects');
    if (!root) return;
    root.innerHTML = D.projects.map((p, i) => {
      const n = String(i + 1).padStart(2, '0');
      const media = p.image
        ? `<img src="${esc(p.image)}" alt="Prévia do projeto ${esc(p.title)}" loading="lazy" decoding="async">`
        : `<div class="mock" aria-hidden="true"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-body">${MOCKS[i % MOCKS.length]}</div></div>`;
      const chips = p.tech.map((t) => `<li class="chip${p.placeholder ? ' is-ph' : ''}">${esc(t)}</li>`).join('');
      return `
      <article class="proj card reveal${i === 0 ? ' featured' : ''}" data-spot>
        <div class="proj-media">
          <span class="big-num" aria-hidden="true">${n}</span>
          ${p.placeholder ? '<span class="ph mono">// exemplo</span>' : ''}
          ${media}
        </div>
        <div class="proj-body">
          <div class="proj-top"><span class="num mono">${n}</span>${i === 0 ? '<span class="badge mono">Em destaque</span>' : ''}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <ul class="chips" aria-label="Tecnologias">${chips}</ul>
          <div class="proj-actions">
            <a class="btn primary sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">Ver projeto ${icon('i-arrow').replace('class="ico"', 'class="ico arr"')}</a>
            <a class="btn sm" href="${esc(p.code)}" target="_blank" rel="noopener noreferrer">${icon('i-github')}Código</a>
          </div>
        </div>
      </article>`;
    }).join('');
    $$('.proj', root).forEach((el, i) => el.style.setProperty('--d', `${i * 90}ms`));
  }

  /* ---------------------------------------------------------
     2. Nome em letras (entrada) — o h1 mantém aria-label
     --------------------------------------------------------- */
  function splitName() {
    const h = $('#name');
    if (!h) return;
    let i = 0;
    $$('.line', h).forEach((line) => {
      const txt = line.textContent.trim();
      line.textContent = '';
      [...txt].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--i', i++);
        s.setAttribute('aria-hidden', 'true');
        line.appendChild(s);
      });
    });
    requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('go')));
    setTimeout(() => h.classList.add('done'), reduce ? 50 : 2000);
  }

  /* ---------------------------------------------------------
     3. Grid de pontos que reage ao cursor (canvas leve)
     --------------------------------------------------------- */
  function dotGrid() {
    const cv = $('#grid');
    const hero = $('#inicio');
    if (!cv || !hero) return;
    const ctx = cv.getContext('2d');
    const GAP = 34, R = 200;
    let w = 0, h = 0, raf = 0, visible = true;
    const m = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!m.x) { m.x = m.tx = w * .7; m.y = m.ty = h * .35; }
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const r2 = R * R;
      const hot = [];
      ctx.fillStyle = 'rgba(255,255,255,.11)';
      for (let y = GAP; y < h; y += GAP) {
        for (let x = GAP; x < w; x += GAP) {
          const dx = x - m.x, dy = y - m.y, d2 = dx * dx + dy * dy;
          if (d2 < r2) hot.push(x, y, 1 - Math.sqrt(d2) / R);
          else ctx.fillRect(x - .75, y - .75, 1.5, 1.5);
        }
      }
      for (let i = 0; i < hot.length; i += 3) {
        const t = hot[i + 2], e = t * t * (3 - 2 * t); // smoothstep
        ctx.fillStyle = `rgba(255,138,76,${(.12 + e * .5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(hot[i], hot[i + 1], .8 + e * 2.1, 0, 6.2832);
        ctx.fill();
      }
      hero.style.setProperty('--gx', m.x + 'px');
      hero.style.setProperty('--gy', m.y + 'px');
    }

    function loop(t) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (t - m.last > 2200) { // sem interação: o brilho passeia sozinho
        m.tx = w * (.5 + .38 * Math.sin(t * .00035));
        m.ty = h * (.45 + .3 * Math.sin(t * .00052 + 1));
      }
      m.x += (m.tx - m.x) * .08;
      m.y += (m.ty - m.y) * .08;
      draw();
      raf = requestAnimationFrame(loop);
    }
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      m.tx = e.clientX - r.left; m.ty = e.clientY - r.top; m.last = performance.now();
    }, { passive: true });

    new ResizeObserver(resize).observe(hero);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(hero);
    document.addEventListener('visibilitychange', start);
    resize();
    start();
  }

  /* ---------------------------------------------------------
     4. Terminal da hero
     --------------------------------------------------------- */
  function terminal() {
    const cmd = $('#tcmd');
    if (!cmd) return;
    const text = 'node miguel.js';
    const lines = $$('.tl');
    const line = cmd.closest('.tline');
    const showAll = () => { cmd.textContent = text; line.classList.add('done'); lines.forEach((l) => l.classList.add('show')); };
    if (reduce) return showAll();

    const reveal = (n) => {
      if (n >= lines.length) return;
      lines[n].classList.add('show');
      setTimeout(() => reveal(n + 1), 120);
    };
    let i = 0;
    const type = () => {
      cmd.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 50 + Math.random() * 55);
      else setTimeout(() => { line.classList.add('done'); reveal(0); }, 320);
    };
    setTimeout(type, 1300);
  }

  /* ---------------------------------------------------------
     5. Interações: tilt, luz nos cards, botões magnéticos
     --------------------------------------------------------- */
  function interactions() {
    if (!fine) return;

    if (!reduce) {
      $$('[data-tilt]').forEach((el) => {
        let raf = 0;
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => { el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`; });
        });
        el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
      });

      $$('[data-magnet]').forEach((b) => {
        b.addEventListener('pointermove', (e) => {
          const r = b.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
          b.style.transform = `translate(${x * .18}px, ${y * .28}px)`;
        });
        b.addEventListener('pointerleave', () => { b.style.transform = ''; });
      });
    }

    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('[data-spot]');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     6. Navbar, progresso de rolagem, seção ativa, reveal
     --------------------------------------------------------- */
  function navbar() {
    const nav = $('#nav'), burger = $('.burger'), bar = $('#bar');
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('#menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        nav.classList.toggle('scrolled', y > 12);
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
        ticking = false;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();

    // link ativo
    const links = new Map($$('#menu .link').map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        const a = links.get(e.target.id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function reveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach((el) => el.classList.add('in')); return; }
    // atraso escalonado para itens da lista de contatos
    $$('[data-stagger] .reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 80}ms`));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     7. GitHub: repositórios reais (sem números inventados)
     --------------------------------------------------------- */
  async function repos() {
    const ul = $('#repos');
    if (!ul) return;
    const KEY = 'mv_repos_v1';
    const empty = (msg) => { ul.innerHTML = `<li class="none">${esc(msg)}</li>`; };
    try {
      let list = null;
      try {
        const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        if (c && Date.now() - c.t < 6e5) list = c.d;
      } catch (_) { /* storage indisponível */ }

      if (!list) {
        const r = await fetch(`https://api.github.com/users/${D.user}/repos?sort=updated&per_page=8`, { headers: { Accept: 'application/vnd.github+json' } });
        if (!r.ok) throw new Error('api');
        list = (await r.json()).map((x) => ({ name: x.name, url: x.html_url, desc: x.description, lang: x.language, fork: x.fork }));
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: list })); } catch (_) { /* ok */ }
      }

      const items = list.filter((x) => !x.fork).slice(0, 4);
      if (!items.length) return empty('Os repositórios públicos aparecem aqui.');
      ul.innerHTML = items.map((x) => `
        <li><a class="repo" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">
          <b>${esc(x.name)}${x.lang ? `<em>${esc(x.lang)}</em>` : ''}</b>
          ${x.desc ? `<span>${esc(x.desc)}</span>` : ''}
        </a></li>`).join('');
    } catch (_) {
      empty('Veja meus repositórios direto no GitHub.');
    }
  }

  function copyLink() {
    const btn = $('#copy');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.addEventListener('click', async () => {
      const v = D.links.github;
      try { await navigator.clipboard.writeText(v); }
      catch (_) {
        const t = document.createElement('textarea');
        t.value = v; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (__) { /* ok */ }
        t.remove();
      }
      btn.innerHTML = icon('i-check');
      btn.setAttribute('aria-label', 'Link copiado');
      setTimeout(() => { btn.innerHTML = original; btn.setAttribute('aria-label', 'Copiar link do GitHub'); }, 1800);
    });
  }

  // avatar do GitHub: se falhar, some sem deixar ícone quebrado
  function avatarFallback() {
    const img = $('#avatar');
    if (img) img.addEventListener('error', () => { img.style.display = 'none'; });
  }

  /* ---------------------------------------------------------
     Início
     --------------------------------------------------------- */
  renderStack();
  renderProjects();
  splitName();
  navbar();
  reveal();
  interactions();
  terminal();
  dotGrid();
  repos();
  copyLink();
  avatarFallback();
})();
