import {SIZE,inside} from '../core/grid.js';
import {itemDef} from '../content/furniture.js';
import {JOBS} from '../content/careers.js';
import {NEEDS} from '../content/needs.js';
import {TRAITS} from '../content/traits.js';
import {dimensions} from '../systems/objects/geometry.js';
export const CURRENT_SAVE_VERSION=1;
export function validateState(s){
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 if(!s||s.version!==CURRENT_SAVE_VERSION||!finite(s.money)||!finite(s.minutes)||s.minutes<0||!s.person||typeof s.person.name!=='string'||s.person.name.length>40||!inside(s.person.x,s.person.y))throw Error('This is not a valid Notsims save.');
 for(const c of ['skin','hair','shirt'])if(!/^#[0-9a-f]{6}$/i.test(s.person[c]))throw Error('Invalid character color.');
 if(!['short','long','curly'].includes(s.person.style)||!Object.hasOwn(TRAITS,s.person.trait))throw Error('Invalid character.');
 if(!s.needs||Object.keys(NEEDS).some(k=>!finite(s.needs[k])||s.needs[k]<0||s.needs[k]>100))throw Error('Invalid needs.');
 if(!Array.isArray(s.furniture)||s.furniture.length>SIZE*SIZE*2||!s.floors||!s.walls)throw Error('Invalid house.');
 for(const [k,f] of Object.entries(s.floors)){const [x,y]=k.split(',').map(Number);if(!inside(x,y)||!['wood','tile','sage'].includes(f))throw Error('Invalid floor.');}
 for(const [k,v] of Object.entries(s.walls)){const m=/^([hv]):(\d+),(\d+)$/.exec(k);if(!m||+m[2]>SIZE||+m[3]>SIZE||!['wall','door'].includes(v))throw Error('Invalid wall.');}
 const ids=new Set();for(const f of s.furniture){if(!itemDef(f.type)||!inside(f.x,f.y)||![0,1,2,3].includes(f.rotation)||!Number.isInteger(f.id)||ids.has(f.id))throw Error('Invalid furniture.');const [w,h]=dimensions(f);if(!inside(f.x+w-1,f.y+h-1))throw Error('Furniture outside plot.');ids.add(f.id);}
 if(s.job!==null&&!JOBS.some(j=>j.id===s.job))throw Error('Invalid career.');
 if(!finite(s.shifts)||s.shifts<0||!finite(s.skill)||s.skill<0||s.skill>100||!Number.isInteger(s.billsDay)||s.billsDay<0)throw Error('Invalid progress.');
 if(!Array.isArray(s.log)||!s.log.every(t=>typeof t==='string'))s.log=[];
 s.log=s.log.slice(0,12).map(t=>t.slice(0,200));s.person.name=s.person.name.trim()||'Alex';
 return s;
}
