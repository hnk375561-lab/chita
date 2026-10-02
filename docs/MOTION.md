# Sistema de movimiento (GSAP) · catálogo

La página activa de `index.html` centraliza su motion en `js/live-motion.js`: GSAP + ScrollTrigger cargan desde `vendor/`, con timelines de entrada, scrub de hero, parallax de transición y microinteracciones de puntero. El stack alternativo de catálogo vive en `js/motion.js` y `js/recorrido.js`. Si GSAP falla o el usuario pide menos movimiento, el sitio queda **completo y visible, sin animación**.

## Reglas del sistema (no romperlas al agregar cosas)
1. **Un gesto por tipo de elemento**: fotos → máscara `clip-path` + escala 1.1→1; títulos → por palabra con sesgo; bajadas/bloques → subida corta; todo entra con `expo.out`, las máscaras con `expo.inOut`.
2. **Solo `transform`, `opacity` y `clip-path`** (única excepción: la altura del acordeón de Preguntas). Nada de `top/left/width/height` animados.
3. **`clip-path` siempre `inset()` de 4 valores en `%`**: GSAP no interpola `0` con `0%` y la máscara salta al final.
4. **Sin smooth-scroll ni scroll-jacking.** Las anclas viajan con ScrollTo (`expo.inOut`) pero la rueda o el toque las interrumpen.
5. **Escala siempre uniforme y vuelve a 1**: nunca deforma fotos.
6. **Mouse-only** lo decorativo: paralaje, botones magnéticos y tilt 3D solo con `(hover:hover)`.
7. **`prefers-reduced-motion`**: no se registra ninguna animación. El movimiento automático (hero y rotadores) se detiene con hover, foco o el botón de pausa, un solo estado compartido (WCAG 2.2.2).
8. **Rendimiento**: `lite` (≤4 núcleos, ≤2 GB o `saveData`) quita escalas y sesgos; un gobernador adaptativo pasa a modo liviano si el scroll cae de ~40 fps; `clearProps:'transform'` se reemplaza por `removeProperty` para evitar recálculo de estilos (el parche `lean()` al inicio del archivo).

## Dónde está cada cosa (línea de `js/motion.js`)
| Línea | Módulo |
|---|---|
| 83 | Navegación: sombra, sección activa, indicador deslizante |
| 133 | Pausa del movimiento automático (WCAG 2.2.2) |
| 139 | Rotadores de fotos (banda, "Quiénes somos", Preguntas): un solo sistema |
| 171 | Anclas: viaje con expo.inOut; la rueda/toque lo interrumpe |
| 189 | Helpers del sistema |
| 241 | HERO: visible desde el primer pintado |
| 258 | HERO · entrada cinematográfica (una sola vez) |
| 298 | HERO · rotación de unidades |
| 337 | VENDER O PERMUTAR · una unidad por vez |
| 378 | STOCK: el corazón comercial |
| 460 | FICHA: se abre desde la tarjeta tocada; la foto se revela con máscara y el contenido entra escalonado |
| 486 | FICHA · cierre animado |
| 511 | COMPARADOR (versus), Quiénes somos, banner y barra de filtros |
| 523 | FAQ (foto) y marca del pie |
| 527 | BLOQUES: mismo gesto en todo el sitio |
| 572 | v6 · mismo lenguaje en todas las secciones |
| 590 | CÓMO LLEGAR · el recorrido como un solo módulo |
| 622 | v7 · Quiénes somos, reseñas y vista previa del mensaje |
| 635 | Progreso de lectura: línea fina bajo el header (solo transform) |
| 639 | CAPÍTULOS: una línea fina se dibuja con el scroll al entrar en cada sección |
| 649 | BOTONES: atracción magnética (mouse) + presión táctil (todos) |
| 670 | MÓVIL |

## Helpers reutilizables (dentro del bloque "Helpers del sistema")
- `reveal(elementos, disparador, {y, s, d, st, nt})` → subida corta con stagger al entrar en vista (`once:true`).
- `split(el)` / `words(el, disparador)` → título por palabra con máscara (`.wl > span`), conserva `<em>` y deja `aria-label` con el texto completo.
- `photos(cajas, disparador, {from, to, s, still, st})` → foto editorial: `clip-path` + escala 1.1→1. `still:true` omite la escala.
- `swap(lista, A, B, iA, iB, dir, par)` → cambio de unidad/escena: la entrante desliza, su foto contra-desliza, la saliente se corre un 16 %.
- `pulse(selector)` → pulso único de 1,8 s en los CTA.
- `rotator(contenedor, ['slug-1','slug-2'], {sizes, sc, du, ms})` → rotador de fotos con `srcset` (mismos slugs que `images/`).

## Contratos con `index.html` y `recorrido.js`
- Eventos: `dealer:hero` (cambio de unidad en el hero), `dealer:vr` (carrusel «Vender o permutar»), `dealer:local` (`{from, to, dir}`, paso del recorrido). `recorrido.js` maneja estado/tiempos/video; `motion.js` solo coreografía.
- Globales: `window.dealerFlip(els, mutate)` (reordenar con Flip; sin GSAP hace el cambio directo), `window.dealerHero`, `window.dealerVr`.
- Clase `m` en `<html>` = movimiento activo; `sx` = el scroll lo conduce GSAP (se apaga `scroll-behavior:smooth` nativo).

## Receta: sumar una animación nueva
1. Agregar el bloque dentro de la función de arranque, **después** de los helpers. Reusar `reveal`/`photos`/`words`; no escribir tweens sueltos.
2. Máscara de foto: `photos([$('.mi-caja')], '.mi-seccion')`; texto: `words($('.mi-h2'), '.mi-seccion')`; bloque: `reveal($$('.mi-card'), '.mi-seccion', {s:.1})`.
3. Probar con "reducir movimiento" activado en el sistema operativo (todo debe verse) y con GSAP bloqueado (todo debe verse).
4. No animar nada que dispare layout. Si necesitás altura, repetir el patrón del acordeón de Preguntas.
