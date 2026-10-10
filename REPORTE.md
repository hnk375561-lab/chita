# Informe de verificacion
Commit: 112a805f27a1df57e0891fb356ec840f2f7131d9 · 2026-10-10 18:43:45 UTC

| Job | Resultado |
|---|---|
| Datos, sintaxis, enlaces, Lighthouse | success |
| Chromium (escritorio, movil, otros dispositivos) | success |
| Safari / WebKit | success |
| Sitio ya publicado | success |

## Lighthouse (0-100)

| Pagina | Rendimiento | Accesibilidad | Buenas practicas | SEO |
|---|---|---|---|---|
| index-escritorio | 96 | 96 | 100 | 69 |
| index-movil | 60 | 93 | 100 | 69 |
| reserva-escritorio | 100 | 100 | 100 | 69 |
| reserva-movil | 97 | 100 | 100 | 69 |

## informes/informe-base/build.txt
```
images/: quitadas de _site 22 sin referencias (4.9 MB)
CSS: 572 KB → 471 KB (1 archivo)
_site listo: index.html, 404.html, privacidad.html, reserva.html, og-chita.png, site.webmanifest, robots.txt, sitemap.xml, css/, js/, fonts/, images/, assets/, video/
```

## informes/informe-base/datos.txt
```

> test
> node scripts/validate-dealership.mjs

Aviso: imagen de reserva sin usar: images/bg
Aviso: imagen de reserva sin usar: images/bg-fin.webp
Aviso: imagen de reserva sin usar: images/bg-guia.webp
Aviso: imagen de reserva sin usar: images/bg-visita.webp
Aviso: imagen de reserva sin usar: images/entrega-01.webp
Aviso: imagen de reserva sin usar: images/entrega-02.webp
Aviso: imagen de reserva sin usar: images/entrega-03.webp
Aviso: imagen de reserva sin usar: images/entrega-04.webp
Aviso: imagen de reserva sin usar: images/entrega-05.webp
Aviso: imagen de reserva sin usar: images/entrega-06.webp
Aviso: imagen de reserva sin usar: images/entrega-07.webp
Aviso: imagen de reserva sin usar: images/entrega-08.webp
Aviso: imagen de reserva sin usar: images/entrega-09.webp
Aviso: imagen de reserva sin usar: images/entrega-10.webp
Aviso: imagen de reserva sin usar: images/entrega-11.webp
Aviso: imagen de reserva sin usar: images/entrega-12.webp
Aviso: imagen de reserva sin usar: images/icon-512-maskable.png
Aviso: imagen de reserva sin usar: images/icon-512.png
Aviso: imagen de reserva sin usar: images/nuestro-logo.webp
Aviso: 47 grupos de imágenes idénticas (47 archivos sobrantes)
Datos de Chita válidos y consistentes con index.html.
```

## informes/informe-base/enlaces.txt
```

✖ PROBLEMAS (0)

⚠ A REVISAR A MANO (7)
  [index.html] https://www.google.com/maps/place/Chita+Automotores/@-32.486865,-58.2528928,17z/data=!3m1!4b1!4m6!3m5!1s0x9…
      → mapa: abrirlo a mano y confirmar que muestra el local
  [index.html] https://waze.com/ul?ll=-32.486865,-58.250318&navigate=yes
      → mapa: abrirlo a mano y confirmar que muestra el local
  [index.html] https://www.google.com/maps/place/Chita+Automotores/@-32.486865,-58.2528928,17z
      → mapa: abrirlo a mano y confirmar que muestra el local
  [reserva.html] https://www.google.com/maps/place/Chita+Automotores/@-32.486865,-58.2528928,17z/data=!3m1!4b1!4m6!3m5!1s0x9…
      → mapa: abrirlo a mano y confirmar que muestra el local
  [index.html] https://www.facebook.com/Chitaautomotores
      → redirige a login (normal en redes; abrir a mano)
  [index.html] https://www.instagram.com/chita.automotores/
      → HTTP 429 (muchos sitios bloquean bots: abrir a mano)
  [js/mapa.js] https://tile.openstreetmap.org/{z}/{x}/{y}.png
      → HTTP 400 (muchos sitios bloquean bots: abrir a mano)

Páginas: index.html, reserva.html, privacidad.html, 404.html · JS: 14 archivos
```

## informes/informe-base/produccion.txt
```

> test:prod
> node scripts/validate-dealership.mjs --prod

Aviso: imagen de reserva sin usar: images/bg
Aviso: imagen de reserva sin usar: images/bg-fin.webp
Aviso: imagen de reserva sin usar: images/bg-guia.webp
Aviso: imagen de reserva sin usar: images/bg-visita.webp
Aviso: imagen de reserva sin usar: images/entrega-01.webp
Aviso: imagen de reserva sin usar: images/entrega-02.webp
Aviso: imagen de reserva sin usar: images/entrega-03.webp
Aviso: imagen de reserva sin usar: images/entrega-04.webp
Aviso: imagen de reserva sin usar: images/entrega-05.webp
Aviso: imagen de reserva sin usar: images/entrega-06.webp
Aviso: imagen de reserva sin usar: images/entrega-07.webp
Aviso: imagen de reserva sin usar: images/entrega-08.webp
Aviso: imagen de reserva sin usar: images/entrega-09.webp
Aviso: imagen de reserva sin usar: images/entrega-10.webp
Aviso: imagen de reserva sin usar: images/entrega-11.webp
Aviso: imagen de reserva sin usar: images/entrega-12.webp
Aviso: imagen de reserva sin usar: images/icon-512-maskable.png
Aviso: imagen de reserva sin usar: images/icon-512.png
Aviso: imagen de reserva sin usar: images/nuestro-logo.webp
Aviso: 47 grupos de imágenes idénticas (47 archivos sobrantes)
ERROR: publicacion.official debe ser true (modo producción)
ERROR: index.html: lenguaje de demo/propuesta
ERROR: PROD: publicacion.publicIndexing sigue en false
ERROR: PROD: horarios sin confirmación del dueño (status: verified-google-maps-2026-10-08)
ERROR: PROD: falta photos.authorized = true (autorización de fotos y videos)
ERROR: PROD: quitar el aviso de demo del pie
```

## informes/informe-base/resultado.txt
```
datos=success
sintaxis=success
build=success
enlaces=success
lighthouse=success
```

## informes/informe-base/sintaxis.txt
```
```

## informes/informe-chromium-escritorio/chromium-escritorio.txt
```

> check:all
> node scripts/check-all.mjs --desktop


CHITA · verificación total  (index.html, reserva.html, privacidad.html · desktop)
Servidor local: http://127.0.0.1:33303

  ▸ estático  archivos, SEO, ids, sitemap, manifest, fotos
  ▸ desktop  index.html      216s · 150 ok · 4 avisos · 0 fallas
  ▸ desktop  reserva.html    13s · 23 ok · 0 avisos · 0 fallas
  ▸ desktop  privacidad.html 8s · 15 ok · 0 avisos · 0 fallas

  ▸ red      3 sitios externos

══════════════ RESUMEN ══════════════
✔ 225 correctos   ⚠ 6 avisos   ✖ 0 fallas

⚠ AVISOS (revisar a mano):
  [desktop · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [red · https://www.facebook.com/Chitaautomotores · externo] pide iniciar sesión (normal en redes: abrir a mano)
  [red · https://www.instagram.com/chita.automotores/ · externo] pide iniciar sesión (normal en redes: abrir a mano)

RESULTADO: ✔ TODO BIEN (lo que un script puede verificar)
Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.

```

## informes/informe-chromium-escritorio/resultado.txt
```
exit=0
```

## informes/informe-chromium-movil/chromium-movil.txt
```

> check:all
> node scripts/check-all.mjs --mobile


CHITA · verificación total  (index.html, reserva.html, privacidad.html · móvil)
Servidor local: http://127.0.0.1:36651

  ▸ estático  archivos, SEO, ids, sitemap, manifest, fotos
  ▸ móvil    index.html      242s · 151 ok · 8 avisos · 0 fallas
  ▸ móvil    reserva.html    13s · 24 ok · 0 avisos · 0 fallas
  ▸ móvil    privacidad.html 9s · 16 ok · 0 avisos · 0 fallas

  ▸ red      3 sitios externos

══════════════ RESUMEN ══════════════
✔ 228 correctos   ⚠ 10 avisos   ✖ 0 fallas

⚠ AVISOS (revisar a mano):
  [móvil · index.html · táctil] 6 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas | Ver: Multimarcas | Ver: Charla y autos a la vista | Ver: Un auto en detalle
  [móvil · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.hx-copy>
  [móvil · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «VER AUTOS» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [red · https://www.facebook.com/Chitaautomotores · externo] pide iniciar sesión (normal en redes: abrir a mano)
  [red · https://www.instagram.com/chita.automotores/ · externo] HTTP 429 (muchos sitios bloquean bots: abrir a mano)

RESULTADO: ✔ TODO BIEN (lo que un script puede verificar)
Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.

```

## informes/informe-chromium-movil/resultado.txt
```
exit=0
```

## informes/informe-chromium-otros-dispositivos/chromium-otros-dispositivos.txt
```

> check:all
> node scripts/check-all.mjs --all-devices


CHITA · verificación total  (index.html, reserva.html, privacidad.html · desktop + móvil + iphone-se + android + tablet)
Servidor local: http://127.0.0.1:35497

  ▸ estático  archivos, SEO, ids, sitemap, manifest, fotos
  ▸ desktop  index.html      214s · 150 ok · 4 avisos · 0 fallas
  ▸ desktop  reserva.html    12s · 23 ok · 0 avisos · 0 fallas
  ▸ desktop  privacidad.html 8s · 15 ok · 0 avisos · 0 fallas
  ▸ móvil    index.html      235s · 150 ok · 7 avisos · 0 fallas
  ▸ móvil    reserva.html    12s · 24 ok · 0 avisos · 0 fallas
  ▸ móvil    privacidad.html 8s · 16 ok · 0 avisos · 0 fallas
  ▸ iphone-se index.html      247s · 152 ok · 9 avisos · 0 fallas
  ▸ iphone-se reserva.html    12s · 24 ok · 0 avisos · 0 fallas
  ▸ iphone-se privacidad.html 8s · 16 ok · 0 avisos · 0 fallas
  ▸ android  index.html      238s · 150 ok · 7 avisos · 0 fallas
  ▸ android  reserva.html    12s · 24 ok · 0 avisos · 0 fallas
  ▸ android  privacidad.html 8s · 16 ok · 0 avisos · 0 fallas
  ▸ tablet   index.html      230s · 150 ok · 5 avisos · 0 fallas
  ▸ tablet   reserva.html    13s · 24 ok · 0 avisos · 0 fallas
  ▸ tablet   privacidad.html 8s · 16 ok · 0 avisos · 0 fallas

  ▸ red      3 sitios externos

══════════════ RESUMEN ══════════════
✔ 987 correctos   ⚠ 34 avisos   ✖ 0 fallas

⚠ AVISOS (revisar a mano):
  [desktop · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [móvil · index.html · táctil] 6 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas | Ver: Multimarcas | Ver: Charla y autos a la vista | Ver: Un auto en detalle
  [móvil · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «VER AUTOS» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [iphone-se · index.html · táctil] 1 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas
  [iphone-se · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [iphone-se · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [iphone-se · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [iphone-se · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <p.hx-lead.hx-ui>
  [iphone-se · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [iphone-se · index.html · click] «VER AUTOS» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [iphone-se · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [iphone-se · index.html · click] «Ver financiación →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [android · index.html · táctil] 6 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas | Ver: Multimarcas | Ver: Charla y autos a la vista | Ver: Un auto en detalle
  [android · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [android · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [android · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [android · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [android · index.html · click] «VER AUTOS» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [android · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [tablet · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [tablet · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [tablet · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [tablet · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.hx-copy>
  [tablet · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [red · https://www.facebook.com/Chitaautomotores · externo] pide iniciar sesión (normal en redes: abrir a mano)
  [red · https://www.instagram.com/chita.automotores/ · externo] pide iniciar sesión (normal en redes: abrir a mano)

RESULTADO: ✔ TODO BIEN (lo que un script puede verificar)
Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.

```

## informes/informe-chromium-otros-dispositivos/resultado.txt
```
exit=0
```

## informes/informe-publicado/publicado.txt
```

> check:all
> node scripts/check-all.mjs --url=https://hnk375561-lab.github.io/chita/


CHITA · verificación total  (index.html, reserva.html, privacidad.html · desktop + móvil)
Sitio publicado: https://hnk375561-lab.github.io/chita

  ▸ estático  archivos, SEO, ids, sitemap, manifest, fotos
  ▸ desktop  index.html      216s · 150 ok · 4 avisos · 0 fallas
  ▸ desktop  reserva.html    13s · 23 ok · 0 avisos · 0 fallas
  ▸ desktop  privacidad.html 9s · 15 ok · 0 avisos · 0 fallas
  ▸ móvil    index.html      241s · 151 ok · 8 avisos · 0 fallas
  ▸ móvil    reserva.html    13s · 24 ok · 0 avisos · 0 fallas
  ▸ móvil    privacidad.html 9s · 16 ok · 0 avisos · 0 fallas

  ▸ red      3 sitios externos

══════════════ RESUMEN ══════════════
✔ 416 correctos   ⚠ 14 avisos   ✖ 0 fallas

⚠ AVISOS (revisar a mano):
  [desktop · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [móvil · index.html · táctil] 6 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas | Ver: Multimarcas | Ver: Charla y autos a la vista | Ver: Un auto en detalle
  [móvil · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.hx-copy>
  [móvil · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «VER AUTOS» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [red · https://www.facebook.com/Chitaautomotores · externo] pide iniciar sesión (normal en redes: abrir a mano)
  [red · https://www.instagram.com/chita.automotores/ · externo] HTTP 429 (muchos sitios bloquean bots: abrir a mano)

RESULTADO: ✔ TODO BIEN (lo que un script puede verificar)
Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.

```

## informes/informe-publicado/resultado.txt
```
exit=0
```

## informes/informe-safari/resultado.txt
```
exit=0
```

## informes/informe-safari/webkit.txt
```

> check:safari
> node scripts/check-all.mjs --webkit


CHITA · verificación total  (index.html, reserva.html, privacidad.html · desktop + móvil)
Servidor local: http://127.0.0.1:43111  ·  motor: WebKit (Safari)

  ▸ estático  archivos, SEO, ids, sitemap, manifest, fotos
  ▸ desktop  index.html      351s · 150 ok · 11 avisos · 0 fallas
  ▸ desktop  reserva.html    17s · 23 ok · 0 avisos · 0 fallas
  ▸ desktop  privacidad.html 20s · 15 ok · 0 avisos · 0 fallas
  ▸ móvil    index.html      375s · 150 ok · 14 avisos · 0 fallas
  ▸ móvil    reserva.html    17s · 24 ok · 0 avisos · 0 fallas
  ▸ móvil    privacidad.html 20s · 16 ok · 0 avisos · 0 fallas

  ▸ red      3 sitios externos

══════════════ RESUMEN ══════════════
✔ 416 correctos   ⚠ 26 avisos   ✖ 0 fallas

⚠ AVISOS (revisar a mano):
  [desktop · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <div.w>
  [desktop · index.html · click] «Privacidad» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «Elegir el día en pantalla completa ↗» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «Consultar» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «Elegir día y horario» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «Privacidad y avisos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [desktop · index.html · click] «Cómo llegar en Google Maps» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · táctil] 6 botón(es)/enlace(s) de menos de 32px, difíciles de tocar con el dedo: Ver: Autos de varias marcas | Ver: Multimarcas | Ver: Charla y autos a la vista | Ver: Un auto en detalle
  [móvil · index.html · click] «Saltar al contenido» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Autos Autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.hx-btn>
  [móvil · index.html · click] «Ver autos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <span.mo-i>
  [móvil · index.html · click] «Ver autos →» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <a.mark>
  [móvil · index.html · click] «Privacidad» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · click] «Elegir el día en pantalla completa ↗» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · click] «Consultar» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · click] «(icono)» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · click] «Elegir día y horario» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona · lo tapa <video#reelv>
  [móvil · index.html · click] «Privacidad y avisos» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [móvil · index.html · click] «Cómo llegar en Google Maps» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona
  [red · https://www.facebook.com/Chitaautomotores · externo] pide iniciar sesión (normal en redes: abrir a mano)

RESULTADO: ✔ TODO BIEN (lo que un script puede verificar)
Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.

```
