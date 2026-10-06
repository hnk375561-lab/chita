// Arma _site/ con SOLO lo público. Lo usa .github/workflows/pages.yml.
// Uso: node scripts/build-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
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
// T15 · no publicar restos históricos que no tienen ninguna referencia en el sitio actual.
for (const unused of ['js/nosotros.js', 'video/recorrido.mp4', 'images/cartel-chita.webp']) {
  const target = path.join(out, unused);
  if (fs.existsSync(target)) fs.rmSync(target);
}


// ── T2 · Rendimiento (solo en _site; el código fuente queda igual) ─────────────────────────────
const ESBUILD = ['--yes', 'esbuild@0.28.2'];
const esb = (args, input) => execFileSync('npx', [...ESBUILD, ...args], { input, maxBuffer: 64 * 1024 * 1024 }).toString();

// 1) Los 8 CSS de index.html, en el MISMO orden, en un solo archivo minificado.
const CSS = ['site', 'motion', 'identidad', 'comparador', 'chita-v54', 'resenas-compra', 'chita-v55', 'chita-v56'];
const idxPath = path.join(out, 'index.html');
let html = fs.readFileSync(idxPath, 'utf8');
const linkOf = (n) => `<link rel="stylesheet" href="css/${n}.css">`;
const found = CSS.map((n) => html.indexOf(linkOf(n)));
if (found.some((i) => i < 0) || found.some((v, i) => i && v < found[i - 1])) throw new Error('index.html: los <link> de CSS no están (todos) o cambió su orden; revisar CSS en build-site.mjs');
const bundle = CSS.map((n) => fs.readFileSync(path.join(root, 'css', n + '.css'), 'utf8')).join('\n');
const minCss = esb(['--loader=css', '--minify'], bundle);
fs.writeFileSync(path.join(out, 'css/chita.min.css'), minCss);
CSS.forEach((n, i) => { html = html.replace(linkOf(n) + '\n', i === 0 ? linkOf('chita.min') + '\n' : '').replace(linkOf(n), i === 0 ? linkOf('chita.min') : ''); });
fs.writeFileSync(idxPath, html);

// 2) JS propio minificado (espacios y sintaxis; sin renombrar variables). vendor/ ya viene minificado.
const JS = ['js/app.js', 'js/identidad.js', 'js/recorrido.js', 'js/reserva.js', 'js/motion.js', 'js/motion/core.js'];
for (const f of JS) fs.writeFileSync(path.join(out, f), esb(['--minify-whitespace', '--minify-syntax', '--legal-comments=none'], fs.readFileSync(path.join(root, f), 'utf8')));
console.log('CSS:', (bundle.length / 1024).toFixed(0), 'KB →', (minCss.length / 1024).toFixed(0), 'KB (1 archivo)');
console.log('_site listo:', [...FILES, ...DIRS.map((d) => d + '/')].join(', '));
