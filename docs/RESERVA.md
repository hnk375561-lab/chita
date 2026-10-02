# Reservá tu momento

Nueva experiencia independiente en [`/reserva.html`](../reserva.html). La homepage actual (`index.html`) se conserva sin cambios.

## Configuración

Los datos editables viven en `CONFIG` al inicio de `js/reserva.js`: dirección, WhatsApp, días habilitados y slots configurables. La interfaz siempre habla de **consulta de visita** y no promete confirmación.

## Decisiones de rendimiento

1. El calendario usa un máximo de 42 celdas y reutiliza el contenedor al cambiar de mes.
2. Las animaciones se limitan a `transform`, `opacity` y una única capa diagonal fullscreen.
3. No hay blur, sombras animadas, gradientes decorativos ni trackers.
4. Los controles de calendario son botones semánticos con `aria-current`, `aria-selected` y `aria-disabled`.
5. Las flechas de teclado, Escape, Enter, touch y drag vertical tienen rutas equivalentes.
6. La selección de horarios usa Pointer Events y `setPointerCapture`.
7. Mobile usa una composición propia con `100svh`, targets amplios y botón fijo dentro del safe area.
8. `prefers-reduced-motion` desactiva scrub, escalas y wipe manteniendo todas las funciones.
9. `?debug=1` activa un medidor FPS simple; por defecto no se agrega al DOM.
10. La entrega es estática y no incluye backend: WhatsApp recibe una consulta prearmada sujeta a disponibilidad.
