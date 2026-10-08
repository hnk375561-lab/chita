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
 var steps=[].slice.call(list.querySelectorAll(".tk-step")),inView=false,raf=0;
 function paint(){
  raf=0;
  var vh=innerHeight,r=list.getBoundingClientRect(),nw=parseFloat(getComputedStyle(list).getPropertyValue("--nw"))||68,
   line=vh*.62,p=(line-r.top-nw/2)/Math.max(1,r.height-nw);
  p=Math.max(0,Math.min(1,p));list.style.setProperty("--p",p.toFixed(3));
  steps.forEach(function(s){var b=s.getBoundingClientRect(),on=b.top+nw/2<=line;if(on!==s.classList.contains("on"))s.classList.toggle("on",on)})}
 function q(){if(!raf)raf=requestAnimationFrame(paint)}
 if(RM||!IO){steps.forEach(function(s){s.classList.add("seen","on")});list.style.setProperty("--p","1")}
 else{
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("seen");so.unobserve(e.target)}})},{threshold:.1});
  steps.forEach(function(s){so.observe(s)});
  new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(inView)q()},{rootMargin:"120px 0px"}).observe(list);
  addEventListener("scroll",function(){if(inView)q()},{passive:true});
  addEventListener("resize",q,{passive:true});
  paint()}}
})();
