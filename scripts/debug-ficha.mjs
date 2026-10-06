// CHITA · diagnóstico del aviso «Ver ficha completa … el enlace no tiene tamaño».
// Solo lee y mide: no modifica nada del sitio.
//
//   node scripts/debug-ficha.mjs
//
// Imprime una tabla con CADA enlace "Ver ficha completa" (tamaño, si se ve, y dentro de qué bloque está)
// y guarda capturas en  debug-ficha/  (unidades.png y modelos.png).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Falta Playwright: corré  npm install  y  npx playwright install chromium'); process.exit(2); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'debug-ficha');
fs.mkdirSync(out, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const medir = () => page.evaluate(() => [...document.querySelectorAll('a')]
    .filter((a) => /Ver ficha completa/i.test(a.textContent))
    .map((a, i) => {
      const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
      const ruta = []; let e = a;
      while (e && e !== document.body && ruta.length < 5) {
        ruta.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (e.hidden ? '[hidden]' : ''));
        e = e.parentElement;
      }
      return { n: i + 1, href: a.getAttribute('href'), ancho: Math.round(r.width), alto: Math.round(r.height), display: cs.display, visibility: cs.visibility, dentro_de: ruta.join(' < ') };
    }));

  console.log('\n── Al cargar la página ──'); console.table(await medir());

  // el índice #modelos cambia su vista previa al pasar el mouse: se mide de nuevo tras tocar una fila
  const fila = page.locator('#mdl > *').nth(1);
  if (await fila.count()) { await fila.scrollIntoViewIfNeeded().catch(() => {}); await fila.hover().catch(() => {}); await page.waitForTimeout(1200); }
  console.log('── Después de pasar el mouse por una fila del índice #modelos ──'); console.table(await medir());

  for (const [sel, nombre] of [['#unidades', 'unidades.png'], ['#modelos', 'modelos.png']]) {
    try { await page.locator(sel).first().screenshot({ path: path.join(out, nombre) }); console.log('captura:', path.join('debug-ficha', nombre)); }
    catch (e) { console.log('no se pudo capturar', sel, '·', String(e.message).split('\n')[0]); }
  }
} finally { await browser.close(); server.close(); }
