// CHITA · medición de rendimiento real de la home (solo lee, no modifica el sitio).
//
//   node scripts/perf-baseline.mjs
//
// Mide en dos perfiles (escritorio sin límites y móvil con red lenta + CPU 4× más lenta, parecido a Lighthouse):
//   · bytes realmente descargados hasta el evento "load" y 8 s después (ahí se ve cuánto baja el video del hero)
//   · LCP, CLS y tiempo bloqueado por tareas largas
//   · los 10 recursos más pesados
// Usa Chrome o Edge instalados (el Chromium de Playwright no reproduce H.264, y el video del hero es H.264).
// Guarda el resultado en perf-report.json
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Falta Playwright: corré  npm install  y  npx playwright install chromium'); process.exit(2); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };

/* servidor estático con gzip y soporte de Range (el video lo necesita), parecido a GitHub Pages */
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  const ext = path.extname(file).toLowerCase(), type = MIME[ext] || 'application/octet-stream', size = fs.statSync(file).size;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && ext === '.mp4') {
    const start = range[1] ? +range[1] : 0, end = range[2] ? Math.min(+range[2], size - 1) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res); return;
  }
  const comprimible = ['.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest', '.txt'].includes(ext) && /gzip/.test(req.headers['accept-encoding'] || '');
  if (comprimible) { res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip' }); fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res); return; }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': ext === '.mp4' ? 'bytes' : 'none' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

let browser, motor = '';
for (const channel of ['chrome', 'msedge', null]) {
  try { browser = await chromium.launch(channel ? { channel } : {}); motor = channel || 'chromium de Playwright (SIN H.264: el video del hero no se mide bien)'; break; } catch { /* siguiente */ }
}
if (!browser) { console.error('No pude abrir ningún navegador.'); server.close(); process.exit(2); }
console.log('Navegador:', motor);

const kb = (n) => (n / 1024).toFixed(0).padStart(7) + ' KB';
const PERFILES = [
  { nombre: 'ESCRITORIO (sin límites)', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, cpu: 1, red: null },
  { nombre: 'MÓVIL (4G lenta, CPU 4×)', ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    cpu: 4, red: { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 } },
];

const informe = {};
for (const perfil of PERFILES) {
  const context = await browser.newContext(perfil.ctx);
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__m = { lcp: 0, cls: 0, tbt: 0 };
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true }); } catch {}
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  if (perfil.red) await cdp.send('Network.emulateNetworkConditions', perfil.red);
  if (perfil.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: perfil.cpu });

  const info = new Map(), bytes = new Map();
  cdp.on('Network.responseReceived', (e) => info.set(e.requestId, { url: e.response.url, tipo: e.type }));
  cdp.on('Network.loadingFinished', (e) => bytes.set(e.requestId, (bytes.get(e.requestId) || 0) + e.encodedDataLength));
  const total = () => [...bytes.values()].reduce((a, b) => a + b, 0);

  let alLoad = 0;
  page.on('load', () => { alLoad = total(); });
  await page.goto(base + '/index.html', { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(8000);
  const m = await page.evaluate(() => window.__m);

  const porTipo = {}, porUrl = new Map();
  for (const [id, b] of bytes) { const i = info.get(id); if (!i) continue; porTipo[i.tipo] = (porTipo[i.tipo] || 0) + b; porUrl.set(i.url.replace(base + '/', ''), (porUrl.get(i.url.replace(base + '/', '')) || 0) + b); }
  const top = [...porUrl.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  console.log(`\n══ ${perfil.nombre} ══`);
  console.log(`Descargado hasta "load": ${kb(alLoad)}    a los 8 s: ${kb(total())}`);
  console.log(`LCP: ${Math.round(m.lcp)} ms   CLS: ${m.cls.toFixed(3)}   tiempo bloqueado (tareas largas): ${Math.round(m.tbt)} ms`);
  console.log('Por tipo:', Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([t, b]) => `${t} ${(b / 1024).toFixed(0)}KB`).join(' · '));
  console.log('Top 10 recursos:'); for (const [u, b] of top) console.log('  ' + kb(b) + '  ' + u);
  informe[perfil.nombre] = { bytesAlLoad: alLoad, bytesA8s: total(), lcpMs: Math.round(m.lcp), cls: +m.cls.toFixed(3), tbtMs: Math.round(m.tbt), porTipo, top };
  await context.close();
}
fs.writeFileSync(path.join(root, 'perf-report.json'), JSON.stringify({ navegador: motor, informe }, null, 2));
console.log('\nGuardado: perf-report.json');
await browser.close(); server.close();
