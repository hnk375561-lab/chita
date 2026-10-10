/* CHITA · videos del salón (.clip): carga al acercarse, loop silencioso al entrar en pantalla, pausa al salir.
   Tocar el video lo pausa o lo retoma; el botón activa el sonido. Un solo clip con sonido a la vez.
   Respeta movimiento reducido y ahorro de datos (no se reproduce solo).
   PERF: el video recién arranca si se queda a la vista ~350 ms (no se descarga ni decodifica mientras se pasa de largo
   scrolleando) y todos se pausan cuando se oculta la pestaña. */
(function(){
var clips=[].slice.call(document.querySelectorAll(".clip"));if(!clips.length)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd;
var vids=[],DELAY=350;
/* PERF · un solo IntersectionObserver para todos los clips (mismo umbral); antes había uno por clip. */
var hs=new Map(),sio="IntersectionObserver" in window&&new IntersectionObserver(function(es){es.forEach(function(e){var h=hs.get(e.target);if(h)h(e)})},{threshold:.35});
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
  if(sio){
    hs.set(f,function(e){
      inView=e.isIntersecting;clearTimeout(timer);
      if(inView&&auto&&!manual&&v.paused&&!document.hidden)timer=setTimeout(function(){if(inView&&!document.hidden&&v.paused&&!manual)play()},DELAY);
      else if(!inView&&!v.paused)v.pause()});
    sio.observe(f)}
  document.addEventListener("visibilitychange",function(){
    if(document.hidden){clearTimeout(timer);if(!v.paused)v.pause()}
    else if(inView&&auto&&!manual&&v.paused)play()});
  label();
});
})();

/* PERF · Financiación: el fondo (images/bg-fin.webp) se baja y se decodifica ANTES de llegar a la sección (a ~2 pantallas),
   así no se decodifica en el primer frame en que aparece, que era el tirón «al llegar». */
(function(){
var s=document.getElementById("financiacion"),H=document.documentElement,K="bg-fin";if(!s||!("IntersectionObserver" in window)){H.classList.add(K);return}
var nc=navigator.connection||{},lo=nc.saveData||/(^|-)2g$|3g/.test(nc.effectiveType||"");
var io=new IntersectionObserver(function(e){if(!e.some(function(x){return x.isIntersecting}))return;io.disconnect();
  var im=new Image(),on=function(){H.classList.add(K)};im.decoding="async";im.src="images/bg-fin.webp";if(im.decode)im.decode().then(on,on);else im.onload=im.onerror=on},{rootMargin:(lo?"300px":innerWidth<900?"800px":"1600px")+" 0px"});
io.observe(s);
})();

/* PERF · Visita: mismo criterio que Financiación. El fondo (images/bg-visita.webp, 1440x2128) se baja y decodifica antes de llegar,
   para que no se decodifique en el primer frame en que aparece la sección. */
(function(){
var s=document.getElementById("visita"),H=document.documentElement,K="bg-visita";if(!s||!("IntersectionObserver" in window)){H.classList.add(K);return}
var nc=navigator.connection||{},lo=nc.saveData||/(^|-)2g$|3g/.test(nc.effectiveType||"");
var io=new IntersectionObserver(function(e){if(!e.some(function(x){return x.isIntersecting}))return;io.disconnect();
  var im=new Image(),on=function(){H.classList.add(K)};im.decoding="async";im.src="images/bg-visita.webp";if(im.decode)im.decode().then(on,on);else im.onload=im.onerror=on},{rootMargin:(lo?"300px":innerWidth<900?"800px":"1600px")+" 0px"});
io.observe(s);
})();

/* PERF · Guía: mismo criterio que Financiación y Visita. El fondo (images/bg-guia.webp, 1440x1600) se baja y decodifica antes de llegar. */
(function(){
var s=document.getElementById("guia"),H=document.documentElement,K="bg-guia";if(!s||!("IntersectionObserver" in window)){H.classList.add(K);return}
var nc=navigator.connection||{},lo=nc.saveData||/(^|-)2g$|3g/.test(nc.effectiveType||"");
var io=new IntersectionObserver(function(e){if(!e.some(function(x){return x.isIntersecting}))return;io.disconnect();
  var im=new Image(),on=function(){H.classList.add(K)};im.decoding="async";im.src="images/bg-guia.webp";if(im.decode)im.decode().then(on,on);else im.onload=im.onerror=on},{rootMargin:(lo?"300px":innerWidth<900?"800px":"1600px")+" 0px"});
io.observe(s);
})();

/* PERF · Multimedia: las fotos del hero, de Entregas y de las tarjetas de Unidades eran loading="lazy" y se pedían y decodificaban recién
   cuando se acercaban mientras se scrolleaba (en la grabación de rendimiento: pedidos de fotos en pleno scroll y tirones de ~40 ms).
   Ahora, con la página cargada, se piden y se decodifican de a una en ratos libres: hero primero, después Entregas y después las tarjetas.
   Si se está scrolleando, espera a que pare (no compite con el scroll). Con ahorro de datos o conexión lenta no hace nada. */
(function(){
var nc=navigator.connection||{};if(nc.saveData||/(^|-)2g$|3g/.test(nc.effectiveType||""))return;
var ric=window.requestIdleCallback||function(f){return setTimeout(function(){f({timeRemaining:function(){return 8}})},140)};
var q=[],big=matchMedia("(min-width:900px)").matches,last=0;
addEventListener("scroll",function(){last=performance.now()},{passive:true});
function add(l,max){[].slice.call(l,0,max||l.length).forEach(function(i){q.push(i)})}
function step(){
  if(!q.length)return;
  if(performance.now()-last<250||document.hidden){setTimeout(step,250);return}
  var im=q.shift();
  if(im.loading==="lazy")im.loading="eager";
  var go=function(){ric(step,{timeout:2500})};
  if(im.decode)im.decode().then(go,go);else go()}
function start(){
  add(document.querySelectorAll("#hero .hx-rail img"));
  var trk=document.querySelectorAll("#hero .hx-trk img"),tk=document.querySelector("#hero .hx-trk"),tn=tk?parseInt(tk.style.getPropertyValue("--n"),10):0;add(trk,tn||Math.ceil(trk.length/2));
  if(big){add(document.querySelectorAll("#entregas .eg img"));add(document.querySelectorAll("#stockGrid .car .ct img:first-child"),28)}
  ric(step,{timeout:3000})}
if(document.readyState==="complete")setTimeout(start,1200);else addEventListener("load",function(){setTimeout(start,1200)});
})();
