# Guía de mantenimiento

1. **Cero datos inventados.** Horarios, precios, marcas 0 km, servicios y fecha de fundación solo se cargan con confirmación escrita del dueño o fuente pública citada. Si falta, el dato no se publica (sin "a confirmar" ni "según").
2. **Todo dato nuevo se registra** en `golive/AFIRMACIONES-A-CONFIRMAR.md` con fuente y fecha, y se refleja en `data/dealership.json`.
3. Los datos del negocio viven en `data/dealership.json` **y** en el bloque `NEGOCIO` de `index.html`; deben coincidir. Comprobar con `npm test`. `404.html`, `privacidad.html` y `reserva.html` (constante `CONFIG.whatsapp` en `js/reserva.js`) repiten el WhatsApp y el teléfono: si cambian, actualizarlos también.
4. Cambio mínimo: no reescribir secciones enteras. No cargar datos personales del dueño ni su familia.
5. El sitio es el sitio oficial de Chita Automotores: sin `noindex`, sin avisos de demo, `robots.txt` abierto, `sitemap.xml` y JSON-LD activos. Al cambiar el dominio, actualizar `canonical`, `og:url`, `og:image`, el JSON-LD, `robots.txt`, `sitemap.xml` y el `<base href>` de `404.html`.
6. Los archivos internos (`golive/`, `data/`, `docs/`, `scripts/`, notas) no se publican: ver `_config.yml` y `netlify.toml`.
7. Conflictos entre fuentes (horarios, teléfonos, km del Palio, estado fiscal) viven en `data/sources.json` y `data/vehicles.json`. No se resuelven por cuenta propia: el sitio no muestra el dato. No publicar estado fiscal, titular ni antigüedad.
