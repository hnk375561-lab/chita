# El Showroom Infinito — Chita Automotores

## Dirección

**Movimiento:** brutalismo editorial / señalética de salón. Un inventario convertido en espacio: tipografía enorme, cortes diagonales y una escena de profundidad con fotos documentales.

**Principios:** evidencia antes que adorno; asimetría con jerarquía; contraste duro sin efectos atmosféricos; movimiento físico y legible.

**Paleta:** `#101114` es el salón a media luz; `#ecebe7` es la señalética; `#b3122b` es la marca y el gesto de acción; `#1636a8` marca la posición en el recorrido.

**Layout:** lienzo horizontal virtual dentro de un viewport fijo, con planos que se acercan/alejan por `translate3d` y `scale`. En mobile la misma escena se vuelve una composición vertical de planos apilados.

**Firma:** diagonal Chita en cada entrada; Archivo Black sobredimensionado atravesando los autos; cotas en JetBrains Mono.

**Interacción:** `progress` es la única variable. Wheel, drag, touch y teclado modifican el mismo valor; el snap abre la unidad más cercana. Enter enfoca; Escape cierra.

**Animación:** solo transform/opacity; GSAP ticker y `quickTo`; sin filtros, blur, glow, gradientes ni sombras. `prefers-reduced-motion` muestra una lista estática.

**Tipografía:** Archivo Black para impacto y nombres; JetBrains Mono para metadatos y coordenadas.

## Datos y estructura

- `index.html`: shell accesible, lista real de unidades, viewport y ficha enfocada.
- `css/main.css`: sistema visual responsive sin grillas de cards.
- `js/app.js`: fuente de verdad de unidades, input unificado, ticker y overlays.
- `images/showroom/`: solo fotos reales auditadas de Tracker 2021 y Palio 2017, WebP lazy.

No se publican precios, equipamiento no verificado ni unidades sin foto coherente. El CTA usa el WhatsApp indicado por el pedido y queda marcado como pendiente de confirmar en la interfaz de contacto.
