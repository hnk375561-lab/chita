import { animate, motion, reduceMotion, finePointer, qsa, stopAnimation, clamp } from "./core.js";

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

  const hero = document.querySelector(".hero");
  if (hero && finePointer.matches && !reduceMotion.matches) {
    const tx = hero.querySelector(".tx");
    const figure = hero.querySelector("figure");
    const move = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5);
      const y = clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5);
      hero.style.setProperty("--pointer-x", x.toFixed(3));
      hero.style.setProperty("--pointer-y", y.toFixed(3));
      tx?.style.setProperty("--pointer-depth", `${(x * 10).toFixed(2)}px`);
      figure?.style.setProperty("--pointer-depth", `${(x * -7).toFixed(2)}px`);
    };
    const leave = () => { hero.style.setProperty("--pointer-x", "0"); hero.style.setProperty("--pointer-y", "0"); };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave, { passive: true });
    cleanups.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); });
  }

  if (finePointer.matches && !reduceMotion.matches) {
    const magnetic = qsa("[data-magnetic], .hero .btn.p, .fin .btn.p, header .btn.p");
    magnetic.forEach((element) => {
      const move = (event) => {
        const rect = element.getBoundingClientRect();
        const strength = element.matches(".hero .btn.p") ? .14 : .1;
        animate(element, { x: (event.clientX - rect.left - rect.width / 2) * strength, y: (event.clientY - rect.top - rect.height / 2) * strength }, { duration: .28, ease: "easeOut" });
      };
      const leave = () => { stopAnimation(element); animate(element, { x: 0, y: 0 }, { ...motion.spring.soft }); };
      element.addEventListener("pointermove", move, { passive: true });
      element.addEventListener("pointerleave", leave, { passive: true });
      cleanups.push(() => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); });
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
