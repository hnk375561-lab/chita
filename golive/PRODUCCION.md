# De demo a producción (actualizado 2026-10-08)

El sitio ya es el oficial de Chita Automotores (sin avisos de demo, con JSON-LD activo en `index.html`). Lo único temporal es la **indexación**: mientras `publicacion.publicIndexing` sea `false` en `data/dealership.json`, las 4 páginas llevan `noindex, nofollow` y `robots.txt` lleva `Disallow: /` (ver `CLAUDE.md`, regla 5).

La puerta de salida es `npm run test:prod` (`node scripts/validate-dealership.mjs --prod`). **Falla a propósito** mientras quede algo de esta lista. `npm test` (modo demo) exige lo contrario y es el que corre el workflow de Pages.

## Datos que faltan (los tiene que dar el dueño)
1. **Lunes habitual** (opcional): el horario publicado sale de la ficha de Google Maps (mar–vie 9–17, sáb 8:30–12, dom cerrado); el lunes no figura, por eso el sitio dice "Lunes y feriados: consultá por WhatsApp". Si el dueño confirma el lunes, cambiar `NEGOCIO.horarios` y `hours.display` y sumar `Monday` al JSON-LD.
2. Email oficial (`chitaautomotores@gmail.com` figura en el Facebook del negocio) y razón social, CUIT, domicilio legal para la sección "Responsable" de `privacidad.html`. Estado fiscal y CUIT tienen fuentes en conflicto: no se publican.
3. Autorización para usar fotos y videos (hoy salen de Instagram/Facebook); decidir si se tapan patentes visibles. Registrarla en `data/dealership.json` (`photos.authorized`).
4. Marcas 0 km actuales, condiciones de financiación, qué significa "Recibimos tu usado", consignación.
5. Km real del Palio 2017 (128.000 o 120.000) y unidades duplicadas del stock (Tracker 1.8N 2018 y Palio 1.4N).
6. Precios por unidad o "Consultar".
7. Si se muestra la Gestoría (03442 54-7671; hoy está en `NEGOCIO.gestoria` pero no se renderiza).
8. Dominio propio y quién lo administra.

## Al aprobar (checklist)
1. `data/dealership.json`: cargar lo confirmado y poner `publicacion.publicIndexing: true`. Ajustar `scripts/validate-dealership.mjs` para que `npm test` pase a exigir lo contrario (sin `noindex`, sin `Disallow: /`).
2. Quitar `noindex, nofollow` de `index.html`, `reserva.html`, `privacidad.html` y `404.html`.
3. `robots.txt`:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://DOMINIO-DEFINITIVO/sitemap.xml
   ```
4. `sitemap.xml` (raíz): reemplazar el dominio `github.io` por el definitivo (modelo en `golive/sitemap.xml`).
5. Dominio en `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image` y el JSON-LD: `url`, `image`, `logo`), en `reserva.html` (`canonical`, `og:*`) y en `404.html` (`<base href>`).
6. JSON-LD: ya tiene nombre, dirección, teléfono, coordenadas, redes y horarios. **No agregar `aggregateRating`** (Google no muestra estrellas para reseñas propias de un negocio local), ni precios ni `Vehicle` sin datos confirmados.
7. `privacidad.html`: completar el responsable con datos reales y hacer revisar el texto por un profesional.
8. Si hay dominio propio: configurarlo (GitHub Pages: Settings > Pages > Custom domain + HTTPS; Netlify: Domain management) y repetir los puntos 3 a 5.
9. `npm test`, `npm run test:prod`, `npm run check:all` y revisión en celular real.

## Hospedaje
- **GitHub Pages** (workflow `.github/workflows/pages.yml`): publica solo la lista blanca de `scripts/build-site.mjs`. El repo es público; el sitio también.
- **Netlify** (`netlify.toml`): usa el mismo build (`[build]`), así que publica la misma lista blanca. Permite repo privado.

## Mejoras futuras (opcionales)
- Fotos originales de todas las unidades y retiro de las vendidas.
- Página propia por unidad, si el stock crece.
- Generar versiones `-lite` de los videos que aún no las tienen (`lz-charla`, `lz-detalle`, `lz-recorrido`, `atencion`).
