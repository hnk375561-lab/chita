// Aplica data/pendientes.json al repo. Solo archivos locales, sin red. Idempotente.
// Uso: node scripts/aplicar-pendientes.mjs [--dry] [--produccion]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');
const prod = process.argv.includes('--produccion');
const P = (f) => path.join(root, f);
const read = (f) => fs.readFileSync(P(f), 'utf8');
const log = []; const errs = [];
const write = (f, s) => { if (read(f) === s) return; log.push('modifica ' + f); if (!dry) fs.writeFileSync(P(f), s); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const given = (v) => v !== null && v !== undefined && v !== '';

const p = JSON.parse(read('data/pendientes.json'));
const d = JSON.parse(read('data/dealership.json'));

// 1. Contacto e identidad -> dealership.json + privacidad.html
const email = p.contacto?.email, rs = p.identidad?.razonSocial, cuit = p.identidad?.cuit, dom = p.identidad?.domicilioLegal;
if (given(email)) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('email inválido'); else d.contact.email = email; }
if (given(rs)) d.identity.legalName = rs;
if (given(cuit)) { if (!/^\d{2}-\d{8}-\d$/.test(cuit)) errs.push('CUIT con formato inválido (XX-XXXXXXXX-X)'); else { d.identity.cuit = cuit; d.identity.cuitConfirmed = true; } }
if (given(dom)) d.identity.legalAddress = dom;
if (p.fotos && typeof p.fotos.autorizadas === 'boolean') { d.photos = { ...(d.photos || {}), authorized: p.fotos.autorizadas }; }

if (given(email) || given(rs) || given(cuit) || given(dom)) {
  let h = read('privacidad.html');
  const re = /<p><strong>Responsable\.<\/strong>[\s\S]*?<\/p>/;
  if (!re.test(h)) errs.push('privacidad.html: no encontré el párrafo "Responsable."');
  else {
    const nombre = d.identity.legalName || 'Chita Automotores';
    const partes = [`<strong>Responsable.</strong> ${esc(nombre)}`];
    if (d.identity.cuit) partes.push(`CUIT ${esc(d.identity.cuit)}`);
    partes.push(`${esc(d.identity.legalAddress || 'Gral. Galarza 1712, Concepción del Uruguay, Entre Ríos')}`);
    partes.push(`Tel. 03442 44-2782`);
    if (d.contact.email) partes.push(`Email: <a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a>`);
    h = h.replace(re, `<p>${partes.join('. ')}.</p>`);
    write('privacidad.html', h);
  }
}

// 2. Fichas -> bloque STOCK de index.html (una unidad por línea)
let idx = read('index.html');
for (const v of p.vehiculos || []) {
  const lines = idx.split('\n'); let hit = false;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes(`titulo:"${v.titulo}"`)) continue;
    hit = true; let L = lines[i];
    if (given(v.anio)) { if (!Number.isInteger(v.anio) || v.anio < 1990 || v.anio > 2027) { errs.push(`${v.titulo}: año inválido`); continue; } L = L.replace(/anio:\d+/, `anio:${v.anio}`); }
    if (given(v.km)) { if (!/^\d{1,3}(\.\d{3})* km$/.test(v.km)) { errs.push(`${v.titulo}: km debe ser como "85.000 km"`); continue; }
      L = /km:"[^"]*"/.test(L) ? L.replace(/km:"[^"]*"/, `km:"${v.km}"`) : L.replace(/(anio:\d+,?)/, `$1 km:"${v.km}",`); }
    if (given(v.precio)) L = L.replace(/precio:"[^"]*"/, `precio:"${String(v.precio).replace(/"/g, '')}"`);
    if (given(v.estado)) { if (!['disponible', 'reservado', 'vendido'].includes(v.estado)) { errs.push(`${v.titulo}: estado inválido`); continue; }
      L = /estado:"[^"]*"/.test(L) ? L.replace(/estado:"[^"]*"/, `estado:"${v.estado}"`) : L.replace(/precio:"[^"]*"/, (m) => `${m}, estado:"${v.estado}"`); }
    lines[i] = L;
  }
  if (!hit) errs.push(`index.html: no hay una ficha con titulo "${v.titulo}"`);
  idx = lines.join('\n');
}
write('index.html', idx);

// 2b. Registro de fuente en data/vehicles.json (queda como "confirmado por el dueño")
const reg = JSON.parse(read('data/vehicles.json'));
for (const v of p.vehiculos || []) {
  if (!given(v.anio) && !given(v.km)) continue;
  let r = reg.vehicles.find((x) => x.stockTitle === v.titulo);
  if (!r) { r = { id: v.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), stockTitle: v.titulo, sourceUrls: [], published: true }; reg.vehicles.push(r); }
  if (given(v.anio)) r.year = v.anio;
  if (given(v.km)) { r.km = v.km; r.kmStatus = 'owner-confirmed'; }
  r.confidence = 'confirmado por el dueño'; r.ownerConfirmedAt = new Date().toISOString().slice(0, 10);
}
if (!errs.length) write('data/vehicles.json', JSON.stringify(reg, null, 2) + '\n');

// 3. Producción (solo con --produccion): dominio, indexación, robots, sitemap
if (prod) {
  const pr = p.produccion || {}; const OLD = 'https://hnk375561-lab.github.io/chita/';
  if (pr.confirmar !== true) errs.push('produccion.confirmar debe ser true');
  if (!/^https:\/\/[^\s/]+$/.test(pr.dominio || '')) errs.push('produccion.dominio debe ser https://dominio (sin barra final)');
  if (d.photos?.authorized !== true) errs.push('photos.authorized no es true');
  if (!d.contact.email || !d.identity.legalName) errs.push('faltan email o razón social');
  if (!errs.length) {
    const nuevo = pr.dominio + '/';
    for (const f of ['index.html', 'reserva.html', 'privacidad.html', '404.html']) {
      let h = f === 'index.html' ? idx : read(f);
      h = h.split(OLD).join(nuevo).replace(/<meta[^>]*name="robots"[^>]*noindex[^>]*>\s*\n?/gi, '');
      write(f, h);
    }
    write('sitemap.xml', read('sitemap.xml').split(OLD).join(nuevo));
    write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${nuevo}sitemap.xml\n`);
    d.publicacion.publicIndexing = true;
  }
}

if (errs.length) { console.error('ERRORES (no se escribió nada de dealership.json):\n - ' + errs.join('\n - ')); process.exit(1); }
write('data/dealership.json', JSON.stringify(d, null, 2) + '\n');
console.log((dry ? '[SIMULACIÓN] ' : '') + (log.length ? log.join('\n') : 'sin cambios'));
