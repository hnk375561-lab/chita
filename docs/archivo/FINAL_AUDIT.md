# FINAL AUDIT — DEMO READY

> Repositorio auditado: `chita-main` (zip subido el 06/10/2026).
> Entorno de prueba: Chromium headless (Playwright 1.56, Python) sobre un servidor local, más la build publicable `_site/` generada con `scripts/build-site.mjs`.
> Todo lo marcado como verificado se ejecutó en esta sesión. Lo que no se pudo probar está marcado como tal.

## VEREDICTO

🟡 **PRESENTABLE — REQUIERE CORRECCIONES** (solo verificaciones tuyas, ninguna de código)

El código no tiene errores. No encontré nada roto en consola, imágenes, scroll horizontal, enlaces ni interacciones, ni en el código fuente ni en la build minificada que se publica. No lo marco 🟢 porque hay **tres cosas que no pude comprobar desde este entorno** y que decide la presentación de mañana:

1. La URL pública en GitHub Pages (el entorno no tiene salida a `github.io`).
2. El mapa de Google embebido (devolvió 403 desde este entorno; en tu red debería cargar, pero no lo vi).
3. Un celular y un navegador reales (solo emulé viewport y touch en Chromium; no probé Safari/WebKit).

Esos tres puntos están en `LAST ACTIONS REQUIRED` y en el `FINAL 5-MINUTE CHECK`.

---

## 2. SCORE FINAL

Son estimaciones de auditoría, **no mediciones de Lighthouse** (no se ejecutó Lighthouse).

| Área                      |  Score | Base de la nota |
| ------------------------- | -----: | --- |
| Presentabilidad DEMO      | 86/100 | Hero, tarjetas, ficha y comparador se ven profesionales; faltan 3 verificaciones externas |
| Calidad visual            | 90/100 | Capturas de hero, comparador y ficha en 1440 px y 390 px revisadas a ojo |
| UX                        | 84/100 | Deep links, ficha, formularios y Esc funcionan; ver observación O-1 (equipamiento «0/9») |
| Responsive                | 94/100 | 0 px de overflow horizontal en 11 anchos × 3 páginas (más viaje y 404 en fuente) |
| Performance               | 78/100 | No medido con Lighthouse. Página larga (25.000 px en móvil), CSS 387 KB sin minificar en fuente (326 KB en build) |
| Estabilidad               | 95/100 | 0 errores JS, 0 requests propios fallidos, 9/9 deep links abren su ficha |
| Calidad técnica           | 88/100 | `node --check` OK en 19 archivos, `npm test` OK; mucho CSS con `!important` (según la auditoría previa del repo) |
| Accesibilidad             | 80/100 | `lang`, 1 `h1` por página, 0 `<img>` sin `alt`, `aria-*` en galería. Contraste **no medido** |
| SEO técnico               | 85/100 | `noindex` intencional y coherente (demo en github.io); canonical/OG/sitemap correctos |
| Profesionalismo percibido | 88/100 | Sin placeholders ni avisos de demo visibles; textos coherentes con `CLAUDE.md` |

**DEMO READINESS: 87/100**

---

# 3. CHECKLIST DE PRODUCCIÓN

Leyenda: `[x]` verificado o corregido · `[ ]` pendiente · `[!]` requiere información externa o verificación que no pude hacer.

## HTML

- [x] Sin errores estructurales críticos (las 5 páginas cargan y renderizan)
- [x] Meta viewport presente en las 5 páginas
- [x] `<title>` definido y `lang` presente (`es-AR` / `es`)
- [x] Un solo `h1` por página (5/5)
- [x] 0 `<img>` sin atributo `alt` (index 98 `<img>`, reserva 1, viaje 1, privacidad 1, 404 0; contadas en el HTML fuente, sin las generadas por JS)
- [x] Sin placeholders («lorem», «FOTO A CARGAR», `DOMINIO-FINAL`): búsqueda en HTML y JS sin resultados (las coincidencias de «todo» eran la palabra española)
- [x] `check-links`: 0 problemas en enlaces internos y formato
- [x] 0 imágenes rotas (`naturalWidth === 0`) tras scroll completo, en todos los anchos
- [x] 9/9 enlaces `#unidad-…` abren la ficha correcta (en fuente y en `_site`)

## JavaScript

- [x] `node --check` OK en `js/*.js`, `js/motion/*.js` y `scripts/*.mjs` (19 archivos)
- [x] 0 errores de consola propios en index (1440 y 390 px), tras cargar, hacer scroll completo, abrir ficha y enviar formulario
- [x] Sin excepciones no capturadas (`pageerror`) en ninguna página
- [x] Ficha (`<dialog id="dlg">`) abre y cierra con Esc, en escritorio y móvil
- [x] Formulario «Contanos qué auto buscás» arma `wa.me/5493442647442?text=…` con el texto correcto
- [x] La build minificada (`_site`) se comporta igual que la fuente
- [!] Animaciones GSAP/Lenis: no dieron errores ni avisos; la calidad visual del movimiento no se puede juzgar en capturas estáticas
- [ ] Resto de formularios (visita, vender/permutar, reserva): no probé cada uno por separado

## CSS / Visual

- [x] Hero, comparador y ficha revisados en captura (escritorio y móvil)
- [x] Tipografías autoalojadas; 0 pedidos a Google Fonts
- [!] Contraste sobre fotos: no medido (ya figuraba como pendiente en `plan.md`)

## Responsive

Medido en `/`, `/reserva.html`, `/privacidad.html` (fuente y `_site`) y en `/viaje.html` y `/404.html` (solo fuente):

- [x] 320px
- [x] 360px
- [x] 375px
- [x] 390px
- [x] 412px
- [x] 430px
- [x] 768px
- [x] 1024px
- [x] 1280px
- [x] 1440px
- [x] 1920px

Criterio: `scrollWidth <= clientWidth` y ningún elemento no fijo con borde derecho fuera del viewport. Resultado: 0 casos.

## SEO / Publicación

- [x] `canonical`, `og:url`, `og:image` apuntan a `https://hnk375561-lab.github.io/chita/…`
- [x] `noindex, nofollow` en las 5 páginas y `Disallow: /` en `robots.txt` (coherente con `publicIndexing: false`)
- [x] `sitemap.xml`, `site.webmanifest`, `og-chita.png` presentes
- [x] `build-site.mjs` genera `_site` sin errores (usa `npx esbuild@0.28.2`, requiere red al registro npm)
- [ ] Indexación pública: **intencionalmente apagada**; se activa solo con dominio final y autorización de imágenes (regla 5 de `CLAUDE.md`)
- [!] Confirmar la URL pública desplegada (no accesible desde este entorno)

---

# 4. CAMBIOS REALIZADOS

## Cambio #01

### Archivo
`README.md`

### Problema
La sección «Estado» decía «Publicado: indexable, con `sitemap.xml`, JSON-LD y metadatos sociales». Es falso: las 5 páginas llevan `noindex, nofollow`, `robots.txt` tiene `Disallow: /`, `publicIndexing` es `false` y el JSON-LD está sin activar. Además, la línea de `privacidad.html` mencionaba un «aviso de demo» que el HTML ya no tiene.

### Solución
Reemplacé la línea de «Estado» por una que describe el estado real (demo temporal en github.io, no indexable, JSON-LD preparado sin activar, remite a la regla 5 de `CLAUDE.md`). Quité «y aviso de demo» de la descripción de `privacidad.html`.

### Motivo
El README contradecía la regla 5 de `CLAUDE.md` y habría llevado a alguien a creer que el sitio ya es indexable. No altera el sitio publicado (el README no se publica, ver `_config.yml`).

### Estado
[x] Corregido

### Verificación
`grep` confirma el texto nuevo; `npm test` (exit 0), `npm run test:prod` (exit 0) y `check-links` (0 problemas) después del cambio.

## Cambio #02

### Archivo
`index.html` (función que arma las tarjetas del comparador `#versus`, variable `eq`)

### Problema
Cada unidad mostraba «Equipamiento 0/9» con los 9 ítems en «?», porque el dueño no cargó esos datos. Podía leerse como «no tiene nada».

### Solución
`var eq=!eqy.length?'':'<div class="c5-eq">…` — el bloque de equipamiento solo se dibuja si la unidad tiene al menos un ítem confirmado. Si alguna unidad lo tuviera en el futuro, se muestra igual. Sin cambios de CSS.

### Motivo
Evitar una cifra engañosa en la demo, sin perder el dato cuando exista.

### Estado
[x] Corregido

### Verificación
Chromium: `.c5-eq` = 0 en 1440 y 390 px, 5 tarjetas del comparador renderizadas, 0 errores de consola, sin overflow horizontal; `node --check js/app.js` OK; `npm test` exit 0; captura de la sección revisada. No se re-ejecutó la matriz completa de 11 anchos ni la build `_site` después de este cambio.

---

# 5. CAMBIOS DE CÓDIGO

**Cambio #02 modificó `index.html`** (una línea) y **Cambio #03 y #06 modificaron `scripts/build-site.mjs`** (bloque T16 nuevo; lista T15). No se tocó CSS ni JS del sitio.

Se generó temporalmente `_site/` para probar la build y se borró al terminar. No se agregaron, movieron ni eliminaron archivos del repo.

---

# FILE STRUCTURE

## Archivos críticos verificados

- `index.html`, `reserva.html`, `privacidad.html`, `404.html`
- `css/`: `site`, `motion`, `identidad`, `comparador`, `chita-v54`, `resenas-compra`, `chita-v55`, `chita-v56` (los 8 que usa `index.html`), más `reserva.css` y `viaje.css`
- `js/app.js`, `js/identidad.js`, `js/motion.js`, `js/motion/core.js`, `js/recorrido.js`, `js/reserva.js`, `js/vendor/gsap-stack.js`
- `fonts/` (3 `.woff2`), `images/`, `assets/`, `video/` (`ambiente.mp4`, `reel-recorrido.mp4` referenciados)
- `og-chita.png`, `site.webmanifest`, `robots.txt`, `sitemap.xml`
- `.github/workflows/pages.yml`, `scripts/build-site.mjs`

## Archivos agregados

- Ninguno en el repo (este informe se entrega aparte).

## Archivos modificados

- `README.md` (ver Cambio #01)
- `index.html` (ver Cambio #02)
- `scripts/build-site.mjs` (ver Cambio #03)
- `plan.md` (ver Cambio #04)
- `AUDITORIA-IMPLEMENTACION.md` (ver Cambio #05)

## Archivos eliminados

- Ninguno.

## Archivos potencialmente innecesarios

Comprobado por búsqueda de referencias (excluyendo docs, `golive/`, `scripts/` y `chita-cambios/`). **No eliminé nada.**

| Archivo / grupo | Evidencia |
| --- | --- |
| `images/up-*`, `images/punto-*`, `images/nosotros-local*`, `images/kwid-1*`, `images/kwid-2*`, `images/poster-recorrido*`, `images/reel-poster-bk.webp`, `images/showroom/` | Sin referencias en el código publicado. `npm test` los marca como «imagen de reserva sin usar» (125 avisos, no errores) |
| `css/main.css` | Sin referencias |
| `preview.png` | Idéntico byte a byte a `og-chita.png` y solo lo referencia `chita-cambios/index.html` |
| `chita-cambios/` | Carpeta histórica, excluida del deploy (`_config.yml`, `netlify.toml`) |
| `js/nosotros.js`, `video/recorrido.mp4`, `images/cartel-chita.webp` | Sin uso en el sitio; `build-site.mjs` ya los quita de `_site` |

**No son «innecesarios» (tienen uso):** `images/local-calle*` y `images/local-frente*` los usa `css/viaje.css`; `viaje.html` existe en el repo pero no está en la lista blanca de `build-site.mjs`, así que **no se publica** (tampoco figura en el sitemap).

Pesa: el repo es 34 MB; `_site` bajó de 29 MB a 17 MB con el Cambio #03. Las imágenes sin usar siguen en el repo (no se borró nada).

---

# 7. ERRORES ENCONTRADOS Y RESUELTOS

| Severidad | Problema | Archivo | Solución | Estado |
| --------- | -------- | ------- | -------- | ------ |
| BAJO | Build publicaba 124 imágenes sin referencia (11,7 MB) | `scripts/build-site.mjs` | Filtro T16 conservador en `_site` | RESUELTO |
| BAJO | `plan.md` y `AUDITORIA-IMPLEMENTACION.md` con datos obsoletos | `plan.md`, `AUDITORIA-IMPLEMENTACION.md` | Actualizados al estado real | RESUELTO |
| BAJO | Comparador mostraba «Equipamiento 0/9» sin datos | `index.html` | Bloque oculto si no hay ítems confirmados | RESUELTO |
| BAJO | README afirmaba que el sitio está «publicado: indexable» y que `privacidad.html` tiene aviso de demo | `README.md` | Texto corregido al estado real | RESUELTO |

## Errores críticos

Ninguno.

## Errores altos

Ninguno.

## Errores medios

Ninguno.

## Observaciones sin corregir (no son errores)

| ID | Observación | Por qué no lo toqué |
| --- | --- | --- |
| O-1 | ~~Equipamiento «0/9»~~ | **Resuelto** en Cambio #02 |
| O-2 | `plan.md` decía «11 tarjetas» y «propuesta demo, no el sitio oficial» | **Resuelto** en Cambio #04 (alineado con `CLAUDE.md`: sitio oficial, demo temporal no indexable) |
| O-3 | Los `LEEME-*.txt` y `AUDITORIA-CHITA-PRE-PRODUCCION.md` son registros históricos y no se actualizaron a propósito | Documentos internos, excluidos del deploy |
| O-4 | `404.html` carga las fuentes con URL absoluta de github.io | Correcto en producción. En local aparece error CORS; no afecta al sitio publicado |

---

# 8. VERIFICACIÓN REAL

## Validation

- [x] `npm test` → exit 0, «Datos de Chita válidos y consistentes con index.html» (125 avisos de imágenes de reserva sin usar, ningún error). Corrido antes y después del cambio.
- [x] `npm run test:prod` → exit 0
- [x] `node scripts/check-links.mjs` → 0 problemas; 3 enlaces de mapa «a revisar a mano» y 5 externos sin probar
- [x] `node --check` sobre 19 archivos JS/MJS → todos OK
- [x] `node scripts/build-site.mjs` → generó `_site` sin errores (CSS 387 KB → 326 KB)
- [x] Browser runtime test: Chromium headless, 5 páginas × 11 anchos en fuente; 3 páginas × 11 anchos en `_site`
- [x] Console inspection (errores, warnings y `pageerror`)
- [x] Responsive inspection (overflow horizontal e imágenes rotas)
- [ ] `npm run lint` → **no existe** en `package.json`; no se ejecutó
- [ ] `npm run build` → **no existe** en `package.json`; se usó `scripts/build-site.mjs` directamente
- [ ] `npm run check:all` / `check:mobile` / `check:safari` → **no se ejecutaron** (el repo trae su propio verificador con Playwright; usé un script propio)
- [ ] Lighthouse → **no se ejecutó**

---

# 9. BROWSER QA

## Desktop

- [x] Chromium headless (motor de Chrome; **no** es Chrome de escritorio con extensiones, ni Edge, ni Firefox, ni Safari)
- [x] 1280px
- [x] 1440px
- [x] 1920px

## Mobile

Emulado con viewport + `is_mobile` + touch en Chromium. **No es un celular real.**

- [x] 320px
- [x] 360px
- [x] 390px
- [x] 412px
- [x] 430px

## Interactions

- [x] Navegación por anclas: 20 anclas, todas resueltas (las 9 `#unidad-*` no son nodos del DOM sino enlaces directos manejados por JS, y abren la ficha)
- [x] Botones: abrir ficha, cerrar con Esc, enviar formulario «Busco»
- [x] Links: `check-links` sin problemas internos
- [x] Modals: `<dialog id="dlg">` abre y cierra en escritorio y móvil
- [x] Scroll: scroll completo sin errores ni overflow
- [x] Animations: sin errores ni warnings de GSAP/ScrollTrigger (calidad visual no evaluable en captura)
- [ ] Touch interactions: **no probé gestos de arrastre** en la galería (solo clics con touch emulado)
- [ ] Reproducción de los videos: **no verifiqué que se reproduzcan** (los pedidos aparecen como `ERR_ABORTED` por la carga parcial/lazy de MP4, comportamiento normal; no es prueba de reproducción)
- [!] Mapa embebido de Google: 403 desde este entorno

---

# 10. PERFORMANCE

## Verificado

- [x] No existen errores JS críticos
- [x] No existen requests propios fallidos (solo `ERR_ABORTED` de los MP4 y el 403 del mapa de Google)
- [x] No existe overflow horizontal (11 anchos)
- [x] Animaciones sin errores
- [x] Scroll estable (sin saltos que generen errores)
- [x] Imágenes verificadas (0 rotas)
- [x] Fuentes verificadas (3 `.woff2` locales, 0 pedidos a Google Fonts)

## Riesgos restantes

- Página muy larga en móvil: ~25.300 px a 390 px de ancho. No es un fallo, pero es mucho scroll.
- La cifra de la auditoría previa (1,78 MB / 41 requests en carga inicial móvil) **no la reproduje**.
- Las imágenes sin uso ya no se publican (Cambio #03); siguen en el repo.
- Lighthouse y medición en red lenta: no realizados.

---

# 11. CONTENIDO Y DATOS

### VERIFICADO

- WhatsApp `5493442647442` en el enlace generado por el formulario «Busco».
- Dirección «Gral. Galarza 1712, Concepción del Uruguay» en el hero.
- «9 unidades publicadas» = 9 tarjetas renderizadas = 9 enlaces directos que abren su ficha.
- «4,7 · 45 reseñas en Google» aparece en el hero.
- Coincidencia de datos entre `data/dealership.json` e `index.html` (por `npm test`).
- Sin precios publicados («Consultanos»), sin estado fiscal, titular ni antigüedad (por `npm test` y revisión de la ficha).

### NO VERIFICADO

- Que «4,7 / 45 reseñas» siga vigente hoy en Google (no tengo acceso a la fuente).
- Horarios, correo, razón social y CUIT (el repo los deja sin cargar a propósito; ver `golive/AFIRMACIONES-A-CONFIRMAR.md`).
- Autorización para usar las fotos de entregas, el logo y las reseñas.
- Que el mapa embebido y los enlaces externos (Google Maps, Waze, Instagram, Facebook) abran correctamente.
- Que las 9 unidades coincidan con el stock real de hoy.

### INVENTADO

**NINGUNO.** No agregué datos, textos ni cifras al sitio.

---

# LAST ACTIONS REQUIRED

1. **Abrir la URL pública** (`https://hnk375561-lab.github.io/chita/`) desde tu celular y tu compu y confirmar que es la versión actual. No pude acceder desde este entorno.
2. **Ver el mapa de «Dónde estamos»** y confirmar que muestra el local. Dio 403 acá; en tu red debería cargar.
3. **Probar en un celular real**, idealmente iPhone/Safari si alguien lo va a mirar así (no probé WebKit).
4. **Mirar el reel del hero en tu navegador** (debe verse nítido, sin bloques, con subtítulos «Xei CVT» legibles; el video pesa 4,2 MB y arranca al hacer scroll/click). No pude reproducirlo en mi entorno (Cambio #06).
5. **Subir al repo los 5 archivos modificados** (`README.md`, `index.html`, `scripts/build-site.mjs`, `plan.md`, `AUDITORIA-IMPLEMENTACION.md`), esperar el deploy de Pages y repetir el check de 5 minutos sobre la URL pública. **El workflow de Pages ejecuta `build-site.mjs`, así que el Cambio #03 solo tiene efecto después de ese deploy y no fue probado en GitHub Actions.**

Ninguno de estos puntos corresponde a un defecto de código conocido.

---

# FINAL 5-MINUTE CHECK

- [ ] Abrir URL pública
- [ ] Recargar con Ctrl+F5 (que no quede versión cacheada)
- [ ] Revisar hero (título, botones «Ver unidades» y «Escribinos», reseñas 4,7)
- [ ] Hacer scroll completo, de arriba a abajo
- [ ] Abrir una ficha de unidad, pasar fotos y cerrar
- [ ] Probar «Escribinos» (debe abrir WhatsApp con el mensaje armado; **no lo envíes**)
- [ ] Probar un formulario («Contanos qué auto buscás») y ver el mensaje armado
- [ ] Ver el mapa de «Dónde estamos»
- [ ] Probar en el celular (hero, menú horizontal, ficha a pantalla completa)
- [ ] Abrir la consola (F12) y confirmar que no hay errores en rojo (puede aparecer el aviso del mapa si tu red lo bloquea)
- [ ] Verificar que no haya imágenes rotas ni videos en negro
- [ ] Confirmar que sabés que el sitio es **noindex** a propósito (no aparecerá en Google)
