# APLICAR-TODO.md — Chita Automotores (demo para el dueño)

Instrucciones para ejecutar (Claude Code o a mano) **todo lo que NO depende del dueño**.
Revisión: **2026-10-08 (v3, con tareas aplicadas)** · Repo: `hnk375561-lab/chita` · Base auditada: `chita-main` (zip del 8/10, 702 archivos, 161 MB).

> **Cómo leer esta versión.** Marcas: **[NUEVO]** = no estaba en la v1 · **[CAMBIÓ]** = estaba y se corrigió · **[HECHO]** = ya está en el zip, solo verificar.
> Todo lo marcado "verificado" salió de abrir el zip y correr `npm test` y `build-site.mjs` acá. **No** se corrió Playwright (no hay navegador en este entorno): las tareas 4.5, 4.6, 4.7 y 4.8 siguen siendo de ejecución local.

---

## Estado de aplicación (v3)

Todo lo marcado **Aplicado** está en `chita-cambios-2026-10-08.zip` (acumulado: se descomprime sobre la raíz del repo y se corre `bash BORRAR.sh`). Verificado con `npm test`, `node scripts/build-site.mjs` (sin enlaces rotos; `_site` pasó de 140 MB a 90 MB) y `node --check`. **Nada se vio en navegador.**

| Tarea | Estado |
|---|---|
| 4.1 Arreglos de `secciones.js` / CSS | Ya estaban en el zip. Falta solo la verificación visual |
| 4.2 Privacidad: `netlify.toml` con `[build]`, redirecciones 404, `.gitignore` | **Aplicado.** Falta decidir repo privado y mover carpetas internas (acción tuya en GitHub) |
| 4.3 Limpieza: 6 videos (58 MB), `salon.js`, `LEEME.txt`, Leaflet/MapLibre, 103 imágenes de reserva | **Aplicado.** `assets/` **no se toca** (ver corrección C8) |
| 4.4 `--prod` real | **Aplicado** (14 errores hoy, a propósito) |
| 4.5 Build: 1 solo CSS, 3 JS minificados más, CSS duplicados fuera de `_site` | **Aplicado.** Póster y `-lite` de videos: ver corrección C9 |
| 4.6 Botones táctiles · 4.7 QA · 4.8 enlaces externos | **Pendiente, en tu máquina** (necesitan navegador) |
| 4.8 `viaje.html` | **Aplicado:** borrado con `js/viaje.js`, `css/viaje.css`, `docs/VIAJE.md` y salió de `check-all` |
| 4.9 Valoración 4,7 · 46 | **Aplicado** (`index.html`, `dealership.json`, `sources.json`) |
| 4.10 Regla de fotos con texto | **Aplicado** en `docs/CONTENIDO.md`. Falta comparar año/km de las 10 unidades contra su foto (a ojo) |
| 4.11 Registro 2026-10-08 | **Aplicado** (`AFIRMACIONES`, `hours.versions`, email, Instagram). No subir las capturas con el usuario de un tercero |
| 4.12 `PRODUCCION.md`, `README`, `SECCIONES-PENDIENTES`, JSON-LD, `npm run golive -- --dry` | **Aplicado** |
| 4.13 Horario | **Publicado** (ver abajo). Falta el ok escrito del dueño |
| 4.14 Domingos en `reserva.html` | **Aplicado** |
| 4.15 Facebook 15.000 sin verificar / Gestoría | Pendiente (dueño / verificación manual) |

**Horario publicado (4.13):** "Lunes a viernes de 9:00 a 17:00 · Sábados de 8:30 a 12:00 · Domingos cerrados. Feriados: consultá por WhatsApp." Criterio: Google Maps (vigente) manda; sábado 8:30–12 lo repiten Google, GTM y LatinoPlaces; domingo cerrado lo dicen todas. **El lunes habitual es una inferencia** (Google solo lo muestra como feriado el 12/10).

**Correcciones nuevas de esta ronda:**
- **C8 · `assets/` no se limpia a mano.** La lista de "sin referencia" de la v2 era engañosa: `js/app.js` arma los `srcset` en tiempo de ejecución (`-480`/`-800`) y mapea fotos numeradas a `assets/w480/N.webp` y `assets/w800/N.webp`. Por eso esos archivos sí se usan. Borrarlos rompería fotos. Ignorar la parte de `assets/` de la tarea 4.3 y de la sección 0 (hallazgo C7).
- **C9 · Los `-lite` casi no se usan.** Solo el video del hero (`#reelv`, `js/identidad.js`) elige la versión lite con conexión lenta; el resto la usa solo si falla la carga (`js/lugar.js`). Generar `-lite` para `lz-*` y `atencion` no sirve sin tocar JS. Tampoco hay póster por JS en `clips.js`. Queda como mejora opcional, no como tarea.
- **C10 · El widget de las 45 casillas está oculto a propósito** (`css/identidad.css` línea ~1655, `display:none!important`). Sus reglas están mezcladas con otras: no borrarlas sin prueba visual. El cambio a 46 fue solo texto.
- **C11 · El JSON-LD ya está activo en `index.html`** (la copia de `golive/` era solo respaldo). Se le agregaron los horarios y se alineó la copia de `golive/`.

---

## 0. Qué cambió respecto de la v1 (resumen)

**Datos nuevos con evidencia del 2026-10-08 (5 capturas de las redes del negocio):**

| Dato | Valor | Fuente | Efecto |
|---|---|---|---|
| Horario Google Maps | mar–vie 9:00–17:00 · sáb 8:30–12:00 · dom cerrado | Google Maps (ficha del negocio) | Reemplaza el diagnóstico "no se pueden confirmar" (ver 1.1) |
| Lunes 12/10 | Cerrado, "Horario especial" (Día del Respeto a la Diversidad Cultural) | Google Maps | Es un feriado: **no** muestra el horario habitual del lunes (ver corrección C1) |
| Valoración | **4,7 · 46 reseñas** | Google Maps | El sitio dice 45 → hay que actualizar (tarea 4.9) |
| Tel. fijo | 03442 44-2782 | Facebook (contacto) | Confirmado en la página del propio negocio |
| WhatsApp | +54 9 3442 64-7442 | Facebook (contacto) | Ya estaba confirmado el 3/10; ahora doble fuente |
| Email | chitaautomotores@gmail.com | Facebook (contacto) | Sube de "La Guía Local" a **página propia del negocio** (ver 1.2) |
| Gestoría | 3442-547671 | Instagram (bio) | Resuelve la pregunta 7 |
| Instagram | 7.953 seguidores · 178 publicaciones · 52 seguidos · bio "Usados y 0km \| Cuotas fijas" | Instagram | Reemplaza "8.000 (sin verificar)" |

**Correcciones a lo que se dijo antes (v1 y mi respuesta anterior):**

- **C1 · El lunes no está confirmado.** La captura muestra el lunes 12/10 con horario especial (feriado). El horario normal del lunes no se ve. Lo visible y confirmado es **martes a viernes 9–17**. Para cerrar "lun–vie" hay que mirar la ficha en una semana sin feriado (después del 12/10) o preguntarlo.
- **C2 · LatinoPlaces no es una confirmación independiente.** `data/dealership.json` ya lo rotula "datos tipo Google Maps": copia Google. Que coincida con Google no suma una segunda fuente. Los directorios con corte de mediodía (8:30–12 y 16–20) son versiones viejas.
- **C3 · "Horarios según Google" choca con `CLAUDE.md` regla 1** ("sin 'a confirmar' ni 'según'"). No poner "según Google" en el sitio: la fuente va en el registro interno, no en el texto público. Ver 4.13.
- **C4 · El WhatsApp ya figuraba confirmado en el repo** (`data/dealership.json`, `contact.status`, capturas del 3/10). Sale de las preguntas al dueño.
- **C5 · Las arreglos de la tarea 4.1 ya están aplicados en el zip.** Pasan de "subir" a "verificar" (4.1).
- **C6 · Videos:** la v1 decía que `hero-lite.mp4` y `reel-recorrido.mp4` tenían 0 referencias. Los menciona `scripts/build-site.mjs` (solo para excluirlos del `_site`). Se pueden borrar igual, pero hay que saberlo (4.3).
- **C7 · `assets/` tiene 299 archivos**, no 156 (la v1 contaba mal). Ver 4.3.

**Hallazgos nuevos que no estaban en la v1 (los más importantes):**

1. *(Resuelto)* El build publicaba **~49 MB de videos sin uso** (`hero.mp4`, `salon-*`): `_site` pesa 140 MB. (4.3, 4.5)
2. `netlify.toml` **no tiene `[build]`**: si se despliega en Netlify tal cual, publica toda la raíz del repo y depende de redirecciones sueltas (no cubre `PERF-CAMBIOS.md`, `.github/`, `_config.yml`). (4.2)
3. `golive/PRODUCCION.md` está **desactualizado** (habla de banner de demo, claves `demo.*`, "3 opiniones", "39 años"). (4.12)
4. `scripts/validate-dealership.mjs` no lee argumentos: `--prod` no existe. (4.4, confirmado)
5. `reserva.html` deja elegir **domingos** y feriados. (4.14)
6. `scripts/check-all.mjs` prueba `viaje.html`, que **no se publica**: contra el sitio publicado daría falsos fallos. (4.8)
7. ~1 MB de **librerías de mapa sin uso** (Leaflet y MapLibre; ningún HTML ni JS las carga). (4.3)
8. Código muerto del widget de "45 casillas" (`.rv45` en `css/identidad.css` y `js/identidad.js`): el HTML ya no existe. Cambiar a 46 es solo texto. (4.9)
9. `README.md` y `golive/SECCIONES-PENDIENTES.md` describen secciones "Pendiente de confirmación" que **ya no están en `index.html`**. (4.12)
10. JSON-LD preparado con **Facebook y Maps distintos** a los de `NEGOCIO`. (4.12)
11. Una captura muestra un **usuario de un tercero** ("kevincabax sigue esta cuenta"): no subirla al repo. (4.11)

---

## 1. Resultado de la investigación pública

### 1.1 Horarios **[CAMBIÓ]**

La ficha de Google Maps (fuente más cercana al negocio) muestra:

| Día | Horario |
|---|---|
| Martes, miércoles, jueves, viernes | 9:00–17:00 (de corrido) |
| Sábado | 8:30–12:00 |
| Domingo | Cerrado |
| Lunes | **Sin dato habitual** (el 12/10 aparece "Cerrado · Horario especial" por feriado) |

Contraste con los directorios (todos con fecha de consulta 2026-10-02 en el repo):

| Fuente | Lun–Vie | Sábado | Estado |
|---|---|---|---|
| **Google Maps** (captura 8/10) | 9:00–17:00 | 8:30–12:00 | Vigente |
| LatinoPlaces | 9:00–17:00 | 8:30–12:00 | Copia de Google; no cuenta como 2ª fuente |
| Cylex | 8:30–12:00 y 16:00–20:00 | 9:00–12:00 | Cargado 27/12/2022, actualizado 18/07/2024: viejo |
| InfoisInfo | 8:30–12:00 y 16:00–20:00 | 9:00–12:00 | Sin fecha: viejo |
| GTM | 8:30–12:00 y 16:00–20:00 | 8:30–12:00 | Sin fecha: viejo |
| ZonaAuto | 8:30–12:00 y 15:30–19:30 | 9:00–12:30 | ~962 días: viejo |

**Decisión [CAMBIÓ]:** ya hay fuente pública vigente. Mientras tanto el sitio sigue sin publicar horario (`NEGOCIO.horarios = ""`, `hours.display = null`). Publicarlo se decide en la tarea **4.13** (una sola confirmación del dueño por WhatsApp alcanza). Hasta entonces el texto actual "Confirmamos disponibilidad y horario por WhatsApp" (`index.html` línea ~135) sigue siendo correcto.

### 1.2 Contacto y redes **[CAMBIÓ]**

| Dato | Fuente | Estado |
|---|---|---|
| Tel. 03442 44-2782 | Facebook del negocio + Cylex, Dirtel, Licuo, LatinoPlaces | Confirmado. Ya está en el sitio |
| WhatsApp +54 9 3442 64-7442 | Facebook del negocio; perfil de WhatsApp (3/10) | Confirmado. Ya está en el sitio (`5493442647442`) |
| Email chitaautomotores@gmail.com | **Facebook del negocio (8/10)**; antes solo La Guía Local y Cylex | Fuente propia del negocio. Sigue en `email: null` hasta que el dueño lo apruebe (ver 4.13). Es un gmail del negocio, no lleva el nombre del dueño |
| Gestoría 3442-547671 | Instagram (bio, 8/10) | Confirmado como **Gestoría**. `NEGOCIO.gestoria` existe pero **no se muestra en ningún lugar** del sitio. No publicarlo como teléfono general |
| Instagram @chita.automotores | Captura 8/10 | 7.953 seguidores · 178 publicaciones. Bio: "Concesionaria · Usados y 0km \| Cuotas fijas · Gestoría" |
| Facebook | Captura 8/10 | `facebook.com/Chitaautomotores` (el de `NEGOCIO`). El JSON-LD preparado usa otro (`profile.php?id=100011380620292`): unificar (4.12) |
| Tel. 03442-442857 (DeVenta) | DeVenta | Probable error de tipeo. Descartar y registrar el conflicto |
| Tel. 3442 547671 como general (ZonaAuto) | ZonaAuto | Falso: es la Gestoría |

Lo que respalda cada servicio (solo directorio o una frase de perfil; **no ampliar el texto del sitio**):

- "Usados y 0km" y "Cuotas fijas": una línea de la bio de Instagram. Ya figuran en `services.supportedBySocial`. No alcanzan para publicar condiciones de financiación.
- "Consignaciones, permutas, ventas por mandato, 0km todas las marcas": DeVenta (ficha "Socio N° 14"). Directorio: registrar, no publicar.
- "Concesionario multimarca 0 km y usados": ZonaAuto. Igual.

### 1.3 Valoración **[CAMBIÓ]**

- Google Maps, 8/10: **4,7 · 46 reseñas**. El sitio y el registro dicen 45 (consulta del 2/10).
- GTM (9,2/10, 58 reseñas) y Cylex (31 opiniones) usan otra escala u otra base: **no mezclar**.
- Facebook: 100 % recomendado, 22 opiniones (ya publicado con fecha, 3/10). Sin cambios.

Ninguna de estas fuentes autoriza usar fotos, el nombre del dueño ni su email personal.

---

## 2. Reglas que mandan (de `CLAUDE.md`)

- Cero datos inventados. Un dato nuevo solo entra con fuente pública citada o confirmación escrita del dueño. Sin "a confirmar" ni "según" en el texto público.
- Todo dato nuevo se registra en `golive/AFIRMACIONES-A-CONFIRMAR.md` (fuente + fecha) y en `data/dealership.json`; ambos deben coincidir con el bloque `NEGOCIO` de `index.html` (`npm test`).
- Cambio mínimo. No cargar datos personales del dueño ni de su familia (los directorios usan su nombre: **no** usarlo).
- Mientras `publicacion.publicIndexing` sea `false`: `noindex, nofollow` en las 4 páginas y `Disallow: /` en `robots.txt`. (**Verificado** en el zip: `noindex` en `index`, `reserva`, `privacidad`, `404` y `viaje`; `robots.txt` con `Disallow: /`.)
- Conflictos entre fuentes viven en `data/sources.json` y `data/vehicles.json`; no se resuelven por cuenta propia.

---

## 3. Estado verificado del zip (antes de tocar nada)

| Chequeo | Resultado |
|---|---|
| `npm test` | **Pasa** ("Datos de Chita válidos y consistentes con index.html") |
| `node --check` de todos los `js/*.js` | Sin errores. `js/secciones.js` ya es JavaScript válido |
| Arreglos de 4.1 | **Ya aplicados** (`--fbg` presente en `secciones.js` y `secciones.css`; `transform:none!important` solo afecta imágenes, no `#unidades .ctk`) |
| `npm run test:prod` | Pasa, y **no debería** (el flag no existe, ver 4.4) |
| `node scripts/build-site.mjs` | Funciona (esbuild 0.28.2 disponible en npm). `_site` = **140 MB** (video 113, assets 19, imágenes 6) |
| `index.html` | 10 unidades en `STOCK`, 9 `<video>` todos con `preload="none"`, cero "a confirmar"/"Pendiente" visibles |
| Stock | Palio 2017 sin km (conflicto 128.000 / 120.000); las otras 9 con km |

No verificado acá: render en navegador, carrusel, medidas de peso real, enlaces externos, tamaño de botones.

---

## 4. Orden de ejecución

1. **4.1** (verificar lo ya aplicado) y **4.2** (privacidad). Antes de mandar el link a nadie.
2. **4.9, 4.11, 4.13** (datos nuevos de hoy: valoración, registro, horarios).
3. **4.3** (limpieza; baja 58 MB del repo y 49 MB del sitio publicado).
4. Resto de tareas en el orden que quieras; cada una es independiente.
5. Al final: `npm test`, `npm run check:all` y la prueba manual de la sección 6.

---

## 5. Qué NO se toca (depende del dueño)

Precios · km del Palio (128.000 vs 120.000) · autorización de fotos y videos · condiciones de financiación · qué significa "Recibimos tu usado" · marcas 0 km actuales · disponibilidad de cada unidad · si se muestra la Gestoría · historia / "39 años" (no usar) · equipo y local con fotos · razón social, CUIT y estado fiscal (conflicto entre Indicadores AR y Datok: no publicar).
Preguntas listas para el dueño en la sección 7.

---

## 6. Tareas

### 4.1 Verificar los arreglos de `chita-fix.zip` **[HECHO]**
- Ya están en el zip: `js/secciones.js` (JS válido), `css/secciones.css`, `css/site.css`.
- No volver a subirlos. Verificar: Ctrl+F5; abrir la ficha de un auto y avanzar con las flechas; ver que las 4 fotos de "Comprá, vendé o permutá" cargan y que la ficha tiene el fondo difuminado.
- Si algo falla, ver `js/secciones.js` (marca `.ld`) y `css/secciones.css` (`opacity:0` hasta `.ld`).

### 4.2 Privacidad del repo y del link de la demo **[CAMBIÓ]**
- Hoy el repo es público: `golive/`, `data/`, `docs/`, `CLAUDE.md` se leen en github.com aunque no se publiquen en el sitio. (El workflow `pages.yml` ya publica solo la lista blanca de `build-site.mjs`: eso está bien.)
- GitHub Pages desde repo privado exige plan Pro/Team/Enterprise, y **aun así el sitio publicado es público**. No resuelve la privacidad del sitio.
- Opción recomendada: repo privado + publicar en Netlify. Verificar en Netlify si el plan permite protección con clave antes de prometérsela al dueño.
- **[NUEVO] Arreglar `netlify.toml` antes de usarlo.** No tiene `[build]`, así que Netlify serviría la raíz entera. Agregar:
  ```toml
  [build]
    command = "node scripts/build-site.mjs"
    publish = "_site"
  [build.environment]
    NODE_VERSION = "20"
  ```
  Con eso se publica solo la lista blanca (y con CSS minificado). Las redirecciones 404 de carpetas internas quedan como segunda barrera. Faltan en esa lista: `/PERF-CAMBIOS.md`, `/_config.yml`, `/.github/*`.
- Mientras tanto, mover fuera del repo (o a una rama privada): `golive/`, `data/`, `docs/`, `plan.md`, `manus-routes.json`, `PERF-CAMBIOS.md`, `LEEME.txt`.
- **[NUEVO] `.gitignore`:** agregar `check-report/` (lo crea `check-all.mjs`), `.env` y `*.zip`.
- Si el repo sigue público: confirmar que `noindex` y `Disallow: /` están activos (lo están hoy).

### 4.3 Limpieza del repo **[CAMBIÓ]** (verificar con `grep` antes de borrar cada cosa)

**Código muerto**
- Borrar `js/salon.js` (el index no lo carga; `LEEME.txt` ya lo pide) y luego `LEEME.txt`.
- **[NUEVO]** Borrar `js/vendor/leaflet/` y `js/vendor/maplibre/` (~1 MB). Ningún HTML ni JS los carga (`grep -rn "leaflet\|maplibre" index.html reserva.html privacidad.html 404.html viaje.html js/*.js` da 0). Si se conserva `viaje.html` (ver 4.8), revisar `js/viaje.js` antes de borrar.
- **[NUEVO]** Código del widget "45 casillas" ya sin HTML: reglas `.rv45*` en `css/identidad.css` (líneas ~754–768, ~1391) y el bloque `#opiniones .rv45 i` de `js/identidad.js` (~línea 222). Quitarlos o dejarlos anotados como pendiente; no afectan el aspecto.

**Videos (121 MB en el repo)**

| Archivo | MB | Referencia | Acción |
|---|---|---|---|
| `hero.mp4` | 15 | ninguna | Borrar. **Hoy el build lo publica** |
| `salon-charla-taller.mp4` | 17 | ninguna | Borrar. **Hoy el build lo publica** |
| `salon-detalle-autos.mp4` | 10 | ninguna | Borrar. **Hoy el build lo publica** |
| `salon-recorrido-auto.mp4` | 7 | ninguna | Borrar. **Hoy el build lo publica** |
| `hero-lite.mp4` | 7 | solo `build-site.mjs` (lo excluye) | Borrar |
| `reel-recorrido.mp4` | 2 | solo `build-site.mjs` (lo excluye) | Borrar |

- Total: ~58 MB en el repo; **49 MB se publican hoy sin que nadie los use**. Confirmar cada uno con `grep -r "<nombre>" index.html js css *.html` y, tras borrar, quitar `video/reel-recorrido.mp4` y `video/hero-lite.mp4` de la lista de exclusión de `build-site.mjs` o dejarlos (es inofensivo: usa `existsSync`).
- Si no se quieren borrar del repo, **al menos** agregar los 4 primeros a la lista `unused` de `build-site.mjs`.

**Imágenes**
- Reservas sin usar que lista `npm test` (`images/up-*`, `images/punto-1..7*`, `images/poster-variedad.webp`, `images/reel-poster-bk.webp`, `images/showroom/`): borrar las que den 0 referencias. (El build ya las excluye del `_site`: 134 archivos, 12,3 MB.)
- **`assets/` (299 archivos): no borrar.** Se usan por rutas armadas en tiempo de ejecución (ver C8). Si algún día se quiere reducir, hacerlo con una prueba que cargue cada ficha y mire la red.

Resultado esperado: repo bastante por debajo de los 161 MB actuales sin cambiar el aspecto. Comprobar con `npm test` y `npm run check:all`.

### 4.4 Que `npm run test:prod` sea una puerta real
- Confirmado: `scripts/validate-dealership.mjs` **no lee argumentos**; `--prod` se ignora y por eso pasa en modo demo.
- Implementar `--prod` para que falle si queda cualquiera de: `noindex` en las páginas, `Disallow: /` en `robots.txt`, `publicIndexing:false`, textos "a confirmar" / "a cargar" / "EJEMPLO" / "Pendiente de confirmación", WhatsApp sin cargar, `horarios` vacío (decidir con el dueño si bloquea), fotos sin autorización, `sitemap.xml` o `canonical` apuntando a `github.io`, `email` en `null` si `privacidad.html` pide un canal.
- **[NUEVO]** No ponerlo en `pages.yml` mientras el sitio sea demo (el workflow corre `npm test`).
- `npm test` (modo demo) sigue exigiendo lo contrario, como dice `CLAUDE.md` regla 5.

### 4.5 Peso de carga (la v1 hablaba de ~5 MB en celular en la primera carga; no se re-midió acá)
- **Verificado:** los 9 `<video>` tienen `preload="none"` y `data-src` (no cargan al abrir).
- **[NUEVO]** Solo 2 de los 9 declaran `poster` en el HTML (`atencion`, `ambiente`). Confirmar en `js/clips.js` si el resto lo pone por JS; si no, agregar póster (los `.webp` de `images/poster-*` ya existen).
- **[NUEVO]** Sin versión `-lite` para celular: `lz-charla` (9 MB), `lz-detalle` (6 MB), `lz-recorrido` (4 MB), `atencion` (9 MB). Solo cargan al llegar a esa parte, pero en datos móviles pesan. Generar `-lite` o dejarlo anotado.
- **[NUEVO]** El build deja **7 hojas CSS** (1 empaquetada + `chita-v61`, `v62`, `lugar`, `quieto`, `secciones`, `perf2`). Agregarlas a la lista `CSS` de `build-site.mjs` **en el mismo orden que `index.html`** (la cascada importa) baja a 1 pedido. Además el build deja copias sin minificar de todos los CSS en `_site/css` (~944 KB): borrarlas del `_site`.
- **[NUEVO]** `build-site.mjs` minifica 8 JS; no incluye `secciones.js`, `lugar.js`, `hero-rail.js`. Agregarlos.
- Medir antes y después con Playwright (carga inicial en 390 px) y anotar el número en `PERF-CAMBIOS.md`. Meta: primera carga en celular bajo 3 MB sin perder el hero.

### 4.6 Tamaño de botones táctiles
- En 390 px hay ~25 enlaces/botones de menos de 32 px de alto (dato de la v1, sin re-medir). Listarlos con Playwright (`getBoundingClientRect().height < 44`) y subir el área táctil a 44 px con `min-height` o `padding`, sin cambiar el diseño visual.
- Mirar primero las chips de marca (`.fm-chip`), la barra inferior `.bar` y el pie.

### 4.7 QA en navegadores y dispositivos
- Correr `npm install`, `npx playwright install chromium` (y `webkit` para Safari), luego `npm run check:all`, `check:mobile`, `check:safari`, `check:devices`. Corregir lo que falle.
- Probar a mano en un iPhone real y en un Android: carrusel con deslizamiento, ficha, formularios, botón "Escribinos".

### 4.8 Enlaces externos y `viaje.html` **[CAMBIÓ]**
- `node scripts/check-links.mjs --external`.
- Abrir a mano los 4 enlaces de Google Maps que el script marca "A REVISAR" y confirmar que el pin cae en Gral. Galarza 1712 (coordenadas en el repo: −32,486865 / −58,250318).
- **[CAMBIÓ]** La v1 pedía agregar `viaje.html` a `check-links.mjs`. Mejor decidir primero: `viaje.html` **no se publica** (no está en la lista blanca) y no está en `sitemap.xml`. Pero `check-all.mjs` sí lo prueba (`PAGES`), por lo que `check-all --url=<sitio publicado>` daría falsos fallos. Opciones: (a) sacarlo de `PAGES` y borrar `viaje.html`, `js/viaje.js`, `css/viaje.css`, `docs/VIAJE.md`; (b) publicarlo de verdad. Recomendado (a) salvo que el dueño lo quiera.

### 4.9 Valoración de Google **[CAMBIÓ]**
- Dato verificado el 2026-10-08: **4,7 · 46**.
- Cambiar el texto en `index.html` en **tres** lugares: línea ~58 ("4,7 · 45 reseñas en nuestra ficha"), línea ~64 ("45 reseñas en Google") y línea ~69 ("4,7 de 5 con 45 reseñas"). Las líneas ~87–88 dicen solo "4,7 sobre 5" y no cambian.
- `data/dealership.json` → `reputation.google`: `count: 46`, `checkedAt: "2026-10-08"`.
- `data/sources.json` → entrada "Valoración en Google": `4,7/5, 46 reseñas`, `checkedAt` 2026-10-08.
- En `golive/AFIRMACIONES-A-CONFIRMAR.md` **no reescribir** las líneas viejas (16, 178, 181: son historial): agregar el bloque de 4.11.
- `docs/IDENTIDAD-MADRE.md` (líneas ~204, 212, 274) menciona 45: actualizar o marcar como histórico.
- La cifra cambia sola con el tiempo: dejarla en un único lugar (`data/dealership.json`) y que el sitio la lea de ahí **es una mejora opcional**, no necesaria para la demo.
- El día de la demo, abrir la ficha y comparar. Si no se puede confirmar ese día: reemplazar por un enlace "Ver reseñas en Google" sin número.
- Correr `npm test` después del cambio.

### 4.10 Fotos de unidades con datos escritos encima
- Las tarjetas muestran fotos con año y km impresos en la imagen (ej. "Año 2016 · Km 123.000"). Si el dueño corrige un dato, la foto queda desactualizada.
- Agregar a `docs/CONTENIDO.md` la regla: cada cambio de año/km en `STOCK` exige rehacer la foto o pedir foto sin texto.
- Revisar que cada una de las 10 unidades tenga año y km en `STOCK` iguales a los de su foto. Hoy el Palio 2017 no tiene km en `STOCK` ("Consultar") pero la foto muestra 128.000: es el conflicto abierto con 120.000.
- **[NUEVO]** `data/vehicles.json` menciona un "Palio Attractive Serie 2" 2013 con 128.000 km; ese auto **no está** en `STOCK`. No preguntarlo al dueño como pendiente salvo que aparezca en su stock real.
- Unidades duplicadas posibles (según `plan.md`): Tracker 1.8N 2018 y Palio 1.4N. Confirmar con el dueño que no se repiten.

### 4.11 Registrar lo investigado **[CAMBIÓ]**
Agregar en `golive/AFIRMACIONES-A-CONFIRMAR.md` un bloque **"Revisión 2026-10-08"** con:

```
## Revisión 2026-10-08 (capturas de redes del negocio)
- Horario Google Maps (ficha del negocio): mar–vie 09:00–17:00 · sáb 08:30–12:00 · dom cerrado.
  Lunes 12/10: cerrado, "Horario especial" (feriado). Lunes habitual: sin dato visible.
  Directorios Cylex, InfoisInfo, GTM, ZonaAuto (corte de mediodía): versiones anteriores. LatinoPlaces: copia de Google.
- Valoración Google: 4,7 · 46 reseñas (antes 45, consulta 2026-10-02).
- Teléfono 03442 44-2782 y WhatsApp +54 9 3442 64-7442: Facebook del negocio, 2026-10-08.
- Email chitaautomotores@gmail.com: Facebook del negocio, 2026-10-08. No publicado hasta aprobación del dueño.
- Gestoría 3442-547671: Instagram (bio), 2026-10-08. No es teléfono general.
- Instagram: 7.953 seguidores, 178 publicaciones (2026-10-08). Facebook: 15.000 sigue sin verificar.
- Tel. 03442-442857 (DeVenta): probable error de tipeo; descartado.
- DeVenta menciona consignaciones, permutas, ventas por mandato y 0 km todas las marcas: directorio, sin autorización del dueño.
```

- `data/dealership.json`:
  - `hours.versions`: **actualizar** la entrada "Google Business" (agregar `checkedAt: 2026-10-08`, `lv` solo "mar–vie 09:00–17:00", nota de feriado) y **agregar** InfoisInfo y LatinoPlaces (con la aclaración de que copia Google). Mantener `display: null`.
  - `hours.note`: hoy dice "Tres versiones"; ya son cinco y una es vigente.
  - `contact.emailCandidate`: cambiar la fuente a "Facebook del negocio, 2026-10-08".
  - `social.instagramFollowers`: `7.953 (2026-10-08)`.
- No tocar `index.html` por esto (salvo 4.9).
- **[NUEVO] No subir las capturas al repo tal cual.** La captura del Instagram muestra un usuario de un tercero ("kevincabax sigue esta cuenta"): recortarla o no guardarla. Si se guardan como evidencia, que sea en una carpeta privada, recortadas.

### 4.12 Dejar preparado (sin activar) el paso a producción **[CAMBIÓ]**
- **`golive/PRODUCCION.md` está desactualizado.** Reescribirlo porque todavía dice: aviso de demo arriba y en el pie, "Sobre esta demo", claves `demo.official` / `demo.publicIndexing` (hoy son `publicacion.official` / `publicacion.publicIndexing`), "la ficha tiene 3 opiniones", "39 años de confianza" dentro del logo, y que no hay sitemap. `CLAUDE.md` regla 5 ya dice que no hay avisos de demo y que el sitemap está activo.
- Lista a dejar completa: quitar `noindex` y `Disallow`, restaurar `Sitemap:`, activar JSON-LD y `sitemap.xml`, cambiar `canonical`, `og:url`, `og:image`, `twitter:image`, `<base href>` de `404.html`, JSON-LD y `robots.txt` al dominio real.
- **[NUEVO] `sitemap.xml` raíz:** hoy lista las URLs de `github.io` aunque el sitio es `noindex`. Es inofensivo pero contradice la regla; dejarlo anotado para el cambio de dominio.
- **[NUEVO] `golive/json-ld-autodealer.html`:** `sameAs` usa `facebook.com/profile.php?id=100011380620292` pero `NEGOCIO.facebook` es `facebook.com/Chitaautomotores`, y `hasMap` usa una URL construida distinta de `mapsPlaceUrl`. Unificar con `data/dealership.json`. **No agregar `aggregateRating`:** Google no muestra estrellas para reseñas propias de un negocio local (self-serving), solo agrega riesgo. Agregar `openingHoursSpecification` solo cuando se publiquen los horarios (4.13).
- **[NUEVO]** `README.md` y `golive/SECCIONES-PENDIENTES.md` describen secciones "Pendiente de confirmación", un `#unidad-kwid-2019` y horarios "a confirmar" que ya no existen en `index.html`. Actualizar o archivar.
- Escribir `npm run golive` en modo `--dry`: muestra los cambios sin aplicarlos. No ejecutarlo hasta tener dominio y autorización de fotos.

### 4.13 Publicar (o no) el horario **[NUEVO]**
Con la fuente de Google ya hay dos caminos. Elegir uno **con el dueño**; no depende del código.

- **Camino A (recomendado):** mandarle por WhatsApp el horario de Google y pedirle un "ok" por escrito (queda como confirmación escrita, regla 1). Con eso se publica sin ninguna aclaración de fuente.
- **Camino B:** publicar con la fuente pública (Google Maps) registrada en `AFIRMACIONES-A-CONFIRMAR.md`. Funciona con la regla, pero **sin** escribir "según Google" en el sitio (corrección C3).
- En ambos casos, antes de publicar: confirmar el **lunes habitual** (C1) y decidir cómo se comunican los **feriados** (ej. una línea fija "Feriados: consultá por WhatsApp").

Qué tocar al publicar:
1. `index.html` → `NEGOCIO.horarios`, y revisar el texto "Confirmamos disponibilidad y horario por WhatsApp" (línea ~135).
2. `data/dealership.json` → `hours.display` y `hours.status`.
3. `golive/json-ld-autodealer.html` → `openingHoursSpecification` (solo con horario confirmado).
4. `reserva.html` / `js/reserva.js` → ver 4.14.
5. `npm test`.

El **email** se resuelve en el mismo mensaje: pedirle que confirme si `chitaautomotores@gmail.com` es el canal oficial. `privacidad.html` necesita un canal para ejercer derechos (hoy figura sin email).

### 4.14 `reserva.html` ignora días y horarios **[NUEVO]**
- `js/reserva.js` habilita **cualquier día desde hoy** (`enabled = date >= startOfToday()`), incluidos domingos y feriados, con franjas "Mañana" / "Tarde". El texto aclara "Es una consulta: te confirmamos día y horario", por eso no es grave hoy.
- Si se publica el horario (4.13): deshabilitar domingos (y el lunes si resulta cerrado), y revisar que "Tarde" no sugiera después de las 17:00.
- Sin publicar horario: dejarlo como está; basta con que la nota lo diga.

### 4.15 Ajustes menores de datos **[NUEVO]**
- `social.facebookFollowers: "15.000 (dato del solicitante, sin verificar)"` y `lastFacebookPost`: no usarlos en el sitio. Abrir Facebook y verificar o borrar.
- Mostrar o no la **Gestoría** (3442-547671) en el sitio: es una decisión del dueño (pregunta 7). Hoy está cargada en `NEGOCIO` pero no se muestra.

---

## 7. Checklist final antes de mostrarlo

- [ ] `npm test` pasa.
- [ ] `npm run check:all` sin errores.
- [ ] Ctrl+F5 en escritorio y en celular real: fotos de operaciones visibles, flechas de tarjeta y de ficha andan, fondo borroso en la ficha.
- [ ] Sin errores en consola, sin imágenes rotas, sin scroll horizontal (390 px y 1440 px).
- [ ] Valoración de Google comparada **hoy** con la ficha (hoy: 4,7 · 46).
- [ ] Repo privado o link con clave decidido (4.2).
- [ ] `netlify.toml` con `[build]` si se usa Netlify.
- [ ] Videos sin uso fuera del `_site` (`ls _site/video` no incluye `hero.mp4` ni `salon-*`).
- [ ] Si la demo cae **lunes 12/10**: la ficha figura cerrada por feriado.
- [ ] Capturas con datos de terceros no están en el repo.
- [ ] Llevar impresas/anotadas las preguntas de la sección 8.

---

## 8. Preguntas para el dueño (lo único que bloquea salir a producción)

**Resueltas desde la v1 (ya no se preguntan):** teléfono 54-7671 = Gestoría · WhatsApp 3442-647442 (confirmado en Facebook) · valoración de Google (verificada).

1. **Horario** (de confirmación, no de carga): ¿es correcto martes a viernes 9–17, sábado 8:30–12, domingo cerrado? ¿Cuál es el horario del **lunes**? ¿Cómo avisan los feriados?
2. ¿Autoriza el uso de las fotos y videos que salen de su Instagram/Facebook?
3. ¿Qué marcas 0 km vende hoy? ¿Siguen siendo "todas las marcas"?
4. Financiación: Instagram dice "Cuotas fijas". ¿Cuotas, entidad, anticipo, requisitos? ¿Quiere mostrar algo?
5. "Recibimos tu usado": ¿compra, parte de pago o consignación?
6. Km real del Palio 2017 (128.000 o 120.000). ¿El Tracker 1.8N 2018 y el Palio 1.4N figuran dos veces en su stock?
7. ¿Quiere mostrar la **Gestoría** (3442 54-7671) en el sitio?
8. ¿`chitaautomotores@gmail.com` es el email oficial y se publica?
9. ¿Quiere precios en las fichas o "Consultar"?
10. Dominio propio y quién lo administra.
