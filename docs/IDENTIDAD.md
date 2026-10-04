# Identidad CHITA — «La entrega»
Archivos: `css/identidad.css` (se carga al final) y `js/identidad.js` (la columna). Se quitó de `css/site.css` la regla que forzaba peso 400, minúsculas y serif en todo el sitio.
- **El corte**: esquina superior derecha en diagonal (`--cut`, `--c`), tomada del logotipo. Fotos, botones, tarjetas y etiquetas.
- **La columna**: barra roja fija a la izquierda = avance de lectura; etiqueta con N.º y nombre de la sección (`js/identidad.js`).
- **N.º de entrega**: contador CSS `N° 01…13` en cada sección y `E·01…E·12` en las entregas reales.
- **Color**: azul chapa `#0A2C8C` y rojo `#C1121F` (del logotipo y las columnas del local), papel `#ECEDEA`, tinta `#0A1020`. Sin cian ni dorado.
- **Tipografía**: Bricolage Grotesque 800 en versalitas (títulos, etiquetas, números) + Instrument Sans (texto).
- **Movimiento**: se conserva `js/motion.js` (GSAP + ScrollTrigger + Lenis). Easing de la identidad: `cubic-bezier(.7,0,.2,1)`, 0.55 s.
Para volver atrás: quitar las dos líneas de `index.html` que cargan estos archivos.
