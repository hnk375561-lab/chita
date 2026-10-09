/* CHITA · «Dónde estamos» — mapa propio (Leaflet).
   Qué resuelve: antes el mapa era un iframe de Google y la ficha «Chita 1712» era un elemento pegado a la pantalla,
   así que al arrastrar el mapa la ficha se quedaba en el medio y dejaba de señalar el local.
   Ahora la ficha es un marcador del mapa, anclado a la coordenada de Gral. Galarza 1712: el mapa se mueve y hace zoom
   como siempre y la ficha queda siempre sobre Chita.
   · Leaflet y su CSS se cargan recién cuando la sección está por entrar en pantalla (no pesan en la carga inicial).
   · En escritorio la rueda hace zoom solo después de hacer clic en el mapa (no secuestra el scroll de la página).
   · En celular un dedo mueve el mapa solo después de tocarlo (no atrapa el scroll); «Tocá para mover el mapa».
   · Si Leaflet o los mosaicos no cargan, vuelve al mapa de Google de siempre.
   · Para cambiar de proveedor de mosaicos, editar TILES (y su atribución). */
(function () {
"use strict";
var mp = document.querySelector("#contacto .mp");
if (!mp) return;

var CHITA = [-32.486865, -58.250318];           // Gral. Galarza 1712 (misma coordenada del mapa anterior)
var ZOOM = 17;
var TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
var ATTR = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';
var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
var touch = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window && !matchMedia("(pointer:fine)").matches;
var iframe = mp.querySelector("iframe");
var started = false, map = null, el = null, moved = false, dead = false;

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
  mp.classList.add("rd");
}

function loadAssets(done) {
  if (window.L && window.L.map) return done();
  var css = document.createElement("link");
  css.rel = "stylesheet"; css.href = "js/vendor/leaflet.css";
  document.head.appendChild(css);
  var s = document.createElement("script");
  s.src = "js/vendor/leaflet.js"; s.async = true;
  s.onload = done; s.onerror = fallback;
  document.head.appendChild(s);
}

/* En escritorio el panel de la dirección tapa la izquierda: el punto de Chita se ubica en el centro de la parte libre. */
function homeCenter(z) {
  if (!map) return null;
  var off = 0;
  if (innerWidth >= 900) {
    var lc = document.querySelector("#contacto .lc");
    if (lc) off = Math.max(0, (lc.getBoundingClientRect().right - mp.getBoundingClientRect().left) / 2);
  }
  var p = map.project(L.latLng(CHITA), z).subtract([off, 0]);
  return map.unproject(p, z);
}
function goHome(animate) {
  if (!map) return;
  var a = animate && !RM;
  map.setView(homeCenter(ZOOM), ZOOM, { animate: a, duration: .6 });
  moved = false; sync();
}

var btnC = null;
function sync() {
  if (!btnC || !map) return;
  var c = map.latLngToContainerPoint(homeCenter(map.getZoom())).distanceTo(map.getSize().divideBy(2));
  var away = c > 24 || Math.abs(map.getZoom() - ZOOM) > .01;
  btnC.classList.toggle("off", away);
  btnC.setAttribute("aria-label", away ? "Volver a Chita" : "Mapa centrado en Chita");
}

function init() {
  if (dead) return;
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
    zoomSnap: 1, wheelPxPerZoomLevel: 90, inertia: !RM, fadeAnimation: !RM, zoomAnimation: !RM,
    keyboard: true, tap: false
  });
  L.control.attribution({ position: "bottomright", prefix: false }).addAttribution(ATTR).addTo(map);

  var ok = 0, bad = 0;
  var tiles = L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR, keepBuffer: 2, updateWhenIdle: false, crossOrigin: false });
  tiles.on("tileload", function () { ok++; mp.classList.add("rd"); });
  tiles.on("tileerror", function () { bad++; if (!ok && bad >= 6) fallback(); });
  tiles.addTo(map);

  /* La ficha: marcador del mapa. La punta de la flecha toca exactamente la coordenada. */
  var icon = L.divIcon({
    className: "chita-pin", iconSize: null, iconAnchor: [0, 0],
    html: '<span class="cp"><i>Chita</i><b>1712</b></span>'
  });
  var mk = L.marker(CHITA, { icon: icon, interactive: false, keyboard: false, zIndexOffset: 1000 }).addTo(map);
  function anchor() {
    var n = mk.getElement(); if (!n) return;
    var w = n.offsetWidth || 122, h = n.offsetHeight || 100;
    n.style.marginLeft = (-w / 2) + "px"; n.style.marginTop = (-h) + "px";
  }
  anchor();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(anchor);

  /* Controles */
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
  var t = 0;
  addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { if (!map) return; map.invalidateSize(); if (!moved) goHome(false); else sync(); }, 150); });
  if ("ResizeObserver" in window) new ResizeObserver(function () { if (map) map.invalidateSize(); }).observe(mp);
}

function start() { if (started) return; started = true; loadAssets(init); }

if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: "1400px 0px" });
  io.observe(mp);
} else addEventListener("load", function () { setTimeout(start, 800); });
mp.addEventListener("pointerdown", start, { passive: true });
})();
