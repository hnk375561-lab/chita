// Diagnóstico de los 3 enlaces ancla que fallan. Uso:  node scripts/debug-anchors.mjs   (agregá --headed para verlo)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const { chromium } = await import('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.normalize(path.join(root, p)); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('no'); } res.writeHead(200, { 'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r)); const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
const CASES = [
  ['Ver unidades publicadas', 'a.fr-act[href="#unidades"]', 'unidades'],
  ['Ver en el mapa', 'a.lk[href="#contacto"]', 'contacto'],
  ['Cómo llegar', 'a.btn[href="#contacto"]', 'contacto'],
];
for (const mode of ['clic real (Playwright)', 'clic por código (el.click())']) {
  console.log(`\n=== ${mode} ===`);
  for (const [name, sel, id] of CASES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route((u) => !['127.0.0.1', 'localhost'].includes(u.hostname), (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
    const pg = await ctx.newPage();
    await pg.addInitScript(() => { window.__log = []; window.addEventListener('click', (e) => window.__log.push('click en <' + (e.target.closest('a')?.className || e.target.tagName) + '> defaultPrevented=' + e.defaultPrevented)); });
    await pg.goto(`${BASE}/index.html`, { waitUntil: 'load' }); await pg.waitForTimeout(2500);
    // bajar hasta el enlace con la rueda del mouse (como un usuario)
    const loc = pg.locator(sel).first();
    if (!(await loc.count())) { console.log(`- ${name}: NO existe el selector ${sel}`); await ctx.close(); continue; }
    const absTop = await loc.evaluate((e) => e.getBoundingClientRect().top + scrollY);
    const dest = await pg.evaluate((i) => { const e = document.getElementById(i); return e.getBoundingClientRect().top + scrollY; }, id);
    for (let i = 0; i < 80; i++) { const y = await pg.evaluate(() => scrollY); if (Math.abs(y - (absTop - 400)) < 300) break; await pg.mouse.move(700, 450); await pg.mouse.wheel(0, y < absTop - 400 ? 600 : -600); await pg.waitForTimeout(80); }
    await pg.waitForTimeout(1200);
    const before = await pg.evaluate(() => Math.round(scrollY)); const vis = await loc.isVisible();
    if (mode.startsWith('clic real')) await loc.click({ timeout: 3000 }).catch((e) => console.log('   (click real falló: ' + e.message.split('\n')[0] + ')')); else await loc.evaluate((e) => e.click());
    const samples = []; for (let t = 0; t < 16; t++) { await pg.waitForTimeout(250); samples.push(await pg.evaluate(() => Math.round(scrollY))); }
    const info = await pg.evaluate(() => ({ hash: location.hash, log: window.__log.slice(-3), lenis: window.chitaScroll ? { stopped: window.chitaScroll.lenis.isStopped, locked: window.chitaScroll.lenis.isLocked, scrolling: window.chitaScroll.lenis.isScrolling } : null }));
    const llegó = Math.abs(samples[samples.length - 1] - dest) < 200;
    console.log(`- ${name}: visible=${vis} | scroll antes=${before} destino≈${Math.round(dest)} | después: ${samples.join(' → ')}\n    ${llegó ? '✔ LLEGÓ' : '✖ NO LLEGÓ'} · ${JSON.stringify(info)}`);
    await pg.screenshot({ path: path.join(root, `debug-${name.replace(/\W+/g, '_')}-${mode.startsWith('clic real') ? 'real' : 'codigo'}.png`) });
    await ctx.close();
  }
}
await browser.close(); server.close();
