/* CHITA · «Mirá el salón y el depósito» — sala de proyección.
   Un reel activo al centro (siempre en su versión HD 720×1280, sin recortes), los demás de costado con su cartel HD.
   Solo el reel activo descarga y decodifica video; los otros muestran su cartel. Autoplay silencioso al verse la sección,
   pasa solo al siguiente al terminar, pausa al salir de pantalla o al ocultar la pestaña. Respeta ahorro de datos y movimiento reducido. */
(function(){
var R=document.getElementById("sxs");if(!R)return;
var cards=[].slice.call(R.querySelectorAll(".pj")),n=cards.length;if(!n)return;
var segs=[].slice.call(R.querySelectorAll(".sxs-seg")),cap=R.querySelector(".sxs-cap"),
 bP=R.querySelector(".sxs-pp"),bS=R.querySelector(".sxs-snd"),bF=R.querySelector(".sxs-fs"),
 bPrev=R.querySelector(".sxs-prev"),bNext=R.querySelector(".sxs-next"),st=R.querySelector(".sxs-st"),
 amb=[].slice.call(document.querySelectorAll(".sxs-amb img")),
 RM=matchMedia("(prefers-reduced-motion:reduce)").matches,cn=navigator.connection||{},
 auto=!RM&&!cn.saveData,cur=-1,inView=false,hold=false,wantSound=false,ai=0,swiped=false;
function vid(i){return cards[i].querySelector("video")}
function off(i){var o=((i-cur)%n+n)%n;if(o>n/2)o-=n;return o}
function load(v){if(!v.getAttribute("src")){v.setAttribute("src",v.getAttribute("data-src"))}}
function stop(i){var v=vid(i);v.pause();v.removeAttribute("src");v.load();cards[i].classList.remove("is-playing","is-busy")}
function layout(){
 cards.forEach(function(c,i){var o=off(i),a=Math.abs(o);
  c.style.setProperty("--o",o);c.style.zIndex=String(20-a*3);
  c.classList.toggle("is-a",o===0);c.classList.toggle("is-far",a>2);
  c.setAttribute("aria-hidden",o===0?"false":"true");
  if(segs[i]){segs[i].style.setProperty("--p",o===0?0:(((i<cur)?1:0)));segs[i].setAttribute("aria-current",o===0?"true":"false");segs[i].classList.toggle("on",o===0)}});
}
function setAmb(i){
 var src=vid(i).getAttribute("poster"),nx=amb[ai^1],pv=amb[ai];if(!nx||!src)return;
 nx.onload=function(){nx.classList.add("on");if(pv)pv.classList.remove("on");ai^=1;nx.onload=null};
 nx.src=src}
function ui(){
 var v=vid(cur),pl=!v.paused&&!v.ended;
 R.classList.toggle("is-playing",pl);
 bP.setAttribute("aria-label",pl?"Pausar":"Reproducir");
 var snd=wantSound&&!v.muted;bS.setAttribute("aria-pressed",String(snd));bS.setAttribute("aria-label",snd?"Silenciar":"Activar sonido");R.classList.toggle("is-snd",snd);
 cards[cur].classList.toggle("is-playing",pl);
 if(cap&&cap.textContent!==cards[cur].getAttribute("data-t"))cap.textContent=cards[cur].getAttribute("data-t")}
function play(){
 var v=vid(cur);load(v);v.muted=!wantSound;v.loop=!auto;
 var p=v.play();
 if(p&&p.catch)p.catch(function(e){
  if(e&&e.name==="NotAllowedError"&&!v.muted){v.muted=true;wantSound=false;ui();var q=v.play();if(q&&q.catch)q.catch(function(){})}})}
/* mode: 0 automático · 1 el usuario eligió · 2 continuación al terminar un video */
function go(i,mode){
 i=(i%n+n)%n;if(i===cur)return;
 if(cur>=0)stop(cur);
 cur=i;layout();setAmb(i);
 var v=vid(i);v.muted=!wantSound;
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
 v.addEventListener("timeupdate",function(){if(i===cur&&v.duration>0&&segs[i])segs[i].style.setProperty("--p",(v.currentTime/v.duration).toFixed(4))});
 v.addEventListener("ended",function(){if(i===cur&&auto)go(cur+1,2)});
 v.addEventListener("error",function(){var lt=v.getAttribute("data-lite");
  if(i===cur&&lt&&v.getAttribute("src")===v.getAttribute("data-src")){v.setAttribute("src",lt);if(!hold)play()}})});

bP.addEventListener("click",toggle);
bPrev.addEventListener("click",function(){go(cur-1,1)});
bNext.addEventListener("click",function(){go(cur+1,1)});
segs.forEach(function(b,i){b.addEventListener("click",function(){if(i===cur){toggle()}else go(i,1)})});
bS.addEventListener("click",function(){var v=vid(cur);wantSound=!(wantSound&&!v.muted);v.muted=!wantSound;if(wantSound&&v.paused){hold=false;play()}ui()});
var canFs=!!(R.requestFullscreen||R.webkitRequestFullscreen||vid(0).webkitEnterFullscreen);
if(!canFs)bF.hidden=true;
bF.addEventListener("click",function(){
 var c=cards[cur],v=vid(cur),rq=c.requestFullscreen||c.webkitRequestFullscreen;
 hold=false;play();
 if(rq){var r=rq.call(c);if(r&&r.catch)r.catch(function(){})}else if(v.webkitEnterFullscreen){v.webkitEnterFullscreen()}});
cards.forEach(function(c){var x=c.querySelector(".pj-x");x.addEventListener("click",function(e){e.stopPropagation();(document.exitFullscreen||document.webkitExitFullscreen).call(document)})});

/* toque / clic en una tarjeta y deslizar para cambiar */
var sx0=0,down=false;
st.addEventListener("pointerdown",function(e){if(e.button>0)return;down=true;swiped=false;sx0=e.clientX});
st.addEventListener("pointermove",function(e){if(down&&Math.abs(e.clientX-sx0)>12)swiped=true});
function up(e){if(!down)return;down=false;var dx=e.clientX-sx0;if(Math.abs(dx)>46){swiped=true;go(cur+(dx<0?1:-1),1)}}
st.addEventListener("pointerup",up);st.addEventListener("pointercancel",function(){down=false});
st.addEventListener("click",function(e){
 if(swiped){swiped=false;return}
 if(e.target.closest(".pj-x"))return;
 var c=e.target.closest(".pj");if(!c)return;var i=cards.indexOf(c);
 if(i===cur)toggle();else go(i,1)});
R.addEventListener("keydown",function(e){
 if(e.key==="ArrowRight"){e.preventDefault();go(cur+1,1)}
 else if(e.key==="ArrowLeft"){e.preventDefault();go(cur-1,1)}
 else if((e.key===" "||e.key==="k")&&e.target===R){e.preventDefault();toggle()}});

/* inclinación 3D + reflejo en la tarjeta activa (solo mouse) */
if(!RM&&matchMedia("(hover:hover) and (pointer:fine)").matches){
 var raf=0,px=0,py=0;
 R.addEventListener("pointermove",function(e){
  if(e.pointerType!=="mouse")return;px=e.clientX;py=e.clientY;
  if(raf)return;raf=requestAnimationFrame(function(){raf=0;
   var b=cards[cur].querySelector(".pj-box"),r=b.getBoundingClientRect();
   var x=(px-r.left)/r.width,y=(py-r.top)/r.height;
   if(x<-.15||x>1.15||y<-.15||y>1.15){b.style.setProperty("--rx","0deg");b.style.setProperty("--ry","0deg");return}
   b.style.setProperty("--ry",((x-.5)*9).toFixed(2)+"deg");b.style.setProperty("--rx",(-(y-.5)*9).toFixed(2)+"deg");
   b.style.setProperty("--gx",(x*100).toFixed(1)+"%");b.style.setProperty("--gy",(y*100).toFixed(1)+"%")})});
 R.addEventListener("pointerleave",function(){var b=cards[cur].querySelector(".pj-box");b.style.setProperty("--rx","0deg");b.style.setProperty("--ry","0deg")})}

document.addEventListener("fullscreenchange",function(){R.classList.toggle("is-fs",!!document.fullscreenElement)});
document.addEventListener("webkitfullscreenchange",function(){R.classList.toggle("is-fs",!!document.webkitFullscreenElement)});

if("IntersectionObserver" in window){
 new IntersectionObserver(function(es){inView=es[0].isIntersecting;var v=vid(cur);
  if(inView&&auto&&!hold&&v.paused&&!document.hidden)play();
  else if(!inView&&!v.paused&&!document.fullscreenElement)v.pause()},{threshold:.35}).observe(R)}
else inView=true;
document.addEventListener("visibilitychange",function(){var v=vid(cur);
 if(document.hidden){if(!v.paused)v.pause()}
 else if(inView&&auto&&!hold&&v.paused)play()});

go(0,-1);
})();
