// Lista cada línea del sitio que AFIRMA algo del negocio (servicios, años, garantías, financiación, 0 km, "a cargar"...).
// Sirve para revisar con el dueño, línea por línea, qué texto hay que confirmar o borrar antes de publicar.
// Uso: npm run audit
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const re = /(permut|consign|financ|0 ?km|cero ?km|garant[ií]a|a[ñn]os de|desde 19|desde 20|transfer|cr[eé]dito|cuotas|tarjeta|usados|nuevos|a confirmar|a cargar|EJEMPLO|WHATSAPP-A-CONFIRMAR|Pendiente de confirmaci)/i;
// Voz: frases que docs/IDENTIDAD-MADRE.md (sección 2) pide evitar. Se listan aparte para no mezclarlas con las afirmaciones.
const voz = /(descubr[ií]\b|contactanos ahora|te garantizamos|tu veh[ií]culo usado|experiencia premium|soluciones integrales|movilidad inteligente|oportunidades imperdibles|auto de tus sue[ñn]os|calidad garantizada)/i;
let n = 0, nv = 0;
for (const f of ['index.html', '404.html', 'privacidad.html']) {
  const lines = fs.readFileSync(path.join(root, f), 'utf8').split('\n'); let inStyle = false, inScript = false;
  lines.forEach((l, i) => {
    if (/<style/.test(l)) inStyle = true; if (/<\/style>/.test(l)) { inStyle = false; return; } if (/<script/.test(l) && !/<\/script>/.test(l)) inScript = true; if (/<\/script>/.test(l)) { inScript = false; return; } if (inStyle || inScript) return;
    const text = l.replace(/<svg.*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const mv = text.match(voz); if (mv && !/^\/[*\/]/.test(text) && !/^(var|function)\b/.test(text)) { nv++; console.log(`VOZ ${f}:${i + 1}  …${text.slice(Math.max(0, text.toLowerCase().indexOf(mv[0].toLowerCase()) - 50), text.toLowerCase().indexOf(mv[0].toLowerCase()) + 70)}…`); }
    const m = text.match(re); if (!m || /^\/[*\/]/.test(text) || /^(var|function)\b/.test(text)) return;
    const k = text.toLowerCase().indexOf(m[0].toLowerCase()); n++;
    console.log(`${f}:${i + 1}  …${text.slice(Math.max(0, k - 70), k + 90)}…`);
  });
}
console.log(`\n${nv} líneas con frases de voz a evitar.`);
console.log(`${n} líneas con afirmaciones para revisar. Cada una: dato confirmado (y registrado en golive/AFIRMACIONES-A-CONFIRMAR.md) o se borra.`);
