import { clamp, pointerState, reduceMotion, qsa } from "./core.js";

export const sensoryState = {
  pointerX: pointerState.x,
  pointerY: pointerState.y,
  pointerVelocity: 0,
  pointerDirection: 0,
  scrollY: window.scrollY,
  scrollVelocity: 0,
  scrollDirection: 1,
  viewportProgress: 0,
  activeSection: "top",
  hoverTarget: null,
  interactionTarget: null,
  proximity: 0,
  interactionIntensity: 0,
  deviceCapability: "touch" in window ? "touch" : "pointer"
};

const root = document.documentElement;
let frame = 0;
let last = performance.now();
let lastScrollY = window.scrollY;
let lastPointer = { x: pointerState.x, y: pointerState.y };
let currentSection = null;
let interactiveCandidates = [];

const write = (key, value) => {
  sensoryState[key] = value;
  root.style.setProperty(`--sensor-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, String(value));
};

function distanceTo(element, x, y) {
  const rect = element.getBoundingClientRect();
  const cx = clamp(x, rect.left, rect.right);
  const cy = clamp(y, rect.top, rect.bottom);
  return Math.hypot(x - cx, y - cy);
}

function nearestInteractive() {
  const x = sensoryState.pointerX;
  const y = sensoryState.pointerY;
  const candidates = interactiveCandidates;
  let nearest = null;
  let nearestDistance = Infinity;
  candidates.forEach((element) => {
    if (element.hidden) return;
    const distance = distanceTo(element, x, y);
    if (distance < nearestDistance) {
      nearest = element;
      nearestDistance = distance;
    }
  });
  const radius = sensoryState.deviceCapability === "touch" ? 0 : 220;
  const proximity = radius ? clamp(1 - nearestDistance / radius, 0, 1) : 0;
  return { nearest, proximity };
}

function update(now) {
  frame = 0;
  if (document.hidden) return;
  const dt = Math.max(16, now - last);
  const pointerDelta = Math.hypot(sensoryState.pointerX - lastPointer.x, sensoryState.pointerY - lastPointer.y);
  const pointerSpeed = clamp(pointerDelta / dt * 16, 0, 3);
  const scrollDelta = sensoryState.scrollY - lastScrollY;
  const rawScrollVelocity = scrollDelta / dt * 16;
  sensoryState.pointerVelocity += (pointerSpeed - sensoryState.pointerVelocity) * .16;
  sensoryState.scrollVelocity += (rawScrollVelocity - sensoryState.scrollVelocity) * .14;
  sensoryState.interactionIntensity += (Math.max(sensoryState.pointerVelocity / 2.2, Math.abs(sensoryState.scrollVelocity) / 3) - sensoryState.interactionIntensity) * .12;
  const { nearest, proximity } = nearestInteractive();
  sensoryState.proximity += (proximity - sensoryState.proximity) * .2;
  sensoryState.hoverTarget = nearest;
  sensoryState.interactionTarget = nearest?.matches(".car, .oc, .pdc, [data-sensory]") ? nearest : null;
  sensoryState.pointerDirection = pointerDelta > .3 ? Math.atan2(sensoryState.pointerY - lastPointer.y, sensoryState.pointerX - lastPointer.x) : sensoryState.pointerDirection;
  write("pointerVelocity", sensoryState.pointerVelocity.toFixed(4));
  write("pointerDirection", sensoryState.pointerDirection.toFixed(4));
  write("scrollVelocity", sensoryState.scrollVelocity.toFixed(4));
  write("scrollDirection", sensoryState.scrollDirection);
  write("proximity", sensoryState.proximity.toFixed(4));
  write("interactionIntensity", sensoryState.interactionIntensity.toFixed(4));
  if (nearest) nearest.style.setProperty("--local-proximity", sensoryState.proximity.toFixed(4));
  lastPointer = { x: sensoryState.pointerX, y: sensoryState.pointerY };
  lastScrollY = sensoryState.scrollY;
  last = now;
}

function requestUpdate() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(update);
}

export function initSensoryState() {
  if (reduceMotion.matches) {
    write("proximity", 0);
    return () => {};
  }
  const pointer = (event) => {
    sensoryState.pointerX = event.clientX;
    sensoryState.pointerY = event.clientY;
    pointerState.x = event.clientX;
    pointerState.y = event.clientY;
    pointerState.normalizedX = clamp(event.clientX / Math.max(1, innerWidth) * 2 - 1, -1, 1);
    pointerState.normalizedY = clamp(1 - event.clientY / Math.max(1, innerHeight) * 2, -1, 1);
    requestUpdate();
  };
  const scroll = () => {
    const doc = document.documentElement;
    sensoryState.scrollY = window.scrollY;
    sensoryState.scrollDirection = sensoryState.scrollY >= lastScrollY ? 1 : -1;
    sensoryState.viewportProgress = clamp(window.scrollY / Math.max(1, doc.scrollHeight - innerHeight), 0, 1);
    requestUpdate();
  };
  const sections = qsa("main > section, .hero, footer");
  interactiveCandidates = qsa("[data-sensory], .car, .oc, .pdc, .btn, nav a, .hero figure");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= (currentSection ? .2 : .05)) {
        currentSection = entry.target;
        sensoryState.activeSection = entry.target.id || entry.target.dataset.section || entry.target.tagName.toLowerCase();
        write("activeSection", sensoryState.activeSection);
        root.dataset.activeSection = sensoryState.activeSection;
      }
    });
  }, { threshold: [.05, .2, .55], rootMargin: "-12% 0px -35%" });
  sections.forEach((section) => observer.observe(section));
  document.addEventListener("pointermove", pointer, { passive: true });
  window.addEventListener("scroll", scroll, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  document.addEventListener("visibilitychange", requestUpdate, { passive: true });
  scroll();
  requestUpdate();
  return () => {
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener("pointermove", pointer);
    window.removeEventListener("scroll", scroll);
    window.removeEventListener("resize", requestUpdate);
    document.removeEventListener("visibilitychange", requestUpdate);
  };
}

window.chitaSensory = sensoryState;
