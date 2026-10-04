/* CHITA · La Columna: avance de lectura + sección actual (transform only, 1 listener pasivo). */
(function(){
var S=[].slice.call(document.querySelectorAll("main>section[id]"));if(!S.length)return;
var N={entregas:"Entregas",unidades:"Unidades","catalogo-comparador":"Modelos",nosotros:"Nosotros",contacto:"Dónde estamos",local:"El local",opiniones:"Reseñas","como-comprar":"Cómo comprar",financiacion:"Financiación",operaciones:"Vender o permutar",guia:"Guía",visita:"Visita",preguntas:"Preguntas"};
var c=document.createElement("div");c.className="cl";c.setAttribute("aria-hidden","true");c.innerHTML="<i></i><b hidden></b>";document.body.appendChild(c);
var bar=c.firstChild,lab=c.lastChild,raf=0,cur="";
function upd(){raf=0;var d=document.documentElement,m=d.scrollHeight-innerHeight;bar.style.transform="scaleY("+(m>0?Math.min(1,scrollY/m):0)+")";
 var y=innerHeight*.4,k=-1;for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){k=i;break}}
 if(k<0){lab.hidden=true;cur="";return}
 var id=S[k].id;if(id!==cur){cur=id;lab.hidden=false;lab.innerHTML="<span>"+("0"+(k+1)).slice(-2)+"/"+S.length+"</span>"+(N[id]||id)}
 var a=document.querySelectorAll("header nav a");for(var j=0;j<a.length;j++)a[j].classList.toggle("on",a[j].getAttribute("href")==="#"+id)}
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
 if(hero&&big.matches){var k=Math.max(0,Math.min(1,y/Math.max(1,hero.offsetHeight)));if(hr)hr.style.setProperty("--hr",(-k*46)+"px");if(hs)hs.style.setProperty("--hs",(k*34)+"px")}
 var a=anim();if(a){var pb=1+Math.min(v*.5,7);if(Math.abs(pb-pr)>.05){a.playbackRate=pb;pr=pb}}
 if(v>.05)raf=requestAnimationFrame(tick)}
function q(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",q);q();
})();
/* CHITA · v5 — Entregas: rótulo con la cantidad real de fotos publicadas. */
(function(){var g=document.querySelector("#entregas .eg");if(!g)return;var n=g.children.length;if(!n||document.querySelector(".ec"))return;
var c=document.createElement("p");c.className="ec";c.textContent=n+" entregas · fotos publicadas en redes";g.parentNode.insertBefore(c,g)})();
