// Muestra qué cambiaría el paso a producción SIN aplicar nada (solo modo --dry).
// Uso: node scripts/golive.mjs --dry --domain=https://www.ejemplo.com.ar
// Ver golive/PRODUCCION.md. No ejecutar el paso real hasta tener dominio y autorización de fotos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (!args.includes('--dry')) { console.error('Solo existe el modo --dry (no aplica cambios). Uso: npm run golive -- --dry --domain=https://tu-dominio/'); process.exit(2); }
const dom = ((args.find((a) => a.startsWith('--domain=')) || '').slice(9) || 'https://DOMINIO-DEFINITIVO').replace(/\/+$/, '') + '/';
const OLD = 'https://hnk375561-lab.github.io/chita/';
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const out = [];
const note = (f, m) => out.push(`  ${f.padEnd(22)} ${m}`);
for (const f of ['index.html', 'reserva.html', 'privacidad.html', '404.html']) {
  const h = read(f);
  const n = (h.match(/<meta[^>]*name="robots"[^>]*noindex[^>]*>/gi) || []).length;
  if (n) note(f, `quitar ${n} meta robots con noindex`);
  const g = h.split(OLD).length - 1;
  if (g) note(f, `reemplazar ${g} ocurrencia(s) de ${OLD} por ${dom}`);
}
note('robots.txt', 'reemplazar "Disallow: /" por "Allow: /" y agregar "Sitemap: ' + dom + 'sitemap.xml"');
const s = read('sitemap.xml').split(OLD).length - 1;
note('sitemap.xml', `reemplazar ${s} URL(s) de github.io por ${dom}`);
note('data/dealership.json', 'publicacion.publicIndexing -> true (y photos.authorized -> true con autorización escrita)');
note('scripts/validate-dealership.mjs', 'invertir los chequeos de noindex/Disallow que exige npm test en modo demo');
note('privacidad.html', 'completar Responsable (razón social, domicilio legal, email) y hacerla revisar por un profesional');
console.log(`Paso a producción (SIMULACIÓN, no se escribió nada) · dominio: ${dom}\n${out.join('\n')}\n\nDespués: npm test · npm run test:prod · npm run check:all · revisar en celular.`);
