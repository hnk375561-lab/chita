# Estado del sitio (reemplaza el plan «Showroom Infinito», que ya no aplica)

Sitio estático de una sola página (`index.html`) más `privacidad.html`, `404.html` y `reserva.html`. `viaje.html` existe en el repo pero no se publica (no está en la lista blanca de `scripts/build-site.mjs`). Es el sitio oficial de Chita Automotores, publicado como demo temporal en github.io y **no indexable** (`noindex`, ver `CLAUDE.md` regla 5).

## Estructura actual de index.html
Hero («Autos que se van con sus dueños») · Entregas con prueba social (4,7 en Google) · Unidades (9 tarjetas) · Índice de unidades y comparador (hasta 5) · Dónde estamos · Reseñas · Cómo comprar · Financiación · Comprá, vendé o permutá · Guía · Visita · Preguntas («Contanos qué auto buscás»). Ids: `entregas`, `unidades`, `catalogo-comparador`, `contacto`, `opiniones`, `como-comprar`, `financiacion`, `operaciones`, `guia`, `visita`, `preguntas`.

## Reglas
Ver `CLAUDE.md`. Datos en `data/dealership.json`; verificar con `npm test`.

## Pendiente
- Confirmar con el dueño: horarios, email, unidades duplicadas del stock (Tracker 1.8N 2018 y Palio 1.4N), permiso de los clientes de las fotos de entregas.
- Revisar en celular real y en Safari: hero, reseñas, contraste sobre fotos (no medido), móvil en horizontal.
- Verificar la URL de despliegue y que el mapa embebido de «Dónde estamos» cargue.
- Reducir `!important` del CSS y unificar tipografía (opcional).
