import { animate, scroll, reduceMotion, qs } from "./core.js";

const supportsScrollTimeline = CSS.supports("animation-timeline: scroll()") || CSS.supports("animation-timeline: view()");

export function initScrollMotion() {
  if (reduceMotion.matches) return () => {};
  const cleanups = [];
  const progress = qs(".pgb");
  if (progress && !supportsScrollTimeline) {
    const animation = animate(progress, { scaleX: [0, 1] }, { ease: "linear" });
    cleanups.push(scroll(animation));
  }

  const hero = qs(".hero");
  const heroMedia = qs("#hzs");
  if (hero && heroMedia && !supportsScrollTimeline) {
    const animation = animate(heroMedia, { scale: [1, 1.08], y: [0, 5], opacity: [1, 0.55] }, { ease: "linear" });
    cleanups.push(scroll(animation, { target: hero, offset: ["start start", "end start"] }));
  }

  const parallax = qs("#nph img");
  if (parallax && !supportsScrollTimeline) {
    const animation = animate(parallax, { scale: [1.12, 1.12], y: ["-4%", "4%"] }, { ease: "linear" });
    cleanups.push(scroll(animation, { target: qs("#nph") || parallax, offset: ["start end", "end start"] }));
  }
  return () => cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup());
}
