/* Cursor del sitio (ya existía): ahora con quickTo, estados por contexto y estiramiento por velocidad.
   Solo mouse. En touch o con reduced-motion no se crea. */
import { gsap } from "./vendor.js";
import { clamp } from "./core.js";

const INTERACTIVE = "a, button, summary, select, input, textarea, [role='button'], [data-gal], .hv";
const STATES = {
  default: { scale: 0.68, label: "" },
  link: { scale: 1, label: "↗" },
  button: { scale: 1, label: "+" },
  image: { scale: 1.12, label: "+" },
  drag: { scale: 1.3, label: "↔" },
  field: { scale: 0.5, label: "" }
};

export function initCursor() {
  if (!document.body) return () => {};
  const cursor = document.createElement("div");
  cursor.className = "motion-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="motion-cursor__dot"></span><span class="motion-cursor__label"></span>';
  document.body.append(cursor);
  const dot = cursor.querySelector(".motion-cursor__dot"), label = cursor.querySelector(".motion-cursor__label");

  let visible = false, pressed = false, current = "default", lastX = 0;
  const ctx = gsap.context(() => {});
  ctx.add(() => {
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(dot, { scale: STATES.default.scale });
    const x = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3.out" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3.out" });
    const stretch = gsap.quickTo(cursor, "scaleX", { duration: 0.25, ease: "power3.out" });

    const apply = () => { const s = STATES[current]; gsap.to(dot, { scale: s.scale * (pressed ? 0.78 : 1), duration: 0.45, ease: "power3.out", overwrite: "auto" }); label.textContent = s.label; };
    const set = (name) => { if (name === current) return; current = name; apply(); cursor.dataset.state = name; };

    const move = (event) => {
      if (!visible) { visible = true; gsap.set(cursor, { x: event.clientX, y: event.clientY }); gsap.to(cursor, { opacity: 1, duration: 0.3 }); }
      x(event.clientX); y(event.clientY);
      stretch(1 + clamp(Math.abs(event.clientX - lastX) / 90, 0, 0.22)); lastX = event.clientX;   // más velocidad, más estiramiento
    };
    const over = (event) => {
      const t = event.target.closest?.(INTERACTIVE);
      if (!t) return set("default");
      if (t.matches("input, textarea, select")) return set("field");
      if (t.matches(".hv")) return set("drag");
      if (t.matches("[data-gal]")) return set("image");
      if (t.matches("button, [role='button']")) return set("button");
      set("link");
    };
    const down = () => { pressed = true; apply(); };
    const up = () => { pressed = false; apply(); };
    const leave = () => { visible = false; gsap.to(cursor, { opacity: 0, duration: 0.25 }); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave, { passive: true });
    ctx.off = () => {
      document.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down); document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  });
  return () => { ctx.off?.(); ctx.revert(); cursor.remove(); };
}
