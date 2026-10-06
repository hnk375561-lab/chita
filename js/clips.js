/* CHITA · videos del salón (.clip): carga al acercarse, loop silencioso al entrar en pantalla, pausa al salir.
   Tocar el video lo pausa o lo retoma; el botón activa el sonido. Un solo clip con sonido a la vez.
   Respeta movimiento reducido y ahorro de datos (no se reproduce solo). */
(function(){
var clips=[].slice.call(document.querySelectorAll(".clip"));if(!clips.length)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd;
var vids=[];
clips.forEach(function(f){
  var v=f.querySelector("video"),b=f.querySelector(".clip-b"),box=f.querySelector(".clip-v");if(!v||!b)return;
  var manual=false;vids.push(v);
  function load(){if(!v.src&&v.getAttribute("data-src"))v.src=v.getAttribute("data-src")}
  function play(){load();var p=v.play();if(p&&p.catch)p.catch(function(){})}
  function label(){b.textContent=v.paused?"Reproducir":(v.muted?"Activar sonido":"Silenciar");b.setAttribute("aria-pressed",String(!v.paused&&!v.muted))}
  function solo(){vids.forEach(function(o){if(o!==v&&!o.muted)o.muted=true})}
  b.addEventListener("click",function(){
    if(v.paused){manual=false;v.muted=false;solo();play()}
    else{v.muted=!v.muted;if(!v.muted)solo()}
    label()});
  box.addEventListener("click",function(){if(v.paused){manual=false;play()}else{manual=true;v.pause()}});
  ["play","pause","volumechange"].forEach(function(e){v.addEventListener(e,label)});
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(e){var vis=e[0].isIntersecting;
      if(vis&&auto&&!manual&&v.paused)play();
      else if(!vis&&!v.paused)v.pause()},{threshold:.35}).observe(f)}
  label();
});
})();
