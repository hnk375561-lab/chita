# Identidad CHITA — «La entrega»
Archivos: `css/identidad.css` (se carga al final) y `js/identidad.js`. Núcleo: el momento en que un auto se va con su dueño, frente al local de columnas rojas. La página es un **talonario de remitos de entrega**.

## Firmas (todas salen del local, del logotipo o del papeleo de una entrega)
- **El corte**: esquina superior derecha en diagonal (`--cut`, `--c`), tomada del logotipo. Fotos, botones, tarjetas, etiquetas.
- **La columna**: barra roja fija a la izquierda = avance de lectura; etiqueta con N.º y nombre de la sección.
- **La chapa**: la patente es el sistema de rótulos (banda azul + cuerpo blanco): N.º de sección, sección actual, 4,7 de Google, cursor.
- **El remito**: contador `N° 01…13` por sección, `E·01…E·12` por entrega, numeral calado (el talón) que deriva con el scroll.
- **La cinta**: cinta de obra torcida entre hero y entregas, con datos ya publicados; acelera con la velocidad de scroll.
- **v7 · La perforación**: borde de talonario entre secciones; la mordida tiene el color de la sección anterior.
- **v7 · El sello**: cada entrega publicada lleva su sello «ENTREGADO».
- **v7 · El talón**: las tres declaraciones (Financiación, Guía, Visita) son talones: a la izquierda, display gigante, borde perforado con «TALÓN N° NN».
- **v7 · El cursor**: etiqueta-chapa que sigue al mouse (Ver ficha / Entrega E·NN / Recorrido) y botones magnéticos. Solo mouse; no existe en táctil ni con reduced-motion.

- **v8 · El corte en el hero y en las tarjetas**: el recorrido y la unidad del hero (solo escritorio) entran con barrido diagonal y «SUS DUEÑOS» se corta de izquierda a derecha; unidades, operaciones y reseñas se revelan una sola vez con el mismo corte (clase `cz7`, un `IntersectionObserver`; si no existe, todo queda visible).
- **v8 · U·NN**: numeración de unidades en la lista (orden de la lista, tipo remito).
- **v9 · El talonario llega al final**: Preguntas son líneas de remito `P·NN` (la abierta se llena de rojo con el corte y se despliega con barrido); Operaciones son talones `O·NN` con perforación entre foto y cuerpo; las cifras de Quiénes somos son bloques de tinta con numeral rojo; el pie se corta con perforación y «Fin del talonario».

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
Solo `transform`, `scale`, `rotate`, `opacity`, `clip-path`. Sin fade-up. `js/motion.js` (GSAP + ScrollTrigger + Lenis) se conserva sin cambios.

## Datos
No se agregó ningún dato: el sello y las etiquetas usan solo lo ya publicado (entregas, reseñas, dirección).
