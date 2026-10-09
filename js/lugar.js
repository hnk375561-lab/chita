/* CHITA · «Conocé el lugar» — carrusel de videos verticales + fotos del frente.
   Un solo video activo: el resto muestra su póster y no descarga ni decodifica nada.
   Autoplay silencioso al verse (≥35 %), pasa solo al siguiente, pausa al salir de pantalla o al ocultar la pestaña.
   Respeta ahorro de datos y movimiento reducido. Sin inclinación 3D ni escrituras por frame. */
(function(){
"use strict";
var R=document.getElementById("lzr");
if(R){
var cards=[].slice.call(R.querySelectorAll(".lz-card")),n=cards.length;
if(n){
var segs=[].slice.call(R.querySelectorAll(".lz-seg")),cap=R.querySelector(".lz-cap"),
 bP=R.querySelector(".lz-pp"),bS=R.querySelector(".lz-snd"),bF=R.querySelector(".lz-fs"),
 bPrev=R.querySelector(".lz-prev"),bNext=R.querySelector(".lz-next"),st=R.querySelector(".lz-stage"),
 RM=matchMedia("(prefers-reduced-motion:reduce)").matches,cn=navigator.connection||{},
 auto=!RM&&!cn.saveData,cur=-1,inView=false,hold=false,wantSound=false,swiped=false,lastP=[];
function vid(i){return cards[i].querySelector("video")}
function off(i){var o=((i-cur)%n+n)%n;if(o>n/2)o-=n;return o}
function stop(i){var v=vid(i);v.pause();if(v.getAttribute("src")){v.removeAttribute("src");v.load()}
 cards[i].classList.remove("is-playing","is-busy","is-live")}
function layout(){
 cards.forEach(function(c,i){var o=off(i),a=Math.abs(o);
  c.style.setProperty("--o",o);c.style.zIndex=String(10-a);
  c.setAttribute("data-d",a>3?3:a);
  c.classList.toggle("is-a",o===0);c.setAttribute("aria-hidden",o===0?"false":"true");
  if(segs[i]){setP(i,o===0?0:(i<cur?1:0));segs[i].setAttribute("aria-current",o===0?"true":"false");segs[i].classList.toggle("on",o===0)}})}
function setP(i,p){p=Math.round(p*200)/200;if(lastP[i]===p)return;lastP[i]=p;segs[i].style.setProperty("--p",p)}
function ui(){
 var v=vid(cur),pl=!v.paused&&!v.ended;
 R.classList.toggle("is-playing",pl);
 bP.setAttribute("aria-label",pl?"Pausar":"Reproducir");
 var snd=wantSound&&!v.muted;
 bS.setAttribute("aria-pressed",String(snd));bS.setAttribute("aria-label",snd?"Silenciar":"Activar sonido");R.classList.toggle("is-snd",snd);
 cards[cur].classList.toggle("is-playing",pl);
 var t=cards[cur].getAttribute("data-t");if(cap&&cap.textContent!==t)cap.textContent=t}
function play(){
 var v=vid(cur);
 if(!v.getAttribute("src"))v.setAttribute("src",v.getAttribute("data-src"));
 v.muted=!wantSound;v.loop=!auto;
 var p=v.play();
 if(p&&p.catch)p.catch(function(e){
  if(e&&e.name==="NotAllowedError"&&!v.muted){v.muted=true;wantSound=false;ui();var q=v.play();if(q&&q.catch)q.catch(function(){})}})}
/* mode: 0 automático · 1 elección del usuario · 2 continuación al terminar un video */
function go(i,mode){
 i=(i%n+n)%n;if(i===cur)return;
 if(cur>=0)stop(cur);
 cur=i;layout();
 vid(i).muted=!wantSound;
 if(mode===1)hold=false;
 ui();
 if(mode===1||(mode===2&&inView&&!document.hidden)||(mode===0&&auto&&inView&&!hold))play()}
function toggle(){var v=vid(cur);if(v.paused){hold=false;play()}else{hold=true;v.pause()}}

cards.forEach(function(c,i){
 var v=c.querySelector("video");v.disablePictureInPicture=true;
 v.addEventListener("playing",function(){c.classList.remove("is-busy");c.classList.add("is-live");if(i===cur)ui()});
 v.addEventListener("waiting",function(){if(i===cur&&!v.paused)c.classList.add("is-busy")});
 v.addEventListener("canplay",function(){c.classList.remove("is-busy")});
 ["play","pause","volumechange"].forEach(function(e){v.addEventListener(e,function(){if(i===cur)ui()})});
 v.addEventListener("timeupdate",function(){if(i===cur&&v.duration>0&&segs[i])setP(i,v.currentTime/v.duration)});
 v.addEventListener("ended",function(){if(i===cur&&auto)go(cur+1,2)});
 v.addEventListener("error",function(){var lt=v.getAttribute("data-lite");
  if(i===cur&&lt&&v.getAttribute("src")===v.getAttribute("data-src")){v.setAttribute("src",lt);if(!hold)play()}});
 var x=c.querySelector(".lz-x");
 if(x)x.addEventListener("click",function(e){e.stopPropagation();(document.exitFullscreen||document.webkitExitFullscreen).call(document)})});

bP.addEventListener("click",toggle);
bPrev.addEventListener("click",function(){go(cur-1,1)});
bNext.addEventListener("click",function(){go(cur+1,1)});
segs.forEach(function(b,i){b.addEventListener("click",function(){if(i===cur)toggle();else go(i,1)})});
bS.addEventListener("click",function(){var v=vid(cur);wantSound=!(wantSound&&!v.muted);v.muted=!wantSound;if(wantSound&&v.paused){hold=false;play()}ui()});
var canFs=!!(R.requestFullscreen||R.webkitRequestFullscreen||vid(0).webkitEnterFullscreen);
if(!canFs)bF.hidden=true;
bF.addEventListener("click",function(){
 var c=cards[cur],v=vid(cur),rq=c.requestFullscreen||c.webkitRequestFullscreen;
 hold=false;play();
 if(rq){var r=rq.call(c);if(r&&r.catch)r.catch(function(){})}else if(v.webkitEnterFullscreen){v.webkitEnterFullscreen()}});

/* deslizar para cambiar · tocar una tarjeta lateral la trae al centro, tocar la central pausa o reanuda */
var sx0=0,down=false;
st.addEventListener("pointerdown",function(e){if(e.button>0)return;down=true;swiped=false;sx0=e.clientX});
st.addEventListener("pointermove",function(e){if(down&&Math.abs(e.clientX-sx0)>12)swiped=true});
st.addEventListener("pointerup",function(e){if(!down)return;down=false;var dx=e.clientX-sx0;if(Math.abs(dx)>46){swiped=true;go(cur+(dx<0?1:-1),1)}});
st.addEventListener("pointercancel",function(){down=false});
st.addEventListener("click",function(e){
 if(swiped){swiped=false;return}
 if(e.target.closest(".lz-x"))return;
 var c=e.target.closest(".lz-card");if(!c)return;
 var i=cards.indexOf(c);if(i===cur)toggle();else go(i,1)});
R.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"){e.preventDefault();go(cur+1,1)}
 else if(e.key==="ArrowLeft"){e.preventDefault();go(cur-1,1)}
 else if((e.key===" "||e.key==="k")&&e.target===R){e.preventDefault();toggle()}});

function fsc(){R.classList.toggle("is-fs",!!(document.fullscreenElement||document.webkitFullscreenElement))}
document.addEventListener("fullscreenchange",fsc);document.addEventListener("webkitfullscreenchange",fsc);

if("IntersectionObserver" in window){
 new IntersectionObserver(function(es){inView=es[0].isIntersecting;var v=vid(cur);
  if(inView&&auto&&!hold&&v.paused&&!document.hidden)play();
  else if(!inView&&!v.paused&&!document.fullscreenElement&&!document.webkitFullscreenElement)v.pause()},{threshold:.35}).observe(R)}
else inView=true;
document.addEventListener("visibilitychange",function(){var v=vid(cur);
 if(document.hidden){if(!v.paused)v.pause()}
 else if(inView&&auto&&!hold&&v.paused)play()});

go(0,-1);
}}

/* fotos del frente: ampliar en un diálogo nativo (foco, Esc y fondo ya resueltos por el navegador) */
var lb=document.getElementById("lzlb");
if(lb&&typeof lb.showModal==="function"){
 var li=lb.querySelector("img"),lc=lb.querySelector("p");
 [].forEach.call(document.querySelectorAll(".lz-fig button"),function(b){
  b.addEventListener("click",function(){
   li.src=b.getAttribute("data-big");li.alt=b.getAttribute("data-alt")||"";lc.textContent=b.getAttribute("data-cap")||"";lb.showModal()})});
 lb.querySelector("button").addEventListener("click",function(){lb.close()});
 lb.addEventListener("click",function(e){if(e.target===lb)lb.close()});
 lb.addEventListener("close",function(){li.removeAttribute("src")})}
else{[].forEach.call(document.querySelectorAll(".lz-fig button"),function(b){b.style.cursor="default"})}
})();
