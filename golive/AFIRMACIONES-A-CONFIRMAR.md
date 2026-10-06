## Dossier 3 · 2026-10-02
**Agregado:** sección «Trayectoria verificable» (1991 solo como año; misma dirección en diez fuentes; archivo de fachada descrito en texto como material histórico; Instagram 2025–26), dos preguntas frecuentes (marca oficial, desde cuándo) y la descripción prudente «nuevos y usados» según fuentes públicas.
**Corregido:** el número de contacto directo se mostraba como «+54 9 03442 44-2782» (formato de WhatsApp sin confirmar); ahora «03442 44-2782».
**No usado a propósito:** las 4 fotos históricas de Cylex (sin autorización), el email protegido de Cylex, el horario de Cylex (cuarta versión en conflicto), el nombre «Elvio Orcellet».

| Pendiente con Chita | Detalle |
|---|---|
| Fotos históricas propias | Para reemplazar los placeholders «FOTO A CARGAR» y ilustrar la sección Trayectoria, con autorización |
| Gestoría actual | Aparece en la fachada histórica y en la bio de Instagram; condiciones sin confirmar |
| Marcas hoy | «Multimarca» solo como historia hasta confirmar |
| Email oficial | No se reconstruye el de Cylex |

## Dossiers 1 y 2 · 2026-10-02 (implementados en el sitio)
Detalle por dato en `data/sources.json` y `data/vehicles.json`.

**Ahora en el sitio (con respaldo en Instagram de Chita):** «Recibimos tu usado», «Financiación en cuotas fijas» (sin cuotas, tasa, entidad ni simulador), «0 km y usados», Tracker Premier 1.2T 2021 · 100.000 km, valoración de Google 4,7/5 · 45 reseñas con fecha, paradas de colectivo (Moovit, con fecha).

**Retirado por no tener respaldo:** «39 años de confianza» (fila 11), «Dueño» con iniciales en el equipo, «como parte de pago» (mecánica sin confirmar).

**Corregido:** coordenadas del mapa, Waze y compartir (había tres puntos distintos; ahora -32.486865, -58.250318) y paréntesis vacíos en el texto de dirección.

| Pendiente con Chita | Detalle |
|---|---|
| Km del Palio 2017 | 128.000 (demo) vs 120.000 (Instagram). Oculto hasta conciliar. Revisar también el Palio 2013, que repite 128.000 |
| Horarios | Tres versiones (Google, GTM, ZonaAuto) |
| Teléfono 03442 54-7671 | ¿Gestoría o general? |
| Estado fiscal y fecha de constitución | Indicadores AR «activa», 31/03/1991 vs Datok «inactivo», 01/04/1991. No se publica |
| Condiciones de financiación | Cuotas, entidad, tasa, anticipo, requisitos |
| Qué significa «Recibimos tu usado» | Compra, parte de pago o consignación |
| Versión Premier 1.2T | Confirmar que las fotos corresponden a esa unidad |
| «Casi Bv. Montoneras» y número 1337 del pilar | Sin fuente en los dossiers |
| Disponibilidad y precio de cada unidad | Sin dato actual |

## Actualización pública · 2026-10-02

- Instagram público: [@chita.automotores](https://www.instagram.com/chita.automotores/?hl=en) muestra “Usados y 0km | Cuotas fijas” y “Gestoría: 3442-547671”; sus destacados incluyen Consignación, Financiación y 0km y usados.
- GTM publica horarios L-V 08:30–12:00 y 16:00–20:00, sábado 08:30–12:00 y domingo cerrado. Como las fichas públicas discrepan, no se cargan como horario oficial: se mantiene “consultar antes de venir”.
- WhatsApp Ventas 3442-647442 (`5493442647442`): confirmado en la bio de Facebook y en el perfil de WhatsApp del negocio (capturas del 3/10/2026, ver `data/dealership.json`). Los CTA usan `wa.me`; sin JS o sin número válido hacen fallback al teléfono fijo 03442 44-2782. Pendiente: confirmación escrita del dueño antes de salir a producción.

## Decisiones de la demo · 2026-10-06
- **T4:** se mantiene GitHub Pages como demo temporal para presentar al dueño; no se cambia dominio en esta sesión.
- **T5:** las fotos y el video se mantienen condicionados a la autorización del dueño; la explicación de uso se dará al presentar la demo. Esto no constituye autorización todavía.
- **T9:** el email `chitaautomotores@gmail.com` aparece en La Guía Local, pero queda como candidato no confirmado; los horarios públicos siguen en conflicto y no se publican; no se encontraron precios actuales confiables para el stock de la demo.
- **T10:** se retiró del sitio el bloque de paradas y distancias; la fuente histórica queda solo en los datos internos.

# Afirmaciones a confirmar (Chita Automotores)

Revisión del 2026-09-28. Ninguna de estas afirmaciones pudo verificarse en fuentes públicas: ni Instagram, Facebook, Google Maps, Mercado Libre, Autocosmos ni directorios locales devolvieron datos de Chita. La única mención es una entrada "Chita Automotores – Compraventa de automóviles" en gtm.com.ar, sin dirección ni teléfono (identidad no confirmada).

| # | Afirmación en el sitio | Ubicación | Estado | Acción antes de publicar |
|--:|---|---|---|---|
| 1 | Gral. Galarza 1712 (y "casi Bv. Montoneras") | NEGOCIO, mapa | Ficha de Maps "Chita Automotores" cargada (enlace del solicitante, 2026-09-28); no pude abrirla, así que la dirección escrita no está verificada contra ella | Comparar la dirección que muestra Maps con Gral. Galarza 1712 |
| 2 | Tel. 03442 44-2782 / WhatsApp | NEGOCIO, botones | Captura de WhatsApp (2026-09-28): ese número muestra foto con logo "Chita Automotores". Confirma que el WhatsApp existe y usa la marca; no prueba que sea el número oficial de atención | Confirmar con el dueño |
| 3 | Horarios | NEGOCIO.horarios | No encontrado; queda vacío | Pedir al dueño |
| 4 | 0 km "de todas las marcas" | Hero, servicios, FAQ | Sin fuente | Confirmar marcas concretas |
| 5 | Gestoría propia / trámites y transferencias | Hero, servicios, pasos | Sin fuente | Confirmar |
| 6 | Consignación: precio acordado sin comisión, pago inmediato, transferencia antes de retirar, local bajo techo | Sección consignación, FAQ | Sin fuente | Confirmar por escrito |
| 7 | Permutas / recibimos usados | Servicios, formulario | Sin fuente | Confirmar |
| 8 | Las 6 unidades (año, km, equipamiento, "única mano", "en garantía de fábrica", "permuta menor valor") | STOCK | El sitio dice que salen de Instagram/Facebook; no pude abrirlos | Verificar cada unidad; retirar las vendidas |
| 9 | Fotos de las unidades | images/ | Origen: publicaciones de la agencia | Pedir autorización o reemplazar |
| 10 | Facebook (profile.php?id=…) | NEGOCIO.facebook | No verificado; puede ser un perfil personal | Confirmar que sea la página del negocio |
| 11 | "39 años de confianza" (título y sello del inicio) | Hero | Estaba en el sitio desde el inicio. Los flyers del propio negocio (Clio Mio y Ka S) llevan el mismo lema en su logo, sin fecha ni año de fundación | Confirmar con el dueño; no agregar un año de fundación |
| 12 | Notas en medios | — | No encontrado | No publicar |

Precios: todos "Consultar". El validador falla si aparece otro valor sin confirmación.

## Novedades del 2026-09-28
- **Dirección:** la ficha de Maps muestra "Gral. Galarza 1712, Concepción del Uruguay" (captura). Confirmada en Maps; la ficha figura sin reclamar y sin horarios, teléfono ni web.
- **Teléfono y permuta:** una publicación de Facebook del 30 de julio dice "VENDO-PERMUTO, TEL: 3442-453550, Gral. Galarza 1712". Respalda las filas 2 y 7.
- **Unidades nuevas en STOCK:** VW Up 2018 (Facebook, 25 de agosto) y Renault Clio Mio 2014 (Facebook, 30 de julio). Sin precio. Verificar que sigan disponibles.
- **Reseñas de Google:** 3.7 con 3 opiniones, una de 1 estrella de hace más de 5 años. No se muestra la puntuación en el sitio; solo el enlace a las opiniones.
- **Facebook:** las publicaciones salen de un perfil llamado "Chita Automotores" (no una página comercial). Confirmar cuál es la cuenta oficial.

## Fiat Punto (2026-09-28)
- **Unidad:** Punto Attractive 2011, 1.4 Fire, 97.000 km, con el equipamiento del texto original. Reemplaza la ficha anterior (sin km). Sin precio.
- **Fotos:** 7 fotos enviadas por el solicitante, mejoradas solo con corrección leve de tono y nitidez (sin retoque del auto; los rayones del paragolpes se ven). Pedir autorización de uso al dueño. La patente (KIM 536) es visible: evaluar taparla.
- **Cartel del local:** una foto muestra "FERNANDO POERIO AUTOMOTORES / OKM - USADOS - CONSIGNACIONES". Es un indicio propio del negocio de que ofrece usados y consignaciones, pero dice "OKM" (probablemente 0 KM): no confirma marcas ni condiciones.
- **Sobre "Grupo Delta":** aparece un logo de otra agencia en el baúl del auto. No se usa en el sitio.

## Volkswagen Up (2026-09-28)
- **Unidad:** Up 2018, 5 puertas, 1.0 nafta, 44.000 km, con el equipamiento del texto original. Sin precio.
- **Fotos:** 5 fotos enviadas por el solicitante (1200 px, sin ampliar), con la misma corrección leve de tono y nitidez. Pedir autorización al dueño. La patente (AD 203 FX) es visible.
- **Cartel:** aparece otra vez el cartel "FERNANDO POERIO AUTOMOTORES / OKM - USADOS - CONSIGNACIONES", ahora sobre la calle. Mismo alcance que en el Punto.
- **Versión:** el auto muestra el logo "move" en la puerta, pero el texto no lo dice; no se agregó a la ficha.

## Renault Clio Mio (2026-09-28)
- **Unidad:** Clio Mio 2014, única mano, 5 puertas, 1.2 nafta, 96.600 km, con el equipamiento del texto original (coincide con lo visto en la publicación de Facebook del 30 de julio). Sin precio.
- **Fotos:** 6 fotos enviadas por el solicitante (1200 px, sin ampliar), con corrección leve de tono y nitidez. Pedir autorización al dueño. La patente (OBH 727) es visible.
- **Otros logos en las fotos:** un sticker "Polarizados Antonio" en la luneta y otro de "Chita Automotores" en el baúl. El primero es de un tercero; no se usa en el sitio.
- **Cartel del local:** vuelve a verse "FERNANDO POERIO AUTOMOTORES / OKM - USADOS - CONSIGNACIONES", con el mismo alcance que en las otras unidades.

## Ford Ka S y "39 años" (2026-09-28)
- **Ford Ka S:** 5 puertas, 2016, 1.5 nafta, 132.000 km, con el equipamiento del texto original. Sin precio y **sin foto propia**: solo tengo el flyer, que es un diseño con texto y no sirve como foto de tarjeta. Pedir las fotos originales.
- **"39 años de confianza":** aparece en el logo de los flyers del negocio (Clio Mio y Ka S). Es la única mención de historia que encontré (punto 6 de la búsqueda). No dice el año de fundación ni cuándo se hizo el flyer, por eso no se deduce ninguna fecha. No se muestra en el sitio hasta que el dueño la confirme.
- **Flyer del Clio:** repite exactamente los datos ya cargados (96.600 km, única mano, equipamiento, permuta, teléfono y dirección).
- **Patente parcial** visible en el flyer del Ka ("AA 264…").

## Renault Kwid Outsider (2026-09-28)
- **Unidad:** Kwid Outsider "Full" 2019, 1.0 nafta, 84.000 km, "muy bien de cubiertas". Sin precio.
- **Equipamiento:** solo lo que dice el texto. El texto termina en "etc", que no se completó con datos no confirmados. Dice "dirección" y "levantavidrios" sin especificar asistida o eléctricos, así que se copió igual.
- **"Full":** es el término de la publicación; no hay una lista que lo defina. Confirmar qué incluye.
- **Fotos:** solo 2, de 1536 px (las demás tenían muy baja calidad, según el solicitante), con corrección leve de tono y nitidez. Pedir autorización al dueño.
- **Patentes visibles:** AD 658 TT (el auto) y otra parcial de un auto del fondo en la segunda foto.

## Ford Ka S: fotos (2026-09-28)
- **Fotos:** 2 fotos originales enviadas por el solicitante (2048 px, reducidas a 1280 px), con corrección leve de tono y nitidez. Las demás eran de muy baja calidad, según el solicitante. Reemplazan la falta de foto anotada antes. Pedir autorización al dueño.
- **Patente visible:** AA 264 AU.

## Corrección (2026-09-28)
- La nota anterior decía que "39 años de confianza" no se mostraba en el sitio. Era incorrecto: ya figuraba en el título y en el sello del inicio desde el archivo original. Lo respaldan los flyers del negocio, pero sigue pendiente confirmar el dato con el dueño.
- **Unidades viejas:** las 9 unidades anteriores (EcoSport, Ka Viral, Fiat 147, Logan, 208, 2008, Suran, Ka 2013 y Stepway) vienen del demo original. No pude verificarlas contra publicaciones actuales; pueden estar vendidas.
- **Vista previa (preview.png):** regenerada con fotos de las unidades nuevas.

## Rediseño UX (2026-09-28)
- **Textos quitados por no tener respaldo público:** "0 km de todas las marcas", "gestoría propia / todo tipo de trámites", "precio acordado sin comisión", "pago inmediato", "transferencia antes de retirar" y "local bajo techo". Estaban en el diseño anterior.
- **Textos que quedan, con su respaldo:** "39 años de confianza" (flyers del negocio), "Vendo–Permuto" (publicaciones y flyers), "0 km · Usados · Consignaciones" (cartel del local). El sitio lo aclara con "según sus propias publicaciones" y "como dice el cartel del local".
- **Si el dueño confirma** marcas 0 km, gestoría o condiciones de consignación, se pueden volver a agregar en las secciones de inicio y preguntas.
- **Cambios de estructura:** las unidades aparecen justo después del inicio, con galería deslizable, y hay barra fija de WhatsApp y "Cómo llegar" en celular. El mosaico de fotos viejas del inicio se reemplazó por una sola foto de una unidad verificada (Kwid).

## Ford EcoSport y limpieza de fotos (2026-09-28)
- **Unidad nueva:** EcoSport XLS 2011, 1.6 nafta/GNC, 200.000 km, con el equipamiento del texto original ("dirección" sin aclarar asistida). Sin precio. Verificar que siga disponible.
- **Fotos:** 6 fotos nítidas (1350–1440 px, sin ampliar), con corrección leve de tono y nitidez. Pedir autorización al dueño. La patente (JQR 465) es visible: evaluar taparla.
- **Fotos eliminadas:** se borraron las 10 imágenes de baja calidad (capturas de Instagram de 720 px): ecosport, ka-viral, fiat-147, logan, peugeot-208, peugeot-2008, suran, ka-2013, stepway y punto (la vieja).
- **Unidades retiradas del STOCK** por no tener fotos nítidas: Ka Viral 2011, Fiat 147 1994, Logan 2017, Peugeot 208 2023, Peugeot 2008 2021, Suran 2013, Ka 2013, Stepway 2009 y la ficha vieja de EcoSport. Si el dueño manda fotos buenas, se pueden volver a cargar.

## Rediseño minimalista (2026-09-28)
- Se reconstruyó `index.html` (HTML, CSS y JS de presentación). Sin cambios en `NEGOCIO`, `STOCK` ni en los datos; no se agregaron textos comerciales nuevos.
- Se quitaron el sello "39 años de confianza", el bloque de cifras y el mosaico de fotos del rediseño anterior. Si el dueño confirma el lema, puede volver a mostrarse.
- "Comprar" no tiene respaldo escrito en las publicaciones (solo "Vendo–Permuto" y el cartel de consignaciones): confirmar con el dueño que quiere mostrarlo como operación.
- Se mantiene el aviso demo, `noindex` y el formulario existente (abre WhatsApp).

## Revisión final de calidad (2026-09-28)
- **Arreglado:** botones principales con contraste 3.9:1 (ahora 5.7:1); en celular no había menú (ahora hay una franja de enlaces deslizable); el botón de WhatsApp bajaba a otra línea en celular; áreas táctiles de menos de 44 px en títulos de unidades, teléfono y botón del encabezado; doble tabulador por tarjeta; 40 miniaturas `-t.webp` sin uso (borradas); `preview.png` regenerado con el diseño actual; README actualizado.
- **Lighthouse (local, sin Google Fonts por bloqueo del entorno):** móvil rendimiento 96, accesibilidad 100, buenas prácticas 96, SEO 69; escritorio 99 / 100 / 96 / 69. El SEO baja a propósito por `noindex` (sitio demo). El error de consola que reporta es la carga bloqueada de Google Fonts en mi entorno; no lo pude verificar en un navegador con internet completo.
- **Pendiente del dueño:** horarios; precios; confirmar que "Comprar" figure como operación; "39 años de confianza"; marcas 0 km y condiciones de consignación; cuenta oficial de Facebook; autorización para usar las fotos; patentes visibles en las fotos; disponibilidad de cada unidad.
- **Al salir a producción:** quitar `noindex` (index y 404), `robots.txt` con `Disallow: /`, aviso demo y títulos "DEMO".

## Auditoría de pre-entrega (2026-09-28)
- **Arreglado:** 38 imágenes huérfanas (miniaturas `-t.webp` y JPG viejos) que hacían fallar `npm test`; ningún `href="#"` (ahora cada enlace tiene destino real aun sin JavaScript); flecha del carrusel circular (‹ en la primera foto no hacía nada).
- **Textos:** se quitó el tono de tercera persona ("sus publicaciones dicen…", "según su flyer") y las fechas de publicación de las tarjetas; el sitio habla como la agencia. Las afirmaciones siguen siendo solo las respaldadas (permuta, consignaciones, 0 km por el cartel), sin agregar nuevas. La pregunta de horarios pasó a "¿Cuándo puedo ir a ver un auto?": escribir o llamar antes de venir (no inventa horario).
- **Sigue pendiente del dueño (no bloquea la demo):** horarios, precios, marcas 0 km y condiciones de consignación, "39 años de confianza", cuenta oficial de Facebook e Instagram, autorización de fotos y logo, patentes visibles, disponibilidad de cada unidad, datos legales para privacidad.

## Buscador "¿Qué estás buscando?" y ajustes (2026-09-30)
- Reemplaza la guía genérica. Ordena las unidades de `STOCK` por kilómetros, año, equipamiento, única mano o GNC, y calcula promedios; todo sale de los datos ya cargados. No hay datos, servicios ni imágenes nuevas.
- El FAQ alterna 6 fotos ya existentes con fundido. Se quitó la marca de agua "Chita" del pie.
- Rendimiento: se quitaron el filtro CSS del mapa, el blur del panel y la animación de escala/máscara sobre el iframe.

## Buscador, comparador, "Quiénes somos" y banner (2026-09-30)
- Búsqueda por marca/modelo, comparador de hasta 5 unidades y chips de marcas: salen de `STOCK`. Sin datos nuevos.
- "Quiénes somos" solo dice lo respaldado: atiende en Gral. Galarza 1712, usados, permutas ("Vendo–Permuto") y consignaciones (cartel del local). No repite "39 años" ni promete condiciones.
- Banner de venta/permuta sin promesas de precio ("mejor precio del mercado" no se usa: sin respaldo).
- No se agregaron precios, estrellas, "oportunidades del mes", marcas oficiales ni campos de patente/chasis: no hay datos ni respaldo.

## Filtros, ficha de información, pie y franja de fotos (2026-09-30)
- Filtros por modelo, año, km y orden (Recientes, año, km): salen de `STOCK`. No hay filtro por precio: no hay precios confirmados.
- Ficha de información en "Quiénes somos" y pie con navegación y contacto: repiten dirección, WhatsApp y teléfono de `NEGOCIO`. En "Atención" no hay horario (sigue sin confirmar): dice que se coordina la visita.
- Franja fotográfica "Encontrá tu próximo vehículo" con fotos ya cargadas. Se restauró el menú completo.

## Pulido del sistema de movimiento nativo (2026-09-30)
- Solo movimiento, sin datos nuevos: filtros y orden del stock, revelados escalonados, máscara en la foto de "Quiénes somos", botones magnéticos (solo mouse) y limpieza de ciclo de vida tras cargar las imágenes. Todo respeta `prefers-reduced-motion`.

## Pulido final de movimiento (2026-09-30)
- El panel del buscador "¿Qué estás buscando?" anima el cambio de contenido al elegir otra prioridad. Los títulos animados por palabra ya no cortan las tildes. Se verificó sin desborde horizontal en móvil (390 px) y con movimiento reducido. Sin datos nuevos.

## Hero, reseñas, Quiénes somos y Cómo llegar (2026-09-30)
- Hero: solo el frente de cada unidad (6 fotos, una por vehículo). Sin datos nuevos.
- Reseñas: tarjetas "luna Figueroa" (1 opinión, 5 estrellas; captura de la ficha de Maps) y "Santiago Solis" (5 estrellas). **PENDIENTE: confirmar que la calificación de Santiago Solis esté publicada en la ficha de Google Maps; si no lo está, quitar la tarjeta antes de salir a producción.** Sin fechas relativas, sin promedio ni cantidad total (no hay respaldo).
- Quiénes somos: "39 años de confianza" (lema ya existente, sin año de fundación); "unidades en el salón" sale de `STOCK`; "3 servicios" = usados, permutas y consignaciones (los tres pilares del sitio).
- Formulario "Contanos tu auto": vista previa del mensaje y consejos generales (fotos, cédula, service). Son sugerencias, no requisitos del negocio: a confirmar con el dueño.

## Equipo: quiénes atienden (2026-09-30)
- "Chita Automotores · Dueño": rol indicado por quien arma la demo (el nombre ya es el de la agencia). **PENDIENTE: confirmar con el dueño que figure así.**
- Segunda persona: "Nombre a confirmar · Empleado" es un marcador. **PENDIENTE: completar con el nombre real y su rol, o quitar la fila antes de salir a producción.** No se identificó a nadie en la foto del local.


## Fechas de consulta retiradas del texto público (4/10/2026)

Se quitó de `index.html` el meta-copy de verificación. Registro de respaldo, todo consultado el 2/10/2026: valoración de Google (4,7 de 5, 45 reseñas), paradas de colectivo según Moovit y mensaje de financiación según el Instagram de Chita. Se eliminó también la frase «Este sitio no incluye simulador de cuotas».

## Dossier 4 · 2026-10-04
**Agregado:** video vertical «Recorrido por el salón» (`video/reel-recorrido.mp4`, póster `images/reel-poster.webp`) en el hero, tomado de un reel de Instagram; y el logotipo horizontal (`images/logo-chita-wordmark.webp`), recortado de una captura del cartel del local. Prueba social del hero (4,7 en Google · 45 reseñas) tomada de `data/dealership.json`.

| Pendiente con Chita | Detalle |
|---|---|
| Autorización del video | Confirmar con el dueño que se puede usar el reel en el sitio y que la persona que aparece está de acuerdo. El video trae subtítulos incluidos y menciona un vehículo (sin datos comerciales cargados en el sitio) |
| Logotipo en alta | Pedir el archivo original del logo (vector o PNG grande). El actual sale de una captura de 411 px y pierde nitidez en pantallas grandes |

## Entregas: «Recomendado por el 100 % en Facebook (22 opiniones) · octubre de 2026» (5/10/2026)
El dato aparece en `index.html` (sección Entregas) y no tenía registro propio. **PENDIENTE: guardar la captura o el enlace de la fuente con fecha de consulta; si no se puede respaldar, retirar la línea.** Mientras tanto no se amplía ni se repite en otras secciones. Relacionado con la fila 10 de arriba (confirmar que el perfil de Facebook sea la cuenta oficial).

