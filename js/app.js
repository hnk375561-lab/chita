/* CHITA AUTOMOTORES · escenas y datos
   Estructura: 1) datos y utilidades  2) contacto  3) render del inventario
   4) navegación viva  5) movimiento (GSAP matchMedia)  6) arranque */
(function () {
  'use strict';

  var D = window.CHITA, N = D.negocio, INV = D.inventario;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)');
  var BASE = 'https://hnk375561-lab.github.io/chita/';
  var BIG = 3600; // px: el corte supera cualquier viewport

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ---------- 1. utilidades ---------- */
  var fmtKm = function (n) { return n.toLocaleString('es-AR'); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wa = function (msg) { return 'https://wa.me/' + N.celular.wa + '?text=' + encodeURIComponent(msg); };
  var MSG_GEN = 'Hola, quiero hacer una consulta.';
  var nombre = function (u) { return u.marca + ' ' + u.modelo + ' ' + u.version + ' ' + u.anio; };
  var msgUnidad = function (u) { return 'Hola, quiero consultar por el ' + nombre(u) + '.'; };
  var img = function (n, w) { return 'assets/img/' + n + '-' + w + '.webp'; };
  var srcset = function (n) { return img(n, 540) + ' 540w, ' + img(n, 1080) + ' 1080w'; };

  /* ---------- 2. contacto: un dato, un lugar ---------- */
  function bindContacto() {
    var text = {
      calle: N.calle, esquina: N.esquina, ciudad: N.ciudad, provincia: N.provincia,
      igUser: N.instagram.usuario, fbUser: N.facebook.usuario,
      celVis: N.celular.visible, telVis: N.telFijo.visible
    };
    var href = {
      ig: N.instagram.url, fb: N.facebook.url, ruta: N.mapsRuta, lugar: N.mapsLugar,
      tel: 'tel:' + N.telFijo.e164, cel: wa(MSG_GEN)
    };
    $$('[data-bind]').forEach(function (el) { el.textContent = text[el.dataset.bind]; });
    $$('[data-bind-href]').forEach(function (el) { el.href = href[el.dataset.bindHref]; });
    $('#waBig').href = wa(MSG_GEN);
    $('#countU').textContent = INV.length;
  }

  /* ---------- 3. render del inventario ---------- */
  var filtro = 'todas';
  var lista = function () { return filtro === 'todas' ? INV : INV.filter(function (u) { return u.marca === filtro; }); };

  function renderFiltros() {
    var marcas = INV.map(function (u) { return u.marca; }).filter(function (m, i, a) { return a.indexOf(m) === i; });
    var opts = [{ k: 'todas', t: 'Todas', n: INV.length }].concat(marcas.map(function (m) {
      return { k: m, t: m, n: INV.filter(function (u) { return u.marca === m; }).length };
    }));
    $('#filtros').innerHTML = opts.map(function (o) {
      return '<button type="button" data-f="' + esc(o.k) + '" aria-pressed="' + (o.k === filtro) + '">' + esc(o.t) + '<sup>' + o.n + '</sup></button>';
    }).join('');
  }

  function renderIndice(list) {
    $('#idx').innerHTML = list.map(function (u, i) {
      var f = u.fotos[1] || u.fotos[0];
      return '<li><a class="row" href="#' + u.id + '" data-i="' + i + '">' +
        '<span class="row__name"><small>' + esc(u.marca) + ' ' + esc(u.version) + '</small><b>' + esc(u.modelo) + '</b></span>' +
        '<span class="row__year">' + u.anio + '</span>' +
        '<span class="row__km">Km <span>' + fmtKm(u.km) + '</span> Precio: ' + (u.precio ? esc(u.precio) : 'consultar') + '</span>' +
        '<img class="row__thumb" src="' + img(f.n, 540) + '" width="540" height="675" alt="" loading="lazy" decoding="async">' +
        '</a></li>';
    }).join('');
    $('#idxBg').innerHTML = list.map(function (u) {
      var f = u.fotos[0];
      return '<img class="rv" src="' + img(f.n, 1080) + '" width="1080" height="1350" alt="" style="object-position:' + f.pos + '" loading="lazy" decoding="async">';
    }).join('');
    $('#estado').textContent = 'Mostrando ' + list.length + ' de ' + INV.length + (INV.length === 1 ? ' unidad' : ' unidades');
  }

  function specHTML(u) {
    return '<dl class="spec">' +
      '<div><dt>Año</dt><dd>' + u.anio + '</dd></div>' +
      '<div><dt>Kilómetros</dt><dd class="km" data-km="' + u.km + '">' + fmtKm(u.km) + '</dd></div>' +
      '<div><dt>Motor</dt><dd>' + esc(u.motor) + '</dd></div>' +
      '<div><dt>Precio</dt><dd>' + (u.precio ? esc(u.precio) : 'Consultar') + '</dd></div></dl>';
  }
  function fotosHTML(u) {
    return '<div class="fotos-list"><h3>En las fotos</h3><ul>' + u.enFotos.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
  }
  function waHTML(u, txt) {
    return '<a class="wa" href="' + wa(msgUnidad(u)) + '" target="_blank" rel="noopener noreferrer"><small>Abre WhatsApp con el mensaje armado</small><span>' + esc(txt) + '</span></a>';
  }
  function nextHTML(list, i) {
    var nx = list[i + 1];
    return nx
      ? '<a class="next" href="#' + nx.id + '">Sigue: ' + esc(nx.marca + ' ' + nx.modelo + ' ' + nx.anio) + '</a>'
      : '<a class="next" href="#redes">Sigue: redes y ubicación</a>';
  }
  function numsHTML(n) {
    var h = '';
    for (var k = 0; k < n; k++) h += '<button type="button" data-i="' + k + '" aria-label="Foto ' + (k + 1) + ' de ' + n + '"' + (k === 0 ? ' aria-current="true"' : '') + '>' + pad2(k + 1) + '</button>';
    return h;
  }
  function odoHTML(n) {
    var h = '';
    for (var k = 0; k < n; k++) h += '<i>' + pad2(k + 1) + '</i>';
    return '<span class="odo" aria-hidden="true"><span class="odo__r">' + h + '</span></span>';
  }

  // A: secuencia de fotos (fijada en escritorio, carrusel táctil en móvil)
  function unidadA(u, list, i) {
    var n = u.fotos.length;
    return '<section class="u ua" id="' + u.id + '" data-scene="' + esc(u.marca + ' ' + u.modelo + ' ' + u.anio) + '" data-theme="plata" data-unit="' + u.id + '" aria-labelledby="h-' + u.id + '">' +
      '<div class="ua__stage">' +
      '<p class="ua__year" aria-hidden="true">' + u.anio + '</p>' +
      '<div class="ua__view">' +
      '<div class="ua__photo" tabindex="0" role="group" aria-label="Fotos del ' + esc(u.marca + ' ' + u.modelo) + ', deslizá para ver más">' +
      u.fotos.map(function (f, k) {
        return '<figure class="ua__ph"><img src="' + img(f.n, 1080) + '" srcset="' + srcset(f.n) + '" sizes="(min-width: 761px) 75vw, 100vw" width="1080" height="1350" alt="' + esc(f.alt) + '" style="object-position:' + f.pos + '"' + (k ? ' loading="lazy"' : '') + ' decoding="async"></figure>';
      }).join('') + '</div>' +
      '<div class="ua__cnt">' + odoHTML(n) + '<span class="ua__tot">de ' + pad2(n) + '</span><div class="nums" role="group" aria-label="Ir a la foto">' + numsHTML(n) + '</div></div>' +
      '</div>' +
      '<div class="ua__corte corte" aria-hidden="true"><b></b><i></i></div>' +
      '<div class="ua__data">' +
      '<div class="ua__head"><small>' + esc(u.marca) + '</small><h2 id="h-' + u.id + '">' + esc(u.modelo) + '</h2><p>' + esc(u.version) + '</p></div>' +
      specHTML(u) + fotosHTML(u) +
      '<div class="ua__act">' + waHTML(u, 'Consultar por este ' + u.modelo) + nextHTML(list, i) + '</div>' +
      '</div></div></section>';
  }

  // B: filmstrip horizontal con escalas mezcladas
  var CUTS = ['cut-br', 'cut-tl', 'cut-tr'];
  function unidadB(u, list, i) {
    var n = u.fotos.length;
    return '<section class="u ub" id="' + u.id + '" data-scene="' + esc(u.marca + ' ' + u.modelo + ' ' + u.anio) + '" data-theme="rojo" data-unit="' + u.id + '" aria-labelledby="h-' + u.id + '">' +
      '<div class="ub__stage" tabindex="0" role="group" aria-label="Fotos del ' + esc(u.marca + ' ' + u.modelo) + '">' +
      '<p class="ub__year" aria-hidden="true">' + u.anio + '</p>' +
      '<div class="ub__track">' +
      '<div class="ub__intro"><small>' + esc(u.marca) + '</small><h2 id="h-' + u.id + '">' + esc(u.modelo) + '</h2><p class="ver">' + esc(u.version) + '</p>' + specHTML(u) + fotosHTML(u) + '</div>' +
      u.fotos.map(function (f, k) {
        return '<figure class="ub__ph ub__ph--' + (k % 3) + ' ' + CUTS[k % 3] + '"><img src="' + img(f.n, 1080) + '" srcset="' + srcset(f.n) + '" sizes="(min-width: 761px) 40vw, 80vw" width="1080" height="1350" alt="' + esc(f.alt) + '" style="object-position:' + f.pos + '" decoding="async"' + (k > 2 ? ' loading="lazy"' : '') + '></figure>';
      }).join('') +
      '<div class="ub__end"><p>Consultá por este ' + esc(u.modelo) + '</p>' + waHTML(u, 'Escribir por el ' + u.modelo) + nextHTML(list, i) + '</div>' +
      '</div>' +
      '<div class="ub__bar">' + odoHTML(n) + '<span class="ua__tot">de ' + pad2(n) + '</span><div class="ub__prog"><i></i></div><div class="nums" role="group" aria-label="Ir a la foto">' + numsHTML(n) + '</div></div>' +
      '</div></section>';
  }

  function renderUnidades(list) {
    $('#escenas').innerHTML = list.map(function (u, i) { return (i % 2 === 0 ? unidadA : unidadB)(u, list, i); }).join('');
    $$('#escenas .u').forEach(function (sec, i) { bindGaleria(sec, list[i]); });
  }

  function ldVehiculos() {
    var el = $('#ldInv');
    if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ldInv'; document.head.appendChild(el); }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: INV.map(function (u, i) {
        return {
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'Car', name: nombre(u), brand: { '@type': 'Brand', name: u.marca }, model: u.modelo,
            vehicleModelDate: String(u.anio),
            mileageFromOdometer: { '@type': 'QuantitativeValue', value: u.km, unitCode: 'KMT' },
            image: BASE + img(u.fotos[0].n, 1080), url: BASE + '#' + u.id
          }
        };
      })
    });
  }

  /* galería: contador, números y teclado, igual en modo nativo y fijado */
  function setNum(sec, i, n) {
    $$('.nums button', sec).forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    var rail = $('.odo__r', sec);
    if (rail && !sec.classList.contains('ua--pin') && !sec.classList.contains('ub--pin')) {
      gsap.to(rail, { yPercent: -100 * i / n, duration: RM.matches ? 0 : 0.4, ease: 'power3.out', overwrite: true });
    }
  }
  function bindGaleria(sec, u) {
    var n = u.fotos.length, raf = 0;
    var photo = $('.ua__photo', sec), strip = $('.ub__stage', sec);
    var scroller = photo || strip;
    if (scroller) {
      scroller.addEventListener('scroll', function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          if (sec.classList.contains('ua--pin') || sec.classList.contains('ub--pin')) return;
          var i = photo
            ? Math.round(photo.scrollLeft / Math.max(1, photo.clientWidth))
            : nearestFig(sec);
          setNum(sec, Math.max(0, Math.min(n - 1, i)), n);
        });
      }, { passive: true });
    }
    $$('.nums button', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.i;
        if (sec._go) return sec._go(i);
        if (photo) photo.scrollTo({ left: i * photo.clientWidth, behavior: RM.matches ? 'auto' : 'smooth' });
      });
    });
  }
  function nearestFig(sec) {
    var stage = $('.ub__stage', sec), mid = stage.scrollLeft + stage.clientWidth / 2, best = 0, d = 1e9;
    $$('.ub__ph', sec).forEach(function (f, k) {
      var c = Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid);
      if (c < d) { d = c; best = k; }
    });
    return best;
  }

  /* ---------- 4. navegación viva ---------- */
  var nav = $('#nav'), where = $('#where');
  var scenes = [], heroP = 0, current = null;

  function setWA(u) {
    var href = u ? wa(msgUnidad(u)) : wa(MSG_GEN);
    var t = u ? 'Consultar ' + u.modelo : 'WhatsApp';
    $('#waNav').href = href; $('#waDock').href = href;
    $('#waNavT').textContent = t; $('#waDockT').textContent = u ? 'Consultar ' + u.modelo : 'WhatsApp';
  }
  function collectScenes() { scenes = $$('[data-scene]'); current = null; }
  function trackScene() {
    var mid = window.innerHeight * 0.5, found = null;
    for (var i = 0; i < scenes.length; i++) {
      var r = scenes[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { found = scenes[i]; break; }
    }
    if (!found) return;
    var theme = found.dataset.theme;
    if (found.id === 'apertura' && heroP > 0.9) theme = 'blanco';
    if (nav.dataset.theme !== theme) nav.dataset.theme = theme;
    if (found !== current) {
      current = found;
      var u = found.dataset.unit ? INV.filter(function (x) { return x.id === found.dataset.unit; })[0] : null;
      where.textContent = u ? u.modelo + ' ' + u.anio : found.dataset.scene;
      setWA(u);
    }
    var compact = window.scrollY > 60;
    if (nav.classList.contains('is-compact') !== compact) nav.classList.toggle('is-compact', compact);
  }
  var ticking = false;
  function onScrollNav() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; trackScene(); });
  }

  /* índice a pantalla completa */
  var ov = $('#indice'), menuBtn = $('#menuBtn'), lastFocus = null;
  function abrirIndice() {
    lastFocus = document.activeElement;
    ov.hidden = false; menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    $('#main').inert = true; $('#nav').inert = true;
    if (RM.matches) gsap.set(ov, { '--k': BIG + 'px' });
    else gsap.fromTo(ov, { '--k': '0px' }, { '--k': BIG + 'px', duration: 0.8, ease: 'expo.out' });
    $('#menuX').focus();
  }
  function cerrarIndice(cb) {
    var done = function () {
      ov.hidden = true; menuBtn.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      $('#main').inert = false; $('#nav').inert = false;
      if (lastFocus && !cb) lastFocus.focus();
      if (cb) cb();
    };
    if (RM.matches) done();
    else gsap.to(ov, { '--k': '0px', duration: 0.45, ease: 'power3.in', onComplete: done });
  }

  /* anclas con recorrido propio */
  function scrollA(el) {
    if (!el) return;
    if (RM.matches) { el.scrollIntoView(); return; }
    gsap.to(window, { scrollTo: { y: el, autoKill: true }, duration: 1.1, ease: 'power3.inOut' });
  }

  /* ---------- 5. movimiento ---------- */
  var mm = gsap.matchMedia();

  function fotoIndex(t, n, T0, STEP, DUR) {
    var idx = 0;
    for (var i = 1; i < n; i++) if (t >= T0 + (i - 1) * STEP + DUR * 0.5) idx = i;
    return idx;
  }

  function pinA(sec, u, add) {
    var n = u.fotos.length, phs = $$('.ua__ph', sec), rail = $('.odo__r', sec);
    var kmEl = $('[data-km]', sec), year = $('.ua__year', sec);
    var T0 = 0.6, STEP = 1.2, DUR = 1, TOTAL = T0 + (n - 1) * STEP + 0.5;
    sec.classList.add('ua--pin');
    phs.slice(1).forEach(function (el) { el.classList.add('rv'); });
    kmEl.textContent = '0';
    var o = { v: 0 }, last = -1;
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sec, start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * (n * 0.8 + 0.3)); },
        pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var i = fotoIndex(self.progress * tl.duration(), n, T0, STEP, DUR);
          if (i !== last) { last = i; $$('.nums button', sec).forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
        }
      }
    });
    tl.to(o, { v: u.km, duration: T0 + 0.3, ease: 'power2.out', onUpdate: function () { kmEl.textContent = fmtKm(Math.round(o.v)); } }, 0);
    tl.to(year, { xPercent: -15, duration: TOTAL }, 0);
    phs.forEach(function (ph, i) {
      if (!i) return;
      var t = T0 + (i - 1) * STEP;
      tl.to(ph, { '--k': BIG + 'px', ease: 'power2.inOut', duration: DUR }, t);
      tl.fromTo($('img', ph), { scale: 1.28 }, { scale: 1, ease: 'power2.out', duration: DUR + 0.25 }, t);
      tl.to(rail, { yPercent: -100 * i / n, ease: 'power2.inOut', duration: 0.5 }, t + DUR * 0.35);
    });
    tl.set({}, {}, TOTAL);
    sec._go = function (i) {
      var st = tl.scrollTrigger, t = i === 0 ? 0 : T0 + (i - 1) * STEP + DUR;
      gsap.to(window, { scrollTo: st.start + (t / tl.duration()) * (st.end - st.start), duration: RM.matches ? 0 : 0.9, ease: 'power3.inOut' });
    };
    add(function () {
      sec.classList.remove('ua--pin'); delete sec._go;
      phs.forEach(function (el) { el.classList.remove('rv'); });
      kmEl.textContent = fmtKm(u.km);
    });
  }

  function pinB(sec, u, add) {
    var n = u.fotos.length, stage = $('.ub__stage', sec), track = $('.ub__track', sec), year = $('.ub__year', sec);
    var figs = $$('.ub__ph', sec), prog = $('.ub__prog i', sec), rail = $('.odo__r', sec);
    var setYear = gsap.quickSetter(year, 'x', 'px'), last = -1, tid = 0;
    sec.classList.add('ub--pin');
    var dist = function () { return Math.max(1, track.scrollWidth - stage.clientWidth); };
    var skew = gsap.quickTo(figs, 'skewX', { duration: 0.5, ease: 'power3.out' });
    var move = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: sec, start: 'top top', end: function () { return '+=' + dist(); },
        pin: true, scrub: 0.45, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var x = self.progress * dist();
          prog.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
          setYear(-x * 0.42);
          // foto más cercana al centro
          var mid = x + stage.clientWidth / 2, best = 0, d = 1e9;
          figs.forEach(function (f, k) { var c = Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid); if (c < d) { d = c; best = k; } });
          if (best !== last) {
            last = best;
            $$('.nums button', sec).forEach(function (b, k) { b.setAttribute('aria-current', k === best ? 'true' : 'false'); });
            gsap.to(rail, { yPercent: -100 * best / n, duration: 0.4, ease: 'power3.out', overwrite: true });
          }
          skew(gsap.utils.clamp(-5, 5, self.getVelocity() / -380));
          clearTimeout(tid); tid = setTimeout(function () { skew(0); }, 110);
        }
      }
    });
    figs.forEach(function (f) {
      var im = $('img', f);
      gsap.fromTo(im, { x: 0 }, {
        x: function () { return -(im.offsetWidth - f.clientWidth); }, ease: 'none',
        scrollTrigger: { trigger: f, containerAnimation: move, start: 'left right', end: 'right left', scrub: true, invalidateOnRefresh: true }
      });
    });
    sec._go = function (i) {
      var f = figs[i], st = move.scrollTrigger;
      var tx = gsap.utils.clamp(0, dist(), f.offsetLeft + f.offsetWidth / 2 - stage.clientWidth / 2);
      gsap.to(window, { scrollTo: st.start + tx * (st.end - st.start) / dist(), duration: RM.matches ? 0 : 0.9, ease: 'power3.inOut' });
    };
    add(function () { sec.classList.remove('ub--pin'); delete sec._go; clearTimeout(tid); });
  }

  function motion(lst) {
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', desk: '(min-width: 761px)' }, function (ctx) {
      var desk = ctx.conditions.desk, ok = ctx.conditions.ok, cleanups = [];
      var add = function (fn) { cleanups.push(fn); };
      if (!ok) return;

      /* APERTURA: el auto cruza la palabra; al final, el corte blanco la cubre */
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.s0', start: 'top top', end: '+=230%', pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (s) { heroP = s.progress; }
        }
      })
        .to('.car', { xPercent: desk ? -98 : -62, scale: desk ? 1.5 : 1.3, ease: 'power1.in', duration: 0.85 }, 0)
        .to('.word', { x: function () { return -window.innerWidth * (desk ? 0.13 : 0.12); }, duration: 1 }, 0)
        .to('.s0__units', { yPercent: 180, duration: 0.3, ease: 'power2.in' }, 0.12)
        .fromTo('.wipe', { '--k': '0px' }, { '--k': function () { return window.innerWidth + window.innerHeight + 80 + 'px'; }, ease: 'power2.in', duration: 0.3 }, 0.72);

      /* SALÓN: el número viaja más lento que la foto; la foto llega por el corte */
      var s1 = $('.s1'), big = $('.s1__big'), bigImg = $('img', big);
      big.classList.add('rv'); add(function () { big.classList.remove('rv'); });
      gsap.fromTo('.s1__num', { xPercent: 12 }, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: s1, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(big, { '--k': '0px' }, { '--k': BIG + 'px', ease: 'none', scrollTrigger: { trigger: s1, start: 'top 75%', end: 'top 5%', scrub: 0.6 } });
      gsap.fromTo(bigImg, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: s1, start: 'top 75%', end: 'center 40%', scrub: 0.6 } });
      gsap.fromTo('.s1__small', { yPercent: desk ? 40 : 14 }, { yPercent: desk ? -26 : -8, ease: 'none', scrollTrigger: { trigger: s1, start: 'top bottom', end: 'bottom top', scrub: true } });

      /* ÍNDICE: filas que suben por máscara, una vez */
      $$('.row').forEach(function (row) {
        var parts = [$('.row__name b', row), $('.row__year', row), $('.row__km', row)];
        gsap.from(parts, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' } });
      });

      /* UNIDADES */
      $$('#escenas .u').forEach(function (sec, i) {
        var u = lst[i];
        if (sec.classList.contains('ua')) { if (desk) pinA(sec, u, add); }
        else pinB(sec, u, add);
      });

      /* REDES: las publicaciones se cruzan a velocidades distintas */
      var s4 = $('.s4');
      gsap.fromTo('.s4__pub--a', { yPercent: 14, rotation: -6 }, { yPercent: -14, rotation: -2, ease: 'none', scrollTrigger: { trigger: s4, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.s4__pub--b', { yPercent: -12, rotation: 1 }, { yPercent: 16, rotation: 5, ease: 'none', scrollTrigger: { trigger: s4, start: 'top bottom', end: 'bottom top', scrub: true } });

      /* CIERRE: la marca se acerca */
      gsap.fromTo('.s5__word', { yPercent: 28, scale: 0.78, transformOrigin: '0% 100%' }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.s5', start: 'top bottom', end: 'top 15%', scrub: 0.6 } });

      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });
  }

  /* hover del índice: la foto del auto ocupa toda la escena (solo con mouse) */
  function bindIndiceHover() {
    var imgs = $$('#idxBg img'), z = 0, activo = -1;
    $$('#idx .row').forEach(function (row) {
      var show = function () {
        if (!FINE.matches) return;
        var i = +row.dataset.i; if (i === activo) return; activo = i;
        var im = imgs[i]; im.style.zIndex = ++z;
        if (RM.matches) gsap.set(im, { '--k': BIG + 'px' });
        else gsap.fromTo(im, { '--k': '0px' }, { '--k': BIG + 'px', duration: 0.9, ease: 'expo.out', overwrite: true });
      };
      row.addEventListener('mouseenter', show); row.addEventListener('focus', show);
    });
    var hide = function () {
      activo = -1;
      imgs.forEach(function (im) { gsap.to(im, { '--k': '0px', duration: RM.matches ? 0 : 0.5, ease: 'power3.in', overwrite: true }); });
    };
    $('#idx').addEventListener('mouseleave', hide);
    $('#idx').addEventListener('focusout', function (e) { if (!$('#idx').contains(e.relatedTarget)) hide(); });
  }

  /* ---------- 6. arranque ---------- */
  function montar() {
    mm.revert();
    var l = lista();
    renderFiltros(); renderIndice(l); renderUnidades(l);
    bindIndiceHover();
    motion(l);
    collectScenes();
    ScrollTrigger.refresh();
    trackScene();
  }

  function intro() {
    if (RM.matches) return;
    var tl = gsap.timeline({ delay: 0.15 });
    tl.to('.corte--h b', { scaleX: 1, duration: 1.3, ease: 'power3.inOut' }, 0)
      .to('.corte--h i', { scaleX: 1, duration: 1.3, ease: 'power3.inOut' }, 0.1)
      .to('.ch i', { yPercent: 0, y: 0, transform: 'none', duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.2)
      .to('.car__in', { x: 0, transform: 'none', duration: 1.9, ease: 'expo.out' }, 0.35)
      .set(['.car__tag', '.s0__micro', '.s0__units'], { opacity: 1, clipPath: 'inset(0 100% 0 0)' }, 1.05)
      .to(['.car__tag', '.s0__micro', '.s0__units'], { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'clipPath' }, 1.05);
  }

  function init() {
    bindContacto(); setWA(null); ldVehiculos();

    $('#filtros').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-f]'); if (!b || b.dataset.f === filtro) return;
      filtro = b.dataset.f; montar();
      var nb = $('#filtros button[data-f="' + filtro.replace(/"/g, '') + '"]'); if (nb) nb.focus();
    });

    menuBtn.addEventListener('click', abrirIndice);
    $('#menuX').addEventListener('click', function () { cerrarIndice(); });
    ov.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarIndice();
      if (e.key === 'Tab') { // foco contenido dentro del índice
        var f = $$('a,button', ov), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href') === '#') return;
      var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault();
      history.replaceState(null, '', a.getAttribute('href'));
      if (a.hasAttribute('data-close')) cerrarIndice(function () { scrollA(t); });
      else scrollA(t);
    });

    montar();
    intro();
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: onScrollNav });
    window.addEventListener('resize', onScrollNav, { passive: true });

    if (location.hash) {
      var h = document.getElementById(location.hash.slice(1));
      if (h) window.addEventListener('load', function () { ScrollTrigger.refresh(); window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY); });
    }
  }

  init();
})();
