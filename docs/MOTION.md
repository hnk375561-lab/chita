# Sistema de movimiento · Motion + Web Platform

El sitio es estático y conserva su HTML/CSS aprobado. El motor JavaScript está en `js/motion/` y se carga como ESM desde una versión fija de Motion for JavaScript.

## Capas

1. **CSS Scroll-Driven Animations** para progreso, parallax y reveals ligados directamente al scroll.
2. **Motion** (`animate`, `inView`, `scroll`, `animateView`) para entradas, estados interactivos, escenas y cambios coordinados.
3. **WAAPI** a través de Motion para animaciones simples, aceleradas por compositor e interrumpibles.
4. **View Transition API** para navegación entre documentos y cambios de ficha cuando el navegador la soporta.
5. **Fallback nativo**: si una API no existe, el DOM sigue funcionando sin animación.

## Arquitectura

- `js/motion/core.js`: tokens, imports ESM, reduced-motion, helpers de animación y transición.
- `js/motion/reveal.js`: entradas progresivas con `inView()`.
- `js/motion/scroll.js`: CSS-first y fallback `scroll()` para progreso/parallax.
- `js/motion/interactions.js`: presión y microinteracciones de puntero, solo cuando aportan feedback.
- `js/motion/transitions.js`: navegación y View Transitions con fallback de navegación normal.
- `js/motion.js`: entrypoint común de las páginas estáticas.
- `js/viaje.js` y `js/reserva.js`: estados propios de sus experiencias, con animaciones cancelables.

## Reglas

- No se animan propiedades de layout de forma continua; se priorizan `transform`, `opacity`, `clip-path` y variables CSS.
- `prefers-reduced-motion: reduce` mantiene contenido, navegación, formularios y acciones, pero elimina el movimiento.
- Las escenas interrumpen controles anteriores antes de iniciar uno nuevo.
- Mouse y touch tienen rutas equivalentes; el scroll nativo no se bloquea salvo el gesto explícito del recorrido.
- No se convierte el repositorio en SPA y no se incorporan librerías adicionales.

## Validación manual

1. Abrir `index.html`, `viaje.html` y `reserva.html` en Chromium.
2. Probar 1920, 1440, 1280, 430 y 390 px.
3. Probar teclado, touch, cambio de vehículo, galería, comparador, formularios, ruta y reserva.
4. Activar reduced motion y confirmar que todo sigue visible y usable.
5. Revisar consola y medir long tasks/layout shifts en DevTools.
