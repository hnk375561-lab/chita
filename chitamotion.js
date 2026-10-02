/*! chita-motion · sistema de movimiento GSAP reutilizable (v1.0)
 *  Extraído y generalizado del sitio de Poerio Automotores. Sin build, sin CDN, sin jQuery.
 *  Requiere: gsap + ScrollTrigger. Opcionales: Flip (filtros), ScrollToPlugin (anclas con viaje).
 *
 *  FILOSOFÍA (no romper):
 *   · Un gesto por tipo de elemento → ritmo, no efectos sueltos. Curva expo.out para entradas; expo.inOut solo en máscaras.
 *   · Solo transform / opacity / clip-path (única excepción: altura del acordeón). Sin smooth-scroll ni scroll-jacking.
 *   · Máscaras: siempre inset() de 4 valores en % (GSAP no interpola "0" con "0%").
 *   · El contenido NUNCA queda oculto por CSS: si GSAP no carga o hay prefers-reduced-motion, todo se ve estático.
 *   · Todo se limpia (clearProps) y se revierte al cambiar de escritorio a móvil (gsap.matchMedia).
 *   · Modo liviano automático (poca RAM/CPU, saveData, o <40 fps medidos durante el scroll).
 *
 *  USO MÍNIMO:
 *    <link rel="stylesheet" href="motion/chita-motion.css">
 *    <script src="motion/vendor/gsap.min.js"></script><script src="motion/vendor/ScrollTrigger.min.js"></script>
 *    <script src="motion/chita-motion.js"></script>
 *    <h2 data-fx="words">Título por palabra</h2>
 *    <script>ChitaMotion.init()</script>
 *  Catálogo completo de efectos: docs/05-MOTION-SYSTEM.md y motion/demo/index.html
 */
(function (win) {
  'use strict';
  var doc = document, root = doc.documentElement;
  var g = win.gsap, ST = win.ScrollTrigger;
  var E = 'expo.out', EIO = 'expo.inOut';

  var CM = win.ChitaMotion = { version: '1.0.0', fx: {}, opts: {}, lite: false, reduce: false, ready: false };
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || doc).querySelectorAll(s)); };
  var num = function (v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; };
  var attr = function (el, n, d) { var v = el.getAttribute('data-' + n); return v == null || v === '' ? d : v; };

  /* ---------- Refresh coalescido: un solo ST.refresh() aunque se pida 10 veces ---------- */
  var rfT = 0;
  function refreshSoon(ms) { clearTimeout(rfT); rfT = setTimeout(function () { requestAnimationFrame(function () { ST.refresh(); }); }, ms == null ? 160 : ms); }
  CM.refresh = refreshSoon;

  /* ---------- Parche "lean": clearProps:'transform' de GSAP termina con getComputedStyle (fuerza recálculo de estilo
     por cada elemento que termina). Se reemplaza por removeProperty directo (solo escritura). Medido en Poerio: ~1,9 s de hilo principal menos. ---------- */
  function leanPatch() {
    if (g.__chitaLean) return; g.__chitaLean = 1;
    function lean(v) {
      if (!v || typeof v.clearProps !== 'string' || v.clearProps.indexOf('transform') < 0) return v;
      var keep = [], origin = false;
      v.clearProps.split(',').forEach(function (p) { p = p.trim(); if (p === 'transform') return; if (p === 'transformOrigin') { origin = true; return; } if (p) keep.push(p); });
      if (keep.length) v.clearProps = keep.join(','); else delete v.clearProps;
      var prev = v.onComplete;
      v.onComplete = function () {
        var T = this.targets ? this.targets() : [];
        for (var i = 0; i < T.length; i++) { var st = T[i] && T[i].style; if (!st) continue; st.removeProperty('transform'); st.removeProperty('translate'); st.removeProperty('rotate'); st.removeProperty('scale'); if (origin) st.removeProperty('transform-origin'); }
        if (prev) return prev.apply(this, arguments);
      };
      return v;
    }
    ['to', 'from', 'set'].forEach(function (n) { var f = g[n]; g[n] = function (t, v) { return f.call(g, t, lean(v)); }; });
    var ff = g.fromTo; g.fromTo = function (t, a, b) { return ff.call(g, t, a, lean(b)); };
    var TP = g.core && g.core.Timeline && g.core.Timeline.prototype;
    if (TP) {
      ['to', 'from', 'set'].forEach(function (n) { var f = TP[n]; if (f) TP[n] = function (t, v, pos) { return f.call(this, t, lean(v), pos); }; });
      var tf = TP.fromTo; if (tf) TP.fromTo = function (t, a, b, pos) { return tf.call(this, t, a, lean(b), pos); };
    }
  }

  /* ---------- Estado compartido de autoplay (WCAG 2.2.2): pausar uno pausa todos ---------- */
  var auto = { off: false, subs: [] };
  CM.autoplay = {
    pause: function () { auto.off = true; sync(); }, resume: function () { auto.off = false; sync(); },
    toggle: function () { auto.off = !auto.off; sync(); return !auto.off; }, get paused() { return auto.off; }
  };
  function sync() { auto.subs.slice().forEach(function (f) { f(); }); }

  /* ---------- Gobernador adaptativo: si durante el scroll se sostienen <40 fps, pasa a modo liviano ---------- */
  function governor() {
    var last = 0, y0 = win.scrollY, ds = [];
    function f() {
      var n = performance.now(), d = n - last; last = n;
      if (doc.hidden || !d || d > 250 || win.scrollY === y0) { y0 = win.scrollY; return; }
      y0 = win.scrollY; ds.push(d);
      if (ds.length < 120) return;
      g.ticker.remove(f); ds.sort(function (a, b) { return a - b; });
      if (ds[60] > 25) { CM.lite = true; root.classList.add('cm-lite'); }
    }
    win.addEventListener('load', function () { setTimeout(function () { last = performance.now(); g.ticker.add(f); }, 1500); });
  }

  /* ============================================================
     HELPERS DE SISTEMA (los usan los efectos; también son API pública)
     ============================================================ */
  /* Título/bajada por palabra. Respeta <em>/<strong>/<i>/<b>. Accesible: aria-label con el texto original. */
  CM.split = function (el, force) {
    if (!el || (el._cmS && !force)) return []; el._cmS = 1;
    var out = [];
    [].slice.call(el.childNodes).forEach(function (n) {
      var tag = n.nodeType === 1 && /^(EM|I|STRONG|B)$/.test(n.nodeName) ? n.nodeName.toLowerCase() : '', t = n.textContent.trim();
      if (!t) return;
      t.split(/\s+/).forEach(function (x) { out.push(tag ? '<' + tag + '>' + x + '</' + tag + '>' : x); });
    });
    if (!out.length) return [];
    el.setAttribute('aria-label', el.textContent.trim().split(/\s+/).join(' '));
    el.innerHTML = out.map(function (x) { return '<span class="wl" aria-hidden="true"><span>' + x + '</span></span>'; }).join(' ');
    return $$('.wl > span', el);
  };

  /* Cambio de escena direccional (slider): la entrante desliza, su foto contra-desliza, la saliente se corre apenas. Solo transform. */
  CM.swap = function (list, A, B, iA, iB, dir, o) {
    o = o || {}; var s = dir > 0 ? 1 : -1, du = (o.duration || .9) * (o.k || 1);
    list.forEach(function (x) { if (x !== A && x !== B) { x.classList.remove('cm-leave'); g.set(x, { clearProps: 'transform,zIndex' }); } });
    g.killTweensOf([A, B, iA, iB].filter(Boolean));
    if (o.parallax !== false && iB) g.set(iB, { clearProps: 'transform' });
    B.classList.add('cm-leave'); g.set(B, { zIndex: 1, xPercent: 0 }); g.set(A, { zIndex: 2 });
    g.fromTo(A, { xPercent: 100 * s }, { xPercent: 0, duration: du, ease: 'power3.inOut', clearProps: 'transform,zIndex',
      onComplete: function () { B.classList.remove('cm-leave'); g.set(B, { clearProps: 'zIndex,transform' }); if (iB) g.set(iB, { clearProps: 'transform' }); } });
    g.to(B, { xPercent: -16 * s, duration: du, ease: 'power3.inOut' });
    if (o.parallax !== false && iA && !CM.lite) g.fromTo(iA, { xPercent: -16 * s }, { xPercent: 0, duration: du, ease: 'power3.inOut', clearProps: 'transform' });
  };

  /* ============================================================
     EFECTOS DECLARATIVOS · se activan con data-fx="nombre [otro]"
     Firma: function (el, X) con X = { D, k, dy, lite, ctx, on(el,type,fn), clean(fn) }
     ============================================================ */
  var FX = CM.fx;

  /* words · título por palabra con sesgo. data-start="top 85%" */
  FX.words = function (el, X) {
    var W = CM.split(el); if (!W.length) return;
    g.from(W, { yPercent: 118, skewY: X.lite ? 0 : 7, transformOrigin: '0% 100%', duration: 1.15 * X.k, stagger: Math.min(.055, (X.D ? .9 : .5) / W.length), ease: E, clearProps: 'transform',
      scrollTrigger: { trigger: el, start: attr(el, 'start', 'top 85%'), once: true },
      onComplete: function () { W.forEach(function (w) { w.parentNode.style.overflow = 'visible'; }); } });
  };

  /* reveal · subida corta con fundido. data-y, data-delay, data-stagger, data-children=".sel", data-start */
  FX.reveal = function (el, X) {
    var sel = attr(el, 'children', ''), t = sel ? $$(sel, el) : [el]; if (!t.length) return;
    g.from(t, { opacity: 0, y: num(attr(el, 'y'), X.dy), duration: .9 * X.k, stagger: num(attr(el, 'stagger'), .08), delay: num(attr(el, 'delay'), 0), ease: E, clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: attr(el, 'start', 'top 85%'), once: true } });
  };

  /* photo · foto editorial: máscara clip-path + asentado de escala 1.1→1. data-dir="up|down|left|right", data-still (sin escala) */
  var MASK = { up: 'inset(100% 0% 0% 0%)', down: 'inset(0% 0% 100% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' };
  FX.photo = function (el, X) {
    var im = $('img, video, .cm-media', el), st = { trigger: el, start: attr(el, 'start', 'top 85%'), once: true }, d = num(attr(el, 'delay'), 0);
    if (im) g.set(im, { transition: 'none' });
    g.fromTo(el, { clipPath: MASK[attr(el, 'dir', 'up')] || MASK.up }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 * X.k, delay: d, ease: EIO, clearProps: 'clipPath', scrollTrigger: st });
    if (im && !X.lite && el.getAttribute('data-still') == null) g.fromTo(im, { scale: 1.1 }, { scale: 1, duration: 1.5, delay: d, ease: 'power3.out', clearProps: 'transform,transition', scrollTrigger: st });
  };

  /* count · contador animado. data-to="1500" data-prefix="+" data-suffix=" km" data-locale (separador es-AR) data-duration */
  FX.count = function (el) {
    var to = num(attr(el, 'to'), parseFloat(el.textContent.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0), pre = attr(el, 'prefix', ''), suf = attr(el, 'suffix', ''), loc = el.getAttribute('data-locale') != null, P = { v: 0 };
    var fmt = function (v) { var n = Math.round(v); return pre + (loc ? n.toLocaleString('es-AR') : n) + suf; };
    el.setAttribute('aria-label', fmt(to)); el.textContent = fmt(0);
    g.to(P, { v: to, duration: num(attr(el, 'duration'), 1.6), ease: 'power3.out', onUpdate: function () { el.textContent = fmt(P.v); }, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  };

  /* reading · el párrafo se "ilumina" palabra por palabra con el scroll */
  FX.reading = function (el, X) {
    var W = CM.split(el); if (!W.length) return;
    $$('.wl', el).forEach(function (w) { w.style.overflow = 'visible'; });
    g.fromTo(W, { opacity: .16 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: el, start: attr(el, 'start', 'top 80%'), end: attr(el, 'end', 'bottom 45%'), scrub: true } });
  };

  /* scramble · texto que se descifra al entrar. data-chars, data-duration */
  FX.scramble = function (el) {
    var txt = el.textContent, chars = attr(el, 'chars', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), P = { p: 0 };
    el.setAttribute('aria-label', txt);
    g.to(P, { p: 1, duration: num(attr(el, 'duration'), 1.1), ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { var n = Math.floor(P.p * txt.length), s = ''; for (var i = 0; i < txt.length; i++) s += i < n || /\s/.test(txt[i]) ? txt[i] : chars[Math.floor(Math.random() * chars.length)]; el.textContent = s; },
      onComplete: function () { el.textContent = txt; } });
    el.textContent = txt.replace(/\S/g, ' ');
  };

  /* parallax · data-speed="8" (% de desplazamiento). Se apaga en modo liviano. Poner sobre la imagen; el padre recorta con overflow:hidden */
  FX.parallax = function (el, X) {
    if (X.lite) return; var s = num(attr(el, 'speed'), 8);
    g.fromTo(el, { yPercent: -s, scale: 1 + s / 50 }, { yPercent: s, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  /* line · línea fina que se dibuja con el scroll (separador de capítulo) */
  FX.line = function (el) {
    g.fromTo(el, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 52%', scrub: true } });
  };

  /* progress · barra de lectura de toda la página (elemento fijo con transform-origin:left) */
  FX.progress = function (el) {
    g.set(el, { scaleX: 0, transformOrigin: '0 50%' });
    g.to(el, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  };

  /* batch · grilla que entra por tandas. Hijos: data-children=".card" */
  FX.batch = function (el, X) {
    var items = $$(attr(el, 'children', ':scope > *'), el); if (!items.length) return;
    g.set(items, { opacity: 0, y: X.dy });
    ST.batch(items, { start: 'top 90%', once: true, batchMax: 3, interval: .08, onEnter: function (b) { g.to(b, { opacity: 1, y: 0, duration: .9 * X.k, stagger: .09, ease: E, clearProps: 'opacity,transform' }); } });
  };

  /* magnetic · atracción hacia el cursor (solo mouse). data-strength="0.3" */
  FX.magnetic = function (el, X) {
    if (!X.fine) return; var s = num(attr(el, 'strength'), .3), qx = g.quickTo(el, 'x', { duration: .6, ease: 'power3' }), qy = g.quickTo(el, 'y', { duration: .6, ease: 'power3' });
    X.on(el, 'pointermove', function (e) { var r = el.getBoundingClientRect(); qx((e.clientX - (r.left + r.width / 2)) * s); qy((e.clientY - (r.top + r.height / 2)) * s); });
    X.on(el, 'pointerleave', function () { qx(0); qy(0); });
  };

  /* tilt · inclinación 3D (solo mouse). data-max="8" grados */
  FX.tilt = function (el, X) {
    if (!X.fine || X.lite) return; var m = num(attr(el, 'max'), 8);
    g.set(el, { transformPerspective: 900 });
    var rx = g.quickTo(el, 'rotationX', { duration: .5, ease: 'power3' }), ry = g.quickTo(el, 'rotationY', { duration: .5, ease: 'power3' });
    X.on(el, 'pointermove', function (e) { var r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 2 * m); rx(-((e.clientY - r.top) / r.height - .5) * 2 * m); });
    X.on(el, 'pointerleave', function () { rx(0); ry(0); });
  };

  /* marquee · cinta infinita que acelera con la velocidad del scroll. Estructura: <div data-fx="marquee" data-speed="60"><div class="cm-track">…ítems…</div></div> */
  FX.marquee = function (el, X) {
    var tr = $('.cm-track', el) || el.firstElementChild; if (!tr) return;
    var base = tr.innerHTML; tr.insertAdjacentHTML('beforeend', base.replace(/<(\w+)/g, '<$1 aria-hidden="true"'));
    var half = tr.scrollWidth / 2, sp = num(attr(el, 'speed'), 60), dir = attr(el, 'dir', 'left') === 'right' ? 1 : -1;
    g.set(tr, { x: dir < 0 ? 0 : -half });
    var tw = g.to(tr, { x: dir < 0 ? -half : 0, duration: half / sp, ease: 'none', repeat: -1 });
    if (!X.lite) ST.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: function (s) { var v = Math.abs(s.getVelocity()); g.to(tw, { timeScale: 1 + Math.min(v / 350, 5), duration: .2, overwrite: true, onComplete: function () { g.to(tw, { timeScale: 1, duration: 1.2 }); } }); } });
    var vis = true; ST.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: function (s) { vis = s.isActive; vis ? tw.play() : tw.pause(); } });
  };

  /* hscroll · galería horizontal fijada (solo escritorio; en móvil queda con scroll nativo por CSS).
     <section data-fx="hscroll"><div class="cm-h-track"><article>…</article>…</div></section> */
  FX.hscroll = function (el, X) {
    if (!X.D) return; var tr = $('.cm-h-track', el); if (!tr) return;
    var dist = function () { return Math.max(0, tr.scrollWidth - el.clientWidth); };
    g.to(tr, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true } });
  };

  /* scrub-video · el video avanza con el scroll (exportar con keyframes frecuentes: ffmpeg -g 1). Solo escritorio.
     <section data-fx="scrub-video" data-length="300%"><video muted playsinline preload="auto" src="…"></video></section> */
  FX.scrubVideo = FX['scrub-video'] = function (el, X) {
    var v = $('video', el); if (!v || !X.D || X.lite) return;
    var P = { t: 0 }, setup = function () {
      var d = v.duration || 0; if (!d) return;
      g.to(P, { t: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: '+=' + attr(el, 'length', '300%'), pin: true, scrub: .4 }, onUpdate: function () { v.currentTime = P.t * d; } });
      refreshSoon(50);
    };
    v.pause(); if (v.readyState >= 1) setup(); else v.addEventListener('loadedmetadata', setup, { once: true });
  };

  /* cursor · seguidor del puntero (solo mouse). <div data-fx="cursor"><span></span></div> + [data-cursor="Ver"] en elementos */
  FX.cursor = function (el, X) {
    if (!X.fine) { el.style.display = 'none'; return; }
    var lab = $('span', el), qx = g.quickTo(el, 'x', { duration: .35, ease: 'power3' }), qy = g.quickTo(el, 'y', { duration: .35, ease: 'power3' }), shown = false;
    g.set(el, { xPercent: -50, yPercent: -50, scale: .4, opacity: 0 });
    X.on(doc, 'pointermove', function (e) { qx(e.clientX); qy(e.clientY); if (!shown) { shown = true; g.to(el, { opacity: 1, scale: 1, duration: .4, ease: E }); } });
    X.on(doc, 'pointerover', function (e) { var t = e.target.closest && e.target.closest('[data-cursor]'); if (t) { if (lab) lab.textContent = t.getAttribute('data-cursor'); g.to(el, { scale: lab && lab.textContent ? 3 : 1.8, duration: .35, ease: E }); } else { if (lab) lab.textContent = ''; g.to(el, { scale: 1, duration: .35, ease: E }); } });
    X.on(doc, 'pointerleave', function () { shown = false; g.to(el, { opacity: 0, scale: .4, duration: .3 }); });
  };

  /* accordion · <details> con altura animada (teclado y lector de pantalla intactos). Poner en el contenedor */
  FX.accordion = function (el, X) {
    $$('details', el).forEach(function (d) {
      var sm = $('summary', d), body = $$(':scope > :not(summary)', d);
      X.on(sm, 'click', function (e) {
        e.preventDefault(); g.killTweensOf(d);
        var opening = !d.open, h0 = d.offsetHeight, bw = d.offsetHeight - d.clientHeight, hc = sm.offsetHeight + bw;
        if (opening) {
          d.open = true; var h1 = d.offsetHeight;
          g.fromTo(d, { height: h0 }, { height: h1, duration: .75 * X.k, ease: E, clearProps: 'height', onComplete: function () { refreshSoon(80); } });
          g.fromTo(body, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: .6, delay: .08, ease: E, clearProps: 'opacity,transform', overwrite: 'auto' });
        } else {
          g.to(d, { height: hc, duration: .55 * X.k, ease: E, onComplete: function () { d.open = false; g.set(d, { clearProps: 'height' }); refreshSoon(80); } });
          g.to(body, { opacity: 0, duration: .25, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    });
  };

  /* nav · indicador deslizante bajo el link de la sección visible + sombra del header. <nav data-fx="nav"><a href="#sec">… */
  FX.nav = function (nav, X) {
    var links = $$('a[href^="#"]', nav), ind = doc.createElement('i'), shown = false, cur = null;
    ind.className = 'cm-ind'; ind.setAttribute('aria-hidden', 'true'); nav.appendChild(ind);
    function place(a, snap) {
      g.killTweensOf(ind);
      if (!a) { shown = false; g.to(ind, { opacity: 0, duration: .3 }); return; }
      var to = { x: a.offsetLeft, scaleX: a.offsetWidth / 100 };
      if (!shown || snap) { g.set(ind, { opacity: 1, x: to.x, scaleX: to.scaleX }); shown = true; } else g.to(ind, { x: to.x, scaleX: to.scaleX, opacity: 1, duration: .7, ease: E });
    }
    function active(a) { cur = a; links.forEach(function (l) { l === a ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current'); }); place(a); }
    links.forEach(function (a) { var sec = $(a.getAttribute('href')); if (!sec) return; ST.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: function (s) { if (s.isActive) active(a); else if (cur === a) active(null); } }); });
    var onRef = function () { if (cur) place(cur, true); }; ST.addEventListener('refresh', onRef); X.clean(function () { ST.removeEventListener('refresh', onRef); if (ind.parentNode) ind.parentNode.removeChild(ind); });
    var hd = nav.closest('header'); if (hd) ST.create({ start: 8, end: 'max', toggleClass: { targets: hd, className: 'cm-scrolled' } });
  };

  /* hero · entrada cinematográfica (una vez) + salida en capas con el scroll.
     Marcar: data-hero="photo" (figura), "logo", "kicker", "title" (h1), "sub", "cta" (uno o varios). Capas de salida: data-depth="-24" (px) */
  FX.hero = function (el, X) {
    if (el._cmH) return; el._cmH = 1;
    var q = function (n) { return $$('[data-hero="' + n + '"]', el); }, photo = q('photo')[0], title = q('title')[0], T = g.timeline({ defaults: { ease: E }, paused: true });
    var mask = function (els, from, to, at, du) { if (els.length) T.fromTo(els, { clipPath: from }, { clipPath: to || 'inset(0% 0% 0% 0%)', duration: (du || .9) * X.k, stagger: .1, ease: EIO, clearProps: 'clipPath' }, at); };
    if (photo) { var im = $('img', photo); T.fromTo(photo, { opacity: 0 }, { opacity: 1, duration: .8 * X.k, ease: 'power2.out', clearProps: 'opacity' }, 0); if (im && !X.lite) T.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power3.out', clearProps: 'transform' }, 0); }
    mask(q('logo'), 'inset(0% 100% 0% 0%)', 0, .12); mask(q('kicker'), 'inset(0% 100% 0% 0%)', 0, .3);
    if (title) { var W = CM.split(title); if (W.length) T.from(W, { yPercent: 118, skewY: 8, transformOrigin: '0% 100%', duration: 1.15 * X.k, stagger: .075, clearProps: 'transform', onComplete: function () { W.forEach(function (w) { w.parentNode.style.overflow = 'visible'; }); } }, .38); }
    mask(q('sub'), 'inset(0% 0% 100% 0%)', 0, .85); mask(q('cta'), 'inset(0% 100% 0% 0%)', 'inset(-6% -6% -6% -6%)', 1, .85);
    var go0 = false, go = function () { if (go0) return; go0 = true; T.play(0); }; setTimeout(go, 600);
    Promise.all([doc.fonts && doc.fonts.ready ? doc.fonts.ready.catch(function () {}) : 0]).then(function () { requestAnimationFrame(go); });
    if (X.D) { var tl = g.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } }), any = false;
      $$('[data-depth]', el).forEach(function (d) { tl.to(d, { y: num(d.getAttribute('data-depth'), -20) }, 0); any = true; });
      if (photo && !X.lite) { tl.to(photo, { scale: 1.08, yPercent: 4, opacity: .55 }, 0); any = true; } }
  };

  /* flip-filter · filtra una grilla con Flip. <div data-fx="flip-filter" data-bar="#chips"> hijos con data-cat="a b"; botones [data-filter="a"] ("*" = todos) */
  FX['flip-filter'] = function (grid, X) {
    if (!win.Flip) return; var bar = $(attr(grid, 'bar', '')) || grid.previousElementSibling; if (!bar) return;
    var items = $$(':scope > [data-cat]', grid), btns = $$('[data-filter]', bar);
    X.on(bar, 'click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return; var f = b.getAttribute('data-filter');
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var st = win.Flip.getState(items);
      items.forEach(function (it) { var ok = f === '*' || it.getAttribute('data-cat').split(/\s+/).indexOf(f) > -1; it.style.display = ok ? '' : 'none'; it.hidden = !ok; });
      win.Flip.from(st, { duration: .9 * X.k, ease: E, stagger: .04, absolute: true, onEnter: function (els) { return g.fromTo(els, { opacity: 0, scale: .96, y: X.dy }, { opacity: 1, scale: 1, y: 0, duration: .8 * X.k, ease: E, clearProps: 'opacity,transform' }); }, onLeave: function (els) { return g.to(els, { opacity: 0, scale: .95, duration: .3, ease: 'power2.in' }); } });
      refreshSoon(300);
    });
  };

  /* slider · rotador direccional con autoplay pausable, swipe, flechas, segmentos de progreso.
     <div data-fx="slider" data-interval="5"><div class="cm-slides"><div class="cm-slide">…</div>…</div>
       <button data-cm-prev>…</button><button data-cm-next>…</button><div class="cm-dots"></div></div>
     API: ChitaMotion.slider(el,{interval}) → {go,next,prev,i,n}. Evento: el.dispatchEvent('cm:slide',{detail:{from,to,dir}}) */
  CM.slider = function (el, o) {
    o = o || {}; var slides = $$('.cm-slide', el); if (slides.length < 2 || el._cmSl) return el._cmSl; var X = o.X || { k: 1, fine: true, on: function (t, ty, f) { t.addEventListener(ty, f); }, clean: function () {} };
    var i = 0, held = 0, inView = true, call = null, iv = num(o.interval != null ? o.interval : attr(el, 'interval', 5), 5), dots = $('.cm-dots', el), bars = [];
    slides[0].classList.add('cm-on'); slides.forEach(function (s, q) { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'slide'); s.setAttribute('aria-label', (q + 1) + ' de ' + slides.length); });
    if (dots) { dots.innerHTML = slides.map(function (_, q) { return '<button type="button" aria-label="Ir a la diapositiva ' + (q + 1) + '"' + (q ? '' : ' class="cm-on"') + '><i></i></button>'; }).join(''); bars = $$('button', dots); }
    function arm() { if (call) call.kill(); if (!iv) return; bars.forEach(function (b, q) { g.set($('i', b), { scaleX: q < i ? 1 : 0 }); }); call = bars.length ? g.to($('i', bars[i]), { scaleX: 1, duration: iv, ease: 'none', onComplete: function () { api.next(); } }) : g.delayedCall(iv, function () { api.next(); }); update(); }
    function update() { if (!call) return; (!auto.off && !held && inView && !doc.hidden) ? call.play() : call.pause(); }
    var api = el._cmSl = { get i() { return i; }, n: slides.length,
      go: function (n, dir) { n = (n + slides.length) % slides.length; if (n === i) return; var f = i; i = n; dir = dir || (n > f ? 1 : -1);
        slides[f].classList.remove('cm-on'); slides[n].classList.add('cm-on'); bars.forEach(function (b, q) { b.classList.toggle('cm-on', q === n); });
        CM.swap(slides, slides[n], slides[f], $('img, .cm-media', slides[n]), $('img, .cm-media', slides[f]), dir, { k: X.k });
        var h = $('[data-split]', slides[n]); if (h) { var W = CM.split(h, true); g.fromTo(W, { yPercent: 118, skewY: 6, transformOrigin: '0% 100%' }, { yPercent: 0, skewY: 0, duration: .7 * X.k, stagger: .045, delay: .12, ease: E, clearProps: 'transform' }); }
        el.dispatchEvent(new CustomEvent('cm:slide', { detail: { from: f, to: n, dir: dir } })); arm(); },
      next: function () { api.go(i + 1, 1); }, prev: function () { api.go(i - 1, -1); } };
    $$('[data-cm-next]', el).forEach(function (b) { X.on(b, 'click', function () { api.go(i + 1, 1); }); });
    $$('[data-cm-prev]', el).forEach(function (b) { X.on(b, 'click', function () { api.go(i - 1, -1); }); });
    bars.forEach(function (b, q) { X.on(b, 'click', function () { api.go(q); }); });
    X.on(el, 'keydown', function (e) { if (e.key === 'ArrowRight') api.go(i + 1, 1); else if (e.key === 'ArrowLeft') api.go(i - 1, -1); });
    if (X.fine) { X.on(el, 'pointerenter', function () { held |= 1; update(); }); X.on(el, 'pointerleave', function () { held &= ~1; update(); }); }
    X.on(el, 'focusin', function () { held |= 2; update(); }); X.on(el, 'focusout', function () { held &= ~2; update(); });
    var x0 = 0, y0 = 0; X.on(el, 'pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
    X.on(el, 'pointerup', function (e) { if (e.target.closest('button,a')) return; var dx = e.clientX - x0, dy = e.clientY - y0; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { var s = dx < 0 ? 1 : -1; api.go(i + s, s); } });
    ST.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: function (s) { inView = s.isActive; update(); } });
    X.on(doc, 'visibilitychange', update); auto.subs.push(update); X.clean(function () { if (call) call.kill(); var q = auto.subs.indexOf(update); if (q > -1) auto.subs.splice(q, 1); el._cmSl = null; });
    arm(); return api;
  };
  FX.slider = function (el, X) { CM.slider(el, { X: X }); };

  /* dialog · <dialog> que se abre desde el elemento tocado y se cierra al revés. Disparador: [data-dialog-open="#id"] ; cierre: [data-dialog-close] / Esc / clic en el fondo */
  FX.dialog = function (dlg, X) {
    var ox = 0, oy = 0, closing = null, native = HTMLDialogElement.prototype.close;
    function origin(t) { if (t && t.getBoundingClientRect) { var r = t.getBoundingClientRect(); ox = r.left + r.width / 2 - innerWidth / 2; oy = r.top + r.height / 2 - innerHeight / 2; } else { ox = oy = 0; } }
    function openAnim() { var w = dlg.offsetWidth, h = dlg.offsetHeight; g.fromTo(dlg, { opacity: 0, scale: X.D ? .92 : .97, x: ox * .08, y: oy * .08 + 18, transformOrigin: (w / 2 + ox) + 'px ' + (h / 2 + oy) + 'px' }, { opacity: 1, scale: 1, x: 0, y: 0, duration: .75, ease: E, clearProps: 'opacity,transform,transformOrigin' });
      var t = $$('[data-dlg-item]', dlg); if (t.length) g.from(t, { opacity: 0, y: 12, duration: .6, stagger: .05, delay: .25, ease: E, clearProps: 'opacity,transform' }); }
    function reset() { if (closing) { closing.kill(); closing = null; } g.set(dlg, { clearProps: 'opacity,transform,transformOrigin,pointerEvents' }); }
    function animClose() { if (!dlg.open || closing) return; var w = dlg.offsetWidth, h = dlg.offsetHeight;
      g.set(dlg, { pointerEvents: 'none' });
      closing = g.to(dlg, { opacity: 0, scale: X.D ? .94 : .985, x: ox * .08, y: X.D ? oy * .08 + 14 : 26, transformOrigin: (w / 2 + ox) + 'px ' + (h / 2 + oy) + 'px', duration: .4, ease: 'power2.in', onComplete: function () { closing = null; native.call(dlg); reset(); } }); }
    dlg._cmOpen = function (from) { origin(from); if (!dlg.open) { dlg.showModal(); openAnim(); } };
    dlg.close = animClose;
    X.on(dlg, 'cancel', function (e) { if (closing) return; e.preventDefault(); animClose(); });
    X.on(dlg, 'click', function (e) { if (e.target === dlg || e.target.closest('[data-dialog-close]')) animClose(); });
    X.on(doc, 'click', function (e) { var b = e.target.closest && e.target.closest('[data-dialog-open="#' + dlg.id + '"]'); if (b) { e.preventDefault(); dlg._cmOpen(b); } });
    X.clean(function () { delete dlg.close; reset(); });
  };

  /* ============================================================
     INIT
     ============================================================ */
  CM.init = function (opts) {
    opts = CM.opts = opts || {};
    if (!g || !ST) { root.classList.remove('m'); return CM; }
    if (CM.ready) return CM; CM.ready = true;
    g.registerPlugin(ST); if (win.Flip) g.registerPlugin(win.Flip); if (win.ScrollToPlugin) g.registerPlugin(win.ScrollToPlugin);
    g.config({ nullTargetWarn: false }); ST.config({ ignoreMobileResize: true, limitCallbacks: true });
    CM.reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    CM.lite = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2 || !!(navigator.connection && navigator.connection.saveData);
    if (CM.lite) root.classList.add('cm-lite');
    if (CM.reduce) { root.classList.add('cm-reduce'); return CM; }          /* sin animaciones: todo visible y estático */
    root.classList.add('cm');
    if (win.ScrollToPlugin) root.classList.add('cm-sx');                     /* apaga scroll-behavior:smooth nativo: GSAP conduce el scroll */
    leanPatch(); g.ticker.lagSmoothing(1000, 16); governor();
    $$('img[loading=lazy]').forEach(function (im) { if (!im.hasAttribute('decoding')) im.decoding = 'async'; });
    win.addEventListener('load', function () { refreshSoon(120); }); if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { refreshSoon(120); });

    /* Anclas con viaje expo.inOut; la rueda o el toque lo interrumpen (no hay secuestro de scroll) */
    if (win.ScrollToPlugin && opts.anchors !== false) doc.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return; e.preventDefault();
      var hd = $(opts.header || 'header'), off = innerWidth >= 900 && hd ? hd.offsetHeight : 0, dist = Math.abs(t.getBoundingClientRect().top - off);
      g.to(win, { scrollTo: { y: t, offsetY: off, autoKill: true }, duration: Math.min(1.7, Math.max(.8, dist / 2400)), ease: EIO, overwrite: true, onComplete: function () { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } });
      if (history.replaceState) history.replaceState(null, '', id);
    });

    /* Botón de pausa global del movimiento automático: <button data-cm-autoplay aria-pressed="false"> */
    $$('[data-cm-autoplay]').forEach(function (b) { b.addEventListener('click', function () { var on = CM.autoplay.toggle(); b.setAttribute('aria-pressed', on ? 'false' : 'true'); }); });

    /* Presión táctil global (todos los dispositivos): [data-fx~=press] y .btn */
    var pressed = null;
    doc.addEventListener('pointerdown', function (e) { var b = e.target.closest && e.target.closest('[data-fx~="press"], .btn'); if (!b || b.disabled) return; pressed = b; g.to(b, { scale: .955, duration: .18, ease: 'power2.out', overwrite: 'auto' }); }, true);
    function rel() { if (!pressed) return; var b = pressed; pressed = null; g.to(b, { scale: 1, duration: .6, ease: 'elastic.out(1,.55)', clearProps: 'scale' }); }
    doc.addEventListener('pointerup', rel, true); doc.addEventListener('pointercancel', rel, true); doc.addEventListener('dragend', rel, true);

    g.matchMedia().add({ d: '(min-width:900px)', m: '(max-width:899px)' }, function (ctx) {
      var D = ctx.conditions.d, cleanups = [];
      var X = { D: D, k: D ? 1 : .8, dy: D ? 32 : 18, lite: CM.lite, ctx: ctx, fine: matchMedia('(hover:hover) and (pointer:fine)').matches,
        on: function (el, type, fn, cap) { el.addEventListener(type, fn, cap); cleanups.push(function () { el.removeEventListener(type, fn, cap); }); },
        clean: function (fn) { cleanups.push(fn); } };
      $$('[data-fx]').forEach(function (el) {
        attr(el, 'fx', '').split(/\s+/).forEach(function (name) {
          if (!name || name === 'press') return; var f = FX[name];
          if (!f) { if (opts.debug) console.warn('[chita-motion] efecto desconocido:', name); return; }
          try { f(el, X); } catch (err) { console.error('[chita-motion] falló "' + name + '"', err); }
        });
      });
      return function () { cleanups.forEach(function (f) { f(); }); };
    });
    return CM;
  };
})(window);
