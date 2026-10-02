# Guía de mantenimiento · Chita Automotores

1. **Cero datos inventados.** Horarios, precios, marcas 0 km, servicios (permuta, consignación, financiación) y año de fundación solo se cargan con confirmación escrita del dueño o fuente pública citada. Si falta: "Consultar" / "a confirmar". Los directorios públicos se contradicen entre sí (teléfonos y horarios): no elegir uno por intuición.
2. **Todo dato nuevo se registra** en `golive/AFIRMACIONES-A-CONFIRMAR.md` con fuente y fecha, y se refleja en `data/dealership.json`.
3. Los datos del negocio viven en `data/dealership.json` **y** en el bloque `NEGOCIO` de `index.html`; deben coincidir (`npm test`). `404.html` y `privacidad.html` repiten el WhatsApp y el teléfono: si cambian, usar `node scripts/rebrand.mjs` para cambiarlos en todos lados de una vez.
4. Cambio mínimo: no reescribir secciones enteras. No cargar datos personales del dueño ni de su familia (un directorio lista al titular por nombre: no va en el sitio).
5. Mientras sea demo: mantener `noindex`, el aviso de demo y `robots.txt` con `Disallow: /`.
6. Texto de servicio (permuta, consignación, 0 km, financiación): hoy figura redactado como **consulta**, no como afirmación. Antes de volverlo afirmación ("Sí, hacemos permutas") tiene que estar confirmado y registrado. `npm run audit` lista todas esas líneas.
7. Movimiento: no agregar animaciones fuera del sistema de `js/motion.js` (ver `docs/MOTION.md`): solo `transform`/`opacity`/`clip-path`, `expo.out`, sin scroll-jacking, y siempre respetando `prefers-reduced-motion`.
8. Salida a producción: `golive/PRODUCCION.md`. La puerta es `npm run test:prod`: tiene que pasar sin errores.
9. Imágenes: cada foto de unidad existe en tres tamaños (`-N.webp`, `-N-800.webp`, `-N-480.webp`). Usar `npm run images` para generarlas; no copiar fotos a mano.
