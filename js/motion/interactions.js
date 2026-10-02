/* Microinteracciones. Delegación de eventos (las tarjetas se repintan con los filtros) y quickTo por elemento.
   Mouse: magnetismo en CTAs, inclinación en tarjetas, rebote en iconos. Touch: solo feedback de presión. */
import { gsap } from "./vendor.js";
import { qsa, clamp, EASE } from "./core.js";

const MAGNETIC = "[data-magnetic], .hero .btn.p, .bd .btn.p, .pdr .btn.p, header .btn.p, #visita button.btn.p";
const LIFT = ".car";
const TILT = ".oc, .pdc, .rvc";
const ICON = "header .ic";

export function initInteractions({ fine }) {
  const off = [];
  const on = (target, type, fn, options) => { target.addEventListener(type, fn, options); off.push(() => target.removeEventListener(type, fn, options)); };
  const ctx = gsap.context(() => {
    /* Presión: todos los botones, también en touch. */
    on(document, "pointerdown", (event) => {
      const button = event.target.closest?.("button:not(:disabled), .btn");
      if (!button) return;
      gsap.to(button, { scale: 0.965, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      const release = () => gsap.to(button, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
      ["pointerup", "pointercancel", "pointerleave"].forEach((type) => button.addEventListener(type, release, { once: true }));
    }, true);

    if (!fine) return;

    /* Magnético: el botón sigue al puntero dentro de un radio corto, con tope y retorno elástico. */
    const magnets = new WeakMap();
    const magnet = (el) => {
      if (!magnets.has(el)) magnets.set(el, { x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }), rect: null });
      return magnets.get(el);
    };
    on(document, "pointerover", (event) => {
      const el = event.target.closest?.(MAGNETIC);
      if (el) magnet(el).rect = el.getBoundingClientRect();     // se mide una vez al entrar, no por frame
    }, { passive: true });
    on(document, "pointermove", (event) => {
      const el = event.target.closest?.(MAGNETIC);
      if (!el) return;
      const m = magnet(el); if (!m.rect) m.rect = el.getBoundingClientRect();
      const dx = event.clientX - (m.rect.left + m.rect.width / 2), dy = event.clientY - (m.rect.top + m.rect.height / 2);
      m.x(clamp(dx * 0.28, -14, 14)); m.y(clamp(dy * 0.34, -10, 10));
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const el = event.target.closest?.(MAGNETIC);
      if (!el || el.contains(event.relatedTarget)) return;
      const m = magnet(el); m.rect = null; gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
    }, { passive: true });

    /* Botones no magnéticos: elevación corta (reemplaza el translateY del CSS). */
    const plain = (event) => { const b = event.target.closest?.(".btn"); return b && !b.matches(MAGNETIC) ? b : null; };
    on(document, "pointerover", (event) => { const b = plain(event); if (b && !b.contains(event.relatedTarget)) gsap.to(b, { y: -2, duration: 0.4, ease: EASE.soft, overwrite: "auto" }); }, { passive: true });
    on(document, "pointerout", (event) => { const b = plain(event); if (b && !b.contains(event.relatedTarget)) gsap.to(b, { y: 0, duration: 0.6, ease: EASE.settle, overwrite: "auto" }); }, { passive: true });

    /* Tarjetas de stock: elevación sobria. */
    on(document, "pointerover", (event) => {
      const card = event.target.closest?.(LIFT);
      if (card && !card.contains(event.relatedTarget)) gsap.to(card, { y: -8, duration: 0.6, ease: EASE.soft, overwrite: "auto" });
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const card = event.target.closest?.(LIFT);
      if (card && !card.contains(event.relatedTarget)) gsap.to(card, { y: 0, duration: 0.8, ease: EASE.settle, overwrite: "auto" });
    }, { passive: true });

    /* Operaciones / precio / reseñas: plano que se inclina hacia el puntero. */
    const tilts = new WeakMap();
    const tilt = (el) => {
      if (!tilts.has(el)) { gsap.set(el, { transformPerspective: 900 }); tilts.set(el, { rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" }), ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" }) }); }
      return tilts.get(el);
    };
    on(document, "pointermove", (event) => {
      const el = event.target.closest?.(TILT);
      if (!el) return;
      const r = el.getBoundingClientRect(), t = tilt(el);       // un solo rect: el elemento bajo el puntero
      t.ry(((event.clientX - r.left) / r.width - 0.5) * 6); t.rx(((event.clientY - r.top) / r.height - 0.5) * -5);
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const el = event.target.closest?.(TILT);
      if (!el || el.contains(event.relatedTarget)) return;
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
    }, { passive: true });

    /* Iconos del header: giro corto con rebote. */
    qsa(ICON).forEach((icon) => {
      const svg = icon.querySelector("svg"); if (!svg) return;
      icon.addEventListener("pointerenter", () => gsap.to(svg, { scale: 1.16, rotate: -8, duration: 0.5, ease: EASE.spring, overwrite: "auto" }));
      icon.addEventListener("pointerleave", () => gsap.to(svg, { scale: 1, rotate: 0, duration: 0.6, ease: EASE.settle, overwrite: "auto" }));
    });
  });
  return () => { off.forEach((fn) => fn()); ctx.revert(); };
}
