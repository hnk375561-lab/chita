/* CHITA · videos del salón (.clip): carga al acercarse, loop silencioso al entrar en pantalla, pausa al salir.
   Tocar el video lo pausa o lo retoma; el botón activa el sonido. Un solo clip con sonido a la vez.
   Respeta movimiento reducido y ahorro de datos (no se reproduce solo).
   PERF: el video recién arranca si se queda a la vista ~350 ms (no se descarga ni decodifica mientras se pasa de largo
   scrolleando) y todos se pausan cuando se oculta la pestaña. */
(function(){
var clips=[].slice.call(document.querySelectorAll(".clip"));if(!clips.length)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd;
var vids=[],DELAY=350;
clips.forEach(function(f){
  var v=f.querySelector("video"),b=f.querySelector(".clip-b"),box=f.querySelector(".clip-v");if(!v||!b)return;
  var manual=false,timer=0,inView=false;vids.push(v);
  v.disablePictureInPicture=true;
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
    new IntersectionObserver(function(e){
      inView=e[0].isIntersecting;clearTimeout(timer);
      if(inView&&auto&&!manual&&v.paused&&!document.hidden)timer=setTimeout(function(){if(inView&&!document.hidden&&v.paused&&!manual)play()},DELAY);
      else if(!inView&&!v.paused)v.pause()},{threshold:.35}).observe(f)}
  document.addEventListener("visibilitychange",function(){
    if(document.hidden){clearTimeout(timer);if(!v.paused)v.pause()}
    else if(inView&&auto&&!manual&&v.paused)play()});
  label();
});
})();

/* PERF · Financiación: el fondo (images/bg-fin.webp) se baja y se decodifica ANTES de llegar a la sección (a ~2 pantallas),
   así no se decodifica en el primer frame en que aparece, que era el tirón «al llegar». */
(function(){
var s=document.getElementById("financiacion");if(!s||!("IntersectionObserver" in window))return;
var sd=navigator.connection&&navigator.connection.saveData;
var io=new IntersectionObserver(function(e){if(!e.some(function(x){return x.isIntersecting}))return;io.disconnect();
  var im=new Image();im.decoding="async";im.src="images/bg-fin.webp";if(im.decode)im.decode().catch(function(){})},{rootMargin:(sd?"300px":"2200px")+" 0px"});
io.observe(s);
})();

/* PERF · Visita: mismo criterio que Financiación. El fondo (images/bg-visita.webp, 1440x2128) se baja y decodifica antes de llegar,
   para que no se decodifique en el primer frame en que aparece la sección. */
(function(){
var s=document.getElementById("visita");if(!s||!("IntersectionObserver" in window))return;
var sd=navigator.connection&&navigator.connection.saveData;
var io=new IntersectionObserver(function(e){if(!e.some(function(x){return x.isIntersecting}))return;io.disconnect();
  var im=new Image();im.decoding="async";im.src="images/bg-visita.webp";if(im.decode)im.decode().catch(function(){})},{rootMargin:(sd?"300px":"2200px")+" 0px"});
io.observe(s);
})();
