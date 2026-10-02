/* Parallax físico y por capas. Cada plano tiene su velocidad; nada se mueve "porque sí".
   Todo es transform sobre wrappers (yPercent / scale / clip-path), nunca top/left. */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qs, qsa, clamp, EASE } from "./core.js";
import { scrollState } from "./scroll.js";

const scrub = (trigger, start, end) => ({ trigger, start, end, scrub: true });

export function initParallax({ desktop }) {
  const k = desktop ? 1 : 0.45;
  let skewDelay = null;

  const ctx = gsap.context(() => {
    /* Quiénes somos: el marco se abre (máscara) y la foto, más ancha que el marco, se desplaza dentro. */
    const frame = qs("#nph"), photo = qs("#nph img");
    if (frame && photo) {
      gsap.set(photo, { scale: 1.24, transformOrigin: "50% 50%" });
      gsap.fromTo(frame, { clipPath: "inset(14% 12% 14% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: EASE.linear, scrollTrigger: scrub(frame, "top 94%", "top 38%") });
      gsap.fromTo(photo, { yPercent: -7 * k }, { yPercent: 7 * k, ease: EASE.linear, scrollTrigger: scrub(frame, "top bottom", "bottom top") });
    }

    /* Dónde estamos: el mapa se abre como un iris. */
    const map = qs("#contacto .mp");
    if (map) gsap.fromTo(map, { clipPath: "circle(16% at 50% 62%)" }, { clipPath: "circle(78% at 50% 50%)", ease: EASE.linear, scrollTrigger: scrub(map, "top 96%", "top 38%") });

    /* Local de noche: la fachada flota detrás del marco (más lenta que el scroll). */
    qsa("#local .vc").forEach((img) => {
      gsap.set(img, { scale: 1.14 });
      gsap.fromTo(img, { yPercent: -6 * k }, { yPercent: 6 * k, ease: EASE.linear, scrollTrigger: scrub(img.closest(".vl") || img, "top bottom", "bottom top") });
    });

    /* Precio y pago: columna de texto y columna de tarjetas a distinta velocidad (solo desktop). */
    if (desktop) {
      const text = qs("#financiacion .pdl"), cards = qs("#financiacion .pdg");
      if (text) gsap.fromTo(text, { yPercent: 5 }, { yPercent: -5, ease: EASE.linear, scrollTrigger: scrub("#financiacion", "top bottom", "bottom top") });
      if (cards) gsap.fromTo(cards, { yPercent: -3 }, { yPercent: 3, ease: EASE.linear, scrollTrigger: scrub("#financiacion", "top bottom", "bottom top") });
    }

    /* Líneas verticales decorativas: se "dibujan" con el avance. */
    qsa(".xr").forEach((line) => {
      gsap.fromTo(line, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, ease: EASE.linear, scrollTrigger: scrub(line, "top 94%", "top 62%") });
    });

    /* Velocidad: el scroll rápido inclina apenas la grilla de stock; en reposo vuelve a 0. */
    const grid = qs("#stockGrid");
    if (grid && desktop) {
      const skewTo = gsap.quickTo(grid, "skewY", { duration: 0.6, ease: "power3.out" });
      skewDelay = gsap.delayedCall(0.14, () => skewTo(0)).pause();
      ScrollTrigger.create({
        trigger: grid, start: "top bottom", end: "bottom top",
        onUpdate: () => { skewTo(clamp(scrollState.velocity / -900, -1.3, 1.3)); skewDelay.restart(true); },
        onLeave: () => skewTo(0), onLeaveBack: () => skewTo(0)
      });
    }
  });

  return () => { skewDelay?.kill(); ctx.revert(); };
}
