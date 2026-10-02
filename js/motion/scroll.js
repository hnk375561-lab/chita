/* LENIS → GSAP ticker → SCROLLTRIGGER. Un solo reloj, un solo loop.
   Touch queda nativo (syncTouch desactivado): el scroll del dedo nunca se toca. */
import { gsap, ScrollTrigger, Lenis } from "./vendor.js";
import { qs } from "./core.js";

export const scrollState = { velocity: 0, direction: 1 };

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function initScroll({ desktop }) {
  const lenis = new Lenis({
    lerp: desktop ? 0.1 : 0.14,     // inercia corta: sigue al input sin sensación de flotar
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false
  });

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const tracker = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => { scrollState.velocity = self.getVelocity(); scrollState.direction = self.direction; }
  });

  const headerOffset = () => -(qs("header")?.offsetHeight || 0);
  const to = (target, options = {}) => lenis.scrollTo(target, { duration: 1.5, easing: easeOutExpo, ...options });

  const onClick = (event) => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (hash === "#" || hash === "#top") { event.preventDefault(); to(0); history.pushState(null, "", location.pathname + location.search); return; }
    let target = null;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { /* hash inválido */ }
    if (!target) return;                      // #unidad-… y similares los resuelve el sitio
    event.preventDefault();
    to(target, { offset: headerOffset() });
    history.pushState(null, "", hash);
  };
  document.addEventListener("click", onClick);

  /* La ficha (<dialog>) bloquea el scroll de fondo y conserva el suyo. */
  const dialog = qs("dialog");
  let observer = null;
  if (dialog) {
    dialog.setAttribute("data-lenis-prevent", "");
    observer = new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start()));
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }

  /* Hash inicial (enlace compartido a una sección). */
  if (location.hash.length > 1) {
    requestAnimationFrame(() => {
      let target = null;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* noop */ }
      if (target) lenis.scrollTo(target, { offset: headerOffset(), immediate: true });
    });
  }

  window.chitaScroll = { to, lenis };

  return () => {
    document.removeEventListener("click", onClick);
    observer?.disconnect();
    tracker.kill();
    gsap.ticker.remove(tick);
    lenis.destroy();
    if (window.chitaScroll?.lenis === lenis) delete window.chitaScroll;
  };
}
