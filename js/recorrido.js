/* Video del equipo (#equipo) y entrada de las fotos de secciones pendientes. Sin dependencias.

   Reparto de tareas (no se pisan):
   · recorrido.js  → estado, tiempos, reproducción de video, gestos y teclado. Solo alterna clases y atributos.
   · motion.js     → toda la coreografía visual (deslizamiento de escenas, máscara, texto por palabra, número). Se entera de cada
                     cambio por el evento poerio:local ({from, to, dir}), igual que antes.

   Principios de esta versión:
   · Un único reloj por paso, con pausa y reanudación reales: salir de la sección, cambiar de pestaña o tocar el escenario
     congela el paso (y su barra de progreso) donde estaba y lo retoma sin reiniciarlo.
   · Cero trabajo por fotograma: ni rAF ni polling. Un setTimeout por paso; las barras corren en el compositor (CSS).
   · Un solo punto de entrada para el entorno (visibilidad de pestaña, bfcache, prefers-reduced-motion en vivo).
   · Todos los listeners y observadores quedan registrados y se liberan al descargar la página. */
(function () {
  'use strict';
  var d = document, R = d.documentElement;
  R.classList.add('rj');

  var mq = matchMedia('(prefers-reduced-motion: reduce)'), rm = mq.matches;
  var hasIO = 'IntersectionObserver' in window;
  var gone = false;                                                      /* la página se está yendo (bfcache / cierre) */

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || d).querySelectorAll(s)); }
  function away() { return d.hidden || gone; }
  /* play() sin ruido: si el navegador lo bloquea (autoplay) se avisa a quien lo pidió */
  function play(v, onBlock) {
    var p = v.play();
    if (p && p.catch) p.catch(function (e) { if (onBlock && e && e.name === 'NotAllowedError') onBlock(); });
  }

  /* ---------- Registro de recursos (se liberan juntos) ---------- */
  var disposers = [], subs = [];
  function listen(t, type, fn, opt) { t.addEventListener(type, fn, opt); disposers.push(function () { t.removeEventListener(type, fn, opt); }); }
  function watch(el, cb, opt) {
    var o = new IntersectionObserver(cb, opt); o.observe(el);
    disposers.push(function () { o.disconnect(); });
    return o;
  }

  /* ---------- Entorno: un solo juego de listeners para todo el archivo ---------- */
  function env() { subs.forEach(function (f) { f(); }); }
  listen(d, 'visibilitychange', env);
  listen(window, 'pagehide', function (e) {
    gone = true; env();
    if (!e.persisted) { disposers.forEach(function (f) { f(); }); disposers.length = subs.length = 0; }
  });
  listen(window, 'pageshow', function () { if (gone) { gone = false; env(); } });
  var onMq = function () { rm = mq.matches; env(); };
  if (mq.addEventListener) { mq.addEventListener('change', onMq); disposers.push(function () { mq.removeEventListener('change', onMq); }); }
  else if (mq.addListener) { mq.addListener(onMq); disposers.push(function () { mq.removeListener(onMq); }); }

  /* ================= Fotos de secciones pendientes: entran una sola vez ================= */
  (function () {
    var figs = $$('.pp .ppf');
    if (!figs.length) return;
    function all() { figs.forEach(function (f) { f.classList.add('in'); }); }
    if (rm || !hasIO) { all(); return; }
    var left = figs.length;
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); fo.unobserve(e.target);
        if (--left === 0) fo.disconnect();
      });
    }, { threshold: .18 });
    figs.forEach(function (f) { fo.observe(f); });
    disposers.push(function () { fo.disconnect(); });
    subs.push(function () { if (rm) { all(); fo.disconnect(); } });
  })();

  /* ================= Video del equipo: en bucle mientras está a la vista; el botón lo pausa ================= */
  (function () {
    var r = $('#eqv'), pb = $('.eqvb');
    if (!r) return;
    var rv = false, held = rm, blocked = false;   /* held: pausa elegida · blocked: el navegador no dejó arrancar solo */

    function ui() {
      if (!pb) return;
      var p = held || blocked;
      pb.classList.toggle('is-paused', p);
      pb.setAttribute('aria-pressed', p ? 'true' : 'false');
      pb.setAttribute('aria-label', p ? 'Reproducir video' : 'Pausar video');
    }
    function blockedNow() { blocked = true; ui(); }
    function apply() { if (rv && !held && !away()) play(r, blockedNow); else r.pause(); }

    ui();
    listen(r, 'playing', function () { if (blocked) { blocked = false; ui(); } });
    if (pb) listen(pb, 'click', function () {
      if (blocked) { held = false; blocked = false; ui(); play(r); return; }   /* el toque es el gesto que faltaba */
      held = !held; ui(); apply();
    });
    if (hasIO) watch(r, function (es) { rv = es[es.length - 1].isIntersecting; apply(); }, { threshold: .4 });
    subs.push(function () { if (rm && !held) { held = true; ui(); } apply(); });
  })();
})();
