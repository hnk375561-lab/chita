import { finePointer, reduceMotion, clamp } from "./core.js";

const interactiveSelector = "a, button, summary, select, input, textarea, [role='button'], [data-gal]";

export function initCursor() {
  if (!finePointer.matches || reduceMotion.matches || !document.body) return () => {};
  const cursor = document.createElement("div");
  cursor.className = "motion-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="motion-cursor__dot"></span><span class="motion-cursor__label"></span>';
  document.body.append(cursor);
  const dot = cursor.querySelector(".motion-cursor__dot");
  const label = cursor.querySelector(".motion-cursor__label");
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, active = false;
  const state = (name, text = "") => {
    cursor.dataset.state = name;
    label.textContent = text;
  };
  const render = () => {
    raf = 0;
    x += (tx - x) * .18;
    y += (ty - y) * .18;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (Math.abs(tx - x) > .2 || Math.abs(ty - y) > .2) raf = requestAnimationFrame(render);
  };
  const move = (event) => {
    tx = clamp(event.clientX, 0, innerWidth);
    ty = clamp(event.clientY, 0, innerHeight);
    if (!active) { active = true; cursor.classList.add("is-visible"); }
    if (!raf) raf = requestAnimationFrame(render);
  };
  const over = (event) => {
    const target = event.target.closest?.(interactiveSelector);
    if (!target) return state("default");
    if (target.matches("input, textarea, select")) return state("field", "");
    if (target.matches("[data-gal]")) return state("image", "+");
    if (target.matches("button, [role='button']")) return state("button", "+");
    state("link", "↗");
  };
  const out = (event) => { if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) state("default"); };
  const down = () => cursor.classList.add("is-pressed");
  const up = () => cursor.classList.remove("is-pressed");
  const leave = () => { active = false; cursor.classList.remove("is-visible"); };
  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerover", over, { passive: true });
  document.addEventListener("pointerout", out, { passive: true });
  document.addEventListener("pointerdown", down, { passive: true });
  document.addEventListener("pointerup", up, { passive: true });
  document.documentElement.addEventListener("mouseleave", leave, { passive: true });
  return () => {
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", over);
    document.removeEventListener("pointerout", out);
    document.removeEventListener("pointerdown", down);
    document.removeEventListener("pointerup", up);
    document.documentElement.removeEventListener("mouseleave", leave);
    cursor.remove();
  };
}
