# Estado de la auditoría (actualizado el 3/10/2026; notas de pendientes revisadas el 6/10/2026)

Medido con Chromium headless (móvil 390 px, escritorio 1440 px, y anchos de 320, 768 y 1024 px) sobre el sitio servido en local. No reemplaza una prueba en dispositivos reales ni Lighthouse.

## Resuelto

| Tema | Estado |
|---|---|
| WhatsApp | Configurado (`wa.me/5493442647442`). 18 CTAs lo usan; el rótulo pasa de «Llamar» a «Escribinos» por JS. Sin JS cae a `tel:`. |
| Formularios | Arman el mensaje y abren WhatsApp. Verificado: «Hola! Quiero vender mi auto: Uno, año 2012, 150.000 km.» |
| Videos | Reales (`recorrido.mp4` 66 s, `ambiente.mp4` 57 s, 480×854). |
| Datos del local | Dirección única (Gral. Galarza 1712). Sin «1337», sin antigüedad publicada. |
| Secciones | De 17 a 13. Sin `#trayectoria`, `#equipo` ni `#historia`. |
| CSS | `!important` de 232 a 115. Hojas externas en `css/`. |
| Tipografía | Vigente: Bricolage Grotesque (cargada como «Chita Display» en `css/identidad.css`) + Instrument Sans. DM Serif Display ya no se usa (el `.woff2` sigue en `fonts/`). `viaje.css` aún mezcla alias `Archivo`, `Jet` (sin cargar) y `monospace`. |
| Imágenes | `srcset` con 480w/800w en todas las fotos de unidades. Fondos CSS en WebP. |
| Repo | Archivos sin uso eliminados. `canonical`, `og:*` y `404.html` apuntan a `/chita/`. `npm run prerender` reparado. |

## Corregido en esta pasada (medido)

| Problema | Antes | Después |
|---|---|---|
| Alto de la página en móvil | 66.418 px | 38.071 px |
| `#catalogo-comparador` en móvil | 32.208 px (11 paneles apilados e invisibles) | 3.872 px |
| Descarga inicial en móvil (sin scroll) | 7.197 KB · 103 requests | 1.778 KB · 41 requests |
| Avisos de consola (GSAP «target not found») | 2 | 0. Reaparecieron 4 el 5/10 por tweens a elementos del hero que ya no existen; corregido en v31 (medido: 0 en 1440 y 390 px) |

Causa del primer punto: `.modelos-panel .mdf{display:block}` estaba fuera del `@media (hover:hover) and (min-width:900px)` que contiene las reglas del panel, así que en móvil y tablet se mostraba sin ellas. Escritorio no cambia.

## Pendiente (no depende del código)

Lo tiene que confirmar el dueño; no se inventa. Ver `golive/PRODUCCION.md`:

- Horarios, razón social, CUIT y correo para `privacidad.html`.
- Autorización para usar fotos, logo y reseñas; decidir si se tapan patentes.
- Si el Tracker 1.8N y el Palio 1.4N «Serie 2» son unidades distintas o la misma.
- Fotos de entregas: confirmar que los clientes aceptan aparecer.

## Pendiente (código, opcional)

- `!important` restantes (93 en `site.css`) y namespacing de clases cortas.
- `images/`: hay ~125 archivos que ninguna página publicada usa (variantes del local y de «equipo», `up-*`, `punto-*`, `bg/int-*`, `showroom/`…). `scripts/build-site.mjs` ya los deja fuera de `_site/` (T16, conserva todo lo que algún HTML/CSS/JS publicado mencione); en el repo siguen presentes y `npm test` los lista como «imagen de reserva sin usar». Borrarlos del repo es decisión del dueño.
- Decenas de `<img>` (63 en el HTML fuente al 6/10/2026) conservan `src="assets/N.jpg"` como respaldo; migrar exige pasar `STOCK` a WebP.
- Salida a producción: quitar `noindex`, completar JSON-LD y sitemap (checklist en `golive/PRODUCCION.md`).
