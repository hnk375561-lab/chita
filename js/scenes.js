import {CONFIG} from './config.js';
export function renderPhases(root){root.innerHTML=CONFIG.phases.map((p,i)=>`<article class="phase-row"><b>${String(i+1).padStart(2,'0')}</b><strong>${p.name}</strong><p>${p.copy} <span>${p.source}</span></p></article>`).join('')}
export function renderMarks(root){root.innerHTML=CONFIG.phases.map(p=>`<span style="left:${p.t/CONFIG.duration*100}%">${p.name}</span>`).join('')}
export function phaseAt(t){let current=CONFIG.phases[0];for(const p of CONFIG.phases){if(t>=p.t)current=p}return current}
