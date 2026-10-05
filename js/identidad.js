/* CHITA · v12: «Comparar» y «Dónde estamos» también se marcan en Modelos y Local. La Columna: avance de lectura + sección actual (transform only, 1 listener pasivo). */
(function(){
var S=[].slice.call(document.querySelectorAll("main>section[id]"));if(!S.length)return;
var N={entregas:"Entregas",unidades:"Unidades","catalogo-comparador":"Modelos",nosotros:"Nosotros",contacto:"Dónde estamos",local:"El local",opiniones:"Reseñas","como-comprar":"Cómo comprar",financiacion:"Financiación",operaciones:"Vender o permutar",guia:"Guía",visita:"Visita",preguntas:"Preguntas"};
var c=document.createElement("div");c.className="cl";c.setAttribute("aria-hidden","true");c.innerHTML="<i></i><b hidden></b>";document.body.appendChild(c);
var bar=c.firstChild,lab=c.lastChild,raf=0,cur="";
/* 13 pilares: un segmento por sección; el relleno rojo los atraviesa y el de la sección actual se enciende */
var seg=S.map(function(){var s=document.createElement("s");c.insertBefore(s,lab);return s});
function lay(){var d=document.documentElement,m=d.scrollHeight-innerHeight;if(m<=0)return;var f=S.map(function(s){return Math.max(0,Math.min(1,(s.getBoundingClientRect().top+scrollY-innerHeight*.4)/m))});
 seg.forEach(function(s,i){var a=f[i],b=i<S.length-1?f[i+1]:1;s.style.top=a*100+"%";s.style.height=Math.max(0,b-a)*100+"%"})}
function lit(k){seg.forEach(function(s,i){s.classList.toggle("on",i===k)})}
function upd(){raf=0;var d=document.documentElement,m=d.scrollHeight-innerHeight;bar.style.transform="scaleY("+(m>0?Math.min(1,scrollY/m):0)+")";
 var y=innerHeight*.4,k=-1;for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){k=i;break}}
 if(k<0){lab.hidden=true;cur="";lit(-1);return}
 var id=S[k].id;if(id!==cur){cur=id;lay();lit(k);lab.hidden=false;lab.innerHTML="<span>"+("0"+(k+1)).slice(-2)+"/"+S.length+"</span>"+(N[id]||id)}
 var a=document.querySelectorAll("header nav a");for(var j=0;j<a.length;j++){var al={"catalogo-comparador":"versus",local:"contacto"},on=a[j].getAttribute("href")==="#"+id||a[j].getAttribute("href")==="#"+al[id];a[j].classList.toggle("on",on);if(on&&a[j].parentNode.scrollWidth>a[j].parentNode.clientWidth+4){var n=a[j].parentNode;n.scrollTo({left:a[j].offsetLeft-n.clientWidth/2+a[j].offsetWidth/2,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})}}}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",function(){lay();q()});addEventListener("load",function(){lay();q()});lay();upd();
})();
/* CHITA · Recorrido en video del hero: carga diferida, pausa fuera de pantalla, sonido a pedido. */
(function(){
var f=document.getElementById("reel"),v=document.getElementById("reelv"),b=document.getElementById("reelb");if(!f||!v||!b)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd,seen=false,vis=false;
function load(){if(!v.src){v.src=v.getAttribute("data-src")}}
function label(){b.textContent=v.paused?"Reproducir":(v.muted?"Activar sonido":"Silenciar");b.setAttribute("aria-pressed",String(!v.muted&&!v.paused))}
function play(){load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
b.addEventListener("click",function(){
 if(v.paused){v.muted=false;play()}else{v.muted=!v.muted}
 label()});
v.addEventListener("play",label);v.addEventListener("pause",label);
if("IntersectionObserver" in window){
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;
  if(vis&&auto&&!seen){seen=true;play()}
  else if(vis&&auto&&v.paused){play()}
  else if(!vis&&!v.paused){v.pause()}
 },{threshold:.12}).observe(f)}
else if(auto)play();
label();
})();
/* CHITA · video de Visita: loop silencioso al entrar en pantalla, pausa al salir, botón propio (respeta movimiento reducido y ahorro de datos) */
(function(){
var f=document.querySelector("#visita .vvid"),v=f&&f.querySelector("video"),b=f&&f.querySelector(".vv-b");if(!v||!b)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd,manual=false;
function label(){b.textContent=v.paused?"Reproducir":"Pausar";b.setAttribute("aria-pressed",String(!v.paused))}
function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
b.addEventListener("click",function(){if(v.paused){manual=false;play()}else{manual=true;v.pause()}});
v.addEventListener("play",label);v.addEventListener("pause",label);
if("IntersectionObserver" in window){new IntersectionObserver(function(e){var vis=e[0].isIntersecting;if(vis&&auto&&!manual&&v.paused)play();else if(!vis&&!v.paused)v.pause()},{threshold:.25}).observe(f)}
label();
})();
/* CHITA · v3 — El Riel y El Corte. Sin dependencias, 1 IntersectionObserver, solo datos ya publicados. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
if(!RM)d.documentElement.classList.add("cj");
function tx(s){var e=d.querySelector(s);return e?e.textContent.replace(/\s+/g," ").trim():""}
/* EL RIEL */
var hero=d.getElementById("hero");
if(hero){var r=d.createElement("div");r.className="rl";r.setAttribute("aria-hidden","true");r.textContent="Chita Automotores · Entre Ríos";hero.appendChild(r)}
/* EL CORTE: un observador para las chapas de sección */
var T=[].slice.call(main.querySelectorAll(":scope>section"));
if("IntersectionObserver" in window&&!RM){var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});T.forEach(function(s){io.observe(s)})}
else T.forEach(function(s){s.classList.add("in")});
})();
/* CHITA · v4 — El Talón (numeral calado), Riel vivo (la pasada de fotos del hero acelera con el scroll) y salida del hero. 1 rAF, 1 listener pasivo. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,S=[].slice.call(d.querySelectorAll("main>section[id]"));if(!S.length)return;
S.forEach(function(s,i){var g=d.createElement("span");g.className="gn";g.setAttribute("aria-hidden","true");g.textContent=("0"+(i+1)).slice(-2);s.insertBefore(g,s.firstChild);
 var t=d.createElement("i");t.className="tl";t.setAttribute("aria-hidden","true");s.appendChild(t);s._g=g});
if(RM)return;
var hr=d.querySelector(".hx-reel"),hs=d.querySelector(".hx .hx-show"),hero=d.getElementById("hero"),big=matchMedia("(min-width:900px)"),
tape=null,ly=scrollY,v=0,raf=0,pr=1;
function anim(){if(tape)return tape;var t=d.querySelector(".hx-trk");if(t&&t.getAnimations){var a=t.getAnimations()[0];if(a)tape=a}return tape}
function tick(){raf=0;var y=scrollY,vh=innerHeight,dy=y-ly;ly=y;v+=(Math.abs(dy)-v)*.18;
 for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;
  var p=(vh-r.top)/(vh+r.height);S[i]._g.style.translate=((S[i]._g.parentNode.matches("main>section:nth-of-type(even)")?1:-1)*(p-.5)*14)+"vw 0"}
 if(hero&&big.matches){var k=Math.max(0,Math.min(1,y/Math.max(1,hero.offsetHeight)));if(hr)hr.style.setProperty("--hr",(-k*46)+"px");if(hs){hs.style.setProperty("--hs",(k*34)+"px");hs.style.setProperty("--hx",(Math.pow(k,1.7)*innerWidth*.62).toFixed(1)+"px")}}
 var a=anim();if(a){var pb=1+Math.min(v*.25,4);if(Math.abs(pb-pr)>.05){a.playbackRate=pb;pr=pb}}
 if(v>.05)raf=requestAnimationFrame(tick)}
function q(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",q);q();
})();
/* CHITA · v5 — Entregas: rótulo con la cantidad real de fotos publicadas. */
(function(){var g=document.querySelector("#entregas .eg");if(!g)return;var n=g.children.length;if(!n||document.querySelector(".ec"))return;
var c=document.createElement("p");c.className="ec";c.textContent=n+" entregas · fotos publicadas en redes";g.parentNode.insertBefore(c,g)})();
/* CHITA · v7 — EL SELLO, LA PERFORACIÓN y EL CURSOR. Sin dependencias; 1 IntersectionObserver, 1 listener de puntero pasivo (solo mouse), transform/opacity. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
/* LA PERFORACIÓN: borde de talonario entre secciones. La mordida lleva el color de la sección anterior. */
function bg(e){while(e){var c=getComputedStyle(e).backgroundColor;if(c&&c!=="rgba(0, 0, 0, 0)"&&c!=="transparent")return c;e=e.previousElementSibling}return"#ECEDEA"}
[].slice.call(main.querySelectorAll(":scope>section[id]")).forEach(function(s){
 var i=d.createElement("i");i.className="pf";i.setAttribute("aria-hidden","true");i.style.setProperty("--pv",bg(s.previousElementSibling));s.appendChild(i)});
/* EL SELLO: cada entrega publicada recibe su sello; golpea una vez, escalonado. */
var eg=d.querySelector("#entregas .eg");
if(eg){[].forEach.call(eg.children,function(li,k){var b=d.createElement("b");b.className="sl";b.setAttribute("aria-hidden","true");b.textContent="Entregado";b.style.setProperty("--i",k);li.appendChild(b)});
 if(RM||!("IntersectionObserver" in window))eg.classList.add("st");
 else new IntersectionObserver(function(e,o){if(e[0].isIntersecting){eg.classList.add("st");o.disconnect()}},{threshold:.2}).observe(eg)}
/* EL CURSOR: etiqueta-chapa que sigue al mouse y dice qué hace cada pieza. Magnetismo leve en botones. Solo mouse. */
if(RM||!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
var cu=d.createElement("div");cu.className="cu";cu.setAttribute("aria-hidden","true");cu.innerHTML="<b></b>";d.body.appendChild(cu);
var lb=cu.firstChild,x=-99,y=-99,tx=-99,ty=-99,raf=0,txt="",mg=null,T=".car,.eg li,.hx-reel,.oc";
function say(t){var e=t&&t.closest?t.closest(T):null,s="";
 if(e){if(e.matches(".car"))s="Ver ficha";else if(e.matches(".eg li"))s="Entrega E·"+("0"+([].indexOf.call(e.parentNode.children,e)+1)).slice(-2)+(e.getAttribute("data-m")?" · "+e.getAttribute("data-m"):"");else if(e.matches(".oc"))s="Consultar";else s="Recorrido"}
 if(s!==txt){txt=s;if(s)lb.textContent=s;cu.classList.toggle("on",!!s)}}
function loop(){raf=0;x+=(tx-x)*.24;y+=(ty-y)*.24;cu.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0)";if(Math.abs(tx-x)>.4||Math.abs(ty-y)>.4)raf=requestAnimationFrame(loop)}
function mag(t,px,py){var b=t&&t.closest?t.closest(".btn,.hx-btn"):null;
 if(mg&&mg!==b){mg.style.translate="";mg=null}
 if(b){var r=b.getBoundingClientRect();mg=b;b.style.translate=Math.max(-7,Math.min(7,(px-r.left-r.width/2)*.12))+"px "+Math.max(-5,Math.min(5,(py-r.top-r.height/2)*.18))+"px"}}
d.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;tx=e.clientX;ty=e.clientY;if(x<0&&y<0){x=tx;y=ty}say(e.target);mag(e.target,e.clientX,e.clientY);if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
d.addEventListener("pointerleave",function(){say(null);mag(null)},{passive:true});
})();
/* CHITA · v8 — El corte en tarjetas: un observador, una sola vez, escalonado por fila. Si falla IntersectionObserver, todo queda visible. */
(function(){
var d=document;if(!d.documentElement.classList.contains("cj")||!("IntersectionObserver" in window))return;
var E=[].slice.call(d.querySelectorAll("#stockGrid .car,#operaciones .oc,#opiniones .rvc"));if(!E.length)return;
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.style.setProperty("--d",(([].indexOf.call(t.parentNode.children,t))%4)*70+"ms");t.classList.add("in");io.unobserve(t)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
E.forEach(function(e){e.classList.add("cz7");io.observe(e)});
})();
/* CHITA · v9 — El pie también es un talón: perforación y «Fin del talonario». Sin listeners. */
(function(){
var f=document.querySelector("footer"),m=document.querySelector("main");if(!f||!m)return;
var l=m.querySelector(":scope>section:last-of-type"),c=l?getComputedStyle(l).backgroundColor:"#ECEDEA";
var p=document.createElement("i");p.className="pf";p.setAttribute("aria-hidden","true");p.style.setProperty("--pv",c);f.insertBefore(p,f.firstChild);
var n=m.querySelectorAll(":scope>section[id]").length,t=document.createElement("p");t.className="fin7";t.setAttribute("aria-hidden","true");t.textContent="Fin del talonario · "+n+"/"+n;
var w=f.querySelector(".w");if(w)w.insertBefore(t,w.firstChild);
})();
/* CHITA · v10 — EL DESPACHO. El hero queda fijo mientras Entregas lo cubre; cuando lo cubrió del todo se suelta
   (sale de pantalla y el video del recorrido se pausa solo). Solo escritorio y sin reduced-motion; si el hero no
   entra completo bajo el header, no se fija. 1 listener pasivo + 1 rAF por scroll, una lectura de layout. */
(function(){
var d=document,h=d.documentElement,hero=d.getElementById("hero"),hd=d.querySelector("header"),ent=d.querySelector("main>section[id]");
if(!hero||!ent||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var big=matchMedia("(min-width:900px)"),raf=0;
function fit(){var hh=hd?hd.offsetHeight:0,ok=big.matches&&hero.offsetHeight+hh<=innerHeight+2;
 hero.style.setProperty("--hh",hh+"px");h.classList.toggle("dsp",ok);if(!ok)hero.classList.remove("stk");upd()}
function upd(){raf=0;if(!h.classList.contains("dsp"))return;
 var covered=ent.getBoundingClientRect().top<=(hd?hd.offsetHeight:0);hero.classList.toggle("stk",!covered)}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",fit);fit();
})();

/* CHITA · v28 — Quiénes somos: las tres columnas rojas del frente son las pestañas (Usados, Permutas, Consignaciones).
   No agrega datos: reutiliza los tres textos ya publicados. Medidas [x, y, ancho, alto, y del rótulo] en % de la foto 900×581 (columnas reales: centro y las dos de la derecha). */
(function(){
var d=document,s=d.getElementById("nosotros"),ph=d.getElementById("nph"),pl=s&&s.querySelector(".pl");
if(!s||!ph||!pl)return;
var rows=[].slice.call(pl.children);if(rows.length!==3)return;
var Z=[[35.56,36.32,2.56,27.54,36.32],[85,33.74,2.67,49.74,33.74],[94.56,36.32,2.11,30.64,52]],
 lit=d.createElement("span"),btns=[],chips=[],cap=null,cur=-1,tm=0;
lit.className="nz";lit.setAttribute("aria-hidden","true");ph.appendChild(lit);
function mouse(e){return !e.pointerType||e.pointerType==="mouse"}
function go(i){clearTimeout(tm);if(i===cur)return;cur=i;
 rows.forEach(function(r,k){r.classList.toggle("on",k===i);btns[k].setAttribute("aria-expanded",String(k===i));chips[k].classList.toggle("on",k===i)});
 if(cap){cap.firstChild.textContent=btns[i].querySelector("b").textContent;cap.lastChild.textContent=rows[i].querySelector(".nq").textContent}
 var z=Z[i];lit.style.left=z[0]+"%";lit.style.top=z[1]+"%";lit.style.width=z[2]+"%";lit.style.height=z[3]+"%"}
function intent(i,e){if(!mouse(e))return;clearTimeout(tm);tm=setTimeout(function(){go(i)},90)}
for(var i=0;i<3;i++)(function(i){
 var r=rows[i],b=r.querySelector("b"),p=r.querySelector("span");if(!b||!p)return;
 var bt=d.createElement("button"),w=d.createElement("span"),n=d.createElement("i"),c=d.createElement("span");
 n.setAttribute("aria-hidden","true");n.textContent="0"+(i+1);
 bt.type="button";bt.className="nb";bt.id="nsb"+i;bt.setAttribute("aria-expanded","false");bt.setAttribute("aria-controls","nsp"+i);
 bt.appendChild(n);bt.appendChild(b);
 w.className="np";w.id="nsp"+i;w.setAttribute("role","region");w.setAttribute("aria-labelledby",bt.id);
 p.className="nq";r.insertBefore(bt,r.firstChild);r.insertBefore(w,p);w.appendChild(p);
 c.className="nc";c.setAttribute("aria-hidden","true");c.textContent="0"+(i+1);
 c.style.left=(Z[i][0]+Z[i][2]/2)+"%";c.style.top=Z[i][4]+"%";ph.appendChild(c);
 btns[i]=bt;chips[i]=c;
 bt.addEventListener("click",function(){go(i)});
 r.addEventListener("pointerenter",function(e){intent(i,e)});
 c.addEventListener("pointerenter",function(e){intent(i,e)});
 c.addEventListener("click",function(){go(i)});
})(i);
if(btns.length!==3||chips.length!==3)return;
/* en móvil el texto de la pestaña queda lejos de la foto: una leyenda bajo la foto muestra la columna activa */
cap=d.createElement("p");cap.className="ncap";cap.setAttribute("aria-hidden","true");cap.appendChild(d.createElement("b"));cap.appendChild(d.createElement("span"));ph.parentNode.insertBefore(cap,ph.nextSibling);
pl.classList.add("nt");ph.classList.add("nz-on");go(0);
})();
