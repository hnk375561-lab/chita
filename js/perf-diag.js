/* CHITA · perf-diag.js — herramienta de diagnóstico (Fase 0).
   Solo se carga si la URL trae ?perf=... (lo decide un script mínimo en index.html). Sin ese parámetro NO se descarga ni se ejecuta.

   Uso:  index.html?perf=estatico,measure
   Fichas (separadas por coma):
     todo       · quita TODOS los clip-path (equivale a la variante «sin ningún clip-path» del informe)
     estatico   · quita solo los clip-path de las hojas de estilo (los polígonos fijos); deja los animados por GSAP
     anim       · quita solo los clip-path animados por GSAP/scrub (los que viven en el atributo style="")
     hero       · quita los clip-path dentro de #hero
     header     · quita los clip-path dentro de <header>
     entregas   · quita los clip-path dentro de #entregas
     sheet      · quita el clip-path de las secciones versus, contacto, financiacion, guia y visita
     sombras    · quita todas las box-shadow
     measure    · muestra el panel «Medir» (scroll automático a ~1400 px/s, 3 pasadas)
   Ejemplos:    ?perf=measure   (línea base)   ·   ?perf=estatico,measure   ·   ?perf=anim,measure   ·   ?perf=hero,entregas,measure
   Para comparar contra la hoja nueva de recortes (css/chita-perf2.css): añadir  &cut=clip  (la desactiva). */
(function () {
  "use strict";
  var params = new URLSearchParams(location.search);
  var fichas = (params.get("perf") || "").split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
  if (!fichas.length) return;
  var on = function (k) { return fichas.indexOf(k) > -1; };

  /* 1 · CSS de las variantes. !important de autor gana al style="" que escribe GSAP (salvo otro !important inline, que no hay). */
  var zona = function (raiz) { return raiz + "," + raiz + " *," + raiz + " *::before," + raiz + " *::after{clip-path:none!important}"; };
  var css = [];
  if (on("todo")) css.push("*,*::before,*::after{clip-path:none!important}");
  if (on("estatico")) css.push("*:not([style*=\"clip-path\"]),*:not([style*=\"clip-path\"])::before,*:not([style*=\"clip-path\"])::after{clip-path:none!important}");
  if (on("anim")) css.push("[style*=\"clip-path\"]{clip-path:none!important}");
  if (on("hero")) css.push(zona("#hero"));
  if (on("header")) css.push(zona("header"));
  if (on("entregas")) css.push(zona("#entregas"));
  if (on("sheet")) css.push("#versus,#contacto,#financiacion,#guia,#visita{clip-path:none!important}");
  if (on("sombras")) css.push("*,*::before,*::after{box-shadow:none!important}");
  if (css.length) {
    var st = document.createElement("style");
    st.id = "perf-diag-css";
    st.textContent = css.join("\n");
    document.head.appendChild(st);
  }

  /* 2 · Panel de medición */
  if (!on("measure")) return;
  var SPEED = 1400, WARM = 1500, PASADAS = 3;

  var estadisticas = function (a) {
    var n = a.length || 1;
    var suma = 0, peor = 0, m50 = 0, m100 = 0;
    a.forEach(function (x) { suma += x.dt; if (x.dt > peor) peor = x.dt; if (x.dt > 50) m50++; if (x.dt > 100) m100++; });
    return { frames: a.length, prom: +(suma / n).toFixed(1), m50: m50, m100: m100, peor: Math.round(peor) };
  };

  var espera = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  var unaPasada = function () {
    return new Promise(function (resolve) {
      window.scrollTo(0, 0);
      espera(2000).then(function () {
        var max = document.documentElement.scrollHeight - innerHeight;
        var frames = [], last = performance.now(), t0 = last;
        var tick = function (now) {
          frames.push({ dt: now - last, t: now - t0 });
          last = now;
          var y = Math.min(((now - t0) / 1000) * SPEED, max);
          window.scrollTo(0, y);
          if (y >= max) {
            var f = frames.slice(1);
            resolve({ total: estadisticas(f), arranque: estadisticas(f.filter(function (x) { return x.t < WARM; })) });
          } else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
  };

  var promedio = function (rs, parte) {
    var k = ["prom", "m50", "m100", "peor"], o = {};
    k.forEach(function (c) { o[c] = +(rs.reduce(function (s, r) { return s + r[parte][c]; }, 0) / rs.length).toFixed(1); });
    return o;
  };

  var panel = document.createElement("div");
  panel.setAttribute("style", "position:fixed;left:8px;bottom:8px;z-index:2147483647;font:12px/1.4 system-ui,sans-serif;background:#111;color:#fff;padding:8px 10px;border-radius:6px;max-width:340px;box-shadow:0 2px 10px rgba(0,0,0,.5)");
  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Medir scroll (" + PASADAS + " pasadas)";
  btn.setAttribute("style", "font:inherit;padding:6px 10px;cursor:pointer");
  var out = document.createElement("pre");
  out.setAttribute("style", "margin:6px 0 0;white-space:pre-wrap;font:11px/1.35 ui-monospace,monospace");
  out.textContent = "Fichas activas: " + fichas.join(", ") + (/[?&]cut=clip/.test(location.search) ? " · cut=clip" : "");
  panel.appendChild(btn); panel.appendChild(out);

  btn.addEventListener("click", function () {
    btn.disabled = true;
    panel.style.opacity = "0";           /* que el panel no ensucie la medición */
    var rs = [], i = 0;
    var siguiente = function () {
      if (i >= PASADAS) {
        panel.style.opacity = "1"; btn.disabled = false;
        var tot = promedio(rs, "total"), arr = promedio(rs, "arranque");
        var txt = "Fichas: " + fichas.join(",") + "\nViewport " + innerWidth + "x" + innerHeight + " · DPR " + devicePixelRatio + " · núcleos " + (navigator.hardwareConcurrency || "?") +
          "\n\nPROMEDIO de " + PASADAS + " pasadas" +
          "\n  recorrido: " + tot.prom + " ms/frame · >50ms: " + tot.m50 + " · >100ms: " + tot.m100 + " · peor: " + tot.peor + " ms" +
          "\n  arranque (1,5 s): " + arr.prom + " ms/frame · >50ms: " + arr.m50 + " · >100ms: " + arr.m100 + " · peor: " + arr.peor + " ms" +
          "\n\nPor pasada (prom / >50 / >100 / peor):\n" + rs.map(function (r, n) { var t = r.total; return "  #" + (n + 1) + ": " + t.prom + " / " + t.m50 + " / " + t.m100 + " / " + t.peor; }).join("\n");
        out.textContent = txt;
        console.log(txt);
        console.table(rs.map(function (r) { return r.total; }));
        window.scrollTo(0, 0);
        return;
      }
      unaPasada().then(function (r) { rs.push(r); i++; siguiente(); });
    };
    siguiente();
  });

  var montar = function () { document.body.appendChild(panel); };
  if (document.body) montar(); else document.addEventListener("DOMContentLoaded", montar);
})();
