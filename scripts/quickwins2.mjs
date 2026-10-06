// CHITA · rendimiento: los fondos de sección (bg-visita.webp, bg-fin.webp, bg-guia.webp; ~200 KB cada uno) son fondos CSS
// de secciones muy abajo en la página, pero el navegador los descarga al cargar y compiten con lo que se ve primero.
// Este script hace que se descarguen recién cuando la sección está a ~1500 px de la pantalla (no hay salto visible al scrollear).
//
//   node scripts/quickwins2.mjs          aplica (se puede correr más de una vez)
//   node scripts/quickwins2.mjs --dry    solo muestra qué haría
//
// 1) css/chita-v54.css   el fondo pasa a la clase .bg-on (la regla de display sigue igual)
// 2) js/identidad.js     un IntersectionObserver agrega .bg-on cuando la sección se acerca
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');
let fallo = false;

function editar(archivo, fn) {
  const ruta = path.join(root, archivo);
  const antes = fs.readFileSync(ruta, 'utf8');
  const r = fn(antes);
  if (r.error) { console.error(`  ✗ ${archivo}: ${r.error}`); fallo = true; return; }
  console.log(`  ${r.cambio ? '✓' : '='} ${archivo}: ${r.msg}`);
  if (!dry && r.cambio) fs.writeFileSync(ruta, r.texto);
}

console.log(dry ? 'Simulación (no se escribe nada):' : 'Aplicando:');

/* 1 · CSS */
editar('css/chita-v54.css', (t) => {
  const reglas = ['guia', 'visita', 'financiacion'].map((s) => ({
    s,
    vieja: new RegExp(`(html body #${s}#${s}#${s} \\.fin-bg\\.mos)\\{display:block!important;background:(url\\(\\.\\./images/[a-z-]+\\.webp\\) center/cover no-repeat)\\}`),
  }));
  let out = t, n = 0, ya = 0;
  for (const r of reglas) {
    if (r.vieja.test(out)) { out = out.replace(r.vieja, (_, sel, fondo) => `${sel}{display:block!important}\n${sel}.bg-on{background:${fondo}}`); n++; }
    else if (out.includes(`#${r.s}#${r.s}#${r.s} .fin-bg.mos.bg-on{`)) ya++;
  }
  if (n === 0 && ya === 3) return { cambio: false, msg: 'ya estaba aplicado', texto: t };
  if (n !== 3) return { error: `se esperaban 3 reglas de fondo y encontré ${n} (ya aplicadas: ${ya}). No se toca el archivo.` };
  return { cambio: true, msg: 'los 3 fondos pasan a .bg-on', texto: out };
});

/* 2 · JS */
const MARCA = '/* CHITA · fondos de sección diferidos';
const BLOQUE = `
${MARCA}: se descargan cuando la sección se acerca (rendimiento). */
(function(){
var bgs=[].slice.call(document.querySelectorAll(".fin-bg.mos"));if(!bgs.length)return;
function on(el){el.classList.add("bg-on")}
if(!("IntersectionObserver" in window)){bgs.forEach(on);return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){on(e.target);io.unobserve(e.target)}})},{rootMargin:"1500px 0px"});
bgs.forEach(function(el){io.observe(el)});
})();
`;
editar('js/identidad.js', (t) => {
  if (t.includes(MARCA)) return { cambio: false, msg: 'ya estaba aplicado', texto: t };
  return { cambio: true, msg: 'agregado el observer de fondos', texto: t.replace(/\s*$/, '\n') + BLOQUE };
});

if (fallo) { console.error('\nAlgo no coincide con lo esperado. No se aplicó lo fallido; pasame el mensaje.'); process.exit(1); }
console.log(dry ? '\nListo (simulación).' : '\nListo. Después corré:  node scripts/perf-baseline.mjs   y   npm run check:desktop');
