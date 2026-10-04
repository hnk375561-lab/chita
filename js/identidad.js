/* CHITA · v12: «Comparar» y «Dónde estamos» también se marcan en Modelos y Local. La Columna: avance de lectura + sección actual (transform only, 1 listener pasivo). */
(function(){
var S=[].slice.call(document.querySelectorAll("main>section[id]"));if(!S.length)return;
var N={entregas:"Entregas",unidades:"Unidades","catalogo-comparador":"Modelos",nosotros:"Nosotros",contacto:"Dónde estamos",local:"El local",opiniones:"Reseñas","como-comprar":"Cómo comprar",financiacion:"Financiación",operaciones:"Vender o permutar",guia:"Guía",visita:"Visita",preguntas:"Preguntas"};
var c=document.createElement("div");c.className="cl";c.setAttribute("aria-hidden","true");c.innerHTML="<i></i><b hidden></b>";document.body.appendChild(c);
var bar=c.firstChild,lab=c.lastChild,raf=0,cur="";
function upd(){raf=0;var d=document.documentElement,m=d.scrollHeight-innerHeight;bar.style.transform="scaleY("+(m>0?Math.min(1,scrollY/m):0)+")";
 var y=innerHeight*.4,k=-1;for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){k=i;break}}
 if(k<0){lab.hidden=true;cur="";return}
 var id=S[k].id;if(id!==cur){cur=id;lab.hidden=false;lab.innerHTML="<span>"+("0"+(k+1)).slice(-2)+"/"+S.length+"</span>"+(N[id]||id)}
 var a=document.querySelectorAll("header nav a");for(var j=0;j<a.length;j++){var al={"catalogo-comparador":"versus",local:"contacto"},on=a[j].getAttribute("href")==="#"+id||a[j].getAttribute("href")==="#"+al[id];a[j].classList.toggle("on",on);if(on&&a[j].parentNode.scrollWidth>a[j].parentNode.clientWidth+4){var n=a[j].parentNode;n.scrollTo({left:a[j].offsetLeft-n.clientWidth/2+a[j].offsetWidth/2,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})}}}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",q);upd();
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
/* CHITA · v3 — La Cinta, El Riel y El Corte. Sin dependencias, 1 IntersectionObserver, solo datos ya publicados. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
if(!RM)d.documentElement.classList.add("cj");
function tx(s){var e=d.querySelector(s);return e?e.textContent.replace(/\s+/g," ").trim():""}
/* EL RIEL */
var hero=d.getElementById("hero");
if(hero){var r=d.createElement("div");r.className="rl";r.setAttribute("aria-hidden","true");r.textContent="Chita Automotores · Entre Ríos";hero.appendChild(r)}
/* LA CINTA: solo hechos presentes en la página (dirección, reseñas, unidades, teléfono) */
var pe=d.querySelector(".hx-proof"),p=pe?[].slice.call(pe.children).map(function(c){return c.textContent.trim()}).join(" "):"",u=(tx(".hx-copy>p:last-child").match(/\d+\s+unidades?\s+publicadas?/i)||[""])[0],t=tx("header .tel"),f=["Gral. Galarza 1712","Concepción del Uruguay · Entre Ríos"];
if(p)f.push(p.replace(/\s*\.\s*/g," · "));if(u)f.push(u);if(t)f.push("Tel. "+t);f.push("Escribinos por WhatsApp");
var h=f.map(function(x){return "<span>"+x.replace(/[<>&]/g,"")+"</span>"}).join(""),cin=d.createElement("div");
cin.className="cin";cin.setAttribute("aria-hidden","true");cin.innerHTML="<i></i><div><b class=\"cin-t\">"+h+h+"</b></div>";
if(hero&&hero.nextSibling)main.insertBefore(cin,hero.nextSibling);else main.appendChild(cin);
/* EL CORTE: un observador para chapas y cinta */
var T=[].slice.call(main.querySelectorAll(":scope>section")).concat([cin]);
if("IntersectionObserver" in window&&!RM){var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});T.forEach(function(s){io.observe(s)})}
else T.forEach(function(s){s.classList.add("in")});
})();
/* CHITA · v4 — El Talón (numeral calado), Cinta viva (velocidad de scroll) y salida del hero. 1 rAF, 1 listener pasivo. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,S=[].slice.call(d.querySelectorAll("main>section[id]"));if(!S.length)return;
S.forEach(function(s,i){var g=d.createElement("span");g.className="gn";g.setAttribute("aria-hidden","true");g.textContent=("0"+(i+1)).slice(-2);s.insertBefore(g,s.firstChild);
 var t=d.createElement("i");t.className="tl";t.setAttribute("aria-hidden","true");s.appendChild(t);s._g=g});
if(RM)return;
var hr=d.querySelector(".hx-reel"),hs=d.querySelector(".hx .hx-show"),hero=d.getElementById("hero"),big=matchMedia("(min-width:900px)"),
tape=null,ly=scrollY,v=0,raf=0,pr=1;
function anim(){if(tape)return tape;var t=d.querySelector(".cin-t");if(t&&t.getAnimations){var a=t.getAnimations()[0];if(a)tape=a}return tape}
function tick(){raf=0;var y=scrollY,vh=innerHeight,dy=y-ly;ly=y;v+=(Math.abs(dy)-v)*.18;
 for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;
  var p=(vh-r.top)/(vh+r.height);S[i]._g.style.translate=((S[i]._g.parentNode.matches("main>section:nth-of-type(even)")?1:-1)*(p-.5)*14)+"vw 0"}
 if(hero&&big.matches){var k=Math.max(0,Math.min(1,y/Math.max(1,hero.offsetHeight)));if(hr)hr.style.setProperty("--hr",(-k*46)+"px");if(hs){hs.style.setProperty("--hs",(k*34)+"px");hs.style.setProperty("--hx",(Math.pow(k,1.7)*innerWidth*.62).toFixed(1)+"px")}}
 var a=anim();if(a){var pb=1+Math.min(v*.5,7);if(Math.abs(pb-pr)>.05){a.playbackRate=pb;pr=pb}}
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
 if(e){if(e.matches(".car"))s="Ver ficha";else if(e.matches(".eg li"))s="Entrega E·"+("0"+([].indexOf.call(e.parentNode.children,e)+1)).slice(-2);else if(e.matches(".oc"))s="Consultar";else s="Recorrido"}
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
