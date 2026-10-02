# Afirmaciones a confirmar · Chita Automotores

Registro de cada dato del sitio, su fuente y su estado. Regla 2 de `CLAUDE.md`: todo dato nuevo se anota acá con fuente y fecha. Última revisión: 2026-10-02.

| Dato | Valor | Fuente | Estado |
|---|---|---|---|
| Nombre comercial | Chita Automotores | Pedido del solicitante + 6 directorios | Confirmado como nombre; razón social/CUIT: pendiente |
| Dirección | Gral. Galarza 1712, Concepción del Uruguay (E3260) | Cylex, gtm.com.ar, zonaauto, infoisinfo, licuo, latinoplaces | Cargada (fuente pública, 6 coinciden). Confirmar con el dueño |
| Teléfono | 03442 44-2782 | Cylex, licuo, latinoplaces, entrerios-total | Cargado (fuente pública). Hay un 2.º número (+54 3442 54-7671, zonaauto, ficha antigua): NO usado |
| WhatsApp | — | Ninguna fuente lo trae | **PENDIENTE.** El sitio tiene el texto `WHATSAPP-A-CONFIRMAR`; reemplazar con `node scripts/rebrand.mjs` |
| Horarios | — (no cargados) | Cylex/infoisinfo: L-V 8:30-12 y 16-20, Sáb 9-12 · zonaauto: L-V 8:30-12 y 15:30-19:30, Sáb 9-12:30 · latinoplaces: L-V 9-17 | **CONFLICTO.** Preguntar al dueño. El sitio muestra "a confirmar" |
| Email | — (no cargado) | Solo Cylex: chitaautomotores@gmail.com | Candidato sin confirmar |
| Instagram | @chita.automotores | Enlace del solicitante | Cargado. Perfil NO abierto por mí (bloquea acceso automatizado) |
| Facebook | facebook.com/Chitaautomotores | Enlace del solicitante | Cargado. Página NO abierta por mí (bloquea acceso automatizado) |
| Seguidores / actividad | 15.000 FB · 8.000 IG · publica seguido | Dato del solicitante (2026-10-02) | No se muestra en el sitio. Verificar antes de usarlo en una propuesta |
| Sitio web propio | No tiene | Solicitante + gtm.com.ar ("presencia casi solo en Facebook") | Hecho de contexto |
| Servicios | Usados y nuevos / 0 km y usados | Cylex, infoisinfo, zonaauto (directorios, algunos de 2022-2023) | No se afirma en el sitio. Permuta, consignación, financiación: PENDIENTE |
| Año de fundación / trayectoria | — (no cargado) | Una reseña de Google de 2020 dice "más de 35 años" | NO es dato del negocio. Pedir confirmación |
| Reseñas Google | — (no mostradas) | latinoplaces: 6 opiniones, 5.0 (a 2020) | No usar puntuación ni cantidad hasta ver la ficha actual |
| Titular | — (no cargado) | licuo lo lista por nombre | No cargar en el sitio (CLAUDE.md, regla 4) |
| Logo, fotos, videos | Placeholders | — | **PENDIENTE:** autorización del dueño; patentes visibles |
| Ficha de Google Maps | URL construida por dirección | — | Reclamar/ubicar la ficha real y reemplazar `mapsPlace`, `mapsReviews` y agregar coordenadas |

## Fuentes consultadas (2026-10-02)
- Cylex: https://www.cylex.com.ar/concepcion-del-uruguay/chita-automotores-de-elvio-11397671.html
- gtm.com.ar: https://gtm.com.ar/concesionario/chita-automotores/
- zonaauto: https://zonaauto.com.ar/concesionarios/chita-automotores/
- infoisinfo: https://concepcion-del-uruguay.infoisinfo-ar.com/ficha/chita-automotores-de-elvio-orcellet/203912
- licuo: https://concepcion-del-uruguay.licuo.com.ar/concesionarios_automotor-en_concepcion_del_uruguay.htm
- entreriostotal: http://www.entreriostotal.com.ar/empresas/empresasxrubro.php?code=130etC.+Del+Uruguay
- latinoplaces: https://ar.latinoplaces.com/entre-rios/chita-automotores-239482
- **No abiertas** (el sitio bloquea el acceso automatizado): https://www.facebook.com/Chitaautomotores/photos y https://www.instagram.com/chita.automotores/. Fotos y publicaciones se bajan a mano: `docs/CONTENIDO.md`.

## Texto del sitio que hoy es ESTRUCTURA, no dato (revisar con `npm run audit`)
Secciones "Comprá, vendé o permutá", preguntas frecuentes, "Cómo trabajamos", guía de compra: están redactadas como consulta. Cada una pasa a afirmación solo con una fila nueva en la tabla de arriba.
