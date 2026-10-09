/* CHITA · «Dónde estamos» — mapa propio (Leaflet) + botón «Copiar dirección».
   Lag que resuelve: Leaflet (JS+CSS) y los mosaicos ya no se piden ni se arman mientras la persona hace scroll:
   se espera a que el scroll se quede quieto (y al ratón libre del navegador). Sin filtros CSS sobre los mosaicos.
   · Si la persona toca el mapa, carga al instante.
   · En escritorio la rueda hace zoom solo después de hacer clic (no secuestra el scroll). En celular, un dedo mueve el mapa tras tocarlo.
   · Si Leaflet o los mosaicos no cargan, vuelve al mapa de Google (data-fb) y la ficha estática queda a la vista.
   · Cambiar de proveedor de mosaicos: editar TILES y ATTR. */
(function () {
"use strict";

/* Copiar dirección: no depende del mapa */
var cb = document.querySelector("#contacto [data-copy]");
if (cb) {
  var t0 = cb.textContent;
  var say = function (m, ok) { cb.textContent = m; cb.classList.toggle("is-ok", !!ok); setTimeout(function () { cb.textContent = t0; cb.classList.remove("is-ok"); }, 1800); };
  cb.addEventListener("click", function () {
    var txt = cb.getAttribute("data-copy");
    var fb = function () {
      var a = document.createElement("textarea"); a.value = txt; a.setAttribute("readonly", ""); a.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(a); a.select(); var r = false; try { r = document.execCommand("copy"); } catch (e) {} a.remove();
      say(r ? "Copiada ✓" : "No se pudo copiar", r);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { say("Copiada ✓", true); }, fb); else fb();
  });
}

var mp = document.querySelector("#contacto .dn-map");
if (!mp) return;

var CHITA = [-32.486865, -58.250318];           // Gral. Galarza 1712
var ZOOM = 17;
var TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
var ATTR = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';
var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
var touch = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window && !matchMedia("(pointer:fine)").matches;
var iframe = mp.querySelector("iframe");
var started = false, map = null, el = null, moved = false, dead = false, btnC = null, lastScroll = 0;

addEventListener("scroll", function () { lastScroll = performance.now(); }, { passive: true });
/* Ejecuta fn cuando el scroll lleva ≥180 ms quieto y el navegador está libre */
function calm(fn) {
  (function chk() {
    if (performance.now() - lastScroll < 180) { setTimeout(chk, 120); return; }
    (window.requestIdleCallback || function (f) { setTimeout(f, 1); })(fn, { timeout: 1200 });
  })();
}

function fallback() {
  dead = true;
  if (map) { try { map.remove(); } catch (e) {} map = null; }
  mp.classList.remove("lf", "lf-touch", "on");
  [].forEach.call(mp.querySelectorAll(".mp-lf,.mp-ctl"), function (n) { n.remove(); });
  if (iframe && iframe.getAttribute("data-fb")) {
    iframe.addEventListener("load", function () { mp.classList.add("rd"); }, { once: true });
    iframe.src = iframe.getAttribute("data-fb");
    iframe.removeAttribute("data-fb");
  }
}

function loadAssets(done) {
  if (window.L && window.L.map) return done();
  /* Leaflet posiciona cada mosaico con translate3d: con el mapa a todo el ancho son decenas de capas de GPU que se
     componen, además, debajo del degradado del panel. Con L_DISABLE_3D los mosaicos van con left/top dentro de UNA sola
     capa (el contenedor .dn-map ya tiene contain:paint). Debe definirse ANTES de cargar leaflet.js.
     Para volver al comportamiento anterior: borrar esta línea. */
  window.L_DISABLE_3D = true;
  var css = document.createElement("link");
  css.rel = "stylesheet"; css.href = "js/vendor/leaflet.css";
  document.head.appendChild(css);
  var s = document.createElement("script");
  s.src = "js/vendor/leaflet.js"; s.async = true;
  s.onload = done; s.onerror = fallback;
  document.head.appendChild(s);
}

/* En escritorio el panel azul tapa la parte izquierda del mapa: Chita se centra en la parte libre (a la derecha del panel) */
function offX() {
  var info = document.querySelector("#contacto .dn-info");
  if (!info || !matchMedia("(min-width:901px)").matches) return 0;
  return Math.round(info.getBoundingClientRect().width / 2);
}
function homeCenter() {
  return map.unproject(map.project(L.latLng(CHITA), ZOOM).subtract([offX(), 0]), ZOOM);
}
function goHome(animate) {
  if (!map) return;
  map.setView(homeCenter(), ZOOM, { animate: !!animate && !RM, duration: .6 });
  moved = false; sync();
}
function sync() {
  if (!btnC || !map) return;
  var c = map.latLngToContainerPoint(L.latLng(CHITA)).distanceTo(map.getSize().divideBy(2).add([offX(), 0]));
  var away = c > 24 || Math.abs(map.getZoom() - ZOOM) > .01;
  btnC.classList.toggle("off", away);
  btnC.setAttribute("aria-label", away ? "Volver a Chita" : "Mapa centrado en Chita");
}

function init() {
  if (dead || map) return;
  el = document.createElement("div");
  el.className = "mp-lf";
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", "Mapa de Chita Automotores, Gral. Galarza 1712. Con el mapa enfocado, las flechas lo mueven y + o − acercan y alejan.");
  el.tabIndex = 0;
  mp.insertBefore(el, mp.firstChild);

  map = L.map(el, {
    center: CHITA, zoom: ZOOM, minZoom: 12, maxZoom: 19,
    zoomControl: false, attributionControl: false,
    scrollWheelZoom: false, doubleClickZoom: true, boxZoom: false,
    zoomSnap: 1, wheelPxPerZoomLevel: 90, inertia: false, fadeAnimation: false, zoomAnimation: false, markerZoomAnimation: false, bounceAtZoomLimits: false,
    keyboard: true, tap: false
  });
  L.control.attribution({ position: "bottomright", prefix: false }).addAttribution(ATTR).addTo(map);

  var ok = 0, bad = 0;
  var tiles = L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR, keepBuffer: 1, updateInterval: 300, updateWhenZooming: false, crossOrigin: false,
    /* si un mosaico no llega (el servidor limita pedidos, red lenta) queda un hueco transparente en vez de una imagen rota */
    errorTileUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" });
  tiles.on("tileload", function () { ok++; mp.classList.add("rd"); });
  tiles.on("tileerror", function () { bad++; if (!ok && bad >= 6) fallback(); });
  tiles.addTo(map);

  /* Ficha: marcador del mapa. La punta de la flecha (9 px bajo la ficha) toca exactamente la coordenada. */
  var icon = L.divIcon({ className: "chita-pin", iconSize: null, iconAnchor: [0, 0], html: '<span class="cp"><i>Chita</i><b>1712</b></span>' });
  var mk = L.marker(CHITA, { icon: icon, interactive: false, keyboard: false, zIndexOffset: 1000 }).addTo(map);
  function anchor() {
    var n = mk.getElement(); if (!n) return;
    n.style.marginLeft = (-(n.offsetWidth || 102) / 2) + "px"; n.style.marginTop = (-(n.offsetHeight || 96) - 9) + "px";
  }
  anchor();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(anchor);

  var ctl = document.createElement("div");
  ctl.className = "mp-ctl";
  ctl.innerHTML =
    '<button type="button" class="mp-z" data-z="1" aria-label="Acercar">+</button>' +
    '<button type="button" class="mp-z" data-z="-1" aria-label="Alejar">−</button>' +
    '<button type="button" class="mp-c" aria-label="Mapa centrado en Chita"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg><span>Centrar</span></button>';
  mp.appendChild(ctl);
  btnC = ctl.querySelector(".mp-c");
  ["click", "dblclick", "pointerdown", "touchstart", "wheel"].forEach(function (ev) {
    ctl.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
  });
  ctl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || !map) return;
    if (b.classList.contains("mp-c")) goHome(true);
    else map.setZoom(map.getZoom() + (+b.getAttribute("data-z")));
  });

  /* Activación: el mapa no atrapa el scroll hasta que la persona lo toca */
  mp.classList.add("lf");
  if (touch) { mp.classList.add("lf-touch"); map.dragging.disable(); map.touchZoom.disable(); }
  function on() {
    if (!map || dead) return;
    mp.classList.add("on"); el.setAttribute("data-lenis-prevent", "");
    if (touch) { map.dragging.enable(); map.touchZoom.enable(); } else map.scrollWheelZoom.enable();
  }
  function off() {
    if (!map || dead) return;
    mp.classList.remove("on"); el.removeAttribute("data-lenis-prevent");
    if (touch) { map.dragging.disable(); map.touchZoom.disable(); } else map.scrollWheelZoom.disable();
  }
  el.addEventListener("click", on);
  el.addEventListener("focus", function () { if (!touch) on(); });
  mp.addEventListener("mouseleave", function () { if (!touch) off(); });
  el.addEventListener("blur", function () { if (!touch) off(); });
  document.addEventListener("touchstart", function (e) { if (touch && !mp.contains(e.target)) off(); }, { passive: true });

  map.on("dragstart zoomstart", function () { moved = true; });
  map.on("moveend zoomend", sync);
  goHome(false);

  /* Un solo observador de tamaño (reemplaza al listener de resize): recalcula el mapa y, si no se movió, lo recentra */
  if ("ResizeObserver" in window) {
    var rt = 0;
    new ResizeObserver(function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (!map) return; map.invalidateSize(); if (!moved) goHome(false); else sync(); }, 120);
    }).observe(mp);
  }
}

function start(now) {
  if (started) return; started = true;
  if (now) loadAssets(init); else calm(function () { loadAssets(function () { calm(init); }); });
}

if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); start(false); } }, { rootMargin: "700px 0px" });
  io.observe(mp);
} else addEventListener("load", function () { setTimeout(function () { start(false); }, 800); });
mp.addEventListener("pointerdown", function () { start(true); }, { passive: true });
})();
