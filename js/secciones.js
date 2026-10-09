/* CHITA · secciones.js
   1) «Comprá, vendé o permutá»: marca cada tarjeta con .ld cuando su foto cargó
      (css/secciones.css deja la foto en opacity:0 hasta que existe .ld).
   2) «Cómo comprar»: el riel rojo se llena con el scroll y se enciende el paso actual.
   Los estilos de este archivo viven en css/secciones.css. */
(function () {
  "use strict";

  /* ---- 1 · fotos de operaciones ---- */
  function listo(box) { box.classList.add("ld"); }
  document.querySelectorAll("#operaciones .oc .oi").forEach(function (box) {
    var img = box.querySelector("img");
    if (!img) { listo(box); return; }
    if (img.complete) { listo(box); return; }          // ya cargó (o falló): no esperar
    img.addEventListener("load", function () { listo(box); }, { once: true });
    img.addEventListener("error", function () { listo(box); }, { once: true });
  });
  /* red de seguridad: si algo quedó sin marcar, no dejar el brillo gris para siempre */
  setTimeout(function () {
    document.querySelectorAll("#operaciones .oc .oi:not(.ld)").forEach(listo);
  }, 4000);

  /* ---- 2 · riel de «Cómo comprar» ---- */
  var list = document.querySelector("#como-comprar .tk-list");
  if (!list) return;
  var steps = [].slice.call(list.querySelectorAll(".tk-step"));
  if (!steps.length) return;
  var fill = list.querySelector(".tk-fill");
  if (!fill) { fill = document.createElement("i"); fill.className = "tk-fill"; fill.setAttribute("aria-hidden", "true"); list.insertBefore(fill, list.firstChild); }

  var tick = 0;
  function update() {
    tick = 0;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var line = vh * 0.55;                               // «línea de lectura»
    var lr = list.getBoundingClientRect();
    var p = (line - lr.top) / Math.max(1, lr.height);
    p = Math.max(0, Math.min(1, p));
    fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
    list.style.setProperty("--p", (p * 100).toFixed(1));
    var cur = -1;
    steps.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      if (r.top < line) { s.classList.add("seen"); cur = i; }
    });
    steps.forEach(function (s, i) { s.classList.toggle("on", i === cur); });
  }
  function req() { if (!tick) tick = requestAnimationFrame(update); }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();
})();
