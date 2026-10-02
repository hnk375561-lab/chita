import { animate, scroll, reduceMotion, qs, clamp } from "./core.js";

const supportsScrollTimeline = CSS.supports("animation-timeline: scroll(root block)");
const supportsViewTimeline = CSS.supports("animation-timeline: view()");

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
  if (hero && heroMedia && !supportsViewTimeline) {
    const animation = animate(heroMedia, { scale: [1, 1.08], y: [0, 5], opacity: [1, 0.55] }, { ease: "linear" });
    cleanups.push(scroll(animation, { target: hero, offset: ["start start", "end start"] }));
  }

  const parallax = qs("#nph img");
  if (parallax && !supportsViewTimeline) {
    const animation = animate(parallax, { scale: [1.12, 1.12], y: ["-4%", "4%"] }, { ease: "linear" });
    cleanups.push(scroll(animation, { target: qs("#nph") || parallax, offset: ["start end", "end start"] }));
  }

  let raf = 0;
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let velocity = 0;
  const update = (time) => {
    raf = 0;
    if (document.hidden) return;
    const y = window.scrollY;
    const dt = Math.max(16, time - lastTime);
    const rawVelocity = (y - lastY) / dt * 16;
    velocity += (rawVelocity - velocity) * .16;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    doc.style.setProperty("--scroll-progress", String(clamp(y / max, 0, 1)));
    doc.style.setProperty("--scroll-velocity", String(clamp(velocity, -3, 3)));
    doc.style.setProperty("--scroll-direction", y >= lastY ? "1" : "-1");
    lastY = y;
    lastTime = time;
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
  });
  onScroll();
  return () => cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup());
}
