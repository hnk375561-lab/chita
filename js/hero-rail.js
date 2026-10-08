/* CHITA · hero: rotación de las 3 miniaturas de la derecha (entregas e interiores).
   Cada recuadro pasa de foto con un fundido (la transición ya está en css/identidad.css: .hx-rs → opacity .5s).
   Solo se mueve mientras el hero está en pantalla y la pestaña visible; escalonado para que no cambien a la vez.
   Con «reducir movimiento» o ahorro de datos queda fija en la primera foto. */
(function(){
"use strict";
var hero=document.getElementById("hero");
if(!hero)return;
var tiles=[].slice.call(hero.querySelectorAll(".hx-rail .hx-rt")).map(function(t){
  return {el:t,slides:[].slice.call(t.querySelectorAll(".hx-rs")),i:0}}).filter(function(t){return t.slides.length>1});
if(!tiles.length)return;
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var cn=navigator.connection||{};if(cn.saveData)return;
var inView=true,paused=false,timers=[];
function show(t,n){
  var cur=t.slides[t.i],next=t.slides[n];
  var im=next.querySelector("img");if(im&&im.loading==="lazy")im.loading="eager";
  cur.classList.remove("on");next.classList.add("on");t.i=n}
function tick(t){if(inView&&!paused&&!document.hidden)show(t,(t.i+1)%t.slides.length)}
function start(){
  tiles.forEach(function(t,k){
    /* cada recuadro arranca desfasado y con un período distinto: no cambian los tres juntos */
    timers.push(setTimeout(function(){
      timers.push(setInterval(function(){tick(t)},2600+k*350))},1100+k*700))})}
if("IntersectionObserver" in window){
  new IntersectionObserver(function(es){inView=es[0].isIntersecting},{threshold:.1}).observe(hero)}
if(document.readyState==="complete")start();else addEventListener("load",start,{once:true});
})();
