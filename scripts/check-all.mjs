// CHITA · verificación total: links, redirecciones, tarjetas, botones, clicks y flujo de reserva, en desktop y móvil.
//
//   Primera vez:   npm install   y   npx playwright install chromium
//   Cada vez:      npm run check:all
//
// Opciones:  --desktop | --mobile  (solo un tamaño)   --no-external (no prueba sitios externos por red)
//            --headed (muestra el navegador)          --slow (más espera por click, para PCs lentas)
// Resultado: resumen en pantalla + check-report/reporte.json + capturas de cada falla en check-report/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('\nFalta Playwright. Corré primero:\n   npm install\n   npx playwright install chromium\n'); process.exit(2); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const D = JSON.parse(fs.readFileSync(path.join(root, 'data/dealership.json'), 'utf8'));
const EXPECT = {
  wa: D.contact.whatsApp,
  tels: [D.contact.phoneTel, D.contact.gestoriaPhoneTel].filter(Boolean),
  maps: [D.location.mapsPlaceUrl, D.location.mapsReviewsUrl].filter(Boolean),
  instagram: D.contact.instagram, facebook: D.contact.facebook,
};
const PAGES = ['index.html', 'reserva.html', 'privacidad.html'].filter((f) => fs.existsSync(path.join(root, f)));
const outDir = path.join(root, 'check-report');
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
const slow = args.has('--slow') ? 2 : 1;

/* ───────── servidor estático local (nadie tiene que levantar nada) ───────── */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const nf = path.join(root, '404.html'); res.writeHead(404, { 'content-type': MIME['.html'] });
    return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'No encontrado');
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

/* ───────── registro de resultados ───────── */
const results = []; let shotN = 0;
const log = (vp, page, area, status, msg, extra) => { results.push({ vp, page, area, status, msg, ...(extra || {}) }); };
const ok = (vp, page, area, msg) => log(vp, page, area, 'ok', msg);
const warn = (vp, page, area, msg) => log(vp, page, area, 'warn', msg);
async function fail(pg, vp, page, area, msg) {
  let shot; try { shot = `falla-${String(++shotN).padStart(3, '0')}-${vp}-${page.replace(/\W+/g, '_')}.png`; await pg.screenshot({ path: path.join(outDir, shot) }); } catch { shot = undefined; }
  log(vp, page, area, 'fail', msg, { captura: shot });
}
const sameUrl = (a, b) => { try { return new URL(a).href === new URL(b).href; } catch { return a === b; } };
const label = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 50) || '(icono)';

/* ───────── validación de formato de cada enlace (sin navegar) ───────── */
async function validateHref(vp, page, a) {
  const { href, text, target, rel } = a, where = `«${label(text)}»`;
  if (target === '_blank' && !/noopener/.test(rel || '')) warn(vp, page, 'seguridad', `${where} abre pestaña nueva sin rel="noopener"`);
  if (href.startsWith('tel:')) return EXPECT.tels.includes(href.slice(4)) ? ok(vp, page, 'teléfono', `${where} → ${href}`) : log(vp, page, 'teléfono', 'fail', `${where} apunta a ${href} (esperado ${EXPECT.tels.join(' o ')})`);
  if (/^https:\/\/wa\.me\//.test(href)) {
    const num = href.slice(14).split('?')[0], share = num === '';
    if (!share && num !== EXPECT.wa) return log(vp, page, 'whatsapp', 'fail', `${where} usa el número ${num} (esperado ${EXPECT.wa})`);
    try { decodeURIComponent((href.split('text=')[1] || '').replace(/\+/g, ' ')); } catch { return log(vp, page, 'whatsapp', 'fail', `${where} tiene el texto mal codificado`); }
    return ok(vp, page, 'whatsapp', `${where} → ${share ? 'compartir' : EXPECT.wa}`);
  }
  if (/google\.com\/maps/.test(href)) return EXPECT.maps.some((m) => sameUrl(m, href)) ? ok(vp, page, 'mapa', `${where} → ficha oficial de Maps`) : log(vp, page, 'mapa', 'fail', `${where} NO apunta a la ficha oficial: ${href.slice(0, 100)}`);
  if (/waze\.com/.test(href)) return ok(vp, page, 'mapa', `${where} → Waze`);
  if (/instagram\.com/.test(href)) return href.includes(EXPECT.instagram) || /\/(reel|p)\//.test(href) || href === 'https://www.instagram.com/' ? ok(vp, page, 'redes', `${where} → Instagram`) : log(vp, page, 'redes', 'fail', `${where} Instagram distinto de @${EXPECT.instagram}: ${href}`);
  if (/facebook\.com/.test(href)) return ok(vp, page, 'redes', `${where} → Facebook`);
}

/* ───────── prueba de una página en un viewport ───────── */
async function testPage(browser, vp, vpOpts, page) {
  const context = await browser.newContext(vpOpts); const isMobile = !!vpOpts.isMobile;
  await context.route((u) => !['127.0.0.1', 'localhost'].includes(u.hostname), (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>externo</title>ok' }));
  const pg = await context.newPage(); const errs = [], bad = [];
  /* los clicks a sitios externos se registran (href final tras los handlers del sitio) y se frenan: no hace falta salir y volver a cargar */
  await pg.addInitScript(() => { window.__ext = null; window.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (a && a.origin !== location.origin && !/^(tel|mailto):/.test(a.protocol)) { window.__ext = a.href; e.preventDefault(); } }); });
  pg.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)); });
  pg.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE) && !r.url().includes('favicon')) bad.push(`${r.status()} ${r.url().replace(BASE, '')}`); });
  const url = `${BASE}/${page}`;
  const resp = await pg.goto(url, { waitUntil: 'load' }).catch((e) => ({ status: () => 0, err: e }));
  await pg.waitForTimeout(1800 * slow);
  if (resp.status() !== 200) { await fail(pg, vp, page, 'carga', `la página responde HTTP ${resp.status()}`); await context.close(); return; }
  ok(vp, page, 'carga', 'carga HTTP 200');

  const tp = (n) => process.env.CHECK_DEBUG && console.log(`\n    [${n}] ${((Date.now() - T0) / 1000).toFixed(0)}s`); const T0 = Date.now();
  /* A · salud: imágenes, desborde horizontal, errores */
  const isScrollable = await pg.evaluate(() => document.documentElement.scrollHeight > innerHeight + 40 && getComputedStyle(document.body).overflow !== 'hidden');
  if (isScrollable) { for (let y = 0; y < 30000; y += 700) { const h = await pg.evaluate((yy) => { scrollTo(0, yy); return document.documentElement.scrollHeight; }, y); await pg.waitForTimeout(60); if (y > h) break; } await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(500); }
  const broken = await pg.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc && !i.closest('[hidden]')).map((i) => i.currentSrc.split('/').slice(-2).join('/')));
  broken.length ? await fail(pg, vp, page, 'imágenes', `${broken.length} imagen(es) rotas: ${broken.slice(0, 4).join(', ')}`) : ok(vp, page, 'imágenes', 'sin imágenes rotas');
  const overflow = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  overflow > 2 ? await fail(pg, vp, page, 'diseño', `scroll horizontal indeseado (+${overflow}px)`) : ok(vp, page, 'diseño', 'sin scroll horizontal');
  bad.length ? await fail(pg, vp, page, 'recursos', `archivos que no cargan: ${[...new Set(bad)].slice(0, 5).join(' · ')}`) : ok(vp, page, 'recursos', 'todos los archivos locales cargan');

  tp('B');
  /* B · inventario y formato de todos los enlaces */
  const links = await pg.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, raw: a.getAttribute('href'), text: a.innerText || a.getAttribute('aria-label') || a.title || '', target: a.target, rel: a.rel })));
  const uniq = new Map(); links.forEach((l) => uniq.set(l.href + '|' + label(l.text), l));
  for (const l of uniq.values()) {
    await validateHref(vp, page, l);
    if (l.raw.startsWith('#') && l.raw.length > 1 && !l.raw.startsWith('#unidad-')) {
      (await pg.evaluate((id) => !!document.getElementById(id), l.raw.slice(1))) ? ok(vp, page, 'anclas', `${l.raw} existe`) : await fail(pg, vp, page, 'anclas', `el enlace ${l.raw} no tiene destino en la página`);
    } else if (l.href.startsWith(BASE) && !l.raw.startsWith('#')) {
      const r = await fetch(l.href.split('#')[0]).catch(() => ({ status: 0 }));
      r.status === 200 ? ok(vp, page, 'páginas', `${l.raw} existe`) : log(vp, page, 'páginas', 'fail', `el enlace «${label(l.text)}» → ${l.raw} da HTTP ${r.status}`);
      if (l.raw.includes('#')) { const html = await (await fetch(l.href.split('#')[0])).text(); const id = l.raw.split('#')[1]; if (!new RegExp(`id=["']${id}["']`).test(html)) log(vp, page, 'anclas', 'fail', `${l.raw}: la página destino no tiene el id #${id}`); }
    }
  }

  tp('C');
  /* C · click real en cada enlace único visible */
  const hasMenu = async () => { if (!isMobile) return; const m = pg.locator('button[aria-label*="enú" i], button[aria-controls*="nav" i], button.burger, .menu-btn, [aria-expanded="false"][aria-controls]').first(); if (await m.count() && await m.isVisible().catch(() => false)) { await m.click({ timeout: 2000 }).catch(() => {}); await pg.waitForTimeout(500); } };
  const seen = new Set(); let clicked = 0, skipped = 0;
  for (const l of uniq.values()) {
    const key = l.href + '|' + label(l.text); if (seen.has(key)) continue; seen.add(key);
    if (l.href.startsWith('tel:') || l.href.startsWith('mailto:')) continue;
    const selHref = l.raw.replace(/"/g, '\\"');
    let loc = pg.locator(`a[href="${selHref}"]`).filter({ hasText: l.text.trim().slice(0, 20) }).first();
    if (!(await loc.count())) loc = pg.locator(`a[href="${selHref}"]`).first();
    if (!(await loc.count())) continue;
    if (!(await loc.isVisible().catch(() => false))) { await hasMenu(); if (!(await loc.isVisible().catch(() => false))) { skipped++; continue; } }
    const isHash = l.raw.startsWith('#'), isExternal = !l.href.startsWith(BASE);
    try {
      if (isHash) {
        /* el sitio usa scroll suave (Lenis): mover la página con scrollTo nativo lo desincroniza y el clic siguiente "no viaja".
           Se usa el propio Lenis, en modo instantáneo, para volver arriba y para poner el enlace a la vista antes de tocarlo. */
        await pg.evaluate(async (sel) => { const L = window.chitaScroll && window.chitaScroll.lenis; if (L) L.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); }, null);
        await pg.waitForTimeout(350);
        const viaLenis = await loc.evaluate((el) => { const L = window.chitaScroll && window.chitaScroll.lenis; if (!L) return false; L.scrollTo(el, { offset: -300, immediate: true, force: true }); return true; }).catch(() => false);
        if (viaLenis) await pg.waitForTimeout(500);
      }
      let realClick = true;
      const doClick = async () => { try { await loc.click({ timeout: 2500 }); } catch (e) { realClick = false; await loc.evaluate((el) => el.click()); } };
      if (isExternal) {
        await pg.evaluate(() => { window.__ext = null; }); await doClick(); await pg.waitForTimeout(150);
        const got = await pg.evaluate(() => window.__ext);
        got && sameUrl(got, l.href) ? ok(vp, page, 'click', `«${label(l.text)}» abre ${new URL(l.href).host}`) : await fail(pg, vp, page, 'click', `«${label(l.text)}» al tocarlo ${got ? 'va a ' + got.slice(0, 90) : 'no navega'} (esperado ${l.href.slice(0, 90)})`);
      } else if (isHash && l.raw.startsWith('#unidad-')) {
        await doClick(); await pg.waitForSelector('dialog[open]', { timeout: 5000 }).then(() => ok(vp, page, 'tarjetas', `«${label(l.text)}» abre la ficha`)).catch(async () => fail(pg, vp, page, 'tarjetas', `«${label(l.text)}» (${l.raw}) no abre la ficha`));
        await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
      } else if (isHash) {
        const id = l.raw.slice(1); await doClick();
        let landed = false; for (let i = 0; i < 24 && !landed; i++) { await pg.waitForTimeout(250); landed = await pg.evaluate((i2) => { if (i2 === 'top') return scrollY < 60; const e = document.getElementById(i2); if (!e) return false; const r = e.getBoundingClientRect(); return r.top <= innerHeight * 0.75 && r.bottom > 90; }, id); }
        if (!landed) { await pg.waitForTimeout(1500 * slow); landed = await pg.evaluate((i2) => { const e = document.getElementById(i2); if (!e) return false; const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 90; }, id); }
        if (landed) ok(vp, page, 'click', `«${label(l.text)}» → ${l.raw}`); else { const dg = await pg.evaluate((i2) => { const e = document.getElementById(i2), r = e && e.getBoundingClientRect(); return JSON.stringify({ scrollY: Math.round(scrollY), destinoTop: r && Math.round(r.top), destinoBottom: r && Math.round(r.bottom), alto: innerHeight, hash: location.hash, lenis: !!window.chitaScroll, dialogAbierto: !!document.querySelector('dialog[open]') }); }, id); await fail(pg, vp, page, 'click', `«${label(l.text)}» (${l.raw}) no lleva a la sección · ${dg}`); }
      } else {
        if (pg.url() !== url) { await pg.goto(url, { waitUntil: 'load' }); await pg.waitForTimeout(800 * slow); }
        await Promise.all([pg.waitForURL((u) => sameUrl(u.href.split('#')[0], l.href.split('#')[0]), { timeout: 8000 }), doClick()]).catch(() => {});
        const okNav = sameUrl(pg.url().split('#')[0], l.href.split('#')[0]);
        okNav ? ok(vp, page, 'click', `«${label(l.text)}» → ${l.raw}`) : await fail(pg, vp, page, 'click', `«${label(l.text)}» terminó en ${pg.url().replace(BASE, '')} en vez de ${l.raw}`);
        await pg.goto(url, { waitUntil: 'load' }); await pg.waitForTimeout(1200 * slow);
      }
      if (!realClick) warn(vp, page, 'click', `«${label(l.text)}» no se pudo tocar con click real (tapado o fuera de pantalla); el destino sí funciona`);
      clicked++;
    } catch (e) { await fail(pg, vp, page, 'click', `«${label(l.text)}» error: ${String(e.message).split('\n')[0].slice(0, 110)}`); if (!pg.url().startsWith(BASE) || pg.isClosed()) { await pg.goto(url); await pg.waitForTimeout(1200 * slow); } }
  }
  ok(vp, page, 'click', `${clicked} enlaces únicos clickeados` + (skipped ? ` · ${skipped} ocultos en este tamaño` : ''));

  tp('D');
  /* D · cada botón visible (menús, carruseles, acordeones, comparador…) */
  if (page === 'index.html') {
    await pg.goto(url); await pg.waitForTimeout(1500 * slow);
    const n = Math.min(await pg.locator('button:visible, [role="button"]:visible, summary:visible').count(), 160); let pressed = 0;
    for (let i = 0; i < n; i++) {
      const b = pg.locator('button:visible, [role="button"]:visible, summary:visible').nth(i); if (!(await b.count())) break;
      const name = label(await b.evaluate((e) => e.innerText || e.getAttribute('aria-label') || e.title || e.className).catch(() => ''));
      const e0 = errs.length;
      try { await b.click({ timeout: 1500 }); pressed++; } catch { await b.evaluate((e) => e.click()).then(() => pressed++).catch(() => {}); }
      await pg.waitForTimeout(220 * slow);
      if (errs.length > e0) await fail(pg, vp, page, 'botones', `«${name}» provoca error de JS: ${errs[errs.length - 1]}`);
      if (await pg.locator('dialog[open]').count()) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); }
      if (!pg.url().startsWith(BASE)) { await pg.goBack().catch(() => pg.goto(url)); await pg.waitForTimeout(800); }
    }
    ok(vp, page, 'botones', `${pressed}/${n} botones probados sin romper la página`);
  }

  tp('E');
  /* E · fichas de unidades: abren, tienen contenido, fotos, WhatsApp correcto y cierran */
  if (page === 'index.html') {
    const hashes = [...new Set(links.map((l) => l.raw).filter((h) => /^#unidad-.+/.test(h)))];
    for (const h of hashes) {
      await pg.goto(`${BASE}/index.html${h}`); await pg.waitForTimeout(1300 * slow);
      const d = await pg.evaluate(() => { const x = document.querySelector('dialog[open]'); if (!x) return null; return { title: (x.querySelector('h1,h2,h3')?.innerText || '').trim(), wa: [...x.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href).filter((h) => !/wa\.me\/\?/.test(h)), imgs: [...x.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length, btns: x.querySelectorAll('button').length }; });
      if (!d) { await fail(pg, vp, page, 'tarjetas', `${h} no abre la ficha`); continue; }
      const probs = []; if (!d.title) probs.push('sin título'); if (!d.wa.length) probs.push('sin botón de WhatsApp'); else if (!d.wa.every((w) => w.includes(EXPECT.wa))) probs.push('WhatsApp con número incorrecto'); if (d.imgs) probs.push(`${d.imgs} foto(s) rota(s)`);
      probs.length ? await fail(pg, vp, page, 'tarjetas', `${h}: ${probs.join(', ')}`) : ok(vp, page, 'tarjetas', `${h} · «${d.title.slice(0, 35)}» completa`);
      for (const bb of await pg.locator('dialog[open] button:visible').all()) { await bb.click({ timeout: 1500 }).catch(() => {}); await pg.waitForTimeout(120); if (!(await pg.locator('dialog[open]').count())) { await pg.goto(`${BASE}/index.html${h}`); await pg.waitForTimeout(900); } }
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
      (await pg.locator('dialog[open]').count()) ? await fail(pg, vp, page, 'tarjetas', `${h}: la ficha no se cierra con Escape`) : 0;
    }
  }

  tp('F');
  /* F · flujo completo de reserva */
  if (page === 'reserva.html') {
    await pg.goto(url); await pg.waitForTimeout(1500 * slow);
    const fits = async (step) => { const r = await pg.evaluate(() => { const s = document.querySelector('.scene:not([hidden])'); return s ? s.scrollHeight - s.clientHeight : 0; }); r > 2 ? await fail(pg, vp, page, 'reserva', `el paso «${step}» necesita scroll (+${r}px)`) : ok(vp, page, 'reserva', `paso «${step}» entra en una pantalla`); };
    try {
      await fits('mes');
      await pg.locator('button.day-cell:not([disabled])').first().click({ timeout: 5000 }); await pg.waitForTimeout(1000 * slow);
      const dayTxt = await pg.locator('#day-number').innerText(); /^\d+$/.test(dayTxt) ? ok(vp, page, 'reserva', `elige el día ${dayTxt}`) : await fail(pg, vp, page, 'reserva', 'la hoja de almanaque no muestra el día'); await fits('día');
      await pg.locator('#to-time').click({ timeout: 4000 }); await pg.waitForTimeout(900 * slow); await fits('franja');
      (await pg.locator('#to-confirm').isDisabled()) ? ok(vp, page, 'reserva', '«Ver resumen» bloqueado hasta elegir franja') : await fail(pg, vp, page, 'reserva', '«Ver resumen» no debería estar activo sin elegir franja');
      await pg.locator('.slot[data-slot="Tarde"]').click(); await pg.locator('#to-confirm').click({ timeout: 4000 }); await pg.waitForTimeout(1500 * slow); await fits('resumen');
      const wa = await pg.locator('#whatsapp').getAttribute('href'), txt = decodeURIComponent((wa.split('text=')[1] || ''));
      wa.startsWith(`https://wa.me/${EXPECT.wa}?text=`) && /tarde/i.test(txt) && new RegExp(`\\b${dayTxt.replace(/^0/, '')}\\b`).test(txt) ? ok(vp, page, 'reserva', 'WhatsApp arma el mensaje con el día y la franja elegidos') : await fail(pg, vp, page, 'reserva', `mensaje de WhatsApp incorrecto: ${txt.slice(0, 90)}`);
      await pg.evaluate(() => { window.__ext = null; }); await pg.locator('#whatsapp').click(); await pg.waitForTimeout(300); const opened = await pg.evaluate(() => window.__ext); opened && opened.startsWith(`https://wa.me/${EXPECT.wa}`) ? ok(vp, page, 'reserva', 'el botón abre wa.me con el número correcto') : await fail(pg, vp, page, 'reserva', `el botón de WhatsApp no abre wa.me (${opened || 'nada'})`);
      (await pg.locator('#send-state').getAttribute('data-state')) === 'pending' ? ok(vp, page, 'reserva', 'tras enviar, el estado pasa a «pendiente de confirmación»') : await fail(pg, vp, page, 'reserva', 'el estado no cambia tras tocar WhatsApp');
      const maps = await pg.locator('a.secondary[href*="maps"]').getAttribute('href'); EXPECT.maps.some((m) => sameUrl(m, maps)) ? ok(vp, page, 'reserva', '«Abrir Maps» → ficha oficial') : await fail(pg, vp, page, 'reserva', '«Abrir Maps» no apunta a la ficha oficial');
      await pg.locator('#back').click(); await pg.waitForTimeout(900 * slow); (await pg.locator('.scene--time').isVisible()) ? ok(vp, page, 'reserva', '«Atrás» vuelve a la franja') : await fail(pg, vp, page, 'reserva', '«Atrás» no vuelve a la franja');
      await pg.locator('#to-confirm').click(); await pg.waitForTimeout(1300 * slow); await pg.locator('#restart').click(); await pg.waitForTimeout(700);
      (await pg.locator('.scene--month').isVisible()) ? ok(vp, page, 'reserva', '«Elegir otro momento» reinicia el calendario') : await fail(pg, vp, page, 'reserva', '«Elegir otro momento» no reinicia');
      await pg.locator('#next-month').click(); await pg.waitForTimeout(200); await pg.locator('#prev-month').click(); ok(vp, page, 'reserva', 'flechas de mes funcionan');
    } catch (e) { await fail(pg, vp, page, 'reserva', `el flujo se cortó: ${String(e.message).split('\n')[0].slice(0, 130)}`); }
  }

  errs.length ? await fail(pg, vp, page, 'errores JS', `${errs.length} error(es) en consola: ${[...new Set(errs)].slice(0, 3).join(' | ')}`) : ok(vp, page, 'errores JS', 'sin errores de JavaScript');
  await context.close();
}

/* ───────── ejecución ───────── */
const VIEWPORTS = [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['móvil', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }],
].filter(([n]) => (args.has('--desktop') ? n === 'desktop' : args.has('--mobile') ? n === 'móvil' : true));

const launchOpts = { headless: !args.has('--headed') }; if (process.env.PW_CHROMIUM) launchOpts.executablePath = process.env.PW_CHROMIUM;
const browser = await chromium.launch(launchOpts).catch((e) => { console.error('\nNo se pudo abrir el navegador. Corré:  npx playwright install chromium\n', e.message.split('\n')[0]); process.exit(2); });
console.log(`\nCHITA · verificación total  (${PAGES.join(', ')} · ${VIEWPORTS.map((v) => v[0]).join(' + ')})\nServidor local: ${BASE}\n`);
for (const [vp, opts] of VIEWPORTS) for (const page of PAGES) { process.stdout.write(`  ▸ ${vp.padEnd(8)} ${page.padEnd(16)}`); const t = Date.now(); const before = results.length; try { await testPage(browser, vp, opts, page); } catch (e) { log(vp, page, 'interno', 'fail', 'el verificador se cortó: ' + String(e.message).split('\n')[0]); } const mine = results.slice(before); console.log(`${((Date.now() - t) / 1000).toFixed(0)}s · ${mine.filter((r) => r.status === 'ok').length} ok · ${mine.filter((r) => r.status === 'warn').length} avisos · ${mine.filter((r) => r.status === 'fail').length} fallas`); }
{ /* 404 real */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const r = await fetch(`${BASE}/esta-pagina-no-existe`); r.status === 404 ? ok('desktop', '404', 'carga', 'una URL inexistente muestra la página 404') : log('desktop', '404', 'carga', 'fail', 'una URL inexistente no da 404'); await ctx.close(); }
await browser.close();

/* enlaces externos por red (una sola vez) */
if (!args.has('--no-external')) {
  const ext = new Set(); for (const f of [...PAGES, '404.html']) { const h = fs.readFileSync(path.join(root, f), 'utf8'); for (const m of h.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)) { const u = m[1].replace(/&amp;/g, '&'); if (!/wa\.me|google\.com\/maps|waze\.com|schema\.org|github\.io|DOMINIO/.test(u)) ext.add(u); } }
  console.log(`\n  ▸ red      ${ext.size} sitios externos`);
  const list = [...ext]; let i = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (i < list.length) { const u = list[i++]; try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 15000); let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; chita-check)' } }); if (r.status >= 400) r = await fetch(u, { redirect: 'follow', signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; chita-check)' } }); clearTimeout(t);
    if (r.status === 404 || r.status === 410 || r.status >= 500) log('red', u, 'externo', 'fail', `HTTP ${r.status}`); else if (r.status >= 400) warn('red', u, 'externo', `HTTP ${r.status} (muchos sitios bloquean bots: abrir a mano)`); else if (/instagram|facebook/.test(u) && /login/.test(r.url)) warn('red', u, 'externo', 'pide iniciar sesión (normal en redes: abrir a mano)'); else ok('red', u, 'externo', `HTTP ${r.status}`); } catch (e) { log('red', u, 'externo', 'fail', 'no responde: ' + (e.name === 'AbortError' ? 'timeout' : e.message)); } } }));
}
server.close();

/* ───────── informe ───────── */
const F = results.filter((r) => r.status === 'fail'), W = results.filter((r) => r.status === 'warn'), O = results.filter((r) => r.status === 'ok');
const dedupe = (l) => [...new Map(l.map((r) => [`${r.area}|${r.msg}|${r.vp}|${r.page}`, r])).values()];
console.log('\n══════════════ RESUMEN ══════════════');
console.log(`✔ ${O.length} correctos   ⚠ ${W.length} avisos   ✖ ${F.length} fallas`);
if (F.length) { console.log('\n✖ FALLAS (hay que arreglar):'); for (const r of dedupe(F)) console.log(`  [${r.vp} · ${r.page} · ${r.area}] ${r.msg}${r.captura ? `\n      captura: check-report/${r.captura}` : ''}`); }
if (W.length) { console.log('\n⚠ AVISOS (revisar a mano):'); for (const r of dedupe(W)) console.log(`  [${r.vp} · ${r.page} · ${r.area}] ${r.msg}`); }
console.log(F.length ? '\nRESULTADO: ✖ HAY FALLAS' : '\nRESULTADO: ✔ TODO BIEN (lo que un script puede verificar)');
console.log('Siguen siendo a ojo: que Maps muestre la ficha correcta, que WhatsApp abra el chat y que Instagram/Facebook abran el perfil.\n');
fs.writeFileSync(path.join(outDir, 'reporte.json'), JSON.stringify({ fecha: new Date().toISOString(), resumen: { ok: O.length, avisos: W.length, fallas: F.length }, resultados: results }, null, 1));
process.exit(F.length ? 1 : 0);
