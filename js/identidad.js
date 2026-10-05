/* CHITA · v12: «Comparar» y «Dónde estamos» también se marcan en Modelos y Local. Rótulo de sección actual (la barra lateral de avance se eliminó) (transform only, 1 listener pasivo). */
(function(){
var S=[].slice.call(document.querySelectorAll("main>section[id]"));if(!S.length)return;
var N={entregas:"Entregas",unidades:"Unidades","catalogo-comparador":"Modelos",nosotros:"Nosotros",contacto:"Dónde estamos",local:"El local",opiniones:"Reseñas","como-comprar":"Cómo comprar",financiacion:"Financiación",operaciones:"Vender o permutar",guia:"Guía",visita:"Visita",preguntas:"Preguntas"};
var c=document.createElement("div");c.className="cl";c.setAttribute("aria-hidden","true");c.innerHTML="<b hidden></b>";document.body.appendChild(c);
var lab=c.firstChild,raf=0,cur="";
function upd(){raf=0;var d=document.documentElement,m=d.scrollHeight-innerHeight;
 var y=innerHeight*.4,k=-1;for(var i=0;i<S.length;i++){var r=S[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){k=i;break}}
 if(k<0){lab.hidden=true;cur="";return}
 var id=S[k].id;if(id!==cur){cur=id;lab.hidden=false;lab.textContent=N[id]||id}
 var a=document.querySelectorAll("header nav a");for(var j=0;j<a.length;j++){var al={"catalogo-comparador":"versus",local:"contacto"},on=a[j].getAttribute("href")==="#"+id||a[j].getAttribute("href")==="#"+al[id];a[j].classList.toggle("on",on);if(on&&a[j].parentNode.scrollWidth>a[j].parentNode.clientWidth+4){var n=a[j].parentNode;n.scrollTo({left:a[j].offsetLeft-n.clientWidth/2+a[j].offsetWidth/2,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})}}}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",q);addEventListener("load",q);upd();
})();
/* CHITA · Recorrido en video del hero: carga diferida, pausa fuera de pantalla, sonido a pedido. */
(function(){
var f=document.getElementById("reel"),v=document.getElementById("reelv"),b=document.getElementById("reelb");if(!f||!v||!b)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd,seen=false,vis=false;
function load(){if(!v.src){v.src=v.getAttribute("data-src")}}
function label(){b.textContent=v.paused?"Reproducir":(v.muted?"Activar sonido":"Silenciar");b.setAttribute("aria-pressed",String(!v.muted&&!v.paused))}
function play(){load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
b.addEventListener("click",function(){
 if(v.paused){v.muted=false;play()}else{v.muted=!v.muted}
 label()});
v.addEventListener("play",label);v.addEventListener("pause",label);
if("IntersectionObserver" in window){
 new IntersectionObserver(function(e){vis=e[0].isIntersecting;
  if(vis&&auto&&!seen){seen=true;play()}
  else if(vis&&auto&&v.paused){play()}
  else if(!vis&&!v.paused){v.pause()}
 },{threshold:.12}).observe(f)}
else if(auto)play();
label();
})();
/* CHITA · video de Visita: loop silencioso al entrar en pantalla, pausa al salir, botón propio (respeta movimiento reducido y ahorro de datos) */
(function(){
var f=document.querySelector("#visita .vvid"),v=f&&f.querySelector("video"),b=f&&f.querySelector(".vv-b");if(!v||!b)return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,sd=navigator.connection&&navigator.connection.saveData,auto=!RM&&!sd,manual=false;
function label(){b.textContent=v.paused?"Reproducir":"Pausar";b.setAttribute("aria-pressed",String(!v.paused))}
function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
b.addEventListener("click",function(){if(v.paused){manual=false;play()}else{manual=true;v.pause()}});
v.addEventListener("play",label);v.addEventListener("pause",label);
if("IntersectionObserver" in window){new IntersectionObserver(function(e){var vis=e[0].isIntersecting;if(vis&&auto&&!manual&&v.paused)play();else if(!vis&&!v.paused)v.pause()},{threshold:.25}).observe(f)}
label();
})();
/* CHITA · v3 — El Riel y El Corte. Sin dependencias, 1 IntersectionObserver, solo datos ya publicados. */
(function(){
var d=document,RM=matchMedia("(prefers-reduced-motion:reduce)").matches,main=d.querySelector("main");if(!main)return;
if(!RM)d.documentElement.classList.add("cj");
function tx(s){var e=d.querySelector(s);return e?e.textContent.replace(/\s+/g," ").trim():""}
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
tape=null,ly=scrollY,v=0,raf=0,pr=1;
function anim(){if(tape)return tape;var t=d.querySelector(".hx-trk");if(t&&t.getAnimations){var a=t.getAnimations()[0];if(a)tape=a}return tape}
function tick(){raf=0;var y=scrollY,vh=innerHeight,dy=y-ly;ly=y;v+=(Math.abs(dy)-v)*.18;
 if(hero&&big.matches){var k=Math.max(0,Math.min(1,y/Math.max(1,hero.offsetHeight)));if(hr)hr.style.setProperty("--hr",(-k*46)+"px");if(hs){hs.style.setProperty("--hs",(k*34)+"px");hs.style.setProperty("--hx",(Math.pow(k,1.7)*innerWidth*.62).toFixed(1)+"px")}}
 if(v>.05)raf=requestAnimationFrame(tick)}
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
var n=m.querySelectorAll(":scope>section[id]").length,t=document.createElement("p");t.className="fin7";t.setAttribute("aria-hidden","true");t.textContent="Fin del talonario · "+n+"/"+n;
var w=f.querySelector(".w");if(w)w.insertBefore(t,w.firstChild);
})();
/* CHITA · v10 — EL DESPACHO. El hero queda fijo mientras Entregas lo cubre; cuando lo cubrió del todo se suelta
   (sale de pantalla y el video del recorrido se pausa solo). Solo escritorio y sin reduced-motion; si el hero no
   entra completo bajo el header, no se fija. 1 listener pasivo + 1 rAF por scroll, una lectura de layout. */
(function(){
var d=document,h=d.documentElement,hero=d.getElementById("hero"),hd=d.querySelector("header"),ent=d.querySelector("main>section[id]");
if(!hero||!ent||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var big=matchMedia("(min-width:900px)"),raf=0;
function fit(){var hh=hd?hd.offsetHeight:0,ok=big.matches&&hero.offsetHeight+hh<=innerHeight+2;
 hero.style.setProperty("--hh",hh+"px");h.classList.toggle("dsp",ok);if(!ok)hero.classList.remove("stk");upd()}
function upd(){raf=0;if(!h.classList.contains("dsp"))return;
 var covered=ent.getBoundingClientRect().top<=(hd?hd.offsetHeight:0);hero.classList.toggle("stk",!covered)}
function q(){if(!raf)raf=requestAnimationFrame(upd)}
addEventListener("scroll",q,{passive:true});addEventListener("resize",fit);fit();
})();

/* CHITA · v28 — Quiénes somos: las tres columnas rojas del frente son las pestañas (Usados, Permutas, Consignaciones).
   No agrega datos: reutiliza los tres textos ya publicados. Medidas [x, y, ancho, alto, y del rótulo] en % de la foto 900×581 (columnas reales: centro y las dos de la derecha). */
(function(){
var d=document,s=d.getElementById("nosotros"),ph=d.getElementById("nph"),pl=s&&s.querySelector(".pl");
if(!s||!ph||!pl)return;
var rows=[].slice.call(pl.children);if(rows.length!==3)return;
var Z=[[35.56,36.32,2.56,27.54,36.32],[85,33.74,2.67,49.74,33.74],[94.56,36.32,2.11,30.64,52]],
 lit=d.createElement("span"),btns=[],chips=[],cap=null,cur=-1,tm=0;
lit.className="nz";lit.setAttribute("aria-hidden","true");ph.appendChild(lit);
function mouse(e){return !e.pointerType||e.pointerType==="mouse"}
function go(i){clearTimeout(tm);if(i===cur)return;cur=i;
 rows.forEach(function(r,k){r.classList.toggle("on",k===i);btns[k].setAttribute("aria-expanded",String(k===i));chips[k].classList.toggle("on",k===i)});
 if(cap){cap.firstChild.textContent=btns[i].querySelector("b").textContent;cap.lastChild.textContent=rows[i].querySelector(".nq").textContent}
 var z=Z[i];lit.style.left=z[0]+"%";lit.style.top=z[1]+"%";lit.style.width=z[2]+"%";lit.style.height=z[3]+"%"}
function intent(i,e){if(!mouse(e))return;clearTimeout(tm);tm=setTimeout(function(){go(i)},90)}
for(var i=0;i<3;i++)(function(i){
 var r=rows[i],b=r.querySelector("b"),p=r.querySelector("span");if(!b||!p)return;
 var bt=d.createElement("button"),w=d.createElement("span"),n=d.createElement("i"),c=d.createElement("span");
 n.setAttribute("aria-hidden","true");n.textContent="0"+(i+1);
 bt.type="button";bt.className="nb";bt.id="nsb"+i;bt.setAttribute("aria-expanded","false");bt.setAttribute("aria-controls","nsp"+i);
 bt.appendChild(b);
 w.className="np";w.id="nsp"+i;w.setAttribute("role","region");w.setAttribute("aria-labelledby",bt.id);
 p.className="nq";r.insertBefore(bt,r.firstChild);r.insertBefore(w,p);w.appendChild(p);
 /* T13: cada columna abierta termina en una acción real (sin animación nueva) */
 var L=[["#unidades","Ver las unidades publicadas"],["#operaciones","Preparar la consulta de mi usado"],["#operaciones","Consultar por consignar"]][i],a=d.createElement("a");
 a.className="nl";a.href=L[0];a.textContent=L[1];a.setAttribute("data-op",["","Permutar","Consignar"][i]);
 a.addEventListener("click",function(){var k=a.getAttribute("data-op");if(k&&window.CHITA_OP)window.CHITA_OP(k,false)});
 p.appendChild(a);
 c.className="nc";c.setAttribute("aria-hidden","true");c.textContent="";
 c.style.left=(Z[i][0]+Z[i][2]/2)+"%";c.style.top=Z[i][4]+"%";ph.appendChild(c);
 btns[i]=bt;chips[i]=c;
 bt.addEventListener("click",function(){go(i)});
 r.addEventListener("pointerenter",function(e){intent(i,e)});
 c.addEventListener("pointerenter",function(e){intent(i,e)});
 c.addEventListener("click",function(){go(i)});
})(i);
if(btns.length!==3||chips.length!==3)return;
/* en móvil el texto de la pestaña queda lejos de la foto: una leyenda bajo la foto muestra la columna activa */
cap=d.createElement("p");cap.className="ncap";cap.setAttribute("aria-hidden","true");cap.appendChild(d.createElement("b"));cap.appendChild(d.createElement("span"));ph.parentNode.insertBefore(cap,ph.nextSibling);
pl.classList.add("nt");ph.classList.add("nz-on");go(0);
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
    nosotros:"puertas-del-servicio",
    contacto:"regla-de-llegada",
    local:"protocolo-de-reconocimiento",
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
  /* El control del hero nombra el gesto humano; sólo cambia a estado técnico cuando corresponde. */
  var reel=d.getElementById("reelv"), rb=d.getElementById("reelb");
  if(reel&&rb){function rl(){rb.textContent=reel.paused?"Escuchá el salón":(reel.muted?"Activar sonido":"Silenciar")} reel.addEventListener("play",rl);reel.addEventListener("pause",rl);rl()}
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
  var pl=d.querySelector("#nosotros .pl");
  if(pl){var actions=[
    ["Ver unidades publicadas","#unidades"],
    ["Abrir talón de permuta","#operaciones"],
    ["Preparar consulta de consignación","#operaciones"]
  ];[].slice.call(pl.children).forEach(function(row,i){if(row.querySelector(".svc-action"))return;var a=d.createElement("a");a.className="svc-action";a.href=actions[i][1];a.textContent=actions[i][0]+" ↗";row.appendChild(a)})}
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
})();

/* CHITA · v38 · Visita: almanaque de taco. Escribe el día (y la franja) en «Día y horario»; el pase y el mensaje de WhatsApp lo leen de ahí. Sin JS queda el campo de texto. No es una reserva: confirmamos por WhatsApp. */
(function(){
var f=document.getElementById("visitaForm");if(!f||!f.cuando)return;var inp=f.cuando,lab=inp.closest("label");if(!lab)return;
var M=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],SL=["Mañana","Tarde"],t=new Date(),T=new Date(t.getFullYear(),t.getMonth(),t.getDate());
var st={m:new Date(T.getFullYear(),T.getMonth(),1),d:null,s:""};
var box=document.createElement("div");box.className="alm";box.setAttribute("role","group");box.setAttribute("aria-label","Almanaque: elegí un día (opcional)");lab.parentNode.insertBefore(box,lab);
function fmt(d){return d.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"})}
function sync(){inp.value=st.d?fmt(st.d)+(st.s?", por la "+st.s.toLowerCase():""):"";inp.dispatchEvent(new Event("input",{bubbles:true}))}
function draw(fk){
var y=st.m.getFullYear(),mo=st.m.getMonth(),n=new Date(y,mo+1,0).getDate(),lead=(new Date(y,mo,1).getDay()+6)%7,cur=y===T.getFullYear()&&mo===T.getMonth(),h="";
h+='<div class="alm-h"><button type="button" class="alm-n" data-nav="-1" aria-label="Mes anterior"'+(cur?" disabled":"")+'>←</button><b aria-live="polite">'+M[mo]+" "+y+'</b><button type="button" class="alm-n" data-nav="1" aria-label="Mes siguiente">→</button></div><div class="alm-w" aria-hidden="true"><i>L</i><i>M</i><i>M</i><i>J</i><i>V</i><i>S</i><i>D</i></div><div class="alm-g">';
for(var i=0;i<lead;i++)h+='<span aria-hidden="true"></span>';
for(var d=1;d<=n;d++){var dt=new Date(y,mo,d),ok=dt>=T,on=st.d&&st.d.getTime()===dt.getTime();h+='<button type="button" class="alm-d" data-d="'+d+'" aria-pressed="'+(on?"true":"false")+'"'+(ok?"":" disabled")+(dt.getTime()===T.getTime()?' data-hoy="1"':"")+">"+(d<10?"0":"")+d+"</button>"}
h+='</div><div class="alm-s" role="group" aria-label="Franja (opcional)">'+SL.map(function(s){return'<button type="button" class="alm-f" data-s="'+s+'" aria-pressed="'+(st.s===s?"true":"false")+'"'+(st.d?"":" disabled")+">"+s+"</button>"}).join("")+'</div><p class="alm-m">Te confirmamos día y horario.</p>';
box.innerHTML=h;if(fk){var e=box.querySelector(fk);if(e)e.focus()}}
box.addEventListener("click",function(e){var b=e.target.closest("button");if(!b||b.disabled)return;
if(b.dataset.nav){st.m=new Date(st.m.getFullYear(),st.m.getMonth()+(+b.dataset.nav),1);draw('[data-nav="'+b.dataset.nav+'"]');return}
if(b.dataset.d){var d=new Date(st.m.getFullYear(),st.m.getMonth(),+b.dataset.d);if(st.d&&st.d.getTime()===d.getTime()){st.d=null;st.s=""}else{st.d=d}sync();draw('[data-d="'+b.dataset.d+'"]');return}
if(b.dataset.s){st.s=st.s===b.dataset.s?"":b.dataset.s;sync();draw('[data-s="'+b.dataset.s+'"]')}});
inp.addEventListener("input",function(e){if(e.isTrusted&&st.d){st.d=null;st.s="";draw()}});
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
