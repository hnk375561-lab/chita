import { transition, reduceMotion } from "./core.js";

export function initViewTransitions() {
  if (document.startViewTransition) {
    document.documentElement.classList.add("has-view-transitions");
  }
  // Las navegaciones entre documentos quedan nativas: Chromium aplica
  // `@view-transition { navigation: auto }` sin secuestrar teclado, touch ni historial.

  const dialog = document.querySelector("dialog");
  if (dialog && !reduceMotion.matches) {
    window.chitaOpenDialog = (update) => transition(update, [".fcg", ".fch"]);
  }
}

export function animateStateChange(update, selectors = []) {
  return transition(update, selectors);
}
