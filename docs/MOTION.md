# Sistema de movimiento · Motion + Web Platform

El sitio es estático y conserva su HTML/CSS aprobado. El motor JavaScript está en `js/motion/` y se carga como ESM desde versiones fijas de Motion y Three.js.

## Capas

1. **CSS Scroll-Driven Animations** para progreso, parallax y reveals ligados directamente al scroll.
2. **Motion** (`animate`, `inView`, `scroll`, `animateView`) para entradas, estados interactivos, escenas y cambios coordinados.
3. **WAAPI** a través de Motion para animaciones simples, aceleradas por compositor e interrumpibles.
4. **WebGL ambiental** (`webgl.js`) para una luz procedural sutil en el hero; usa un solo plano, pixel ratio limitado, IntersectionObserver y cleanup.
5. **View Transition API** para navegación entre documentos y cambios de ficha cuando el navegador la soporta.
6. **Fallback nativo**: si una API no existe o WebGL no está disponible, el DOM sigue funcionando sin animación decorativa.

## Arquitectura

- `js/motion/core.js`: tokens, imports ESM, reduced-motion, lifecycle y helpers compartidos.
- `js/motion/reveal.js`: entradas progresivas con `inView()` y stagger.
- `js/motion/scroll.js`: CSS-first, fallback `scroll()` y variables de progreso, velocidad y dirección.
- `js/motion/interactions.js`: presión, magnetismo acotado y respuesta de puntero del hero, solo cuando aporta.
- `js/motion/webgl.js`: atmósfera procedural pausada fuera de viewport y liberación de recursos.
- `js/motion/transitions.js`: navegación y View Transitions con fallback de navegación normal.
- `js/motion.js`: entrypoint común de las páginas estáticas.
- `js/viaje.js` y `js/reserva.js`: estados propios de sus experiencias, con animaciones cancelables.

## Reglas

- No se animan propiedades de layout de forma continua; se priorizan `transform`, `opacity`, `clip-path` y variables CSS.
- La velocidad del scroll se suaviza y se expone como variables CSS; nunca bloquea el scroll nativo.
- Los CTAs principales pueden responder magnéticamente en mouse, con límites y retorno spring; touch y teclado mantienen la ruta nativa.
- `prefers-reduced-motion: reduce` mantiene contenido, navegación, formularios y acciones, pero elimina movimiento y WebGL decorativo.
- Las escenas y efectos interrumpen controles anteriores antes de iniciar uno nuevo.
- Mouse y touch tienen rutas equivalentes; el scroll nativo no se bloquea salvo el gesto explícito del recorrido.
- No se convierte el repositorio en SPA y no se incorporan librerías adicionales fuera de las capas solicitadas.

## Validación manual

1. Abrir `index.html`, `viaje.html` y `reserva.html` en Chromium.
2. Probar 1920, 1440, 1280, 430 y 390 px.
3. Probar teclado, touch, cambio de vehículo, galería, comparador, formularios, ruta y reserva.
4. Activar reduced motion y confirmar que todo sigue visible y usable.
5. Revisar consola, canvas WebGL, pausas fuera de viewport y long tasks/layout shifts.
