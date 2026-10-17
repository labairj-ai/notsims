import {INTERACTION_IDS} from '../../content/interactions.js';
import {itemDef} from '../../content/furniture.js';
// A list contract permits future multi-interaction objects without new action kinds.
export function objectInteractions(f){const d=itemDef(f.type);if(d?.interactions)return d.interactions.map(i=>({...i,interactionId:'leisure.quiet',cost:0}));return d?.need?[{id:'use',interactionId:INTERACTION_IDS[d.recipe??f.type],label:d.verb,need:d.need,rate:d.rate,total:d.duration,cost:d.cost||0,skill:!!d.skill}]:[];}
export const resolveInteraction=(f,id='use')=>objectInteractions(f).find(i=>i.id===id);
