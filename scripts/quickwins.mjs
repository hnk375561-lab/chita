// CHITA · cambios rápidos de bajo riesgo en #unidades (se puede correr más de una vez: lo ya aplicado se salta).
//
//   node scripts/quickwins.mjs          aplica los cambios
//   node scripts/quickwins.mjs --dry    solo muestra qué haría
//
// 1) js/app.js     La primera foto de la primera card ya no pide fetchpriority="high" (la sección está
//                  debajo del hero y competía con el póster del hero). Sigue siendo loading="eager".
// 2) index.html    Se elimina el MutationObserver del filtro: ap() ya se llama en cada acción del usuario
//                  y al cargar; el observer solo existía para reaccionar a cambios del propio ap().
//
// Después de aplicar:  npm run prerender   (regenera las cards de index.html con la card() corregida)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');
let fallo = false;

function aplicar(archivo, cambios) {
  const ruta = path.join(root, archivo);
  let txt = fs.readFileSync(ruta, 'utf8');
  const original = txt;
  for (const c of cambios) {
    const aplicado = c.despues.test ? c.despues.test(txt) : txt.includes(c.despues);
    const n = (txt.match(c.antes) || []).length;
    if (n === 0 && aplicado) { console.log(`  = ${archivo}: "${c.nombre}" ya estaba aplicado`); continue; }
    if (n !== 1) { console.error(`  ✗ ${archivo}: "${c.nombre}" — se esperaba 1 coincidencia y hay ${n}. No se toca nada de este archivo.`); fallo = true; return; }
    txt = txt.replace(c.antes, c.reemplazo);
    console.log(`  ✓ ${archivo}: ${c.nombre}`);
  }
  if (!dry && txt !== original) fs.writeFileSync(ruta, txt);
}

console.log(dry ? 'Simulación (no se escribe nada):' : 'Aplicando:');

aplicar('js/app.js', [{
  nombre: 'quitar fetchpriority="high" de la primera card',
  antes: /\+\(k\|\|i\?'':' fetchpriority="high"'\)/g,
  reemplazo: '',
  despues: /loading="'\+\(k\|\|i\?'lazy':'eager'\)\+'"'\+' decoding=/,
}]);

aplicar('index.html', [
  {
    nombre: 'quitar la creación del MutationObserver',
    antes: /var ob=new MutationObserver\(function\(\)\{ap\(\)\}\);\r?\n/g,
    reemplazo: '',
    despues: { test: (t) => !t.includes('new MutationObserver(function(){ap()})') },
  },
  {
    nombre: 'quitar disconnect/observe alrededor del reordenamiento',
    antes: /ob\.disconnect\(\);sr\.forEach\(function\(a\)\{gr\.appendChild\(a\)\}\);ob\.observe\(gr,\{childList:true\}\);/g,
    reemplazo: 'sr.forEach(function(a){gr.appendChild(a)});',
    despues: { test: (t) => !t.includes('ob.disconnect();') },
  },
  {
    nombre: 'quitar el observe inicial',
    antes: /ob\.observe\(\$\("stockGrid"\),\{childList:true\}\);ap\(\);/g,
    reemplazo: 'ap();',
    despues: { test: (t) => !t.includes('ob.observe($("stockGrid")') },
  },
]);

if (fallo) { console.error('\nAlgo no coincide con lo esperado (¿tu index.html/app.js cambió?). No se aplicó lo fallido; pasame el mensaje.'); process.exit(1); }
console.log(dry ? '\nListo (simulación).' : '\nListo. Ahora corré:  npm run prerender');
