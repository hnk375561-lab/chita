import { CONFIG } from './config.js';
export function zoneLabel(zone,i){return `${String(i+1).padStart(2,'0')} / ${zone.name}`}
export function renderDots(root,active=0){root.innerHTML=CONFIG.zones.map((z,i)=>`<span class="zone-dot" aria-current="${i===active}" title="${zoneLabel(z,i)}"></span>`).join('')}
