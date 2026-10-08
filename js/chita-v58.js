/* CHITA · v58
   1) Comparador plegable: cerrado de entrada, se abre con su botón o con cualquier enlace a #versus
   2) Índice de unidades (#modelos): tabla y visor que leen STOCK sin tocar ni redondear nada (sin cifras animadas)
   Todo sale de window.STOCK: ningún dato propio. */
(function(){
"use strict";
var S=window.STOCK||[];
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function $(i){return document.getElementById(i)}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var SS=typeof ss==="function"?ss:function(u){return u};
function slug(c){return String((c.corto||c.titulo)+"-"+c.anio).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function fotos(c){return c.fotos&&c.fotos.length?c.fotos:[c.foto]}
function pad(n){return String(n).padStart(2,"0")}
function kmTxt(c){return c.km?String(c.km).replace(/\s*km\s*$/i,""):""}
function refresh(){try{window.dispatchEvent(new Event("resize"))}catch(e){}}

/* ═════════ 1 · COMPARADOR PLEGABLE ═════════ */
(function(){
var v=$("versus"),tg=$("cmpTg"),body=$("cmpBody"),cl=$("cmpCl"),tz=$("cmpTeaser");
if(!v||!tg||!body)return;
var lab=tg.querySelector(".cmp-tg-t"),drawn=false,timer=0;
/* Anticipo visual: las mismas cinco unidades con las que arranca el comparador */
if(tz&&S.length){
  var FEAT=["Clio Dynamique","Tracker Premier","Kangoo Comfort","K3 EX Cross","301 Allure"],ix=[];
  FEAT.forEach(function(n){for(var i=0;i<S.length;i++)if((S[i].corto||S[i].titulo)===n){ix.push(i);break}});
  if(!ix.length)ix=S.slice(0,5).map(function(c,i){return i});
  tz.innerHTML=ix.map(function(i){var f=fotos(S[i])[0];return'<li><img src="'+esc(f)+'" srcset="'+esc(SS(f))+'" sizes="60px" alt="" width="60" height="75" loading="lazy" decoding="async"></li>'}).join("")+(S.length>ix.length?'<li class="more">+'+(S.length-ix.length)+'</li>':"");
}
function done(){if(v.classList.contains("is-open"))v.classList.add("is-done");refresh()}
function set(on,scrollBack){
  if(on===v.classList.contains("is-open"))return;
  clearTimeout(timer);v.classList.remove("is-done");
  if(on&&!drawn){drawn=true;if(window.chitaCmp)window.chitaCmp.draw()}
  v.classList.toggle("is-open",on);
  tg.setAttribute("aria-expanded",on?"true":"false");
  if(lab)lab.textContent=on?"Cerrar el comparador":"Abrir el comparador";
  body.inert=!on;
  if(!on&&scrollBack){var y=v.getBoundingClientRect().top+window.pageYOffset-64;if(y<window.pageYOffset)window.scrollTo({top:Math.max(0,y),behavior:RM?"auto":"smooth"})}
  if(RM){done();return}
  timer=setTimeout(done,950); /* respaldo por si no llega transitionend */
}
body.addEventListener("transitionend",function(e){if(e.target===body&&e.propertyName==="grid-template-rows"){clearTimeout(timer);done()}});
tg.addEventListener("click",function(){set(!v.classList.contains("is-open"),false)});
if(cl)cl.addEventListener("click",function(){set(false,true);tg.focus({preventScroll:true})});
/* Cualquier enlace a #versus (menú, pie, «Comparar») lo abre; el scroll lo resuelve el sitio como siempre */
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href="#versus"]');if(a)set(true,false)},true);
function fromHash(){if(location.hash==="#versus")set(true,false)}
window.addEventListener("hashchange",fromHash);fromHash();
})();

/* ═════════ 2 · ÍNDICE DE UNIDADES ═════════ */
(function(){
var L=$("ixl"),F=$("ixf");if(!L||!F||!S.length)return;
function brand(c){return String(c.titulo||"").trim().split(/\s+/)[0]}
function model(c){var b=brand(c);return String(c.titulo||"").trim().slice(b.length).trim()}
function waHref(c){return typeof wa==="function"&&typeof ask==="function"?wa(ask(c)):"#contacto"}
L.innerHTML=S.map(function(c,i){
  var n=fotos(c).length,k=kmTxt(c),f=c.foto;
  var meta=[c.anio,k?k+" km":"Km: consultar",n+(n===1?" foto":" fotos")].join(" · ");
  return'<li><a href="#unidad-'+slug(c)+'" data-i="'+i+'" aria-label="'+esc(c.titulo+", "+c.anio+", "+(k?k+" kilómetros":"km a consultar")+", "+n+(n===1?" foto":" fotos")+". Ver detalles")+'">'
    +'<img src="'+esc(f)+'" srcset="'+esc(SS(f))+'" sizes="64px" alt="" width="64" height="80" loading="lazy" decoding="async">'
    +'<span class="ix-n" aria-hidden="true">'+pad(i+1)+'</span>'
    +'<span class="ix-t"><small>'+esc(brand(c))+'</small><b>'+esc(model(c))+'</b><span class="ix-m">'+esc(meta)+'</span></span>'
    +'<span class="ix-v" aria-hidden="true">'+esc(c.anio||"–")+'</span>'
    +(k?'<span class="ix-v" aria-hidden="true">'+esc(k)+'</span>':'<span class="ix-v nd" aria-hidden="true">Consultar</span>')
    +'<span class="ix-v ft" aria-hidden="true">'+n+'</span></a></li>'}).join("");
var A=[].slice.call(L.querySelectorAll("a")),P={},K={},cur=-1,PL={};
function build(i){
  var c=S[i],ph=fotos(c),n=ph.length,k=kmTxt(c),sl=slug(c);
  function dd(v,u){return v?'<dd>'+esc(v)+(u?'<i>'+u+'</i>':"")+'</dd>':'<dd class="nd">Sin informar</dd>'}
  var el=document.createElement("div");el.className="ix-p";
  el.innerHTML='<figure class="ix-fig"><img src="'+esc(ph[0])+'" srcset="'+esc(SS(ph[0]))+'" sizes="(min-width:1000px) 30vw, 90vw" alt="'+esc(c.titulo)+', foto 1 de '+n+'" width="800" height="1000" decoding="async">'
    +'<span class="ix-cnt" aria-hidden="true">Foto 1 de '+n+'</span>'
    +(n>1?'<button type="button" class="ix-ar" data-d="-1" aria-label="Foto anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" class="ix-ar" data-d="1" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>':"")
    +'</figure><div class="ix-i"><span class="ix-br">'+esc(brand(c))+' · U·'+pad(i+1)+'</span><h3>'+esc(c.titulo)+'</h3>'
    +'<dl class="ix-sp"><div><dt>Año</dt>'+dd(c.anio)+'</div><div><dt>Kilómetros</dt>'+dd(k,"km")+'</div><div><dt>Combustible</dt>'+dd(c.combustible)+'</div><div><dt>Fotos</dt>'+dd(String(n))+'</div></dl>'
    +(c.nota?'<p class="ix-nota">'+esc(c.nota)+'</p>':"")
    +(n>1?'<div class="ix-th" role="group" aria-label="Fotos de '+esc(c.titulo)+'">'+ph.map(function(p,j){return'<button type="button" class="'+(j?"":"on")+'" data-k="'+j+'" aria-label="Ver foto '+(j+1)+' de '+n+'"'+(j?"":' aria-current="true"')+'><img src="'+esc(p)+'" srcset="'+esc(SS(p))+'" sizes="70px" alt="" width="70" height="88" loading="lazy" decoding="async"></button>'}).join("")+'</div>':"")
    +'<div class="ix-act"><a class="btn p" href="#unidad-'+sl+'">Ver detalles</a><a class="btn" href="'+esc(waHref(c))+'" target="_blank" rel="noopener noreferrer" aria-label="Consultar por '+esc(c.titulo)+'">Consultar</a></div></div>';
  return el}
function pre(i){if(PL[i])return;PL[i]=1;fotos(S[i]).forEach(function(s){var m=new Image();m.decoding="async";m.src=s})}
function go(i){
  if(i===cur||!S[i])return;cur=i;pre(i);
  A.forEach(function(a,j){var on=j===i;a.classList.toggle("act",on);if(on)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});
  if(!P[i]){P[i]=build(i);K[i]=0}
  F.replaceChildren(P[i]);
}
function show(i,k){
  var c=S[i],ph=fotos(c),n=ph.length,el=P[i];if(!el)return;
  k=(k+n)%n;K[i]=k;
  var im=el.querySelector(".ix-fig img");im.classList.remove("sw");void im.offsetWidth;
  im.srcset=SS(ph[k]);im.src=ph[k];im.alt=c.titulo+", foto "+(k+1)+" de "+n;if(!RM)im.classList.add("sw");
  el.querySelector(".ix-cnt").textContent="Foto "+(k+1)+" de "+n;
  [].forEach.call(el.querySelectorAll(".ix-th button"),function(b,j){var on=j===k;b.classList.toggle("on",on);if(on)b.setAttribute("aria-current","true");else b.removeAttribute("aria-current")});
}
L.addEventListener("pointerover",function(e){if(e.pointerType==="touch")return;var a=e.target.closest("a");if(a)go(+a.dataset.i)});
L.addEventListener("focusin",function(e){var a=e.target.closest("a");if(a)go(+a.dataset.i)});
L.addEventListener("keydown",function(e){
  if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
  var a=e.target.closest("a");if(!a)return;e.preventDefault();
  var j=+a.dataset.i+(e.key==="ArrowDown"?1:-1);if(A[j])A[j].focus()});
F.addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;var i=cur;
  if(b.classList.contains("ix-ar"))show(i,K[i]+(+b.dataset.d));
  else if(b.hasAttribute("data-k"))show(i,+b.dataset.k)});
F.addEventListener("pointerover",function(e){if(e.pointerType!=="mouse")return;var b=e.target.closest&&e.target.closest(".ix-th button");if(b&&!b.classList.contains("on"))show(cur,+b.dataset.k)});
F.addEventListener("focusin",function(e){var b=e.target.closest&&e.target.closest(".ix-th button");if(b&&!b.classList.contains("on"))show(cur,+b.dataset.k)});
F.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"||e.key==="ArrowRight"){var n=fotos(S[cur]).length;if(n>1&&e.target.closest(".ix-p")){e.preventDefault();show(cur,K[cur]+(e.key==="ArrowRight"?1:-1))}}});
go(0);
})();
})();

/* v59 · fotos de las unidades: se piden antes de que aparezcan (sin esperar al carrusel ni al scroll). */
(function(){
  function warm(root){root.querySelectorAll("img[loading=lazy]").forEach(function(m){m.setAttribute("loading","eager")})}
  var cards=document.querySelectorAll("#stockGrid .car");
  if(!cards.length)return;
  if(!("IntersectionObserver" in window)){cards.forEach(warm);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){warm(e.target);io.unobserve(e.target)}})},{rootMargin:"2200px 0px"});
  cards.forEach(function(c,i){if(i<3)warm(c);else io.observe(c)});
})();
