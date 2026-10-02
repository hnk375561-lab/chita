/* Entrada de la capa de movimiento. Todo vive en js/motion/ (ver docs/MOTION.md). */
import { reduceMotion } from "./motion/core.js";
import { initMotion } from "./motion/index.js";

const root = document.documentElement;
const syncMotionMode = () => {
  root.classList.toggle("m", !reduceMotion.matches);
  root.classList.toggle("cm-reduce", reduceMotion.matches);
  root.dataset.motion = reduceMotion.matches ? "reduced" : "full";
  if (reduceMotion.matches) root.classList.remove("mh");
};
syncMotionMode();
reduceMotion.addEventListener?.("change", syncMotionMode);

let dispose = () => {};
const start = () => { dispose = initMotion(); };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
window.addEventListener("pagehide", (event) => { if (!event.persisted) dispose(); }, { once: true });
