import {SOCIAL_LIMITS,SOCIAL_ACTIONS} from '../content/social.js';
import {TRAITS} from '../content/traits.js';
import {inside} from '../core/grid.js';
const bad=()=>{throw Error('Invalid social state.');};
const finite=(v,min=0,max=1e9)=>Number.isFinite(v)&&v>=min&&v<=max;
const list=(v,max)=>Array.isArray(v)&&v.length<=max;
const text=(v,n=80)=>typeof v==='string'&&v.length<=n;
export function validateSocial(s){
 const people=s.people,social=s.social;
 if(s.person.id!=='player'||!people||Array.isArray(people)||Object.keys(people).length>8||Object.keys(people).length<1||!social)bad();
 const actor=id=>id==='player'||Object.hasOwn(people,id??'');
 for(const [id,p] of Object.entries(people)){if(!/^person_[1-8]$/.test(id)||p.id!==id||!text(p.name,40)||!list(p.interests,8)||!p.interests.every(v=>text(v,30))||!Object.hasOwn(TRAITS,p.trait)||!['old_friend','neighbor','coworker'].includes(p.role)||!['warm','reserved','playful','blunt'].includes(p.socialStyle)||!['flexible','day_evening','evening'].includes(p.availabilityProfile)||!['short','long','curly'].includes(p.style))bad();for(const color of ['skin','hair','shirt'])if(!/^#[0-9a-f]{6}$/i.test(p[color]))bad();}
 if(!list(s.contacts,8)||new Set(s.contacts).size!==s.contacts.length||!s.contacts.every(id=>Object.hasOwn(people,id)))bad();
 if(!s.relationships||Array.isArray(s.relationships)||Object.keys(s.relationships).length>SOCIAL_LIMITS.relationships)bad();
 for(const [key,r] of Object.entries(s.relationships)){if(!actor(r.a)||!actor(r.b)||r.a>=r.b||key!==[r.a,r.b].join('|')||!finite(r.familiarity,0,100)||!finite(r.lastContactMinute)||!Number.isInteger(r.contactCount)||r.contactCount<0||!['Stranger','Acquaintance','Friendly','Friend','Close Friend','Best Friend'].includes(r.peakTier)||!r.toward||Object.keys(r.toward).length!==2||!r.initiations||!r.cooldowns||!list(r.memories,24))bad();for(const id of [r.a,r.b]){const v=r.toward[id];if(!v||!finite(v.affinity,-100,100)||!finite(v.trust,0,100)||!finite(v.connection,0,100)||!finite(r.initiations[id]))bad();}for(const [id,time] of Object.entries(r.cooldowns))if(!Object.hasOwn(SOCIAL_ACTIONS,id)||!finite(time))bad();for(const m of r.memories)if(!text(m.type,40)||!actor(m.actor)||!actor(m.target)||!finite(m.minute)||!finite(m.valence,-1,1)||!finite(m.intensity,0,100)||!list(m.tags,8)||!m.tags.every(t=>text(t,30))||(m.expiry!==undefined&&!finite(m.expiry)))bad();}
 for(const field of ['rngState','eventCounter','nextId'])if(!Number.isInteger(social[field])||!finite(social[field],0,field==='rngState'?0xffffffff:1e9))bad();
 for(const field of ['nextSocialOpportunityMinute','nextDriftMinute'])if(!finite(social[field]))bad();
 if(!list(social.presences,3)||!list(social.plans,12)||!list(social.notifications,16)||!list(social.priors,16))bad();
 const presenceIds=new Set();for(const p of social.presences){if(!Object.hasOwn(people,p.personId)||presenceIds.has(p.personId)||!inside(p.x,p.y)||!['arriving','waiting','visiting','leaving'].includes(p.state)||!Number.isInteger(p.visitId)||!finite(p.until)||!finite(p.nextInitiationMinute)||!finite(p.moveClock)||!list(p.path,324)||!p.path.every(v=>list(v,2)&&v.length===2&&inside(...v))||!list(p.exit,2)||p.exit.length!==2||!inside(...p.exit))bad();presenceIds.add(p.personId);}
 const planIds=new Set();for(const p of social.plans){if(!Object.hasOwn(people,p.personId)||p.host!=='player'||!Number.isInteger(p.id)||planIds.has(p.id)||!finite(p.startMinute)||!finite(p.duration,1,240)||p.location!=='home'||!['scheduled','active','cancelled','missed','completed'].includes(p.status))bad();planIds.add(p.id);}
 for(const n of social.notifications)if(!Number.isInteger(n.id)||!finite(n.minute)||!text(n.text,200)||!text(n.type,40)||(n.personId!==null&&!Object.hasOwn(people,n.personId)))bad();
 for(const p of social.priors)if(!Object.hasOwn(people,p.source)||!actor(p.subject)||!finite(p.affinity,-5,5)||!finite(p.minute)||!finite(p.expiry)||p.hops!==1)bad();
 const ids=[...social.presences.map(p=>p.visitId),...social.plans.map(p=>p.id),...social.notifications.map(n=>n.id),social.pendingEvent?.id??0];if(social.nextId<=Math.max(0,...ids))bad();
 const positions=new Set([`${s.person.x},${s.person.y}`]);for(const p of social.presences){const key=`${p.x},${p.y}`;if(positions.has(key))bad();positions.add(key);let x=p.x,y=p.y;for(const [nx,ny] of p.path){if(Math.abs(nx-x)+Math.abs(ny-y)!==1)bad();x=nx;y=ny;}}
 const e=social.pendingEvent;if(e!==null&&(!e||!Number.isInteger(e.id)||!finite(e.expiry)||!['drop_by','text','phone_call'].includes(e.type)||!Object.hasOwn(people,e.personId)||(e.type==='drop_by'&&!presenceIds.has(e.personId))))bad();
 return s;
}
