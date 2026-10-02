import { transition, animate, reduceMotion, qsa } from "./core.js";

export function initViewTransitions() {
  if ("viewTransition" in document.documentElement.style) {
    document.documentElement.classList.add("has-view-transitions");
  }
  qsa("a[href$='.html'], a[href='./'], a[href='index.html']").forEach((link) => {
    if (link.target || link.origin !== location.origin || reduceMotion.matches) return;
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!document.startViewTransition) return;
      event.preventDefault();
      const destination = link.href;
      transition(() => { location.href = destination; }, []);
    });
  });

  const dialog = document.querySelector("dialog");
  if (dialog) {
    window.chitaOpenDialog = (update) => transition(update, [".fcg", ".fch"]);
  }
}

export function animateStateChange(update, selectors = []) {
  return transition(update, selectors);
}
