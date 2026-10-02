# De demo a producción · Chita Automotores

## Datos que tiene que dar el dueño
1. **WhatsApp oficial** (hoy `WHATSAPP-A-CONFIRMAR`) y confirmar el teléfono 03442 44-2782.
2. **Horarios** (las fuentes públicas se contradicen).
3. Razón social, CUIT, domicilio legal y correo, para `privacidad.html` (sección "Responsable").
4. Servicios reales: ¿permuta?, ¿consignación?, ¿0 km (qué marcas)?, ¿financiación?
5. Logo oficial y autorización para usar fotos y videos; decidir si se tapan patentes.
6. Qué unidades siguen disponibles y si quiere publicar precios.
7. Si quiere mostrar opiniones de Google (revisar la ficha actual antes).
8. Año de fundación / trayectoria, solo si lo confirma.

## Checklist al aprobar
1. Cargar los datos con `node scripts/rebrand.mjs mapa.json` (ver `docs/REUTILIZAR.md`) y editar `data/dealership.json`.
2. Reemplazar los placeholders: `images/` (logo, fotos, `preview.png`), `video/` (o borrar las secciones que no se usen), unidades en `STOCK` (`npm run images` + `npm run prerender`).
3. `demo.official: true` y `demo.publicIndexing: true` en `data/dealership.json`.
4. Quitar `noindex, nofollow` de `index.html`, `404.html`, `privacidad.html`, y `X-Robots-Tag` de `netlify.toml` si se usa Netlify.
5. `robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://DOMINIO/sitemap.xml`. Copiar `golive/sitemap.xml` a la raíz con el dominio real.
6. Dominio en `canonical`, `og:url`, `og:image`, `twitter:image` y en `<base href>` de `404.html`. Sacar "DEMO ·" de `<title>` y de los `og:`/`twitter:`.
7. Quitar el aviso demo (arriba, pie, `privacidad.html#demo`) y completar el responsable en `privacidad.html` (revisión profesional).
8. Pegar `golive/json-ld-autodealer.html` en el `<head>` solo con datos confirmados.
9. Cada sección con "Pendiente de confirmación" o "a cargar": completarla o borrarla (ver `golive/SECCIONES-PENDIENTES.md`).
10. **`npm run test:prod` sin errores** y revisión en celular real.

## Después
- Reclamar la ficha de Google Maps y reemplazar `mapsPlace` / `mapsReviews`; agregar coordenadas.
- Un responsable de actualizar `STOCK` (retirar lo vendido).
