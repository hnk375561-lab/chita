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
