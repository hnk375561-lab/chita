# APLICAR-TODO-v6.md — Chita Automotores

Reemplaza a la v5. **Se aplica por código, con archivos locales, sin fuentes externas**: solo hace falta Node 20+ (sin `npm install`, sin red, sin navegador). Todo lo que el dueño confirme se escribe en **un solo archivo** (`data/pendientes.json`) y un script lo reparte por el repo.

## 1. Cómo se usa

```bash
git pull
# 1) completar data/pendientes.json con lo que el dueño confirmó (lo que quede en null se ignora)
node scripts/aplicar-pendientes.mjs --dry     # simula y lista los archivos que tocaría
node scripts/aplicar-pendientes.mjs           # aplica
npm test                                      # debe decir "válidos y consistentes"
git add -A && git commit -m "Datos confirmados por el dueño" && git push origin main
```

El script es idempotente (una segunda corrida dice `sin cambios`) y, si algún dato es inválido, corta con error **sin escribir `dealership.json`**.

## 2. Qué aplica

| Campo de `data/pendientes.json` | Dónde queda |
|---|---|
| `contacto.email` | `data/dealership.json` (`contact.email`) y párrafo "Responsable" de `privacidad.html` |
| `identidad.razonSocial`, `cuit`, `domicilioLegal` | `data/dealership.json` (`identity.*`, `cuitConfirmed`) y `privacidad.html`. CUIT con formato `XX-XXXXXXXX-X` |
| `fotos.autorizadas` (`true`/`false`) | `data/dealership.json` → `photos.authorized` |
| `vehiculos[]` (`titulo`, `anio`, `km`, `precio`, `estado`) | Ficha en el bloque `STOCK` de `index.html` **y** registro en `data/vehicles.json` (`kmStatus: owner-confirmed`). Cubre las 7 fichas sin fuente y el km del Palio (resuelve el conflicto 128.000 / 120.000) |
| `produccion` + `--produccion` | Ver sección 3 |

Formatos: `km` como `"85.000 km"`, `anio` entero, `estado` = `disponible` \| `reservado` \| `vendido`, `titulo` idéntico al de la ficha (p. ej. `"Kia K3 EX Cross 1.6N"`). Un título que no existe da error.

Ejemplo (Palio y Kangoo):
```json
"vehiculos": [
  { "titulo": "Fiat Palio Attractive 1.4N", "km": "120.000 km" },
  { "titulo": "Renault Kangoo Comfort 1.6N", "anio": 2022, "km": "87.000 km", "precio": "Consultar" }
]
```

## 3. Paso a producción (un comando)

Se completa en `data/pendientes.json`: `"produccion": { "dominio": "https://tu-dominio.com.ar", "confirmar": true }` (sin barra final), más email, razón social y `fotos.autorizadas: true`. Después:

```bash
node scripts/aplicar-pendientes.mjs --dry --produccion
node scripts/aplicar-pendientes.mjs --produccion
npm test && npm run test:prod                 # los dos deben dar válido
```

Hace, en una sola pasada: reemplaza `hnk375561-lab.github.io/chita/` por el dominio en `index.html`, `reserva.html`, `privacidad.html`, `404.html` y `sitemap.xml`; quita los `noindex`; reescribe `robots.txt` con `Allow: /` y `Sitemap:`; y pone `publicIndexing: true`. **Se niega a correr** si falta `confirmar: true`, un dominio `https://…`, la autorización de fotos, el email o la razón social.

## 4. Verificado en esta revisión (todo con archivos locales)

- Con datos de ejemplo cargados: `npm test` y `npm run test:prod` dan verde; segunda corrida `sin cambios`; los 11 JS pasan `node --check`.
- Con la plantilla vacía (como queda en `main`): el script no cambia nada, `npm test` pasa y `npm run test:prod` sigue fallando a propósito.
- Un título inexistente, un CUIT mal formado o un km con otro formato cortan con error.
- Cambio en `scripts/validate-dealership.mjs`: antes exigía `cuit === null` siempre; ahora acepta un CUIT si viene con `cuitConfirmed: true` (lo marca el script). El resto de las reglas no cambió.

## 5. Lo que ningún código puede hacer (queda fuera del script)

1. **Revocar el token** de GitHub (Settings → Developer settings → Personal access tokens → Revoke). Tiene permiso de escritura sobre `main` y se compartió en un chat.
2. **Mirar el sitio en un navegador real** y en un celular: se necesita un navegador, no hay chequeo local que lo reemplace. Lista de qué mirar en la v5, sección 2.3.
3. **Que el dueño conteste**: los datos de la sección 2 salen de él; el script no inventa ninguno.
4. **Fotos de "Entregas"** (rostros y patentes): publicar exige su autorización o editar las imágenes; no se automatiza.
5. **Lunes habitual** (opcional): cambia texto en `index.html`, `NEGOCIO.horarios`, `hours.display` y JSON-LD; hoy es edición manual porque depende de la respuesta del dueño y toca varios lugares a la vez.

## 6. Decisiones que se mantienen (de la v5)
Repo público; horario de Google Maps marcado como verificado y sin decir "según Google" en el sitio; `assets/` no se limpia a mano; widget de 45 casillas oculto; sin `aggregateRating`; mientras sea demo, `noindex, nofollow` y `Disallow: /`.
