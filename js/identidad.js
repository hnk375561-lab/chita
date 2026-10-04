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
