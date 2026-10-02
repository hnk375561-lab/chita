/* Tipografía como materia pesada: los títulos de sección se descomponen en letras con masa propia.
   El cursor las empuja (campo de fuerza), la velocidad de scroll las ondula y se asientan con resortes.
   El hero apila capas con distinta física (logo liviano, título pesado, texto viscoso). */
import { reduceMotion, clamp } from "./core.js";
import { world, Spring, PHYSICS, subscribe } from "./engine.js";

function split(h) {
  const label = h.textContent.replace(/\s+/g, " ").trim();
  const chars = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "wd"; w.setAttribute("aria-hidden", "true");
          [...tok].forEach((c) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.appendChild(s); chars.push({ el: s }); });
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(h);
  h.setAttribute("aria-label", label);
  return chars;
}

export function initTypography() {
  if (reduceMotion.matches) return () => {};
  const items = [];
  const measure = (it) => {
    const hr = it.h.getBoundingClientRect();
    it.fs = parseFloat(getComputedStyle(it.h).fontSize) || 48;
    it.chars.forEach((c) => {
      c.el.style.transform = "";
      const r = c.el.getBoundingClientRect();
      c.cx = r.left - hr.left + r.width / 2; c.cy = r.top - hr.top + r.height / 2;
    });
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => { const it = items.find((i) => i.h === e.target); if (it) it.vis = e.isIntersecting; }), { rootMargin: "120px" });
  document.querySelectorAll("main section h2").forEach((h) => {
    if (h.closest("[hidden]") || h.querySelector("img,svg,button,a")) return;
    const chars = split(h);
    if (!chars.length || chars.length > 90) return;
    chars.forEach((c) => { c.sx = new Spring(PHYSICS.type); c.sy = new Spring(PHYSICS.type); c.w = ""; });
    const it = { h, chars, vis: false, fs: 48 };
    items.push(it); io.observe(h);
  });
  const remeasure = () => items.forEach(measure);
  (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(remeasure));
  addEventListener("resize", remeasure, { passive: true });

  /* capas del hero: cada una con su física */
  const tx = document.querySelector(".hero .tx");
  const layers = tx ? [
    { el: tx.querySelector(".hlogo"), d: 26, p: PHYSICS.icon },
    { el: tx.querySelector("h1"), d: 12, p: PHYSICS.type },
    { el: tx.querySelector(":scope > p"), d: 7, p: PHYSICS.image },
    { el: document.querySelector(".hero .ha"), d: 16, p: PHYSICS.cta }
  ].filter((l) => l.el).map((l) => ({ ...l, x: new Spring(l.p), y: new Spring(l.p) })) : [];

  const tick = (w, dt) => {
    const sv = w.s.scroll.x, px = w.pointerX, py = w.pointerY, t = w.time;
    const rects = items.map((it) => (it.vis ? it.h.getBoundingClientRect() : null));   // lecturas primero
    items.forEach((it, n) => {
      const hr = rects[n]; if (!hr) return;
      const R = Math.max(120, it.fs * 2.2), push = it.fs * 0.2, wave = it.fs * 0.1;
      it.chars.forEach((c, i) => {
        const dx = hr.left + c.cx - px, dy = hr.top + c.cy - py, d = Math.hypot(dx, dy) || 1;
        const f = Math.pow(Math.max(0, 1 - d / R), 2) * (w.proximity > 0 || w.pointerSpeed > 0.2 ? 1 : 0.6);
        c.sx.t = (dx / d) * f * push;
        c.sy.t = (dy / d) * f * push - sv * wave * Math.sin(i * 0.55 + t * 3.2);
        c.sx.step(dt); c.sy.step(dt);
        const x = Math.abs(c.sx.x) < 0.02 ? 0 : c.sx.x, y = Math.abs(c.sy.x) < 0.02 ? 0 : c.sy.x;
        const sk = clamp(-sv * 5 + c.sx.v * 0.01, -9, 9);
        const v = x === 0 && y === 0 && Math.abs(sk) < 0.05 ? "" : `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) skewX(${sk.toFixed(2)}deg)`;
        if (v !== c.w) { c.w = v; c.el.style.transform = v; }
      });
    });
    if (layers.length && w.sectionIndex === 0) {
      const lift = w.sectionProgress;
      layers.forEach((l) => {
        l.x.t = -w.normalizedPointerX * l.d; l.y.t = w.normalizedPointerY * l.d * 0.6 - sv * l.d * 0.5 - lift * l.d * 3;
        l.x.step(dt); l.y.step(dt);
        l.el.style.translate = `${l.x.x.toFixed(2)}px ${(-l.y.x).toFixed(2)}px`;
      });
    }
  };
  const unsub = subscribe(tick);
  return () => { unsub(); io.disconnect(); removeEventListener("resize", remeasure); };
}
