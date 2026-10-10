# v65 · Horarios + carrusel del local + mapa

Archivos tocados (descomprimir sobre la raíz del repo, aceptar sobrescribir):
`index.html` (+1 bloque `.hor-lv` en #horarios), `css/horarios.css`, `js/horarios.js`, `css/donde.css`, `js/mapa.js`, `js/lugar.js`.
No se agregó ningún dato: todo sale de los horarios que ya estaban en el HTML.

## 1 · Horarios (rediseño)
- Semana como regla de taller: eje 8–18 h, una barra inclinada por día (la inclinación repite la del subrayado tricolor) y aguja en «ahora» en la fila de hoy.
- Tablero en vivo: «Cerramos en 2 h 30 min» + barra de turno, o «Abrimos en 12 h 6 min».
  Si entre hoy y la próxima apertura hay un día «consultá por WhatsApp» (lunes), no se muestra cuenta regresiva: no se afirma nada que el dueño no confirmó.
- Sello ABIERTO en verde con punto de «en vivo» (3 destellos y se queda fijo).
- Solo transform/opacity y solo al entrar; sin clip-path, filtros ni sombras. Con `prefers-reduced-motion` no hay animación. Sin JS la regla se ve completa.

## 2 · Carrusel (lag al llegar) — js/lugar.js
- Los 5 pósters se decodifican de a uno, en pausas del scroll, cuando la sección está a ~2 pantallas.
- El primer autoplay espera 380 ms de scroll quieto (antes 220).

## 3 · Mapa (lag al cargar) — js/mapa.js, css/donde.css
- Cerca de la sección y con el scroll quieto se baja/ejecuta Leaflet y se abre la conexión con el servidor de mosaicos. No se arma el mapa ni se piden mosaicos hasta tocar.
- Los mosaicos se muestran juntos (panel oculto hasta que llegan todos los de la vista o pasan 2,5 s) en vez de pintarse de a uno.

## Validación
Probado en Chromium headless (con mosaicos simulados): sin errores de JS, estados abierto/cerrado/lunes/sábado/móvil de Horarios, carrusel navega, mapa precarga sin pedir mosaicos y revela al tocar.
NO medido en hardware real: el zip no trae `images/`, `assets/` ni `video/`, y el headless rasteriza por software. Medir antes/después con `?perf=measure` (js/perf-diag.js) y Chrome Performance con CPU 4x.
