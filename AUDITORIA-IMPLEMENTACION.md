# Auditoría de implementación — Chita Automotores

**Fecha:** 3 de octubre de 2026  
**Repositorio:** `hnk375561-lab/chita`

## Resultado

La auditoría fue aplicada en el código y validada con los scripts del repositorio:

- `npm test` ✅
- `npm run test:prod` ✅
- `npm run audit` ✅ (el script informa líneas de copy que deben revisarse manualmente; no reporta fallos)
- `git diff --check` ✅
- Prerender de tarjetas ✅ (11 tarjetas, sincronizadas con `STOCK`)

## Puntos corregidos

### Contacto y conversión

- WhatsApp no confirmado: eliminado como destino público y como placeholder de configuración. Todos los CTAs de consulta caen a `tel:+543442442782`.
- Los enlaces telefónicos no abren pestañas nuevas.
- Las tarjetas de unidades usan el mismo fallback telefónico que el resto de la página.
- Los formularios ya no prometen abrir WhatsApp ni enviar automáticamente: preparan la consulta y explican que debe completarse por teléfono.
- La página 404 ya no muestra un enlace WhatsApp sin número; ofrece llamada directa.
- Se conserva el botón de compartir ubicación porque es un enlace genérico de WhatsApp para compartir, no un canal de contacto del negocio.

### Contenido y datos

- Se retiró la referencia no confirmada a «Casi Bv. Montoneras».
- Se corrigió el texto alternativo de la imagen de «Quiénes somos»: describe el interior del local y no la presenta como logo.
- Se reemplazaron los horarios diarios «a confirmar» por una única indicación visible: consultar antes de venir porque los horarios publicados no son consistentes.
- Se mantuvieron precios como `Consultar` y estados como `Consultar disponibilidad`.
- Se mantuvieron explícitas las limitaciones de financiación, 0 km, consignación, disponibilidad y condiciones vigentes.
- Se redujo el tono de promesa comercial: no se publican años de experiencia, garantías, tasas ni condiciones no confirmadas.
- Se preservó el aviso de demo/no oficial y el `noindex` correspondiente.

### Accesibilidad y UX

- El control de pausa del carrusel hero está presente y operativo (`#hpause`, `aria-pressed`, `aria-label`).
- El contador del hero usa `aria-live="off"` para no interrumpir la navegación.
- El comparador referencia su encabezado con `aria-labelledby`.
- Se conservan `alt` explícitos, un único `h1`, foco visible, botón de salto y estados `role="status"`.
- No se agregaron afirmaciones personales no verificadas; la sección del equipo mantiene solo la entidad comercial.

### Rendimiento

- Se eliminó el warm-up que volvía eager todas las portadas y duplicaba descargas después del `load`.
- Las tarjetas fuera del hero conservan `loading="lazy"`; el precalentamiento queda limitado al mecanismo de navegación del hero.
- El prerender se volvió a ejecutar y quedó sincronizado con el inventario.

## Validaciones pendientes externas

No son fallos del código y no deben resolverse inventando datos:

- Confirmar con el negocio horarios, WhatsApp oficial, email, CUIT/razón social y condiciones comerciales.
- Confirmar disponibilidad y precio de cada unidad antes de publicar esos valores.
- Confirmar que las cuentas sociales enlazadas son las oficiales.

Mientras esos datos no existan por escrito, el sitio muestra teléfono, `Consultar`, `a confirmar` o indicaciones neutrales según corresponda.
