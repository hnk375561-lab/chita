import { animate, inView, scroll, animateView, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.0.0/+esm";

export const motion = {
  duration: { fast: 0.2, base: 0.55, slow: 0.9 },
  ease: { standard: "easeOut", emphasis: "easeInOut", enter: "circOut", exit: "easeIn" },
  spring: { soft: { type: "spring", stiffness: 260, damping: 28 }, responsive: { type: "spring", stiffness: 420, damping: 34 } },
  distance: { short: 12, base: 28, long: 56 },
  stagger: { base: 0.06, tight: 0.035 },
  opacity: { hidden: 0, soft: 0.35, visible: 1 },
  scale: { enter: 0.96, photo: 1.06, visible: 1 }
};

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
export const canAnimate = () => !reduceMotion.matches && !document.hidden;

export function play(target, keyframes, options = {}) {
  if (!target || reduceMotion.matches) return { stop() {} };
  const controls = animate(target, keyframes, { duration: motion.duration.base, ease: motion.ease.standard, ...options });
  return controls;
}

export function reveal(target, options = {}) {
  if (!target) return () => {};
  const element = typeof target === "string" ? qs(target) : target;
  if (!element) return () => {};
  if (reduceMotion.matches) {
    element.removeAttribute("data-motion-pending");
    return () => {};
  }
  element.setAttribute("data-motion-pending", "true");
  return inView(element, () => {
    element.removeAttribute("data-motion-pending");
    const controls = play(element, { opacity: [0, 1], y: [options.y ?? motion.distance.base, 0] }, { duration: options.duration ?? motion.duration.base, delay: options.delay ?? 0 });
    return () => controls.stop();
  }, { amount: options.amount ?? 0.18, once: options.once ?? true });
}

export function transition(update, selectors = []) {
  if (typeof update !== "function") return;
  if (typeof animateView === "function" && document.startViewTransition) {
    const view = animateView(update);
    selectors.forEach((selector) => view.add(selector));
    return view;
  }
  update();
}

export function stopAnimation(target) {
  if (target && typeof target.getAnimations === "function") target.getAnimations().forEach((animation) => animation.cancel());
}

export { animate, inView, scroll, animateView, stagger };

window.chitaMotion = { animate, inView, scroll, animateView, stagger, motion, reduceMotion, transition, stopAnimation };
