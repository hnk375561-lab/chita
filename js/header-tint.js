/* CHITA · barra superior (header) tintada según la sección que está debajo.
   La barra es siempre visible (position:sticky; top:0) y no se mueve al scrollear: solo cambia su color de fondo.
   Un IntersectionObserver vigila una línea de 1 px justo debajo del header: la sección que la cruza es la «actual».
   Cero trabajo por frame de scroll (no hay listener de scroll). Los colores viven en css/header-tint.css (header[data-sec]). */
(function () {
  "use strict";
  var hd = document.querySelector("header");
  if (!hd || !("IntersectionObserver" in window)) return;
  var main = document.querySelector("main");
  var list = [].slice.call(document.querySelectorAll("#hero, main > section[id], footer"));
  if (!list.length) return;
  var live = new Set(), io = null;

  function pick() {
    var cur = null;
    list.forEach(function (s) { if (live.has(s)) cur = s; });      // si la línea cruza dos, gana la de más abajo (la que empieza)
    if (!cur) return;
    var id = cur.id || (cur.tagName === "FOOTER" ? "footer" : "");
    if (id && hd.getAttribute("data-sec") !== id) hd.setAttribute("data-sec", id);
  }
  function build() {
    if (io) io.disconnect();
    live.clear();
    var h = Math.round(hd.getBoundingClientRect().height) || 58;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var bottom = Math.max(0, vh - h - 2);
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) live.add(e.target); else live.delete(e.target); });
      pick();
    }, { rootMargin: "-" + (h + 0) + "px 0px -" + bottom + "px 0px", threshold: 0 });
    list.forEach(function (s) { io.observe(s); });
  }
  build();
  var rt = 0;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 200); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
})();
