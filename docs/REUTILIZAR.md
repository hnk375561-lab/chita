# Reutilizar este sitio para otra agencia

Este repo es la versión **Chita** de un sitio que ya se hizo para otra agencia (Poerio). Todo el motor es el mismo: lo que cambia es el contenido. Para la próxima:

1. **Copiar el repo** y borrar `.git`. Copiar `golive/AFIRMACIONES-A-CONFIRMAR.md` vacío y volver a llenarlo desde cero.
2. **Marca y datos con un solo comando**: copiar `docs/rebrand.ejemplo.json`, completar los valores nuevos y correr
   ```bash
   node scripts/rebrand.mjs mi-mapa.json --dry   # simulacro: cuenta cuántos cambios haría
   node scripts/rebrand.mjs mi-mapa.json
   ```
   (cambia textos literales en html/js/json/md/xml; los largos primero). Después editar `data/dealership.json` a mano y `npm test`.
3. **Contenido**: `docs/CONTENIDO.md` (fotos, STOCK, imágenes fijas).
4. **Textos con afirmaciones**: `npm run audit` lista cada línea que promete algo (permutas, consignación, 0 km, financiación…). Cada una se confirma o se borra.
5. **Identidad visual**: tokens en `:root` de `index.html` (`--ink`, `--paper`, `--stone`, `--mute`, `--cy`/`--cyd` acento, `--deep`, `--lux`/`--luxl`, `--h`/`--b`/`--serif` tipografías). `fonts/` trae 24 familias `.woff2` autoalojadas ya probadas (serif de display: Cinzel, Bodoni Moda, Playfair, Gloock, Prata…; sans: Instrument Sans, Bricolage Grotesque, Josefin Sans). Para cambiar: ajustar `--h`/`--b`/`--serif` y dejar solo las `@font-face` que se usen (menos peso). `theme-color` y `site.webmanifest` llevan el color de marca.
6. **Secciones**: cada `<section>` es independiente. Para quitar una: borrarla, borrar su enlace en `<nav>`/pie, y el test avisa de enlaces rotos. Las secciones con video (`#local`, `#equipo`) se pueden dejar sin video si se borra el bloque `<video>`.
7. `npm run prerender && npm test`, y `npm run test:prod` antes de publicar.

## Mapa de módulos (todo lo reutilizable)
| Módulo | Dónde | Notas |
|---|---|---|
| Hero con rotación de unidades + entrada cinematográfica | `index.html` + `motion.js` | Una foto de portada por unidad de `STOCK` |
| Stock: tarjetas, filtros con Flip, ficha (`<dialog>`), galería con arrastre/teclado | `index.html` (`gGo`, `gStep`) + `motion.js` | Tarjetas prerenderizadas (`scripts/prerender.mjs`) |
| Nuestros modelos (lista + panel de vista previa) | `index.html` `#modelos` | Se arma solo desde `STOCK` |
| Comparador de hasta 3 unidades | `#versus` | Barras de año y km; equipamiento por texto de la publicación |
| Vender/permutar, coordinar visita, qué auto buscás | formularios | Solo arman un mensaje de WhatsApp; no guardan datos |
| Cómo llegar: mapa liviano, Maps/Waze/copiar/compartir, recorrido con video | `#contacto`, `#local`, `js/recorrido.js` | Reloj único con pausa real, sin rAF |
| Validación y datos | `scripts/validate-dealership.mjs`, `data/dealership.json` | Modo `--prod` = puerta de salida |
| Páginas legales y 404 | `privacidad.html`, `404.html` | Revisión profesional antes de producción |
| Herramientas | `scripts/` | `make-images`, `rebrand`, `audit-copy`, `serve`, `prerender` |
