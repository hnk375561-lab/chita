/* Punto de entrada único de la capa de movimiento: GSAP (motor) + ScrollTrigger (narrativa) + Lenis (scroll).
   gsap.matchMedia() decide qué corre en cada contexto y revierte todo solo cuando la condición cambia:
   reduced-motion → nada se oculta ni se mueve; mobile → versión liviana, scroll nativo; desktop+mouse → completo. */
import { gsap, ScrollTrigger } from "./vendor.js";
import { MQ, qs } from "./core.js";
import { initScroll } from "./scroll.js";
import { initNavigation } from "./navigation.js";
import { initHero } from "./hero.js";
import { initTypography } from "./typography.js";
import { initReveals } from "./reveals.js";
import { initParallax } from "./parallax.js";
import { initSections } from "./sections.js";
import { initInteractions } from "./interactions.js";
import { initCursor } from "./cursor.js";

export function initMotion() {
  const root = document.documentElement;
  const mm = gsap.matchMedia();

  mm.add(MQ, (context) => {
    const { motion, desktop, fine } = context.conditions;
    if (!motion) { root.classList.remove("mh"); return undefined; }      // reduced-motion: contenido intacto
    const flags = { desktop, fine };
    const home = !!(qs(".hero") && qs("#unidades"));                     // la coreografía narrativa es de la home

    /* Orden = orden de la página (ScrollTrigger mide los pines en secuencia). */
    const cleanups = [
      initScroll(flags),
      initNavigation(flags),
      home ? initHero(flags) : null,
      home ? initSections(flags) : null,
      home ? initTypography(flags) : null,
      home ? initReveals(flags) : null,
      home ? initParallax(flags) : null,
      initInteractions(flags),
      fine && desktop ? initCursor() : null
    ];
    ScrollTrigger.sort();

    /* Layout tardío (fuentes, imágenes lazy, iframe del mapa): un refresh agrupado, no uno por evento. */
    let refreshTimer = 0;
    const refresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120); };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => { clearTimeout(refreshTimer); window.removeEventListener("load", refresh); cleanups.reverse().forEach((fn) => typeof fn === "function" && fn()); };
  });

  /* bfcache: al volver con "atrás" se recalculan las posiciones. */
  const onShow = (event) => { if (event.persisted) ScrollTrigger.refresh(); };
  window.addEventListener("pageshow", onShow);

  return () => { window.removeEventListener("pageshow", onShow); mm.revert(); };
}
