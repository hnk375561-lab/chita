/* CHITA · rótulo de sección actual + menú marcado.
   PERF: antes corría en CADA frame de scroll (getBoundingClientRect de todas las secciones + recorrer el menú).
   Ahora un IntersectionObserver avisa solo cuando cambia la sección que cruza la línea del 40 % de la pantalla. */
(function(){
var S=[].slice.call(document.querySelectorAll("main>section[id]"));if(!S.length)return;
var N={entregas:"Entregas",unidades:"Unidades","catalogo-comparador":"Modelos",contacto:"Dónde estamos",opiniones:"Reseñas","como-comprar":"Cómo comprar",financiacion:"Financiación",operaciones:"Vender o permutar",guia:"Guía",visita:"Visita",preguntas:"Preguntas"};
var AL={entregas:"unidades","catalogo-comparador":"unidades",financiacion:"como-comprar",guia:"como-comprar",visita:"contacto",opiniones:"contacto",local:"contacto"};
var c=document.createElement("div");c.className="cl";c.setAttribute("aria-hidden","true");c.innerHTML="<b hidden></b>";/* tarjeta inferior izquierda eliminada: ya no se agrega al documento; el menú sigue marcándose */
var lab=c.firstChild,cur="",links=[].slice.call(document.querySelectorAll("header nav a")),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function show(id){
 if(id===cur)return;cur=id;
 if(!id){lab.hidden=true;return}
 lab.hidden=false;lab.textContent=N[id]||id;
 for(var j=0;j<links.length;j++){
  var a=links[j],h=a.getAttribute("href"),on=h==="#"+id||(!!AL[id]&&h==="#"+AL[id]);
  a.classList.toggle("on",on);
  if(on){var n=a.closest("nav");if(n&&n.scrollWidth>n.clientWidth+4)n.scrollTo({left:a.offsetLeft-n.clientWidth/2+a.offsetWidth/2,behavior:RM?"auto":"smooth"})}
 }
}
if(!("IntersectionObserver" in window))return;
var live={};
var io=new IntersectionObserver(function(es){
 es.forEach(function(e){if(e.isIntersecting)live[e.target.id]=1;else delete live[e.target.id]});
 var id="";for(var i=0;i<S.length;i++){if(live[S[i].id]){id=S[i].id;break}}
 show(id);
},{rootMargin:"-40% 0px -59% 0px",threshold:0});
S.forEach(function(s){io.observe(s)});
})();
/* CHITA · Reel del hero (v58): arranca apenas pinta el poster (no espera a "load"), elige versión HD o liviana según la conexión,
   pausa fuera de pantalla o con la pestaña oculta, y el botón de sonido refleja el estado real del video (volumechange / waiting / error). */
(function(){
var f=document.getElementById("reel"),v=document.getElementById("reelv"),b=document.getElementById("reelb");if(!f||!v||!b)return;
var t=b.querySelector(".rs-t")||b,px=f.querySelector(".reel-px"),
 RM=matchMedia("(prefers-reduced-motion:reduce)").matches,cn=navigator.connection||{},
 slow=/(^|-)2g$/.test(cn.effectiveType||""),
 auto=!RM&&!cn.saveData,vis=false,manual=false,asked=false,tried=0,kicked=false;
/* v60: pasada de varios clips (data-playlist / data-playlist-lite / data-titles, separados por «|»). Con un solo clip se comporta como antes (loop). */
var L=(v.getAttribute("data-playlist")||"").split("|").filter(Boolean),LL=(v.getAttribute("data-playlist-lite")||"").split("|"),TT=(v.getAttribute("data-titles")||"").split("|"),cur=0,cap=document.getElementById("reelcap");
if(!L.length)L=[v.getAttribute("data-src")];
function mk(){var hd=L[cur],lt=LL[cur]||v.getAttribute("data-lite");return [slow&&lt,hd,lt].filter(Boolean).filter(function(x,i,a){return a.indexOf(x)===i})}
var S=mk();
if(L.length>1)v.loop=false;
function nextClip(){cur=(cur+1)%L.length;S=mk();tried=0;v.removeAttribute("src");if(cap&&TT[cur])cap.textContent=TT[cur];play()}
v.addEventListener("ended",function(){if(L.length>1)nextClip()});
function load(){if(!v.getAttribute("src")&&S[tried]){v.preload="auto";v.src=S[tried]}}
function ui(){
 var on=!v.muted,busy=on&&asked&&!v.error&&v.readyState<3;
 t.textContent=v.error&&tried>=S.length-1&&asked?"Video no disponible":busy?"Cargando…":on?"Silenciar":"Escuchá el salón";
 b.setAttribute("aria-pressed",String(on&&!v.paused));
 f.setAttribute("data-sound",on?"on":"off");f.classList.toggle("is-busy",!!busy)}
function play(){load();var p=v.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==="NotAllowedError"&&!v.muted){v.muted=true;ui();var q=v.play();if(q&&q.catch)q.catch(function(){})}})}
function kick(){if(kicked)return;kicked=true;if(auto&&vis&&!manual)play()}
function whenReady(){
 var fired=false,go=function(){if(fired)return;fired=true;(window.requestIdleCallback||function(c){setTimeout(c,200)})(kick,{timeout:900})};
 var after=function(){if(document.readyState==="complete")go();else{addEventListener("load",go,{once:true});setTimeout(go,2500)}};
 if(px&&!px.complete)px.addEventListener("load",after,{once:true});else after()}
v.addEventListener("playing",function(){f.classList.add("is-live");ui()});
["play","pause","volumechange","waiting","canplay","stalled","loadeddata"].forEach(function(e){v.addEventListener(e,ui)});
v.addEventListener("error",function(){
 if(tried<S.length-1){tried++;v.removeAttribute("src");load();if(asked||(vis&&auto&&!manual))play()}
 ui()});
b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();
 if(!v.muted&&!v.paused){v.muted=true;ui();return}
 asked=true;manual=false;v.muted=false;v.volume=1;
 if(v.error){tried=0;v.removeAttribute("src");v.load()}
 ui();play()});
f.addEventListener("click",function(e){if(e.target===b||b.contains(e.target))return;
 if(!v.getAttribute("src"))return;if(v.paused){manual=false;play()}else{manual=true;v.pause()}});
if("IntersectionObserver" in window){
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;
  if(vis&&auto&&!manual&&kicked&&v.paused)play();
  else if(!vis&&!v.paused)v.pause()},{threshold:.2}).observe(f)}
else{vis=true}
document.addEventListener("visibilitychange",function(){
 if(document.hidden){if(!v.paused)v.pause()}
 else if(vis&&auto&&!manual&&kicked&&v.paused)play()});
/* PERF: con el hero fijo y Entregas encima, el reel seguía "a la vista" para el IntersectionObserver y se decodificaba tapado. */
document.addEventListener("chita:hero-idle",function(e){var i=e.detail&&e.detail.idle;
 if(i){if(!v.paused)v.pause()}else if(vis&&auto&&!manual&&kicked&&v.paused&&!document.hidden)play()});
whenReady();ui();
})();
/* CHITA · video de Visita: loop silencioso al entrar en pantalla, pausa al salir, botón propio (respeta movimiento reducido y ahorro de datos) */
(function(){
var f=document.querySelector("#visita .vvid"),v=f&&f.querySelector("video"),b=f&&f.querySelector(".vv-b");if(!v||!b)return;
var sb=f.querySelector(".vv-s"),sbt=sb&&sb.querySelector(".vv-st"),ck=0;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd,manual=false;
function label(){b.textContent=v.paused?"Reproducir":"Pausar";b.setAttribute("aria-pressed",String(!v.paused))}
function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
b.addEventListener("click",function(){if(v.paused){manual=false;play()}else{manual=true;v.pause()}});
v.addEventListener("play",label);v.addEventListener("pause",label);
/* v60: sonido del video de la oficina. Silencia los demás videos al activarlo. Si el archivo no trae pista de audio, el botón lo avisa en vez de quedar mudo sin explicación. */
function snd(){if(!sb)return;var on=!v.muted;f.setAttribute("data-sound",on?"on":"off");sb.setAttribute("aria-pressed",String(on&&!v.paused));
 if(!sb.disabled){sb.setAttribute("aria-label",on?"Silenciar el video":"Activar sonido del video");if(sbt)sbt.textContent=on?"Silenciar":"Sonido"}}
function noTrack(){return v.mozHasAudio===false||(v.audioTracks&&v.audioTracks.length===0)||(typeof v.webkitAudioDecodedByteCount==="number"&&v.webkitAudioDecodedByteCount===0)}
if(sb){
 sb.addEventListener("click",function(){
  if(sb.disabled)return;
  if(v.paused){manual=false;v.muted=false;play()}else v.muted=!v.muted;
  if(!v.muted){[].forEach.call(document.querySelectorAll("video"),function(o){if(o!==v&&!o.muted)o.muted=true});
   clearTimeout(ck);ck=setTimeout(function(){if(!v.muted&&!v.paused&&noTrack()){sb.disabled=true;v.muted=true;if(sbt)sbt.textContent="Sin audio";sb.setAttribute("aria-label","Este video no tiene audio");snd()}},1600)}
  snd()});
 v.addEventListener("volumechange",snd);v.addEventListener("play",snd);v.addEventListener("pause",snd);snd()}
/* PERF: el video recién arranca si se queda a la vista ~350 ms (no se descarga ni decodifica al pasar de largo scrolleando) y se pausa con la pestaña oculta. */
var vis=false,timer=0;v.disablePictureInPicture=true;
if("IntersectionObserver" in window){new IntersectionObserver(function(e){vis=e[0].isIntersecting;clearTimeout(timer);
 if(vis&&auto&&!manual&&v.paused&&!document.hidden)timer=setTimeout(function(){if(vis&&!document.hidden&&v.paused&&!manual)play()},350);
 else if(!vis&&!v.paused)v.pause()},{threshold:.25}).observe(f)}
document.addEventListener("visibilitychange",function(){if(document.hidden){clearTimeout(timer);if(!v.paused)v.pause()}else if(vis&&auto&&!manual&&v.paused)play()});
label();
})();
/* CHITA · v3 — El Riel y El Corte. Sin dependencias, 1 IntersectionObserver, solo datos ya publicados. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
if(!RM)d.documentElement.classList.add("cj");
/* EL RIEL */
var hero=d.getElementById("hero");
if(hero){var r=d.createElement("div");r.className="rl";r.setAttribute("aria-hidden","true");r.textContent="Chita Automotores · Entre Ríos";hero.appendChild(r)}
/* EL CORTE: un observador para las chapas de sección */
var T=[].slice.call(main.querySelectorAll(":scope>section"));
if("IntersectionObserver" in window&&!RM){var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});T.forEach(function(s){io.observe(s)})}
else T.forEach(function(s){s.classList.add("in")});
})();
/* CHITA · v4 — El Talón (numeral calado), Riel vivo (la pasada de fotos del hero acelera con el scroll) y salida del hero. 1 rAF, 1 listener pasivo. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,S=[].slice.call(d.querySelectorAll("main>section[id]"));if(!S.length)return;
S.forEach(function(s){var t=d.createElement("i");t.className="tl";t.setAttribute("aria-hidden","true");s.appendChild(t)});
if(RM)return;
var hr=d.querySelector(".hx-reel"),hs=d.querySelector(".hx .hx-show"),hero=d.getElementById("hero"),big=matchMedia("(min-width:900px)"),
raf=0,moved=false;
var hH=hero?hero.offsetHeight:1,lastK=-1;function remeasure(){hH=hero?hero.offsetHeight:1;lastK=-1}addEventListener("resize",remeasure,{passive:true});addEventListener("load",remeasure);
function tick(){raf=0;var y=scrollY;
 if(hero&&big.matches){var k=Math.max(0,Math.min(1,y/Math.max(1,hH)));
  /* PERF: antes se escribían 3 variables CSS (--hr/--hs/--hx) por frame: cada una invalida el estilo de todo el reel y del carril.
     Ahora se escribe directo la propiedad translate (solo compositor) y solo si el valor cambió. */
  if(k!==lastK){lastK=k;if(hr)hr.style.translate="0 "+(-k*46).toFixed(2)+"px";if(hs)hs.style.translate=(Math.pow(k,1.7)*innerWidth*.62).toFixed(1)+"px "+(k*34).toFixed(2)+"px";moved=true}}
 else if(moved){moved=false;lastK=-1;if(hr)hr.style.translate="";if(hs)hs.style.translate=""}}
function q(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",q);q();
})();
/* CHITA · v5 — Entregas: rótulo con la cantidad real de fotos publicadas. */
(function(){var g=document.querySelector("#entregas .eg");if(!g)return;var n=g.children.length;if(!n||document.querySelector(".ec"))return;
var c=document.createElement("p");c.className="ec";c.textContent=n+" entregas · fotos publicadas en redes";g.parentNode.insertBefore(c,g)})();
/* CHITA · v7 — EL SELLO y LA PERFORACIÓN.
   El puntero no altera botones, tarjetas ni agrega cursor visual: la interacción queda estable. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
function bg(e){while(e){var c=getComputedStyle(e).backgroundColor;if(c&&c!=="rgba(0, 0, 0, 0)"&&c!=="transparent")return c;e=e.previousElementSibling}return"#ECEDEA"}
[].slice.call(main.querySelectorAll(":scope>section[id]")).forEach(function(s){
 var i=document.createElement("i");i.className="pf";i.setAttribute("aria-hidden","true");i.style.setProperty("--pv",bg(s.previousElementSibling));s.appendChild(i)});
var eg=d.querySelector("#entregas .eg");
if(eg){[].forEach.call(eg.children,function(li,k){var b=d.createElement("b");b.className="sl";b.setAttribute("aria-hidden","true");b.textContent="Entregado";b.style.setProperty("--i",k);li.appendChild(b)});
 if(RM||!("IntersectionObserver" in window))eg.classList.add("st");
 else new IntersectionObserver(function(e,o){if(e[0].isIntersecting){eg.classList.add("st");o.disconnect()}},{threshold:.2}).observe(eg)}
})();
/* CHITA · v8 — El corte en tarjetas: un observador, una sola vez, escalonado por fila. Si falla IntersectionObserver, todo queda visible. */
(function(){
var d=document;if(!d.documentElement.classList.contains("cj")||!("IntersectionObserver" in window))return;
var E=[].slice.call(d.querySelectorAll("#stockGrid .car,#operaciones .oc,#opiniones .rvc"));if(!E.length)return;
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var t=x.target;t.style.setProperty("--d",(([].indexOf.call(t.parentNode.children,t))%4)*70+"ms");t.classList.add("in");io.unobserve(t)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
E.forEach(function(e){e.classList.add("cz7");io.observe(e)});
})();
/* CHITA · v9 — El pie también es un talón: perforación y «Fin del talonario». Sin listeners. */
(function(){
var f=document.querySelector("footer"),m=document.querySelector("main");if(!f||!m)return;
var l=m.querySelector(":scope>section:last-of-type"),c=l?getComputedStyle(l).backgroundColor:"#ECEDEA";
var p=document.createElement("i");p.className="pf";p.setAttribute("aria-hidden","true");p.style.setProperty("--pv",c);f.insertBefore(p,f.firstChild);
/* rótulo "Fin del talonario" eliminado; queda solo la perforación */
})();
/* CHITA · v10 — EL DESPACHO + gobernador del hero (perf). El hero queda fijo mientras Entregas lo cubre; cuando lo cubrió del todo se suelta.
   Solo escritorio y sin reduced-motion; si el hero no entra completo bajo el header, no se fija.
   PERF: (1) la posición de Entregas se mide al cargar/redimensionar y no en cada frame de scroll (antes: getBoundingClientRect por frame).
         (2) "hero dormido": cuando Entregas lo tapó casi del todo, o salió de pantalla, o la pestaña está oculta, el hero emite chita:hero-idle
             y pone data-act="0": se pausan la pasada, los recuadros del riel y el reel. Antes seguían corriendo debajo de Entregas.
         (3) mientras se scrollea sobre el hero, la pasada se frena (clase hx-scr) y vuelve 140 ms después de parar. */
(function(){
var d=document,h=d.documentElement,hero=d.getElementById("hero"),hd=d.querySelector("header"),ent=d.querySelector("main>section[id]");
if(!hero||!ent)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,big=matchMedia("(min-width:900px)"),
 raf=0,hh=0,hH=1,entTop=0,dsp=false,inV=true,idle=false,scr=0,lastY=-1;
function measure(){hh=hd?hd.offsetHeight:0;hH=hero.offsetHeight;entTop=ent.getBoundingClientRect().top+window.pageYOffset}
function fit(){measure();dsp=!RM&&big.matches&&hH+hh<=innerHeight+2;
 hero.style.setProperty("--hh",hh+"px");h.classList.toggle("dsp",dsp);if(!dsp)hero.classList.remove("stk");lastY=-1;upd()}
function setIdle(v){if(v===idle)return;idle=v;hero.setAttribute("data-act",v?"0":"1");
 d.dispatchEvent(new CustomEvent("chita:hero-idle",{detail:{idle:v}}))}
function upd(){raf=0;var y=window.pageYOffset,gap=entTop-y-hh;
 if(dsp)hero.classList.toggle("stk",gap>0);
 setIdle(d.hidden||!inV||(dsp&&gap<hH*.12));
 if(!RM&&y!==lastY&&!idle&&inV){if(!scr)hero.classList.add("hx-scr");clearTimeout(scr);scr=setTimeout(function(){scr=0;hero.classList.remove("hx-scr")},140)}
 lastY=y}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
hero.setAttribute("data-act","1");
if("IntersectionObserver" in window)new IntersectionObserver(function(e){inV=e[0].isIntersecting;q()},{threshold:0}).observe(hero);
addEventListener("scroll",q,{passive:true});addEventListener("resize",fit);
addEventListener("load",function(){fit()});
d.addEventListener("visibilitychange",q);
if("ResizeObserver" in window)new ResizeObserver(function(){var a=hero.offsetHeight,b=hd?hd.offsetHeight:0;if(a!==hH||b!==hh)fit()}).observe(hero);
fit();
})();

/* CHITA · v29 — Modelos: al cambiar de miniatura la foto se revela con el CORTE (reinicia la animación de css v29). Solo mouse; con reduced-motion el CSS la anula. */
(function(){var f=document.getElementById("mdf");if(!f)return;
f.addEventListener("pointerover",function(v){var b=v.target.closest(".mdb");if(!b)return;var im=b.closest(".mdp").firstChild;if(!im||im.tagName!=="IMG")return;
 im.classList.remove("sw");void im.offsetWidth;im.classList.add("sw")})})();

/* CHITA · GUÍA v55 · planilla de revisión
   Convierte los 8 puntos del primer paso en casillas tildables y muestra el avance. No agrega recomendaciones nuevas.
   Lo tildado se publica en window.GUIA_MARCADOS (lo lee el formulario de Visita). */
(function(){
var d=document,s=d.getElementById("guia"),gd=s&&s.querySelector(".gp-steps"),side=s&&s.querySelector(".gp-side"),list=gd&&gd.querySelector("details:first-child ul");if(!s||!gd||!side||!list||gd.dataset.checklist)return;gd.dataset.checklist="1";
var items=[].slice.call(list.querySelectorAll("li")),total=items.length;if(!total)return;
var tools=d.createElement("div");tools.className="gp-tools";
tools.innerHTML='<p class="gp-count" id="guiaCount" role="status" aria-live="polite"><b id="guiaNum">0</b><span> de '+total+' puntos revisados</span></p><div class="gp-bar" aria-hidden="true"><i id="guiaBar"></i></div><p class="gp-hint" id="guiaHint">Tildá lo que vas comprobando en el auto.</p><button type="button" class="gp-print" id="guiaPrint">Imprimir planilla</button>';
side.insertBefore(tools,side.querySelector(".gp-help"));
var num=d.getElementById("guiaNum"),bar=d.getElementById("guiaBar"),hint=d.getElementById("guiaHint");
items.forEach(function(li,i){var text=li.textContent.trim(),label=d.createElement("label"),input=d.createElement("input"),copy=d.createElement("span");label.className="gp-check";input.type="checkbox";input.id="guia-check-"+(i+1);input.setAttribute("aria-label",text);copy.textContent=text;label.appendChild(input);label.appendChild(copy);li.textContent="";li.appendChild(label);input.addEventListener("change",update)});
function update(){var on=items.filter(function(li){return li.querySelector("input").checked}),done=on.length;num.textContent=String(done);bar.style.width=Math.round(done/total*100)+"%";hint.textContent=done?(done===total?"Revisaste todo. Los puntos tildados van en tu consulta de visita.":"Los puntos tildados van en tu consulta de visita."):"Tildá lo que vas comprobando en el auto.";s.dataset.checked=String(done);window.GUIA_MARCADOS=on.map(function(li){return li.textContent.trim()})}
/* Al imprimir se abren los cuatro pasos y después se restituye el estado anterior. */
d.getElementById("guiaPrint").addEventListener("click",function(){var ds=[].slice.call(gd.querySelectorAll("details")),was=ds.map(function(x){return x.open});ds.forEach(function(x){x.open=true});var back=function(){ds.forEach(function(x,i){x.open=was[i]});window.removeEventListener("afterprint",back)};window.addEventListener("afterprint",back);window.print()});
update();
})();

/* CHITA · RESEÑAS · cada casilla es un recuento, no un testimonio.
   El texto identifica la posición en Google sin reproducir opiniones no autorizadas. */
(function(){
var tiles=[].slice.call(document.querySelectorAll("#opiniones .rv45 i"));if(!tiles.length)return;
tiles.forEach(function(tile,i){tile.dataset.review="Reseña "+(i+1)+" de "+tiles.length;tile.title=tile.dataset.review+" · Leela en Google";});
})();


/* CHITA · IDENTIDAD MADRE V1 — códigos de archivo y estados documentales.
   Sólo deriva etiquetas de información ya presente en el DOM; no inventa datos. */
(function(){
  var d=document;
  var cards=[].slice.call(d.querySelectorAll("#stockGrid .car"));
  cards.forEach(function(card,i){
    card.setAttribute("data-chita-id","U·"+("0"+(i+1)).slice(-2));
    var text=(card.textContent||"").toLowerCase();
    if(/consultar|no informado/.test(text)) card.setAttribute("data-chita-state","consultar");
    else card.setAttribute("data-chita-state","publicado");
  });
  var hero=d.getElementById("hero");
  if(hero) hero.setAttribute("data-chita-role","parte-de-salida");
  var ent=d.getElementById("entregas");
  if(ent){
    ent.setAttribute("data-chita-role","archivo-de-entregas");
    var next=ent.querySelector(".eg-next");
    if(next) next.setAttribute("data-chita-role","casilla-abierta");
  }
  var docs={
    "como-comprar":"talon-de-proceso",
    financiacion:"talon-de-condiciones",
    operaciones:"talon-de-operacion",
    guia:"planilla-de-revision",
    visita:"talon-de-visita",
    preguntas:"nuevo-registro"
  };
  Object.keys(docs).forEach(function(id){
    var s=d.getElementById(id);if(s)s.setAttribute("data-chita-role",docs[id]);
  });
})();


/* CHITA · IDENTIDAD MADRE V2 — cada sección opera como una pieza distinta del archivo. */
(function(){
  var d=document;
  var roles={
    contacto:"regla-de-llegada",
    opiniones:"registro-externo",
    "como-comprar":"talon-de-proceso",
    financiacion:"talon-de-condiciones",
    operaciones:"talon-de-operacion",
    guia:"planilla-chita",
    visita:"talon-de-visita",
    preguntas:"casilla-del-proximo-registro"
  };
  Object.keys(roles).forEach(function(id){
    var section=d.getElementById(id);
    if(section) section.setAttribute("data-chita-role",roles[id]);
  });
  var ops=[].slice.call(d.querySelectorAll("#operaciones .oc"));
  ops.forEach(function(card,i){card.setAttribute("data-chita-op","O·"+(("0"+(i+1)).slice(-2)))})
})();

/* CHITA · IDENTIDAD MADRE V3 — estados, operación elegida y E·13 como expediente abierto. */
(function(){
  var d=document;
  /* Cada unidad expone el estado documental sin convertirlo en una promesa de stock. */
  /* Operaciones: una selección cambia el encabezado del talón y hace visible la consecuencia. */
  var ops=d.querySelector("#operaciones .og"), label=d.getElementById("opLabel"), title=d.getElementById("opTitle"), lead=d.getElementById("opLead");
  var copy={
    Comprar:["Talón de operación · comprar","Abrí una unidad publicada","Elegí una ficha en Unidades y consultá si sigue disponible. Este formulario es para tu usado."],
    Vender:["Talón de operación · vender","Prepará la evaluación de tu usado","Sumá marca, modelo, año y kilometraje; lo evaluamos."],
    Permutar:["Talón de operación · permutar","Cruce entre dos autos","Contanos qué tenés y por cuál unidad te interesa consultar."],
    Consignar:["Talón de operación · consignar","Consulta de publicación","Enviá los datos de tu auto y te contamos cómo funciona."]
  };
  var sel=d.querySelector("#canjeForm select[name=interes]"), opVal={Comprar:"consulta",Vender:"vender",Permutar:"permutar",Consignar:"consignar"}, opKey={vender:"Vender",permutar:"Permutar",consignar:"Consignar"};
  function opShow(key,fromSelect){
    if(!copy[key])return;
    if(ops)[].slice.call(ops.querySelectorAll(".oc")).forEach(function(x){var h=x.querySelector("h3");x.classList.toggle("is-selected",!!h&&h.textContent.trim()===key)});
    if(label)label.textContent=copy[key][0];if(title)title.textContent=copy[key][1];if(lead)lead.textContent=copy[key][2];
    /* el rótulo y la vista previa del mensaje dicen lo mismo: se mueve el select y se avisa al formulario (app.js recalcula la vista previa) */
    if(!fromSelect&&sel&&opVal[key]&&sel.value!==opVal[key]){sel.value=opVal[key];sel.dispatchEvent(new Event("input",{bubbles:true}))}
  }
  if(ops){[].slice.call(ops.querySelectorAll(".oc")).forEach(function(card){card.addEventListener("click",function(){var h=card.querySelector("h3");opShow(h&&h.textContent.trim(),false)})})}
  if(sel)sel.addEventListener("change",function(){if(opKey[sel.value])opShow(opKey[sel.value],true)});
  window.CHITA_OP=opShow;
  /* E·13: muestra la pieza que se está abriendo sin guardar datos. */
  var bf=d.getElementById("buscoForm");
  if(bf){var p=d.createElement("p");p.className="e13-preview";p.setAttribute("role","status");p.setAttribute("aria-live","polite");p.textContent="Completá los datos y abrí tu pedido";var meta=bf.querySelector(".meta");if(meta)meta.parentNode.insertBefore(p,meta);var fields=[].slice.call(bf.querySelectorAll("input,select"));function preview(){var model=bf.modelo&&bf.modelo.value.trim(),year=bf.anio&&bf.anio.value.trim(),fuel=bf.comb&&bf.comb.value,pres=bf.presu&&bf.presu.value.trim();var bits=[model,year&&"desde "+year,fuel,pres&&"presupuesto "+pres].filter(Boolean);p.textContent=bits.length?"E·13 · consulta lista · "+bits.join(" · ")+" · te confirmamos por WhatsApp":"E·13 · completá los datos y abrí tu pedido"}fields.forEach(function(x){x.addEventListener("input",preview);x.addEventListener("change",preview)});bf.addEventListener("submit",function(){window.setTimeout(function(){p.textContent="E·13 · pedido listo para enviar · te confirmamos stock y precio"},0)});}
})();

/* CHITA · V3 — cada columna abre una consecuencia de servicio y cada entrega declara su fuente. */
(function(){
  var d=document, eg=d.querySelector("#entregas .eg");
  if(eg){[].slice.call(eg.children).forEach(function(li,k){var seal=li.querySelector(".sl");if(seal)seal.textContent="Entregado";li.setAttribute("title","Entregado")})}
})();

/* CHITA · V3 — La Regla prepara una sola consulta con las hojas abiertas. */
(function(){
  var d=document, v=d.getElementById("versus"), t=d.getElementById("vt"); if(!v||!t||!window.wa)return;
  var q=d.createElement("p");q.className="vq";q.innerHTML='<a class="btn p" href="#">Abrir consulta comparativa ↗</a><span>Te respondemos sobre las unidades que elegiste.</span>';
  var w=q.querySelector("a");function sync(){var names=[].slice.call(t.querySelectorAll(".vdc h3,.c5-card h3")).map(function(x){return x.textContent.trim()});w.href=window.wa("Hola! Quiero comparar estas unidades: "+(names.length?names.join(" · "):"todavía no elegí unidades")+". ¿Me confirman disponibilidad, precio y diferencias relevantes?")}sync();v.querySelector("#vp").addEventListener("click",function(){window.setTimeout(sync,0)});q.addEventListener("click",function(){window.setTimeout(sync,0)});t.parentNode.insertBefore(q,t.nextSibling);
})();

/* CHITA · V4 — continuidad entre talones: comprar, condiciones, planilla, visita y preguntas. */
(function(){
  var d=document;
  /* Compra: cada comprobante abre el siguiente documento real del sitio. */
  var buy=d.querySelector("#como-comprar .stp");
  if(buy){var links=[["Abrir unidades","#unidades"],["Preparar consulta","#contacto"],["Coordinar visita","#visita"],["Ver entregas","#entregas"]];[].slice.call(buy.querySelectorAll("li")).forEach(function(li,i){if(li.querySelector(".step-action"))return;var a=d.createElement("a");a.className="step-action";a.href=links[i][1];a.textContent=links[i][0]+" ↗";li.appendChild(a)})}
  /* Financiación: talón de condiciones contextual, sin simulador ni importe inventado. */
  var fin=d.querySelector("#financiacion .pdr");
  if(fin&&window.STOCK&&window.wa&&!fin.querySelector(".fin-ticket")){var box=d.createElement("div");box.className="fin-ticket";box.innerHTML='<b>Talón de condiciones</b><label>Unidad a consultar<select><option value="">Elegí una unidad (opcional)</option>'+window.STOCK.map(function(c,i){return'<option value="'+i+'">U·'+String(i+1).padStart(2,"0")+' · '+String(c.titulo).replace(/&/g,"&amp;")+'</option>'}).join("")+'</select></label><label class="fin-used"><input type="checkbox"> Tengo un usado para evaluar</label><a class="btn p" href="#">Abrir consulta de condiciones ↗</a><small>Te confirmamos precio, cuota y condiciones.</small>';fin.insertBefore(box,fin.firstChild);var sel=box.querySelector("select"),used=box.querySelector("input"),a=box.querySelector("a");function syncFin(){var c=sel.value!==""?window.STOCK[+sel.value]:null;var m="Hola! Quiero consultar condiciones de pago"+(c?" para U·"+String(+sel.value+1).padStart(2,"0")+" · "+c.titulo:"")+(used.checked?" y evaluar mi usado":"")+". ¿Me confirman precio, cuota y requisitos vigentes?";a.href=window.wa(m)}sel.addEventListener("change",syncFin);used.addEventListener("change",syncFin);syncFin()}
  /* FAQ: la respuesta conserva su prudencia, pero deja de ser un callejón sin salida. */
  var routes=[[/0 km|unidad/,"#unidades","Ver unidades"],[/usado/,"#operaciones","Abrir talón de operación"],[/financiación/,"#financiacion","Ver talón de condiciones"],[/consignación/,"#operaciones","Preparar consignación"],[/cuándo|cuando|visita/ ,"#visita","Coordinar visita"],[/cuánto|cuanto|precio/ ,"#unidades","Consultar una unidad"]];
  [].slice.call(d.querySelectorAll("#preguntas .fa details")).forEach(function(det){if(det.querySelector(".faq-route"))return;var text=(det.querySelector("summary")||{}).textContent||"",r=routes.find(function(x){return x[0].test(text.toLowerCase())});if(!r)return;var a=d.createElement("a");a.className="faq-route";a.href=r[1];a.textContent=r[2]+" ↗";var p=det.querySelector("p");if(p)p.appendChild(d.createTextNode(" "));(p||det).appendChild(a)})
  /* FAQ: una sola respuesta abierta a la vez. Los navegadores con <details name> lo resuelven solos; este respaldo cubre a los que no. */
  if(!("name" in HTMLDetailsElement.prototype)){var fq=[].slice.call(d.querySelectorAll("#preguntas .fa details"));fq.forEach(function(x){x.addEventListener("toggle",function(){if(x.open)fq.forEach(function(o){if(o!==x&&o.open)o.open=false})})})}
})();

/* CHITA · v56 · Visita: calendario propio (clases vc-*). Escribe el día (y la franja) en «Cuándo te queda cómodo»; el resumen y el mensaje de WhatsApp lo leen de ahí. Sin JS queda el campo de texto. No es una reserva: confirmamos por WhatsApp. */
(function(){
var f=document.getElementById("visitaForm");if(!f||!f.cuando)return;var inp=f.cuando,lab=inp.closest("label");if(!lab)return;
var M=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],SL=["Mañana","Tarde"],t=new Date(),T=new Date(t.getFullYear(),t.getMonth(),t.getDate());
var st={m:new Date(T.getFullYear(),T.getMonth(),1),d:null,s:""};
var box=document.createElement("div");box.className="vc";box.setAttribute("role","group");box.setAttribute("aria-label","Calendario: elegí un día (opcional)");lab.parentNode.insertBefore(box,lab);
function fmt(d){return d.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"})}
function sync(){inp.value=st.d?fmt(st.d)+(st.s?", por la "+st.s.toLowerCase():""):"";inp.dispatchEvent(new Event("input",{bubbles:true}))}
function draw(fk){
var y=st.m.getFullYear(),mo=st.m.getMonth(),n=new Date(y,mo+1,0).getDate(),lead=(new Date(y,mo,1).getDay()+6)%7,cur=y===T.getFullYear()&&mo===T.getMonth(),h="";
h+='<div class="vc-h"><button type="button" class="vc-n" data-nav="-1" aria-label="Mes anterior"'+(cur?" disabled":"")+'>←</button><b aria-live="polite">'+M[mo]+' <i>'+y+'</i></b><button type="button" class="vc-n" data-nav="1" aria-label="Mes siguiente">→</button></div><div class="vc-w" aria-hidden="true"><i>L</i><i>M</i><i>M</i><i>J</i><i>V</i><i>S</i><i>D</i></div><div class="vc-g">';
for(var i=0;i<lead;i++)h+='<span aria-hidden="true"></span>';
for(var d=1;d<=n;d++){var dt=new Date(y,mo,d),ok=dt>=T,on=st.d&&st.d.getTime()===dt.getTime();h+='<button type="button" class="vc-d" data-d="'+d+'" aria-label="'+fmt(dt)+'" aria-pressed="'+(on?"true":"false")+'"'+(ok?"":" disabled")+(dt.getTime()===T.getTime()?' data-hoy="1"':"")+">"+d+"</button>"}
h+='</div><div class="vc-s" role="group" aria-label="Franja del día (opcional)">'+SL.map(function(s){return'<button type="button" class="vc-f" data-s="'+s+'" aria-pressed="'+(st.s===s?"true":"false")+'"'+(st.d?"":" disabled")+"><b>"+s+"</b></button>"}).join("")+'</div><p class="vc-m">'+(st.d?"Te confirmamos el horario exacto por WhatsApp.":"Tocá un día para elegir la franja.")+"</p>";
box.innerHTML=h;if(fk){var e=box.querySelector(fk);if(e)e.focus()}}
box.addEventListener("click",function(e){var b=e.target.closest("button");if(!b||b.disabled)return;
if(b.dataset.nav){st.m=new Date(st.m.getFullYear(),st.m.getMonth()+(+b.dataset.nav),1);draw('[data-nav="'+b.dataset.nav+'"]');return}
if(b.dataset.d){var d=new Date(st.m.getFullYear(),st.m.getMonth(),+b.dataset.d);if(st.d&&st.d.getTime()===d.getTime()){st.d=null;st.s=""}else{st.d=d}sync();draw('[data-d="'+b.dataset.d+'"]');return}
if(b.dataset.s){st.s=st.s===b.dataset.s?"":b.dataset.s;sync();draw('[data-s="'+b.dataset.s+'"]')}});
inp.addEventListener("input",function(e){if(e.isTrusted&&st.d){st.d=null;st.s="";draw()}});
var vs=document.getElementById("vsU"),cnt=f.querySelector(".vx-count");
if(vs&&cnt)vs.addEventListener("change",function(){var k=vs.querySelectorAll("input:checked").length;cnt.textContent=k?k+(k===1?" elegida":" elegidas"):"Opcional";cnt.classList.toggle("on",!!k)});
draw()})();

/* CHITA · v51 — fotos apaisadas con marca, tarjeta final de la grilla de Unidades y sello Entregado en todas las fotos.
   Las fotos horizontales (la Tracker 1.2T y las de Operaciones) se muestran enteras: se marcan con .land y el espacio
   que sobra lo cubre la cinta de la marca (ver bloque v51 de identidad.css) en lugar del azul liso. */
(function(){
  var d=document;
  function mark(i){
    function f(){if(i.naturalWidth&&i.naturalHeight/i.naturalWidth<.92)i.classList.add("land")}
    if(i.complete)f();else i.addEventListener("load",f,{once:true});
  }
  [].forEach.call(d.querySelectorAll("#stockGrid .ctk img,#operaciones .oi img"),mark);
  var g=d.getElementById("stockGrid");
  if(g&&!g.querySelector(".car-cta")){
    var a=d.createElement("a");a.className="car-cta";a.href="#busco";
    a.innerHTML='<span class="cc-k">\u00bfNo ves el tuyo?</span><span class="cc-t">Contanos qu\u00e9 auto busc\u00e1s</span><span class="cc-c">Escribinos \u2192</span>';
    g.appendChild(a);
  }
})();


/* Golive · T12: la sombra de desplazamiento de la navegación desaparece al llegar al final. */
(function(){var nav=document.querySelector("header nav");if(!nav)return;function mark(){nav.classList.toggle("nav-end",nav.scrollLeft+nav.clientWidth>=nav.scrollWidth-2)}nav.addEventListener("scroll",mark,{passive:true});addEventListener("resize",mark);mark()})();

/* CHITA · Menú con secciones expandibles (v58). Los enlaces del menú siguen siendo enlaces (sin JS navegan igual);
   el botón ▾ de cada grupo abre un panel con las secciones relacionadas. Hover con retardo en escritorio, toque en móvil,
   Esc cierra y devuelve el foco, clic afuera / scroll / cambio de tamaño cierran. */
(function(){
var h=document.querySelector("header"),nav=h&&h.querySelector("nav");if(!nav)return;
var big=matchMedia("(min-width:900px)"),G=[],open=null,tm=0;
[].forEach.call(nav.querySelectorAll(".nvg"),function(g){var c=g.querySelector(".nvc"),p=c&&document.getElementById(c.getAttribute("aria-controls"));if(p)G.push({g:g,c:c,p:p})});
if(!G.length)return;
function place(x){if(big.matches){var hr=h.getBoundingClientRect(),gr=x.g.getBoundingClientRect(),w=x.p.offsetWidth||560;
 x.p.style.setProperty("--nx",Math.max(12-hr.left,Math.min(gr.left-hr.left,innerWidth-w-12-hr.left))+"px")}else x.p.style.removeProperty("--nx")}
function hide(){if(!open)return;open.p.classList.remove("on");open.c.setAttribute("aria-expanded","false");open.g.classList.remove("open");open=null}
function show(x){if(open===x)return;hide();place(x);x.p.classList.add("on");x.c.setAttribute("aria-expanded","true");x.g.classList.add("open");open=x}
function later(fn,ms){clearTimeout(tm);tm=setTimeout(fn,ms)}
G.forEach(function(x){
 x.c.addEventListener("click",function(e){e.preventDefault();if(open===x){hide();return}show(x);if(e.detail===0){var a=x.p.querySelector("a");if(a)a.focus()}});
 x.g.addEventListener("keydown",function(e){if(e.key==="ArrowDown"&&(e.target===x.c||e.target.parentNode===x.g)){e.preventDefault();show(x);var a=x.p.querySelector("a");if(a)a.focus()}});
 [x.g,x.p].forEach(function(el){
  el.addEventListener("pointerenter",function(e){if(e.pointerType!=="mouse"||!big.matches)return;clearTimeout(tm);if(el===x.g)later(function(){show(x)},90)});
  el.addEventListener("pointerleave",function(e){if(e.pointerType!=="mouse"||!big.matches)return;later(hide,200)})});
 x.p.addEventListener("click",function(e){if(e.target.closest("a"))hide()});
 x.p.addEventListener("keydown",function(e){if(e.key==="Escape"){hide();x.c.focus()}});
 x.g.addEventListener("keydown",function(e){if(e.key==="Escape"&&open===x){hide();x.c.focus()}});
 x.g.addEventListener("focusout",function(e){if(open===x&&!x.g.contains(e.relatedTarget)&&!x.p.contains(e.relatedTarget))later(function(){if(open===x&&!x.g.contains(document.activeElement)&&!x.p.contains(document.activeElement))hide()},120)});
 x.p.addEventListener("focusout",function(e){if(open===x&&!x.g.contains(e.relatedTarget)&&!x.p.contains(e.relatedTarget))later(function(){if(open===x&&!x.g.contains(document.activeElement)&&!x.p.contains(document.activeElement))hide()},120)});
 x.g.querySelector("a").addEventListener("click",hide)});
document.addEventListener("pointerdown",function(e){if(open&&!h.contains(e.target))hide()});
var y0=0;addEventListener("scroll",function(){var y=pageYOffset;if(open&&Math.abs(y-y0)>12)hide();y0=y},{passive:true});
addEventListener("resize",hide);addEventListener("hashchange",hide);
})();
