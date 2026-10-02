/* HERO — momento firma #1. Entrada con secuencia propia, salida con capas a distinta velocidad,
   profundidad por puntero (solo mouse) y cambio de unidad con cortina de máscara. */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qs, qsa, EASE } from "./core.js";
import { split } from "./typography.js";
import { bindSlides } from "./slides.js";

let played = false;   // la entrada cinematográfica corre una sola vez por carga

export function initHero({ desktop, fine }) {
  const hero = qs(".hero");
  const root = document.documentElement;
  if (!hero) { root.classList.remove("mh"); return () => {}; }

  const logo = qs(".hlogo", hero), eyebrow = qs(".h1n", hero), title = qs("h1", hero);
  const lead = qs(".tx > p", hero), actions = qs(".row", hero), link = qs(".lk", hero);
  const frame = qs(".hv", hero), stage = qs(".hzs", hero), caption = qs(".hcap", hero), cta = qs(".ha", hero);
  const headerItems = qsa("header .w > *");
  const words = split(title, { skip: ".h1n" });
  const off = [];

  const ctx = gsap.context(() => {});
  ctx.add(() => {
    const settle = desktop ? 1.1 : 1.06;
    if (!played) {
      played = true;
      /* Estado inicial (el CSS lo mantiene oculto con .mh hasta este punto). */
      gsap.set(headerItems, { yPercent: -120, opacity: 0 });
      gsap.set(logo, { clipPath: "inset(0 100% 0 0)", x: -26 });
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(words, { yPercent: 118, rotate: 4, transformOrigin: "0% 100%" });
      gsap.set([lead, link], { opacity: 0, y: 22 });
      gsap.set(actions ? [...actions.children] : [], { opacity: 0, y: 18 });
      gsap.set(frame, { clipPath: desktop ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)" });
      gsap.set(stage, { scale: desktop ? 1.42 : 1.25, transformOrigin: "50% 50%" });
      gsap.set(caption, { opacity: 0, y: 14 });
      gsap.set(cta ? [...cta.children] : [], { opacity: 0, y: 14 });
      root.classList.remove("mh");

      const intro = gsap.timeline({ defaults: { ease: EASE.soft }, onComplete: () => ScrollTrigger.refresh() });
      intro
        .to(headerItems, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: EASE.expo }, 0)
        .to(frame, { clipPath: "inset(0 0 0 0%)", duration: 1.5, ease: EASE.mask }, 0.05)
        .to(stage, { scale: settle, duration: 2.1, ease: EASE.expo }, 0.05)
        .to(logo, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 1, ease: EASE.expo }, 0.4)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.62)
        .to(words, { yPercent: 0, rotate: 0, duration: 1.05, ease: EASE.expo, stagger: 0.055 }, 0.68)
        .to(lead, { opacity: 1, y: 0, duration: 0.9 }, 1.05)
        .to(actions ? [...actions.children] : [], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.2)
        .to(link, { opacity: 1, y: 0, duration: 0.8 }, 1.45)
        .to(caption, { opacity: 1, y: 0, duration: 0.8 }, 1.3)
        .to(cta ? [...cta.children] : [], { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 1.45);
    } else {
      gsap.set(stage, { scale: settle });
      root.classList.remove("mh");
    }

    /* Salida: capas con distinta "masa". Texto sale rápido, imagen lenta, para separar planos. */
    const exit = gsap.timeline({
      defaults: { ease: EASE.linear },
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
    const k = desktop ? 1 : 0.5;
    exit
      .to(logo, { yPercent: -34 * k, opacity: 0.2 }, 0)
      .to(title, { yPercent: -22 * k }, 0)
      .to(lead, { yPercent: -48 * k, opacity: 0.1 }, 0)
      .to(actions || [], { yPercent: -60 * k, opacity: 0 }, 0)
      .to(stage, { yPercent: 9 * k }, 0)
      .to(caption, { yPercent: -40 * k }, 0);

    /* Profundidad por puntero: solo mouse; quickTo → un tween por propiedad, cero rects por frame. */
    if (fine && desktop) {
      const sx = gsap.quickTo(stage, "x", { duration: 1.1, ease: "power3.out" });
      const sy = gsap.quickTo(stage, "y", { duration: 1.1, ease: "power3.out" });
      const tx = gsap.quickTo(title, "x", { duration: 1.4, ease: "power3.out" });
      const ty = gsap.quickTo(title, "y", { duration: 1.4, ease: "power3.out" });
      const move = (event) => {
        const nx = event.clientX / innerWidth - 0.5, ny = event.clientY / innerHeight - 0.5;
        sx(nx * -26); sy(ny * -16); tx(nx * 9); ty(ny * 6);
      };
      const leave = () => { sx(0); sy(0); tx(0); ty(0); };
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", leave, { passive: true });
      off.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); });
    }

    /* Cambio de unidad (evento chita:hero): cortina lateral + zoom de la foto nueva. */
    off.push(bindSlides({
      event: "chita:hero", frame, slide: ".hz", ctx, axis: "x",
      extra: (tl) => { if (caption) tl.fromTo(caption, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft }, 0.35); }
    }));
  });

  return () => { off.forEach((fn) => fn()); ctx.revert(); };
}
