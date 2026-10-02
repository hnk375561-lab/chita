import {CONFIG} from './config.js';
import {setLayer} from './layers.js';

export function initLens(state){
  const el=state.instrument;
  let targetX=innerWidth*.7,targetY=innerHeight*.48,x=targetX,y=targetY,targetRadius=1,radius=1,dragId=null;
  const measure=()=>{const r=el.getBoundingClientRect();state.rect={left:r.left,top:r.top,width:el.clientWidth,height:el.clientHeight}};
  measure();new ResizeObserver(measure).observe(el);
  const move=(px,py)=>{targetX=Math.max(80,Math.min(state.rect.width-80,px));targetY=Math.max(100,Math.min(state.rect.height-80,py));el.classList.add('is-moving')};
  el.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;dragId=e.pointerId;el.setPointerCapture(dragId);move(e.clientX-state.rect.left,e.clientY-state.rect.top)});
  el.addEventListener('pointermove',e=>{if(dragId===e.pointerId)move(e.clientX-state.rect.left,e.clientY-state.rect.top)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>el.addEventListener(t,()=>{dragId=null}));
  el.addEventListener('wheel',e=>{e.preventDefault();targetRadius=Math.max(.7,Math.min(1.35,targetRadius+(e.deltaY<0?.08:-.08)))},{passive:false});
  const setRadius=d=>{targetRadius=Math.max(.7,Math.min(1.35,targetRadius+d))};
  document.querySelectorAll('[data-radius]').forEach(b=>b.addEventListener('click',()=>setRadius(b.dataset.radius==='+'?.12:-.12)));
  const next=()=>setLayer(state,(state.layer+1)%CONFIG.layers.length);
  el.addEventListener('click',e=>{if(e.target===el||e.target.closest('.lens'))next()});
  el.addEventListener('dblclick',()=>setLayer(state,0));
  el.addEventListener('keydown',e=>{const step=e.shiftKey?80:28;if(e.key==='ArrowLeft')targetX-=step;if(e.key==='ArrowRight')targetX+=step;if(e.key==='ArrowUp')targetY-=step;if(e.key==='ArrowDown')targetY+=step;if(e.key==='+'||e.key==='=')setRadius(.12);if(e.key==='-')setRadius(-.12);if(e.key==='Enter'||e.key===' ')next();if(e.key==='Escape')setLayer(state,0);if(e.key.startsWith('Arrow')||['+','-','=','Enter',' '].includes(e.key))e.preventDefault()});
  const tick=()=>{x+=(targetX-x)*.34;y+=(targetY-y)*.34;radius+=(targetRadius-radius)*.2;state.lens.style.transform=`translate3d(${Math.round(x-state.lens.offsetWidth/2)}px,${Math.round(y-state.lens.offsetHeight/2)}px,0) scale(${radius})`;state.image.style.transform=`translate3d(${Math.round((targetX-x)*.18)}px,${Math.round((targetY-y)*.18)}px,0) scale(${1.06/radius})`;state.coords.textContent=`X ${Math.round(x/state.rect.width*100)} / Y ${Math.round(y/state.rect.height*100)}`};
  gsap.ticker.add(tick);return()=>gsap.ticker.remove(tick);
}
