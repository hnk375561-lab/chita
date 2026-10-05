# Identidad CHITA — «La entrega» (v15)
Archivos: `css/identidad.css` (se carga al final) y `js/identidad.js`. Núcleo: el momento en que un auto se va con su dueño, frente al local de columnas rojas. La página es un **talonario de remitos de entrega**.

## Firmas (todas salen del local, del logotipo o del papeleo de una entrega)
- **El corte**: esquina superior derecha en diagonal (`--cut`, `--c`), tomada del logotipo. Fotos, botones, tarjetas, etiquetas.
- **La columna**: barra roja fija a la izquierda = avance de lectura; etiqueta con N.º y nombre de la sección.
- **La chapa**: la patente es el sistema de rótulos (banda azul + cuerpo blanco): N.º de sección, sección actual, 4,7 de Google, cursor.
- **El remito**: contador `N° 01…13` por sección, `E·01…E·12` por entrega, numeral calado (el talón) que deriva con el scroll.
- **La pasada** (v27, reemplaza a la cinta): detrás de todo el hero pasan las portadas de los modelos publicados, una por auto, cada una como un vano entre columnas rojas; velo plano de tinta, texto blanco. Se arma en `js/app.js` desde `STOCK` + `HCOVER` y acelera con la velocidad de scroll. La cinta de inauguración (v24) se retiró.
- **v7 · La perforación**: borde de talonario entre secciones; la mordida tiene el color de la sección anterior.
- **v7 · El sello**: cada entrega publicada lleva su sello «ENTREGADO».
- **v7 · El talón**: las tres declaraciones (Financiación, Guía, Visita) son talones: a la izquierda, display gigante, borde perforado con «TALÓN N° NN».
- **v7 · El cursor**: etiqueta-chapa que sigue al mouse (Ver ficha / Entrega E·NN / Recorrido) y botones magnéticos. Solo mouse; no existe en táctil ni con reduced-motion.

- **v8 · El corte en el hero y en las tarjetas**: el recorrido y la unidad del hero (solo escritorio) entran con barrido diagonal y «SUS DUEÑOS» se corta de izquierda a derecha; unidades, operaciones y reseñas se revelan una sola vez con el mismo corte (clase `cz7`, un `IntersectionObserver`; si no existe, todo queda visible).
- **v8 · U·NN**: numeración de unidades en la lista (orden de la lista, tipo remito).
- **v9 · El talonario llega al final**: Preguntas son líneas de remito `P·NN` (la abierta se llena de rojo con el corte y se despliega con barrido); Operaciones son talones `O·NN` con perforación entre foto y cuerpo; las cifras de Quiénes somos son bloques de tinta con numeral rojo; el pie se corta con perforación y «Fin del talonario».

- **v10 · El despacho**: la frase de marca hecha movimiento. En escritorio el hero queda fijo, el auto se va hacia la derecha acelerando (`translate`, sin escala, giro ni opacidad: foto fiel) y Entregas —los dueños— sube y lo cubre con su borde perforado; la cinta de obra marca la costura. Cuando lo cubrió del todo, el hero se suelta (sale de pantalla y el video del recorrido se pausa). Solo ≥900 px, sin `prefers-reduced-motion` y solo si el hero entra completo bajo el header (`html.dsp`, `hero.stk`). En móvil el recorrido del salón entra en el primer viewport (botones en una fila, el sello 4,7 se superpone al video).
- **v10 · Un solo verbo de revelado**: títulos (`h2`), textos secundarios y formulario de visita entran con el CORTE desde `js/motion.js`. Se eliminaron las personalidades por sección (letras 3D, cruce lateral, rebote, skew), el fade-up y la inclinación de títulos por velocidad.
- **v10 · Corrección**: las cifras de Quiénes somos (4,7 · 11 · 3) se veían diminutas porque `.ns span` pisaba los `<span>` por carácter del odómetro; ahora solo la etiqueta es `.ns>div>span`.

- **v11 · Los tres talones, cada uno con su gesto**: mismo talón (perforación, N° vertical), tres lecturas del mismo texto. Financiación: la frase clave es un bloque de tinta. Guía: planilla (renglones bajo cada línea, tilde en el rótulo, frase clave subrayada en rojo). Visita: «en persona» es una patente (banda de tinta + cuerpo blanco), la misma chapa de los rótulos. Guía y Visita se desplazan en direcciones opuestas en escritorio para romper el eje. Solo CSS; no cambia ningún texto.

- **v12 · El índice**: en móvil la tira de navegación es el índice del talonario: cada enlace lleva su número, la sección actual es una chapa roja con el corte, se desliza con imán y se desvanece en ambos bordes. Corrección: «Comparar» y «Dónde estamos» ahora también se marcan al estar en Modelos y en Local (antes ninguna sección coincidía con su `href`).

- **v13 · El remito de la unidad**: la ficha deja de ser una tabla gris y pasa a ser el remito de esa unidad: columna roja junto a las fotos, rótulo «Remito de unidad», datos en bloque de tinta con renglones punteados, botón de cerrar con el corte y el botón de consulta como talón (borde perforado, «Talón · consulta»). Solo CSS sobre el diálogo existente; galería, flechas y teclado no cambian. En móvil, el botón de cerrar ya no tapa «Siguiente →».

- **v14 · El desglose**: la segunda mitad de los tres talones (Financiación, Guía, Visita) seguía con el estilo anterior (títulos centrados con sombra, tarjetas moradas, formulario blanco con sombra, pastilla redonda). Ahora es el cuerpo del remito, alineado a la columna del talón: rótulo de chapa con el corte; Financiación = tres talones `F·01…F·03` en tinta con renglón perforado rojo; Guía = renglones de planilla `G·01…G·04` con borde punteado; Visita y «Contanos tu auto» = planilla de papel con el corte y renglón perforado, sin sombra; pie del talón con filete a la columna en lugar de línea y texto centrado. En «Comprá, vendé o permutá» se quitó la chapa de logo que tapaba el rótulo impreso en las fotos. En `js/motion.js` las ventanas de scroll (hojas de sección, recorrido, mapa) dejan de tener esquinas redondeadas: solo recorte recto, coherente con el corte. Solo CSS más tres cadenas de `clip-path`; no cambia ningún texto ni dato.

- **v15 · Ritmo de color y pasos de remito**: «Dónde estamos» pasa a azul chapa (antes Modelos, Dónde estamos y El local eran tres fondos oscuros seguidos con la dirección repetida). Los pasos de «Cómo funciona vender o permutar» dejan los rombos y son renglones `P·01…P·03` (chapa de tinta con corte + renglón perforado). Solo CSS.
- **v28 · Las columnas son pestañas (Quiénes somos)**: sobre la foto del frente, tres rótulos-chapa (01 Usados, 02 Permutas, 03 Consignaciones) marcan tres columnas rojas reales; al pasar el mouse o tocar, la luz se desliza a esa columna y se abre su texto (acordeón de una sola abertura, `aria-expanded`). En móvil una leyenda bajo la foto repite la columna activa. Mejora progresiva: `identidad.js` agrega `.nt` / `.nz-on`; sin JS queda la lista de siempre. Las medidas están en % de la foto 900×581: si se cambia la foto, hay que remedirlas (`Z` en `js/identidad.js`).
- **v28 · Numeración**: la nav usa el N° real de su sección (`data-n`); los segundos bloques de una sección llevan `N° 03·B` / `N° 13·B` (`data-sub`).
- **v29 · Modelos**: el panel de vista previa ya no queda en una columna angosta (`css/motion.css:59` lo limitaba a `min(340px,38%)`). La unidad se ve en un vano entre dos columnas rojas, el texto ocupa todo el ancho y la foto se revela con el CORTE diagonal al cambiar de modelo o de miniatura (`mdcorte`). Sin datos nuevos.

- **v30 · Alineación con `docs/IDENTIDAD-MADRE.md`**: el mensaje de consulta pide el kilometraje cuando la unidad no lo publica; el copy de «Cómo comprar» dice «WhatsApp o por teléfono»; el `aria-label` de `#catalogo-comparador` pasa a «Índice de unidades publicadas y comparador»; se regeneró el HTML estático de las tarjetas (`npm run prerender`). Sin datos nuevos.

- **v31 · Limpieza de consola y Financiación**: `initHero()` (`js/motion.js`) ya no crea tweens para `.hx-veil`, `.hx-logo` ni `.hx-info` cuando no existen (0 avisos GSAP). En Financiación el talón de condiciones es la única acción primaria (el botón anterior queda como respaldo sin JS), no se sale de la pantalla en móvil y el selector usa todo el ancho. Solo CSS y una guarda en JS; sin datos nuevos.
- **v32 · Unidades**: filtros reducidos a búsqueda, chips de modelo (generados desde `STOCK`) y orden. También Guía v32 (planilla tildable y hoja para llevar) y Reserva v32 (almanaque de taco).
- **v33 · Hero**: la pasada de fondo alterna portada de unidad y foto de entrega publicada (decorativa; falta la autorización final de uso en hero). Reserva v33: perforación en la hoja del día.
- **v34 · Coordenadas**: línea final legible, sin cambiar el dato aproximado.
- **v35 · Footer**: wordmark plano en lugar del logo circular metálico.
- **v36 · Cómo comprar**: cada paso es un sello del remito.
- **v37 · Ficha**: remito numerado y foto a sangre con entrada por CORTE.
- **v38 · Visita, Reseñas y Viaje**: (1) Visita: almanaque de taco dentro del talón; escribe el día y la franja (Mañana/Tarde) en «Día y horario» y de ahí lo leen el pase y el mensaje de WhatsApp; sin JS queda el campo de texto; no es una reserva y la agencia confirma. (2) Reseñas: la línea de fuente y la cifra de casillas pasan a tinta para tener contraste sobre papel. (3) Viaje: las unidades se ordenan por su kilometraje ya publicado y se reparten en tercios (ciudad, ruta, destino), el viaje cierra donde empezó (Gral. Galarza 1712). Sin datos nuevos.
- **v39 · Guía → Visita (T18)**: lo que se tilda en la Guía se suma al mensaje de WhatsApp de Visita («Quiero revisar: …») y el contador dice «Marcaste N de M · van en tu consulta de visita». Sin guardar datos ni texto nuevo con cifras.
- **v40 · Comparador (T5)**: con 2 o 3 unidades comparadas aparece un talón «Consultar las N juntas» que abre WhatsApp con las unidades nombradas y, para las que no publican km, la pregunta «¿Cuántos km tiene…?». Con una sola unidad no aparece. Sin cifras ni datos nuevos.
- **v41 · Reseñas (T16)**: las 45 casillas pasan de rojo macizo con numeral grande a regla de recuento (contorno de tinta, numeral mínimo; la 45 en rojo). El 4,7 es el único numeral grande y no se leen como reseñas individuales. Solo CSS; sin texto ni datos nuevos.
- **v42 · Hero (T10)**: la pasada de fondo baja contraste (velo .66 → .8; fotos de entregas .18 → .34) y velocidad (130 s → 190 s por vuelta) para que el reel sea el protagonista. Solo CSS; sin elementos nuevos.
- **v43 · Entregas (T11)**: el sello grande queda solo en la primera entrega; en las otras 11 aparece al pasar el mouse o con foco. En reposo se ve 1 de 12 (límite del documento madre: 30 %). El código `E·NN` sigue en todas. Solo CSS; sin estados nuevos.
- **v44 · E·13 / Preguntas (T20)**: el pedido E·13 queda como bloque propio con perforación arriba y abajo; las Preguntas dejan la numeración `P·NN` (el título de sección y el rótulo «Preguntas de referencia» no cambian). Una sola acción primaria en el cierre del pedido. Solo CSS.
- **v45 · Comparador (T12)**: al elegir una cuarta unidad, el aviso dice cuál reemplaza («Sumaste X. Reemplaza a Y, la más antigua de las tres.») en lugar de reemplazar en silencio. Solo JS en `index.html`; sin datos nuevos.

## Color
Azul chapa `#0A2C8C`, rojo `#C1121F` (logotipo y columnas del local), papel `#ECEDEA`, tinta `#0A1020`, plata `#B9BEC4`. Sin cian, sin dorado, sin vidrio.

## Tipografía
Bricolage Grotesque 800 en versalitas (display, títulos, etiquetas, números, navegación) + Instrument Sans (texto y metadatos).

## Lenguaje de movimiento (tres verbos, un easing)
| Verbo | Para qué | Curva y duración |
|---|---|---|
| CORTE | revelar (barrido diagonal `clip-path`; hero y tarjetas) | `--ease` cubic-bezier(.7,0,.2,1) · .7 s |
| SELLO | confirmar (entra grande, se asienta) | `--ease-i` cubic-bezier(.2,.9,.1,1) · .42 s, escalonado 85 ms |
| RIEL | scroll (deriva lineal ligada al scroll) | linear |
Solo `transform`, `scale`, `rotate`, `opacity`, `clip-path`. Sin fade-up. `js/motion.js` (GSAP + ScrollTrigger + Lenis) usa el CORTE como único verbo de revelado desde v10 (constante `CORTE`); el resto de su coreografía (odómetro, ventana, cursor, inercia de fotos) no cambia.

## Datos
No se agregó ningún dato: el sello y las etiquetas usan solo lo ya publicado (entregas, reseñas, dirección).

## v46 · estados de dato, columnas con salida, Operaciones coherente, estado de la visita
- **T3** `js/app.js` (`card()` y ficha): km sin dato → `<span class="dato-ac">Km: a confirmar</span>`; precio «Consultar» y km vacío en la ficha → `dd.bl.dato-ac` «A confirmar con la agencia». `css/identidad.css` define `.dato-ac` (tinta al 68 % + subrayado punteado plata; la plata sola no da contraste sobre papel). `index.html` se regeneró con `npm run prerender`.
- **T13** `js/identidad.js`: enlace `.nl` dentro de cada `.nq` de Quiénes somos. El de Consignaciones llama a `window.CHITA_OP("Consignar")` antes de saltar a `#operaciones`.
- **T17** `js/identidad.js`: `opShow()` unifica rótulo, título, bajada, tarjeta elegida y `select[name=interes]`; dispara `input` para que `app.js` recalcule `#wpT`.
- **T19** `reserva.html`, `js/reserva.js`, `css/reserva.css`: `#send-state` con `data-state="ready|pending"`.
- Sin datos nuevos. Sin verbos de movimiento nuevos.

## v47 · T14, T15, T1 (texto neutro) y control de voz
- **T14/T15** `index.html` (`#local`): título «Reconocé el frente antes de entrar»; cada `li.vi` lleva `<small class="vfoto">` con la foto o el video que lo ilustra. `css/identidad.css`: `.vfoto` y regla `#local #rqh .origin-mark` (antes solo existía para `#contacto`).
- **T1** `js/app.js`: nota de «Serie 2» sin «diferencia editorial». Tarjetas regeneradas con `npm run prerender`.
- **Audit** `scripts/audit-copy.mjs`: segunda lista «VOZ» con las frases que el documento madre pide evitar.


## v49 · cierre de brechas de identidad (privacidad, metadatos, voz)
- **`privacidad.html`**: era la única página con la base vieja (barra `#0E1B26`, logo circular metálico, enlaces cian). Ahora usa el encabezado del sitio (papel, filete de tinta, wordmark), la columna roja en el título, el corte en el aviso y en los botones, y enlaces azul chapa. No cambió ninguna palabra del contenido legal.
- **`theme-color` y `site.webmanifest`**: `#0E1B26` (fuera de paleta) pasa a tinta `#0A1020`. La 404 conserva `#022061` porque es el fondo de esa página.
- **Voz**: la bajada de la Guía deja la frase intercambiable («es una decisión importante») por «Un usado se revisa con calma…»; la de Visita usa el mismo lenguaje del Comparador («se mira de cerca, se revisa cada detalle y se pregunta lo que falte»); el rótulo de Visita deja de repetir el nombre de la marca y dice «Pasá por Galarza» (igual que `viaje.html`: «Galarza 1712»).
- **Metadescripciones**: `index.html` (description, og, twitter) abre con la frase de marca y sigue diciendo que es una propuesta no oficial; `reserva.html` ya no dice «Reservá» (el sitio aclara que no es una reserva automática); `viaje.html` deja de repetir su título.
- Sin datos nuevos, sin verbos de movimiento nuevos, sin cambios de estructura.
