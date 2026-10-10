// Deja el repo en modo DEMO de forma idempotente (se puede correr más de una vez).
// Uso (desde la raíz):  node scripts/aplicar-demo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(root, f), s);
const log = [];
function reemplazar(file, de, a, etiqueta) {
  const s = rd(file);
  if (s.includes(a)) { log.push(`= ya aplicado: ${etiqueta}`); return; }
  const n = s.split(de).length - 1;
  if (n !== 1) throw new Error(`${file}: "${etiqueta}" esperaba 1 coincidencia y hay ${n}`);
  wr(file, s.replace(de, () => a)); log.push(`+ ${etiqueta}`);
}

// 1) Reseñas: una sola cifra (la de data/dealership.json).
const d = JSON.parse(rd('data/dealership.json'));
const n = d.reputation.google.count;
reemplazar('index.html', '<p class="rv2-count"><b>45</b>', `<p class="rv2-count"><b>${n}</b>`, `reseñas ${n} en la sección de opiniones`);

// 2) Aviso de demo en el pie.
const pie = '<p>© 2026 Chita Automotores · Concepción del Uruguay, Entre Ríos</p>';
const nota = '<p class="demo-note" data-demo-note>Propuesta de diseño para revisión del dueño · No es el sitio oficial · Datos pendientes de confirmación</p>';
reemplazar('index.html', pie, pie + nota, 'aviso de demo en el pie');
if (!rd('css/chita-v67.css').includes('.demo-note')) {
  fs.appendFileSync(path.join(root, 'css/chita-v67.css'), '\n/* Aviso de demo (se elimina al pasar a producción) */\n.demo-note{margin:10px 0 0;font:600 12px/1.4 var(--font-body,system-ui);letter-spacing:.02em;opacity:.8}\n');
  log.push('+ estilo .demo-note en css/chita-v67.css');
} else log.push('= ya aplicado: estilo .demo-note');

// 3) Estado de publicación: demo.
reemplazar('data/dealership.json', '"status": "official",', '"status": "demo",', 'publicacion.status = demo');
reemplazar('data/dealership.json', '"official": true,', '"official": false,', 'publicacion.official = false');

// 4) Validador: modo demo (npm test) y puerta de salida (--prod).
const v = 'scripts/validate-dealership.mjs';
reemplazar(v, "const d = JSON.parse(fs.readFileSync(path.join(root, 'data/dealership.json'), 'utf8'));",
  "const PROD = process.argv.includes('--prod'); // sin flag = modo DEMO (npm test); con --prod = puerta de salida\nconst d = JSON.parse(fs.readFileSync(path.join(root, 'data/dealership.json'), 'utf8'));", 'flag --prod');
reemplazar(v, "if (d.publicacion.official !== true) errors.push('publicacion.official debe ser true');",
  "if (PROD && d.publicacion.official !== true) errors.push('publicacion.official debe ser true (modo producción)');", 'official solo en prod');
reemplazar(v, 'if (/\\b(demo|propuesta|prototipo|preview)\\b/i.test(', 'if (PROD && /\\b(demo|propuesta|prototipo|preview)\\b/i.test(', 'lenguaje de demo prohibido solo en prod');
const bloque = `// Reseñas: todo "N reseñas" del HTML debe coincidir con data/dealership.json.
{
  const gCount = d.reputation && d.reputation.google && d.reputation.google.count;
  for (const m of html.matchAll(/(?:<b>)?(\\d+)(?:<\\/b>)?\\s+reseñas/g)) if (Number(m[1]) !== gCount) errors.push(\`index.html dice \${m[1]} reseñas y data/dealership.json dice \${gCount}\`);
}
// Aviso de demo: obligatorio en modo demo, prohibido en producción.
if (!PROD && !/data-demo-note/.test(html)) errors.push('index.html: falta el aviso de demo (data-demo-note en el pie)');
// Puerta de salida: node scripts/validate-dealership.mjs --prod
if (PROD) {
  const bare = indexHtml.replace(/<script[\\s\\S]*?<\\/script>|<style[\\s\\S]*?<\\/style>/g, '');
  if (d.publicacion.publicIndexing !== true) errors.push('PROD: publicacion.publicIndexing sigue en false');
  if (!d.contact.whatsApp) errors.push('PROD: falta el WhatsApp');
  if (/google-maps/.test(String(d.hours.status))) errors.push('PROD: horarios sin confirmación del dueño (status: ' + d.hours.status + ')');
  if (!(d.photos && d.photos.authorized === true)) errors.push('PROD: falta photos.authorized = true (autorización de fotos y videos)');
  if (/data-demo-note/.test(html)) errors.push('PROD: quitar el aviso de demo del pie');
  if (/\\bEJEMPLO\\b/.test(bare) || /\\b(a confirmar|a cargar)\\b/i.test(bare)) errors.push('PROD: quedan textos "EJEMPLO / a confirmar / a cargar" en index.html');
}
`;
const cierre = "if (errors.length) { console.error(errors.map((e) => 'ERROR: ' + e).join('\\n')); process.exit(1); }";
if (rd(v).includes('// Puerta de salida: node scripts/validate-dealership.mjs --prod')) log.push('= ya aplicado: bloques de reseñas, aviso y puerta de salida');
else reemplazar(v, cierre, bloque + cierre, 'bloques de reseñas, aviso y puerta de salida');

console.log(log.join('\n'));
