# Cargar el contenido real de Chita

Chita publica en Facebook (`facebook.com/Chitaautomotores`, álbum de fotos: `/photos`) e Instagram (`@chita.automotores`). Esas plataformas bloquean el acceso automatizado, así que **el material se baja a mano** (o se lo pide el dueño por WhatsApp). Todo lo que sale de ahí es contenido del negocio: pedir autorización de uso (regla 1 y 4 de `CLAUDE.md`).

## 1. Juntar el material
1. Pedirle al dueño una carpeta (Drive/WhatsApp) con las fotos originales de cada auto en stock: **las de la publicación sirven, pero las originales se ven mejor** (Facebook las comprime).
2. Si no hay originales: bajar las fotos del álbum `/photos` con la cuenta del dueño ("Descargar" desde su propia página).
3. Por auto, anotar lo que dice la publicación (no completar de memoria): marca, modelo, versión, año, km, combustible, equipamiento mencionado, si acepta permuta (solo si lo dice), estado (disponible/reservado/vendido).
4. Logo (el de la foto de perfil, en el mejor tamaño posible), foto del frente del local, foto de interior, y si hay: video corto del salón. Todo con autorización.

## 2. Procesar las fotos por unidad
```bash
npm install                                   # una vez (instala sharp)
node scripts/make-images.mjs gol-2018 ./fotos-brutas/gol    # slug en minúsculas, carpeta con las fotos
```
- Ordena por nombre de archivo (la primera es la portada), recorta a 4:3 (1280×960, con enfoque en el motivo), y genera `-800` y `-480` para `srcset`. Con `--ratio original` conserva la proporción.
- El script imprime la línea lista para pegar en `STOCK` (en `index.html`, al final).
- Borrar las unidades `ejemplo-*` de `STOCK` y sus imágenes (`images/ejemplo-*`) cuando entre la primera unidad real.

## 3. Cargar la unidad
```js
{ foto:"images/gol-2018-1.webp", fotos:[1,2,3,4].map(function(n){return "images/gol-2018-"+n+".webp"}),
  titulo:"Volkswagen Gol Trend 1.6", corto:"Gol Trend", anio:2018, km:"85.000 km", combustible:"Nafta",
  precio:"Consultar", nota:"Texto de la publicación: equipamiento, único dueño, etc." }
```
Opcionales: `estado:"disponible"|"reservado"|"vendido"` y `transmision:"Manual"` (solo con dato). Después:
```bash
npm run prerender   # regenera las tarjetas que se ven sin JavaScript y en buscadores
npm test            # valida imágenes, variantes, datos y accesibilidad básica
```
`precio` solo admite `"Consultar"` hasta que el dueño confirme precios por escrito (el test lo exige).

## 4. Imágenes fijas del sitio (hoy son placeholders)
Cada placeholder dice en la imagen su nombre y tamaño. Reemplazar manteniendo **mismo nombre, mismo formato y mismas proporciones** (si no hay foto para una, borrar la sección o la escena que la usa; el test avisa de referencias rotas).

| Archivo | Tamaño |
|---|---|
| `images/apple-touch-icon.png` | 180×180 |
| `images/equipo.webp` | 1032×774 |
| `images/fondo-banner-movil.webp` | 1200×1600 |
| `images/fondo-guia.webp` | 1350×1687 |
| `images/fondo-precios.webp` | 1280×1600 |
| `images/fondo-visita.webp` | 1200×1500 |
| `images/icon-192.png` | 192×192 |
| `images/icon-32.png` | 32×32 |
| `images/local-calle-bk.webp` | 96×52 |
| `images/local-calle.webp` | 1170×636 |
| `images/local-cartel-calle.webp` | 960×1198 |
| `images/local-frente.webp` | 1440×929 |
| `images/logo-claro.webp` | 600×239 |
| `images/logo.webp` | 600×239 |
| `images/nosotros-local.webp` | 960×1200 |
| `images/poster-ambiente.webp` | 480×854 |
| `images/poster-recorrido-bk.webp` | 54×96 |
| `images/poster-recorrido.webp` | 480×854 |

Videos: `video/ambiente.mp4` (banda/equipo) y `video/recorrido.mp4` (recorrido del local, vertical). Hoy son clips vacíos de 2 s: reemplazar o quitar el bloque. Mantenerlos bajo ~3 MB (H.264, sin audio, `-movflags +faststart`).

## 5. Mantenerlo vivo
Si Chita publica seguido, el sitio se desactualiza rápido. Definir **quién** carga las unidades nuevas y retira las vendidas (cada alta: foto → `make-images` → `STOCK` → `prerender` → `test` → commit). Con GitHub Pages cada commit publica solo.
