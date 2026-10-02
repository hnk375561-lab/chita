/* Coreografía por sección: los momentos que le dan ritmo a la página.
   Ritmo: HERO (impacto) → stock (contenido) → Comparar (profundidad) → Nosotros (máscara)
   → Local (marco que se abre) → … → BANNER (pin: la escena se arma con el scroll) → pasos → CTA.
   Cada sección usa un gesto distinto; el contraste es lo que hace importantes a los importantes. */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qs, qsa, EASE } from "./core.js";
import { split } from "./typography.js";
import { bindSlides } from "./slides.js";

const scrub = (trigger, start, end) => ({ trigger, start, end, scrub: true });

export function initSections({ desktop }) {
  const off = [];
  const ctx = gsap.context(() => {});
  ctx.add(() => {
    /* ── MOMENTO FIRMA · Banner pineado ───────────────────────────────────────────
       El único pin del sitio. El usuario "arma" la escena con el scroll: marca, letras del título,
       bajada y CTA aparecen en secuencia. Se crea primero para que ScrollTrigger mida el resto con su spacer. */
    const banner = qs("#bd");
    if (banner) {
      const title = qs("h2", banner);
      const letters = split(title, { chars: true });
      const eyebrow = qs(".bdk", banner), brand = qs(".bde", banner), lead = qs(".bdp", banner);
      const rest = [qs(".btn", banner), qs(".bdf", banner)].filter(Boolean);
      gsap.set([eyebrow, brand, lead, ...rest], { opacity: 0, y: 30 });
      gsap.set(letters, { yPercent: 112, opacity: 0 });
      if (desktop) {
        gsap.timeline({
          defaults: { ease: EASE.linear },
          scrollTrigger: { trigger: banner, start: "center center", end: "+=85%", pin: true, scrub: true, anticipatePin: 1, refreshPriority: 10 }
        })
          .to(brand, { opacity: 1, y: 0, duration: 0.6 }, 0)
          .to(letters, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.035 }, 0.25)
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.9)
          .to(lead, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
          .to(rest, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, 1.45)
          .to({}, { duration: 0.4 });
      } else {
        ScrollTrigger.create({
          trigger: banner, start: "top 70%", once: true,
          onEnter: () => gsap.timeline()
            .to(brand, { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft }, 0)
            .to(letters, { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE.expo, stagger: 0.02 }, 0.15)
            .to([eyebrow, lead, ...rest], { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft, stagger: 0.12 }, 0.5)
        });
      }
    }

    /* Comparar (oscura): el contenido llega desde atrás, con escala, para separarse de la sección anterior. */
    const versus = qs("#versus > .w");
    if (versus) gsap.fromTo(versus, { y: desktop ? 90 : 40, scale: desktop ? 0.94 : 0.98, transformOrigin: "50% 0%" }, { y: 0, scale: 1, ease: EASE.linear, scrollTrigger: scrub("#versus", "top 100%", "top 30%") });

    /* Quiénes somos: las tres líneas (Usados / Permutas / Consignaciones) se destapan con un wipe controlado por el scroll. */
    qsa("#nosotros .pl > div").forEach((row) => {
      gsap.fromTo(row, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: EASE.linear, scrollTrigger: scrub(row, "top 94%", "top 70%") });
    });

    /* ── MOMENTO FIRMA · Recorrido del local ──────────────────────────────────────
       El video llega como una ventana chica y se abre hasta llenar su marco. */
    const tour = qs("#local .vl:has(video)") || qsa("#local .vl")[0];
    if (tour) {
      const inner = qs(".vin", tour);
      gsap.fromTo(tour, { clipPath: "inset(12% 10% 12% 10% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: EASE.linear, scrollTrigger: scrub(tour, "top 96%", "top 28%") });
      if (inner) gsap.fromTo(inner, { scale: 1.16 }, { scale: 1, ease: EASE.linear, scrollTrigger: scrub(tour, "top 96%", "top 28%") });
    }
    const hints = qsa("#local .vsn li");
    gsap.set(hints, { opacity: 0, x: 26 });
    if (hints.length) ScrollTrigger.create({ trigger: hints[0], start: "top 92%", once: true, onEnter: () => gsap.to(hints, { opacity: 1, x: 0, duration: 0.9, ease: EASE.soft, stagger: 0.1, clearProps: "opacity,transform" }) });

    /* Cómo comprar: los pasos se "encienden" uno a uno según el avance (lectura guiada). */
    qsa("#como-comprar .stp li").forEach((step) => {
      gsap.fromTo(step, { opacity: 0.22, x: desktop ? -34 : -14 }, { opacity: 1, x: 0, ease: EASE.linear, scrollTrigger: scrub(step, "top 90%", "top 58%") });
    });

    /* Vender / permutar: cambio de unidad con cortina vertical (distinta a la lateral del hero). */
    const vr = qs("#vr");
    if (vr) off.push(bindSlides({ event: "chita:vr", frame: vr, slide: ".vrz", ctx, axis: "y" }));

    /* Cierre: el formulario de visita sube y se asienta. */
    const form = qs("#visitaForm");
    if (form) {
      gsap.set(form, { opacity: 0, y: 56, scale: 0.97, transformOrigin: "50% 100%" });
      ScrollTrigger.create({ trigger: form, start: "top 90%", once: true, onEnter: () => gsap.to(form, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: EASE.expo, clearProps: "opacity,transform" }) });
    }
  });
  return () => { off.forEach((fn) => fn()); ctx.revert(); };
}
