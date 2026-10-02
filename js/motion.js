/* Movimiento · GSAP + ScrollTrigger. Solo transform/opacity, expo.out, sin scroll-jacking. Con prefers-reduced-motion no se registra nada. */
(function(){
var g=window.gsap,ST=window.ScrollTrigger;
if(!g||!ST||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
g.registerPlugin(ST);
/* Un solo momento orquestado: el nombre sube dentro de su máscara y la foto se asienta */
g.from("h1 .ln>span",{yPercent:110,duration:1.2,ease:"expo.out",stagger:.12});
g.from(".plate",{rotate:-8,y:-20,opacity:0,duration:.9,ease:"expo.out",delay:.5});
g.from(".hph",{clipPath:"inset(0% 0% 100% 0%)",duration:1.3,ease:"expo.inOut",delay:.25});
/* La cinta de dirección corre ligada al scroll */
g.to(".tape span",{xPercent:-100,ease:"none",scrollTrigger:{trigger:".tape",start:"top bottom",end:"bottom top",scrub:true}});
/* Las unidades entran como filas de un listado, cada una con su propia línea */
ST.batch("#stockGrid .car",{start:"top 88%",once:true,onEnter:function(b){g.from(b,{y:36,opacity:0,duration:.8,ease:"expo.out",stagger:.1})}});
})();
