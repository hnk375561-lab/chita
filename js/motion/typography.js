/* Dirección tipográfica. Tres tratamientos, cada uno con su lógica:
   · títulos de sección → palabras enmascaradas que suben (expo, una vez)
   · declaraciones (.xl) → lectura por scroll: las palabras se encienden con el avance
   · título del banner → letras con scrub (lo gobierna sections.js, que pinea la escena) */
import { gsap, ScrollTrigger } from "./vendor.js";
import { qsa, EASE } from "./core.js";

const WORD = "mo-w", INNER = "mo-i", CHAR = "mo-c";

/* Parte un nodo en palabras (y opcionalmente letras) sin perder <em>/<br>. Idempotente. */
export function split(element, { chars = false, skip = null } = {}) {
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

export function initTypography({ desktop }) {
  const ctx = gsap.context(() => {
    /* 1 · Títulos de sección: cada uno sube con su propia inercia según el contexto. */
    qsa("main section h2").forEach((heading) => {
      if (heading.closest("#bd, [hidden]") || heading.querySelector("img,svg,button,a")) return;
      const words = split(heading);
      if (!words.length || words.length > 24) return;
      const inVs = !!heading.closest("#versus");
      gsap.set(words, { yPercent: 118, rotate: inVs ? 0 : 3.5, transformOrigin: "0% 100%" });
      ScrollTrigger.create({
        trigger: heading,
        start: desktop ? "top 88%" : "top 94%",
        once: true,
        onEnter: () => gsap.to(words, {
          yPercent: 0, rotate: 0,
          duration: inVs ? 1.25 : 1.05,
          ease: EASE.expo,
          stagger: { each: desktop ? 0.05 : 0.035 }
        })
      });
    });

    /* 2 · Declaraciones (.xl): el scroll las "lee" palabra por palabra. */
    qsa(".xl, .xb .xp").forEach((statement) => {
      const words = split(statement);
      if (!words.length) return;
      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, {
        opacity: 1,
        ease: EASE.linear,
        stagger: 0.12,
        scrollTrigger: {
          trigger: statement,
          start: desktop ? "top 82%" : "top 90%",
          end: desktop ? "bottom 48%" : "bottom 62%",
          scrub: true
        }
      });
    });
  });
  return () => ctx.revert();
}
