// Validaciones del sitio estático publicado en GitHub Pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prod=process.argv.includes('--prod');
const errors=[];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
if(!html.includes('rel="canonical"')) errors.push('index.html: falta canonical');
if((html.match(/<h1[\s>]/g)||[]).length!==1) errors.push('index.html debe tener un único h1');
if(!html.includes('href="privacidad.html')) errors.push('index.html: falta enlace a privacidad.html');
if(/href="#"/.test(html)) errors.push('index.html: hay href="#" sin destino');
if(/href="http:\/\//.test(html)) errors.push('index.html: enlace http:// sin cifrar');
for(const m of html.matchAll(/(?:src|href)="(images\/[^"#?]+\.(?:webp|png|jpe?g))"/g)) if(!fs.existsSync(path.join(root,m[1]))) errors.push(`Falta ${m[1]}`);
for(const m of html.matchAll(/<img\b[^>]*>/g)) if(!/\balt=/.test(m[0])) errors.push(`img sin alt: ${m[0].slice(0,80)}`);
for(const name of ['tracker-01','tracker-02','tracker-03','tracker-04','tracker-05','palio-01','palio-02','palio-03','palio-04']) if(!fs.existsSync(path.join(root,'images/showroom',`${name}.webp`))) errors.push(`Falta images/showroom/${name}.webp`);
if(!js.includes('ScrollTrigger')) errors.push('js/app.js: falta el sistema de cámara');
if(prod){
  if(/noindex|Disallow:\s*\/\s*$/m.test(html+fs.readFileSync(path.join(root,'robots.txt'),'utf8'))) errors.push('PRODUCCION: quedan bloqueos de indexación');
  for(const t of ['WHATSAPP-A-CONFIRMAR','EJEMPLO','a cargar','a confirmar']) if((html+js).includes(t)) errors.push(`PRODUCCION: queda "${t}"`);
}
if(errors.length){console.error(errors.map(e=>'ERROR: '+e).join('\n'));process.exit(1)}
console.log('Sitio válido: estructura, recursos, accesibilidad básica e interacción comprobadas.');
