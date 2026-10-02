# Chita Automotores · sitio demo

Sitio estático (HTML/CSS/JS, **sin build ni CDN**) de propuesta para Chita Automotores, Gral. Galarza 1712, Concepción del Uruguay. **No es el sitio oficial ni está aprobado por el negocio.** El movimiento usa GSAP + ScrollTrigger + Flip + ScrollToPlugin incluidos en `vendor/`.

> Estado: **plantilla funcional con placeholders.** Las fotos, el logo, el video y las 3 unidades son de ejemplo (dicen "FOTO A CARGAR" / "EJEMPLO"). Los datos de contacto salen de directorios públicos y están marcados para confirmar. Nada de lo que se ve es dato confirmado por el dueño.

## Arranque rápido
```bash
git init && git add . && git commit -m "Base Chita"
git branch -M main
git remote add origin https://github.com/hnk375561-lab/chita.git
git push -u origin main
# GitHub > Settings > Pages > Deploy from a branch > main / (root)
# URL: https://hnk375561-lab.github.io/chita/
```
Probar en local: `npm run dev` → http://localhost:8080 (sin dependencias; Node ≥ 20).

## Qué falta antes de mostrárselo al dueño
1. **WhatsApp**: reemplazar `WHATSAPP-A-CONFIRMAR` (ver `docs/REUTILIZAR.md`, `node scripts/rebrand.mjs`). Hoy los botones de WhatsApp no apuntan a ningún número.
2. **Fotos reales** de 3–6 unidades, logo y foto del local: `docs/CONTENIDO.md`.
3. Revisar `npm run audit` (textos que prometen algo) y `golive/AFIRMACIONES-A-CONFIRMAR.md`.

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm test` | Valida datos vs. `index.html`, imágenes y variantes, `alt`, un solo `h1`, enlaces, `noindex` y `Disallow` (modo demo) |
| `npm run test:prod` | Puerta de salida: falla mientras quede WhatsApp sin cargar, "EJEMPLO", "a confirmar", "a cargar", `noindex`, `Disallow: /`, aviso demo |
| `npm run prerender` | Reescribe las tarjetas de unidades dentro de `index.html` (se ven sin JS). Correrlo cada vez que cambie `STOCK` |
| `npm run images -- <slug> <carpeta>` | Fotos originales → `-N.webp`, `-800`, `-480` + línea para `STOCK` (requiere `npm install`) |
| `npm run audit` | Lista cada línea del sitio que afirma algo del negocio |
| `npm run rebrand -- mapa.json [--dry]` | Reemplazo masivo de textos (datos, marca) |

## Estructura
```
index.html            sitio completo: CSS inline, datos NEGOCIO y STOCK al final
js/motion.js          sistema de movimiento (GSAP)            → docs/MOTION.md
js/recorrido.js       recorrido del local con video
vendor/               GSAP 3.15.0 + ScrollTrigger + Flip + ScrollToPlugin
fonts/                24 familias .woff2 autoalojadas (SIL OFL), sin Google Fonts
images/ video/        placeholders (mismos nombres y tamaños que los reales)
data/dealership.json  datos confirmados + fuente de cada uno
golive/               afirmaciones a confirmar, pasos a producción, JSON-LD y sitemap SIN activar
scripts/              validación, prerender, imágenes, rebrand, audit, servidor local
docs/                 CONTENIDO · MOTION · REUTILIZAR
404.html privacidad.html netlify.toml robots.txt site.webmanifest .github/workflows/test.yml
```

## Ojo: GitHub Pages publica TODO el repo
Con el repo público, `golive/`, `data/`, `docs/` y `CLAUDE.md` quedan accesibles por URL (`netlify.toml` los oculta solo en Netlify). Son notas internas sin datos personales, pero si no querés que el dueño o terceros las vean: repo privado con Pages, o publicar en Netlify. **No subas al repo el plan comercial** (`NO-SUBIR/ENCARAR-CHITA.md`).

## Reglas
Leer `CLAUDE.md`: cero datos inventados, todo dato nuevo se registra con fuente, mientras sea demo mantener `noindex`.
