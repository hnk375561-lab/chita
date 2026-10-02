import { animate, motion, reduceMotion, finePointer, pointerState, qsa, clamp } from "./core.js";
import { sensoryState } from "./sensor.js";

const magneticSelector = "[data-magnetic], .hero .btn.p, .fin .btn.p, header .btn.p";
const depthSelector = ".car, .oc, .pdc, .rvc, .hero figure";

export function initInteractions() {
  const cleanups = [];
  const press = (event) => {
    const target = event.target.closest("button, .btn, [data-fx~='press']");
    if (!target || target.disabled || reduceMotion.matches) return;
    const controls = animate(target, { scale: 0.965 }, { duration: motion.duration.instant, ease: "easeOut" });
    const release = () => {
      controls.stop();
      animate(target, { scale: 1 }, { ...motion.spring.tactile });
      ["pointerup", "pointercancel", "blur"].forEach((type) => target.removeEventListener(type, release));
    };
    ["pointerup", "pointercancel", "blur"].forEach((type) => target.addEventListener(type, release, { once: true }));
  };
  document.addEventListener("pointerdown", press, true);
  cleanups.push(() => document.removeEventListener("pointerdown", press, true));

  if (finePointer.matches && !reduceMotion.matches) {
    const magnetic = qsa(magneticSelector);
    const depthElements = qsa(depthSelector);
    let raf = 0;
    const fieldRadius = 190;
    const renderField = () => {
      raf = 0;
      const x = pointerState.x;
      const y = pointerState.y;
      magnetic.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const dx = x - (rect.left + rect.width / 2);
        const dy = y - (rect.top + rect.height / 2);
        const falloff = clamp(1 - Math.hypot(dx, dy) / fieldRadius, 0, 1);
        const strength = element.matches(".hero .btn.p") ? .15 : .09;
        element.style.setProperty("--mx", `${(dx * strength * falloff).toFixed(2)}px`);
        element.style.setProperty("--my", `${(dy * strength * falloff).toFixed(2)}px`);
      });
      depthElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distanceX = x - (rect.left + rect.width / 2);
        const distanceY = y - (rect.top + rect.height / 2);
        const local = clamp(1 - Math.hypot(distanceX, distanceY) / 360, 0, 1);
        const tilt = element.matches(".hero figure") ? 2.4 : 1.7;
        element.style.setProperty("--tilt-x", `${(distanceY * -tilt * local / 100).toFixed(2)}deg`);
        element.style.setProperty("--tilt-y", `${(distanceX * tilt * local / 100).toFixed(2)}deg`);
        element.style.setProperty("--depth-proximity", local.toFixed(3));
      });
    };
    const move = () => { if (!raf) raf = requestAnimationFrame(renderField); };
    const leave = () => {
      magnetic.forEach((element) => { element.style.setProperty("--mx", "0px"); element.style.setProperty("--my", "0px"); });
      depthElements.forEach((element) => { element.style.setProperty("--tilt-x", "0deg"); element.style.setProperty("--tilt-y", "0deg"); element.style.setProperty("--depth-proximity", "0"); });
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave, { passive: true });
    cleanups.push(() => { if (raf) cancelAnimationFrame(raf); document.removeEventListener("pointermove", move); document.documentElement.removeEventListener("mouseleave", leave); });
  }

  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion.matches) {
    const move = (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-pointer-x", clamp((event.clientX - rect.left) / rect.width, 0, 1).toFixed(3));
      hero.style.setProperty("--hero-pointer-y", clamp((event.clientY - rect.top) / rect.height, 0, 1).toFixed(3));
      hero.style.setProperty("--hero-depth-x", `${((event.clientX - rect.left) / rect.width - .5) * 28}px`);
      hero.style.setProperty("--hero-depth-y", `${((event.clientY - rect.top) / rect.height - .5) * 18}px`);
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", () => { hero.style.setProperty("--hero-pointer-x", ".5"); hero.style.setProperty("--hero-pointer-y", ".5"); hero.style.setProperty("--hero-depth-x", "0px"); hero.style.setProperty("--hero-depth-y", "0px"); }, { passive: true });
    cleanups.push(() => hero.removeEventListener("pointermove", move));
  }
  window.chitaMotionInteractions = { sensoryState };
  return () => cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup());
}
