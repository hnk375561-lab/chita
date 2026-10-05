# CHITA / DOCUMENTO MADRE DE IDENTIDAD — v2.3 aplicable

> **CHITA no debe parecer una concesionaria que aprendió a decorar una web.**
> Debe sentirse como el lugar donde un auto pasa de estar publicado a irse con su dueño.

**Ubicación sugerida en el repo:** `docs/IDENTIDAD-MADRE.md`. Complementa a `docs/IDENTIDAD.md` (que es el registro técnico de lo implementado, v7–v38) y no lo reemplaza.
**Base de esta versión:** lectura del código de `chita-main (38)` más los cambios v38 (Visita, Reseñas, Viaje), el 05/10/2026 (`index.html`, `css/identidad.css`, `js/app.js`, `js/identidad.js`, `docs/IDENTIDAD.md`, `CLAUDE.md`, `AUDITORIA-IMPLEMENTACION.md`, `golive/AFIRMACIONES-A-CONFIRMAR.md`).
**Qué se verificó y qué no:** los cambios v38 se probaron con `npm test` y Chromium (1440 y 390 px). El resto de lo marcado «verificado» sale de leer el código; lo marcado «verificar» hay que comprobarlo en pantalla antes de tocar nada. Sin probar: Safari/Firefox, dispositivos reales, Lighthouse.

---

## 0. Cómo usar este documento

1. Es un **criterio de decisión**, no una lista de tareas. Las tareas están en la sección 7, ordenadas y con criterio de aceptación.
2. Cada sección del sitio tiene: estado verificado, brecha, acción aplicable, criterio de aceptación y qué no tocar.
3. Si este documento contradice a `CLAUDE.md`, gana `CLAUDE.md`. En particular: **cero datos inventados** y **cambio mínimo, sin reescribir secciones enteras**.
4. El sitio sigue siendo **demo no oficial** (`noindex`, aviso de demo, `robots.txt` con `Disallow: /`). Nada de acá autoriza salir a producción; eso lo gobierna `golive/PRODUCCION.md`.

### Qué cambió respecto de la versión anterior de este documento

| Corrección | Motivo |
|---|---|
| Se eliminaron propuestas que **ya están implementadas** (hero «Escuchá el salón», E·00, despacho del auto, «Índice de unidades publicadas», «se destaca en», columnas como pestañas, regla de llegada, talón de operación, «No es una reserva automática»). | La versión anterior auditaba un estado más viejo del sitio. |
| La tipografía se fija como **Bricolage Grotesque (cargada como «Chita Display») + Instrument Sans**. | Es lo que aplica `css/identidad.css`. `AUDITORIA-IMPLEMENTACION.md` todavía menciona DM Serif Display: está desactualizado. |
| El movimiento se reduce a los **tres verbos que ya existen: CORTE, SELLO, RIEL**. Los siete verbos narrativos anteriores pasan a ser descripciones, no animaciones nuevas. | Evita contradecir `docs/IDENTIDAD.md` (v10: «un solo verbo de revelado»). |
| Se resolvió el verbo repetido: Unidades = **Registrar**, Reseñas = **Citar**. | Antes ambas decían «Registrar». |
| Se agregó una **regla de máximo de interacciones nuevas** (sección 6). | La versión anterior pedía «no sumar recursos» y a la vez proponía más de diez. |
| Se agregaron los bloqueos por datos pendientes del dueño (fotos de clientes, reseñas, Tracker/Palio «Serie 2», km, horarios). | Hay propuestas que no se pueden aplicar hasta que el dueño confirme. |
| Se agregaron `F·NN`, `G·NN`, `N°` y `N°·B` a la tabla de códigos. | Existen en el código y faltaban. |
| Se quitaron las puntuaciones /10. | Eran opinión sin criterio medible. Se reemplazan por estado y brecha. |
| **v2.3:** se actualizó el estado de Unidades, Hero, Reseñas, Guía y Visita al código v32–v38 y se cerró la tabla de aplicación. | El documento describía el zip 37 y quedó atrasado. |
| ~~Se agregó la deuda de `viaje.html` y `reserva.html` (otra paleta, tipografías sueltas).~~ **Retirado en v2.2.** | Se comprobó en navegador: ambas páginas ya se ven con la paleta y las dos tipografías de Chita (`viaje.css` las redefine más abajo en el mismo archivo). Queda solo código viejo sin efecto al inicio de `viaje.css`. |

---

## 1. Idea rectora: LA ENTREGA

### 1.1 La marca no es «venta de autos»
«Venta de autos» es la categoría. Lo propio de Chita es el recorrido:

> **Un auto publicado encuentra a una persona, se revisa, se coordina y se va con su dueño.**

### 1.2 El sitio es un talonario
La página es un **talonario de remitos de entrega**: cada sección es un documento distinto de la misma operación (publicar → registrar → consultar → comparar → coordinar → entregar → sumar al archivo).

### 1.3 Frase de marca
«Autos que se van con sus dueños» se conserva. Aparece solo en: hero (instala el destino), Entregas (prueba que ocurrió) y E·13 (proyecta el próximo caso). No se repite en otras pantallas.

### 1.4 Promesa permitida
> **Te mostramos lo que está publicado, te ayudamos a leerlo y te conectamos con la agencia para confirmar lo que importa.**

Chita **no promete**: disponibilidad, precio, cuota, tasa, aprobación, tasación instantánea, garantía, horarios ni antigüedad. Todo eso es «la agencia confirma».

### 1.5 Regla madre de evidencia
No inventar profundidad de marca donde solo hay decoración. Si falta un dato, el diseño muestra **que falta confirmarlo** (`a confirmar`, `Consultar`, `Km: consultar`), nunca un relleno.

### 1.6 Tres estados de cualquier dato (política visual única)
| Estado | Significa | Cómo se ve |
|---|---|---|
| **Publicado** | Está en `data/*.json` y el dueño o una fuente citada lo respalda | Tinta, normal |
| **A confirmar** | Existe pero lo informa la agencia (disponibilidad, precio, cuota, horario) | Plata + etiqueta «a confirmar con la agencia» |
| **No informado** | No hay dato | Plata + «sin informar» (nunca «no tiene») |

Este sistema debe ser **idéntico** en Unidades, Comparador, Financiación y Visita. Hoy existe en el Comparador («Sin informar» + aclaración) y en los textos «consultar»; falta unificarlo (tarea T3).

---

## 2. Personalidad y voz

**Debe sentirse:** local (Gral. Galarza 1712, Concepción del Uruguay), directo, humano, documental, honesto, activo, con carácter derivado del local y del papeleo.

**No debe sentirse:** plantilla de concesionaria premium, fintech, marketplace anónimo, startup de movilidad, lujo artificial, sitio de efectos sin argumento, fotos de stock o generadas.

**Enemigo de la identidad:** la intercambiabilidad. Entrar, ver una grilla, leer «consultá», abrir WhatsApp y no recordar de quién era.

### Voz (rioplatense, clara, sobria)
| Preferir | Evitar |
|---|---|
| «Mirá» | «Descubrí» |
| «Escribinos» | «Contactanos ahora» |
| «La agencia confirma» | «Te garantizamos» |
| «A consultar» / «a confirmar» | Inventar una condición |
| «Tu usado» | «Tu vehículo usado» |
| «En persona» | «Experiencia premium», «soluciones integrales», «movilidad inteligente», «oportunidades imperdibles», «el auto de tus sueños», «calidad garantizada», superlativos no comprobados |

**Control automático:** correr `npm run audit` (`scripts/audit-copy.mjs`) y revisar que no aparezcan las frases evitadas. *Verificar* qué lista de frases cubre hoy ese script y agregar las de esta tabla si faltan.

---

## 3. Sistema visual (los tokens son los del código)

### 3.1 Color (de `docs/IDENTIDAD.md` y `css/identidad.css`)
| Token | Valor | Función |
|---|---|---|
| Papel | `#ECEDEA` | Superficie de lectura y documentos |
| Tinta | `#0A1020` | Datos, contraste, decisión |
| Rojo | `#C1121F` | Acción, columna del local, señal de atención |
| Azul chapa | `#0A2C8C` | Archivo, señalización, ubicación |
| Plata | `#B9BEC4` | Metadatos, medidas, datos secundarios |

Sin cian, sin dorado, sin vidrio. El rojo **no** es fondo de todo lo importante: pierde su condición de señal.

### 3.2 Tipografía
- **Display:** Bricolage Grotesque 800, versalitas (se carga como `"Chita Display"` en `css/identidad.css`; variable `--font-display` / `--h`). Títulos, números, etiquetas, códigos, estados, navegación.
- **Texto:** Instrument Sans (`--b`). Cuerpo, explicación, metadatos, advertencias, formularios.
- Mayúsculas para archivo y señalización; minúsculas para explicar. Si todo está en mayúsculas, nada destaca.
- `fonts/dm-serif-display-latin.woff2` no se usa en el sitio vivo: borrarlo o dejarlo documentado como en desuso (T9).

### 3.3 Tabla «un recurso, una función»
| Recurso | Significa | Dónde vive |
|---|---|---|
| Corte diagonal (`--cut`) | Una hoja, estado o escena se desprende o cambia | Fotos, botones, tarjetas, E·13, transiciones |
| Columna roja | Origen, avance, relación con el local | Barra de avance, Quiénes somos, Local |
| `E·NN` | Entrega real (E·01–E·12) o futura (E·13) | Entregas, hero (E·00), cierre |
| `U·NN` | Unidad publicada (orden de la lista) | Unidades, Índice, Comparador |
| `O·NN` | Operación iniciada | Comprá, vendé o permutá |
| `F·NN` / `G·NN` | Renglón de financiación / de guía | Financiación, Guía |
| `P·NN` | Pregunta (FAQ) o paso de proceso (vender/permutar) | Preguntas, Operaciones |
| `N°` / `N°·B` | Número de sección / segundo bloque de sección | Navegación, columna |
| Sello (ENTREGADO) | Confirmación de algo real | Solo entregas publicadas |
| Perforación | Límite entre etapas | Entre secciones y talones |
| Azul chapa | Archivo, ubicación, plano social | Dónde estamos, archivo |
| Patente | Presencia física / visita | Rótulos, «en persona» |
| Regla | Medición, distancia, comparación | Comparador, regla de llegada |

### 3.4 Reglas de composición
1. Cada sección tiene **un material dominante** y **un verbo de interacción**.
2. Cada sección tiene **una firma propia** y como máximo **dos compartidas**.
3. El corte no va en todos los elementos: indica paso o cambio.
4. Los números informan una relación real; no llenan espacio.
5. El sello confirma algo; si no confirma nada, es un sticker.
6. Si la foto ya trae rótulos propios (año, km, marca), el contenedor baja el volumen.
7. Toda foto es real. Sin stock, renders ni escenas generadas.

---

## 4. Movimiento: tres verbos, un easing

Es el lenguaje ya implementado en `js/motion.js` y `css/identidad.css`. **No se agregan verbos.**

| Verbo | Qué comunica | Curva |
|---|---|---|
| **CORTE** | Revelar, cambiar de hoja o unidad (barrido diagonal `clip-path`) | `--ease` cubic-bezier(.7,0,.2,1) · .7 s |
| **SELLO** | Confirmar (entra grande, se asienta, escalonado 85 ms) | `--ease-i` cubic-bezier(.2,.9,.1,1) · .42 s |
| **RIEL** | Scroll (deriva lineal ligada al scroll) | linear |

Reglas:
- Solo `transform`, `scale`, `rotate`, `opacity`, `clip-path`. Sin fade-up.
- Toda animación nueva debe poder describirse en una frase: «esto *corta/sella/se desliza* porque…». Si no, no entra.
- `prefers-reduced-motion`, sin JS y táctil siguen funcionando (el cursor-chapa es solo mouse; el despacho del hero es solo ≥900 px).
- Equivalencia con los verbos narrativos: *despachar* = RIEL + CORTE (hero → Entregas); *desprender* = CORTE; *sellar* = SELLO; *medir*, *llegar*, *abrir*, *marcar* = estados de interfaz, **no** animaciones nuevas.

---

## 5. Arquitectura narrativa (14 momentos)

El orden real del `index.html` es: header + hero, y las secciones `#entregas`, `#unidades`, `#catalogo-comparador` (contiene `#modelos` y el comparador), `#nosotros`, `#contacto`, `#local`, `#opiniones`, `#como-comprar`, `#financiacion`, `#operaciones`, `#guia`, `#visita`, `#preguntas`.

| N.º | Sección (id) | Verbo | Objeto | Responde |
|---|---|---|---|---|
| 00 | Hero (`#hero`) | **Despachar** | Parte de salida | ¿Qué significa Chita? |
| 01 | Entregas (`#entregas`) | **Probar** | Archivo de entregas | ¿Esto ocurre de verdad? |
| 02 | Unidades (`#unidades`) | **Registrar** | Remito de unidad | ¿Qué hay publicado? |
| 03 | Índice (`#modelos`) | **Indexar** | Índice de hojas | ¿Cómo lo recorro rápido? |
| 04 | Comparador (dentro de `#catalogo-comparador`) | **Medir** | La regla | ¿Cómo comparo sin que decidan por mí? |
| 05 | Quiénes somos (`#nosotros`) | **Ubicar** | Columnas del local | ¿Qué servicios hay y dónde? |
| 06 | Dónde estamos (`#contacto`) | **Orientar** | Regla de llegada | ¿Desde dónde empiezo? |
| 07 | El local (`#local`) | **Reconocer** | Protocolo de fachada | ¿Cómo sé que llegué? |
| 08 | Reseñas (`#opiniones`) | **Citar** | Fuente externa | ¿Qué evidencia pública hay? |
| 09 | Cómo comprar (`#como-comprar`) | **Ordenar** | Talón de compra | ¿Qué hago después? |
| 10 | Financiación (`#financiacion`) | **Desglosar** | Talón de condiciones | ¿Qué debo confirmar? |
| 11 | Operaciones (`#operaciones`) | **Preparar** | Talón de operación | ¿Cómo compro, vendo, permuto o consigno? |
| 12 | Guía (`#guia`) | **Revisar** | Planilla de visita | ¿Qué miro y qué pregunto? |
| 13 | Visita (`#visita`) | **Coordinar** | Talón de visita | ¿Cómo paso de mirar a ir? |
| 14 | Preguntas (`#preguntas`) | **Abrir** | E·13 + FAQ | ¿Cómo entra mi pedido al archivo? |

Cada verbo es único. Si dos secciones comparten verbo, una está duplicando función.

---

## 6. Regla de contención (anti-sobrediseño)

- **Máximo 3 interacciones nuevas en total** por ciclo de trabajo, elegidas entre las marcadas P2 de la sección 7. Las demás quedan como horizonte.
- No agregar por defecto: más animación, números, rojo, cortes, badges, videos, tarjetas ni fondos oscuros.
- Una idea nueva entra solo si responde **al menos 4** de estas 8 preguntas:
  1. ¿Qué hecho real de Chita expresa?
  2. ¿Qué parte del proceso de entrega vuelve visible?
  3. ¿Qué verbo propio tiene?
  4. ¿Qué confirma y qué deja pendiente?
  5. ¿Qué sección anterior prepara?
  6. ¿Qué sección posterior habilita?
  7. ¿Qué recurso no repite porque ya vive en otra sección?
  8. ¿Se recordaría Chita o solo un efecto?

---

## 7. Auditoría y acciones por sección

Formato: **Estado** (lo que existe hoy, verificado en código) · **Brecha** · **Acción** (con archivo) · **Aceptación** · **No tocar**.

### 00 · Hero — Despachar
- **Estado:** titular «Autos que se van con sus dueños»; bloque rojo en «sus dueños»; video del salón; control «Escuchá el salón»; rótulo `E·00 · Parte de salida · Recorrido por el salón`; 4,7 · 45 reseñas en Google; dos CTA («Ver unidades», «Vender o permutar mi auto»). Despacho implementado (v10): el hero queda fijo, el auto se va a la derecha y Entregas lo cubre con su borde perforado (solo ≥900 px, sin reduced-motion). La pasada de portadas usa `STOCK` + `HCOVER` y desde v33 alterna con fotos de entregas ya publicadas (decorativas; falta la autorización final de uso en el hero).
- **Brecha:** muchas señales simultáneas (pasada, titular, video, dirección, score, CTA, columna). Riesgo de recordarse como «apertura intensa de autos».
- **Acción (T10, P2):** bajar el contraste/velocidad de la pasada de portadas para que el protagonista sea un solo recorrido; no agregar elementos.
- **Aceptación:** en 390 px y 1440 px hay una sola jerarquía clara (titular → CTA primario); el video sigue pausándose al salir.
- **No tocar:** frase de marca, video real, controles de sonido/pausa accesibles, despacho v10, ausencia de precios o promociones.
- **No hacer:** una escena de «auto retenido y liberado» con material que no exista; el video real es del salón, no de una entrega.

### 01 · Entregas — Probar
- **Estado:** «Archivo de entregas», «Gente real, autos reales», «Fotos publicadas por Chita Automotores en sus redes», casilla `E·13 · El próximo es el tuyo`, 4,7/45 reseñas en Google, «Recomendado por el 100% en Facebook (22 opiniones) · octubre de 2026», y la aclaración «entregas visibles y reseñas externas son registros distintos» (ya separa evidencia). Sello ENTREGADO por foto (CSS/JS).
- **Bloqueo (dueño):** confirmar que los clientes aceptan aparecer en las fotos (`AUDITORIA-IMPLEMENTACION.md`). **No agregar fichas ni ampliaciones nuevas con esas fotos hasta tener esa confirmación.**
- **Brecha:** el sello repetido pasa a ser textura.
- **Acción (T11, P2):** sello grande solo en la primera entrega o en hover/focus de cada foto; el resto muestra el código `E·NN`. Estados permitidos únicamente si el dato lo respalda.
- **Aceptación:** no hay estado nuevo (`PUBLICADO`, `CON SU DUEÑO`) sin evidencia; el sello no aparece en más del 30 % de las fotos a la vez.
- **No tocar:** fotos reales, la aclaración de procedencia, la separación entregas/reseñas. Nada de carrusel de testimonios.
- **Verificar:** el dato de Facebook (100 % / 22 opiniones) debe estar en `data/sources.json` con fuente y fecha. Si no está, registrarlo en `golive/AFIRMACIONES-A-CONFIRMAR.md` o retirarlo.

### 02 · Unidades — Registrar
- **Estado:** búsqueda, chips de modelo (v32, generados desde `STOCK`), orden, galerías con teclado y arrastre, fichas con hash, `U·NN`, remito v13. Cada tarjeta muestra «Consultar disponibilidad», «Ver ficha completa ›» y «Consultar». Texto de apoyo: «La agencia te confirma si sigue disponible y qué falta conversar» (ya cumple la promesa de servicio).
- **Brechas:**
  1. ~~«Consultar disponibilidad» ×12 y doble CTA.~~ **Corregido en la v2.1:** era HTML estático desactualizado (el prerender no se había regenerado). `js/app.js` ya renderiza una sola CTA («Consultar») y el estado «La agencia confirma si sigue disponible». Se regeneró con `npm run prerender`.
  2. Las tres condiciones (publicado / a confirmar / no informado) no están diferenciadas visualmente.
  3. El mensaje de WhatsApp debería incluir unidad y pregunta concreta (verificar qué arma hoy `app.js`).
  4. **Datos en conflicto:** existen «Tracker Premier 1.8N» y «Tracker Premier 1.8N · Serie 2» con el mismo año (2018) y km (98.000), y «Palio Attractive 1.4N» y su «Serie 2» (2013, 128.000 km; el km del Palio 2017 está oculto por conflicto 128.000 vs 120.000).
- **Acciones:**
  - **T3 (P1) — parcial:** la CTA única ya existe y el prerender quedó al día. **Pendiente:** aplicar visualmente los tres estados (publicado / a confirmar / no informado) a los datos de tarjeta y ficha (`css/identidad.css` + `js/app.js`).
  - **T4 (P1) — hecho:** `ask()` ya incluía `U·NN`, modelo, año y pedido de disponibilidad, precio y condiciones. Se agregó «¿Y el kilometraje?» solo cuando la unidad no tiene km publicado.
  - **T1 (P0, dueño):** **no mostrar ni explicar la etiqueta «Serie 2» como diferencia** hasta que el dueño confirme si Tracker 1.8N y Palio 1.4N «Serie 2» son unidades distintas o la misma. Mientras tanto, si son iguales, no duplicar la tarjeta.
- **Aceptación:** una sola CTA por tarjeta; ninguna tarjeta muestra un dato conflictivo; `npm test` pasa; el hash de ficha sigue abriendo la ficha correcta.
- **No tocar:** galería, arrastre, teclado, lazy loading, `alt`, hash, ausencia de precios.

### 03 · Índice de unidades publicadas — Indexar
- **Estado:** título ya renombrado («Índice de unidades publicadas», «N.º · unidad · año · km · fotos. Abrí una fila para leer su hoja»); panel «vano» entre columnas rojas, foto con CORTE al cambiar (v29). *Nota:* el `aria-label` de la sección todavía dice «Nuestros modelos y comparador».
- **Brecha:** el `aria-label` y un texto en `css/site.css` conservan «Nuestros modelos».
- **Acción (T8, P1):** cambiar el `aria-label` a «Índice de unidades publicadas y comparador»; revisar el comentario/regla en `css/site.css`. Verificar que cada fila apunte al mismo `U·NN` que el catálogo.
- **Aceptación:** ningún texto visible ni accesible dice «Nuestros modelos».
- **No tocar:** generación desde `STOCK`, panel sticky desktop, miniaturas, enlaces directos.

### 04 · Comparador — Medir
- **Estado:** «La Regla · Comparador», «¿Estás entre varias opciones?», máximo tres unidades, «La regla señala diferencias; lo que falta, se pregunta», aclaración «“Sin informar” no quiere decir que la unidad no lo tenga». Ya usa «se destaca en» (no «ganadores»).
- **Brecha (verificar en pantalla):** si existe la línea «qué preguntar» por datos faltantes, si hay botón de consulta comparativa y qué pasa al elegir una cuarta unidad.
- **Acciones:**
  - **T5 (P1):** si no existe, generar «Qué preguntar» a partir de los campos sin informar y un botón «Consultar estas unidades» con las tres elegidas.
  - **T12 (P2):** al elegir una cuarta unidad, mostrar «Reemplaza a U·NN» en lugar de bloquear en silencio.
- **Aceptación:** nunca hay un «mejor» o «ganador»; ningún dato faltante se completa.
- **No tocar:** máximo de tres, barras relativas, honestidad de «sin informar».

### 05 · Quiénes somos — Ubicar
- **Estado:** «Un salón de columnas rojas»; tres rótulos-chapa (01 Usados, 02 Permutas, 03 Consignaciones) sobre columnas reales; acordeón de una abertura con `aria-expanded`; leyenda móvil; mejora progresiva (v28). Las medidas están en % sobre una foto 900×581 (`Z` en `js/identidad.js`).
- **Brecha:** las columnas abren texto pero no llevan a nada.
- **Acción (T13, P2):** que cada texto abierto termine con un enlace: Usados → `#unidades`, Permutas → `#operaciones`, Consignaciones → `#operaciones` con «Consignar» preseleccionado. Sin animación nueva.
- **Aceptación:** los tres enlaces funcionan con teclado y en móvil; si se cambia la foto se vuelven a medir las zonas `Z`.
- **No tocar:** foto real, acordeón accesible, ausencia de claims no confirmados (fundación, antigüedad, equipo).

### 06 · Dónde estamos — Orientar
- **Estado:** fondo azul chapa (v15); mapa tocable; «La Regla · origen y llegada · según Moovit» con distancias (0 m, ~110 m, ~370 m, ~510 m) y aviso «Distancias aproximadas»; «Horarios de atención: Confirmá antes de venir»; Cómo llegar, Llamar, Opiniones en Google, Instagram, Facebook.
- **Bloqueo (dueño):** horarios (hay tres versiones públicas en conflicto). No se publica ninguno.
- **Brecha:** la dirección se repite en otras secciones sin cambiar de función.
- **Acción (T14, P2):** en esta sección la dirección es la **coordenada de origen**; en `#local` pasa a ser el **reconocimiento visual**; en el footer, referencia. No repetir texto idéntico.
- **Aceptación:** una acción primaria por dispositivo (móvil: «Cómo llegar»; escritorio: mapa).
- **No tocar:** Maps, Waze, copiar dirección, WhatsApp, teléfono, la advertencia de distancias aproximadas, `confirmá antes de venir`.
- **Verificar:** coordenadas únicas (-32.486865, -58.250318) en mapa, Waze y compartir (ya corregido según `AFIRMACIONES`).

### 07 · El local — Reconocer
- **Estado:** «Cómo llegar y reconocernos»: columnas rojas, salón vidriado, cartel; recorrido de 4 pasos (Llegás / Desde la calle / Pasás / El cartel) con video «un recorrido por el salón»; regla de llegada con Maps/Waze.
- **Brecha:** buen material propio; falta que cada paso apunte a una foto o recorte concreto.
- **Acción (T15, P2):** asociar cada paso a su foto real existente. No filmar ni generar escenas nuevas.
- **Aceptación:** cada paso muestra la foto que lo ilustra; el texto no repite la dirección completa.
- **No tocar:** columnas, salón vidriado, cartel real, acciones de navegación.

### 08 · Reseñas — Citar
- **Estado:** «Reseñas en Google · Registro público de quienes pasaron»; «Chita no reescribe ni selecciona estas opiniones»; 4,7 de 5 · 45 reseñas «(puede variar)»; «Ver opiniones en Google» primero y «Cómo llegar» después; 45 casillas («Cada casilla es una de las 45 reseñas que Google muestra hoy»).
- **Bloqueo (dueño):** autorización para usar reseñas.
- **Aplicado (v38):** la línea de fuente y la de las 45 casillas pasan a tinta (contraste sobre papel). Sin textos ni datos nuevos.
- **Brecha:** las 45 casillas son recuento visual, no registros con fuente propia. Riesgo de leerse como relleno.
- **Acción (T16, P2, opcional):** mantener la cuadrícula pero que **no** parezca reseñas individuales; que el 4,7 sea el único numeral grande. No insertar texto de reseñas.
- **Aceptación:** fecha y atribución siempre visibles; ningún texto de usuario reproducido.
- **No tocar:** fuente, fecha, «puede variar», la decisión de no citar opiniones.

### 09 · Cómo comprar — Ordenar
- **Estado:** «El talón de compra»: ELEGIDO / CONSULTADO / COORDINADO / CONFIRMADO. Cierre prudente: «La entrega ocurre cuando precio, forma de pago y disponibilidad quedaron confirmados con la agencia».
- **Brechas:**
  1. El paso 2 dice «botón para consultar por teléfono», pero los CTA abren WhatsApp (con fallback a teléfono). Alinear el texto.
  2. ~~Los pasos no enlazan con las secciones reales.~~ **Corregido en la v2.1:** ya enlazan (rótulos «Abrir unidades ↗», «Preparar consulta ↗», «Coordinar visita ↗», «Ver entregas ↗», generados por `js/identidad.js`).
- **Acciones:**
  - **T6 (P1) — hecho:** copy del paso 2 → «consultar por WhatsApp o por teléfono».
- **Aceptación:** cada paso tiene un enlace funcional; el copy coincide con el comportamiento real de los CTA; no hay promesa de entrega garantizada.
- **No tocar:** tono prudente, confirmación de precio y condiciones por la agencia.

### 10 · Financiación — Desglosar
- **Estado:** «Financiación en cuotas fijas y tu usado, directo con la agencia»; tarjetas F·01 (con libreta de cinco cupones decorativos «Cuota fija · a consultar» + «Desprendé y consultá →», `aria-hidden`) y F·02 «Tu usado»; fuente «Según el Instagram de Chita». **El talón de condiciones ya existe** (`js/identidad.js`, clase `.fin-ticket`): elegís unidad (opcional), marcás «Tengo un usado para evaluar» y «Abrir consulta de condiciones ↗» arma el mensaje de WhatsApp. Cero cifras.
- **Bloqueo (dueño):** condiciones (cuotas, entidad, tasa, anticipo, requisitos) y qué significa «Recibimos tu usado» (compra, parte de pago, consignación).
- **Brechas halladas (v2.2):** (1) había **dos CTA** para lo mismo (el talón y el botón «Consultar financiación y tu usado»); (2) en móvil el talón **se salía de la pantalla** (borde derecho a 419 px en un viewport de 390); (3) en escritorio el selector quedaba **cortado** («Elegí una unid»).
- **T7 (P1) — hecho:** una sola acción primaria (el botón viejo queda oculto solo cuando existe el talón; sin JavaScript sigue siendo el respaldo); el talón ocupa su columna en móvil y el selector usa todo el ancho. Solo CSS (`css/identidad.css`, bloque «T7»).
- **Decisión:** los cinco cupones se **mantienen**. Son decorativos (`aria-hidden`), no muestran cifras y fueron una elección deliberada de la v30 («libreta de cupones»). Si el dueño prefiere menos repetición, se reducen a tres.
- **Aceptación (verificada en 390, 768 y 1440 px):** ninguna cuota, tasa, entidad, logo, calculadora ni «aprobación»; siempre figura «La agencia confirma precio, cuota y condiciones vigentes».
- **No tocar:** el talón y sus textos, `F·NN` como renglones (no importes).

---

### 11 · Compraventa — Preparar
- **Estado:** «Comprá, vendé o permutá»: cuatro opciones (Comprar, Vender, Permutar, Consignar), talón de operación en 3 pasos («Completá los datos / Se prepara una consulta / La enviás vos»), formulario «Contanos tu auto». «El sitio no guarda tus datos». Verificado: arma «Hola! Quiero vender mi auto: …».
- **Brecha:** las cuatro tarjetas son casi iguales.
- **Acción (T17, P2):** que el rótulo y la vista previa del mensaje cambien según la operación elegida (comprar = unidad; vender = evaluación; permutar = auto A por auto B; consignar = publicación).
- **Aceptación:** cambia solo texto/rótulo, sin nueva animación; el mensaje final coincide con la vista previa.
- **No tocar:** WhatsApp, fallback de copiar/llamar, privacidad, ausencia de tasación automática.

### 12 · Guía — Revisar
- **Estado:** «Antes de comprar o permutar un usado»; ya agrupa «Mirar» (qué revisar) y «Preguntar» (documentación); contador «0 de N revisados» (v32: planilla tildable y «hoja para llevar» con impresión); aclaración «Los requisitos los define el Registro Seccional».
- **Brecha:** «0 de N revisados» se lee como estado de componente.
- **Acción (T18, P2):** cambiar el contador a lenguaje de visita: «Marcaste N · llevalos anotados» y que lo marcado alimente el mensaje de Visita como «Para preguntar». Sin guardar datos.
- **Aceptación:** nada se persiste; si no hay marcas, el mensaje de Visita no cambia.
- **No tocar:** advertencia de información general, aclaración sobre normas/costos (agregar fecha de revisión si el dueño la define; **verificar** si hoy existe).

### 13 · Visita — Coordinar
- **Estado:** «Coordiná tu visita»; «Talón de visita»; unidades y día/horario opcionales; «Preparar consulta»; cartel **«No es una reserva automática. El sitio no guarda estos datos»**; calendario multistep (`reserva.html`, constante `CONFIG.whatsapp` en `js/reserva.js`). Desde v38 el talón incluye un almanaque de taco (día y franja Mañana/Tarde opcionales) que escribe en «Día y horario»; el pase y el mensaje de WhatsApp lo leen de ahí. `reserva.html` conserva el almanaque multistep (v32/v33).
- **Brecha (corregida en v2.2):** una lectura rápida de `css/viaje.css` sugería paleta y tipografías sueltas (`#101114`, `Archivo`, `Jet`, `monospace`). Es código viejo **sobrescrito** por reglas posteriores del mismo archivo. Medido en navegador (390 y 1440 px): `viaje.html` y `reserva.html` usan `--ink #0A1020`, `--bone #ECEDEA`, `--red #C1121F`, `--blue #0A2C8C` y solo Bricolage Grotesque + Instrument Sans; sin errores de JS ni desborde horizontal.
- **Acciones:**
  - **T2 — no aplicable.** Ya está unificado. Opcional (P3, sin efecto visual): borrar la primera línea de `css/viaje.css` y las referencias muertas a `Archivo`/`Jet`/`monospace`, solo con prueba visual.
  - **T19 (P2):** estado visual «listo para enviar» vs «pendiente de confirmación» en el último paso.
- **Aceptación:** el cartel «No es una reserva automática» permanece; no aparece ninguna confirmación de turno.
- **No tocar:** calendario accesible, navegación por teclado, vuelta de pasos, WhatsApp.

### 14 · E·13 / Preguntas — Abrir
- **Estado:** `E·13 · El próximo es el tuyo`, «Contanos qué auto buscás», «Nuevo pedido · E·13» (marca/modelo, año desde, combustible, presupuesto aproximado), «Abrir pedido E·13», aclaración «No asegura stock ni fija precio». FAQ en `P·NN`.
- **Brecha:** búsqueda y FAQ comparten bloque.
- **Acción (T20, P2):** separar visualmente los dos: E·13 con perforación y encabezado propio; FAQ debajo como bloque aparte, sin numeración ornamental.
- **Aceptación:** una sola acción primaria en el cierre («Abrir pedido E·13»).
- **No tocar:** la aclaración de stock y precio, el no guardado de datos, el envío a WhatsApp.

### Footer, 404, privacidad
- **Estado:** footer con «Sitio demo hecho como propuesta por Santiago Solis. No es el sitio oficial…», coordenadas aproximadas, enlaces a viaje y reserva.
- **Regla:** el aviso demo y el copyright **no se tocan** hasta cerrar `golive/PRODUCCION.md`. Teléfono y WhatsApp se repiten en `404.html`, `privacidad.html`, `reserva.html` y `js/reserva.js`: si cambian, actualizar los cuatro.

---

## 8. Bloqueos que dependen del dueño (no se resuelven por código)

| Dato | Estado | Efecto en el diseño |
|---|---|---|
| Fotos de entregas: consentimiento de clientes | Pendiente | No sumar fichas/ampliaciones nuevas sobre esas fotos |
| Reseñas: autorización de uso | Pendiente | Mantener solo cifra, fuente y fecha |
| Tracker 1.8N vs «Serie 2», Palio 1.4N vs «Serie 2» | Pendiente | No diferenciar editorialmente; evitar duplicados |
| km del Palio 2017 (128.000 vs 120.000) y repetición en Palio 2013 | Pendiente | Mostrar «Km: consultar» |
| Horarios (tres versiones) | Pendiente | «Confirmá antes de venir» |
| Teléfono 03442 54-7671 (¿gestoría o general?) | Pendiente | No publicar |
| Condiciones de financiación | Pendiente | Cero cifras |
| Significado de «Recibimos tu usado» | Pendiente | Texto neutro («lo evaluamos») |
| Estado fiscal, fecha de constitución, titular | No se publica | — |
| Razón social, CUIT, correo (privacidad) | Pendiente | `privacidad.html` incompleto |
| Placeholders «FOTO A CARGAR» (`images/`) | Pendiente | Borrar o regenerar |

Todo dato nuevo se registra en `golive/AFIRMACIONES-A-CONFIRMAR.md` y en `data/dealership.json`; deben coincidir con el bloque `NEGOCIO` de `index.html` (`npm test`).

---

## 9. Plan de trabajo ordenado

| ID | Pri | Tarea | Archivos | Depende de |
|---|---|---|---|---|
| T1 | P0 | Resolver «Serie 2» duplicadas / km en conflicto | `data/vehicles.json`, `js/app.js` (`STOCK`) | Dueño |
| T2 | — | ~~Unificar paleta y tipografía de `viaje` y `reserva`~~ (ya unificado; ver sección 13) | — | — |
| T3 | P1 | Un solo CTA por tarjeta + tres estados de dato | `js/app.js`, `css/identidad.css` | — |
| T4 | P1 | Mensaje WhatsApp con unidad y pregunta | `js/app.js` | — |
| T5 | P1 | «Qué preguntar» y consulta comparativa | `js/app.js` | — |
| T6 | P1 | Copy y enlaces de Cómo comprar | `index.html` | — |
| T7 | P1 | Un solo talón de Financiación, sin cifras | `index.html`, `css/identidad.css` | — |
| T8 | P1 | Quitar «Nuestros modelos» residual | `index.html`, `css/site.css` | — |
| T9 | P1 | Corregir `AUDITORIA-IMPLEMENTACION.md`; `dm-serif-display-latin.woff2` sin uso (solo lo cita `chita-cambios/index.html`) | docs, `fonts/` | — |
| T21 | P1 | Eliminar los 4 avisos GSAP «target not found» (hecho) | `js/motion.js` | — |
| T10–T20 | P2 | Refinamientos por sección (máx. 3 por ciclo, sección 6) | según sección | — |

### Estado de aplicación (05/10/2026)

| ID | Estado | Detalle |
|---|---|---|
| T3 | Parcial | Prerender regenerado (11 tarjetas estáticas ya sin «Consultar disponibilidad»); falta el sistema visual de los tres estados |
| T4 | Hecho | «¿Y el kilometraje?» si no hay km |
| T6 | Hecho | Copy WhatsApp/teléfono; los enlaces por paso ya existían |
| T8 | Hecho | `aria-label` y comentario de CSS |
| T9 | Hecho (docs) | `AUDITORIA-IMPLEMENTACION.md` corregida; el `.woff2` no se borró |
| T7 | Hecho | CTA única, talón dentro de pantalla, selector completo |
| T21 | Hecho | 0 avisos GSAP en 1440 y 390 px |
| T2 | No aplicable | Ya estaba unificado |
| Unidades (filtros) | Hecho | v32: chips de modelo, búsqueda y orden |
| Hero / Entregas | Hecho | v33: la pasada alterna autos y entregas (autorización de fotos pendiente) |
| Reserva (almanaque) | Hecho | `reserva.html` v32/v33; en Visita v38 |
| Visita | Hecho | v38: almanaque dentro del talón |
| Viaje | Hecho | fotos reales, km publicados, cierre circular (v38) |
| Reseñas (T16) | Hecho | v38: contraste. v41: las 45 casillas pasan a regla de recuento (contorno de tinta, numeral mínimo); el 4,7 queda como único numeral grande |
| Guía (T18) | Hecho | tildable e imprimible (v32); lo marcado se suma al mensaje de Visita como «Quiero revisar: …» (v39) |
| T5 | Hecho | «Qué preguntar» ya estaba por tarjeta; v40 suma la consulta comparativa: con 2 o 3 unidades, un talón abre WhatsApp con todas juntas y pregunta el km de las que no lo publican |
| T10 | Hecho | v42: velo de la pasada .66 → .8 (entregas .18 → .34) y vuelta de 130 s → 190 s |
| T11 | Hecho | v43: sello solo en la primera entrega (1 de 12 en reposo); en las demás al hover/foco. El rótulo `E·NN` queda en todas |
| T20 | Hecho | v44: E·13 con perforación arriba y abajo; Preguntas como bloque aparte, sin numeración `P·NN` |
| T12 | Hecho | v45: al sumar una cuarta unidad el aviso dice cuál reemplaza («Sumaste X. Reemplaza a Y, la más antigua de las tres.»); se usa el nombre porque `U·NN` ya no existe |
| T1, T13–T15, T17, T19 | Pendiente | T1 depende del dueño |

**Alerta T1:** `js/app.js` imprime en las tarjetas «Serie 2 · diferencia editorial; confirmar detalles con la agencia». Eso afirma una diferencia que el dueño todavía no confirmó (Tracker 1.8N y su «Serie 2» comparten año y km). No se tocó para no cambiar datos sin confirmación.

---

## 10. Verificación antes de dar algo por hecho

1. `npm test` (valida `data/dealership.json` contra `NEGOCIO`) y `npm run audit` (copy).
2. `npm run dev` y revisar a **390, 768, 1024 y 1440 px**.
3. Con `prefers-reduced-motion` activado: nada se anima y todo es legible.
4. Sin JavaScript: `tel:` como respaldo, lista de Quiénes somos visible, contenido accesible.
5. Teclado: foco visible, fichas, calendario y acordeón operables.
6. Consola: **0 avisos** (T21). Estaban 4 «GSAP target not found» desde el zip original: `initHero()` animaba `.hx-veil`, `.hx-logo` y `.hx-info`, que ya no existen en el HTML.
7. Ningún texto nuevo contiene cifras, tasas, horarios, garantías ni afirmaciones sin respaldo en `data/`.

---

## 11. Qué hace difícil confundir a CHITA

Cuando ocurren las cinco a la vez:

1. Se reconoce el sitio por el **archivo de entregas**, no por un color de moda.
2. El **local real** (columnas, cartel, salón) organiza la interfaz.
3. Cada unidad es un **expediente honesto**, no una tarjeta de e-commerce.
4. Se distingue al instante qué está **publicado**, qué hay que **confirmar** y qué **no se informa**.
5. La consulta abre un **registro nuevo** (E·13, talón de visita, talón de operación) y no un formulario genérico.

> La versión más fuerte de Chita no es una web que parece premium. Es una web que parece imposible de separar de Chita.
