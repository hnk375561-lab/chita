/* CHITA · Quiénes somos "Frente a frente": el frente fijo cambia según el servicio que se lee. Sin dependencias. */
(function(){
var d=document,s=d.getElementById("nosotros"),st=d.getElementById("frStage");
if(!s||!st)return;
var steps=[].slice.call(s.querySelectorAll(".fr-step")),imgs=[].slice.call(st.querySelectorAll(".fr-img")),dots=[].slice.call(st.querySelectorAll(".fr-dots u")),sw=st.querySelector(".fr-sweep"),nm=d.getElementById("frName");
if(!steps.length||steps.length!==imgs.length)return;
var cur=0,tick=0,mq=matchMedia("(min-width:900px)"),rm=matchMedia("(prefers-reduced-motion:reduce)");
function set(i){
if(i===cur)return;cur=i;
if(sw&&!rm.matches){sw.classList.remove("go");void sw.offsetWidth;sw.classList.add("go")}
steps.forEach(function(e,k){e.classList.toggle("on",k===i)});
imgs.forEach(function(e,k){e.classList.toggle("on",k===i);e.setAttribute("aria-hidden",k===i?"false":"true")});
dots.forEach(function(e,k){e.classList.toggle("on",k===i)});
if(nm)nm.textContent=steps[i].getAttribute("data-name")||""}
function measure(){
tick=0;var vh=innerHeight,r=s.getBoundingClientRect();
if(r.bottom<0||r.top>vh)return;
var line=vh*.5;
if(!mq.matches){var b=st.getBoundingClientRect().bottom;line=b+(vh-b)*.45}
var best=0,bd=1e9;
steps.forEach(function(e,k){var q=e.getBoundingClientRect(),dd=Math.abs(q.top+q.height/2-line);if(dd<bd){bd=dd;best=k}});
set(best)}
function req(){if(!tick)tick=requestAnimationFrame(measure)}
addEventListener("scroll",req,{passive:true});addEventListener("resize",req);
req()})();
