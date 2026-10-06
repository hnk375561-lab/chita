# Chita Automotores · Plan para dejar la demo lista

Origen: auditoría del 05/10/2026 (preparación 82%, puntuación general 79/100).
Objetivo: cerrar todos los hallazgos para presentar la demo sin objeciones.

## Reglas (no negociables)

1. **No rediseñar ni cambiar la identidad.** No tocar lo que ya funciona (ver "No tocar").
2. **Cero datos inventados.** Si falta un dato, queda como "pendiente del dueño"; no se completa.
3. **Cambio mínimo.** No refactorizar por limpieza. Solo lo listado acá.
4. Todo dato nuevo se registra en `golive/AFIRMACIONES-A-CONFIRMAR.md` y en `data/dealership.json` (regla de `CLAUDE.md`).
5. Al terminar: `npm test`, `node scripts/check-links.mjs` y repetir las mediciones de la sección "Verificación".

## Estado de cada ítem

**Actualizado: 2026-10-06.**

| ID | Sev. | Tarea | Estado | Depende de |
|---|---|---|---|---|
| T1 | 🔴 | Publicar solo el sitio, no todo el repo | ✅ Aplicado y desplegado; revisado en el zip (`_site` solo con lista blanca). Falta repetir los 404 sobre la URL publicada | Código |
| T2 | 🟠 | Performance móvil (CSS bloqueante) | ✅ Aplicado y desplegado; orden de CSS confirmado. ⏳ Sin medir FCP/LCP/CLS ni comparar capturas | Código |
| T3 | 🟠 | Video del reel liviano | ✅ Aplicado y desplegado; reel de 1,97 MB. ⏳ Falta medir transferencia total en móvil | Código |
| T4 | 🟠 | Dominio final: canonical, OG, sitemap | ✅ Opción A aplicada (2026-10-06): `noindex, nofollow` en las 4 páginas y `Disallow: /`. Dominio final pendiente | **Decisión tuya** |
| T5 | 🟠 | Autorización de personas en fotos y video | ⏳ Pendiente: autorización del dueño. Mientras tanto la demo no se indexa (T4) | **Dueño** |
| T6 | 🟡 | Targets táctiles de 44 px | ✅ Aplicado y verificado | Código |
| T7 | 🟡 | Textos mínimos de 12 px | ✅ Aplicado y verificado | Código |
| T8 | 🟡 | Chips de filtro redundantes | ✅ Aplicado: filtros por marca | Código |
| T9 | 🟡 | Precios, horarios y email | ⚠ Revisado: sin horarios/precios confirmables; email candidato no oficial | **Dueño** |
| T10 | 🟡 | Paradas de colectivo sin fuente | ✅ Retiradas del sitio visible | **Dueño / verificación** |
| T11 | 🟡 | Respaldo visual del mapa | ✅ Aplicado y verificado | Código |
| T12 | 🟡 | Nav móvil cortada sin indicación | ✅ Aplicado y verificado | Código |
| T13 | 🔵 | Hrefs `#unidad-…` | ✅ Verificados: 9/9 fichas abren | Verificación |
| T14 | 🔵 | CSS apilado (v54/v55/v56) | ✅ Concatenado en el build T2 | Solo concatenar (T2) |
| T15 | 🔵 | Archivos huérfanos | ✅ Excluidos del artefacto público (siguen en el repo) | Código |
| T16 | ⚪ | Fuente sin uso | ℹ No aplica: DM Serif sigue referenciada por CSS | Código |

Los ítems marcados **Dueño** siguen dependiendo de una confirmación externa. Mientras tanto, el sitio queda correcto para presentarlo como demo.

---

## T1 · Publicar solo el sitio (🔴)

**Problema:** `.github/workflows/pages.yml` sube `path: .`, es decir todo el repo. Con ese flujo no corre Jekyll, así que el `exclude` de `_config.yml` y los redirects de `netlify.toml` no aplican. `golive/`, `data/`, `docs/`, `scripts/`, `CLAUDE.md`, las auditorías y los `LEEME*.txt` podrían quedar descargables.

**Pasos:**
1. Antes de `upload-pages-artifact`, agregar un paso que arme `_site/` con solo lo público:
   ```yaml
   - name: Armar carpeta pública
     run: |
       mkdir _site
       cp index.html 404.html privacidad.html reserva.html og-chita.png site.webmanifest robots.txt sitemap.xml _site/
       cp -r css js fonts images assets video _site/
       touch _site/.nojekyll
   ```
2. Cambiar `path: .` por `path: _site`.
3. Antes de armar `_site`, confirmar si `viaje.html` se usa. No está en el sitemap ni en la navegación. Si no se usa, no copiarlo; si se usa, copiarlo junto con `css/viaje.css` y `js/viaje.js`.
   **Decisión registrada (2026-10-06):** `viaje.html` no se usa (ningún HTML lo enlaza) y no se publica: `scripts/build-site.mjs` trabaja con lista blanca. `css/viaje.css` y `images/local-calle.webp` viajan igual en `_site` por copiarse `css/` e `images/` completos; es inofensivo.
4. Quitar de `robots.txt` las líneas `Disallow: /golive/`, `/data/` y `/scripts/`. Una vez que esas rutas no se publican, solo delatan que existen.
   **Resolución del choque con T4:** manda T4 Opción A. `robots.txt` queda solo con `User-agent: *` y `Disallow: /` (sin rutas internas listadas y sin línea `Sitemap:` mientras dure la demo).
5. Mantener `netlify.toml` y `_config.yml` por si se cambia de hosting.

**Aceptación:** tras el deploy, estas URLs devuelven 404: `/data/sources.json`, `/golive/AFIRMACIONES-A-CONFIRMAR.md`, `/CLAUDE.md`, `/docs/IDENTIDAD.md`, `/LEEME.txt`. La home, `reserva.html` y `privacidad.html` cargan completas (imágenes, fuentes y videos).

---

## T2 · Performance móvil (🟠)

**Medición base** (móvil emulado, 1,6 Mbps, 150 ms, CPU ×4, servidor sin gzip): FCP ≈ 7,1 s, LCP ≈ 7,3 s, TBT ≈ 2 s. Causa principal: 8 hojas CSS bloqueantes (~430 KB crudos) y 312 KB de JS.

**Pasos:**
1. Concatenar los CSS **en el mismo orden actual** en un solo archivo, sin cambiar reglas: `site, motion, identidad, comparador, chita-v54, resenas-compra, chita-v55, chita-v56`. Hacerlo en el paso de build de T1.
2. Minificar ese archivo y el JS. No renombrar clases ni selectores.
3. Reemplazar los 8 `<link rel="stylesheet">` de `index.html` por uno solo.
4. Medir en la URL publicada (con gzip del hosting) con PageSpeed Insights o Lighthouse móvil.

**Aceptación:** FCP móvil ≤ 3 s y LCP ≤ 4 s en Lighthouse móvil sobre la URL publicada. CLS ≤ 0,1. Cero diferencias visuales (comparar capturas antes y después).

**Si no se llega al objetivo:** extraer el CSS crítico del hero e inlinearlo; cargar el resto con `media="print" onload`. Hacerlo solo si hace falta.

---

## T3 · Video del reel liviano (🟠)

**Problema:** `video/reel-recorrido.mp4` pesa 6,1 MB y se descargó durante el recorrido en móvil.

**Pasos:**
1. Recomprimir a 720p vertical, H.264, CRF ~28, con audio AAC mono 96 kbps. Objetivo: ≤ 2 MB.
2. Mantener `preload="none"` y cargar `data-src` solo cuando el video entra en pantalla o al tocar "Activar sonido".
3. Mantener el póster `images/reel-poster.webp` (es el LCP del hero).
4. Revisar que `video/ambiente.mp4` (1,8 MB) no se descargue entero en móvil; si se descarga, aplicar el mismo criterio.

**Aceptación:** transferencia total de la home en móvil ≤ 3 MB antes de interactuar y ≤ 6 MB tras recorrer todo el sitio.

**Revisión del zip (2026-10-06):** `reel-recorrido.mp4` = 1,97 MB (cumple ≤ 2 MB); reel y `ambiente.mp4` con `preload="none"`, el reel por `data-src`. La transferencia real no se midió todavía.

---

## Actualización de decisiones y verificación · 2026-10-06

- **Demo:** se mantiene `https://hnk375561-lab.github.io/chita/` como URL suficiente para presentar la demo al dueño. No se cambió de dominio.
- **Autorización audiovisual:** la demo se presentará al dueño informando el uso de fotos y video; el visto bueno todavía no fue otorgado y T5 permanece pendiente.
- **Investigación pública T9:** La Guía Local lista `chitaautomotores@gmail.com`, pero no es una confirmación directa del negocio; queda como candidato interno y no se publica como email oficial. Los horarios encontrados en GTM, ZonaAuto y otras fichas no coinciden, por lo que siguen sin publicarse. No se encontraron precios actuales confiables para las unidades de la demo; continúan como «Consultar».
- **T10:** se retiró del HTML visible el bloque de paradas y distancias. La referencia histórica se conserva únicamente en los datos internos para trazabilidad.

## T4 · Dominio final (🟠)

**Decisión tomada:** GitHub Pages queda aceptado como demo temporal para presentar al dueño. El dominio final queda pendiente para una eventual salida pública.

**Problema:** canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD y sitemap apuntan a `https://hnk375561-lab.github.io/chita/`, con `robots: index, follow`.

**Aplicado el 2026-10-06 (Opción A):** `noindex, nofollow` en `index.html`, `reserva.html`, `privacidad.html` y `404.html`; `robots.txt` con `Disallow: /`; `publicacion.publicIndexing: false` en `data/dealership.json`. Para no romper `npm test` ni la regla 5 de `CLAUDE.md`, el validador y esa regla ahora dependen de ese flag: con `false` exigen `noindex` y `Disallow: /`; con `true` exigen lo contrario. Al salir a producción: pasar el flag a `true`, quitar `noindex` y `Disallow`, restaurar la línea `Sitemap:` y cambiar el dominio (Opción B).

**Decisión original:**
- **Opción A, demo temporal en github.io:** poner `noindex, nofollow` en el meta robots de las 4 páginas y `Disallow: /` en `robots.txt` hasta que el cliente apruebe. Así la demo no se indexa.
- **Opción B, dominio propio del cliente:** reemplazar la URL en todos los archivos de abajo.

**Archivos a actualizar (según `CLAUDE.md`, regla 5):** `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD), `reserva.html`, `privacidad.html`, `robots.txt`, `sitemap.xml`, `golive/sitemap.xml`, `golive/json-ld-autodealer.html` y `<base href>` de `404.html`.

**Aceptación:** `grep -rn "hnk375561" .` solo devuelve resultados que corresponden a la decisión tomada (en `_site` hoy: `index.html` 5, `sitemap.xml` 3, `reserva.html` 1, `404.html` 1, `robots.txt` 0 tras este cambio). La vista previa al compartir por WhatsApp muestra título, descripción e imagen correctos (probar con el depurador de Facebook y pegando el link en un chat).

---

## T5 · Autorización de personas (🟠)

**Estado:** pendiente del dueño. La demo se puede mostrar para solicitar el visto bueno, pero la explicación de uso no reemplaza la autorización.

**Problema:** el reel y las fotos de "Gente real, autos reales" muestran rostros.

**Acción del dueño:** confirmar por escrito que quienes aparecen autorizan su publicación. Registrar la confirmación en `golive/AFIRMACIONES-A-CONFIRMAR.md` con fecha.

**Si no hay autorización:** reemplazar esa foto o video, o desenfocar los rostros. No publicar sin confirmación.

---

## T6 · Targets táctiles de 44 px (🟡)

**Problema:** 107 elementos miden menos de 40 px en móvil. Los más visibles: `.fm-chip` (28 px de alto), `header .ic` (38×44), el input de búsqueda de unidades (36 px).

**Pasos:**
1. En móvil (`max-width: 899px`), asignar `min-height: 44px` a `.fm-chip`, `header .ic`, los inputs y selects de `#unidades`, y a los botones de galería.
2. Para elementos que no deben crecer visualmente, ampliar el área táctil con `padding` o un pseudo-elemento, sin cambiar el aspecto.
3. Revisar el resto de la lista con el script de la sección "Verificación".

**Aceptación:** cero elementos interactivos visibles menores de 40 px de alto, o con justificación (enlaces dentro de texto corrido). Sin cambios visibles en desktop.

---

## T7 · Textos mínimos (🟡)

**Problema:** unos 198 textos van de 9,5 a 11,5 px en móvil.

**Pasos:** subir a 12 px como mínimo en móvil los textos de etiquetas (kickers, `small`, rótulos de chapa). Mantener `letter-spacing` y mayúsculas. Verificar que ningún rótulo se corte o desborde a 320 px.

**Aceptación:** ningún texto visible de más de 2 caracteres por debajo de 12 px en móvil. Sin overflow horizontal a 320 px.

---

## T8 · Chips de filtro redundantes (🟡)

**Problema:** hay 9 chips, uno por auto, que repiten el listado. Filtrar a una sola unidad no ayuda.

**Opción recomendada:** reemplazar los chips por **marca**, derivada de los datos existentes (Renault, Chevrolet, Fiat, Kia, Peugeot). No se agrega información nueva. Conservar "Todos", la búsqueda y el orden.

**Aceptación:** los chips filtran por marca y el contador ("Mostrando X de 9") sigue correcto. La búsqueda vacía muestra su mensaje actual.

---

## T9 · Datos faltantes (🟡) · del dueño

**Revisión pública 2026-10-06:** La Guía Local publica `chitaautomotores@gmail.com`, pero al no ser una fuente directa del negocio se conserva solo como candidato interno. GTM y ZonaAuto publican horarios distintos; no se adopta ninguno. No aparecen precios actuales confiables para el stock de la demo; se mantienen como «Consultar».

Pedir por escrito y cargar solo lo confirmado:
- Horarios de atención (hay 3 versiones en conflicto en `data/sources.json`).
- Email oficial (el candidato de Cylex está marcado "NO USAR").
- Precios por unidad. Hoy el test solo admite "Consultar".

Al recibir cada dato: `data/dealership.json`, bloque `NEGOCIO` de `index.html`, `golive/AFIRMACIONES-A-CONFIRMAR.md` y `npm test`.

**Mientras tanto:** no agregar texto de relleno.

---

## T10 · Paradas de colectivo (🟡)

**Estado:** retiradas del HTML visible el 2026-10-06 por preferencia del solicitante. La fuente interna se conserva como historial y no se muestra al visitante.

**Problema:** el panel de "Dónde estamos" muestra paradas con distancias (por ejemplo "~110 m") sin fuente registrada.

**Pasos:** verificar cada parada y distancia contra un mapa y registrar la fuente en `golive/AFIRMACIONES-A-CONFIRMAR.md`. Si no se puede verificar, quitar esas líneas.

---

## T11 · Respaldo del mapa (🟡)

**Problema:** el iframe de Google Maps se carga diferido y, si falla, queda un recuadro oscuro con el pin "1712".

**Pasos:** mostrar debajo del iframe un fondo con la dirección y el botón "Abrir en Google Maps" siempre visible, de modo que si el embed no carga, el bloque no quede vacío. No cambiar el diseño cuando el mapa sí carga.

**Aceptación:** bloqueando `maps.google.com`, el bloque sigue mostrando dirección y enlace.

---

## T12 · Nav móvil (🟡)

**Problema:** la fila de navegación se corta en "VENDER O" sin indicar que se desliza.

**Pasos:** agregar un degradado en el borde derecho del contenedor de la nav en móvil, que desaparece al llegar al final. Sin cambiar los enlaces.

---

## T13 · Hrefs `#unidad-…` (🔵)

**Pasos:** abrir `index.html#unidad-clio-dynamique-2016` (y las otras 8) en un navegador limpio. Debe abrir la ficha o llevar a la unidad. Si no lo hace, corregir el manejo del hash en `js/app.js`.

---

## T14 · CSS apilado (🔵)

Solo se concatena (T2). No reescribir reglas ni quitar versiones: riesgo visual alto y beneficio bajo para la demo.

---

## T15 · Archivos huérfanos (🔵)

Antes de borrar cada uno, `grep -rn "<nombre>" .` para confirmar que no se usa:
- `js/nosotros.js` (no se carga desde ningún HTML)
- `video/recorrido.mp4` (4 MB; ya no lo referencia `index.html`; revisar `viaje.html`)
- `images/cartel-chita.webp` y variantes que solo usaba el recorrido eliminado
- `chita-cambios/` (copia antigua)

Conservar `images/local-calle.webp`: lo usa `css/viaje.css`.

---

## T16 · Fuente sin uso (⚪)

Si `grep -rn "dm-serif" css js index.html` no devuelve nada, borrar `fonts/dm-serif-display-latin.woff2` y su entrada en `fonts/LICENSES.txt` si corresponde.

---

## No tocar

- Hero (composición, copy, CTA, animación de entrada).
- Grilla de unidades y fichas: funcionaron en las 9 unidades, en desktop y móvil.
- Lenguaje visual de chapa, remito y columnas rojas.
- Formulario "Contanos qué auto buscás" y su mensaje de WhatsApp.
- Regla de no publicar datos sin confirmar.

---

## Verificación final

**Estado a 2026-10-06 (revisión estática del zip, sin navegador):**
- ✅ Hecho: `npm test` y `node scripts/check-links.mjs` sin errores (quedan 2 mapas por abrir a mano y los enlaces externos sin probar por red); `_site` sin archivos internos; sin referencias locales rotas en las 4 páginas; orden de CSS preservado; `noindex` en las 4 páginas.
- ⏳ Pendiente (necesita la URL publicada o un navegador): puntos 1 (404 en vivo), 2, 3, 4, 5, 6, 7, 8 y 10 de abajo y la comparación de capturas de T2.

Repetir, con el sitio publicado:

1. **Archivos internos:** las URLs de T1 devuelven 404.
2. **Overflow:** sin scroll horizontal en 320, 360, 375, 390, 414, 768, 1024, 1280, 1440 y 1920 px.
3. **Consola:** cero errores JS. El warning de GSAP ("target not found") puede quedar; es de baja prioridad.
4. **Rendimiento:** Lighthouse móvil ≥ 85 en Performance, FCP ≤ 3 s, CLS ≤ 0,1.
5. **Fichas:** abrir las 9, con Esc, flechas de galería y cierre en móvil.
6. **Formularios:** campos obligatorios, mensajes de WhatsApp correctos, sin datos guardados.
7. **Links externos:** WhatsApp (3442-647442), teléfono (03442 44-2782), Instagram, Facebook y Google Maps abren el destino correcto. Probar a mano en un teléfono real.
8. **Vista previa al compartir:** WhatsApp y Facebook muestran título, descripción e imagen.
9. **Tests del proyecto:** `npm test` y `node scripts/check-links.mjs` sin errores.
10. **Prueba en teléfono real:** recorrer toda la home con conexión 4G.

## Cierre

Hay dos hitos distintos:

- **Lista para mostrar al dueño (hoy):** T1, T2, T3, T6, T7, T8, T10, T11, T12, T13, T14, T15 y T16 aplicados; T4 resuelto como demo temporal con `noindex`. Conviene antes medir T1-T3 sobre la URL publicada (verificación final, puntos 1 y 4) y anotar los números.
- **Lista para publicar de forma abierta:** además requiere T5 (autorización escrita de las personas que aparecen), T9 (horarios, email oficial y precios confirmados o aceptados como pendientes), el dominio final y pasar `publicIndexing` a `true`.

Eso depende de datos y decisiones que el código no puede reemplazar.
