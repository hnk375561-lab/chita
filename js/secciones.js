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

/* ── Dónde estamos · mapa propio (MapLibre GL, copia local en js/vendor/maplibre) ──
   El mapa de Google en iframe no avisa cuando se lo mueve, por eso el cartel «1712» (una capa suelta encima) quedaba fijo en la pantalla mientras el mapa se desplazaba.
   Ahora el cartel es un marcador del mapa: siempre está sobre Gral. Galarza 1712, se mueva o se acerque lo que se mueva.
   Mapa vectorial (OpenFreeMap, sin clave): nítido a cualquier zoom y dibujado por la GPU, sin mosaicos de imagen. Botón «Centrar» devuelve la vista a Chita.
   Si la librería o el estilo no cargan en unos segundos, vuelve al mapa de Google de antes. */
(function(){
var m=document.querySelector("#contacto .mp");if(!m)return;
var f=m.querySelector("iframe"),fb=f?(f.getAttribute("data-src")||""):"";
if(f)f.removeAttribute("data-src");                       /* el script inline y motion.js ya no cargan el iframe */
var LAT=-32.486865,LNG=-58.250318,Z=17,STYLE="https://tiles.openfreemap.org/styles/liberty",started=false;
function fallback(){m.classList.remove("lf");if(f&&fb&&!f.getAttribute("src")){f.setAttribute("src",fb);m.classList.add("rd")}}
function boot(){
 if(started)return;started=true;
 var css=document.createElement("link");css.rel="stylesheet";css.href="js/vendor/maplibre/maplibre-gl.css";document.head.appendChild(css);
 var sc=document.createElement("script");sc.src="js/vendor/maplibre/maplibre-gl.js";sc.async=true;sc.onload=build;sc.onerror=fallback;document.head.appendChild(sc)}
function build(){
 var map,box,ctl,dead=false,timer=0;
 function bail(){if(dead)return;dead=true;clearTimeout(timer);try{if(map)map.remove()}catch(e){}if(box)box.remove();if(ctl)ctl.remove();fallback()}
 try{
  if(!window.maplibregl||!maplibregl.supported||!maplibregl.supported())throw 0;
  var touch=matchMedia("(pointer:coarse)").matches;
  box=document.createElement("div");box.className="mp-lf";box.setAttribute("role","application");
  box.setAttribute("aria-label","Mapa: Chita Automotores, Gral. Galarza 1712, Concepción del Uruguay");
  m.insertBefore(box,m.firstChild);
  map=new maplibregl.Map({container:box,style:STYLE,center:[LNG,LAT],zoom:Z,minZoom:12,maxZoom:19.5,
   attributionControl:false,dragRotate:false,pitchWithRotate:false,touchPitch:false,scrollZoom:false,dragPan:!touch,
   pixelRatio:Math.min(window.devicePixelRatio||1,2),fadeDuration:0,renderWorldCopies:false});
  map.touchZoomRotate.disableRotation();
  if(touch)map.touchZoomRotate.disable();
  map.addControl(new maplibregl.AttributionControl({compact:false}),"bottom-right");
  var ll=new maplibregl.LngLat(LNG,LAT);
  /* dónde queda el cartel dentro del mapa: a la derecha del panel de texto en escritorio, al centro en celular.
     Se logra con «padding» (corre el centro del mapa), así el zoom y «Centrar» respetan la misma posición. */
  function tgt(){var w=box.clientWidth||innerWidth,h=box.clientHeight||600,iw=innerWidth;return {w:w,h:h,x:w*(iw>=1100?.68:iw>=900?.62:.5),y:h*(iw>=900?.62:.6)}}
  function pad(){var t=tgt();map.setPadding({left:Math.max(0,Math.round(2*t.x-t.w)),right:Math.max(0,Math.round(t.w-2*t.x)),top:Math.max(0,Math.round(2*t.y-t.h)),bottom:Math.max(0,Math.round(t.h-2*t.y))})}
  pad();map.jumpTo({center:ll,zoom:Z});
  /* cartel «1712»: marcador anclado a la coordenada */
  var el=document.createElement("div");el.className="chita-pin";el.innerHTML='<span class="cp"><i>Chita</i><b>1712</b></span>';
  new maplibregl.Marker({element:el,anchor:"bottom"}).setLngLat(ll).addTo(map);
  /* controles propios: + / − / Centrar (encima de «Abrir en Google Maps») */
  ctl=document.createElement("div");ctl.className="mp-ctl";
  ctl.innerHTML='<button type="button" class="mp-z" data-z="1" aria-label="Acercar">+</button><button type="button" class="mp-z" data-z="-1" aria-label="Alejar">−</button>'+
   '<button type="button" class="mp-c" aria-label="Centrar el mapa en Chita"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r="8"/></svg>Centrar</button>';
  m.appendChild(ctl);
  var bc=ctl.querySelector(".mp-c");
  function off(){var p=map.project(ll),t=tgt(),far=Math.abs(p.x-t.x)>28||Math.abs(p.y-t.y)>28||Math.abs(map.getZoom()-Z)>.05;bc.classList.toggle("off",far)}
  map.on("moveend",off);
  ctl.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;e.stopPropagation();
   if(b.classList.contains("mp-c"))map.easeTo({center:ll,zoom:Z,duration:650,essential:true});
   else{if(b.getAttribute("data-z")==="1")map.zoomIn({duration:250});else map.zoomOut({duration:250})}});
  /* el scroll de la página no debe «caer» dentro del mapa: la rueda y (en celular) el arrastre se activan al tocar el mapa */
  m.addEventListener("click",function(){map.scrollZoom.enable();if(touch){map.dragPan.enable();map.touchZoomRotate.enable();map.touchZoomRotate.disableRotation()}});
  m.addEventListener("mouseleave",function(){map.scrollZoom.disable()});
  document.addEventListener("touchstart",function(e){if(touch&&!m.contains(e.target)){map.dragPan.disable();map.touchZoomRotate.disable()}},{passive:true});
  var rt=0;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){var far=bc.classList.contains("off");map.resize();pad();if(!far)map.jumpTo({center:ll,zoom:Z});off()},180)},{passive:true});
  if(touch)m.classList.add("lf-touch");
  map.once("load",function(){clearTimeout(timer);if(dead)return;m.classList.add("lf","rd");off()});
  map.on("error",function(e){if(!map.loaded()&&!m.classList.contains("lf")&&e&&e.error&&/style|Failed|NetworkError/i.test(String(e.error.message||e.error)))bail()});
  timer=setTimeout(function(){if(!m.classList.contains("lf"))bail()},9000);
 }catch(e){bail()}
}
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();boot()}},{rootMargin:"1400px 0px"});io.observe(m)}
else addEventListener("load",function(){setTimeout(boot,800)});
})();
})();
