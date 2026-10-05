/* Chita Automotores · lógica de la página (tarjetas, galerías, ficha, hero, formularios).
   Los datos (NEGOCIO y STOCK) siguen en un <script> inline de index.html: es lo único que se edita a mano.
   Script clásico, sin defer: se ejecuta en el mismo punto y orden en que lo hacía inline. */
(function(){
var N=NEGOCIO,$=function(i){return document.getElementById(i)},RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
/*PRE:start*/var IDIM={"1":[800,1000],"2":[800,1000],"3":[800,1000],"4":[800,1000],"5":[800,1000],"6":[800,1000],"7":[800,1000],"8":[800,1000],"9":[800,1000],"10":[800,1000],"11":[800,1000],"12":[800,1000],"13":[800,1000],"14":[800,1000],"15":[800,1000],"16":[800,1000],"17":[800,1000],"18":[800,1000],"19":[800,1000],"20":[800,1000],"21":[800,1000],"22":[800,1000],"23":[800,1000],"24":[800,1000],"25":[800,1000],"26":[800,1000],"27":[800,1000],"28":[800,1000],"29":[800,1000],"30":[800,1000],"31":[800,1000],"32":[800,1000],"33":[800,1000],"34":[800,1000],"35":[800,1000],"36":[800,1000],"37":[800,1000],"38":[800,1000],"39":[800,1000],"40":[800,1000],"41":[472,590],"42":[800,1000],"43":[800,1000],"44":[800,1000],"45":[800,1000],"46":[800,1000],"47":[800,1000],"48":[800,1000],"49":[800,1000],"50":[800,1000],"51":[800,1000],"52":[800,1000],"53":[800,1000],"54":[800,1000],"55":[800,1000],"56":[800,1000],"57":[472,590],"58":[800,1000],"59":[800,1000],"60":[800,1000],"61":[800,1000],"62":[800,1000],"63":[800,1000],"64":[800,1000]};function ims(u){var m=/^assets\/w800\/(\d+)\.webp$/.exec(u||"");return m&&IDIM[m[1]]?m[1]:null}function ss(u){var n=ims(u);if(n)return"assets/w480/"+n+".webp 480w, assets/w800/"+n+".webp 800w";var m=/^(assets\/[a-z0-9-]+)\.webp$/.exec(u);return m&&!/-(480|800)$/.test(m[1])?m[1]+"-480.webp 480w, "+m[1]+"-800.webp 800w":u}function wh(u){var n=ims(u);if(!n&&/^assets\/[a-z0-9-]+\.webp$/.test(u))return'width="800" height="600"';return n?'width=\"'+IDIM[n][0]+'\" height=\"'+IDIM[n][1]+'\"':'width=\"1280\" height=\"960\"'}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})}
function wa(t){return /^\d{8,}$/.test(N.whatsapp)?"https://wa.me/"+N.whatsapp+"?text="+encodeURIComponent(t||"Hola! Quiero consultar por las unidades disponibles."):"tel:"+N.telefonoTel}
function isWebContact(u){return /^https:\/\/wa\.me\//.test(u)}
function callFallback(s,t){s.textContent="";s.appendChild(document.createTextNode("Consulta lista: llamá al "+NEGOCIO.telefono+" o copiá el mensaje para pegarlo donde prefieras. "));var c=document.createElement("button");c.type="button";c.className="btn";c.textContent="Copiar mensaje";c.addEventListener("click",function(){var ok=function(){c.textContent="Mensaje copiado"};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){c.textContent="Copialo manualmente: "+t})}else{c.textContent="Copialo manualmente: "+t}});s.appendChild(c);var a=document.createElement("a");a.className="btn p";a.href="tel:"+NEGOCIO.telefonoTel;a.textContent="Llamar";s.appendChild(document.createTextNode(" "));s.appendChild(a)}
function ask(c){return "Hola! Vi la unidad U·"+String(STOCK.indexOf(c)+1).padStart(2,"0")+" · "+c.titulo+" "+c.anio+" en la página y quisiera consultar si sigue disponible. ¿Me confirman también precio y condiciones vigentes?"+(c.km?"":" ¿Y el kilometraje?")}
var IW={};
var CSZ="(min-width:900px) 380px,(min-width:640px) 50vw,100vw";
function SSET(s){return String(s)}
var EQ=[["Aire acondicionado",/aire/i],["Dirección",/direcci[oó]n/i],["Cierre centralizado",/cierre centralizado/i],["Levantavidrios eléctricos",/levantavidrios/i],["Espejos eléctricos",/espejos/i],["Doble airbag",/doble airbag/i],["ABS",/\bABS\b/],["Llantas de aleación",/llantas/i],["Antinieblas",/antinieblas/i]];
function eqs(c){var n=c.nota||"";return EQ.filter(function(q){return q[1].test(n)}).map(function(q){return q[0]})}
function ph(c){return c.fotos||(c.foto?[c.foto]:[])}
var ES={disponible:"Disponible",reservado:"Reservado",vendido:"Vendido"};
function est(c){var k=ES[c.estado]?c.estado:"consultar";return '<p class="est e-'+k+'"><i aria-hidden="true"></i>'+(ES[k]||"Consultá disponibilidad")+'</p>'}
var CHV={l:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',r:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'};
function garr(){return '<button type="button" class="g-a l" data-d="-1" aria-label="Foto anterior" disabled>'+CHV.l+'</button><button type="button" class="g-a r" data-d="1" aria-label="Foto siguiente">'+CHV.r+'</button>'}
function card(c){var i=STOCK.indexOf(c),f=ph(c),t=[],n=c.nota||"";if(/única mano/i.test(n))t.push("Única mano");if(/permuta/i.test(n))t.push("Permuta");
var im=f.length?'<div class="ct" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Fotos de '+esc(c.titulo)+'" data-k="0"><div class="ctk">'+f.map(function(s,k){return '<img src="'+esc(s)+'" srcset="'+ss(s)+'" sizes="'+CSZ+'" alt="'+esc(c.titulo)+', foto '+(k+1)+' de '+f.length+'" loading="'+(k?'lazy':'eager')+'" decoding="async" '+wh(s)+' draggable="false"'+(k?' aria-hidden="true"':'')+'>'}).join("")+'</div></div>'+(f.length>1?garr()+'<span class="g-c" aria-hidden="true">1/'+f.length+'</span><span class="g-s" aria-hidden="true">'+f.map(function(s,k){return k?'<i></i>':'<i class="on"></i>'}).join('')+'</span>':''):'';
var e=eqs(c),eh=e.slice(0,4).map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+(e.length>4?'<li class="mas">+'+(e.length-4)+' más en la ficha</li>':"");
return '<article class="car" data-i="'+i+'"><div class="im" data-gal>'+im+'</div><h3><button type="button" class="st" data-i="'+i+'">'+esc(c.titulo)+'</button></h3><p class="meta">'+esc(c.anio||"")+(c.km?' · '+esc(c.km):'')+(c.combustible?' · '+esc(c.combustible):'')+'</p>'+est(c)+(t.length?'<p class="tg">'+t.join(" · ")+'</p>':'')+(eh?'<ul class="eqp" aria-label="Equipamiento">'+eh+'</ul>':'')+'<div class="pr"><button type="button" class="st vf" data-i="'+i+'" aria-label="Ver ficha completa de '+esc(c.titulo)+'">Ver ficha completa ›</button></div><a class="btn wab" href="'+wa(ask(c))+'"'+(isWebContact(wa(ask(c)))?' target="_blank" rel="noopener noreferrer"':'')+' aria-label="Consultar esta unidad: '+esc(c.titulo)+'">Consultar</a></article>'}
/*PRE:end*/
window.SSET=SSET;window.wa=wa;window.ask=ask;
document.querySelectorAll("[data-wa]").forEach(function(a){var u=wa(a.getAttribute("data-wa"));a.href=u;if(isWebContact(u)){a.target="_blank";a.rel="noopener noreferrer";if(/^Llamar?(nos)?$/.test(a.textContent.trim()))a.textContent="Escribinos"}else{a.removeAttribute("target");a.removeAttribute("rel")}});
if(isWebContact(wa("")))document.querySelectorAll('form button[type="submit"]').forEach(function(b){if(b.firstChild&&/Preparar consulta/.test(b.firstChild.nodeValue||""))b.firstChild.nodeValue=b.firstChild.nodeValue.replace("Preparar consulta","Enviar consulta")});
document.querySelectorAll("[data-map]").forEach(function(a){a.href=N.mapsPlace});
$("reviewsLink").href=N.mapsReviews;$("reviewsLink2").href=N.mapsReviews;
var dir="<strong>"+esc(N.direccion)+"</strong>"+(N.referencia?" <span class='k'>("+esc(N.referencia)+")</span>":"")+"<br>"+esc(N.ciudad);
$("addr").innerHTML=dir;$("fAddr").textContent=N.direccion+", "+N.ciudad;
var p=$("phoneLink");p.href="tel:"+N.telefonoTel;p.textContent="Llamar al "+N.telefono;
$("fPhone").href="tel:"+N.telefonoTel;var fpb=$("fPhone").querySelector("b");if(fpb)fpb.textContent=N.telefono;$("barCall").href="tel:"+N.telefonoTel;
if(N.horarios)$("hrs").innerHTML="<h3>Horarios de atención</h3><p>"+esc(N.horarios)+"</p>";
document.querySelectorAll("[data-ig]").forEach(function(a){a.href="https://www.instagram.com/"+N.instagram+"/"});
document.querySelectorAll("[data-fb]").forEach(function(a){a.href=N.facebook});document.querySelectorAll("[data-tel]").forEach(function(a){a.href="tel:"+N.telefonoTel});
$("igLink").textContent="Instagram @"+N.instagram;
function render(){$("stockGrid").innerHTML=STOCK.map(card).join("");$("stockStatus").textContent=STOCK.length+(STOCK.length===1?" unidad":" unidades")}
/* Galería propia: pista con transform, flechas, arrastre, miniaturas y teclado. La usan las tarjetas y la ficha */
var SUP=0;
function gRoot(ct){return ct.closest("[data-gal]")}
function gN(ct){return ct.querySelectorAll("img").length}
function gK(ct){return +ct.getAttribute("data-k")||0}
function gLoad(ct){ct.querySelectorAll("img").forEach(function(m){if(m.getAttribute("loading")==="lazy")m.setAttribute("loading","eager")})}
function gGo(ct,k){var n=gN(ct);if(!n)return;k=Math.max(0,Math.min(n-1,k));ct.setAttribute("data-k",k);ct.firstElementChild.style.setProperty("--k",k);
ct.querySelectorAll("img").forEach(function(m,q){m.setAttribute("aria-hidden",q===k?"false":"true")});
var r=gRoot(ct);if(!r)return;gLoad(ct);
var c=r.querySelector(".g-c");if(c)c.textContent="Detalle "+String(k+1).padStart(2,"0")+"/"+String(n).padStart(2,"0");
r.querySelectorAll(".g-s i").forEach(function(x,q){x.classList.toggle("on",q===k)});
var l=r.querySelector(".g-a.l"),rr=r.querySelector(".g-a.r");if(l)l.disabled=k===0;if(rr)rr.disabled=k===n-1;
r.querySelectorAll(".g-t button").forEach(function(b){var on=+b.getAttribute("data-t")===k;b.classList.toggle("on",on);if(on){b.setAttribute("aria-current","true");var row=b.parentNode;row.scrollTo({left:b.offsetLeft-(row.clientWidth-b.offsetWidth)/2,behavior:RM?"auto":"smooth"})}else b.removeAttribute("aria-current")})}
function gStep(ct,d){gGo(ct,gK(ct)+d)}
var drag=null;
document.addEventListener("pointerdown",function(e){var ct=e.target.closest&&e.target.closest("[data-gal] .ct");if(!ct||e.button>0||gN(ct)<2)return;drag={ct:ct,id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,on:false,w:ct.clientWidth}});
document.addEventListener("pointermove",function(e){if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;
if(!drag.on){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return}if(Math.abs(dx)<8)return;drag.on=true;drag.ct.classList.add("dr")}
var k=gK(drag.ct),n=gN(drag.ct);if((k===0&&dx>0)||(k===n-1&&dx<0))dx*=.28;drag.dx=dx;drag.ct.firstElementChild.style.setProperty("--dx",dx+"px")});
function gEnd(e){if(!drag||(e&&e.pointerId!==drag.id))return;var d=drag;drag=null;d.ct.classList.remove("dr");d.ct.firstElementChild.style.removeProperty("--dx");
if(d.on){var t=Math.min(70,d.w*.16),k=gK(d.ct);gGo(d.ct,d.dx<-t?k+1:d.dx>t?k-1:k);SUP=Date.now()+350}}
document.addEventListener("pointerup",gEnd);document.addEventListener("pointercancel",gEnd);
document.addEventListener("keydown",function(e){var ct=e.target.closest&&e.target.closest("[data-gal] .ct");if(!ct)return;if(e.key==="ArrowRight"){e.preventDefault();gStep(ct,1)}else if(e.key==="ArrowLeft"){e.preventDefault();gStep(ct,-1)}});
$("stockGrid").addEventListener("pointerover",function(e){var ct=e.target.closest&&e.target.closest(".ct");if(ct&&!ct._L){ct._L=1;gLoad(ct)}});
$("stockGrid").addEventListener("touchstart",function(e){var ct=e.target.closest&&e.target.closest(".ct");if(ct&&!ct._L){ct._L=1;gLoad(ct)}},{passive:true});
$("stockGrid").addEventListener("click",function(e){var a=e.target.closest(".g-a");if(a){gStep(a.closest("[data-gal]").querySelector(".ct"),+a.getAttribute("data-d"));return}
if(Date.now()<SUP)return;var b=e.target.closest(".st");if(b)return open_(+b.getAttribute("data-i"));if(e.target.closest(".ct"))open_(+e.target.closest(".car").getAttribute("data-i"))});
$("stockGrid").addEventListener("keydown",function(e){if(e.key!=="Enter")return;var ct=e.target.closest&&e.target.closest(".ct");if(ct)open_(+ct.closest(".car").getAttribute("data-i"))});
function broken(e){if(e.target.tagName==="IMG")e.target.style.visibility="hidden"}
$("stockGrid").addEventListener("error",broken,true);
render();

var D=$("dlg");D.addEventListener("error",broken,true);
var BRAND='<div class="fcbr"><div class="lg"><img src="images/logo.webp" alt="Chita Automotores" width="722" height="287"></div><p><strong>'+esc(N.nombre)+'</strong>'+esc(N.direccion)+', '+esc(N.ciudad.split(',')[0])+'<br><a href="tel:'+esc(N.telefonoTel)+'">'+esc(N.telefono)+'</a> · <a href="https://www.instagram.com/'+esc(N.instagram)+'/" target="_blank" rel="noopener noreferrer">Instagram</a> · <a href="'+esc(N.facebook)+'" target="_blank" rel="noopener noreferrer">Facebook</a></p></div>';
function slug(c){return String((c.corto||c.titulo)+"-"+c.anio).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function shareUrl(i){return location.href.split("#")[0]+"#unidad-"+slug(STOCK[i])}
function tbc(v){return v?'<dd>'+esc(v)+'</dd>':""}
function edad(c){var a=new Date().getFullYear()-(+c.anio||0),k=parseInt(String(c.km).replace(/\D/g,""),10),h="";if(c.anio&&a>0){h+='<div><dt>Antigüedad</dt><dd>'+a+(a===1?" año":" años")+'</dd></div>';if(k>0)h+='<div><dt>Km por año (aprox.)</dt><dd>'+Math.round(k/a).toLocaleString("es-AR")+'</dd></div>'}return h}
function ext(c){var n=c.nota||"",pu=n.match(/(\d)\s*puertas/i),h=edad(c);if(pu)h+='<div><dt>Puertas</dt>'+tbc(pu[1])+'</div>';if(/única mano/i.test(n))h+='<div><dt>Titulares</dt>'+tbc("Única mano")+'</div>';if(c.transmision)h+='<div><dt>Transmisión</dt>'+tbc(c.transmision)+'</div>';if(/permuta/i.test(n))h+='<div><dt>Permuta</dt>'+tbc("Consultar")+'</div>';return h}
function eqm(c){var e=eqs(c);return e.length?'<div class="fce"><b>Equipamiento</b><ul>'+e.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ul></div>":""}
function setHash(h){try{history.replaceState(null,"",location.href.split("#")[0]+h)}catch(x){}}
var ci=0,lf;
function fimgs(c,f){return f.map(function(s,k){return '<img src="'+esc(s)+'" srcset="'+ss(s)+'" sizes="(min-width:1000px) 700px,100vw" alt="'+esc(c.titulo)+', foto '+(k+1)+' de '+f.length+'" '+wh(s)+' draggable="false"'+(k?' aria-hidden="true"':'')+'>'}).join("")}
/* Carril de km (v19): cada unidad es una pista; la barra es su kilometraje frente al máximo de la flota publicada */
function kmN(c){return parseInt(String(c.km==null?"":c.km).replace(/\D/g,""),10)||0}
function kl(c){var k=kmN(c),mx=Math.max.apply(null,STOCK.map(kmN));if(!mx)return"";
if(!k)return"";
var p=Math.max(2,Math.round(k/mx*100));
return'<div class="kl" role="img" aria-label="'+esc(c.km)+'. La unidad con más km de las '+STOCK.length+' publicadas tiene '+mx.toLocaleString("es-AR")+' km."><span class="kl-t">La Regla · km frente a la flota</span><span class="kl-r" aria-hidden="true"><i data-p="'+p+'"></i></span><span class="kl-n"><b data-k="'+k+'">'+k.toLocaleString("es-AR")+'</b> km<small> · tope de la flota: '+mx.toLocaleString("es-AR")+' km</small></span></div>'}
function klGo(root){var l=root.querySelector(".kl:not(.nd)");if(!l)return;var i=l.querySelector("i"),b=l.querySelector("b"),k=+b.getAttribute("data-k"),p=i.getAttribute("data-p")+"%";
if(matchMedia("(prefers-reduced-motion:reduce)").matches){i.style.width=p;return}
var t0=0,D=900;requestAnimationFrame(function(){i.style.width=p});
(function st(t){if(!t0)t0=t;var u=Math.min(1,(t-t0)/D),e=1-Math.pow(1-u,3);b.textContent=Math.round(k*e).toLocaleString("es-AR");if(u<1)requestAnimationFrame(st)})(performance.now())}
function fthumbs(c,f){return f.map(function(s,k){return '<button type="button" data-t="'+k+'" aria-label="Ver foto '+(k+1)+' de '+f.length+'"'+(k?'':' class="on" aria-current="true"')+'><img src="'+esc(String(s))+'" alt="" width="168" height="126" draggable="false"></button>'}).join("")}
function open_(i,keep){var n=STOCK.length,was=D.open;i=(i+n)%n;ci=i;var c=STOCK[i],f=ph(c),multi=f.length>1;
D.setAttribute("aria-label","Ficha: "+c.titulo);
D.innerHTML='<button class="fcx" type="button" data-x aria-label="Cerrar ficha"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
'<div class="fc"><div class="fcg" data-gal><div class="fcs">'+(f.length?'<div class="ct" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Fotos de '+esc(c.titulo)+'" data-k="0"><div class="ctk">'+fimgs(c,f)+'</div></div>'+(multi?garr()+'<span class="g-c" aria-hidden="true">1/'+f.length+'</span><span class="g-s" aria-hidden="true">'+f.map(function(s,k){return k?'<i></i>':'<i class="on"></i>'}).join('')+'</span>':''):'')+'</div>'+
(multi?'<div class="g-t" role="group" aria-label="Miniaturas de fotos">'+fthumbs(c,f)+'</div>':'')+BRAND+'</div>'+
'<div class="fci"><div class="fcb"><div class="fcu"><button type="button" data-n="'+(i-1)+'" data-k="p" aria-label="Unidad anterior">← Anterior</button><span>Unidad '+(i+1)+' de '+n+'</span><button type="button" data-n="'+(i+1)+'" data-k="s" aria-label="Unidad siguiente">Siguiente →</button></div>'+
'<h3 class="fch" data-remito="Remito U·'+String(i+1).padStart(2,"0")+'">'+esc(c.titulo)+'</h3>'+est(c)+
'<dl class="fcd"><div><dt>Año</dt><dd>'+esc(c.anio||"—")+'</dd></div>'+(c.km?'<div><dt>Km</dt><dd>'+esc(c.km)+'</dd></div>':'')+(c.combustible?'<div><dt>Combustible</dt><dd>'+esc(c.combustible)+'</dd></div>':'')+'<div><dt>Precio</dt>'+(c.precio&&!/^consultar$/i.test(c.precio)?'<dd>'+esc(c.precio)+'</dd>':'<dd>Consultanos</dd>')+'</div>'+ext(c)+'</dl>'+kl(c)+eqm(c)+
(c.nota?'<p class="fcn">'+esc(c.nota)+'</p>':'')+
'<p class="fcn s">Precio, disponibilidad y estado: consultanos.</p>'+
'<div class="fcr"><button class="btn" type="button" data-sh>Copiar enlace</button><a class="btn" href="https://wa.me/?text='+encodeURIComponent(c.titulo+" "+c.anio+": "+shareUrl(i))+'" target="_blank" rel="noopener noreferrer">Compartir enlace</a></div><p class="fcn s" role="status" data-shs></p></div>'+
'<div class="fcft"><a class="btn p" href="'+wa(ask(c))+'">Consultar esta unidad</a></div></div></div>';
var ct=D.querySelector(".ct");if(ct)gLoad(ct);klGo(D);
setHash("#unidad-"+slug(c));if(!was){lf=document.activeElement;document.documentElement.style.overflow="hidden";D.showModal()}else{var t=D.querySelector('[data-k="'+(keep||"")+'"]')||D.querySelector(".fcx");t.focus()}D.scrollTop=0}
D.addEventListener("close",function(){if(/^#unidad-/.test(location.hash))setHash("");document.documentElement.style.overflow="";if(lf&&lf.focus)lf.focus()});
D.addEventListener("keydown",function(e){var ct=D.querySelector(".ct");if(!ct||(e.key!=="ArrowRight"&&e.key!=="ArrowLeft"))return;if(e.target.closest&&e.target.closest(".ct"))return;e.preventDefault();gStep(ct,e.key==="ArrowRight"?1:-1)});
D.addEventListener("click",function(e){if(e.target===D||e.target.closest("[data-x]"))return D.close();
var sh=e.target.closest("[data-sh]");if(sh){var u=shareUrl(ci),m=D.querySelector("[data-shs]");if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(function(){m.textContent="Enlace copiado."},function(){m.textContent="No se pudo copiar. Enlace: "+u});else m.textContent="Copiá este enlace: "+u;return}
var a=e.target.closest(".g-a");if(a)return gStep(D.querySelector(".ct"),+a.getAttribute("data-d"));
var tb=e.target.closest(".g-t button");if(tb)return gGo(D.querySelector(".ct"),+tb.getAttribute("data-t"));
var b=e.target.closest("[data-n]");if(b)open_(+b.getAttribute("data-n"),b.getAttribute("data-k"))});


/* Hero v10: carrusel de unidades (portada de cada una, sin recorte ni zoom). motion.js solo anima la entrada.
   Cada unidad se presenta con la foto de portada que Chita rotuló: marca, modelo, año y km vienen impresos en la propia foto.
   Se vinculan por título; una unidad sin entrada usa su primera foto, y null la omite (misma unidad que otra ya presente). */
var HCOVER={"Renault Clio Dynamique 1.2N":"assets/w800/8.webp","Chevrolet Tracker Premier 1.8N":"assets/w800/27.webp","Fiat Palio Attractive 1.4N":"assets/w800/22.webp","Renault Kangoo Comfort 1.6N":"assets/w800/41.webp","Renault Kangoo Authentique 1.6N":"assets/w800/47.webp","Kia K3 EX Cross 1.6N":"assets/w800/53.webp","Peugeot 301 Allure 1.6 HDI":"assets/w800/57.webp","Peugeot Partner Patagónica 1.4N":"assets/w800/61.webp","Chevrolet Tracker Premier 1.2T":"assets/tracker-2021-1.webp"};
var HTHUMB={"assets/w800/8.webp":"assets/hero/t-8.webp","assets/w800/27.webp":"assets/hero/t-27.webp","assets/w800/22.webp":"assets/hero/t-22.webp","assets/w800/35.webp":"assets/hero/t-35.webp","assets/w800/41.webp":"assets/hero/t-41.webp","assets/w800/47.webp":"assets/hero/t-47.webp","assets/w800/53.webp":"assets/hero/t-53.webp","assets/w800/57.webp":"assets/hero/t-57.webp","assets/w800/61.webp":"assets/hero/t-61.webp","assets/w800/9.webp":"assets/hero/t-9.webp"};
/* Hero · fondo: una pasada con la portada de cada modelo (una foto por auto; Chita ya les grabó marca, modelo, año y km).
   SOLO frentes: ni entregas ni interiores van acá (esas fotos viven en los tres recuadros .hx-rail, junto al reel).
   Sale de STOCK + HCOVER: un auto nuevo o uno que se va se refleja solo. Es decorativo (aria-hidden): las unidades reales están en #unidades.
   Dos vueltas iguales de paneles para que el bucle (-50 %) no tenga costura. Pausa fuera de pantalla; con movimiento reducido queda quieta.
   */
(function(){var hero=$("hero");if(!hero||hero.querySelector(".hx-pass"))return;
var seen={},L=[];STOCK.forEach(function(c){var s=Object.prototype.hasOwnProperty.call(HCOVER,c.titulo)?HCOVER[c.titulo]:ph(c)[0];if(s&&!seen[s]){seen[s]=1;L.push(s)}});
if(!L.length)return;
var P=[];
L.forEach(function(s){P.push({src:s})});
function small(s){return /^assets\/w800\//.test(s)?s.replace("w800","w480"):s.replace(/\.webp$/,"-480.webp")}
function pan(x,i,dup){var s=x.src,big=/^assets\/w800\//.test(s)||/-800\.webp$/.test(s)?s:s.replace(/\.webp$/,"-800.webp");
return'<div class="hx-pn"><img src="'+esc(s)+'" srcset="'+esc(small(s))+' 480w, '+esc(big)+' 800w" sizes="(min-width:900px) 560px,60vw" alt="" width="800" height="1000" decoding="async" '+(!dup&&i<3?'fetchpriority="low"':'loading="lazy"')+' draggable="false"></div>'}
var set=P.map(function(x,i){return pan(x,i,0)}).join(""),dup=P.map(function(x,i){return pan(x,i,1)}).join("");
var el=document.createElement("div");el.className="hx-pass";el.setAttribute("aria-hidden","true");el.innerHTML='<div class="hx-trk">'+set+dup+'</div>';
hero.insertBefore(el,hero.firstChild);
if("IntersectionObserver" in window)new IntersectionObserver(function(e){el.classList.toggle("off",!e[0].isIntersecting)},{threshold:0}).observe(hero)})();
/* Hero · tres recuadros junto al reel (.hx-rail): entregas e interiores, cada recuadro alterna sus fotos con fundido.
   Escalonados para que no cambien a la vez; pausan fuera de pantalla; con movimiento reducido queda la primera foto fija. */
(function(){var hero=$("hero"),rail=hero&&hero.querySelector(".hx-rail");if(!rail)return;
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var tiles=[].slice.call(rail.querySelectorAll(".hx-rt")),vis=true,timers=[];
if("IntersectionObserver" in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(hero);
tiles.forEach(function(t,k){var sl=[].slice.call(t.querySelectorAll(".hx-rs"));if(sl.length<2)return;var n=0;
 setTimeout(function(){setInterval(function(){if(!vis||document.hidden)return;sl[n].classList.remove("on");n=(n+1)%sl.length;sl[n].classList.add("on")},5600)},1800*(k+1))})})();
/* Carrusel de unidades del hero: solo existe si el HTML lo trae (desde v17 el hero es el reel). */
if($("hs")){
var HZ=$("hzs"),HN=$("hn"),HM=$("hm"),HW=$("hw"),HF=$("hf"),HC=$("hcount"),HR=$("hrail"),HV=$("hv"),HNAV=$("hnav"),hi=0,SL=[],hsl,hAnim=null;
STOCK.forEach(function(c,ci){var s=Object.prototype.hasOwnProperty.call(HCOVER,c.titulo)?HCOVER[c.titulo]:ph(c)[0];if(s)SL.push({c:ci,src:s})});
var hL=SL.length;
function hsub(c){return c.anio+" · "+(c.km||"Km: consultar")+" · "+(c.combustible||"—")}
function hslide(x,i){var c=STOCK[x.c];return '<div class="hx-s" data-t="'+esc(c.titulo)+'" role="group" aria-roledescription="slide" aria-label="'+(i+1)+' de '+hL+': '+esc(c.titulo)+'"><img data-src="'+esc(x.src)+'" alt="'+esc(c.titulo+" "+c.anio)+'" width="800" height="1000" decoding="async" draggable="false"></div>'}
var f0=HZ.firstElementChild;
/* La primera foto ya viene en el HTML (la misma que el preload): se conserva y se completan sus datos; las demás se crean sin descargarse */
if(f0&&hL){var c0=STOCK[SL[0].c];f0.setAttribute("data-t",c0.titulo);f0.setAttribute("role","group");f0.setAttribute("aria-roledescription","slide");f0.setAttribute("aria-label","1 de "+hL+": "+c0.titulo);var i0=f0.querySelector("img");i0.src=SL[0].src;i0.alt=c0.titulo+" "+c0.anio;f0.style.setProperty("--bg","url('"+SL[0].src+"')");HZ.insertAdjacentHTML("beforeend",SL.slice(1).map(function(x,j){return hslide(x,j+1)}).join(""))}
hsl=HZ.querySelectorAll(".hx-s");
function hl(i){var s=hsl[i],m=s&&s.querySelector("img");if(m&&m.getAttribute("data-src")){m.src=m.getAttribute("data-src");m.removeAttribute("data-src")}if(s&&m&&!s.style.getPropertyValue("--bg"))s.style.setProperty("--bg","url('"+m.src+"')")}
/* Si una foto no carga, la unidad no queda en blanco: el marco muestra su nombre sobre el fondo de marca */
HZ.addEventListener("error",function(e){var s=e.target&&e.target.closest&&e.target.closest(".hx-s");if(s)s.classList.add("hx-err")},true);
/* Riel de miniaturas (112x140 en assets/hero/): solo con JS, porque sin JS el carrusel no se puede mover */
if(hL>1){HR.innerHTML=SL.map(function(x,i){var c=STOCK[x.c];return '<button type="button" class="hx-t" data-n="'+i+'" aria-label="Ver '+esc(c.titulo)+'"'+(i?'':' aria-current="true"')+'><img src="'+esc(HTHUMB[x.src]||x.src)+'" alt="" width="56" height="70" loading="lazy" decoding="async" draggable="false"></button>'}).join("");HR.hidden=false;HNAV.hidden=false}
HF.hidden=false;
function hstate(){HC.textContent=(hi+1)+" de "+hL;HR.querySelectorAll(".hx-t").forEach(function(b,k){if(k===hi)b.setAttribute("aria-current","true");else b.removeAttribute("aria-current")});var t=HR.children[hi];if(t&&HR.scrollWidth>HR.clientWidth)HR.scrollTo({left:t.offsetLeft-(HR.clientWidth-t.offsetWidth)/2,behavior:RM?"auto":"smooth"})}
function heroGo(n,dir){n=(n+hL)%hL;if(n===hi||!hL)return;var f=hi,c=STOCK[SL[n].c];hi=n;hl(n);hl((n+1)%hL);hl((n-1+hL)%hL);dir=dir||(n>f?1:-1);
if(hAnim){hAnim.finish();hAnim=null}
var a=hsl[f],b=hsl[n];a.classList.remove("on");a.classList.add("out");b.classList.add("on");
HN.textContent=c.titulo;HM.textContent=hsub(c);HW.href=wa(ask(c));HW.setAttribute("aria-label","Consultar esta unidad: "+c.titulo);hstate();
function done(){a.classList.remove("out")}
/* Cambio de unidad: cortina lateral sobre la foto anterior. Solo clip-path: la foto nueva entra sin escala ni opacidad */
if(RM||!b.animate){done()}else{hAnim=b.animate([{clipPath:dir>0?"inset(0 0 0 100%)":"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:650,easing:"cubic-bezier(.7,0,.2,1)"});hAnim.onfinish=function(){hAnim=null;done()};hAnim.oncancel=done}
document.dispatchEvent(new CustomEvent("chita:hero",{detail:{from:f,to:n,dir:dir}}))}
$("hprev").addEventListener("click",function(){heroGo(hi-1,-1)});$("hnext").addEventListener("click",function(){heroGo(hi+1,1)});
HR.addEventListener("click",function(e){var b=e.target.closest(".hx-t");if(b)heroGo(+b.getAttribute("data-n"))});
$("hs").addEventListener("keydown",function(e){if(e.key==="ArrowRight"){e.preventDefault();heroGo(hi+1,1)}else if(e.key==="ArrowLeft"){e.preventDefault();heroGo(hi-1,-1)}});
/* Deslizar la foto (táctil, lápiz o mouse) */
(function(){var x0=null,y0=0;HV.addEventListener("pointerdown",function(e){if(e.button>0)return;x0=e.clientX;y0=e.clientY});HV.addEventListener("pointerup",function(e){if(x0===null)return;var dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.4)heroGo(hi+(dx<0?1:-1),dx<0?1:-1)});HV.addEventListener("pointercancel",function(){x0=null})})();
HF.addEventListener("click",function(){open_(SL[hi].c)});HW.setAttribute("aria-label","Consultar esta unidad: "+STOCK[SL[0].c].titulo);HW.href=wa(ask(STOCK[SL[0].c]));
hstate();
/* La primera foto la pide el HTML; la siguiente y la anterior se precargan cuando el navegador está libre, nunca todas juntas */
(window.requestIdleCallback||function(f){setTimeout(f,1200)})(function(){hl(1%hL);hl(hL-1)},{timeout:3000});
window.chitaHero={go:heroGo,next:function(){heroGo(hi+1,1)},get i(){return hi},n:hL};
}
/* El hero mide la pantalla restando la cabecera: así entra completo, sin cortar título ni botones */
function hxTop(){var h=document.querySelector("header"),r=document.getElementById("hero");if(!r)return;var t=h?h.offsetHeight:0;r.style.setProperty("--hx-top",Math.round(t)+"px")}
hxTop();window.addEventListener("resize",hxTop);window.addEventListener("load",hxTop);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(hxTop);
function fromHash(){var m=/^#unidad-(.+)$/.exec(location.hash||"");if(!m)return;for(var i=0;i<STOCK.length;i++)if(slug(STOCK[i])===m[1]){open_(i);return}}
window.addEventListener("hashchange",fromHash);fromHash();
/* Línea de datos al pie del texto del hero (la lee identidad.js para la Cinta). */
(function(){var R=$("hero"),cp=R&&R.querySelector(".hx-copy");if(cp){var ft=document.createElement("p");ft.className="hx-foot hx-ui";ft.textContent=STOCK.length+" unidades publicadas · "+N.direccion+", Concepción del Uruguay";cp.appendChild(ft)}})();

/* Vender o permutar: una unidad por vez (segunda foto de cada una). motion.js anima el cambio con el evento chita:vr */
(function(){var VR=$("vr"),VZ=$("vrs"),VN=$("vrN"),VM=$("vrM"),VI=$("vrI"),VB=$("vrr"),vi=0,VS=[];
STOCK.forEach(function(c){var f=ph(c);if(f.length)VS.push({c:c,src:f[1]||f[0]})});var vL=VS.length;
if(!VR||vL<2)return;
function pad(n){return (n<10?"0":"")+n}
var VL=$("vrL");function vlk(n){var c=VS[n].c;if(VL)VL.href="#unidad-"+String((c.corto||c.titulo)+"-"+c.anio).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function vmeta(c){return c.anio+" · "+(c.km||"Km: consultar")+" · "+(c.combustible||"—")}
VZ.innerHTML=VS.map(function(x,q){return '<div class="vrz'+(q?'':' on')+'" role="group" aria-roledescription="slide" aria-label="'+(q+1)+' de '+vL+': '+esc(x.c.titulo)+'"><img src="'+esc(x.src)+'" srcset="'+ss(x.src)+'" sizes="(min-width:900px) 46vw,100vw" alt="'+esc(x.c.titulo+" "+x.c.anio)+'"'+(q?' loading="lazy"':'')+' '+wh(x.src)+' draggable="false"></div>'}).join("");
VB.innerHTML=VS.map(function(x,q){return '<button type="button" data-v="'+q+'" aria-label="Ver '+esc(x.c.titulo)+'"'+(q?'':' class="on"')+'><i></i></button>'}).join("");
VN.textContent=VS[0].c.titulo;VM.textContent=vmeta(VS[0].c);VI.textContent=pad(1)+" / "+pad(vL);vlk(0);
var vsl=VZ.querySelectorAll(".vrz"),vbt=VB.querySelectorAll("button");
function vrGo(n,dir){n=(n+vL)%vL;if(n===vi)return;var f=vi;vi=n;dir=dir||(n>f?1:-1);
vsl[f].classList.remove("on");vsl[n].classList.add("on");
vbt.forEach(function(b,q){b.classList.toggle("on",q===n);b.classList.toggle("done",q<n)});
VN.textContent=VS[n].c.titulo;VM.textContent=vmeta(VS[n].c);VI.textContent=pad(n+1)+" / "+pad(vL);vlk(n);
document.dispatchEvent(new CustomEvent("chita:vr",{detail:{from:f,to:n,dir:dir}}))}
VB.addEventListener("click",function(e){var b=e.target.closest("button");if(b)vrGo(+b.getAttribute("data-v"))});
VR.addEventListener("click",function(e){var a=e.target.closest("[data-vd]");if(a){var d=+a.getAttribute("data-vd");vrGo(vi+d,d)}});
window.chitaVr={go:vrGo,next:function(){vrGo(vi+1,1)},get i(){return vi},n:vL}})();

$("fqc").textContent=N.direccion+" · "+N.telefono;

/* Formulario: valida y arma el mensaje de contacto segun la intencion elegida */
var FM=$("canjeForm"),FS=$("fStatus"),YR=new Date().getFullYear()+1;
function kmVal(v){return v.replace(/[.\s]/g,"")}
function check(){var m=FM.modelo,a=FM.anio,k=FM.km,y=+a.value;
m.setCustomValidity(m.value.trim()?"":"Ingresá la marca y el modelo.");
a.setCustomValidity(/^\d{4}$/.test(a.value)&&y>=1950&&y<=YR?"":"Ingresá un año de 4 dígitos entre 1950 y "+YR+".");
k.setCustomValidity(!k.value||/^\d{1,7}$/.test(kmVal(k.value))?"":"Ingresá solo números, por ejemplo 85000.")}
var INT={vender:"Hola! Quiero vender mi auto: ",permutar:"Hola! Quiero permutar mi auto por otro: ",consignar:"Hola! Quiero consultar por dejar mi auto en consignación: ",consulta:"Hola! Quiero consultar por mi auto: "};
function msgText(){var m=FM.modelo.value.trim(),a=FM.anio.value.trim(),k=kmVal(FM.km.value),ok=/^\d{1,7}$/.test(k),t=(INT[FM.interes.value]||INT.consulta)+(m||"…")+(a?", año "+a:"")+(ok&&k?", "+Number(k).toLocaleString("es-AR")+" km":"");return t+((m||a||(ok&&k))?".":"")}
var NU=$("nsU");if(NU)NU.textContent=STOCK.length;
var PV=$("wpT");function pv(){if(PV)PV.textContent=msgText()}
FM.addEventListener("input",function(){check();FS.textContent="";pv()});check();pv();
FM.addEventListener("submit",function(e){e.preventDefault();check();if(!FM.reportValidity())return;
var u=wa(msgText());
if(isWebContact(u)){FS.textContent="Abriendo WhatsApp con tu consulta. Si no se abrió, ";var l=document.createElement("a");l.href=u;l.target="_blank";l.rel="noopener noreferrer";l.textContent="tocá acá";FS.appendChild(l);FS.appendChild(document.createTextNode("."));window.open(u,"_blank","noopener")}else{callFallback(FS,msgText())}});
/* Visita y búsqueda: arman un mensaje de contacto que envía la persona; no se guarda nada */
$("vsU").insertAdjacentHTML("beforeend",STOCK.map(function(c,i){return '<label class="ck"><input type="checkbox" name="u" value="'+i+'"><span>'+esc((c.corto||c.titulo)+" "+c.anio)+'</span></label>'}).join(""));
function waForm(f,build){var s=f.querySelector(".fs");f.addEventListener("submit",function(e){e.preventDefault();if(!f.reportValidity())return;var m=build(f),u=wa(m);if(isWebContact(u)){s.textContent="Abriendo WhatsApp con tu consulta. Si no se abrió, ";var l=document.createElement("a");l.href=u;l.target="_blank";l.rel="noopener noreferrer";l.textContent="tocá acá";s.appendChild(l);s.appendChild(document.createTextNode("."));window.open(u,"_blank","noopener")}else{callFallback(s,m)}})}
/* Pase de visita: las unidades se numeran en el orden en que se eligen; ese orden va también en el mensaje */
var visOrd=[];(function(){var f=$("visitaForm"),box=$("pase");if(!f||!box)return;
function render(){var w=f.cuando.value.trim(),was=box.hidden;if(!visOrd.length&&!w){box.hidden=true;return}
 box.innerHTML='<div class="pase-m"><b class="pase-h">Pase de visita</b>'+(visOrd.length?'<ol>'+visOrd.map(function(v,i){var c=STOCK[+v];return '<li><i>'+(i+1)+'</i>'+esc(c.titulo+" "+c.anio)+'</li>'}).join("")+'</ol>':'')+(w?'<p class="pase-w">Día y horario: '+esc(w)+'</p>':'')+'</div><div class="pase-t"><b>Chita</b><span>Gral. Galarza 1712</span><span class="pase-state">Te confirmamos por WhatsApp</span></div>';
 box.hidden=false;if(was){box.classList.remove("nv");void box.offsetWidth;box.classList.add("nv")}}
$("vsU").addEventListener("change",function(e){var t=e.target;if(!t||t.name!=="u")return;var i=visOrd.indexOf(t.value);if(t.checked&&i<0)visOrd.push(t.value);if(!t.checked&&i>=0)visOrd.splice(i,1);render()});
f.cuando.addEventListener("input",render)})();
waForm($("visitaForm"),function(f){var s=visOrd.map(function(v,i){var c=STOCK[+v];return (visOrd.length>1?(i+1)+") ":"")+c.titulo+" "+c.anio}),w=f.cuando.value.trim();return "Hola! Quiero coordinar una visita para ver "+(s.length?s.join(", "):"algunas unidades")+"."+(w?" Me queda cómodo: "+w+".":"")+((window.GUIA_MARCADOS||[]).length?" Quiero revisar: "+window.GUIA_MARCADOS.map(function(x){return x.replace(/[.\s]+$/,"")}).join("; ")+".":"")+" ¿Me confirman si siguen disponibles y en qué horario puedo ir?"});
waForm($("buscoForm"),function(f){var a=f.anio.value.trim(),p=f.presu.value.trim(),c=f.comb.value;return "Hola! Estoy buscando un auto: "+f.modelo.value.trim()+(a?", año "+a+" en adelante":"")+(c?", "+c:"")+(p?", presupuesto aproximado "+p:"")+". ¿Tienen o van a tener algo parecido?"});
})();
