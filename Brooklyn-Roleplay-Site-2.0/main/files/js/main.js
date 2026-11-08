/* =========================================================
   BROOKLYN ROLEPLAY — SITE 2.0
   100% estático: sem banco de dados, sem login, sem Supabase.
   ========================================================= */
(function () {
  'use strict';

  /* ============ CONFIG — edite aqui ============ */
  const CONFIG = {
    ip: '191.96.78.19:22077',
    whatsapp: '5575992026081',            // DDI + DDD + número, só dígitos
    discord: 'https://discord.gg/Z6g32S2Fvn',
    natal: true,                          // neve caindo no site (false pra desligar)
    // Logo do site. Quando salvar a natalina, troque para 'main/files/images/logo-natal.png'
    logo: 'main/files/images/logo.png'
  };

  const IMG = 'main/files/images/galeria/';

  /* Sistemas (aba "Sistemas") */
  const SYSTEMS = [
    { name: 'Criação de personagem', img: 'criacao-personagem', text: 'Monte seu personagem do jeito que quiser: nome, idade, nacionalidade e história. Tudo num painel limpo, com prévia em tempo real e tempo de jogo salvo.', tags: ['Até 3 personagens', 'Histórico', 'Prévia ao vivo'] },
    { name: 'Troca rápida de personagem', img: 'tres-personagens', text: 'Tem mais de um personagem? Troque entre eles por um menu radial, sem sair do servidor e sem perder o progresso de nenhum.', tags: ['Menu radial', '3 slots', 'Sem relog'] },
    { name: 'Concessionária futurista', img: 'concessionaria', text: 'Escolha o carro, veja velocidade e aceleração, personalize cor, faróis e rodas antes de comprar e faça o test drive pela cidade.', tags: ['Test drive', 'Customização', 'Dinheiro ou PV'] },
    { name: 'Garagem', img: 'garagem', text: 'Seus veículos organizados com placa, status e desempenho. Resgate, compartilhe com amigos, venda ou troque com outros jogadores.', tags: ['Resgate', 'Compartilhada', 'Venda e troca'] },
    { name: 'Tunagem', img: 'tunagem', text: 'Modos de performance prontos ou ajuste manual: rodas, peças, neon, efeitos, som e tração. Veja o ganho de cada peça antes de confirmar.', tags: ['Performance', 'Neon', 'Tração'] },
    { name: 'Agência de empregos', img: 'agencia-empregos', text: 'Escolha onde trabalhar entre empresas da cidade — Speedy, EcoClean, Tasty, PowerFix, CityBus, BeefMaster, DeepMine — cada uma com salário, vagas e progressão.', tags: ['7+ empresas', 'Salário por nível', 'Progressão'] },
    { name: 'Celular', img: 'celular', text: 'Um iPhone de verdade no bolso: WhatsApp, Instagram, Spotify, TikTok, X, YouTube e Netflix dentro do RP. Baixe só os apps que quiser.', tags: ['WhatsApp', 'Redes sociais', 'Loja de apps'] },
    { name: 'Inventário', img: 'inventario', text: 'Inventário por peso com slots, troca segura entre jogadores, uso rápido de itens e registro de tudo que entra e sai.', tags: ['Peso', 'Troca', 'Logs'] },
    { name: 'Oficina mecânica', img: 'mecanico', text: 'Notebook da oficina com baias, diagnóstico, ordem de serviço, nota fiscal e estoque. Mecânico aqui é profissão de verdade.', tags: ['Baias', 'Diagnóstico', 'Nota fiscal'] },
    { name: 'Guarda-roupa', img: 'guarda-roupa', text: 'Suas peças organizadas por coleção. Vista, venda, descarte ou passe pra outro jogador — seu estilo, suas regras.', tags: ['Coleções', 'Venda', 'Presentear'] },
    { name: 'Lojas de roupa', img: 'loja-roupas', text: 'Máscaras, óculos, bonés, coletes e muito mais. Monte o visual do seu personagem com centenas de itens.', tags: ['Centenas de itens', 'Acessórios', 'Estilo'] },
    { name: 'Cidade viva', img: 'neon', text: 'Neon no carro, HUD própria, minimapa com GPS e uma cidade que não dorme. Cada detalhe com a identidade do Brooklyn.', tags: ['HUD própria', 'GPS', 'Noite'] },
    { name: 'Tela de carregamento', img: 'tela-carregamento', text: 'Da tela de carregamento ao primeiro passo na cidade, tudo foi desenhado pra te colocar no clima do Brooklyn.', tags: ['Economia viva', 'Identidade própria'] }
  ];

  /* Galeria — size: big | wide | tall | '' */
  const GALLERY = [
    { img: 'concessionaria', cap: 'Concessionária futurista', size: 'big' },
    { img: 'neon', cap: 'Neon na madrugada', size: 'tall' },
    { img: 'tunagem', cap: 'Tunagem', size: '' },
    { img: 'criacao-personagem', cap: 'Criação de personagem', size: '' },
    { img: 'celular', cap: 'Celular', size: 'wide' },
    { img: 'garagem', cap: 'Garagem', size: '' },
    { img: 'loja-roupas', cap: 'Loja de roupas', size: '' },
    { img: 'agencia-empregos', cap: 'Agência de empregos', size: 'wide' },
    { img: 'mecanico', cap: 'Oficina mecânica', size: 'big' },
    { img: 'inventario', cap: 'Inventário', size: 'tall' },
    { img: 'guarda-roupa', cap: 'Guarda-roupa', size: '' },
    { img: 'tres-personagens', cap: 'Troca de personagem', size: '' },
    { img: 'tela-carregamento', cap: 'Tela de carregamento', size: 'wide' }
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ============ Logo (configurável) ============ */
  $$('.js-logo').forEach((img) => { if (CONFIG.logo) img.src = CONFIG.logo; });

  /* ============ Toast ============ */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg, ms = 2600) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), ms);
  };

  /* ============ Copiar ============ */
  const copy = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) { /* cai no fallback */ }
    const t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(t); t.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  };

  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-copy]');
    if (!el) return;
    const ok = await copy(el.getAttribute('data-copy'));
    toast(ok ? (el.getAttribute('data-toast') || 'Copiado!') : 'Não deu pra copiar. Selecione e copie manualmente.');
  });

  /* ============ Conectar (mtasa://) ============ */
  $$('.js-connect').forEach((a) => {
    a.addEventListener('click', () => {
      toast('Abrindo o MTA… Se não abrir, instale o MTA:SA ou cole o IP no Quick Connect.', 4200);
    });
  });

  /* ============ Header / menu ============ */
  const header = $('#header');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    toTop.classList.toggle('is-visible', y > 800);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const burger = $('#burger');
  const nav = $('#nav');
  const closeNav = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach((a) => a.addEventListener('click', closeNav));

  // link ativo
  const sections = $$('main section[id]');
  const links = $$('a', nav);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => so.observe(s));
  }

  /* ============ Sistemas ============ */
  const sysList = $('#sysList');
  const sysShot = $('#sysShot');
  const sysImg = $('#sysImg');
  let sysIndex = 0;
  const arrowSvg = '<svg><use href="#i-arrow"/></svg>';

  SYSTEMS.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'sys-tab';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.innerHTML = `<span class="sys-tab__num">${String(i + 1).padStart(2, '0')}</span><span class="sys-tab__name">${s.name}</span>${arrowSvg}`;
    b.addEventListener('click', () => showSystem(i, true));
    sysList.appendChild(b);
    const pre = new Image(); pre.src = IMG + s.img + '.webp';
  });

  function showSystem(i, user) {
    sysIndex = i;
    const s = SYSTEMS[i];
    $$('.sys-tab', sysList).forEach((t, k) => {
      t.classList.toggle('is-active', k === i);
      t.setAttribute('aria-selected', String(k === i));
    });
    sysShot.classList.add('is-swapping');
    setTimeout(() => {
      sysImg.src = IMG + s.img + '.webp';
      sysImg.alt = s.name;
      sysShot.classList.remove('is-swapping');
    }, 180);
    $('#sysTitle').textContent = s.name;
    $('#sysText').textContent = s.text;
    $('#sysTags').innerHTML = s.tags.map((t) => `<span class="tag">${t}</span>`).join('');
    if (user && window.innerWidth <= 960) {
      const tab = $$('.sys-tab', sysList)[i];
      sysList.scrollTo({ left: tab.offsetLeft - 20, behavior: 'smooth' });
    }
  }
  showSystem(0);
  sysShot.addEventListener('click', () => {
    const gi = GALLERY.findIndex((g) => g.img === SYSTEMS[sysIndex].img);
    openLightbox(gi >= 0 ? gi : 0);
  });

  /* ============ Galeria + Lightbox ============ */
  const gallery = $('#gallery');
  GALLERY.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gallery__item' + (g.size ? ' gallery__item--' + g.size : '');
    b.setAttribute('data-reveal', '');
    b.setAttribute('aria-label', 'Ampliar: ' + g.cap);
    const src = (g.size === 'big' || g.size === 'wide') ? g.img + '.webp' : g.img + '-thumb.webp';
    b.innerHTML = `<img src="${IMG + src}" alt="${g.cap}" loading="lazy" /><span>${g.cap}</span>`;
    b.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(b);
  });

  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  let lbIndex = 0;
  function openLightbox(i) {
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[lbIndex];
    lbImg.src = IMG + g.img + '.webp';
    lbImg.alt = g.cap;
    lbCap.textContent = g.cap + '  ·  ' + (lbIndex + 1) + '/' + GALLERY.length;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  const closeLightbox = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; };
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbIndex - 1); });
  $('#lbNext').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lbIndex + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ============ Inscrição (sem banco de dados) ============ */
  const form = $('#signupForm');
  const hist = $('#f-historia');
  const histCount = $('#histCount');
  const DRAFT_KEY = 'bkrp_inscricao_rascunho';

  // rascunho só no navegador da pessoa (opcional)
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d) Object.keys(d).forEach((k) => { const el = form.elements[k]; if (el && el.type !== 'checkbox') el.value = d[k]; });
  } catch (e) { /* sem storage, segue */ }
  const saveDraft = () => {
    try {
      const d = {};
      ['nome', 'idade', 'discord', 'personagem', 'experiencia', 'origem', 'historia'].forEach((k) => { d[k] = form.elements[k].value; });
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch (e) { /* ignora */ }
  };
  const updCount = () => { histCount.textContent = hist.value.length; };
  hist.addEventListener('input', updCount); updCount();
  form.addEventListener('input', (e) => {
    const f = e.target.closest('.field, .check');
    if (f) f.classList.remove('is-invalid');
    saveDraft();
  });


  function validate() {
    let firstBad = null;
    const required = ['nome', 'idade', 'discord', 'personagem', 'experiencia', 'historia'];
    required.forEach((k) => {
      const el = form.elements[k];
      let bad = !el.value.trim();
      if (k === 'idade') { const n = parseInt(el.value, 10); bad = !(n >= 18 && n <= 99); }
      if (k === 'historia') bad = el.value.trim().length < 30;
      el.closest('.field').classList.toggle('is-invalid', bad);
      if (bad && !firstBad) firstBad = el;
    });
    const reg = form.elements.regras;
    $('#f-regras-wrap').classList.toggle('is-invalid', !reg.checked);
    if (!reg.checked && !firstBad) firstBad = reg;

    if (firstBad) {
      firstBad.focus({ preventScroll: false });
      const idade = parseInt(form.elements.idade.value, 10);
      if (form.elements.idade.value && idade < 18) toast('O Brooklyn é só para maiores de 18 anos.');
      else if (firstBad === form.elements.historia && hist.value.trim()) toast('Conta um pouco mais da história (mínimo 30 caracteres).');
      else toast('Preencha os campos obrigatórios.');
      return false;
    }
    return true;
  }

  function buildMessage() {
    const v = (k) => form.elements[k].value.trim();
    return [
      '📝 *INSCRIÇÃO WL — BROOKLYN ROLEPLAY*',
      '',
      '👤 *Nome/apelido:* ' + v('nome'),
      '🎂 *Idade:* ' + v('idade'),
      '💬 *Discord:* ' + v('discord'),
      '🎭 *Personagem:* ' + v('personagem'),
      '🎮 *Experiência com RP:* ' + v('experiencia'),
      '📍 *Conheceu por:* ' + (v('origem') || 'Não informado'),
      '',
      '📖 *História do personagem:*',
      v('historia'),
      '',
      '✅ Confirmo ter 18+ e respeitar as regras.',
      '— enviado pelo site brooklynroleplay.com'
    ].join('\n');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const msg = buildMessage();

    const url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
    toast('Abrindo o WhatsApp… é só apertar enviar!', 4000);
    try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* ignora */ }
  });

  /* ============ Reveal ============ */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ============ Parallax leve nos personagens ============ */
  const chars = $('.chars');
  if (chars && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const hero = $('.hero');
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      chars.style.transform = `translate(${x * -10}px, ${y * -6}px)`;
    });
  }

  $('#year').textContent = new Date().getFullYear();

  /* ============ Neve (versão natalina) ============ */
  const canvas = $('#snow');
  if (CONFIG.natal && canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, flakes = [];
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(90, Math.round(w / 16));
      flakes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6, s: Math.random() * 0.6 + 0.25,
        d: Math.random() * Math.PI * 2, o: Math.random() * 0.5 + 0.25
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    let running = true;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(tick); });
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.35;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.o})`; ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
