import {CONFIG} from './config.js';
import {initUI} from './ui.js';
import {createTimeline} from './timeline.js';

const ui=initUI();
document.querySelector('[data-vehicle-label]').textContent=`${CONFIG.vehicle.brand} ${CONFIG.vehicle.model} ${CONFIG.vehicle.version}`;
const preload=()=>{CONFIG.zones.slice(1).forEach(z=>{if(z.image){const im=new Image();im.src=z.image}if(z.detailImage){const im=new Image();im.src=z.detailImage}})};
if('requestIdleCallback' in window) requestIdleCallback(preload,{timeout:1800}); else setTimeout(preload,800);
createTimeline(ui.els,ui.setZone);
document.addEventListener('visibilitychange',()=>{if(document.hidden) window.gsap?.ticker?.sleep(); else window.gsap?.ticker?.wake()});
