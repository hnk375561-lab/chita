/* Header y navegación: sombra al scrollear, ocultamiento por dirección (mobile, donde el CSS lo contempla)
   y scrollspy del menú. Todo por ScrollTrigger: cero listeners de scroll propios. */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qs, qsa } from "./core.js";

export function initNavigation({ desktop }) {
  const header = qs("header");
  if (!header) return () => {};
  const ctx = gsap.context(() => {
    ScrollTrigger.create({ start: 8, end: "max", onToggle: (self) => header.classList.toggle("s", self.isActive) });

    if (!desktop) {
      let hidden = false;
      const set = (value) => { if (value !== hidden) { hidden = value; header.classList.toggle("h", value); } };
      ScrollTrigger.create({ start: 180, end: "max", onUpdate: (self) => set(self.direction === 1), onLeaveBack: () => set(false) });
    }

    qsa('nav a[href^="#"]', header).forEach((link) => {
      const section = document.getElementById(link.getAttribute("href").slice(1));
      if (!section) return;
      ScrollTrigger.create({
        trigger: section, start: "top 46%", end: "bottom 46%",
        onToggle: (self) => (self.isActive ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current"))
      });
    });
  });
  return () => { header.classList.remove("h"); ctx.revert(); };
}
