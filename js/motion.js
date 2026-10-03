/* ════════════════════════════════════════════════════════════════════════════════════════
   CHITA AUTOMOTORES · CAPA DE MOVIMIENTO  (js/motion.js)
   GSAP = motor · ScrollTrigger = narrativa · Lenis = inercia del scroll.

   Archivo único y autocontenido: solo importa el bundle ya servido en js/vendor/.
   No cambia HTML, CSS, contenido ni identidad visual: únicamente el movimiento.

   FIRMAS (los momentos propios de este sitio)
     1 · PORTÓN       El hero queda anclado y la sección «Unidades» sube sobre él con un borde en
                      diagonal que se endereza, como un portón de salón que se levanta. Mientras
                      tanto el hero «se va»: palabras que escapan una a una, marco que se cierra,
                      foto que se acerca.
     2 · ARMADO       El banner se arma letra por letra con el scroll (cada letra llega desde su
                      propio lugar) y después las palabras derivan a distinta profundidad.
     3 · ODÓMETRO     Los números del sitio (reseñas, grupos, año del registro) giran como un
                      tablero de kilometraje y se asientan en su valor real.
     4 · VENTANA      Mapa e itinerario del local se abren como iris/ventana con el avance.
     5 · INERCIA      La velocidad y la dirección del scroll inclinan títulos y fotos de las
                      tarjetas, estiran el cursor y esconden/muestran el header.
     6 · CURSOR       Anillo con estados (ver, arrastrar, mover…), estiramiento direccional y
                      botones magnéticos.
     7 · RESORTE      La inercia del scroll es un resorte subamortiguado: al frenar, títulos y
                      fotos se pasan un poco y se asientan (banda elástica), en vez de frenar en seco.
     8 · TÚNEL        El hero sale en perspectiva: el marco gira y se aleja, la foto interior va
                      más lenta y el texto se retira sin cruzarse.
     9 · COLUMNAS     En la grilla de unidades cada columna reacciona distinto a la velocidad
                      (la izquierda se atrasa, la derecha se adelanta) y se reacomoda al filtrar.
    10 · RECESIÓN     La sección que se va retrocede (escala, opacidad, ascenso) mientras la siguiente
                      la cubre; el pie sube por capas y se asienta justo al llegar al final.
    11 · HAZ          En Trayectoria el hito que se lee en el centro es el que brilla; los leídos se atenúan.
       + ROLL         El menú gira letra por letra al apuntarlo (copia aria-hidden, nombre accesible intacto).
       + ATERRIZAJE   Las anclas corrigen su destino al llegar si el layout se movió durante el viaje.

   REGLAS
     · Solo transform / opacity / clip-path. Cero lecturas de layout por frame.
     · prefers-reduced-motion: no se oculta ni se mueve nada.
     · Móvil: sin pines, sin efectos de mouse, distancias reducidas; el dedo siempre es nativo.
     · Contratos con el resto del sitio: eventos chita:hero / chita:vr, window.chitaScroll,
       clases html.m / html.mh / html.cm-reduce, <dialog id="dlg">.
   ════════════════════════════════════════════════════════════════════════════════════════ */
import { gsap, ScrollTrigger, Lenis } from "./vendor/gsap-stack.js";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ overwrite: "auto" });
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

/* ── Utilidades ─────────────────────────────────────────────────────────────────────── */
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 900px)",
  fine: "(hover: hover) and (pointer: fine)"
};
const EASE = {
  expo: "expo.out", mask: "expo.inOut", soft: "power3.out", settle: "power2.out",
  spring: "back.out(1.7)", linear: "none", drive: "power3.in"
};
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const noop = () => {};

/* Aleatorio con semilla: las letras siempre «llegan» desde el mismo lugar (reproducible entre recargas). */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Toma control de propiedades CSS inline (p. ej. anular una animación CSS que compite con GSAP)
   y devuelve la función que las restituye. */
function claim(targets, props) {
  const list = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
  const saved = [];
  list.forEach((el) => Object.entries(props).forEach(([name, value]) => {
    saved.push([el, name, el.style.getPropertyValue(name), el.style.getPropertyPriority(name)]);
    el.style.setProperty(name, value);
  }));
  return () => saved.forEach(([el, name, value, priority]) => (value ? el.style.setProperty(name, value, priority) : el.style.removeProperty(name)));
}

/* Dispara una vez al entrar (o al volver a entrar si la carga fue más abajo). */
function once(trigger, start, run) {
  let done = false;
  const fire = () => { if (done) return; done = true; run(); };
  return ScrollTrigger.create({ trigger, start, onEnter: fire, onEnterBack: fire, once: true });
}
function batch(targets, enter, { start = "top 90%", gap = 0.1, max = 6 } = {}) {
  if (!targets.length) return;
  ScrollTrigger.batch(targets, { start, interval: gap, batchMax: max, once: true, onEnter: enter, onEnterBack: enter });
}
const scrub = (trigger, start, end, extra = {}) => ({ trigger, start, end, scrub: true, ...extra });

/* ── Texto partido (palabras / letras) sin perder <em> ni <br>. Idempotente. ─────────────── */
const WORD = "mo-w", INNER = "mo-i", CHAR = "mo-c";
function split(element, { chars = false, skip = null } = {}) {
  if (!element) return [];
  if (element.dataset.moSplit) return qsa(chars ? `.${CHAR}` : `.${INNER}`, element);
  const label = element.textContent.replace(/\s+/g, " ").trim();
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) { fragment.appendChild(document.createTextNode(" ")); return; }
          const word = document.createElement("span"); word.className = WORD; word.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span"); inner.className = INNER;
          if (chars) [...token].forEach((letter) => { const c = document.createElement("span"); c.className = CHAR; c.textContent = letter; inner.appendChild(c); });
          else inner.textContent = token;
          word.appendChild(inner); fragment.appendChild(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === 1 && child.tagName !== "BR" && !(skip && child.matches(skip))) walk(child);
    });
  };
  walk(element);
  element.setAttribute("aria-label", label);
  element.dataset.moSplit = chars ? "chars" : "words";
  return qsa(chars ? `.${CHAR}` : `.${INNER}`, element);
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   INERCIA (firma 5) · velocidad y dirección del scroll compartidas
   Un solo bucle: lee el scroll una vez por frame, suaviza la velocidad y la reparte a los
   elementos visibles con quickSetter (sin tweens, sin lecturas de layout).
   ════════════════════════════════════════════════════════════════════════════════════════ */
function createInertia() {
  /* v = velocidad suavizada (cursor, lecturas). s/sv = resorte subamortiguado que persigue a v:
     al frenar el scroll, los elementos se pasan un poco y vuelven (efecto «banda elástica»). */
  const state = { v: 0, s: 0, sv: 0, dir: 1 };
  const items = new Map();
  let rest = true;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { const item = items.get(entry.target); if (item) item.vis = entry.isIntersecting; });
  }, { rootMargin: "15% 0px" });
  const drop = (el) => { io.unobserve(el); items.delete(el); };
  return {
    state,
    /* gain puede ser una función: se reevalúa en cada refresh (p. ej. columnas de una grilla responsive). */
    add(el, prop, gain, unit = "", max = Infinity) {
      if (!el || items.has(el)) return;
      const fn = typeof gain === "function" ? gain : null;
      items.set(el, { set: gsap.quickSetter(el, prop, unit), gain: fn ? fn() : gain, fn, max, vis: false });
      io.observe(el);
    },
    remove(el) { if (items.has(el)) drop(el); },
    refresh() {
      items.forEach((item, el) => { if (!el.isConnected) drop(el); else if (item.fn) item.gain = item.fn(); });
    },
    step(instant, dt = 1) {
      state.v += (instant - state.v) * (1 - Math.pow(0.84, dt));
      if (Math.abs(state.v) < 0.03) state.v = 0;
      if (instant !== 0) state.dir = instant > 0 ? 1 : -1;
      state.sv += (state.v - state.s) * 0.09 * dt;
      state.sv *= Math.pow(0.8, dt);
      state.s += state.sv * dt;
      const settled = state.v === 0 && Math.abs(state.s) < 0.02 && Math.abs(state.sv) < 0.02;
      if (settled) { state.s = 0; state.sv = 0; }
      if (settled && rest) return;
      rest = settled;
      items.forEach((item) => { if (item.vis || rest) item.set(clamp(state.s * item.gain, -item.max, item.max)); });
    },
    destroy() { io.disconnect(); items.forEach((item) => item.set(0)); items.clear(); }
  };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   SCROLL · Lenis → gsap.ticker → ScrollTrigger (un solo reloj, un solo loop)
   Touch queda nativo: el scroll del dedo nunca se toca.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function initScroll({ desktop }) {
  const inertia = createInertia();
  const lenis = new Lenis({
    lerp: desktop ? 0.085 : 0.12,
    wheelMultiplier: 0.92,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    autoRaf: false
  });

  let lastY = lenis.scroll;
  const tick = (time) => {
    lenis.raf(time * 1000);
    const y = lenis.scroll;
    const dt = Math.min(gsap.ticker.deltaRatio(), 4) || 1;
    inertia.step((y - lastY) / dt, dt);
    lastY = y;
  };
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  const onRefresh = () => inertia.refresh();
  ScrollTrigger.addEventListener("refresh", onRefresh);
  gsap.ticker.lagSmoothing(0);

  const header = qs("header");
  const headerOffset = () => -(header?.offsetHeight || 0);
  const to = (target, options = {}) => {
    let distance = 800;
    if (typeof target === "number") distance = Math.abs(target - lenis.scroll);
    else if (target instanceof Element) distance = Math.abs(target.getBoundingClientRect().top + (options.offset || 0));
    const duration = options.duration ?? clamp(0.9 + distance / 3400, 1.1, 2.4);
    /* Aterrizaje exacto: Lenis calcula el destino al salir. Si el layout se movió durante el viaje (imágenes lazy,
       filtros, acordeones) se corrige al llegar con un tramo corto; máximo 2 reintentos para no oscilar. */
    const settle = (tries) => () => {
      if (!(target instanceof Element) || tries <= 0) return;
      const miss = target.getBoundingClientRect().top + (options.offset || 0);
      if (Math.abs(miss) > 4) lenis.scrollTo(target, { duration: 0.7, easing: easeOutExpo, ...options, onComplete: settle(tries - 1) });
    };
    return lenis.scrollTo(target, { duration, easing: easeOutExpo, ...options, onComplete: settle(2) });
  };

  const onClick = (event) => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (hash === "#" || hash === "#top") { event.preventDefault(); to(0); history.pushState(null, "", location.pathname + location.search); return; }
    let target = null;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { /* hash inválido */ }
    if (!target) return;                       // #unidad-… y similares los resuelve el sitio
    event.preventDefault();
    to(target, { offset: headerOffset() });
    history.pushState(null, "", hash);
  };
  document.addEventListener("click", onClick);

  /* La ficha (<dialog>) bloquea el scroll de fondo y conserva el suyo. */
  const dialog = qs("dialog");
  let observer = null;
  if (dialog) {
    dialog.setAttribute("data-lenis-prevent", "");
    observer = new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start()));
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }
  qsa(".tw, [role='region'][tabindex]").forEach((el) => el.setAttribute("data-lenis-prevent-wheel", ""));

  /* Hash inicial (enlace compartido a una sección): se resuelve cuando el layout ya es definitivo. */
  const goHash = () => {
    if (location.hash.length < 2) return;
    let target = null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* noop */ }
    if (target) lenis.scrollTo(target, { offset: headerOffset(), immediate: true, force: true });
  };
  if (document.readyState === "complete") requestAnimationFrame(goHash);
  else window.addEventListener("load", () => setTimeout(goHash, 60), { once: true });

  window.chitaScroll = { to, lenis };
  return {
    lenis, inertia,
    dispose() {
      document.removeEventListener("click", onClick);
      observer?.disconnect();
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      inertia.destroy();
      lenis.destroy();
      if (window.chitaScroll?.lenis === lenis) delete window.chitaScroll;
    }
  };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   NAVEGACIÓN · sombra, header por dirección (con histéresis) y scrollspy
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initNavigation() {
  const header = qs("header");
  if (!header) return noop;
  let hidden = false, acc = 0, lastY = 0;
  const setHidden = (value) => {
    if (value === hidden) return;
    hidden = value;
    gsap.to(header, { yPercent: value ? -100 : 0, duration: value ? 0.5 : 0.6, ease: value ? "power3.in" : EASE.expo, overwrite: "auto" });
  };
  const onFocus = () => setHidden(false);
  header.addEventListener("focusin", onFocus);

  const ctx = gsap.context(() => {
    ScrollTrigger.create({ start: 8, end: "max", onToggle: (self) => header.classList.toggle("s", self.isActive) });

    /* Dirección: baja → se esconde; sube → vuelve. 48 px de recorrido acumulado para evitar parpadeos. */
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const y = self.scroll(), dy = y - lastY; lastY = y;
        if (Math.sign(dy) !== Math.sign(acc)) acc = 0;
        acc += dy;
        if (y < 640 || header.matches(":focus-within")) { setHidden(false); return; }
        if (acc > 48) setHidden(true); else if (acc < -24) setHidden(false);
      }
    });

    qsa('nav a[href^="#"]', header).forEach((link) => {
      const section = document.getElementById(link.getAttribute("href").slice(1));
      if (!section) return;
      ScrollTrigger.create({
        trigger: section, start: "top 46%", end: "bottom 46%",
        onToggle: (self) => (self.isActive ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current"))
      });
    });
  });
  return () => { header.removeEventListener("focusin", onFocus); gsap.set(header, { clearProps: "transform" }); header.classList.remove("s"); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   CAMBIO DE DIAPOSITIVA con cortina de máscara (hero: chita:hero · Vender/permutar: chita:vr)
   El sitio solo alterna .on y avisa por evento; acá vive la coreografía.
   ════════════════════════════════════════════════════════════════════════════════════════ */
function bindSlides({ event, frame, slide, ctx, axis = "x", extra }) {
  if (!frame) return noop;
  let swap = null;
  const onChange = (e) => {
    const { from, to, dir = 1 } = e.detail || {};
    const slides = qsa(slide, frame);
    const next = slides[to] || qs(`${slide}.on`, frame), prev = slides[from];
    if (!next) return;
    ctx.add(() => {
      swap?.progress(1).kill();
      frame.classList.add("mo-swap");
      const img = qs("img", next), prevImg = prev ? qs("img", prev) : null;
      const hidden = axis === "x" ? (dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)") : (dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)");
      if (prev) gsap.set(prev, { autoAlpha: 1, zIndex: 1 });
      gsap.set(next, { zIndex: 2, autoAlpha: 1, clipPath: hidden });
      swap = gsap.timeline({
        onComplete: () => {
          if (prev) gsap.set(prev, { clearProps: "opacity,visibility,zIndex" });
          if (prevImg) gsap.set(prevImg, { clearProps: "transform" });
          gsap.set(next, { clearProps: "opacity,visibility,zIndex,clipPath" });
          requestAnimationFrame(() => frame.classList.remove("mo-swap"));
        }
      });
      swap.to(next, { clipPath: "inset(0 0 0 0)", duration: 1.05, ease: EASE.mask }, 0);
      /* La foto que sale se desplaza hacia el lado opuesto: dos planos que se cruzan. */
      if (prevImg) swap.to(prevImg, { xPercent: axis === "x" ? -dir * 9 : 0, yPercent: axis === "y" ? -dir * 9 : 0, scale: 1.08, duration: 1.05, ease: EASE.mask, overwrite: false }, 0);
      if (img) swap.fromTo(img, { scale: 1.3, xPercent: axis === "x" ? dir * 4 : 0, yPercent: axis === "y" ? dir * 4 : 0 }, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.7, ease: EASE.expo }, 0);
      extra?.(swap, { next, prev, dir });
    });
  };
  document.addEventListener(event, onChange);
  return () => { document.removeEventListener(event, onChange); swap?.kill(); frame.classList.remove("mo-swap"); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   HERO + PORTÓN (firma 1)
   Entrada: cortina del marco, logo, palabras, CTAs y header en secuencia.
   Salida (desktop): el hero queda anclado; «Unidades» sube sobre él con borde diagonal y el
   hero se va por capas. Móvil: sin pin, misma idea con distancias cortas.
   ════════════════════════════════════════════════════════════════════════════════════════ */
let introPlayed = false;

function initHero({ desktop, fine }, scroll) {
  const hero = qs(".hero");
  if (!hero) { root.classList.remove("mh"); return noop; }

  const header = qs("header");
  const logo = qs(".hlogo", hero), eyebrow = qs(".h1n", hero), title = qs("h1", hero);
  const lead = qs(".tx > p", hero), actions = qs(".row", hero), link = qs(".lk", hero);
  const figure = qs("figure", hero), frame = qs(".hv", hero), stage = qs(".hzs", hero);
  const caption = qs(".hcap", hero), cta = qs(".ha", hero);
  const headerItems = qsa("header .w > *");
  const words = split(title, { skip: ".h1n" });
  const buttons = actions ? [...actions.children] : [];
  const ctaButtons = cta ? [...cta.children] : [];
  const unidades = qs("#unidades");
  const off = [];
  const headerH = () => header?.offsetHeight || 0;

  const ctx = gsap.context(() => {});
  ctx.add(() => {
    const settle = desktop ? 1.1 : 1.06;

    /* ── Entrada ── */
    if (!introPlayed) {
      introPlayed = true;
      gsap.set(headerItems, { yPercent: -120, opacity: 0 });
      gsap.set(logo, { clipPath: "inset(0 100% 0 0)", x: -26 });
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(words, { yPercent: 118, rotate: 5, transformOrigin: "0% 100%" });
      gsap.set([lead, link], { opacity: 0, y: 22 });
      gsap.set(buttons, { opacity: 0, y: 18 });
      gsap.set(frame, { clipPath: desktop ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)" });
      gsap.set(stage, { scale: desktop ? 1.5 : 1.28, transformOrigin: "50% 50%" });
      gsap.set(caption, { opacity: 0, y: 14 });
      gsap.set(ctaButtons, { opacity: 0, y: 14 });
      root.classList.remove("mh");

      gsap.timeline({ defaults: { ease: EASE.soft }, onComplete: () => ScrollTrigger.refresh() })
        .to(headerItems, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: EASE.expo }, 0)
        .to(frame, { clipPath: desktop ? "inset(0 0 0 0%)" : "inset(0% 0 0 0)", duration: 1.5, ease: EASE.mask }, 0.05)
        .to(stage, { scale: settle, duration: 2.3, ease: EASE.expo }, 0.05)
        .to(logo, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 1, ease: EASE.expo }, 0.4)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.62)
        .to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: EASE.expo, stagger: 0.06 }, 0.68)
        .to(lead, { opacity: 1, y: 0, duration: 0.9 }, 1.05)
        .to(buttons, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.2)
        .to(link, { opacity: 1, y: 0, duration: 0.8 }, 1.45)
        .to(caption, { opacity: 1, y: 0, duration: 0.8 }, 1.3)
        .to(ctaButtons, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 1.45);
    } else {
      gsap.set(stage, { scale: settle });
      root.classList.remove("mh");
    }

    /* ── Salida ──
       Todo con fromTo + immediateRender:false: el estado de reposo es explícito, así que la entrada
       y la salida nunca se pisan aunque alguien empiece a scrollear antes de que termine la intro. */
    const exit = gsap.timeline({
      defaults: { ease: EASE.linear, overwrite: false, immediateRender: false },
      scrollTrigger: desktop
        ? { trigger: hero, start: () => `top top+=${headerH()}`, end: () => `+=${hero.offsetHeight}`, scrub: true, pin: true, pinSpacing: false, anticipatePin: 1, refreshPriority: 20, invalidateOnRefresh: true }
        : { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });
    const out = (target, from, to, at, duration, ease = EASE.linear) => target && exit.fromTo(target, from, { ...to, duration, ease }, at);

    if (desktop) {
      gsap.set(hero, { zIndex: 1 });
      out(logo, { yPercent: 0, opacity: 1 }, { yPercent: -70, opacity: 0 }, 0, 0.42, "power2.in");
      out(eyebrow, { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: -140 }, 0.02, 0.34, "power2.in");
      out(words, { yPercent: 0, rotate: 0 }, { yPercent: -135, rotate: -6, stagger: { each: 0.045, from: "start" } }, 0.04, 0.46, EASE.drive);
      /* El texto de abajo se desvanece ANTES de poder cruzarse con el título (la opacidad va por su cuenta, rápida)
         y después sigue subiendo con la misma curva que las palabras: sin solapes en ningún punto de la salida. */
      out(lead, { opacity: 1 }, { opacity: 0 }, 0.04, 0.2, EASE.linear);
      out(lead, { yPercent: 0 }, { yPercent: -90 }, 0.1, 0.42, EASE.drive);
      out(buttons, { opacity: 1 }, { opacity: 0, stagger: 0.03 }, 0.05, 0.2, EASE.linear);
      out(buttons, { yPercent: 0 }, { yPercent: -70, stagger: 0.05 }, 0.13, 0.4, EASE.drive);
      out(link, { opacity: 1 }, { opacity: 0 }, 0.07, 0.2, EASE.linear);
      out(link, { yPercent: 0 }, { yPercent: -80 }, 0.18, 0.36, EASE.drive);
      out(figure, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(7% 4.5% 7% 4.5% round 28px)" }, 0, 1);
      /* TÚNEL: el marco se abre en perspectiva (gira y se aleja) y la foto interior se desliza más lento: tres planos. */
      out(frame, { scale: 1, opacity: 1, rotationY: 0, xPercent: 0, transformPerspective: 1400, transformOrigin: "50% 50%" }, { scale: 1.2, opacity: 0.42, rotationY: -9, xPercent: 3 }, 0, 1);
      out(stage, { yPercent: 0 }, { yPercent: 9 }, 0, 1);
      out(caption, { yPercent: 0, opacity: 1 }, { yPercent: -90, opacity: 0 }, 0.05, 0.4, "power2.in");
      out(cta, { yPercent: 0, opacity: 1 }, { yPercent: 110, opacity: 0 }, 0.05, 0.4, "power2.in");

      /* El portón: «Unidades» sube sobre el hero anclado; su borde superior arranca en diagonal y se endereza. */
      if (unidades) {
        gsap.set(unidades, { position: "relative", zIndex: 2 });
        gsap.fromTo(unidades,
          { clipPath: "polygon(0vw 9vw, 100% 0vw, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0vw 0vw, 100% 0vw, 100% 100%, 0% 100%)", ease: EASE.linear, immediateRender: true,
            scrollTrigger: { trigger: unidades, start: "top bottom", end: () => `top top+=${headerH()}`, scrub: true, invalidateOnRefresh: true }
          });
      }
    } else {
      out(figure, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(0% 4% 0% 4% round 24px)" }, 0, 1);
      out(frame, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.14 }, 0, 1);
      out(logo, { yPercent: 0, opacity: 1 }, { yPercent: -30, opacity: 0.2 }, 0, 1);
      out(title, { yPercent: 0 }, { yPercent: -10 }, 0, 1);
      out(lead, { yPercent: 0, opacity: 1 }, { yPercent: -26, opacity: 0.1 }, 0, 1);
      out(caption, { yPercent: 0 }, { yPercent: -30 }, 0, 1);
    }

    /* ── Profundidad por puntero (solo mouse): cuatro capas con distinta masa ── */
    if (fine && desktop) {
      const layer = (el, xAmp, yAmp, time) => el && ({
        x: gsap.quickTo(el, "x", { duration: time, ease: "power3.out" }),
        y: yAmp ? gsap.quickTo(el, "y", { duration: time, ease: "power3.out" }) : null, xAmp, yAmp
      });
      const layers = [layer(stage, -30, -18, 1.1), layer(title, 10, 7, 1.4), layer(caption, 18, 0, 1.2), layer(lead, 6, 0, 1.6)].filter(Boolean);
      const move = (event) => {
        const nx = event.clientX / innerWidth - 0.5, ny = event.clientY / innerHeight - 0.5;
        layers.forEach((l) => { l.x(nx * l.xAmp); l.y?.(ny * l.yAmp); });
      };
      const leave = () => layers.forEach((l) => { l.x(0); l.y?.(0); });
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", leave, { passive: true });
      off.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); });
    }

    /* Cambio de unidad (chita:hero): cortina lateral + planos cruzados + caption que reentra. */
    off.push(bindSlides({
      event: "chita:hero", frame, slide: ".hz", ctx, axis: "x",
      extra: (tl) => { if (caption) tl.fromTo(caption, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.75, ease: EASE.soft, overwrite: false }, 0.35); }
    }));
  });

  return () => { off.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   TIPOGRAFÍA · cada título entra con la personalidad de su sección
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initTypography({ desktop }, inertia) {
  const undo = [];
  const ctx = gsap.context(() => {
    /* Las animaciones CSS por view() de estos bloques compiten con GSAP: se anulan donde GSAP toma el control. */
    undo.push(claim(qsa(".xt .xl, .xt .xk, .xb .xp, .xb .xs, .loc .xt, .loc .xb"), { animation: "none" }));

    const R = seeded(11);
    qsa("main section h2").forEach((heading) => {
      if (heading.closest("#bd, [hidden]") || heading.querySelector("img,svg,button,a")) return;
      const section = heading.closest("section");
      const id = section?.id || "";
      const start = desktop ? "top 88%" : "top 94%";

      /* UNIDADES: letras en 3D que caen desde el centro hacia los costados. */
      if (id === "unidades") {
        const chars = split(heading, { chars: true });
        if (!chars.length) return;
        gsap.set(chars, { yPercent: 120, rotate: () => (R() - 0.5) * 36, transformOrigin: "0% 100%" });
        once(heading, start, () => gsap.to(chars, { yPercent: 0, rotate: 0, duration: 1.2, ease: EASE.expo, stagger: { each: 0.045, from: "center" } }));
        inertia?.add(heading, "skewY", -0.35, "deg", 3);
        return;
      }

      const words = split(heading);
      if (!words.length || words.length > 24) return;
      inertia?.add(heading, "skewY", -0.3, "deg", 2.6);

      /* MODELOS: las palabras se cruzan desde los costados, alternando sentido. */
      if (id === "modelos") {
        gsap.set(words, { xPercent: (i) => (i % 2 ? 110 : -110), opacity: 0 });
        once(heading, start, () => gsap.to(words, { xPercent: 0, opacity: 1, duration: 1.15, ease: EASE.expo, stagger: 0.08 }));
        return;
      }
      /* COMPARAR: llegan «desde atrás», con escala y rebote corto. */
      if (id === "versus") {
        gsap.set(words, { yPercent: 40, scale: 0.55, opacity: 0, transformOrigin: "50% 100%" });
        once(heading, start, () => gsap.to(words, { yPercent: 0, scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.5)", stagger: 0.07 }));
        return;
      }
      /* NOSOTROS: ascenso con skew que se endereza (tipografía «de imprenta»). */
      if (id === "nosotros") {
        gsap.set(words, { yPercent: 125, skewX: -14, transformOrigin: "0% 100%" });
        once(heading, start, () => gsap.to(words, { yPercent: 0, skewX: 0, duration: 1.15, ease: EASE.expo, stagger: 0.055 }));
        return;
      }
      /* Resto: máscara ascendente con giro corto. */
      gsap.set(words, { yPercent: 118, rotate: 3.5, transformOrigin: "0% 100%" });
      once(heading, start, () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.05, ease: EASE.expo, stagger: desktop ? 0.05 : 0.035 }));
    });

    /* Declaraciones (.xl): el scroll las «lee»: cada palabra sube dentro de su máscara y se enciende. */
    qsa(".xl, .xb .xp").forEach((statement) => {
      const words = split(statement);
      if (!words.length) return;
      gsap.set(words, { opacity: 0.12, yPercent: 46 });
      gsap.to(words, {
        opacity: 1, yPercent: 0, ease: EASE.linear, stagger: 0.12, overwrite: false,
        scrollTrigger: scrub(statement, desktop ? "top 84%" : "top 92%", desktop ? "bottom 46%" : "bottom 60%")
      });
      if (desktop && statement.matches(".xl")) inertia?.add(statement, "skewY", -0.22, "deg", 1.8);
    });

    /* Eyebrows: se destapan con un wipe horizontal (distinto al ascenso de los títulos). */
    const eyebrows = qsa("main section :is(.ey, .pde, .pdt, .xk)").filter((el) => !el.closest(".hero"));
    gsap.set(eyebrows, { clipPath: "inset(0 100% 0 0)", x: -14 });
    batch(eyebrows, (group) => gsap.to(group, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.95, ease: EASE.mask, stagger: 0.08, clearProps: "clipPath,transform" }), { start: "top 94%" });
  });
  return () => { undo.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   ARMADO (firma 2) · el banner se construye con el scroll
   Cada letra llega desde su propio lugar (con semilla), y una vez armado el título las palabras
   derivan a distinta profundidad mientras el banner cruza la pantalla.
   (El banner mide más que la ventana: no se ancla, el scroll es el que lo arma.)
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initBanner({ desktop }) {
  const banner = qs("#bd");
  if (!banner) return noop;
  const undo = [];
  const ctx = gsap.context(() => {
    const title = qs("h2", banner);
    const chars = split(title, { chars: true });
    const words = qsa(`.${WORD}`, title);
    const eyebrow = qs(".bdk", banner), brand = qs(".bde", banner), lead = qs(".bdp", banner);
    const rest = [qs(".btn", banner), qs(".bdf", banner)].filter(Boolean);
    undo.push(claim([eyebrow, lead, qs(".bdf", banner)], { animation: "none" }));

    const R = seeded(23);
    const spread = desktop ? 1 : 0.5;
    const origin = chars.map(() => ({ x: (R() - 0.5) * 760 * spread, y: (R() - 0.5) * 460 * spread, rotation: (R() - 0.5) * 170, scale: 0.35 + R() * 1.5 }));

    gsap.set(words, { overflow: "visible" });                  // las letras vuelan fuera de su máscara
    gsap.set(chars, { x: (i) => origin[i].x, y: (i) => origin[i].y, rotation: (i) => origin[i].rotation, scale: (i) => origin[i].scale, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set([eyebrow, brand, lead, ...rest], { opacity: 0, y: 34 });

    if (desktop) {
      /* Acto 1 · las letras se arman mientras el título sube por la pantalla */
      gsap.timeline({ defaults: { ease: EASE.linear }, scrollTrigger: scrub(title, "top 92%", "top 36%") })
        .to(brand, { opacity: 1, y: 0, duration: 0.45, ease: EASE.soft }, 0)
        .to(chars, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power3.out", stagger: { amount: 0.55, from: "random" } }, 0.1);

      /* Acto 2 · el resto de la escena aparece con el avance */
      gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: scrub(title, "top 60%", "bottom 30%") })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(lead, { opacity: 1, y: 0, duration: 0.6 }, 0.25)
        .to(rest, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, 0.55);

      /* Acto 3 · derivan las palabras (profundidad): cada una a su velocidad */
      words.forEach((word, i) => {
        const depth = (i % 3 - 1) * 26 + (i % 2 ? 8 : -8);
        gsap.fromTo(word, { y: depth }, { y: -depth, ease: EASE.linear, overwrite: false, scrollTrigger: scrub(banner, "top bottom", "bottom top") });
      });
    } else {
      gsap.timeline({
        scrollTrigger: { trigger: title, start: "top 85%", once: true }
      })
        .to(brand, { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft }, 0)
        .to(chars, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.1, ease: EASE.expo, stagger: { amount: 0.5, from: "random" } }, 0.1)
        .to([eyebrow, lead, ...rest], { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft, stagger: 0.12 }, 0.5);
    }
  });
  return () => { undo.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   COSTURAS · cada sección se apoya sobre la anterior (transición continua)
   Oscuras: hoja que se ensancha con esquinas redondeadas. Claras: el contenido sube desde atrás.
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initSeams({ desktop }) {
  const SHEET = new Set(["versus", "contacto", "financiacion", "guia", "visita"]);
  const ctx = gsap.context(() => {
    qsa("main > section").forEach((section) => {
      if (section.id === "unidades" || section.id === "bd" || section.classList.contains("bd")) return;
      const inner = qs(":scope > .w", section);
      const k = desktop ? 1 : 0.45;

      if (SHEET.has(section.id)) {
        gsap.fromTo(section,
          { clipPath: desktop ? "inset(0% 5% 0% 5% round 44px 44px 0px 0px)" : "inset(0% 3% 0% 3% round 26px 26px 0px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(section, "top 100%", "top 38%") });
      }
      if (inner && section.id !== "versus") {
        gsap.fromTo(inner, { y: 90 * k }, { y: 0, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub(section, "top 100%", "top 42%") });
      }
    });

    /* RECESIÓN: la sección que se va no desaparece de golpe: su contenido retrocede (escala, opacidad, leve
       ascenso) mientras la siguiente la cubre. Escala y opacidad no las toca ningún otro efecto del contenedor.
       Se omiten Unidades (portón), el banner, Modelos (panel sticky) y la última antes del pie. */
    const k2 = desktop ? 1 : 0.5;
    qsa("main > section").forEach((section) => {
      if (["unidades", "bd", "modelos", "preguntas"].includes(section.id) || section.classList.contains("bd")) return;
      const inner = qs(":scope > .w", section);
      if (!inner) return;
      gsap.fromTo(inner,
        { scale: 1, opacity: 1, yPercent: 0, transformOrigin: "50% 100%" },
        { scale: 1 - 0.05 * k2, opacity: desktop ? 0.4 : 0.55, yPercent: -2.2 * k2, ease: EASE.linear, overwrite: false, immediateRender: false, scrollTrigger: scrub(section, "bottom 78%", "bottom 6%") });
    });

    /* Comparar entra «desde atrás»: escala + profundidad (más teatral que el resto). */
    const versus = qs("#versus > .w");
    if (versus) gsap.fromTo(versus, { y: desktop ? 110 : 40, scale: desktop ? 0.93 : 0.98, transformOrigin: "50% 0%" }, { y: 0, scale: 1, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub("#versus", "top 100%", "top 28%") });
  });
  return () => ctx.revert();
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   REVELADOS · cada familia de elementos entra con su propio gesto
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initReveals({ desktop }, inertia) {
  const d = desktop ? 1 : 0.55;
  let observer = null, timer = 0;
  const undo = [];

  const ctx = gsap.context(() => {
    /* STOCK · abanico por columna: la tarjeta sube, la foto se destapa y el interior se acerca. */
    const grid = qs("#stockGrid");
    const colCount = () => Math.max(1, (getComputedStyle(grid).gridTemplateColumns || "").split(" ").filter(Boolean).length);
    const prepare = (cards) => {
      cards.forEach((card) => { card.dataset.mo = "1"; card.dataset.mr = "p"; });
      gsap.set(cards, { opacity: 0, y: 84 * d, x: 0, rotationX: desktop ? 9 : 0, transformPerspective: 1200, transformOrigin: "50% 100%" });
      gsap.set(cards.map((c) => qs(".im", c)).filter(Boolean), { clipPath: "inset(0 0 100% 0)" });
      gsap.set(cards.map((c) => qs(".ct", c)).filter(Boolean), { scale: 1.3, transformOrigin: "50% 50%" });
    };
    const play = (group) => {
      const cols = grid ? colCount() : 1;
      const tl = gsap.timeline();
      group.forEach((card, i) => {
        const col = Array.prototype.indexOf.call(card.parentNode.children, card) % cols;
        const at = i * 0.09, frame = qs(".im", card), ct = qs(".ct", card);
        gsap.set(card, { x: (col - (cols - 1) / 2) * 26 * d });
        tl.to(card, { opacity: 1, y: 0, x: 0, rotationX: 0, duration: 1.15, ease: EASE.expo, clearProps: "opacity,transform", onComplete: () => card.removeAttribute("data-mr") }, at);
        if (frame) tl.to(frame, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: EASE.mask, clearProps: "clipPath" }, at + 0.06);
        if (ct) tl.to(ct, { scale: 1, duration: 1.7, ease: EASE.expo, clearProps: "scale" }, at + 0.06);
      });
    };
    const cards = qsa(".car", grid || document);
    prepare(cards);
    batch(cards, play, { start: "top 92%", gap: 0.08, max: 4 });
    if (desktop) cards.forEach((card) => { const ct = qs(".ct", card); if (ct) inertia?.add(ct, "skewY", 0.22, "deg", 2.2); });

    /* COLUMNAS: cada columna de la grilla responde distinto a la velocidad del scroll (la de la izquierda
       se atrasa, la de la derecha se adelanta) y se acomodan con el resorte al frenar. Solo desktop. */
    const columnDrift = (card) => inertia?.add(card, "yPercent", () => {
      const n = grid ? colCount() : 1;
      if (n < 2) return 0;
      /* El filtro del sitio oculta (hidden) y reordena las mismas tarjetas: la columna se cuenta solo entre las visibles. */
      const col = [...grid.children].filter((c) => !c.hidden).indexOf(card);
      return col < 0 ? 0 : ((col % n) - (n - 1) / 2) * 0.1;
    }, "", 5);
    if (desktop && grid) cards.forEach(columnDrift);

    /* Filtros / orden vuelven a pintar la grilla: las tarjetas nuevas entran en cascada corta. */
    if (grid) {
      observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          inertia?.refresh();                       // filtros / orden: las columnas se reasignan al nuevo acomodo
          const fresh = qsa(".car:not([data-mo])", grid);
          if (!fresh.length) return;
          fresh.forEach((card) => { card.dataset.mo = "1"; card.dataset.mr = "p"; });
          ctx.add(() => gsap.fromTo(fresh,
            { opacity: 0, y: 34 * d, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: EASE.soft, stagger: 0.05, clearProps: "opacity,transform", onComplete: () => fresh.forEach((c) => c.removeAttribute("data-mr")) }));
          if (desktop) fresh.forEach((card) => { const ct = qs(".ct", card); if (ct) inertia?.add(ct, "skewY", 0.22, "deg", 2.2); columnDrift(card); });
          ScrollTrigger.refresh();
        }, 60);
      });
      observer.observe(grid, { childList: true });
    }

    /* MODELOS · las filas entran desde la izquierda, una tras otra. */
    const rows = qsa("#mdl > li");
    gsap.set(rows, { opacity: 0, x: -70 * d });
    batch(rows, (g) => gsap.to(g, { opacity: 1, x: 0, duration: 1, ease: EASE.expo, stagger: 0.08, clearProps: "opacity,transform" }), { start: "top 94%", max: 8 });

    /* OPERACIONES · tarjetas alternando lado + foto con persiana; la imagen interior queda con parallax. */
    const ops = qsa("#operaciones .oc");
    gsap.set(ops, { opacity: 0, y: 70 * d, x: (i) => (i % 2 ? 46 : -46) * d, rotate: (i) => (i % 2 ? 2 : -2) * (desktop ? 1 : 0), transformOrigin: "50% 100%" });
    gsap.set(ops.map((c) => qs(".oi", c)), { clipPath: "inset(0 0 100% 0)" });
    batch(ops, (g) => g.forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, x: 0, rotate: 0, duration: 1.15, ease: EASE.expo, delay: i * 0.12, clearProps: "opacity,transform" });
      gsap.to(qs(".oi", card), { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: EASE.mask, delay: i * 0.12 + 0.08, clearProps: "clipPath" });
    }), { start: "top 90%", max: 4 });
    ops.forEach((card) => {
      const img = qs(".oi img", card);
      if (!img) return;
      undo.push(claim(img, { transition: "none" }));          // el CSS anima transform con transition: choca con el scrub
      gsap.set(img, { scale: 1.22 });
      gsap.fromTo(img, { yPercent: -7 * (desktop ? 1 : 0.5) }, { yPercent: 7 * (desktop ? 1 : 0.5), ease: EASE.linear, immediateRender: false, scrollTrigger: scrub(card, "top bottom", "bottom top") });
      if (desktop) inertia?.add(img, "y", -0.9, "px", 14);
    });

    /* RESEÑAS · caída con perspectiva; las estrellas se encienden una a una. */
    const reviews = qsa("#opiniones .rvc");
    gsap.set(reviews, { opacity: 0, y: -30 * d, rotationX: desktop ? -16 : 0, transformPerspective: 900, transformOrigin: "50% 0%" });
    reviews.forEach((card) => { const stars = qsa(".rvs svg", card); if (stars.length) gsap.set(stars, { scale: 0, rotate: -50, transformOrigin: "50% 55%" }); });
    batch(reviews, (g) => g.forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power4.out", delay: i * 0.12, clearProps: "opacity,transform" });
      const stars = qsa(".rvs svg", card);
      if (stars.length) gsap.to(stars, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.4)", stagger: 0.09, delay: i * 0.12 + 0.35 });
    }), { start: "top 92%" });

    /* PRECIO Y PAGO · vienen «desde atrás» (escala). */
    const pay = qsa("#financiacion .pdc");
    gsap.set(pay, { opacity: 0, scale: 0.86, y: 40 * d, transformOrigin: "50% 60%" });
    batch(pay, (g) => gsap.to(g, { opacity: 1, scale: 1, y: 0, duration: 1.05, ease: "power3.out", stagger: 0.14, clearProps: "opacity,transform" }));

    /* CÓMO TRABAJAMOS / EQUIPO · pasos con marcador que «pega» un rebote. */
    [["#historia .hwl li", 0.16], ["#equipo .eqk li", 0.12]].forEach(([selector, gap]) => {
      const steps = qsa(selector);
      gsap.set(steps, { opacity: 0, y: 32 * d });
      steps.forEach((step) => gsap.set(qs("span", step), { scale: 0.2, rotate: 90 }));
      batch(steps, (g) => {
        gsap.to(g, { opacity: 1, y: 0, duration: 0.95, ease: EASE.soft, stagger: gap, clearProps: "opacity,transform" });
        gsap.to(g.map((s) => qs("span", s)).filter(Boolean), { scale: 1, rotate: 0, duration: 0.8, ease: "back.out(2.6)", stagger: gap, delay: 0.15, clearProps: "transform" });
      }, { start: "top 88%", max: 4 });
    });

    /* Textos secundarios: ascenso corto. */
    const body = qsa("main section :is(.sub, .pdl > p, .mdt, .oh > p, .rvh > p, .eqh > p, .hwh > p, .pdr)").filter((el) => !el.closest(".hero"));
    gsap.set(body, { opacity: 0, y: 26 * d });
    batch(body, (g) => gsap.to(g, { opacity: 1, y: 0, duration: 0.95, ease: EASE.soft, stagger: 0.07, clearProps: "opacity,transform" }), { start: "top 92%" });

    /* Formulario de visita y pie. */
    const form = qs("#visitaForm");
    if (form) {
      gsap.set(form, { opacity: 0, y: 64 * d, scale: 0.96, transformOrigin: "50% 100%" });
      once(form, "top 90%", () => gsap.to(form, { opacity: 1, y: 0, scale: 1, duration: 1.25, ease: EASE.expo, clearProps: "opacity,transform" }));
    }
    /* CORTINA DEL PIE: cada capa del pie (logo, dirección, enlaces, avisos) sube a su propia velocidad y se
       asienta justo al llegar al final de la página. «bottom bottom» siempre es alcanzable: nunca queda a medias. */
    const footer = qs("footer"), foot = qs("footer > .w");
    if (footer && foot) {
      const layers = [...foot.children];
      gsap.fromTo(layers,
        { yPercent: (i) => 26 + i * 16, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "power2.out", stagger: { each: 0.12 }, immediateRender: true, scrollTrigger: scrub(footer, "top 98%", "bottom bottom") });
    }
  });
  return () => { clearTimeout(timer); observer?.disconnect(); undo.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   PARALLAX MULTICAPA + IMÁGENES QUE SE TRANSFORMAN + VENTANA (firma 4)
   Cada plano con su propia velocidad; los marcos se abren con el avance.
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initParallax({ desktop }) {
  const k = desktop ? 1 : 0.45;
  const undo = [];
  const ctx = gsap.context(() => {
    /* NOSOTROS · el marco gira y se acomoda; la foto se «abre» desde un arco y se desplaza dentro (3 planos). */
    const frame = qs("#nph"), photo = qs("#nph img"), column = frame?.nextElementSibling;
    if (frame && photo) {
      gsap.fromTo(frame, { rotate: desktop ? -4 : -2, scale: 0.9 }, { rotate: 0, scale: 1, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(frame, "top 98%", "top 30%") });
      gsap.fromTo(photo, { clipPath: "inset(10% 14% 10% 14% round 240px 240px 18px 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(frame, "top 94%", "top 34%") });
      gsap.set(photo, { scale: 1.26, transformOrigin: "50% 50%" });
      gsap.fromTo(photo, { yPercent: -7 * k }, { yPercent: 7 * k, ease: EASE.linear, overwrite: false, immediateRender: false, scrollTrigger: scrub(frame, "top bottom", "bottom top") });
      if (desktop && column) gsap.fromTo(column, { yPercent: 3 }, { yPercent: -3, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub("#nosotros", "top bottom", "bottom top") });
    }
    /* Las tres líneas (Usados / Permutas / Consignaciones) se destapan con un wipe controlado por el scroll. */
    qsa("#nosotros .pl > div").forEach((row) => {
      gsap.fromTo(row, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(row, "top 94%", "top 68%") });
    });

    /* TRAYECTORIA · cada hito se destapa con el scroll y su año se desliza desde la izquierda. */
    qsa("#trayectoria .arl li").forEach((item) => {
      gsap.fromTo(item, { clipPath: "inset(0 0 100% 0)", opacity: 0.2 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(item, "top 94%", "top 64%") });
      const year = qs(".ary", item);
      if (year) gsap.fromTo(year, { x: -30 * k }, { x: 0, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub(item, "top 94%", "top 60%") });
    });

    /* HAZ DE LECTURA: una vez leído, cada hito se atenúa y se corre al seguir subiendo; el que está en el
       centro de la pantalla es el que brilla. Actúa sobre el texto interior (el <li> ya usa opacidad). */
    qsa("#trayectoria .arl li > div").forEach((box) => {
      gsap.fromTo(box, { opacity: 1, x: 0 }, { opacity: desktop ? 0.28 : 0.45, x: -18 * k, ease: EASE.linear, overwrite: false, immediateRender: false, scrollTrigger: scrub(box.parentElement, "top 34%", "bottom 8%") });
    });

    /* COMPARAR · los chips convergen desde los costados hacia su lugar con el avance del scroll. */
    const chips = qsa("#versus .vdp");
    if (chips.length) {
      undo.push(claim(chips, { "transition-property": "background, border-color" }));   // el CSS anima transform con transition: choca con el scrub
      gsap.fromTo(chips,
        { x: (i) => (i - (chips.length - 1) / 2) * 38 * k, y: 28 * k, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: EASE.linear, stagger: { each: 0.05 }, immediateRender: true, scrollTrigger: scrub("#versus .vdk", "top 98%", "top 60%") });
    }

    /* DÓNDE ESTAMOS · el mapa se abre como un iris y llega acercándose. */
    const map = qs("#contacto .mp");
    if (map) {
      gsap.fromTo(map, { clipPath: "circle(14% at 50% 62%)", scale: 1.12 }, { clipPath: "circle(80% at 50% 50%)", scale: 1, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub("#contacto", "top 96%", "top 30%") });
    }

    /* LOCAL · el marco del recorrido es una ventana que se abre; el fondo y la foto viajan a distinta velocidad. */
    const tour = qs("#local .vv");
    if (tour) {
      const slides = qs(".vsc", tour);
      gsap.fromTo(tour, { clipPath: "inset(14% 12% 14% 12% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(tour, "top 98%", "top 26%") });
      if (slides) gsap.fromTo(slides, { scale: 1.2 }, { scale: 1, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(tour, "top 98%", "top 26%") });
    }
    qsa("#local .vbk").forEach((layer) => {
      gsap.set(layer, { scale: 1.24 });
      gsap.fromTo(layer, { yPercent: -9 * k }, { yPercent: 9 * k, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub(layer.closest(".vl") || layer, "top bottom", "bottom top") });
    });
    qsa("#local .vc").forEach((img) => {
      gsap.set(img, { scale: 1.14 });
      gsap.fromTo(img, { yPercent: -5 * k }, { yPercent: 5 * k, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub(img.closest(".vl") || img, "top bottom", "bottom top") });
    });
    const hints = qsa("#local .vsn li");
    gsap.set(hints, { opacity: 0, x: 40, rotate: 1.5 });
    if (hints.length) once(hints[0], "top 92%", () => gsap.to(hints, { opacity: 1, x: 0, rotate: 0, duration: 1, ease: EASE.soft, stagger: 0.1, clearProps: "opacity,transform" }));

    /* EQUIPO · la foto grande se destapa desde abajo y se acerca. */
    qsa("#equipo .eqm img").forEach((img) => {
      const box = img.closest(".eqm");
      gsap.fromTo(img, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(box, "top 96%", "top 52%") });
      gsap.fromTo(img, { scale: 1.3 }, { scale: 1.02, ease: EASE.linear, overwrite: false, immediateRender: true, scrollTrigger: scrub(box, "top 96%", "bottom 20%") });
    });

    /* PRECIO Y PAGO · columna de texto y de tarjetas a distinta velocidad (solo desktop). */
    if (desktop) {
      const text = qs("#financiacion .pdl"), cards = qs("#financiacion .pdg");
      if (text) gsap.fromTo(text, { yPercent: 5 }, { yPercent: -5, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub("#financiacion", "top bottom", "bottom top") });
      if (cards) gsap.fromTo(cards, { yPercent: -3 }, { yPercent: 3, ease: EASE.linear, immediateRender: false, scrollTrigger: scrub("#financiacion", "top bottom", "bottom top") });
    }

    /* Líneas verticales decorativas: se «dibujan» con el avance. */
    qsa(".xr").forEach((line) => {
      gsap.fromTo(line, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(line, "top 94%", "top 62%") });
    });

    /* Cómo comprar: los pasos se «encienden» de a uno, con lectura guiada. */
    qsa("#como-comprar .stp li, #operaciones .stp li").forEach((step) => {
      gsap.fromTo(step, { opacity: 0.2, x: desktop ? -40 : -14 }, { opacity: 1, x: 0, ease: EASE.linear, immediateRender: true, scrollTrigger: scrub(step, "top 92%", "top 58%") });
    });
  });
  return () => { undo.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   ODÓMETRO (firma 3) · los números giran como tablero de kilometraje
   El DOM se arma al entrar y se restituye al terminar: el valor final es el texto original.
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initOdometer() {
  const ctx = gsap.context(() => {
    const targets = [...qsa("#nosotros .ns b"), ...qsa("#trayectoria .ary")].filter((el) => /\d/.test(el.textContent));
    targets.forEach((el, index) => {
      once(el, "top 90%", () => {
        const text = el.textContent;
        if (!/\d/.test(text) || el.dataset.od) return;
        el.dataset.od = "1";
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
        const sr = document.createElement("span"); sr.className = "sr"; sr.textContent = text;
        const visual = document.createElement("span"); visual.setAttribute("aria-hidden", "true"); visual.style.cssText = "display:inline-flex;white-space:pre";
        const columns = [];
        [...text].forEach((ch) => {
          if (!/\d/.test(ch)) { const span = document.createElement("span"); span.textContent = ch; visual.appendChild(span); return; }
          const col = document.createElement("span");
          col.style.cssText = `display:inline-block;overflow:hidden;height:${lh}px;vertical-align:top`;
          const rail = document.createElement("span");
          rail.style.cssText = "display:block;will-change:transform";
          for (let n = 0; n < 20; n++) { const row = document.createElement("span"); row.style.cssText = `display:block;height:${lh}px;line-height:${lh}px;text-align:center`; row.textContent = String(n % 10); rail.appendChild(row); }
          col.appendChild(rail); visual.appendChild(col); columns.push({ rail, digit: +ch });
        });
        el.textContent = ""; el.append(sr, visual);
        const done = () => { el.textContent = text; delete el.dataset.od; };
        const tl = gsap.timeline({ delay: index % 4 === 3 ? 0.1 : 0, onComplete: done });
        columns.forEach(({ rail, digit }, i) => tl.fromTo(rail, { y: 0 }, { y: -(10 + digit) * lh, duration: 1.7 + i * 0.22, ease: "expo.out" }, i * 0.1));
      });
    });
  });
  return () => ctx.revert();
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   MICROINTERACCIONES · botones, enlaces, tarjetas, acordeones
   Delegación de eventos (las tarjetas se repintan con los filtros). Mouse: magnetismo, inclinación,
   rebotes. Touch: solo feedback de presión.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const MAGNETIC = "[data-magnetic], .btn.p, nav a, .hv + .ha .btn, .vqb, footer .soc a";
const TILT = ".oc, .pdc, .rvc, .vqb";
const ICON = "header .ic";

function initInteractions({ desktop, fine }) {
  const off = [];
  const undo = [];
  const on = (target, type, fn, options) => { target.addEventListener(type, fn, options); off.push(() => target.removeEventListener(type, fn, options)); };
  const closest = (event, selector) => event.target.closest?.(selector);

  const ctx = gsap.context(() => {
    /* Presión: todos los botones, también en touch. */
    on(document, "pointerdown", (event) => {
      const button = closest(event, "button:not(:disabled), .btn");
      if (!button) return;
      gsap.to(button, { scale: 0.955, duration: 0.12, ease: "power2.out", overwrite: "auto" });
      const release = () => gsap.to(button, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
      ["pointerup", "pointercancel", "pointerleave"].forEach((type) => button.addEventListener(type, release, { once: true }));
    }, true);

    /* Acordeones (<details>): el contenido entra en cascada; el layout cambia → refresh agrupado. */
    let refreshTimer = 0;
    on(document, "toggle", (event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement)) return;
      if (details.open) {
        const kids = [...details.children].filter((el) => el.tagName !== "SUMMARY");
        const items = kids.flatMap((el) => (el.matches("ul, ol") ? [...el.children] : [el]));
        gsap.fromTo(items, { opacity: 0, y: -14, x: -10 }, { opacity: 1, y: 0, x: 0, duration: 0.7, ease: EASE.soft, stagger: 0.045, clearProps: "opacity,transform" });
      }
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 320);
    }, true);
    off.push(() => clearTimeout(refreshTimer));

    if (!fine) return;

    /* Magnético: el elemento sigue al puntero dentro de un radio corto, con tope y retorno elástico. */
    const magnets = new WeakMap();
    const magnet = (el) => {
      if (!magnets.has(el)) magnets.set(el, { x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }), rect: null, nav: el.matches("nav a") });
      return magnets.get(el);
    };
    on(document, "pointerover", (event) => { const el = closest(event, MAGNETIC); if (el) magnet(el).rect = el.getBoundingClientRect(); }, { passive: true });
    on(document, "pointermove", (event) => {
      const el = closest(event, MAGNETIC);
      if (!el) return;
      const m = magnet(el); if (!m.rect) m.rect = el.getBoundingClientRect();
      const dx = event.clientX - (m.rect.left + m.rect.width / 2), dy = event.clientY - (m.rect.top + m.rect.height / 2);
      const s = m.nav ? 0.18 : 0.3;
      m.x(clamp(dx * s, -14, 14)); m.y(clamp(dy * s * 1.15, -10, 10));
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const el = closest(event, MAGNETIC);
      if (!el || el.contains(event.relatedTarget)) return;
      const m = magnet(el); m.rect = null; gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.42)", overwrite: "auto" });
    }, { passive: true });

    /* Botones no magnéticos: elevación corta. */
    const plain = (event) => { const b = closest(event, ".btn"); return b && !b.matches(MAGNETIC) ? b : null; };
    on(document, "pointerover", (event) => { const b = plain(event); if (b && !b.contains(event.relatedTarget)) gsap.to(b, { y: -2, duration: 0.4, ease: EASE.soft, overwrite: "auto" }); }, { passive: true });
    on(document, "pointerout", (event) => { const b = plain(event); if (b && !b.contains(event.relatedTarget)) gsap.to(b, { y: 0, duration: 0.6, ease: EASE.settle, overwrite: "auto" }); }, { passive: true });

    /* Tarjetas de stock: elevación + inclinación suave + la foto sigue al puntero (profundidad interior). */
    const cardFx = new WeakMap();
    const car = (el) => {
      if (!cardFx.has(el)) {
        gsap.set(el, { transformPerspective: 1000 });
        const ct = qs(".ct", el);
        cardFx.set(el, { rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" }), ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" }), ct, cx: ct && gsap.quickTo(ct, "x", { duration: 0.8, ease: "power3.out" }), cy: ct && gsap.quickTo(ct, "y", { duration: 0.8, ease: "power3.out" }) });
      }
      return cardFx.get(el);
    };
    on(document, "pointerover", (event) => {
      const card = closest(event, ".car");
      if (!card || card.dataset.mr || card.contains(event.relatedTarget)) return;
      gsap.to(card, { y: -9, duration: 0.6, ease: EASE.soft, overwrite: "auto" });
      const f = car(card); if (f.ct) gsap.to(f.ct, { scale: 1.06, duration: 0.9, ease: EASE.soft, overwrite: false });
    }, { passive: true });
    on(document, "pointermove", (event) => {
      const card = closest(event, ".car");
      if (!card || card.dataset.mr) return;
      const r = card.getBoundingClientRect(), f = car(card);
      const nx = (event.clientX - r.left) / r.width - 0.5, ny = (event.clientY - r.top) / r.height - 0.5;
      f.ry(nx * 5); f.rx(ny * -4); f.cx?.(nx * -10); f.cy?.(ny * -8);
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const card = closest(event, ".car");
      if (!card || card.contains(event.relatedTarget)) return;
      const f = car(card);
      gsap.to(card, { y: 0, rotationX: 0, rotationY: 0, duration: 0.9, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
      if (f.ct) { gsap.to(f.ct, { scale: 1, x: 0, y: 0, duration: 0.9, ease: EASE.settle, overwrite: "auto" }); }
    }, { passive: true });

    /* Operaciones / precio / reseñas / accesos del local: plano que se inclina hacia el puntero. */
    const tilts = new WeakMap();
    const tilt = (el) => {
      if (!tilts.has(el)) { gsap.set(el, { transformPerspective: 900 }); tilts.set(el, { rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" }), ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" }) }); }
      return tilts.get(el);
    };
    on(document, "pointermove", (event) => {
      const el = closest(event, TILT);
      if (!el) return;
      const r = el.getBoundingClientRect(), t = tilt(el);
      t.ry(((event.clientX - r.left) / r.width - 0.5) * 7); t.rx(((event.clientY - r.top) / r.height - 0.5) * -6);
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const el = closest(event, TILT);
      if (!el || el.contains(event.relatedTarget)) return;
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.1, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
    }, { passive: true });

    /* Foto de cada operación: zoom manejado por JS (el CSS lo anulamos porque el scrub controla transform). */
    on(document, "pointerover", (event) => {
      const card = closest(event, ".oc"); if (!card || card.contains(event.relatedTarget)) return;
      const img = qs(".oi img", card); if (img) gsap.to(img, { scale: 1.32, duration: 1.1, ease: EASE.soft, overwrite: "auto" });
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const card = closest(event, ".oc"); if (!card || card.contains(event.relatedTarget)) return;
      const img = qs(".oi img", card); if (img) gsap.to(img, { scale: 1.22, duration: 1, ease: EASE.settle, overwrite: "auto" });
    }, { passive: true });

    /* Flechas de galería / carrusel: la flecha «empuja» hacia su sentido. */
    on(document, "pointerover", (event) => {
      const arrow = closest(event, ".g-a:not(:disabled)"); if (!arrow || arrow.contains(event.relatedTarget)) return;
      const svg = qs("svg", arrow); if (svg) gsap.to(svg, { x: arrow.classList.contains("l") ? -4 : 4, duration: 0.35, ease: EASE.soft, overwrite: "auto" });
    }, { passive: true });
    on(document, "pointerout", (event) => {
      const arrow = closest(event, ".g-a"); if (!arrow || arrow.contains(event.relatedTarget)) return;
      const svg = qs("svg", arrow); if (svg) gsap.to(svg, { x: 0, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
    }, { passive: true });

    /* ROLL del menú: al apuntar, cada letra sube y es reemplazada por su copia que entra desde abajo (escalonado).
       La copia es aria-hidden y el enlace conserva su nombre accesible; al limpiar se restituye el texto original. */
    qsa("header nav a").forEach((link) => {
      const original = link.textContent;
      if (link.children.length || !original.trim()) return;
      const hadLabel = link.hasAttribute("aria-label");
      const letters = (value) => [...value].map((ch) => { const c = document.createElement("span"); c.style.cssText = "display:inline-block;will-change:transform"; c.textContent = ch === " " ? "\u00a0" : ch; return c; });
      const wrap = document.createElement("span"); wrap.style.cssText = "position:relative;display:block;overflow:hidden;white-space:pre";
      const top = document.createElement("span"); top.style.display = "block"; top.setAttribute("aria-hidden", "true");
      const bottom = document.createElement("span"); bottom.style.cssText = "position:absolute;left:0;top:0;display:block"; bottom.setAttribute("aria-hidden", "true");
      const a = letters(original.trim()), b = letters(original.trim());
      top.append(...a); bottom.append(...b); wrap.append(top, bottom);
      if (!hadLabel) link.setAttribute("aria-label", original.trim());
      link.textContent = ""; link.append(wrap);
      gsap.set(b, { yPercent: 115 });
      const roll = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "power3.inOut" } })
        .to(a, { yPercent: -115, stagger: 0.018 }, 0)
        .to(b, { yPercent: 0, stagger: 0.018 }, 0);
      const play = () => roll.timeScale(1).play();
      const back = () => roll.timeScale(1.5).reverse();
      on(link, "pointerenter", play); on(link, "pointerleave", back);
      on(link, "focus", () => { if (link.matches(":focus-visible")) play(); }); on(link, "blur", back);
      undo.push(() => { roll.kill(); link.textContent = original; if (!hadLabel) link.removeAttribute("aria-label"); });
    });

    /* Enlaces del pie: empujan hacia la derecha y vuelven con rebote. */
    qsa("footer .fx a").forEach((link) => {
      on(link, "pointerenter", () => gsap.to(link, { x: 8, duration: 0.45, ease: EASE.soft, overwrite: "auto" }));
      on(link, "pointerleave", () => gsap.to(link, { x: 0, duration: 0.9, ease: "elastic.out(1, 0.5)", overwrite: "auto" }));
    });

    /* Iconos del header: giro corto con rebote. */
    qsa(ICON).forEach((icon) => {
      const svg = qs("svg", icon); if (!svg) return;
      on(icon, "pointerenter", () => gsap.to(svg, { scale: 1.18, rotate: -9, duration: 0.5, ease: EASE.spring, overwrite: "auto" }));
      on(icon, "pointerleave", () => gsap.to(svg, { scale: 1, rotate: 0, duration: 0.6, ease: EASE.settle, overwrite: "auto" }));
    });

    /* Panel de modelos: la foto grande se desplaza con el puntero. */
    const panel = qs("#mdf");
    if (panel && desktop) {
      const move = gsap.quickTo(panel, "rotationY", { duration: 0.8, ease: "power3.out" }), tiltX = gsap.quickTo(panel, "rotationX", { duration: 0.8, ease: "power3.out" });
      gsap.set(panel, { transformPerspective: 1100 });
      on(panel, "pointermove", (event) => { const r = panel.getBoundingClientRect(); move(((event.clientX - r.left) / r.width - 0.5) * 6); tiltX(((event.clientY - r.top) / r.height - 0.5) * -5); }, { passive: true });
      on(panel, "pointerleave", () => { move(0); tiltX(0); }, { passive: true });
    }
  });
  return () => { off.forEach((fn) => fn()); undo.forEach((fn) => fn()); ctx.revert(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   CURSOR (firma 6) · anillo con estados, estiramiento direccional y reacción a la velocidad
   Solo mouse. El label usa los estilos del CSS existente (.motion-cursor).
   ════════════════════════════════════════════════════════════════════════════════════════ */
const CURSOR_TARGETS = "a, button, summary, select, input, textarea, label, [role='button'], [data-gal], .hv, .mp, .ct";
const CURSOR_STATES = {
  default: { scale: 0.62, label: "" },
  link: { scale: 1, label: "↗" },
  button: { scale: 1.05, label: "+" },
  image: { scale: 1.9, label: "Ver" },
  drag: { scale: 2.1, label: "Arrastrar" },
  map: { scale: 1.9, label: "Mover" },
  field: { scale: 0.42, label: "" }
};

function initCursor(inertia) {
  if (!document.body) return noop;
  const cursor = document.createElement("div");
  cursor.className = "motion-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="motion-cursor__dot"></span><span class="motion-cursor__label"></span>';
  document.body.append(cursor);
  root.classList.add("cur-on");
  const dot = cursor.querySelector(".motion-cursor__dot"), label = cursor.querySelector(".motion-cursor__label");

  const view = { base: CURSOR_STATES.default.scale, stretch: 0, angle: 0 };
  let visible = false, pressed = false, current = "default", lastX = 0, lastY = 0;
  const off = [];
  const ctx = gsap.context(() => {});
  ctx.add(() => {
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
    const y = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });
    const setDot = gsap.quickSetter(dot, "css");

    /* Un solo ticker compone escala de estado + estiramiento por movimiento + estiramiento por scroll. */
    const paint = () => {
      const sv = Math.abs(inertia?.state.v || 0);
      const scrollStretch = clamp(sv / 38, 0, 0.5);
      const s = view.base * (pressed ? 0.8 : 1);
      setDot({ rotation: view.angle, scaleX: s * (1 + view.stretch), scaleY: s * (1 - view.stretch * 0.45 + scrollStretch) });
      view.stretch *= 0.86;
    };
    gsap.ticker.add(paint);
    off.push(() => gsap.ticker.remove(paint));

    const apply = (name) => {
      const s = CURSOR_STATES[name];
      gsap.to(view, { base: s.scale, duration: 0.5, ease: "back.out(1.6)", overwrite: "auto" });
      label.textContent = s.label;
      cursor.dataset.state = name;
    };
    const set = (name) => { if (name === current) return; current = name; apply(name); };

    const move = (event) => {
      if (!visible) { visible = true; gsap.set(cursor, { x: event.clientX, y: event.clientY }); lastX = event.clientX; lastY = event.clientY; gsap.to(cursor, { opacity: 1, duration: 0.3 }); }
      x(event.clientX); y(event.clientY);
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      if (speed > 1.5) { view.angle = Math.atan2(dy, dx) * 180 / Math.PI; view.stretch = Math.max(view.stretch, clamp(speed / 70, 0, 0.42)); }
      lastX = event.clientX; lastY = event.clientY;
    };
    const over = (event) => {
      const t = event.target.closest?.(CURSOR_TARGETS);
      if (!t) return set("default");
      if (t.matches("input, textarea, select, label")) return set("field");
      if (t.matches(".hv")) return set("drag");
      if (t.matches(".ct, [data-gal]")) return set("image");
      if (t.matches(".mp")) return set("map");
      if (t.matches("button, [role='button'], summary, .btn")) return set("button");
      set("link");
    };
    const down = () => { pressed = true; };
    const up = () => { pressed = false; };
    const leave = () => { visible = false; gsap.to(cursor, { opacity: 0, duration: 0.25 }); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    root.addEventListener("mouseleave", leave, { passive: true });
    off.push(() => {
      document.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down); document.removeEventListener("pointerup", up);
      root.removeEventListener("mouseleave", leave);
    });
  });
  return () => { off.forEach((fn) => fn()); ctx.revert(); root.classList.remove("cur-on"); cursor.remove(); };
}

/* ════════════════════════════════════════════════════════════════════════════════════════
   ARRANQUE · gsap.matchMedia decide qué corre en cada contexto y revierte todo al cambiar
   ════════════════════════════════════════════════════════════════════════════════════════ */
function initMotion() {
  const mm = gsap.matchMedia();

  mm.add(MQ, (context) => {
    const { motion, desktop, fine } = context.conditions;
    if (!motion) { root.classList.remove("mh"); return undefined; }          // reduced-motion: contenido intacto
    const flags = { desktop, fine };
    const home = !!(qs(".hero") && qs("#unidades"));                         // la coreografía narrativa es de la home

    const scroll = initScroll(flags);
    const { inertia } = scroll;

    /* Orden = orden de la página (ScrollTrigger mide los pines en secuencia; el hero tiene prioridad). */
    const cleanups = [
      initNavigation(),
      home ? initHero(flags, scroll) : null,
      home ? initBanner(flags) : null,
      home ? initTypography(flags, inertia) : null,
      home ? initSeams(flags) : null,
      home ? initReveals(flags, inertia) : null,
      home ? initParallax(flags) : null,
      home ? initOdometer() : null,
      initInteractions(flags),
      fine && desktop ? initCursor(inertia) : null
    ];
    ScrollTrigger.sort();

    /* Layout tardío (fuentes, imágenes lazy, iframe del mapa): un refresh agrupado, no uno por evento. */
    let refreshTimer = 0;
    const refresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 140); };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    /* Cambios de alto del documento (acordeones, filtros, lazy): refresh solo si el alto realmente cambió. */
    const main = qs("main");
    let lastHeight = main ? main.offsetHeight : 0, resizeObserver = null;
    if (main && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        const height = main.offsetHeight;
        if (Math.abs(height - lastHeight) > 3) { lastHeight = height; refresh(); }
      });
      resizeObserver.observe(main);
    }

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", refresh);
      resizeObserver?.disconnect();
      cleanups.reverse().forEach((fn) => typeof fn === "function" && fn());
      scroll.dispose();
    };
  });

  /* bfcache: al volver con «atrás» se recalculan las posiciones. */
  const onShow = (event) => { if (event.persisted) ScrollTrigger.refresh(); };
  window.addEventListener("pageshow", onShow);
  return () => { window.removeEventListener("pageshow", onShow); mm.revert(); };
}

/* ── Modo de movimiento + arranque ──────────────────────────────────────────────────────── */
const syncMotionMode = () => {
  root.classList.toggle("m", !reduceMotion.matches);
  root.classList.toggle("cm-reduce", reduceMotion.matches);
  root.dataset.motion = reduceMotion.matches ? "reduced" : "full";
  if (reduceMotion.matches) root.classList.remove("mh");
};
syncMotionMode();
reduceMotion.addEventListener?.("change", syncMotionMode);

let dispose = noop;
const start = () => { dispose = initMotion(); };
/* El módulo corre antes de DOMContentLoaded: se espera un frame para que los scripts inline ya hayan armado stock, modelos y comparador. */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(start), { once: true });
else requestAnimationFrame(start);
window.addEventListener("pagehide", (event) => { if (!event.persisted) dispose(); }, { once: true });
