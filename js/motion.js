import { reduceMotion } from "./motion/core.js";
import { initReveals } from "./motion/reveal.js";
import { initScrollMotion } from "./motion/scroll.js";
import { initInteractions } from "./motion/interactions.js";
import { initViewTransitions } from "./motion/transitions.js";
import { initWebGL } from "./motion/webgl.js";
import { initCursor } from "./motion/cursor.js";

const root = document.documentElement;
const syncMotionMode = () => {
  root.classList.toggle("m", !reduceMotion.matches);
  root.classList.toggle("cm-reduce", reduceMotion.matches);
};
syncMotionMode();

function init() {
  const cleanups = [initViewTransitions(), initReveals(), initScrollMotion(), initInteractions(), initWebGL(), initCursor()];
  window.addEventListener("pagehide", () => cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup()), { once: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();

reduceMotion.addEventListener?.("change", () => {
  syncMotionMode();
  window.dispatchEvent(new CustomEvent("chita:motion-mode", { detail: { reduced: reduceMotion.matches } }));
});
