/* Cambio de diapositiva con cortina de máscara. Lo usan el hero (chita:hero) y "Vender o permutar" (chita:vr).
   El sitio solo alterna la clase .on y avisa por evento; acá vive toda la coreografía. */
import { gsap } from "./vendor.js";
import { qs, qsa, EASE } from "./core.js";

export function bindSlides({ event, frame, slide, ctx, axis = "x", extra }) {
  if (!frame) return () => {};
  let swap = null;
  const onChange = (e) => {
    const { from, to, dir = 1 } = e.detail || {};
    const slides = qsa(slide, frame);
    const next = slides[to] || qs(`${slide}.on`, frame), prev = slides[from];
    if (!next) return;
    ctx.add(() => {
      swap?.progress(1).kill();
      frame.classList.add("mo-swap");              // anula la transición CSS de opacidad mientras corre la cortina
      const img = qs("img", next);
      const hidden = axis === "x" ? (dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)") : (dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)");
      if (prev) gsap.set(prev, { autoAlpha: 1, zIndex: 1 });
      gsap.set(next, { zIndex: 2, autoAlpha: 1, clipPath: hidden });
      swap = gsap.timeline({
        onComplete: () => {
          if (prev) gsap.set(prev, { clearProps: "opacity,visibility,zIndex" });
          gsap.set(next, { clearProps: "opacity,visibility,zIndex,clipPath" });
          requestAnimationFrame(() => frame.classList.remove("mo-swap"));
        }
      });
      swap.to(next, { clipPath: "inset(0 0 0 0)", duration: 1.05, ease: EASE.mask }, 0);
      if (img) swap.fromTo(img, { scale: 1.26, xPercent: axis === "x" ? dir * 3 : 0, yPercent: axis === "y" ? dir * 3 : 0 }, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.6, ease: EASE.expo }, 0);
      extra?.(swap, { next, prev, dir });
    });
  };
  document.addEventListener(event, onChange);
  return () => { document.removeEventListener(event, onChange); swap?.kill(); frame.classList.remove("mo-swap"); };
}
