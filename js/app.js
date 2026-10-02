/* Chita — scroll = cámara. Una escena fija por unidad: detalle → auto → número → interior. Solo transform/opacity/clip-path. */
const D=[
 {n:'01',brand:'Chevrolet',name:'Tracker',year:'2021',km:'100.000',tag:'Gris plata · Automática',
  s:[['tracker-04','Chevrolet Tracker, óptica y frente','68% 36%',3.1],['tracker-01','Chevrolet Tracker gris plata, vista delantera derecha','80% 72%',2.5],['tracker-05','Interior: tablero, volante y pantalla central','50% 50%',1.35]],
  r:[['tracker-01','Delantera derecha'],['tracker-02','Trasera'],['tracker-03','Lateral'],['tracker-04','Frente'],['tracker-05','Interior']]},
 {n:'02',brand:'Fiat',name:'Palio',year:'2017',km:'128.000',tag:'Blanco · Cinco puertas',
  s:[['palio-01','Fiat Palio blanco dentro del salón de Chita','72% 62%',3],['palio-03','Fiat Palio blanco, vista delantera','65% 62%',2.4],['palio-interior','Interior del Fiat Palio, butacas de tela gris','60% 60%',1.35]],
  r:[['palio-01','Delantera'],['palio-02','Trasera'],['palio-03','Frente'],['palio-interior','Interior']]}];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const main=$('#main'),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
main.innerHTML=D.map((u,i)=>`<section class="unit" id="u${i}" aria-label="${u.brand} ${u.name} ${u.year}"><div class="stage">
${u.s.map(s=>`<div class="ph"><img src="images/showroom/${s[0]}.webp" alt="${s[1]}" ${i||s===u.s[0]?'':'loading="lazy"'} decoding="async"></div>`).join('')}
<div class="word" aria-hidden="true">CHITA</div>
<p class="m m-n">${u.n}</p><p class="m m-b">${u.brand}</p><p class="m m-y">${u.year}<br>${u.tag}</p>
<h2 class="name">${u.name}</h2><div class="km"><b>${u.km}</b><i>km</i></div>
<div class="act"><button type="button" data-open="${i}">Entrar</button><button type="button" data-book="${u.name}">Agendar</button></div></div></section>`).join('');
const idx=$('.idx');idx.innerHTML=D.map((u,i)=>`<button type="button" data-go="${i}">${u.n}<span>${u.name}</span></button>`).join('')+'<button type="button" data-go="v">—<span>Visita</span></button>';
const sts=[];
if(!RM){
 gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
 const mob=matchMedia('(max-width:700px)').matches;
 D.forEach((u,i)=>{
  const sec=$('#u'+i),ph=$$('.ph',sec),im=ph.map(p=>p.firstElementChild),w=$('.word',sec),km=$('.km',sec),nm=$('.name',sec),act=$('.act',sec),ms=$$('.m',sec);
  gsap.set(ph[1],{clipPath:'inset(100% 0% 0% 0%)'});gsap.set(ph[2],{clipPath:'inset(50% 50% 50% 50%)'});
  im.forEach((e,k)=>gsap.set(e,{transformOrigin:u.s[k][2],scale:u.s[k][3]}));
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sec,start:'top top',end:'+='+(mob?650:900)+'%',pin:$('.stage',sec),scrub:1,anticipatePin:1}});
  tl.to(im[0],{scale:u.s[0][3]*.55,duration:2},0)
    .to(ms,{opacity:1,duration:1,stagger:.25},.5)
    .to(ph[1],{clipPath:'inset(0% 0% 0% 0%)',ease:'power3.inOut',duration:1.8},2)
    .fromTo(im[1],{scale:u.s[1][3]},{scale:1.5,duration:1.8},2)
    .to(im[0],{scale:u.s[0][3]*.8,duration:1.8},2)
    .to(w,{yPercent:-9,duration:4},2)
    .to(im[1],{scale:1.02,ease:'power1.inOut',duration:2.4},3.8)
    .to(nm,{opacity:1,duration:1},4)
    .to(km,{opacity:1,duration:1.2},4.4)
    .to([km,nm],{opacity:0,duration:.8},6.2)
    .to(ph[2],{clipPath:'inset(0% 0% 0% 0%)',ease:'power3.inOut',duration:1.8},6.4)
    .to(im[1],{scale:2.3,ease:'power2.in',duration:1.8},6.4)
    .fromTo(im[2],{scale:u.s[2][3]*1.35},{scale:1,duration:2.4},6.4)
    .to(w,{yPercent:0,duration:2},8)
    .to(act,{opacity:1,duration:.8},8.4).set(act,{pointerEvents:'auto'},8.4)
    .to({},{duration:1.2});
  sts.push(tl.scrollTrigger);
 });
 gsap.fromTo('.visit h2,.visit .row',{yPercent:6,opacity:0},{yPercent:0,opacity:1,duration:1.6,ease:'expo.out',stagger:.15,scrollTrigger:{trigger:'.visit',start:'top 55%'}});
 gsap.fromTo('.end',{yPercent:30},{yPercent:0,ease:'none',scrollTrigger:{trigger:'.visit',start:'top 40%',end:'bottom bottom',scrub:1}});
}
idx.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const g=b.dataset.go,y=g==='v'?$('#visita').getBoundingClientRect().top+scrollY:(sts[+g]?sts[+g].start:$('#u'+g).offsetTop);
 RM?scrollTo({top:y}):gsap.to(window,{scrollTo:y,duration:2.2,ease:'power3.inOut',overwrite:true})});
addEventListener('pointermove',e=>idx.classList.toggle('on',e.clientX>innerWidth-150),{passive:true});
idx.addEventListener('pointerdown',()=>idx.classList.add('on'));
/* Entrar: se abre la puerta (clip desde el centro) */
const room=$('.room'),roomTl={};let lastF=null;
function openRoom(i){const u=D[i];lastF=document.activeElement;
 $('.shots',room).innerHTML=u.r.map(r=>`<div class="shot"><img src="images/showroom/${r[0]}.webp" alt="${u.brand} ${u.name}, ${r[1].toLowerCase()}" loading="lazy"></div>`).join('');
 $('h3',room).textContent=u.brand+' '+u.name;
 $('.mm',room).innerHTML=`${u.year} · ${u.km} km<br>${u.tag}<br><a href="tel:+543442442782" style="text-decoration:underline">Llamar</a> · <button type="button" data-book="${u.name}" style="text-decoration:underline">Agendar</button>`;
 room.scrollTop=0;room.style.visibility='visible';document.body.style.overflow='hidden';
 RM?room.style.clipPath='none':gsap.to(room,{clipPath:'inset(0% 0% 0% 0%)',duration:1.4,ease:'expo.inOut'});$('.close',room).focus()}
function closeRoom(){const f=()=>{room.style.visibility='hidden';document.body.style.overflow='';lastF&&lastF.focus()};
 RM?(room.style.clipPath='inset(50% 50% 50% 50%)',f()):gsap.to(room,{clipPath:'inset(50% 50% 50% 50%)',duration:1,ease:'expo.inOut',onComplete:f})}
$('.close',room).onclick=closeRoom;
/* Agenda: libro de citas. Sin horarios inventados: día + franja; se confirma por teléfono */
const bk=$('.book'),st={d:null,s:null,u:'Solo visitar'};
const DN=['dom','lun','mar','mié','jue','vie','sáb'],MN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const days=[];for(let k=1;days.length<8;k++){const d=new Date();d.setDate(d.getDate()+k);if(d.getDay())days.push(d)}
$('[data-days]').innerHTML=days.map((d,i)=>`<button type="button" data-d="${i}" aria-pressed="false"><small>${DN[d.getDay()]}</small><b>${d.getDate()}</b>${MN[d.getMonth()]}</button>`).join('');
$('[data-slots]').innerHTML=['Mañana','Tarde'].map(s=>`<button type="button" data-s="${s}" aria-pressed="false">${s}</button>`).join('');
$('[data-units]').innerHTML=['Solo visitar',...D.map(u=>u.brand+' '+u.name)].map((s,i)=>`<button type="button" data-u="${s}" aria-pressed="${!i}">${s}</button>`).join('');
const go=$('.go',bk),ok=$('[data-ok]',bk);
bk.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 for(const k of ['d','s','u'])if(b.dataset[k]!==undefined){st[k]=k==='d'?+b.dataset.d:b.dataset[k];$$('[data-'+k+']',bk).forEach(x=>x.setAttribute('aria-pressed',x===b))}
 go.disabled=st.d===null||!st.s;
 if(b===go){const d=days[st.d];ok.innerHTML=`Cita pedida: ${DN[d.getDay()]} ${d.getDate()} de ${MN[d.getMonth()]}, ${st.s.toLowerCase()}. ${st.u}.<br><a href="tel:+543442442782" style="text-decoration:underline;font-size:.6em">Llamá al 03442 44-2782 para confirmarla.</a>`;
  RM||gsap.fromTo(ok,{opacity:0,yPercent:8},{opacity:1,yPercent:0,duration:1.2,ease:'expo.out'})}});
function openBook(u){if(u&&u!=='Visitar'){const m=D.find(x=>x.name===u);if(m){st.u=m.brand+' '+m.name;$$('[data-u]',bk).forEach(x=>x.setAttribute('aria-pressed',x.dataset.u===st.u))}}
 bk.style.visibility='visible';document.body.style.overflow='hidden';RM?bk.style.clipPath='none':gsap.to(bk,{clipPath:'inset(0% 0% 0% 0%)',duration:1.2,ease:'expo.inOut'});$('.x',bk).focus()}
function closeBook(){const f=()=>{bk.style.visibility='hidden';document.body.style.overflow=room.style.visibility==='visible'?'hidden':''};
 RM?(bk.style.clipPath='inset(0 0 100% 0)',f()):gsap.to(bk,{clipPath:'inset(0% 0% 100% 0%)',duration:1,ease:'expo.inOut',onComplete:f})}
$('.x',bk).onclick=closeBook;
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)return openRoom(+o.dataset.open);const b=e.target.closest('[data-book]');if(b&&!bk.contains(b))openBook(b.dataset.book)});
addEventListener('keydown',e=>{if(e.key==='Escape')bk.style.visibility==='visible'?closeBook():room.style.visibility==='visible'&&closeRoom()});
