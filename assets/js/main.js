/* YAP Soluções · LP. JavaScript sem dependências, só aprimoramento:
   a página funciona inteira sem ele. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: fica sólido quando o topo do hero sai da tela */
  var hdr = doc.getElementById('hdr');
  var hero = doc.getElementById('inicio');
  function setSolid() {
    if (!hdr) return;
    var limit = hero ? Math.max(60, hero.offsetHeight * 0.12) : 60;
    hdr.classList.toggle('is-solid', window.pageYOffset > limit);
  }

  /* Menu do celular */
  var btn = doc.getElementById('menuBtn');
  var menu = doc.getElementById('menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    doc.body.classList.toggle('menu-open', open);
    hdr.classList.toggle('menu-on', open);
  }
  if (btn && menu) {
    btn.addEventListener('click', function () {
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* Parallax do hero: só enquanto o hero está visível */
  var media = doc.getElementById('heroMedia');
  var word = doc.getElementById('heroWord');
  var heroVisible = true;
  var ticking = false;
  function parallax() {
    ticking = false;
    if (reduce || !heroVisible) return;
    var y = window.pageYOffset;
    if (media) media.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
    if (word) word.style.transform = 'translate3d(0,' + (y * -0.12).toFixed(1) + 'px,0)';
  }
  window.addEventListener('scroll', function () {
    setSolid();
    if (!ticking) { ticking = true; window.requestAnimationFrame(parallax); }
  }, { passive: true });
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
    }).observe(hero);
  }
  setSolid();

  /* Medição: todo clique de WhatsApp leva serviço e posição.
     O dataLayer fica pronto para o GTM, que ainda será informado pelo gestor. */
  window.dataLayer = window.dataLayer || [];
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-service]');
    if (!a) return;
    window.dataLayer.push({
      event: 'whatsapp_click',
      service: a.getAttribute('data-service'),
      location: a.getAttribute('data-location')
    });
  });

  /* Revelação na rolagem: cada .rv aparece uma vez; data-d escalona o atraso */
  var rvs = doc.querySelectorAll('.rv');
  var i;
  for (i = 0; i < rvs.length; i++) {
    var d = parseInt(rvs[i].getAttribute('data-d') || '0', 10);
    if (d) rvs[i].style.transitionDelay = (d * 90) + 'ms';
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('in');
          rio.unobserve(entries[j].target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    for (i = 0; i < rvs.length; i++) rio.observe(rvs[i]);
    root.classList.add('js');
    /* Reserva: se o observer atrasar, a rolagem e o load revelam o que já está na tela */
    var rvTick = false;
    var checkRv = function () {
      rvTick = false;
      var h = window.innerHeight;
      var left = doc.querySelectorAll('.rv:not(.in)');
      for (var p = 0; p < left.length; p++) {
        var b = left[p].getBoundingClientRect();
        if (b.top < h * 0.94 && b.bottom > 0) { left[p].classList.add('in'); rio.unobserve(left[p]); }
      }
    };
    window.addEventListener('scroll', function () {
      if (!rvTick) { rvTick = true; window.setTimeout(checkRv, 120); }
    }, { passive: true });
    window.addEventListener('load', checkRv);
  }

  /* FAQ: acordeão do design system. Abre uma resposta e fecha a anterior, com animação de altura.
     Sem JS tudo fica aberto; com JS só a primeira começa aberta. */
  function accSet(btn, open) {
    var a = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!a) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (a._t) clearTimeout(a._t);
    if (reduce) { a.style.display = open ? 'block' : 'none'; return; }
    if (open) {
      a.style.display = 'block';
      a.style.height = '0px'; a.style.opacity = '0'; a.style.transition = 'none';
      var hgt = a.scrollHeight;
      void a.offsetHeight;
      a.style.transition = 'height .5s cubic-bezier(.22,1,.36,1), opacity .4s cubic-bezier(.22,1,.36,1) .08s';
      a.style.height = hgt + 'px'; a.style.opacity = '1';
      a._t = setTimeout(function () { a.style.height = 'auto'; a.style.transition = ''; }, 560);
    } else {
      if (a.style.display === 'none') return;
      a.style.transition = 'none';
      a.style.height = a.scrollHeight + 'px'; a.style.opacity = '1';
      void a.offsetHeight;
      a.style.transition = 'height .42s cubic-bezier(.65,0,.35,1), opacity .28s cubic-bezier(.65,0,.35,1)';
      a.style.height = '0px'; a.style.opacity = '0';
      a._t = setTimeout(function () { a.style.display = 'none'; a.style.height = ''; a.style.opacity = ''; a.style.transition = ''; }, 460);
    }
  }
  var faqBtns = doc.querySelectorAll('.faq-q');
  for (var f = 0; f < faqBtns.length; f++) {
    if (f > 0) {
      faqBtns[f].setAttribute('aria-expanded', 'false');
      var ans = doc.getElementById(faqBtns[f].getAttribute('aria-controls'));
      if (ans) ans.style.display = 'none';
    }
    faqBtns[f].addEventListener('click', function () {
      var btn = this, open = btn.getAttribute('aria-expanded') !== 'true';
      var group = btn.closest('.faq-list').querySelectorAll('.faq-q');
      for (var g2 = 0; g2 < group.length; g2++) {
        if (group[g2] !== btn && group[g2].getAttribute('aria-expanded') === 'true') accSet(group[g2], false);
      }
      accSet(btn, open);
    });
  }

  /* Ano do rodapé */
  var ano = doc.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* Botão flutuante: acompanha o bloco no meio da tela. Some no hero e no CTA final.
     Usa posições na rolagem (com intervalo), sem depender de IntersectionObserver. */
  var fab = doc.getElementById('fab');
  if (fab) {
    var WA = 'https://wa.me/5562981680888?text=';
    var MSG = {
      impermeabilizacao: 'Ol%C3%A1!%20Vim%20pelo%20site%20da%20YAP%20e%20quero%20um%20or%C3%A7amento%20de%20impermeabiliza%C3%A7%C3%A3o.',
      silos: 'Ol%C3%A1!%20Vim%20pelo%20site%20da%20YAP%20e%20quero%20um%20or%C3%A7amento%20de%20impermeabiliza%C3%A7%C3%A3o%20de%20silos.'
    };
    var LABEL = {
      impermeabilizacao: 'Falar no WhatsApp sobre impermeabilização',
      silos: 'Falar no WhatsApp sobre impermeabilização de silos'
    };
    var heroEl = doc.getElementById('inicio'), ctaEl = doc.getElementById('contato');
    var secs = doc.querySelectorAll('main > section:not([hidden])');
    var current = '';
    var setFab = function () {
      fabTick = false;
      var h = window.innerHeight;
      var off = (heroEl && heroEl.getBoundingClientRect().bottom > h * 0.15) ||
                (ctaEl && ctaEl.getBoundingClientRect().top < h * 0.85);
      var svc = '';
      for (var m = 0; m < secs.length; m++) {
        var r = secs[m].getBoundingClientRect();
        if (r.top <= h / 2 && r.bottom >= h / 2) { svc = secs[m].id; break; }
      }
      fab.classList.toggle('is-off', !!off);
      fab.setAttribute('tabindex', off ? '-1' : '0');
      fab.setAttribute('aria-hidden', off ? 'true' : 'false');
      if (svc === current) return;
      current = svc;
      if (MSG[svc]) {
        fab.href = WA + MSG[svc];
        fab.target = '_blank'; fab.rel = 'noopener';
        fab.setAttribute('data-service', svc);
        fab.setAttribute('aria-label', LABEL[svc]);
      } else {
        fab.href = '#contato';
        fab.removeAttribute('target'); fab.removeAttribute('rel');
        fab.removeAttribute('data-service');
        fab.setAttribute('aria-label', 'Escolher o serviço e falar no WhatsApp');
      }
    };
    var fabTick = false;
    var queueFab = function () { if (!fabTick) { fabTick = true; window.setTimeout(setFab, 100); } };
    window.addEventListener('scroll', queueFab, { passive: true });
    window.addEventListener('resize', queueFab);
    window.addEventListener('load', setFab);
    setFab();
  }
})();
