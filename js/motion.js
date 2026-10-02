import { clamp, pointerState, reduceMotion } from "./motion/core.js";
import { initSensoryState } from "./motion/sensor.js";
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
  root.dataset.motion = reduceMotion.matches ? "reduced" : "full";
};
syncMotionMode();

function init() {
  let previousX = pointerState.x;
  let previousY = pointerState.y;
  let previousTime = performance.now();
  const trackPointer = (event) => {
    const now = performance.now();
    const dt = Math.max(16, now - previousTime);
    pointerState.x = event.clientX;
    pointerState.y = event.clientY;
    pointerState.normalizedX = clamp(event.clientX / Math.max(1, innerWidth) * 2 - 1, -1, 1);
    pointerState.normalizedY = clamp(1 - event.clientY / Math.max(1, innerHeight) * 2, -1, 1);
    pointerState.velocityX += ((event.clientX - previousX) / dt * 16 - pointerState.velocityX) * .22;
    pointerState.velocityY += ((event.clientY - previousY) / dt * 16 - pointerState.velocityY) * .22;
    pointerState.speed = Math.hypot(pointerState.velocityX, pointerState.velocityY);
    pointerState.direction = Math.abs(pointerState.velocityX) + Math.abs(pointerState.velocityY) > .01 ? Math.atan2(pointerState.velocityY, pointerState.velocityX) : pointerState.direction;
    pointerState.active = true;
    previousX = event.clientX;
    previousY = event.clientY;
    previousTime = now;
  };
  document.addEventListener("pointermove", trackPointer, { passive: true });
  const cleanups = [initSensoryState(), initViewTransitions(), initReveals(), initScrollMotion(), initInteractions(), initWebGL(), initCursor(), () => document.removeEventListener("pointermove", trackPointer)];
  window.addEventListener("pagehide", () => cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup()), { once: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
reduceMotion.addEventListener?.("change", () => {
  syncMotionMode();
  window.dispatchEvent(new CustomEvent("chita:motion-mode", { detail: { reduced: reduceMotion.matches } }));
});
