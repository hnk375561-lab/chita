/* Revelados de contenido. No hay una receta única: cada familia de elementos entra con su propio gesto.
   · tarjetas de stock → máscara de foto + ascenso por fila
   · operaciones → plano inclinado que se endereza
   · reseñas → caída con perspectiva
   · precio/pago → profundidad (escala)
   · textos secundarios → ascenso suave, eyebrows con desplazamiento lateral */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qs, qsa, EASE } from "./core.js";

function batch(targets, enter, { start = "top 90%", gap = 0.1, max = 6 } = {}) {
  if (!targets.length) return;
  ScrollTrigger.batch(targets, { start, once: true, interval: gap, batchMax: max, onEnter: enter });
}

export function initReveals({ desktop }) {
  const d = desktop ? 1 : 0.55;
  let observer = null, timer = 0;

  const ctx = gsap.context(() => {
    /* Stock: la foto se destapa dentro de su marco mientras la tarjeta sube. */
    const grid = qs("#stockGrid");
    const cards = qsa(".car", grid || document);
    cards.forEach((card) => { card.dataset.mo = "1"; });
    gsap.set(cards, { opacity: 0, y: 64 * d });
    gsap.set(cards.map((c) => qs(".im", c)).filter(Boolean), { clipPath: "inset(0 0 100% 0)" });
    batch(cards, (group) => {
      gsap.to(group, { opacity: 1, y: 0, duration: 1.05, ease: EASE.expo, stagger: 0.09, clearProps: "opacity,transform" });
      group.forEach((card, i) => {
        const frame = qs(".im", card);
        if (frame) gsap.to(frame, { clipPath: "inset(0 0 0% 0)", duration: 1.15, ease: EASE.mask, delay: i * 0.09, clearProps: "clipPath" });
      });
    }, { start: "top 92%", gap: 0.08, max: 4 });

    /* Filtros/orden del stock vuelven a pintar la grilla: las tarjetas nuevas entran en cascada corta. */
    if (grid) {
      observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const fresh = qsa(".car:not([data-mo])", grid);
          if (!fresh.length) return;
          fresh.forEach((card) => { card.dataset.mo = "1"; });
          ctx.add(() => gsap.fromTo(fresh, { opacity: 0, y: 26 * d }, { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft, stagger: 0.045, clearProps: "opacity,transform" }));
          ScrollTrigger.refresh();
        }, 60);
      });
      observer.observe(grid, { childList: true });
    }

    /* Vender / permutar: plano inclinado que se endereza. */
    const ops = qsa("#operaciones .oc");
    gsap.set(ops, { opacity: 0, y: 54 * d, rotationX: desktop ? 14 : 0, transformPerspective: 900, transformOrigin: "50% 100%" });
    batch(ops, (g) => gsap.to(g, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: EASE.expo, stagger: 0.12, clearProps: "opacity,transform" }));

    /* Reseñas: caída con perspectiva desde arriba. */
    const reviews = qsa("#opiniones .rvc");
    gsap.set(reviews, { opacity: 0, y: -26 * d, rotationX: desktop ? -16 : 0, transformPerspective: 900, transformOrigin: "50% 0%" });
    batch(reviews, (g) => gsap.to(g, { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power4.out", stagger: 0.12, clearProps: "opacity,transform" }), { start: "top 92%" });

    /* Precio y pago: profundidad (vienen "desde atrás"). */
    const pay = qsa("#financiacion .pdc");
    gsap.set(pay, { opacity: 0, scale: 0.9, y: 30 * d, transformOrigin: "50% 60%" });
    batch(pay, (g) => gsap.to(g, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.14, clearProps: "opacity,transform" }));

    /* Cómo trabajamos: pasos que se suceden de izquierda a derecha. */
    const steps = qsa("#historia .hwl li");
    gsap.set(steps, { opacity: 0, y: 28 * d });
    batch(steps, (g) => gsap.to(g, { opacity: 1, y: 0, duration: 0.9, ease: EASE.soft, stagger: 0.16, clearProps: "opacity,transform" }), { start: "top 88%", max: 4 });

    /* Textos secundarios: ascenso suave; los eyebrows entran de costado para no repetir el gesto. */
    const eyebrows = qsa("main section :is(.ey, .pde, .pdt, .xk)");
    gsap.set(eyebrows, { opacity: 0, x: -16 * d });
    batch(eyebrows, (g) => gsap.to(g, { opacity: 1, x: 0, duration: 0.8, ease: EASE.soft, stagger: 0.08, clearProps: "opacity,transform" }), { start: "top 94%" });

    const body = qsa("main section :is(.sub, .pdl > p, .mdt, .oh > p, .rvh > p, .eqh > p, .hwh > p, .pdr)").filter((el) => !el.closest(".hero"));
    gsap.set(body, { opacity: 0, y: 24 * d });
    batch(body, (g) => gsap.to(g, { opacity: 1, y: 0, duration: 0.9, ease: EASE.soft, stagger: 0.07, clearProps: "opacity,transform" }), { start: "top 92%" });

    /* Pie: sube y se asienta. */
    const foot = qs("footer > .w");
    if (foot) {
      gsap.set(foot, { opacity: 0, y: 60 * d });
      ScrollTrigger.create({ trigger: foot, start: "top 96%", once: true, onEnter: () => gsap.to(foot, { opacity: 1, y: 0, duration: 1.1, ease: EASE.expo, clearProps: "opacity,transform" }) });
    }
  });

  return () => { clearTimeout(timer); observer?.disconnect(); ctx.revert(); };
}
