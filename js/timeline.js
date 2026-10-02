import {CONFIG} from './config.js';
export function createTimeline(els,onChange){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!window.gsap||!window.ScrollTrigger)return null;
  gsap.registerPlugin(ScrollTrigger);
  const tl=gsap.timeline({scrollTrigger:{trigger:els.track,start:'top top',end:()=>`+=${innerHeight*CONFIG.zones.length}`,pin:els.pin,scrub:.7,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>onChange(Math.min(CONFIG.zones.length-1,Math.floor(self.progress*CONFIG.zones.length+.001)))}});
  CONFIG.zones.forEach((zone,i)=>{const p=i/(CONFIG.zones.length-1||1);const q=els.copy[i];const base=i===0?0:1;tl.addLabel(zone.id,p).to(els.word,{xPercent:i%2?-4:4,duration:.65,ease:'none'},p).to(els.base,{xPercent:i%2?6:-6,scale:i===0?1.02:1.08,duration:.65,ease:'power2.out'},p).to(els.detail,{xPercent:i%2?-18:18,yPercent:i%3*6-6,scale:1+i*.06,rotation:i%2?1:-1,duration:.65,ease:'power2.out'},p).to(q,{opacity:1,duration:.1},p).to(q,{opacity:0,duration:.08},Math.min(1,p+.16));});
  return tl;
}
