# Chita Automotores

Sitio oficial de Chita Automotores, Concepción del Uruguay. Sitio estático (HTML/CSS/JS; el movimiento usa GSAP + ScrollTrigger + Lenis, servidos desde `js/vendor/`).

## Archivos
- `js/motion.js`: capa de movimiento en un solo archivo (GSAP = motor, ScrollTrigger = narrativa, Lenis = scroll), cargada como módulo desde `index.html`. `js/motion/core.js` y `js/motion/vendor.js` los usa `reserva.js`. Ver `docs/MOTION.md`.
- **Galería de fotos** (tarjetas y ficha): pista con `transform` manejada por `index.html` (`gGo`, `gStep`), sin scroll nativo. Flechas, arrastre táctil y de mouse, teclado (← →), contador, segmentos y, en la ficha, miniaturas. Los botones de flecha se deshabilitan en los extremos.
- **Ficha** (`<dialog id="dlg">`): escritorio en dos columnas (galería + datos con pie fijo de consulta); en móvil ocupa toda la pantalla y el botón «Consultar esta unidad» queda fijo abajo. Clases con prefijo `fc`.
- **Vender o permutar**: el formulario «Contanos tu auto» arma el mensaje de WhatsApp (`msgText()`) o, sin WhatsApp válido, ofrece copiarlo y llamar; a su lado, un carrusel de una unidad por vez (`window.chitaVr`, animado por `js/motion.js`).
- `index.html`: sitio completo. Datos del negocio (`NEGOCIO`) y unidades (`STOCK`) en el bloque `<script>` al final. Cada unidad tiene enlace directo y botón para copiarlo o enviarlo por WhatsApp. `STOCK` admite `estado` (`disponible`, `reservado`, `vendido`; sin dato dice "Consultar disponibilidad") y `transmision` (sin dato, no se muestra). Los horarios se cargan en `NEGOCIO.horarios` (publicados el 2026-10-08 desde Google Maps; pendientes de ok escrito del dueño). Hay formularios de consulta («Coordiná tu visita» y «Contanos qué auto buscás») que, como el de permuta, solo arman un mensaje de WhatsApp. La guía «Antes de comprar o permutar un usado» es contenido general que hay que revisar cada tanto.md`.
- **Nuestros modelos** (`#modelos`): lista y panel de vista previa generados desde `STOCK` (sin datos propios; al sumar una unidad aparece sola). Con mouse, el panel grande cambia al pasar sobre cada modelo y tiene miniaturas de hasta 5 fotos; en celular/tablet cada fila muestra su miniatura y abre la ficha. Clases con prefijo `md`.
- **Comparador** (`#versus`): ficha comparativa de hasta 3 unidades (2 en celular) con barras de año y kilómetros y filas de equipamiento según el texto de cada publicación («No informado» no significa que falte). Clases con prefijo `vs`/`vb`/`vck`.
- **Local** (`#local`): panel «Llegá en un toque» (Google Maps, Waze, copiar dirección, compartir por WhatsApp); usa solo la dirección y coordenadas ya confirmadas. Clases con prefijo `rq`.
- `privacidad.html`: política de privacidad preliminar, y aviso sobre la información de las unidades.
- `fonts/`: tipografías autoalojadas (`.woff2`, subconjunto latino; solo las 3 familias que usa el CSS: DM Serif Display, Instrument Sans y Bricolage Grotesque; ver `@font-face` en `css/`). No hay pedidos a Google Fonts. `site.webmanifest`: nombre e íconos del sitio.
- `404.html`: página de error (usa `<base href>` absoluto porque GitHub Pages la sirve desde cualquier ruta).
- `robots.txt`, `og-chita.png` (imagen para compartir), `images/<unidad>-N.webp` (la primera foto es la portada). Cada foto de unidad tiene dos variantes para `srcset`: `<unidad>-N-480.webp` y `<unidad>-N-800.webp` (mismo nombre, ancho 480 y 800 px); al sumar una foto hay que generar las dos.
- `scripts/prerender.mjs` (`npm run prerender`): escribe en `index.html` el HTML de las tarjetas de unidades (entre `<!--PRE:cards-->` y `<!--/PRE:cards-->`) con la misma función que usa el navegador, para que el stock se vea sin JavaScript. Correrlo cada vez que cambie `STOCK`; `npm test` avisa si quedó desactualizado.
- `data/dealership.json`: datos confirmados y su fuente. `data/sources.json` (hechos, conflictos y descartes con fecha) y `data/vehicles.json` (referencias de unidades y su nivel de confianza). `golive/`: pendientes y pasos a producción (`PRODUCCION.md`); incluye `sitemap.xml` preparado para el dominio definitivo. El JSON-LD ya está activo en `index.html`. `npm run test:prod` es la puerta de salida y falla mientras el sitio siga en modo demo.

## Comprobar
`npm test` valida que no haya `href="#"`, que los datos coincidan con `index.html`, que no haya precios sin confirmar, que existan todas las imágenes (y no sobren), un solo `h1`, `alt` en imágenes, `noindex` en las páginas y `Disallow: /` en `robots.txt`.

## Publicar
GitHub > Settings > Pages > Deploy from a branch > main / (root). URL esperada: https://hnk375561-lab.github.io/chita/

## Estado
Demo temporal en github.io: **no indexable** (`noindex, nofollow` en las páginas y `Disallow: /` en `robots.txt`) mientras `publicacion.publicIndexing` sea `false` en `data/dealership.json`. `sitemap.xml` y metadatos sociales (`og-chita.png`) presentes; el JSON-LD (`golive/json-ld-autodealer.html`) está preparado y sin activar. Ver regla 5 de `CLAUDE.md`.
