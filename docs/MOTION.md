# Sistema de movimiento

**GSAP = motor · ScrollTrigger = narrativa · Lenis = scroll.** Todo vive en `js/motion.js` (un solo archivo, módulo ES). Importa únicamente `js/vendor/gsap-stack.js` (GSAP + ScrollTrigger + Lenis, mismo origen). `viaje.js` y `reserva.js` usan `js/motion/core.js` y `js/motion/vendor.js`.

## Cómo está organizado `js/motion.js`

- Una función `scene(id, fn)` por sección: busca `document.getElementById(id)` y, si no existe, no hace nada. Por eso quitar una sección del HTML no rompe el motion.
- Escenas definidas: unidades, modelos, versus, nosotros, contacto, local, opiniones, como-comprar, financiacion, operaciones, guia, visita, preguntas. Las de `trayectoria`, `bd` y `equipo` quedaron sin efecto porque esas secciones se retiraron (ver `golive/TRAYECTORIA-RETIRADA.md` y `golive/BLOQUES-RETIRADOS.md`).
- Respeta `prefers-reduced-motion`: sin animación, solo el estado final.

## Para modificarlo

1. Probar siempre con reduced-motion activado y desactivado.
2. Las tarjetas de stock se vuelven a dibujar por JS: tras un cambio de stock hace falta `ScrollTrigger.refresh()`.
3. El hero emite `chita:hero` y Vender/permutar emite `chita:vr`; `index.html` los dispara y `motion.js` los anima.
