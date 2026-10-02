import { animate, inView, motion, reduceMotion, qsa } from "./core.js";

const entering = [
  [".long-intro, .route-story, .briefing-story, .passed-by, .sound-story, .behind-story, .open-auto, .journey-story, .calendar-story", { y: motion.distance.base, opacity: [motion.opacity.soft, 1] }],
  [".car, .op, .ppf, .fqs, .vdc, .linear-item", { y: motion.distance.short, opacity: [0, 1] }],
  [".hotspot", { scale: [0.72, 1], opacity: [0, 1] }]
];

function observe(selector, keyframes, options = {}) {
  qsa(selector).forEach((element, index) => {
    if (reduceMotion.matches) return;
    element.dataset.motionPending = "true";
    inView(element, () => {
      delete element.dataset.motionPending;
      const controls = animate(element, keyframes, {
        duration: options.duration ?? motion.duration.base,
        delay: (options.delay ?? 0) + index * (options.stagger ?? motion.stagger.tight),
        ease: options.ease ?? motion.ease.enter,
        ...options
      });
      return () => controls.stop();
    }, { amount: options.amount ?? 0.16, once: true });
  });
}

export function initReveals() {
  entering.forEach(([selector, keyframes]) => observe(selector, keyframes));
  qsa("img[loading='lazy']").forEach((image) => { image.decoding = "async"; });
}
