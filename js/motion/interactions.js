import { animate, motion, reduceMotion, finePointer, qsa, stopAnimation } from "./core.js";

export function initInteractions() {
  const cleanups = [];
  const press = (event) => {
    const target = event.target.closest("button, .btn, [data-fx~='press']");
    if (!target || target.disabled || reduceMotion.matches) return;
    const controls = animate(target, { scale: 0.96 }, { duration: motion.duration.fast, ease: "easeOut" });
    const release = () => {
      controls.stop();
      animate(target, { scale: 1 }, { duration: motion.duration.fast, ease: motion.ease.emphasis });
      ["pointerup", "pointercancel", "blur"].forEach((type) => target.removeEventListener(type, release));
    };
    ["pointerup", "pointercancel", "blur"].forEach((type) => target.addEventListener(type, release, { once: true }));
  };
  document.addEventListener("pointerdown", press, true);
  cleanups.push(() => document.removeEventListener("pointerdown", press, true));

  if (finePointer.matches && !reduceMotion.matches) {
    qsa("[data-magnetic]").forEach((element) => {
      const move = (event) => {
        const rect = element.getBoundingClientRect();
        animate(element, { x: (event.clientX - rect.left - rect.width / 2) * 0.2, y: (event.clientY - rect.top - rect.height / 2) * 0.2 }, { duration: 0.45, ease: "easeOut" });
      };
      const leave = () => { stopAnimation(element); animate(element, { x: 0, y: 0 }, { duration: 0.4, ease: motion.ease.emphasis }); };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      cleanups.push(() => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); });
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
