# PERF-CAMBIOS · Rendimiento del scroll

Fecha: 8 de octubre de 2026 · Base: `chita-main` (ZIP recibido)

## 1. Archivos del paquete

| Archivo | Estado | Qué hace |
|---|---|---|
| `index.html` | **modificado** (+2 líneas, al final del `<head>`) | Enlaza `css/chita-perf2.css` y agrega un script mínimo que (a) activa el interruptor `?cut=clip` y (b) carga `js/perf-diag.js` solo si la URL trae `?perf=` |
| `css/chita-perf2.css` | **nuevo** | Reemplazo de `clip-path` por triángulo del color del fondo, solo donde el fondo es liso (cabecera) |
| `js/perf-diag.js` | **nuevo** | Herramienta de diagnóstico (Fase 0) y panel de medición. Sin `?perf=` no se descarga ni se ejecuta |
| `PERF-CAMBIOS.md` | nuevo | Este documento |

Ningún otro archivo del repo se tocó. Para aplicar: descomprimir **junto a** la carpeta `chita-main` (el ZIP ya trae esa carpeta raíz) y aceptar sobrescribir `index.html`.

> **Sin validar visual ni de rendimiento.** En el entorno donde se preparó no hay navegador, así que nada de esto se renderizó ni se midió. Hay que revisar el aspecto de la cabecera (sección 3) y correr la Fase 0 (sección 2) en un navegador real.

## 2. Fase 0: diagnóstico (lo primero que hay que correr)

Abrir el sitio con `?perf=<fichas>` y pulsar **«Medir scroll»** (panel abajo a la izquierda; 3 pasadas automáticas a ~1400 px/s, informa el promedio, frames >50 ms, >100 ms, peor frame, y lo mismo para el arranque de 1,5 s). En Chrome DevTools → Performance, usar *CPU: 4x slowdown* para parecerse a la medición original.

| URL | Qué mide |
|---|---|
| `?perf=measure` | **Línea base** |
| `?perf=todo,measure` | Sin ningún clip-path (el «techo» de mejora) |
| `?perf=estatico,measure` | Sin los clip-path **de las hojas de estilo** (polígonos fijos); deja los animados |
| `?perf=anim,measure` | Sin los clip-path **animados por GSAP/scrub**; deja los fijos |
| `?perf=hero,measure` | Solo `#hero` sin clip-path |
| `?perf=header,measure` | Solo `<header>` |
| `?perf=entregas,measure` | Solo `#entregas` |
| `?perf=hero,entregas,measure` | El par que el informe marca como el de mayor mejora |
| `?perf=sheet,measure` | Sin el clip-path animado de las secciones versus/contacto/financiacion/guia/visita |
| `?perf=sombras,measure` | Sin `box-shadow` |
| `…&cut=clip` | Desactiva `chita-perf2.css` (comparar contra los cambios) |

Cómo se distingue lo estático de lo animado: GSAP escribe el `clip-path` en el atributo `style=""` de cada elemento, así que `[style*="clip-path"]` captura exactamente lo animado por scrub y `:not([style*="clip-path"])` lo fijo.

**Regla de decisión** (≥3 pasadas, sin ruido):
- Mejora `estatico` y no `anim` → el costo está en los polígonos fijos → ver sección 4.
- Mejora `anim` (o `sheet`) y no `estatico` → el costo está en el scrub de `clipPath` en `js/motion.js` (línea ~590, secciones enteras en `SHEET`; y 628-640, 775-829, 1043): hay que dejar de animar `clipPath` (usar `transform`/`opacity`), no tocar el CSS.
- Mejoran ambas → empezar por lo animado.
- Ninguna mejora en un equipo real → el hallazgo del informe no se reproduce; medir con Chrome Performance antes de tocar nada más.

## 3. Cambios aplicados (`css/chita-perf2.css`)

Solo dos, ambos sobre la cabecera, cuyo fondo es liso (`var(--paper)`, `!important` en `identidad.css:40`):

1. **`header .btn`**: se quita el `clip-path` y se pinta un triángulo color papel encima (corte de 12 px → 8,5 px sobre la diagonal). Funciona en reposo, hover, foco y `:active` porque no toca los colores del botón.
2. **`header nav a.on`** (solo móvil, <900 px, donde existía ese recorte): corte de 9 px → 6,4 px, mismo método. Se conserva la transición de color de .3 s.

Método = el que ya usa `chita-perf.css` en `#visita` y `#guia`. **Revisar a ojo:** tamaño y nitidez de la esquina, hover/foco/pulsado del botón, y que `header nav a.on` se vea igual al desplazar el menú en móvil.

Interruptor: `?cut=clip` devuelve el `clip-path` original sin tocar archivos.

## 4. Qué falta decidir (por qué no se hizo más)

El plan proponía reemplazar los recortes del hero y de Entregas por triángulos del color del fondo. **Eso no se puede hacer a ciegas en el repo real**, porque detrás de esos elementos el fondo no es liso:

- **Hero** (`.hx-reel`, `.hx-rt`, `.hx-btn` secundario, `.hx-h1 em`, `.hx-proof`, `.hx-photo`): detrás corre `.hx-pass`, una franja de fotos en movimiento (`.hx-trk`, animación `hxp`, con velo del 66 % de `--ink`). En móvil, además, hay una segunda franja (`.hx-pass2`) justo debajo.
- **Entregas** (`.eg li`, `.eh img`, `.eg-next`, `.rts`, `.egn-c`): detrás está `.ent-bg`, un collage de fotos con velo azul y rayas rojas.

Un triángulo de color fijo se vería como una mancha. Opciones, de menor a mayor cambio visual (a decidir con diseño, **después** de la Fase 0):

- **A.** Si la Fase 0 muestra que lo caro es el scrub animado (`anim`/`sheet`), no hay que tocar estos polígonos.
- **B.** Poner una placa lisa detrás de los elementos recortados (p. ej. un fondo `--ink` sólido bajo `.hx-rt`), de modo que el triángulo sí tenga un color fijo detrás.
- **C.** Quitar el corte en los elementos más numerosos (`.hx-rt`, `.eg li`) y conservarlo solo en los destacados (`.hx-reel`, botón principal).
- **D.** Mantener el `clip-path` y reducir su costo en otro frente (sombras, `will-change`, capas), si la Fase 0 apunta ahí.

Otros hallazgos del repo:
- El corte sale casi todo de una variable: `--cut` (`css/identidad.css:14`), más `--cut-sm` (`:193`). ~190 reglas con `clip-path` en CSS (103 en `identidad.css`), ~75 `polygon`.
- El `clip-path` animado por scrub está en `js/motion.js`: secciones enteras en `SHEET` (versus, contacto, financiacion, guia, visita; línea 583-594), entradas por sección (628-640), filas de Nosotros (775), hitos de Trayectoria (780), foto de Equipo (829), mapa (803, 1043).
- Las tarjetas de Entregas ya nacen sin clip animado (`motion.js` ~660: «las tarjetas nacen visibles y quietas»); el costo ahí sería el recorte fijo.
- La rueda del mouse ya es nativa (`SMOOTH_WHEEL = false` en `motion.js:50`); Lenis solo hace los saltos a anclas. El script de medición usa `window.scrollTo` y no depende de Lenis.
- `chita-perf.css` ya aplicó este mismo tipo de arreglo en Unidades, Financiación, Visita, Guía y Operaciones; es coherente con que esas secciones salgan fluidas en las mediciones.

## 5. Siguientes pasos

1. Correr la Fase 0 (sección 2) en un equipo real y en un móvil; anotar la tabla.
2. Revisar visualmente los dos cambios de la cabecera (sección 3).
3. Según el resultado, elegir A/B/C/D y abrir una rama por zona (`perf/hero`, `perf/entregas`), midiendo con el mismo panel.
4. Investigar Financiación (`bg-fin.webp`) por separado, como indicaba el informe.
