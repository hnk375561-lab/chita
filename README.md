# Chita Automotores · demo

Sitio estático (sin build). **Demo independiente, no oficial.** Una escena fija por unidad: el scroll mueve la cámara (detalle → auto → número → interior). GSAP + ScrollTrigger + ScrollToPlugin en `vendor/`.

- `index.html` · `css/main.css` · `js/app.js`: todo el sitio. Los datos de las unidades están al inicio de `js/app.js` (`D`).
- Fotos reales en `images/showroom/` (800×1000). Sin datos inventados: ver `CLAUDE.md` y `golive/`.
- `npm run dev` → http://localhost:8080 · `npm test`.
- Pendiente: WhatsApp real, horarios (las fuentes se contradicen), confirmar año del Palio (2017 en datos; `palio-04.webp` trae un cartel "2013" y no se usa), fotos de mayor resolución.
