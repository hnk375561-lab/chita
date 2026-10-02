/* Movimiento · GSAP + ScrollTrigger. transform/opacity/clip-path, expo.out, sin scroll-jacking. Con prefers-reduced-motion queda todo estático. */
(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,S=window.STOCK||[];
function kmN(c){return parseInt(String(c.km).replace(/\D/g,""),10)||0}
function fm(n){return n.toLocaleString("es-AR")}
/* Tablero: un cuentakilómetros por unidad (dato real de STOCK) */
var gs=$("#gs");if(gs)gs.innerHTML=S.map(function(c){var k=kmN(c),r=Math.min(k/200000,1),a=-90+180*r;
return '<div class="gg"><svg viewBox="0 0 200 124" aria-hidden="true"><path class="tr" d="M20 110A80 80 0 0 1 180 110" pathLength="100"/><path class="fl" d="M20 110A80 80 0 0 1 180 110" pathLength="100" stroke-dasharray="100" stroke-dashoffset="'+(100*(1-r))+'" data-r="'+r+'"/><g class="nd" transform="rotate('+a+' 100 110)" data-a="'+a+'"><line x1="100" y1="110" x2="100" y2="38"/><circle cx="100" cy="110" r="7"/></g></svg><b class="kv" data-k="'+k+'">'+fm(k)+'</b><span class="ku">km</span><h3>'+c.titulo+'</h3><p>Año '+c.anio+'</p></div>'}).join("");
/* Camino: ruta con un cartel por unidad según su año */
var rd=$("#rd");if(rd&&S.length){var ys=S.map(function(c){return +c.anio}),y0=Math.min.apply(null,ys),sp=(Math.max.apply(null,ys)-y0)||1;
rd.innerHTML='<div class="road"></div><svg class="cr" viewBox="0 0 84 44" aria-hidden="true"><path d="M4 30V22l10-3 10-9h26l12 9 14 3v8z" fill="#1D3FA0" stroke="#0F1317" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="32" r="7" fill="#0F1317"/><circle cx="62" cy="32" r="7" fill="#0F1317"/></svg>'+S.map(function(c,i){var p=10+80*((c.anio-y0)/sp);return '<div class="mk'+(i%2?' dn':'')+(RM?' on':'')+'" data-p="'+p+'" style="left:'+p+'%"><b>'+c.anio+'</b><span>'+c.titulo+'</span></div>'}).join("");if(RM)rd.querySelector(".cr").style.left="calc(100% - 84px)"}
/* Elegí tu día: próximos 7 días y franja; arma el mensaje de WhatsApp */
var wk=$("#wk");if(wk&&window.NEGOCIO){var N=window.NEGOCIO,D=[],sel=0,fr="",go=$("#diaGo"),L=function(d,o){return d.toLocaleDateString("es-AR",o)};
for(var i=1;i<=7;i++){var d=new Date();d.setDate(d.getDate()+i);D.push(d)}
wk.innerHTML=D.map(function(d,i){return '<button type="button" class="dy" aria-pressed="'+(i===0)+'" data-i="'+i+'"><small>'+L(d,{weekday:"short"}).replace(".","")+'</small><b>'+d.getDate()+'</b><small>'+L(d,{month:"short"}).replace(".","")+'</small></button>'}).join("");
var up=function(){var t="Hola! Quiero coordinar una visita el "+L(D[sel],{weekday:"long",day:"numeric",month:"long"})+(fr?" "+fr:"")+". ¿Me confirman si puedo ir y en qué horario?";go.href="https://wa.me/"+N.whatsapp+"?text="+encodeURIComponent(t);$("#diaT").textContent=t};
wk.addEventListener("click",function(e){var b=e.target.closest(".dy");if(!b)return;sel=+b.dataset.i;$$(".dy").forEach(function(x){x.setAttribute("aria-pressed",x===b)});up()});
$("#fr").addEventListener("click",function(e){var b=e.target.closest(".fb");if(!b)return;fr=b.dataset.f;$$(".fb").forEach(function(x){x.setAttribute("aria-pressed",x===b)});up()});up()}
var chat=$("#bub"),TXT="Hola! Quiero permutar mi auto por otro: Ford Fiesta, año 2015, 85.000 km.";if(chat)chat.textContent=RM?TXT:"";
var g=window.gsap,ST=window.ScrollTrigger;
if(RM||!g||!ST)return;
g.registerPlugin(ST);ST.config({ignoreMobileResize:true});
/* Hero: entrada orquestada y profundidad */
g.timeline({defaults:{ease:"expo.out"}}).from(".hbg",{scale:1.25,duration:2.2},0).from("h1 .ln>span",{yPercent:115,rotate:3,duration:1.4,stagger:.14},.15).from(".plate",{y:-60,rotate:-24,opacity:0,duration:1.1},.7).from(".hl>*",{y:30,opacity:0,duration:1,stagger:.12},.9);
g.to(".hbg",{yPercent:14,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
g.to("h1",{yPercent:-12,opacity:.2,ease:"none",scrollTrigger:{trigger:".hero",start:"35% top",end:"bottom top",scrub:true}});
$$(".tape").forEach(function(tp,i){g.fromTo(tp.firstElementChild,{xPercent:i?-25:0},{xPercent:i?0:-25,ease:"none",scrollTrigger:{trigger:tp,start:"top bottom",end:"bottom top",scrub:.6}})});
/* Tablero: las agujas arrancan en cero y barren hasta el valor al llegar; el número cuenta */
$$(".gg").forEach(function(el,i){var nd=el.querySelector(".nd"),fl=el.querySelector(".fl"),kv=el.querySelector(".kv"),a=+nd.dataset.a,k=+kv.dataset.k,o={v:0},tl=g.timeline({scrollTrigger:{trigger:el,start:"top 85%"},delay:i*.15});
g.set(nd,{rotation:-90,svgOrigin:"100 110"});g.set(fl,{strokeDashoffset:100});
tl.to(nd,{rotation:a,duration:2.2,ease:"elastic.out(1,.55)"},0).to(fl,{strokeDashoffset:100*(1-fl.dataset.r),duration:1.8,ease:"expo.out"},0).to(o,{v:k,duration:1.8,ease:"expo.out",onUpdate:function(){kv.textContent=fm(Math.round(o.v))}},0)});
/* Camino: el auto avanza con el scroll y enciende cada cartel */
var cr=$(".cr"),mks=$$(".mk");if(cr&&rd){var tw=g.to(cr,{x:function(){return rd.offsetWidth-cr.getBoundingClientRect().width},ease:"none",scrollTrigger:{trigger:"#camino",start:"top 55%",end:"bottom 60%",scrub:.6,invalidateOnRefresh:true,onUpdate:function(s){mks.forEach(function(k){k.classList.toggle("on",s.progress*100+6>=+k.dataset.p-4)})}}})}
/* Días: caen en fila */
g.from(".dy",{y:-80,rotate:function(){return g.utils.random(-12,12)},opacity:0,duration:1,ease:"back.out(1.5)",stagger:.07,scrollTrigger:{trigger:"#wk",start:"top 88%"},clearProps:"transform,opacity"});
/* Redes: cada fila entra con máscara lateral */
$$(".sc").forEach(function(r){g.from(r,{clipPath:"inset(0 100% 0 0)",duration:1.3,ease:"expo.inOut",scrollTrigger:{trigger:r,start:"top 90%"},clearProps:"clipPath"})});
/* Playa: cada tarjeta se hunde y se apaga cuando la siguiente la tapa */
$$("#stockGrid .car").forEach(function(c){var n=c.nextElementSibling;if(!n)return;g.fromTo(c,{scale:1,opacity:1},{scale:.93,opacity:.6,ease:"none",scrollTrigger:{trigger:n,start:"top bottom",end:"top 120px",scrub:true}})});
g.from("#unidades h2",{yPercent:40,opacity:0,duration:1.2,ease:"expo.out",scrollTrigger:{trigger:"#unidades h2",start:"top 85%"}});
/* Chat: el mensaje se escribe a medida que se baja */
if(chat)ST.create({trigger:"#operaciones",start:"top 70%",end:"center 40%",scrub:true,onUpdate:function(s){chat.textContent=TXT.slice(0,Math.round(TXT.length*s.progress))}});
g.from(".phone",{y:120,rotate:-12,opacity:0,duration:1.4,ease:"expo.out",scrollTrigger:{trigger:".phone",start:"top 90%"}});
g.from("#canjeForm",{y:80,rotate:2,opacity:0,duration:1.2,ease:"expo.out",scrollTrigger:{trigger:"#canjeForm",start:"top 90%"}});
/* Cartel de calle: cae y se asienta; la foto contra-desliza */
g.from("#sign",{y:-300,rotate:-14,opacity:0,duration:1.6,ease:"bounce.out",scrollTrigger:{trigger:"#sign",start:"top 85%"}});
g.fromTo(".strip img",{yPercent:-8},{yPercent:8,ease:"none",scrollTrigger:{trigger:".strip",start:"top bottom",end:"bottom top",scrub:true}});
g.from(".strip",{clipPath:"inset(0 50% 0 50% round 20px)",duration:1.4,ease:"expo.inOut",scrollTrigger:{trigger:".strip",start:"top 85%"}});
/* Preguntas: las pastillas caen al azar */
g.from(".chip",{y:-120,rotate:function(){return g.utils.random(-25,25)},opacity:0,duration:1.1,ease:"back.out(1.6)",stagger:.08,scrollTrigger:{trigger:".chips",start:"top 85%"},clearProps:"transform,opacity"});
g.from(".wm",{yPercent:60,duration:1.6,ease:"expo.out",scrollTrigger:{trigger:".wm",start:"top 100%"}});
if(matchMedia("(hover:hover) and (pointer:fine)").matches)$$(".btn").forEach(function(b){var x=g.quickTo(b,"x",{duration:.5,ease:"expo.out"}),y=g.quickTo(b,"y",{duration:.5,ease:"expo.out"});b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.25);y((e.clientY-r.top-r.height/2)*.35)});b.addEventListener("pointerleave",function(){x(0);y(0)})});
})();
