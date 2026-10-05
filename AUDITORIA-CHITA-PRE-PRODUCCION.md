# Auditoría pre-producción · Chita Automotores

**Repo auditado:** `chita-main` (zip `chita-main__41_.zip`) · **Fecha:** 05/10/2026
**Alcance pedido:** pasada de polishing profesional sin rediseño. Se conservan identidad, estructura, UX, tipografías y colores de marca.
**Estado del repo:** **sin modificar.** Este documento es solo diagnóstico, para aplicar después.

---

## 0. Cómo se auditó

- Servidor local (`npm run dev`, puerto 8080) y Chromium headless (Playwright).
- Páginas: `/`, `/viaje.html`, `/reserva.html`, `/privacidad.html`, `/404.html`.
- Viewports: 390×844 (móvil), 820×1180 (tablet), 1440×900 (escritorio).
- Chequeos automáticos: errores de consola, requests fallidos, overflow horizontal, imágenes rotas, texto recortado por ancestros con `overflow`, contraste WCAG por elemento de texto, tamaños de fuente, y análisis de todas las imágenes del repo.
- Capturas completas de la home en escritorio y móvil, y de las páginas secundarias en escritorio.
- `npm test` (validador del repo): **pasa**.

**Limitaciones de este entorno (no son bugs del sitio):**
- Sin internet: el iframe de Google Maps devolvió 403 y los videos `.mp4` figuran como `ERR_ABORTED`.
- No se verificó la carga real del mapa ni la reproducción de video.
- La tablet (820 px) solo se auditó con los chequeos automáticos, no con revisión visual de capturas.
- Las correcciones propuestas abajo **todavía no fueron probadas**. Los ratios de contraste de las propuestas sí fueron calculados.

---

## 1. Qué está bien (conservar)

| Chequeo | Resultado |
|---|---|
| Overflow horizontal (`scrollWidth` vs ancho de ventana) | Sin overflow en las 5 páginas a 390, 820 y 1440 px |
| Imágenes que no cargan | Ninguna imagen rota por carga |
| Errores JS (`pageerror`) | Ninguno |
| `npm test` | "Datos de Chita válidos y consistentes con index.html" |
| Favicon, manifest, `theme-color`, Open Graph, Twitter Card, `lang="es-AR"` | Presentes en `index.html` |
| Fuentes locales (`fonts/*.woff2`) con `preload` | Correcto |
| `prefers-reduced-motion` | Hay un script en `<head>` que lo respeta, y las clases `cm-reduce` aparecen en `<html>` |
| `netlify.toml` | Oculta `/golive`, `/data`, `/scripts`, `CLAUDE.md`, `README.md`, `package.json`, `netlify.toml` |

---

## 2. Bugs confirmados (corregir)

Prioridad: **P1** = visible a simple vista o rompe algo · **P2** = contraste/legibilidad · **P3** = detalle.

### P1-01 · Placeholders "FOTO A CARGAR" dentro de imágenes en uso

**Síntoma:** en la sección *Comprar, vendé o permutá*, la tarjeta **Permutar** muestra en escritorio un cartel oscuro con el texto "FOTO A CARGAR · local-calle-800 · 800x435". Se vio en la captura a 1440 px.

**Causa:** el `srcset` de esa tarjeta apunta a variantes cuyo contenido es un placeholder generado, no la foto:

```
images/local-calle-480.webp   → placeholder (480×261)
images/local-calle-800.webp   → placeholder (800×435)
images/local-calle.webp       → foto correcta (1170×636)
```

**Detección:** se comparó cada variante `-480`/`-800` contra su imagen base redimensionada. Estas son las que no coinciden:

| Archivo | Estado | ¿En uso? |
|---|---|---|
| `images/local-calle-480.webp` | placeholder | **Sí** (tarjeta Permutar, `index.html`) |
| `images/local-calle-800.webp` | placeholder | **Sí** (ídem) |
| `images/equipo-480.webp` | placeholder | No encontrada referencia |
| `images/equipo-800.webp` | placeholder | No encontrada referencia |
| `images/nosotros-local-800.webp` | placeholder | No encontrada referencia |

**Arreglo:**
1. Regenerar las variantes en uso desde la base:
   ```bash
   cd images
   python3 - <<'EOF'
   from PIL import Image
   src = Image.open("local-calle.webp").convert("RGB")
   for w in (480, 800):
       h = round(src.height * w / src.width)
       src.resize((w, h), Image.LANCZOS).save(f"local-calle-{w}.webp", "WEBP", quality=82, method=6)
   EOF
   ```
   (Alternativa del repo: `npm run images`, pero revisar antes qué hace `scripts/make-images.mjs`; no se ejecutó.)
2. Hacer lo mismo con `equipo-480/800` y `nosotros-local-800` desde `equipo.webp` y `nosotros-local.webp`, o borrarlos si nada los usa.
3. Verificar a mano que ningún otro `-480/-800` quedó con placeholder: repetir el script de comparación (sección 6).

### P1-02 · 18 imágenes `ecosport-*` son placeholders sin uso

Todas las medidas de `images/ecosport-1…6` (`.webp`, `-480`, `-800`) contienen el texto "FOTO A CARGAR" (ej. "local-cartel-calle 960x1198", "local-frente 1440x929"). No aparecen en `index.html`, `js/`, `css/`, ni `data/`.

Sí figuran en `scripts/validate-dealership.mjs` línea 44 (regex `(?:clio|ecosport|ka-s|kwid|punto|up)-\d+`), pero solo para exigir las variantes si una foto se usa.

**Arreglo:** borrar `images/ecosport-*`. No quitar `ecosport` de la regex, no molesta. (El `golive/AFIRMACIONES-A-CONFIRMAR.md` ya dice que la ficha de EcoSport fue retirada.)

### P1-03 · `404.html` con `<base href>` absoluto

`<base href="https://hnk375561-lab.github.io/chita/">` hace que **todas** las rutas relativas de la página (fuentes, íconos, `./`) apunten a github.io. En cualquier otro dominio (y en `localhost`):
- Las fuentes se bloquean por CORS (error en consola, visto en las 3 resoluciones) y la página cae a tipografía del sistema.
- "Volver al inicio" (`href="./"`) lleva a github.io.

**Arreglo:** decidir según el hosting final.
- Si se publica en la raíz del dominio: reemplazar por `<base href="/">`.
- Si queda en subcarpeta de GitHub Pages: dejarlo, pero apuntar al dominio definitivo (`golive/PRODUCCION.md`, paso 6).
- Alternativa sin `<base>`: usar rutas absolutas `/fonts/…`, `/images/…`, `/`.

### P1-04 · Hero en móvil: tira de reseñas cortada

**Dónde:** `.hero.hx` (reglas en `css/identidad.css`, línea ~51 y bloque móvil ~92).
**Síntoma (390 px):** el texto "45 reseñas en Google · registro público de quienes pasaron por acá" arranca en x=249 y termina en x=800 (el viewport mide 390). Se corta en "45 RESEÑAS EN GOO…". El elemento padre tiene `overflow:hidden`, por eso no genera scroll horizontal pero el texto se pierde.

**Arreglo propuesto:** en móvil, permitir que ese bloque haga `flex-wrap`/`white-space:normal` y que el texto largo baje a una segunda línea (o se acorte al visible "4,7 · 45 reseñas en Google"). Hay que localizar la clase exacta del span con `grep -n "registro público de quienes" index.html`.

### P1-05 · Escritorio: botón "Abrir en Google Maps ↗" fuera del viewport

**Dónde:** `a.mpl` dentro de `#contacto`.
**Síntoma (1440 px):** el texto abarca x=1252→1455; el viewport mide 1440, así que la punta se corta.
**Causa probable:** `.loc a.mpl` en `css/site.css` (líneas 85 y 101) se posiciona con `right:12px` / `left:auto` dentro de `.mp`, que a ≥900 px pasa a `position:absolute; inset:0` (línea 102). Hay además reglas posteriores (líneas 233, 1065, 1131, 1149) que lo restilizan.
**Arreglo:** fijar `right:12px; left:auto; max-width:calc(100% - 24px)` en el breakpoint ≥900 px y comprobar con `getBoundingClientRect().right <= innerWidth`.

### P1-06 · Móvil: cards del catálogo recortadas por la sección

El detector marcó, en 390 px, texto de tarjetas (`Peugeot 301 Allure…`, `Peugeot Partner Patagónica…`, `Chevrolet Tracker Premier 1.2T`, `Ver ficha completa ›`, `A confirmar`) con x negativas (-5 a -44), y de otras (`Tracker Premier 1.8N`, `Palio Attractive 1.4N`, `Se destaca en año/km`) con x > 390. Son los elementos fuera de pantalla de un carrusel/riel horizontal con scroll (esperable en el slider), **pero** hay que confirmar que:
- Cada tarjeta se alinea al borde (scroll-snap) y no queda cortada a la mitad al reposo.
- Las que están en el comparador (`#versus`, "Se destaca en año") no deberían estar fuera de pantalla en reposo.

**Estado:** hallazgo sin diagnóstico final. Revisar en 390 px con captura manual del riel de unidades y del comparador.

### P1-07 · Móvil: sección "El talón de compra" con texto recortado a la derecha

El detector marcó textos de `#como-comprar` (`SECTION.pd cc`) con borde derecho entre 392 y 404 px (viewport 390): "Del primer vistazo a la visita, sin vueltas.", los cuatro textos de pasos T·01 a T·04.
Visualmente en captura, los textos de los pasos llegan al borde sin margen.

**Arreglo:** revisar `html body #como-comprar .ccA` (`css/identidad.css`, línea ~253): en móvil la grilla de numeral + texto no respeta el padding lateral. Forzar `min-width:0` en las celdas y `overflow-wrap:anywhere` al texto, más padding derecho igual al izquierdo.

---

## 3. Contraste y legibilidad (WCAG 2.1 AA)

Se midió cada elemento de texto: color efectivo (con alpha) contra el fondo compuesto. Se descartaron los numerales decorativos gigantes con `color:transparent`.

> Ratios de las propuestas calculados con la fórmula de luminancia relativa de WCAG.

### P2-01 · Comparador `#versus`: texto blanco sobre panel claro (1,18:1)

- `.vq p` "¿Ya tenés a tus favoritas? Consultalas juntas" → blanco `#fff` sobre `#ECEDEA`.
- `.vq span` "La agencia responde sobre las unidades que elegiste" → `#B9BEC4` sobre `#EDEEEB` (1,6:1), 11 px.

**Causa:** la capa v20 de `css/identidad.css` pasó `#versus` a fondo claro (papel + tinta), pero `.vq` heredó de `site.css` color blanco y de `identidad.css` (`html body #versus .vq span{color:var(--plata)…}`) un gris plata pensado para fondo oscuro.

**Arreglo propuesto** (en `css/identidad.css`, junto a la regla existente de `#versus .vq`):
```css
html body #versus .vq,
html body #versus .vq p { color: var(--ink); }
html body #versus .vq span { color: rgba(10,16,32,.72); }   /* ≈ 5,2:1 sobre #ECEDEA */
```
El borde `border-top:1px dashed rgba(255,255,255,.35)` también es invisible sobre fondo claro: pasar a `rgba(10,16,32,.35)`.

### P2-02 · Rojo de marca `#C1121F` como color de texto chico sobre fondos oscuros (≈3,05:1)

Afecta a eyebrows y etiquetas de 9–13 px en secciones azul noche / tinta:

| Texto | Tamaño | Fondo | Ratio actual |
|---|---|---|---|
| "La Regla · origen y llegada · según Moovit" (`.xk`) | 13 px | `#0A1020` | 3,05 |
| "Cómo llegar y reconocernos" (`.ey`) | 13 px | `#0A1020` | 3,05 |
| "Guía general" (`.pde`) | 13 px | `#0A1020` | 3,05 |
| "Archivo de hoy" (`.ey`) | 13 px | `#06111A` | 3,06 |
| "E·00" (`b`, hero) | 12 px | `#0A1020` | 3,05 |
| "km publicado / km a confirmar" (`.mc-state`) | **9 px** | `#06111A` | 3,06 |
| "CHITA · ORIGEN" (`.origin-mark`) | **10 px** | `#141A29` | 2,80 |

**Arreglo propuesto:** no tocar el `--rojo` de marca (se usa en botones y fondos donde funciona). Agregar una variante solo para **texto sobre fondo oscuro**:

| Valor | Sobre `#0A1020` | Sobre `#06111A` | Sobre `#141A29` |
|---|---|---|---|
| `#EE4B55` | 5,21 | 5,23 | 4,77 |
| `#F25560` | 5,64 | 5,66 | 5,16 |

Recomendado `#EE4B55` (mantiene el tono rojo y supera 4,5:1 en los tres fondos):
```css
:root { --rojo-claro: #EE4B55; }
html body .xk, html body .ey, html body .pde,
html body .origin-mark, html body .mc-state { color: var(--rojo-claro); }
/* acotar con el selector del ancestro oscuro (p. ej. #catalogo-comparador, #local, #guia) para no tocar los que están sobre papel */
```
**Importante:** esos mismos selectores (`.ey`, `.pde`) sobre **fondo papel** hoy dan 5,3:1 y están bien. Hay que acotar el cambio a las secciones oscuras.

Además, subir `.mc-state` (9 px) y `.origin-mark` (10 px) a ≥ 11 px.

### P2-03 · Botones rojos con texto tinta (3,06:1)

Los `a.btn.p` "Ver unidades" y "Escribinos" en `#catalogo-comparador` / `#entregas` renderizan texto `#06111A` sobre `#C1121F` = **3,06:1**. En el resto del sitio esos botones usan texto blanco (6,22:1).
**Arreglo:** forzar `color:#fff` en `.btn.p` (el estilo que ya usa el resto del sitio). Buscar la regla que lo pisa con `grep -n "btn.p\|\.btn p" css/*.css`.

### P2-04 · Etiquetas sobre la foto del local (2,06:1)

"Cartel de la agencia" y "Salón vidriado" (`b` dentro de `.vpn`, `#local`): `rgb(143,14,24)` sobre `rgba(6,17,26,.88)`.
**Arreglo:** usar `--rojo-claro` (`#EE4B55`, ≈5,2:1) o texto blanco con la marca roja como acento.

### P2-05 · Enlaces de acción del talón en rojo sobre gris

- `a.svc-action` "Ver unidades publicadas ↗" → 4,40:1 (10 px) sobre `#D7D9D6`. Falla por poco.
- `a.svc-action`, `a.step-action` ("Abrir talón de permuta", "Preparar consulta", etc.) → 4,86:1 sobre `#E2E4E0`. Pasan por poco, pero a 10 px.

**Arreglo:** oscurecer el rojo de texto en esos enlaces a `#A00F1A` (5,74:1 sobre `#D7D9D6`; 6,36:1 sobre `#E2E4E0`) y subir a 11–12 px.

### P2-06 · "en persona" (`.mo-i`, `#visita`) (1,58:1) — **verificar antes de tocar**

Se midió `rgb(10,16,32)` sobre `rgb(10,44,140)`, pero en la captura del sitio esa palabra se ve **blanca sobre una caja blanca** y resulta legible. El detector no ve el fondo real (probable pseudoelemento o `background-image`). **No corregir hasta confirmarlo a ojo.**

### P2-07 · Textos informativos de 8–11 px

El detector listó, entre otros: "y consultá →" (8 px), "a consultar" (8 px), "La agencia confirma precio, cuota y condiciones…" (10 px), numeración `01…45` de la grilla de reseñas (10 px, 4,73:1), "Fin del talonario · 13/13" (11 px).
**Arreglo:** mínimo 11 px para etiquetas decorativas, 12–13 px para texto que informa. Los numerales de la grilla de reseñas (4,73:1) están en el borde: subir el alpha de `.6` a `.7`.

---

## 4. Detalles visuales y de contenido (P3)

### P3-01 · Índice de unidades: palabras partidas en escritorio

En `#catalogo-comparador`, la columna del nombre es tan angosta que parte palabras: "DYNAMIQU/E", "ATTRACTI/VE", "AUTHENTIQ/UE", "PATAGÓNIC/A".
**Arreglo:** ampliar la columna del modelo (o reducir la del número `01…11`) y usar `overflow-wrap:normal; hyphens:none; word-break:normal`. El texto debe romper entre palabras, no dentro de ellas.

### P3-02 · Pluralización "1 fotos"

En móvil, la fila "04 CHEVROLET TRACKER PREMIER 1.8N · SERIE 2" muestra **"1 fotos"**. También hay "2 fotos" correcto. No se encontró aún el origen del texto (se buscó `fotos` en `js/app.js`, `js/identidad.js`, `js/motion.js`).
**Arreglo:** localizar con `grep -rn "fotos" js/ index.html | grep -v "^.*aria-label"` y aplicar `n === 1 ? "foto" : "fotos"`.

### P3-03 · Tarjetas de *Comprá, vendé o permutá*: franja azul vacía bajo la foto

En 3 de las 4 tarjetas, la imagen no llena el contenedor `.oi` y queda una franja azul (`#022061`/`#0A2C8C`) entre la foto y el título. El efecto zoom de GSAP agrava el encuadre (`scale(1.13)` + `translate`).
**Arreglo:** `.oi img{width:100%;height:100%;object-fit:cover}` y fijar `aspect-ratio` único en `.oi`. Si las 4 fotos son de formatos distintos (900×581, 720×900, 1170×636, 960×716), elegir `object-position` por tarjeta.

### P3-04 · Letra "a" suelta en el encabezado de "El talón de compra" (escritorio)

En la captura aparece una "a" gris entre los botones "VER UNIDADES" y "COORDINAR UNA VISITA", y también se ve parcialmente tapada en la segunda captura. Probablemente es texto residual de un efecto de animación por palabra o un nodo duplicado.
**Estado:** sin diagnóstico. Inspeccionar `#como-comprar .ccA` en DevTools a 1440 px.

### P3-05 · Video de *Coordiná tu visita* pisa el borde del formulario (escritorio)

El panel de video (columna derecha) comparte altura con el formulario del calendario y su borde rojo se superpone al del formulario en la captura.
**Estado:** sin diagnóstico. Comprobar en 1440 y 1280 px que no haya solapamiento.

### P3-06 · "Gente real, autos reales" en móvil

El título queda en la mitad derecha de la pantalla con una columna izquierda casi vacía ("ARCHIVO DE ENTREGAS / REGISTROS PUBLICADOS" + logo), apretando el `h2` y partiendo "REAL, / AUTOS / REALES" en tres líneas. Es una decisión de composición: **conservar** salvo que el cliente no la quiera; si se ajusta, hacer que el título ocupe el ancho completo en móvil.

### P3-07 · `reserva.html`: "TU MOMENTO." en rojo sobre azul

El rojo `#C1121F` sobre `#0A2C8C` da **1,93:1**. Es un titular de 100+ px (necesita 3:1) → no cumple. Tampoco funciona la variante clara: `#FF5C66` sobre ese azul da solo 3,98:1, `#EE4B55` da 3,30:1 (pasa 3:1 por tratarse de texto grande).
**Arreglo:** si se quiere conservar el rojo, usar `#EE4B55` o `#F25560` (3,56:1) solo en ese titular; o pasarlo a blanco con subrayado rojo. **Decisión de dirección artística: confirmar con el cliente.**

---

## 5. Publicación (SEO técnico y configuración)

El sitio está en **modo demo a propósito** (`CLAUDE.md`, regla 5). Esto **no se debe cambiar sin confirmación del dueño**.

### 5.1. Estado actual (demo)

| Elemento | Valor |
|---|---|
| `<meta name="robots">` | `noindex, nofollow` (`index.html`, `404.html`, `privacidad.html`) |
| `robots.txt` | `Disallow: /` |
| `netlify.toml` | `X-Robots-Tag: noindex, nofollow` en `/*` |
| Títulos | `DEMO · Chita Automotores · Concepción del Uruguay`, `og:title`, `twitter:title`, `og:site_name` con "demo" |
| `canonical`, `og:url`, `og:image`, `twitter:image` | `https://hnk375561-lab.github.io/chita/…` |
| `site.webmanifest` | `"name": "Chita Automotores (demo)"`, descripción "Propuesta de sitio web independiente…" |
| Aviso demo arriba y en el pie | Presente |
| `sitemap.xml` | Preparado sin activar en `golive/sitemap.xml` con `DOMINIO-FINAL` |
| JSON-LD `AutoDealer` | Preparado en `golive/json-ld-autodealer.html`, sin activar |

### 5.2. Checklist de salida (de `golive/PRODUCCION.md`, solo cuando el dueño apruebe)

1. `data/dealership.json` + bloque `NEGOCIO` en `index.html`: `demo.official: true`, `demo.publicIndexing: true`; ajustar `scripts/validate-dealership.mjs` (hoy exige `noindex`, `Disallow: /`, `official === false`).
2. Quitar `noindex, nofollow` de `index.html`, `404.html`, `privacidad.html` **y** el header `X-Robots-Tag` de `netlify.toml`.
3. `robots.txt`: `Allow: /` + `Sitemap: https://DOMINIO/sitemap.xml`.
4. Copiar `golive/sitemap.xml` a la raíz reemplazando `DOMINIO-FINAL`.
5. Reemplazar dominio en `canonical`, `og:url`, `og:image`, `twitter:image`; quitar "DEMO ·" de títulos y `og:site_name`.
6. `404.html`: ajustar `<base href>` (ver P1-03).
7. Quitar el aviso demo (arriba y pie), "Sobre esta demo" y la nota preliminar de `privacidad.html`; completar el "Responsable" con datos reales (revisión por un profesional).
8. Activar JSON-LD solo con datos confirmados.
9. Actualizar `site.webmanifest` (`name`, `description`).
10. `npm test`, `npm run test:prod` y prueba en celular.

### 5.3. Higiene del repo antes de publicar

Aparte de lo que `netlify.toml` ya oculta, la raíz tiene archivos de trabajo que se servirían públicamente si el hosting publica toda la carpeta:

- `AUDITORIA-IMPLEMENTACION.md`, `plan.md`, `manus-routes.json`, `LICENSE`
- `LEEME*.txt` (≈ 12 archivos: `LEEME.txt`, `LEEME-CAMBIOS.txt`, `LEEME-SESION.txt`, `LEEME-financiacion.txt`, `LEEME-hero.txt`, `LEEME-paso-1.txt`, `LEEME-v31.txt`, `LEEME-v38.txt`, `LEEME-v47.txt`, `LEEME-v48.txt`, `LEEME-viaje.txt`, `LEEME-visita.txt`)
- `docs/` (`CONTENIDO.md`, `IDENTIDAD*.md`, `MOTION.md`, `RESERVA.md`, `REUTILIZAR.md`, `VIAJE.md`, `cuestionario-archivo.md`, `guion-de-rodaje.md`, `rebrand.ejemplo.json`)
- `chita-cambios/` (copia vieja de `index.html`, `site.css`, `motion.js`)
- `css/main.css` (37 KB): `index.html` no lo carga (carga `site.css`, `motion.css`, `identidad.css`). Confirmar con `grep -rn "main.css" .` antes de borrar.

**Recomendación:** agregar `/AUDITORIA-IMPLEMENTACION.md`, `/plan.md`, `/manus-routes.json`, `/LEEME*`, `/docs/*`, `/chita-cambios/*` al bloque de redirects 404 de `netlify.toml` (como ya está hecho para `/golive/*`), o excluirlos del deploy. No borrarlos del repo: son documentación del proceso.

### 5.4. Peso y performance (observado, sin medir Lighthouse)

- La home mide ≈ **97 KB de HTML**, **157 KB** `css/identidad.css`, **139 KB** `css/site.css`, **130 KB** `js/vendor/gsap-stack.js`, **79 KB** `js/motion.js`.
- Videos: `reel-recorrido.mp4` **6,3 MB**, `recorrido.mp4` 4,2 MB, `ambiente.mp4` 1,8 MB. Las capturas muestran que se piden con `preload`/`ERR_ABORTED` al cargar la home.
- Alturas de página: 37.085 px en móvil, 26.525 px en escritorio.

**Propuestas (P3, no urgentes):**
- Confirmar que los 3 videos no se descargan completos antes de que la sección entre en pantalla (`preload="none"` o `metadata` + carga diferida con `IntersectionObserver`).
- Servir el reel con compresión adicional (6 MB para un video vertical de pocos segundos es pesado en 4G).
- Ejecutar Lighthouse real con internet antes de salir (el último que consta en `AFIRMACIONES-A-CONFIRMAR.md` es del 28/09/2026, anterior al hero con video).

---

## 6. Pendientes del dueño que **bloquean** la publicación

Estos no son defectos de código. Según `CLAUDE.md` no se resuelven por cuenta propia:

| # | Pendiente | Dónde se ve |
|---|---|---|
| 1 | Autorización de uso de **fotos** de unidades, y decidir si se tapan las patentes | Home, tarjetas, galerías |
| 2 | Autorización del **video** del reel (y de la persona que aparece; trae subtítulos incrustados) | Hero, Coordiná tu visita, Recorrido |
| 3 | **"39 años de confianza"**: sin respaldo; está dentro de la imagen del logo | Hero, pie, 404, privacidad |
| 4 | "**Recomendado por el 100 % en Facebook (22 opiniones) · octubre de 2026**": sin fuente registrada | Sección Entregas |
| 5 | Segunda persona del equipo: "**Nombre a confirmar · Empleado**" (marcador) | `golive/AFIRMACIONES-A-CONFIRMAR.md`, sección Equipo (verificar si sigue en el HTML) |
| 6 | **Horarios** (hoy "confirmá antes de venir"; hay 3 versiones en conflicto) | Contacto |
| 7 | Cuenta oficial de **Facebook / Instagram** | Contacto, pie |
| 8 | **Km del Palio 2017** (128.000 vs 120.000) | Ficha Palio |
| 9 | Condiciones de **financiación**, consignación, "0 km" (marcas) | Financiación, FAQ |
| 10 | **Reseña de "Santiago Solis"**: la nota de las reseñas dice que hay que confirmar que esté en Google Maps o quitarla | Reseñas |
| 11 | Datos legales para `privacidad.html` (razón social, CUIT, domicilio, correo) | Privacidad |
| 12 | Disponibilidad y precio de cada unidad | Catálogo |
| 13 | Logo en alta (el actual sale de una captura de 411 px y pierde nitidez) | Pie, hero, 404 |

**Datos inconsistentes a verificar en el HTML antes de publicar:**
- Texto informativo con el dato "4,7 de 5 · 45 reseñas" repetido en hero, Entregas y Reseñas: debe coincidir con `data/dealership.json` (el validador ya lo comprueba).
- `og:image` apunta a `preview.png` (94 KB): confirmar que no incluye el lema "39 años" ni "consignaciones" (la nota de golive dice que ya no lo lleva).

---

## 7. Plan de aplicación (orden sugerido)

1. **Assets:** regenerar `local-calle-480/800` (P1-01); borrar `ecosport-*` (P1-02); revisar `equipo-*` y `nosotros-local-800`.
2. **Layout:** P1-04, P1-05, P1-07, P3-01, P3-03; diagnosticar P1-06, P3-04, P3-05.
3. **Contraste:** `--rojo-claro` (P2-02), `#versus .vq` (P2-01), botones rojos (P2-03), etiquetas del local (P2-04), enlaces de acción (P2-05), mínimos de fuente (P2-07).
4. **Texto:** pluralización "1 foto" (P3-02).
5. **`404.html`:** `<base>` (P1-03).
6. **Higiene:** redirects 404 en `netlify.toml` para archivos internos (5.3).
7. **Verificación completa** (sección 8).
8. **Salida de demo a producción** solo cuando la sección 6 esté resuelta (5.2).

**Reglas durante la aplicación** (del pedido original): no rediseñar, no agregar secciones, no inventar contenido, no cambiar la arquitectura ni el sistema visual, no sumar efectos.

---

## 8. Verificación final (criterios de aceptación)

Repetir, tras aplicar, en **390 / 820 / 1440 px** y con `prefers-reduced-motion: reduce` activo y desactivado:

- [ ] Consola sin errores en `/`, `/viaje.html`, `/reserva.html`, `/privacidad.html`, `/404.html` (con internet, para que cargue el mapa).
- [ ] 0 requests con estado ≥ 400 (excepto los que dependan de terceros).
- [ ] 0 imágenes rotas (`img.complete && naturalWidth === 0`).
- [ ] `documentElement.scrollWidth === clientWidth` en las 5 páginas.
- [ ] Ningún texto recortado por ancestros con `overflow` (script `clip.py` de esta auditoría).
- [ ] Ningún `-480/-800` con placeholder (script de comparación contra la base).
- [ ] Contraste ≥ 4,5:1 (texto normal) y ≥ 3:1 (texto grande ≥ 24 px o ≥ 18,66 px en negrita), excluyendo numerales decorativos.
- [ ] Foco visible por teclado en menú, botones, filtros, comparador, calendario, formularios y FAQ.
- [ ] Todos los `href`, `tel:` y `wa.me` apuntan a destinos válidos; las anclas `#…` existen.
- [ ] Formularios (`#canjeForm`, `#buscoForm`, `#visitaForm`): estados vacío, error y enviado.
- [ ] Videos: reproducen, pausan con el botón, respetan `reduced-motion`.
- [ ] `npm test` pasa.
- [ ] Comparación visual antes/después: la identidad (colores de marca, tipografías Bricolage Grotesque / Instrument Sans, cortes diagonales, talonario) se mantiene idéntica.

### Script de comparación de variantes (reutilizable)

```python
from PIL import Image, ImageChops, ImageStat
import glob, os, re
for f in sorted(glob.glob('images/*-480.webp') + glob.glob('images/*-800.webp')):
    m = re.match(r'images/(.+)-(480|800)\.webp', f)
    base = f'images/{m.group(1)}.webp'
    if not os.path.exists(base): print('SIN BASE', f); continue
    a = Image.open(f).convert('RGB'); b = Image.open(base).convert('RGB')
    d = sum(ImageStat.Stat(ImageChops.difference(a, b.resize(a.size))).mean) / 3
    ar = abs(a.width / a.height - b.width / b.height)
    if d > 12 or ar > 0.03: print('SOSPECHOSA', f, round(d, 1), round(ar, 3))
```

---

## 9. Resumen ejecutivo

| Prioridad | Cantidad | Qué es |
|---|---|---|
| P1 | 7 | Placeholders en imágenes en uso y sin uso, `<base>` del 404, 2 recortes de texto a 390 px, botón de Maps fuera de pantalla, tarjetas recortadas (por confirmar) |
| P2 | 7 | Contraste: comparador (1,18:1), rojo de marca en texto chico oscuro (3,05:1), botones rojos con texto tinta (3,06:1), etiquetas del local (2,06:1), enlaces de acción, fuentes de 8–11 px |
| P3 | 7 | Palabras partidas, "1 fotos", franja azul en tarjetas, "a" suelta, solape del video, composición móvil, titular de reserva |
| Publicación | — | Sitio en modo demo a propósito; 13 pendientes del dueño; higiene de archivos internos |

**Lo que no hay que tocar:** paleta (azul `#0A2C8C`, rojo `#C1121F`, papel `#ECEDEA`, tinta `#0A1020`), tipografías, cortes diagonales, el sistema "talonario", el orden de las secciones y el motion basado en GSAP.

---

## 10. Estado de aplicación (05/10/2026)

Aplicado con Chromium (390 / 820 / 1440 px). Archivos modificados: `index.html`, `css/identidad.css` (bloques nuevos al final, nada existente se tocó), `netlify.toml`, y las imágenes `local-calle-480/800`, `equipo-480/800`, `nosotros-local-800`.

| Punto | Estado | Nota |
|---|---|---|
| P1-01 placeholders en uso | **Resuelto** | `local-calle-480/800` regenerados; la tarjeta Permutar muestra la foto. Script de comparación: 0 sospechosas (excluye `ecosport-*`) |
| P1-02 `ecosport-*` | **Pendiente manual** | Borrar `images/ecosport-*` (18 archivos); un zip no puede borrar |
| P1-03 `<base>` del 404 | **Decisión de hosting** | Correcto mientras el demo viva en github.io/chita/. Cambiar al dominio final (`golive/PRODUCCION.md`, paso 6) |
| P1-04 reseñas hero móvil | **Resuelto** | Termina en x=343–354 de 390 |
| P1-05 botón Maps | **Resuelto** | Queda en x=1428 de 1440 (asentada la animación) |
| P1-06 riel/cards móvil | **No es bug** | Elementos fuera de pantalla del riel horizontal; captura a 390 px correcta |
| P1-07 talón de compra móvil | **Resuelto** | 0 elementos pasan el borde derecho |
| P2-01 comparador | **Resuelto** | El bloque real es `.vdx`; texto tinta |
| P2-02 rojo en texto sobre oscuro | **Resuelto** | `--rojo-claro #EE4B55` en `#contacto`, `#guia`, `#local`, `#modelos`, E·00; estado activo del índice en blanco |
| P2-03 botones rojos | **Resuelto** | Texto blanco |
| P2-04 etiquetas del local | **Resuelto** | Texto blanco |
| P2-05 enlaces de acción | **Resuelto** | `#A00F1A`, 11 px |
| P2-06 "en persona" | **Falso positivo** | Tinta sobre caja blanca, legible |
| P2-07 textos < 11 px | **Resuelto** | Mínimo 11 px donde estaba por debajo. Quedan 3 marcas decorativas de 10 px (`Entrega`, `div.rl`, etiqueta `Chita` del mapa) |
| P3-01 palabras partidas | **Resuelto** | Columna del nombre 123→232 px (1440); rompe entre palabras |
| P3-02 "1 fotos" | **Resuelto** | Singular en móvil |
| P3-03 franja azul en tarjetas | **Intencional** | `object-fit: contain` con `!important` en `site.css` (caja 4:5, fotos apaisadas). Pasar a `cover` recorta las fotos: decisión de diseño |
| P3-04 "a" suelta | **No reproducible** | Encabezado limpio a 1440 px; era un cuadro de la animación |
| P3-05 video vs formulario | **Resuelto** | Video desplazado 24 px; sin solape a 1440/1280/1024 |
| P3-06 "Gente real" móvil | **Conservar** | Decisión de composición |
| P3-07 titular de `reserva.html` | **Decisión del cliente** | `#EE4B55` cumple 3:1 por ser texto grande |
| 5.3 higiene | **Resuelto** | Redirects 404 para `AUDITORIA*`, `plan.md`, `manus-routes.json`, `LEEME*`, `docs/*`, `chita-cambios/*` |
| 5.3 `css/main.css` | **Pendiente manual** | No lo carga ninguna página; borrar si el dueño lo confirma |
| 5.4 videos | **Sin cambios** | Ya usan `preload="none"` / `metadata`; el `ERR_ABORTED` era del entorno sin internet |
| 6 pendientes del dueño | **Sin tocar** | No son de código (`CLAUDE.md`) |

**Regresión final:** 5 páginas × 3 anchos, sin errores JS, sin respuestas ≥ 400 locales, sin imágenes rotas, sin overflow horizontal. `npm test` pasa.
**Verificado después (ronda 7):**
- Anclas `#…`, `tel:` y `wa.me`: todos válidos. Los `#unidad-…` los resuelve `js/app.js` (abre la ficha), no son elementos del DOM.
- Foco por teclado (Tab, 174 paradas únicas en la home): se corrigió el foco de `.svc-action`, `.step-action` y `.mdb`, que solo cambiaban de color u opacidad. Queda únicamente el iframe del mapa, que usa el foco del navegador.
- Formularios `#canjeForm` y `#buscoForm`: vacío → validación nativa; completos → "Abriendo WhatsApp…" y apertura de `wa.me/5493442647442` con el texto armado. `#visitaForm` es un calendario con casillas; no se probó el envío completo.

**No verificado:** carga real del mapa y reproducción de video (sin internet); Lighthouse; envío completo de `#visitaForm`.
