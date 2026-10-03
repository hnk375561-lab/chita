# Estado del sitio (reemplaza el plan «Showroom Infinito», que ya no aplica)

Sitio estático de una sola página (`index.html`) más `privacidad.html`, `404.html`, `reserva.html` y `viaje.html`. Es una propuesta demo, no el sitio oficial.

## Estructura actual de index.html
Hero («Autos que se van con sus dueños») · Entregas con prueba social (4,7 en Google, 100 % en Facebook) · Unidades (11 tarjetas) · Modelos y comparador · Quiénes somos · Dónde estamos · Recorrido del local · Reseñas · Cómo comprar · Financiación · Vender o permutar · Guía · Visita (con video de la oficina) · Preguntas.

## Reglas
Ver `CLAUDE.md`. Datos en `data/dealership.json`; verificar con `npm test`.

## Pendiente
- Confirmar con el dueño: horarios, email, unidades duplicadas del stock (Tracker 1.8N 2018 y Palio 1.4N), permiso de los clientes de las fotos de entregas.
- Revisar en navegador real: hero, bloque de reseñas, contraste sobre fotos, móvil en horizontal.
- Unificar tipografía (hoy una familia por sección) y reducir `!important` del CSS.
- Verificar la URL de despliegue y ajustar `canonical` y `og:url`.
