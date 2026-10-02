# Sistema de experiencia

El sitio conserva su HTML, identidad visual, contenido y arquitectura semántica, pero ahora se comporta como un objeto digital: el puntero, la velocidad, la dirección, el scroll y la proximidad alimentan al DOM y a WebGL desde un mismo estado.

## Núcleo

- `js/motion/sensor.js`: estado sensorial global (`pointerX`, `pointerY`, velocidades, dirección, progreso, sección activa, target, proximidad, intensidad y capacidad del dispositivo). Publica `window.chitaSensory` y variables CSS `--sensor-*`.
- `js/motion/interactions.js`: campos de fuerza continuos. Los CTA responden con magnetismo; cards, operaciones y superficies adquieren profundidad contextual; el efecto disminuye con la distancia y vuelve por resorte.
- `js/motion/webgl.js`: superficie Three.js procedural en el hero. La energía del scroll, el movimiento del puntero, la proximidad y el tiempo deforman el campo de luz; no es una textura ornamental independiente.
- `js/motion/scroll.js`: energía de scroll suavizada, dirección, aceleración y progreso expuestos al resto del sistema.
- `js/motion.js`: lifecycle único, cleanup en `pagehide`, pausa con `document.hidden` y sincronización de reduced motion.

## Momentos de interacción

1. **Hero despierto**: el movimiento cercano modifica atmósfera, profundidad de fotografía y copy simultáneamente.
2. **Campo magnético**: los llamados a la acción empiezan a responder antes del hover y con intensidad proporcional a la proximidad.
3. **Cards con peso**: las tarjetas de unidades y operaciones inclinan su plano, desplazan internamente la imagen y recuperan su posición sin saltos.
4. **Scroll como energía**: velocidad y dirección cambian el pulso del campo WebGL y la tensión de las superficies.

## Rendimiento y accesibilidad

- Un solo RAF para el estado sensorial; se escriben variables CSS y no se crean animaciones Motion por cada `pointermove`.
- WebGL usa un plano, pixel ratio adaptativo, `IntersectionObserver`, pausa fuera de viewport y liberación explícita de geometría, material, renderer y listeners.
- Mobile conserva la narrativa a través de touch y scroll, sin cursor artificial ni tilt permanente.
- `prefers-reduced-motion: reduce` mantiene contenido, enlaces, formularios y navegación; elimina WebGL, fuerzas y movimiento automático.
- No se instala ni importa GSAP.
