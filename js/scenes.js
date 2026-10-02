import {CONFIG} from './config.js';
export function renderStages(root){root.innerHTML=CONFIG.stages.map((s,i)=>`<li><time>${s.label}</time><strong>${s.name}</strong><span>${s.available?'FUENTE EN CONFIG':'NO USAR / EVIDENCIA INSUFICIENTE'}</span></li>`).join('')}
export function renderEvidence(root){root.innerHTML=CONFIG.evidence.map(e=>`<div class="evidence-row"><strong>${e.fact}</strong><span>${e.source}</span><small>${e.date}</small><small class="${e.level==='CONFIRMADO'?'confirmed':'not-use'}">${e.level} · ${e.rights}</small></div>`).join('')}
export function stageAt(progress){const i=Math.min(CONFIG.stages.length-1,Math.floor(progress*CONFIG.stages.length));return {stage:CONFIG.stages[i],index:i}}
