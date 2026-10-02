# Sistema de movimiento

**GSAP = motor · ScrollTrigger = narrativa · Lenis = scroll.** Sin Motion, Three.js, WebGL ni shaders. El HTML, la identidad visual, el copy y la estructura no cambian: solo el movimiento.

## Arquitectura (`js/motion/`)

| Archivo | Responsabilidad |
|---|---|
| `vendor.js` | Única puerta al stack. Importa `js/vendor/gsap-stack.js` (gsap 3.13.0 + ScrollTrigger + Lenis 1.3.11, mismo origen). |
| `index.js` | Punto de entrada. `gsap.matchMedia()` decide qué corre: reduced-motion, mobile, desktop + mouse. Revierte todo al cambiar la condición. |
| `scroll.js` | Lenis → `gsap.ticker` → `ScrollTrigger.update`. Anclas (`#sección`) con offset del header, bloqueo con la ficha abierta. Touch queda nativo. |
| `navigation.js` | Sombra del header, ocultamiento por dirección (mobile) y scrollspy del menú. |
| `hero.js` | Entrada cinematográfica, salida por capas, profundidad por puntero y cambio de unidad. |
| `typography.js` | Palabras enmascaradas en títulos; declaraciones (`.xl`) que se "leen" con el scroll. |
| `reveals.js` | Revelados por familia (stock, operaciones, reseñas, precio, textos, pie). |
| `parallax.js` | Capas con velocidad propia (foto de Nosotros, mapa, fachada, columnas de precio) y skew por velocidad de scroll. |
| `sections.js` | Banner con pin, Comparar, wipes de Nosotros, ventana del recorrido, pasos de compra, cierre. |
| `slides.js` | Cortina de máscara compartida por el hero (`chita:hero`) y Vender/permutar (`chita:vr`). |
| `interactions.js` | Presión en botones, CTAs magnéticos (`quickTo`), elevación de tarjetas, inclinación, iconos. |
| `cursor.js` | Cursor del sitio con estados por contexto y estiramiento por velocidad. Solo mouse. |
| `core.js` | Utilidades, condiciones `MQ` y easings. |

`js/motion.js` solo sincroniza las clases `m` / `cm-reduce` y arranca `initMotion()`.

## Momentos firma

1. **Hero**: marco de la foto que se abre con cortina, título por palabras, CTAs y header en secuencia; al scrollear, cada capa sale a distinta velocidad.
2. **Banner pineado** (`#bd`, único pin): el scroll arma la escena letra por letra.
3. **Recorrido del local**: el video llega como ventana chica y se abre hasta llenar su marco.
4. **Declaraciones tipográficas** (`.xl`): las palabras se encienden con el avance.
5. **CTAs magnéticos + cursor**: respuesta precisa al puntero, sin "huir".

## Reglas

- Solo `transform`, `opacity` y `clip-path` (wrappers, no `<img>` salvo dentro de su máscara).
- Nada de `getBoundingClientRect()` por frame: los rects se miden al entrar al elemento.
- `prefers-reduced-motion`: no se oculta ni se mueve nada; el contenido y la navegación quedan intactos.
- Mobile: sin pin, sin mouse effects, distancias de parallax al 45 %, scroll del dedo nativo.
- Red de seguridad: si el JS no carga, `index.html` libera el estado inicial del hero a los 4 s (`.mh`).
