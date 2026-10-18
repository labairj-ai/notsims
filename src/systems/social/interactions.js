import {assetDef} from '../../content/assets.js';
import {ownedActivityDefinition} from '../../content/asset-experiences.js';
import {SHARED_ACTIVITIES} from '../../content/shared-activities.js';
import {SOCIAL_ACTIONS,CHANNELS,SOCIAL_TUNING} from '../../content/social.js';
import {relationship,relationshipStatus} from './relationships.js';
import {compatibility} from './compatibility.js';
import {memory} from './memories.js';
import {addContact} from './discovery.js';
import {clamp,random,notify} from './support.js';
import {emit} from '../../core/events.js';

export const completeSocial=(s,a,events)=>resolveSocialInteraction(s,a,events);
export function repetitionMultiplier(s,r,interaction,channel){const recent=(r?.recentInteractions||[]).filter(v=>s.minutes-v.minute<SOCIAL_TUNING.repetitionWindow),same=recent.filter(v=>v.interactionId===interaction&&v.channel===channel).length,family=(SOCIAL_ACTIONS[interaction]??SHARED_ACTIVITIES[interaction])?.family;return SOCIAL_TUNING.repetition[Math.min(3,same)]*Math.max(SOCIAL_TUNING.familyFloor,1-recent.filter(v=>v.family===family&&v.interactionId!==interaction).length*.06);}
export function resolveSocialInteraction(s,a,events){a={...a,personId:a.personId??(a.actorId==='player'?a.targetId:a.actorId),interaction:a.interactionId??a.interaction};const actor=a.actorId??'player',target=a.targetId??a.personId,initiator=a.initiatedBy??actor;const p=Object.hasOwn(s.people,a.personId??'')?s.people[a.personId]:null;const active=s.activity,owned=s.ownership?.assets.find(x=>x.id===active?.assetId),outing=a.source==='owned_outing'&&active?.personId===a.personId&&active?.elapsed>=active?.total&&a.interaction==='shared_outing'&&ownedActivityDefinition(assetDef(owned?.definitionId)??{tags:[]},active.ownedActivityId)?.social;const definition=outing?SHARED_ACTIVITIES.shared_outing:Object.hasOwn(SOCIAL_ACTIONS,a.interaction??'')?SOCIAL_ACTIONS[a.interaction]:a.source==='shared'&&s.social.sharedActivity?.interactionId===a.interaction?SHARED_ACTIVITIES[a.interaction]:null;if(!p||!definition||!Object.hasOwn(CHANNELS,a.channel)||!((actor==='player'&&target===p.id)||(target==='player'&&actor===p.id))||initiator!==actor){emit(events,'ACTION_REJECTED',{kind:'social',reason:'INVALID_SOCIAL_TARGET'});return;}if(a.channel==='in_person'&&a.source!=='shared'&&!outing&&!s.social.presences.some(p=>p.personId===a.personId&&p.state==='visiting'&&Math.abs(p.x-s.person.x)+Math.abs(p.y-s.person.y)<=1)){emit(events,'ACTION_REJECTED',{kind:'social',reason:'NOT_PRESENT'});return;}const def=definition,r=relationship(s,'player',p.id,true),before=relationshipStatus(r,s.minutes),strength=CHANNELS[a.channel],novelty=repetitionMultiplier(s,r,a.interaction,a.channel);let success=true;
 const prior=r.contactCount===0?s.social.priors.filter(v=>v.subject===p.id&&v.expiry>s.minutes).reduce((v,n)=>v+n.affinity,0):0;
 const tension=r.memories.filter(m=>m.valence<0&&s.minutes-m.minute<1440).length;
 if(def.uncertain||a.interaction==='apologize'||a.source==='shared')success=random(s)<clamp(.78+compatibility(s.person,p)*.25+Math.min(r.toward[p.id].trust,50)/500-Math.min(tension,4)*.04+prior/100,.35,.98);
 const gain=success?def.affinity:a.source==='shared'?-1:0;for(const [id,v] of Object.entries(r.toward)){v.affinity=clamp(v.affinity+gain*strength*novelty*(id==='player'?1:.9+compatibility(s.person,p)), -100,100);v.trust=clamp(v.trust+(success?def.trust:0)*strength*novelty);v.connection=clamp(v.connection+18*strength);}
 r.familiarity=clamp(r.familiarity+(def.affinity<0&&novelty<.5?0:3*strength*novelty));r.lastContactMinute=s.minutes;r.contactCount++;r.initiations[initiator]++;r.recentInteractions.push({interactionId:a.interaction,family:def.family,minute:s.minutes,channel:a.channel});r.recentInteractions=r.recentInteractions.slice(-SOCIAL_TUNING.historyLimit);r.cooldowns[a.interaction]=s.minutes+def.cooldown;addContact(s,p.id,events);s.needs.social=clamp(s.needs.social+(typeof def.need==='number'?def.need:8)*strength);
 if(r.contactCount===1)memory(s,r,'first_met',actor,target,1,5,events);
 if(!success&&a.interaction==='apologize')memory(s,r,'apology_rejected',actor,target,0,3,events);
 if(!success&&a.source==='shared')memory(s,r,'awkward_hangout',actor,target,0,3,events);
 if(success&&def.memory)memory(s,r,def.memory,actor,target,def.affinity<0?-1:1,Math.abs(def.affinity),events);
 if(s.minutes-(a.previousContact??s.minutes)>4320)memory(s,r,'reconnected',actor,target,1,10,events);
 const after=relationshipStatus(r,s.minutes),rank=['stranger','Stranger','Acquaintance','Friendly','Friend','Close Friend','Best Friend'];if(rank.indexOf(after)>rank.indexOf(r.peakTier))r.peakTier=after;
 emit(events,'RELATIONSHIP_CHANGED',{personId:p.id,status:after});if(after!==before)emit(events,'RELATIONSHIP_STATUS_CHANGED',{personId:p.id,before,after});emit(events,'SOCIAL_CONTACT_COMPLETED',{personId:p.id,interaction:a.interaction,channel:a.channel,success,actorId:actor,targetId:target,initiatedBy:initiator,source:a.source??'player',novelty});notify(s,`${p.name}: ${success?def.label:a.interaction==='apologize'?'They need more time before accepting an apology.':a.source==='shared'?'That hangout felt a little awkward.':'The joke fell flat. Maybe another time.'}`,events,'contact',p.id);
}
