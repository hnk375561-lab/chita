/* CHITA · secciones.js
   · Comprá, vendé o permutá: cada foto se muestra con un fundido recién cuando terminó de cargar y decodificarse (nada a medias);
     las tarjetas entran de a una al verse.
   · El talón de compra: los pasos aparecen al verse, el sello cae cuando el riel rojo los alcanza.
   Solo IntersectionObserver y un scroll pasivo con rAF que escribe una variable. Con «reducir movimiento» todo queda ya visible. */
(function(){
"use strict";
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,IO="IntersectionObserver" in window;
var root=document.documentElement;
if(!RM&&IO)root.classList.add("rv-on");

/* ── Operaciones: fotos ── */
var imgs=[].slice.call(document.querySelectorAll("#operaciones .oc .oi img"));
function shown(im){var box=im.parentNode;if(box&&box.classList)box.classList.add("ld")}
imgs.forEach(function(im){
 function ok(){(im.decode?im.decode().catch(function(){}):Promise.resolve()).then(function(){shown(im)})}
 if(im.complete&&im.naturalWidth)ok();
 else{im.addEventListener("load",ok,{once:true});im.addEventListener("error",function(){shown(im)},{once:true})}});

/* ── Operaciones: entrada escalonada ── */
var cards=[].slice.call(document.querySelectorAll("#operaciones .og .oc"));
if(cards.length){
 if(!(root.classList.contains("rv-on")))cards.forEach(function(c){c.classList.add("in")});
 else{
  var seq=0,t=0,o=new IntersectionObserver(function(es){
   es.forEach(function(e){if(!e.isIntersecting)return;o.unobserve(e.target);
    e.target.style.setProperty("--d",(seq++*0.1)+"s");e.target.classList.add("in")});
   clearTimeout(t);t=setTimeout(function(){seq=0},600)},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  cards.forEach(function(c){o.observe(c)})}}

/* ── Talón de compra ── */
var list=document.getElementById("tkList");
if(list){
 var steps=[].slice.call(list.querySelectorAll(".tk-step")),inView=false,raf=0,fill=document.createElement("i");
 fill.className="tk-fill";fill.setAttribute("aria-hidden","true");list.insertBefore(fill,list.firstChild);
 var nw=parseFloat(getComputedStyle(list).getPropertyValue("--nw"))||30,lastP=-1;
 function measure(){nw=parseFloat(getComputedStyle(list).getPropertyValue("--nw"))||30}
 function paint(){
  raf=0;
  /* primero se lee todo, después se escribe: sin recalcular el layout dos veces por frame */
  var vh=innerHeight,r=list.getBoundingClientRect(),line=vh*.62,
   p=Math.max(0,Math.min(1,(line-r.top-nw/2)/Math.max(1,r.height-nw))),
   ons=steps.map(function(s){return s.getBoundingClientRect().top+nw/2<=line});
  if(Math.abs(p-lastP)>.002){lastP=p;fill.style.transform="scaleY("+p.toFixed(3)+")"}
  steps.forEach(function(s,i){if(ons[i]!==s.classList.contains("on"))s.classList.toggle("on",ons[i])})}
 function q(){if(!raf)raf=requestAnimationFrame(paint)}
 if(RM||!IO){steps.forEach(function(s){s.classList.add("seen","on")});fill.style.transform="scaleY(1)"}
 else{
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("seen");so.unobserve(e.target)}})},{threshold:.1});
  steps.forEach(function(s){so.observe(s)});
  new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(inView)q()},{rootMargin:"120px 0px"}).observe(list);
  addEventListener("scroll",function(){if(inView)q()},{passive:true});
  addEventListener("resize",function(){measure();q()},{passive:true});
  paint()}}

/* ── Hero · carrusel de fondo: siempre la foto de mayor calidad disponible ──
   app.js declara sizes="40vw", así que en pantallas medianas el navegador elegía la copia de 480 px y la estiraba.
   Cada panel se ve a ~560 px de ancho: se fuerza la copia de 800 px, se cargan todas con prioridad baja (sin competir con el hero) y también las que se crean al redimensionar. */
(function(){
var T=document.querySelector("#hero .hx-trk");if(!T)return;
function up(im){if(!im||im.tagName!=="IMG"||im.dataset.q)return;im.dataset.q="1";
 if(im.getAttribute("srcset"))im.sizes="800px";
 im.loading="eager";im.decoding="async";try{im.fetchPriority="low"}catch(e){}}
function all(){[].forEach.call(T.querySelectorAll("img"),up)}
all();
if("MutationObserver" in window)new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(n.nodeType===1)n.tagName==="IMG"?up(n):[].forEach.call(n.querySelectorAll("img"),up)})})}).observe(T,{childList:true});
})();

/* ── Dónde estamos · mapa propio (Leaflet, copia local en js/vendor/leaflet) ──
   El mapa de Google en iframe no avisa cuando se lo mueve, por eso el cartel «1712» (una capa suelta encima) quedaba fijo en la pantalla mientras el mapa se desplazaba.
   Ahora el cartel es un marcador del mapa: siempre está sobre Gral. Galarza 1712, se mueva o se acerque lo que se mueva.
   Botón «Centrar» devuelve la vista a Chita. Si Leaflet o los mosaicos no cargan, vuelve al mapa de Google de antes. */
(function(){
var m=document.querySelector("#contacto .mp");if(!m)return;
var f=m.querySelector("iframe"),fb=f?(f.getAttribute("data-src")||""):"";
if(f)f.removeAttribute("data-src");                       /* el script inline y motion.js ya no cargan el iframe */
var LAT=-32.486865,LNG=-58.250318,Z=17,started=false;
function fallback(){m.classList.remove("lf");if(f&&fb&&!f.getAttribute("src")){f.setAttribute("src",fb);m.classList.add("rd")}}
function boot(){
 if(started)return;started=true;
 var css=document.createElement("link");css.rel="stylesheet";css.href="js/vendor/leaflet/leaflet.css";document.head.appendChild(css);
 var sc=document.createElement("script");sc.src="js/vendor/leaflet/leaflet.js";sc.async=true;sc.onload=build;sc.onerror=fallback;document.head.appendChild(sc)}
function build(){
 var map,box;
 try{
  if(!window.L)throw 0;
  var touch=matchMedia("(pointer:coarse)").matches;
  box=document.createElement("div");box.className="mp-lf";box.setAttribute("role","application");
  box.setAttribute("aria-label","Mapa: Chita Automotores, Gral. Galarza 1712, Concepción del Uruguay");
  m.insertBefore(box,m.firstChild);
  map=L.map(box,{zoomControl:false,scrollWheelZoom:false,dragging:!touch,touchZoom:!touch,minZoom:13,maxZoom:19,zoomSnap:1,worldCopyJump:false});
  map.attributionControl.setPrefix(false);
  var ll=L.latLng(LAT,LNG),errs=0,oks=0;
  var tl=L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:19,attribution:"© OpenStreetMap · © CARTO"}).addTo(map);
  tl.on("tileload",function(){oks++});
  tl.on("tileerror",function(){errs++;if(errs>6&&!oks){try{map.remove()}catch(e){}box.remove();var c=m.querySelector(".mp-ctl");if(c)c.remove();fallback()}});
  L.marker(ll,{interactive:false,keyboard:false,zIndexOffset:1000,icon:L.divIcon({className:"chita-pin",html:'<span class="cp"><i>Chita</i><b>1712</b></span>',iconSize:[0,0],iconAnchor:[0,0]})}).addTo(map);
  /* dónde queda el cartel dentro del mapa: a la derecha del panel de texto en escritorio, al centro en celular */
  function tgt(){var s=map.getSize(),w=innerWidth;return {x:s.x*(w>=1100?.68:w>=900?.62:.5),y:s.y*(w>=900?.62:.6)}}
  function center(anim){var s=map.getSize(),t=tgt(),z=Math.max(map.getZoom(),Z),p=map.project(ll,z).subtract([t.x-s.x/2,t.y-s.y/2]);map.setView(map.unproject(p,z),z,{animate:!!anim})}
  map.setView(ll,Z,{animate:false});center(false);
  /* controles propios: + / − / Centrar (encima de «Abrir en Google Maps») */
  var ctl=document.createElement("div");ctl.className="mp-ctl";
  ctl.innerHTML='<button type="button" class="mp-z" data-z="1" aria-label="Acercar">+</button><button type="button" class="mp-z" data-z="-1" aria-label="Alejar">−</button>'+
   '<button type="button" class="mp-c" aria-label="Centrar el mapa en Chita"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r="8"/></svg>Centrar</button>';
  m.appendChild(ctl);
  var bc=ctl.querySelector(".mp-c");
  function off(){var p=map.latLngToContainerPoint(ll),t=tgt(),far=Math.abs(p.x-t.x)>28||Math.abs(p.y-t.y)>28||map.getZoom()!==Z;bc.classList.toggle("off",far)}
  map.on("moveend zoomend",off);off();
  ctl.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;e.stopPropagation();
   if(b.classList.contains("mp-c")){map.stop();var s=map.getSize(),t=tgt(),p=map.project(ll,Z).subtract([t.x-s.x/2,t.y-s.y/2]);map.setView(map.unproject(p,Z),Z,{animate:true,duration:.6})}
   else map.setZoom(map.getZoom()+parseInt(b.getAttribute("data-z"),10))});
  /* el scroll de la página no debe «caer» dentro del mapa: la rueda y (en celular) el arrastre se activan al tocar el mapa */
  m.addEventListener("click",function(){map.scrollWheelZoom.enable();if(touch){map.dragging.enable();map.touchZoom.enable()}});
  m.addEventListener("mouseleave",function(){map.scrollWheelZoom.disable()});
  document.addEventListener("touchstart",function(e){if(touch&&!m.contains(e.target)){map.dragging.disable();map.touchZoom.disable()}},{passive:true});
  var rt=0;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){map.invalidateSize();if(!bc.classList.contains("off"))center(false);off()},180)},{passive:true});
  if(touch)m.classList.add("lf-touch");
  m.classList.add("lf","rd");
 }catch(e){try{if(map)map.remove()}catch(_){}if(box)box.remove();fallback()}
}
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();boot()}},{rootMargin:"1400px 0px"});io.observe(m)}
else addEventListener("load",function(){setTimeout(boot,800)});
})();
})();
