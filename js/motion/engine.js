/* Global Interaction Engine: un único estado coherente (cursor, scroll, sección, energía, tiempo)
   con física por clase de elemento. Todo lo demás (DOM, Motion, Three, GLSL) lee de acá. */
import { reduceMotion, clamp, pointerState } from "./core.js";
import { sensoryState } from "./sensor.js";

/* Resorte integrado en subpasos (semi-implícito): estable aun con dt grande. */
export class Spring {
  constructor(preset, value = 0) { Object.assign(this, { x: value, v: 0, t: value }, preset); }
  step(dt) {
    const n = Math.ceil(dt / 0.008), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (this.k * (this.t - this.x) - this.c * this.v) / this.m;
      this.v += a * h; this.x += this.v * h;
    }
    return this.x;
  }
  get rest() { return Math.abs(this.t - this.x) < 5e-4 && Math.abs(this.v) < 5e-4; }
}
/* Cada tipo de materia pesa distinto. */
export const PHYSICS = {
  type:     { k: 90,  c: 22, m: 1.4 },  // tipografía: pesada
  image:    { k: 55,  c: 17, m: 1.0 },  // imágenes: viscosas
  cta:      { k: 240, c: 9,  m: 0.8 },  // CTA: elástico, con overshoot
  icon:     { k: 300, c: 20, m: 0.4 },  // iconos: livianos
  particle: { k: 420, c: 30, m: 0.2 },  // partículas: muy livianas
  ground:   { k: 18,  c: 10, m: 1.2 }   // fondo: lento
};

export const world = {
  pointerX: innerWidth / 2, pointerY: innerHeight / 2,
  normalizedPointerX: 0, normalizedPointerY: 0,
  pointerVelocity: { x: 0, y: 0 }, pointerSpeed: 0, pointerDirection: 0,
  scrollY: scrollY, scrollVelocity: 0, scrollSpeed: 0, scrollDirection: 1, scrollAcceleration: 0,
  sectionProgress: 0, globalProgress: 0, sectionIndex: 0,
  hoverIntensity: 0, proximity: 0, interactionEnergy: 0, press: 0,
  viewportWidth: innerWidth, viewportHeight: innerHeight,
  time: 0, deltaTime: 0.016, reducedMotion: reduceMotion.matches,
  tier: "high", dpr: 1,
  /* señales suavizadas con resortes (lo que consumen shaders y DOM) */
  s: {
    px: new Spring(PHYSICS.image), py: new Spring(PHYSICS.image),
    scroll: new Spring({ k: 70, c: 14, m: 1 }), energy: new Spring({ k: 40, c: 12, m: 1 }),
    prox: new Spring(PHYSICS.icon), press: new Spring(PHYSICS.cta)
  }
};
window.chitaWorld = world;

/* ---------- Quality tiers ---------- */
function detectTier() {
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  const coarse = matchMedia("(pointer: coarse)").matches;
  if (reduceMotion.matches || cores <= 2 || mem <= 2) return "low";
  if (coarse || innerWidth < 900 || cores <= 4 || mem <= 4) return "medium";
  return "high";
}
const TIER_DPR = { high: 2, medium: 1.5, low: 1 };
export function setTier(t) { world.tier = t; world.dpr = Math.min(devicePixelRatio || 1, TIER_DPR[t]); document.documentElement.dataset.tier = t; }

/* ---------- Bucle único ---------- */
const subs = new Set();
let holds = 0, raf = 0, last = performance.now(), idleUntil = 0, sections = [], dirty = true;
let lastY = scrollY, lastPX = world.pointerX, lastPY = world.pointerY, hover = 0, hoverTarget = 0;
let slow = 0, frames = 0, acc = 0;
const root = document.documentElement;
const cssCache = {};
const css = (k, v) => { const s = v.toFixed(3); if (cssCache[k] !== s) { cssCache[k] = s; root.style.setProperty(k, s); } };

export function subscribe(fn) { subs.add(fn); wake(); return () => subs.delete(fn); }
/* hold() mantiene el bucle a pleno mientras una superficie WebGL es visible */
export function hold() { holds++; wake(); let done = false; return () => { if (!done) { done = true; holds--; } }; }
export function wake(ms = 1600) { idleUntil = performance.now() + ms; if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }

function measureSections() {
  sections = [...document.querySelectorAll("main > .hero, main > section")];
  dirty = false;
}

function frame(now) {
  raf = 0;
  if (document.hidden) return;
  let dt = Math.min((now - last) / 1000, 0.05); last = now;
  if (dt <= 0) dt = 0.016;
  const w = world;
  w.deltaTime = dt; w.time += dt;
  w.viewportWidth = innerWidth; w.viewportHeight = innerHeight;
  /* cursor */
  const f = dt * 60;
  w.pointerX = pointerState.x; w.pointerY = pointerState.y;
  w.normalizedPointerX = pointerState.normalizedX; w.normalizedPointerY = pointerState.normalizedY;
  const vx = (w.pointerX - lastPX) / f, vy = (w.pointerY - lastPY) / f;
  w.pointerVelocity.x += (vx - w.pointerVelocity.x) * 0.25; w.pointerVelocity.y += (vy - w.pointerVelocity.y) * 0.25;
  w.pointerSpeed = Math.hypot(w.pointerVelocity.x, w.pointerVelocity.y);
  if (w.pointerSpeed > 0.4) w.pointerDirection = Math.atan2(w.pointerVelocity.y, w.pointerVelocity.x);
  lastPX = w.pointerX; lastPY = w.pointerY;
  /* scroll como señal continua */
  const y = scrollY, raw = (y - lastY) / f;
  const prev = w.scrollVelocity;
  w.scrollVelocity += (raw - w.scrollVelocity) * 0.18;
  w.scrollAcceleration += ((w.scrollVelocity - prev) - w.scrollAcceleration) * 0.2;
  w.scrollSpeed = Math.abs(w.scrollVelocity);
  if (Math.abs(raw) > 0.5) w.scrollDirection = raw > 0 ? 1 : -1;
  if (y !== lastY) dirty = dirty || false;
  lastY = y; w.scrollY = y;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  w.globalProgress = clamp(y / max, 0, 1);
  /* sección activa y progreso dentro de ella (lecturas agrupadas, sin escrituras intercaladas) */
  if (dirty || !sections.length) measureSections();
  if (Math.abs(raw) > 0.05 || w.sectionProgress === 0 || frames % 20 === 0) {
    const mid = innerHeight * 0.5;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { w.sectionIndex = i; w.sectionProgress = clamp((mid - r.top) / Math.max(1, r.height), 0, 1); break; }
    }
  }
  /* energía de interacción, cercanía e intensidad de hover */
  w.proximity = sensoryState.proximity;
  hoverTarget = sensoryState.hoverTarget && w.proximity > 0.85 ? 1 : 0;
  hover += (hoverTarget - hover) * 0.2; w.hoverIntensity = hover;
  const impulse = Math.max(w.pointerSpeed / 38, w.scrollSpeed / 46, w.press * 0.9);
  const S = w.s;
  S.energy.t = clamp(impulse, 0, 1); w.interactionEnergy = clamp(S.energy.step(dt), 0, 1);
  S.px.t = (w.pointerX / innerWidth); S.py.t = 1 - (w.pointerY / innerHeight);
  S.px.step(dt); S.py.step(dt);
  S.scroll.t = clamp(w.scrollVelocity / 46, -1.5, 1.5); S.scroll.step(dt);
  S.prox.t = w.proximity; S.prox.step(dt);
  S.press.t = w.press; S.press.step(dt);
  /* variables CSS globales (solo si cambian) */
  css("--w-px", w.normalizedPointerX); css("--w-py", w.normalizedPointerY);
  css("--w-sv", S.scroll.x); css("--w-energy", w.interactionEnergy);
  css("--w-gp", w.globalProgress); css("--w-sp", w.sectionProgress);
  root.style.setProperty("--w-section", String(w.sectionIndex));
  /* quality tier adaptativo: si el dispositivo no sostiene ~50fps, baja un escalón */
  if (holds > 0) {
    acc += dt; frames++;
    if (frames % 90 === 0) {
      const avg = acc / 90; acc = 0;
      if (avg > 0.024) { if (++slow >= 2 && w.tier !== "low") { setTier(w.tier === "high" ? "medium" : "low"); slow = 0; subs.forEach((s) => s.onTier?.()); } }
      else slow = 0;
    }
  } else frames++;
  subs.forEach((fn) => fn(w, dt));
  if (holds > 0 || now < idleUntil) raf = requestAnimationFrame(frame);
}

export function initEngine() {
  setTier(detectTier());
  const poke = () => wake();
  const down = () => { world.press = 1; wake(2200); };
  const up = () => { world.press = 0; wake(); };
  addEventListener("pointermove", poke, { passive: true });
  addEventListener("scroll", poke, { passive: true });
  addEventListener("pointerdown", down, { passive: true });
  addEventListener("pointerup", up, { passive: true });
  addEventListener("pointercancel", up, { passive: true });
  addEventListener("resize", () => { dirty = true; world.dpr = Math.min(devicePixelRatio || 1, TIER_DPR[world.tier]); wake(); }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
  reduceMotion.addEventListener?.("change", () => { world.reducedMotion = reduceMotion.matches; setTier(detectTier()); });
  wake();
  return () => { cancelAnimationFrame(raf); subs.clear(); };
}
