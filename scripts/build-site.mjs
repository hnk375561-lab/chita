// Arma _site/ con SOLO lo público. Lo usa .github/workflows/pages.yml.
// Uso: node scripts/build-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');

// Lista blanca: lo que no está acá no se publica (golive/, data/, docs/, scripts/, notas, viaje.html…).
const FILES = ['index.html', '404.html', 'privacidad.html', 'reserva.html', 'og-chita.png', 'site.webmanifest', 'robots.txt', 'sitemap.xml'];
const DIRS = ['css', 'js', 'fonts', 'images', 'assets', 'video'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const f of FILES) {
  if (!fs.existsSync(path.join(root, f))) throw new Error('Falta archivo público: ' + f);
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
for (const d of DIRS) {
  if (!fs.existsSync(path.join(root, d))) throw new Error('Falta carpeta pública: ' + d);
  fs.cpSync(path.join(root, d), path.join(out, d), { recursive: true });
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('_site listo:', [...FILES, ...DIRS.map((d) => d + '/')].join(', '));
