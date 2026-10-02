import { reduceMotion } from "./motion/core.js";
import { initReveals } from "./motion/reveal.js";
import { initScrollMotion } from "./motion/scroll.js";
import { initInteractions } from "./motion/interactions.js";
import { initViewTransitions } from "./motion/transitions.js";

const root = document.documentElement;
root.classList.toggle("m", !reduceMotion.matches);
root.classList.toggle("cm-reduce", reduceMotion.matches);

function init() {
  initViewTransitions();
  initReveals();
  initScrollMotion();
  initInteractions();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();

reduceMotion.addEventListener?.("change", () => location.reload());
